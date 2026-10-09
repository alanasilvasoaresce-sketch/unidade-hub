/**
 * Busca ao vivo dos arquivos das unidades no Google Drive (via connector gateway).
 * Nada é copiado nem armazenado: apenas lemos metadados e devolvemos o link do
 * arquivo no próprio Drive.
 */
import type { DocumentoId } from "@/lib/acervo";
import { escolherPasta } from "@/lib/drive.match";
import type { ArquivoDrive } from "@/lib/drive.types";

const GATEWAY = "https://connector-gateway.lovable.dev/google_drive/drive/v3";

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  modifiedTime?: string;
};

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

async function driveGet(path: string, params: Record<string, string>) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_DRIVE_API_KEY"];
  if (!lovableKey || !connectionKey) {
    throw new Error("Google Drive não está conectado a este projeto.");
  }
  const url = `${GATEWAY}${path}?${new URLSearchParams(params).toString()}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connectionKey,
    },
  });
  if (!response.ok) {
    const body = await response.text();
    console.error(`Google Drive request failed [${response.status}]: ${body}`);
    throw new Error(`Google Drive request failed [${response.status}]: ${body}`);
  }
  return (await response.json()) as { files?: DriveFile[] };
}

async function listar(q: string, pageSize = 200) {
  const data = await driveGet("/files", {
    q,
    fields: "files(id,name,mimeType,webViewLink,modifiedTime)",
    pageSize: String(pageSize),
    includeItemsFromAllDrives: "true",
    supportsAllDrives: "true",
  });
  return data.files ?? [];
}

function escaparQuery(valor: string) {
  return valor.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

/** Lista todas as pastas de unidades (subpastas de "ACERVO DAS UNIDADES"), paginando. */
async function listarPastasDeUnidades() {
  const raizes = await listar(
    "mimeType='application/vnd.google-apps.folder' and trashed=false and name='ACERVO DAS UNIDADES'",
    10,
  );
  const filtroPai = raizes.length
    ? ` and (${raizes.map((r) => `'${r.id}' in parents`).join(" or ")})`
    : "";
  const pastas: DriveFile[] = [];
  let pageToken = "";
  do {
    const params: Record<string, string> = {
      q: `mimeType='application/vnd.google-apps.folder' and trashed=false${filtroPai}`,
      fields: "nextPageToken,files(id,name,mimeType)",
      pageSize: "1000",
      includeItemsFromAllDrives: "true",
      supportsAllDrives: "true",
    };
    if (pageToken) params.pageToken = pageToken;
    const data = (await driveGet("/files", params)) as { files?: DriveFile[]; nextPageToken?: string };
    pastas.push(...(data.files ?? []));
    pageToken = data.nextPageToken ?? "";
  } while (pageToken);
  return pastas;
}

/** Encontra a pasta da unidade, tolerando diferenças de grafia (ex.: "Abatetuba" x "Abaetetuba_PA"). */
async function encontrarPastaUnidade(nome: string, uf: string) {
  return escolherPasta(nome, uf, await listarPastasDeUnidades());
}

const palavrasChave: Record<DocumentoId, string[]> = {
  contratoLocacao: ["contrato", "locacao", "aditivo"],
  cnpj: ["cnpj", "cartao cnpj", "inscricao federal"],
  alvaraFuncionamento: ["alvara", "licenciamento", "funcionamento", "sanitario"],
  avcbClcb: ["avcb", "clcb", "bombeiro", "pscip", "incendio"],
  acessibilidade: ["acessibilidade"],
  planoEmergencia: ["emergencia", "rota de fuga", "mapa de risco", "abandono"],
  iptu: ["iptu", "imobiliario", "imunidade tributaria", "predial"],
  plantaBaixa: ["planta", "arquitetonico", "layout", "croqui"],
  laboratoriosSaude: ["laboratorio", "laboratorios"],
  carteirasPorSala: ["carteira", "carteiras", "metragem", "area das salas", "m2"],
};

function maisRecente(arquivos: DriveFile[]) {
  return [...arquivos].sort(
    (a, b) => (b.modifiedTime ?? "").localeCompare(a.modifiedTime ?? ""),
  )[0];
}

function arquivoDrive(file: DriveFile): ArquivoDrive | undefined {
  if (!file.webViewLink) return undefined;
  return {
    id: file.id,
    nome: file.name,
    url: file.webViewLink,
    visualizacaoUrl: `https://drive.google.com/file/d/${file.id}/preview`,
    mimeType: file.mimeType,
  };
}

/**
 * Devolve, para cada documento exigido, o arquivo correspondente encontrado na
 * pasta da unidade no Google Drive. Sempre lido ao vivo, então trocar ou
 * adicionar um arquivo no Drive reflete no sistema sem mexer no código.
 */
export async function buscarArquivosDaUnidade(nome: string, uf: string) {
  const pasta = await encontrarPastaUnidade(nome, uf);
  if (!pasta) {
    return {
      pastaEncontrada: false,
      arquivos: {} as Record<string, ArquivoDrive>,
      outrosDocumentos: [] as ArquivoDrive[],
    };
  }

  const diretos = await listar(`'${pasta.id}' in parents and trashed=false`);
  const subpastas = diretos.filter(
    (f) => f.mimeType === "application/vnd.google-apps.folder",
  );
  const aninhados = (
    await Promise.all(
      subpastas.slice(0, 15).map((sub) => listar(`'${sub.id}' in parents and trashed=false`)),
    )
  ).flat();

  const todos = [...diretos, ...aninhados].filter(
    (f) => f.mimeType !== "application/vnd.google-apps.folder" && f.webViewLink,
  );

  const arquivos: Record<string, ArquivoDrive> = {};
  const escolhidos = new Set<string>();
  for (const [id, termos] of Object.entries(palavrasChave) as [DocumentoId, string[]][]) {
    const correspondentes = todos.filter((f) => {
      const n = normalizar(f.name);
      return termos.some((termo) => n.includes(termo));
    });
    const escolhido = maisRecente(correspondentes);
    const arquivo = escolhido ? arquivoDrive(escolhido) : undefined;
    if (arquivo) {
      arquivos[id] = arquivo;
      escolhidos.add(arquivo.id);
    }
  }

  const outrosDocumentos = todos
    .filter((file) => !escolhidos.has(file.id))
    .map(arquivoDrive)
    .filter((arquivo): arquivo is ArquivoDrive => Boolean(arquivo))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  return { pastaEncontrada: true, pasta: { id: pasta.id, nome: pasta.name }, arquivos, outrosDocumentos };
}
