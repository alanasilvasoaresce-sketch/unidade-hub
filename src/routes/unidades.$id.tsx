import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { DocumentosDaUnidade } from "@/components/acervo/DocumentosDaUnidade";
import { Pagina, UnidadeHubShell } from "@/components/acervo/SiteChrome";
import { LegendaSituacoes, StatusGeralChip } from "@/components/acervo/StatusChip";
import { progressoDocumentos } from "@/lib/acervo";
import { obterArquivosDaUnidade } from "@/lib/drive.functions";
import type { ArquivoDrive } from "@/lib/drive.types";
import { useAcervo } from "@/lib/useAcervo";

type ResultadoDrive = {
  pastaEncontrada: boolean;
  pasta?: { id: string; nome: string } | undefined;
  arquivos: Record<string, ArquivoDrive>;
  outrosDocumentos: ArquivoDrive[];
};

export const Route = createFileRoute("/unidades/$id")({
  head: () => ({
    meta: [
      { title: "Detalhe da unidade — Acervo das Unidades" },
      {
        name: "description",
        content:
          "Documentação completa da unidade: contrato, CNPJ, alvará, AVCB/CLCB, acessibilidade, emergência, IPTU e plantas.",
      },
      { property: "og:title", content: "Detalhe da unidade — Acervo das Unidades" },
      {
        property: "og:description",
        content: "Situação de cada documento da unidade, com acesso aos arquivos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DetalheUnidade,
});

function DetalheUnidade() {
  const { id } = Route.useParams();
  const { unidades } = useAcervo();
  const unidade = unidades.find((u) => u.id === id);
  const progresso = unidade ? progressoDocumentos(unidade) : null;

  const buscarArquivos = useServerFn(obterArquivosDaUnidade);
  const drive = useQuery<ResultadoDrive>({
    queryKey: ["drive", unidade?.nome, unidade?.uf],
    enabled: Boolean(unidade),
    staleTime: 0,
    queryFn: () => {
      if (!unidade) {
        return Promise.resolve({
          pastaEncontrada: false,
          arquivos: {} as Record<string, ArquivoDrive>,
          outrosDocumentos: [] as ArquivoDrive[],
        });
      }
      return buscarArquivos({ data: { nome: unidade.nome, uf: unidade.uf } });
    },
  });

  return (
    <UnidadeHubShell
        titulo={unidade?.nome ?? "Unidade não encontrada"}
        descricao={
          unidade
            ? "Situação de cada documento da unidade, com visualização integrada dos arquivos encontrados na pasta do Google Drive."
            : "Nenhuma unidade cadastrada com este identificador. A base será preenchida com os dados da planilha."
        }
      >
      <Pagina>
        <Link to="/" className="font-mono text-[11px] uppercase tracking-wide text-brand hover:underline">
          ← Voltar para as unidades
        </Link>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <section className="rounded-lg border border-line bg-surface shadow-sm lg:col-span-8">
            <div className="border-b border-line px-5 py-4">
              <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
                Documentos por tipo
              </h2>
              <p className="mt-0.5 font-sans text-xs text-muted">
                Situação de cada documento · 10 itens por unidade
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-faint">
                {drive.isPending && unidade
                  ? "Procurando arquivos no Google Drive…"
                  : drive.isError
                    ? "Não foi possível consultar o Google Drive agora"
                    : drive.data?.pastaEncontrada
                      ? `Arquivos lidos direto do Google Drive · pasta ${drive.data.pasta?.nome}`
                      : unidade
                        ? "Nenhuma pasta desta unidade encontrada no Google Drive"
                        : ""}
              </p>
            </div>
            <div className="px-5 py-4">
              <DocumentosDaUnidade
                unidade={unidade}
                arquivosDrive={drive.data?.arquivos}
                outrosDocumentos={drive.data?.outrosDocumentos}
              />
              <div className="mt-4">
                <LegendaSituacoes />
              </div>
            </div>
          </section>


          <section className="space-y-5 lg:col-span-4">
            <div className="rounded-lg border border-line bg-surface px-5 py-4 shadow-sm">
              <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
                Identificação
              </h2>
              <dl className="mt-3 space-y-2.5 font-sans text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted">Nome da unidade</dt>
                  <dd className="text-right font-medium text-foreground">{unidade?.nome ?? "—"}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted">UF</dt>
                  <dd className="font-mono text-xs text-foreground">{unidade?.uf ?? "—"}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted">Classificação</dt>
                  <dd className="text-foreground">{unidade?.classificacao ?? "—"}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted">Status geral</dt>
                  <dd>
                    <StatusGeralChip status={unidade?.statusGeral ?? "SEM_DADOS"} />
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border border-line bg-surface px-5 py-4 shadow-sm">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                Progresso documental
              </span>
              <div className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground">
                {progresso ? `${progresso.ok}/${progresso.total}` : "—"}
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-line/60">
                <div
                  className="h-1.5 rounded-full bg-brand"
                  style={{ width: `${progresso?.percentual ?? 0}%` }}
                />
              </div>
            </div>
          </section>
        </div>
      </Pagina>
    </UnidadeHubShell>
  );
}
