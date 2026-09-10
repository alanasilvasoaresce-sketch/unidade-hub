/**
 * Estrutura de dados do Acervo das Unidades.
 *
 * Ainda não há dados reais: `unidades` e `pendenciasCriticas` estão vazios de
 * propósito. Ao importar a planilha Excel e os PDFs organizados por unidade,
 * basta preencher estes arrays (ou trocar a fonte por um backend) sem alterar
 * as telas.
 */

export type SituacaoDocumento = "OK" | "FALTA" | "PENDENTE" | "SEM_DADOS";

export const rotuloSituacao: Record<SituacaoDocumento, string> = {
  OK: "OK",
  FALTA: "Falta",
  PENDENTE: "Pendente",
  SEM_DADOS: "Sem dados",
};

/** Chaves dos documentos exigidos de cada unidade. */
export type DocumentoId =
  | "contratoLocacao"
  | "cnpj"
  | "alvaraFuncionamento"
  | "avcbClcb"
  | "acessibilidade"
  | "planoEmergencia"
  | "iptu"
  | "plantaBaixa"
  | "laboratoriosSaude"
  | "carteirasPorSala";

export const documentosExigidos: { id: DocumentoId; nome: string }[] = [
  { id: "contratoLocacao", nome: "Contrato de Locação Vigente" },
  { id: "cnpj", nome: "CNPJ" },
  { id: "alvaraFuncionamento", nome: "Alvará de Funcionamento da Prefeitura" },
  { id: "avcbClcb", nome: "AVCB / CLCB" },
  { id: "acessibilidade", nome: "Plano e Laudo de Acessibilidade" },
  { id: "planoEmergencia", nome: "Plano de Emergência com Rota de Fuga" },
  { id: "iptu", nome: "IPTU" },
  { id: "plantaBaixa", nome: "Planta Baixa dos Espaços Locados" },
  { id: "laboratoriosSaude", nome: "Arquivo Excel dos Laboratórios de Saúde" },
  { id: "carteirasPorSala", nome: "Quantidade de Carteiras por Sala e Área em m²" },
];

export type Documento = {
  situacao: SituacaoDocumento;
  /** URL do arquivo (PDF, Excel...). Quando presente, exibe "Visualizar documento". */
  arquivoUrl?: string;
  observacao?: string;
};

export type StatusGeral = "REGULARIZADA" | "PARCIAL" | "SEM_DOCUMENTOS" | "SEM_DADOS";

export const rotuloStatusGeral: Record<StatusGeral, string> = {
  REGULARIZADA: "Regularizada",
  PARCIAL: "Parcial",
  SEM_DOCUMENTOS: "Sem documentos",
  SEM_DADOS: "Sem dados",
};

export type Unidade = {
  id: string;
  nome: string;
  uf: string;
  classificacao?: string | undefined;
  statusGeral: StatusGeral;
  documentos: Partial<Record<DocumentoId, Documento>>;
};

export type PendenciaCritica = {
  id: string;
  unidadeId?: string;
  unidade: string;
  uf: string;
  documento: string;
  motivo: string;
  impacto: string;
};

import unidadesJson from "@/data/unidades.json";
import pendenciasJson from "@/data/pendencias.json";
/**
 * Mapa de arquivos por unidade: { "<unidadeId>": { "<documentoId>": "url" } }.
 * Preenchido ao subir os PDFs; habilita o botão "Visualizar documento".
 */
import arquivosJson from "@/data/arquivos.json";

const arquivos = arquivosJson as Record<string, Partial<Record<DocumentoId, string>>>;

/** Unidades importadas da planilha Excel. */
export const unidades: Unidade[] = (unidadesJson as unknown as Unidade[]).map((u) => ({
  ...u,
  classificacao: u.classificacao ?? undefined,
  documentos: Object.fromEntries(
    Object.entries(u.documentos).map(([id, doc]) => [
      id,
      { ...doc, arquivoUrl: arquivos[u.id]?.[id as DocumentoId] ?? doc?.arquivoUrl },
    ]),
  ) as Unidade["documentos"],
}));

/** Pendências críticas importadas da planilha Excel. */
export const pendenciasCriticas: PendenciaCritica[] =
  pendenciasJson as unknown as PendenciaCritica[];


export const ufs = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB",
  "PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

export function situacaoDe(unidade: Unidade, id: DocumentoId): Documento {
  return unidade.documentos[id] ?? { situacao: "SEM_DADOS" };
}

export function progressoDocumentos(unidade: Unidade) {
  const total = documentosExigidos.length;
  const ok = documentosExigidos.filter((d) => situacaoDe(unidade, d.id).situacao === "OK").length;
  return { ok, total, percentual: total === 0 ? 0 : Math.round((ok / total) * 100) };
}

export function filtrarUnidades(lista: Unidade[], busca: string, uf: string) {
  const termo = busca.trim().toLowerCase();
  return lista.filter(
    (u) =>
      (termo === "" || u.nome.toLowerCase().includes(termo)) &&
      (uf === "" || u.uf === uf),
  );
}

export function resumo(lista: Unidade[]) {
  return {
    total: lista.length,
    regularizadas: lista.filter((u) => u.statusGeral === "REGULARIZADA").length,
    parciais: lista.filter((u) => u.statusGeral === "PARCIAL").length,
    semDocumentos: lista.filter((u) => u.statusGeral === "SEM_DOCUMENTOS").length,
  };
}

export function contagemPorSituacao(lista: Unidade[]) {
  const contagem: Record<SituacaoDocumento, number> = {
    OK: 0,
    FALTA: 0,
    PENDENTE: 0,
    SEM_DADOS: 0,
  };
  for (const unidade of lista) {
    for (const doc of documentosExigidos) {
      contagem[situacaoDe(unidade, doc.id).situacao] += 1;
    }
  }
  return contagem;
}

export function contagemPorDocumento(lista: Unidade[]) {
  return documentosExigidos.map((doc) => {
    const ok = lista.filter((u) => situacaoDe(u, doc.id).situacao === "OK").length;
    const falta = lista.filter((u) => situacaoDe(u, doc.id).situacao === "FALTA").length;
    const pendente = lista.filter((u) => situacaoDe(u, doc.id).situacao === "PENDENTE").length;
    return { ...doc, ok, falta, pendente };
  });
}
