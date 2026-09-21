/**
 * Leitura ao vivo da planilha do Google Sheets (via connector gateway).
 * Nada é copiado: a cada consulta lemos os valores atuais da planilha.
 */
import {
  documentosExigidos,
  type DocumentoId,
  type PendenciaCritica,
  type SituacaoDocumento,
  type StatusGeral,
  type Unidade,
} from "@/lib/acervo";

const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";

/** Planilha "acervo das unidades 2.0" no Google Sheets. */
export const PLANILHA_ID =
  process.env["ACERVO_SPREADSHEET_ID"] ?? "1as6M6zz3k3Xp9CcSZHK-TCFlkVI7m5tnuS0EBFO0EzE";

const ABA_UNIDADES = "Planilha1";
const ABA_PENDENCIAS = "Planilha2";

/** Ordem das colunas de documentos na planilha (colunas C a L). */
const colunasDocumentos: DocumentoId[] = [
  "contratoLocacao",
  "cnpj",
  "alvaraFuncionamento",
  "avcbClcb",
  "acessibilidade",
  "planoEmergencia",
  "iptu",
  "plantaBaixa",
  "laboratoriosSaude",
  "carteirasPorSala",
];

function limpar(valor: unknown) {
  return typeof valor === "string" ? valor.replace(/\s+/g, " ").trim() : "";
}

function slug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function situacaoDeTexto(valor: string): SituacaoDocumento {
  const texto = slug(valor);
  if (texto === "") return "SEM_DADOS";
  if (texto.startsWith("ok")) return "OK";
  if (texto.startsWith("falta")) return "FALTA";
  if (texto.startsWith("pendente") || texto.startsWith("em-analise")) return "PENDENTE";
  return "SEM_DADOS";
}

function statusGeralDe(documentos: Unidade["documentos"]): StatusGeral {
  const situacoes = documentosExigidos.map(
    (d) => documentos[d.id]?.situacao ?? ("SEM_DADOS" as SituacaoDocumento),
  );
  const ok = situacoes.filter((s) => s === "OK").length;
  if (ok === documentosExigidos.length) return "REGULARIZADA";
  if (situacoes.every((s) => s === "SEM_DADOS")) return "SEM_DADOS";
  if (ok === 0) return "SEM_DOCUMENTOS";
  return "PARCIAL";
}

function tituloDe(nome: string) {
  return nome
    .toLocaleLowerCase("pt-BR")
    .split(" ")
    .map((parte) =>
      parte.length <= 2 && ["de", "da", "do", "e"].includes(parte)
        ? parte
        : parte.charAt(0).toLocaleUpperCase("pt-BR") + parte.slice(1),
    )
    .join(" ");
}

type BatchGet = { valueRanges?: { values?: unknown[][] }[] };

async function lerPlanilha(): Promise<BatchGet> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_SHEETS_API_KEY"];
  if (!lovableKey || !connectionKey) {
    throw new Error("Google Sheets não está conectado a este projeto.");
  }
  const params = new URLSearchParams({ valueRenderOption: "FORMATTED_VALUE" });
  params.append("ranges", `${ABA_UNIDADES}!A4:N1000`);
  params.append("ranges", `${ABA_PENDENCIAS}!A3:E200`);
  const url = `${GATEWAY}/spreadsheets/${PLANILHA_ID}/values:batchGet?${params.toString()}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connectionKey,
    },
  });
  if (!response.ok) {
    const body = await response.text();
    console.error(`Google Sheets request failed [${response.status}]: ${body}`);
    throw new Error(`Google Sheets request failed [${response.status}]: ${body}`);
  }
  return (await response.json()) as BatchGet;
}

export type AcervoDaPlanilha = {
  unidades: Unidade[];
  pendencias: PendenciaCritica[];
};

export async function buscarAcervoDaPlanilha(): Promise<AcervoDaPlanilha> {
  const dados = await lerPlanilha();
  const linhasUnidades = dados.valueRanges?.[0]?.values ?? [];
  const linhasPendencias = dados.valueRanges?.[1]?.values ?? [];

  const unidades: Unidade[] = [];
  const vistos = new Set<string>();

  for (const linha of linhasUnidades) {
    const nomeBruto = limpar(linha[0]);
    const uf = limpar(linha[1]).toUpperCase().slice(0, 2);
    if (nomeBruto === "" || uf.length !== 2) continue;

    const documentos: Unidade["documentos"] = {};
    colunasDocumentos.forEach((id, indice) => {
      documentos[id] = { situacao: situacaoDeTexto(limpar(linha[2 + indice])) };
    });

    const classificacao = limpar(linha[13]);
    const base = `${slug(nomeBruto)}-${uf.toLowerCase()}`;
    let id = base;
    let sufixo = 2;
    while (vistos.has(id)) id = `${base}-${sufixo++}`;
    vistos.add(id);

    unidades.push({
      id,
      nome: tituloDe(nomeBruto),
      uf,
      classificacao: classificacao === "" ? undefined : classificacao,
      statusGeral: statusGeralDe(documentos),
      documentos,
    });
  }

  const pendencias: PendenciaCritica[] = [];
  linhasPendencias.forEach((linha, indice) => {
    const unidadeNome = limpar(linha[0]);
    const documento = limpar(linha[2]);
    if (unidadeNome === "" || documento === "") return;
    const uf = limpar(linha[1]).toUpperCase().slice(0, 2);
    const correspondente = unidades.find(
      (u) => slug(u.nome) === slug(unidadeNome) && (uf === "" || u.uf === uf),
    );
    pendencias.push({
      id: `pendencia-${indice + 1}`,
      ...(correspondente ? { unidadeId: correspondente.id } : {}),
      unidade: tituloDe(unidadeNome),
      uf: uf || (correspondente?.uf ?? ""),
      documento,
      motivo: limpar(linha[3]),
      impacto: limpar(linha[4]),
    });
  });

  return { unidades, pendencias };
}
