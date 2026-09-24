import { Eye, ExternalLink, FileText } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  documentosExigidos,
  situacaoDe,
  type Documento,
  type DocumentoId,
  type Unidade,
} from "@/lib/acervo";
import type { ArquivoDrive } from "@/lib/drive.types";

import { StatusChip } from "./StatusChip";

const semDados: Documento = { situacao: "SEM_DADOS" };

const tiposDocumentos: { titulo: string; ids: DocumentoId[] }[] = [
  { titulo: "Contrato", ids: ["contratoLocacao"] },
  { titulo: "CNPJ", ids: ["cnpj"] },
  { titulo: "Alvará", ids: ["alvaraFuncionamento"] },
  { titulo: "AVCB", ids: ["avcbClcb"] },
  { titulo: "IPTU", ids: ["iptu"] },
  { titulo: "Plano de Emergência", ids: ["planoEmergencia"] },
  { titulo: "Planta Baixa", ids: ["plantaBaixa"] },
  {
    titulo: "Outros documentos exigidos",
    ids: ["acessibilidade", "laboratoriosSaude", "carteirasPorSala"],
  },
];

type DocumentoVisualizado = {
  titulo: string;
  nomeArquivo: string;
  url: string;
  visualizacaoUrl: string;
};

function arquivoPorUrl(url: string): ArquivoDrive | undefined {
  const id =
    url.match(/\/file\/d\/([^/]+)/)?.[1] ??
    url.match(/[?&]id=([^&]+)/)?.[1] ??
    url.match(/\/d\/([^/]+)/)?.[1];
  if (!id) return undefined;
  return {
    id,
    nome: "Documento",
    url,
    visualizacaoUrl: `https://drive.google.com/file/d/${id}/preview`,
    mimeType: "application/pdf",
  };
}

function prepararVisualizacao(
  titulo: string,
  arquivo: ArquivoDrive | undefined,
  arquivoUrl: string | undefined,
): DocumentoVisualizado | undefined {
  const fonte = arquivo ?? (arquivoUrl ? arquivoPorUrl(arquivoUrl) : undefined);
  if (!fonte) return undefined;
  return {
    titulo,
    nomeArquivo: fonte.nome,
    url: fonte.url,
    visualizacaoUrl: fonte.visualizacaoUrl,
  };
}

function DocumentoLinha({
  titulo,
  nome,
  item,
  arquivo,
  onVisualizar,
}: {
  titulo: string;
  nome: string;
  item: Documento;
  arquivo?: ArquivoDrive | undefined;
  onVisualizar: (doc: DocumentoVisualizado) => void;
}) {
  const arquivoUrl = arquivo?.url ?? item.arquivoUrl;
  const visualizacao = prepararVisualizacao(titulo, arquivo, arquivoUrl);

  return (
    <div className="flex flex-col gap-3 rounded-md border border-line bg-surface px-4 py-3 sm:flex-row sm:items-center">
      <div className="grid size-10 shrink-0 place-items-center rounded-md bg-background text-brand">
        <FileText className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-bold tracking-tight text-foreground">{titulo}</p>
        <p className="mt-0.5 font-sans text-xs text-muted">{nome}</p>
        {arquivo && <p className="mt-1 truncate font-mono text-[10px] text-faint">{arquivo.nome}</p>}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {visualizacao && (
          <Button type="button" variant="outline" size="sm" onClick={() => onVisualizar(visualizacao)}>
            <Eye />
            Visualizar documento
          </Button>
        )}
        <StatusChip situacao={item.situacao} />
      </div>
    </div>
  );
}

export function DocumentosDaUnidade({
  unidade,
  arquivosDrive,
  outrosDocumentos = [],
}: {
  unidade?: Unidade | undefined;
  arquivosDrive?: Record<string, ArquivoDrive> | undefined;
  outrosDocumentos?: ArquivoDrive[] | undefined;
}) {
  const [selecionado, setSelecionado] = useState<DocumentoVisualizado | null>(null);
  const nomes = useMemo(
    () => Object.fromEntries(documentosExigidos.map((doc) => [doc.id, doc.nome])) as Record<DocumentoId, string>,
    [],
  );

  return (
    <>
      <div className="space-y-5">
        {tiposDocumentos.map((grupo) => (
          <section key={grupo.titulo} className="space-y-2">
            <h3 className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
              {grupo.titulo}
            </h3>
            <div className="space-y-2">
              {grupo.ids.map((id) => {
                const item = unidade ? situacaoDe(unidade, id) : semDados;
                return (
                  <DocumentoLinha
                    key={id}
                    titulo={grupo.ids.length === 1 ? grupo.titulo : nomes[id]}
                    nome={nomes[id]}
                    item={item}
                    arquivo={arquivosDrive?.[id]}
                    onVisualizar={setSelecionado}
                  />
                );
              })}
            </div>
          </section>
        ))}

        <section className="space-y-2">
          <h3 className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
            Outros documentos existentes
          </h3>
          <div className="space-y-2">
            {outrosDocumentos.length > 0 ? (
              outrosDocumentos.map((arquivo) => (
                <DocumentoLinha
                  key={arquivo.id}
                  titulo="Documento adicional"
                  nome={arquivo.nome}
                  item={semDados}
                  arquivo={arquivo}
                  onVisualizar={setSelecionado}
                />
              ))
            ) : (
              <div className="rounded-md border border-dashed border-line bg-background/60 px-4 py-5 font-sans text-sm text-muted">
                Nenhum documento adicional encontrado na pasta desta unidade.
              </div>
            )}
          </div>
        </section>
      </div>

      <Dialog open={Boolean(selecionado)} onOpenChange={(aberto) => !aberto && setSelecionado(null)}>
        <DialogContent className="flex h-[min(820px,calc(100vh-2rem))] max-w-[min(1180px,calc(100vw-2rem))] flex-col gap-0 overflow-hidden p-0">
          {selecionado && (
            <>
              <DialogHeader className="border-b border-line px-5 py-4 pr-12">
                <DialogTitle className="font-display text-lg font-bold tracking-tight text-foreground">
                  {selecionado.titulo}
                </DialogTitle>
                <DialogDescription className="truncate font-mono text-[11px] text-faint">
                  {selecionado.nomeArquivo}
                </DialogDescription>
              </DialogHeader>
              <div className="border-b border-line bg-secondary px-5 py-2 font-sans text-xs text-secondary-foreground">
                A prévia usa a permissão atual do Google Drive. Se necessário, entre na conta Google que possui acesso ao arquivo.
              </div>
              <div className="min-h-0 flex-1 bg-surface">
                <iframe
                  src={selecionado.visualizacaoUrl}
                  title={`Visualização de ${selecionado.nomeArquivo}`}
                  className="size-full border-0"
                  allow="fullscreen"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface px-5 py-3">
                <p className="font-sans text-xs text-muted">
                  Se a prévia não carregar, verifique a permissão de acesso do arquivo no Drive.
                </p>
                <Button type="button" variant="outline" size="sm" asChild>
                  <a href={selecionado.url} target="_blank" rel="noreferrer">
                    <ExternalLink />
                    Abrir arquivo original
                  </a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}