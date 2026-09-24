import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { FiltroBar } from "@/components/acervo/FiltroBar";
import { Indicadores } from "@/components/acervo/Indicadores";
import { Pagina, UnidadeHubShell } from "@/components/acervo/SiteChrome";
import { LegendaSituacoes } from "@/components/acervo/StatusChip";
import { TabelaUnidades } from "@/components/acervo/TabelaUnidades";
import { filtrarUnidades, resumo } from "@/lib/acervo";
import { useAcervo } from "@/lib/useAcervo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Acervo das Unidades — consulta documental por unidade" },
      {
        name: "description",
        content:
          "Consulte a documentação de cada unidade: contrato, alvará, AVCB, acessibilidade e mais, com status OK, falta ou pendente.",
      },
      { property: "og:title", content: "Acervo das Unidades" },
      {
        property: "og:description",
        content: "Consulta de documentos e status de regularidade por unidade.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const [busca, setBusca] = useState("");
  const [uf, setUf] = useState("");
  const acervo = useAcervo();
  const pendenciasCriticas = acervo.pendencias;

  const lista = useMemo(
    () => filtrarUnidades(acervo.unidades, busca, uf),
    [acervo.unidades, busca, uf],
  );
  const dados = resumo(lista);

  return (
    <UnidadeHubShell
      titulo="Acervo das Unidades"
      descricao="Aqui você acompanha o status das unidades, pendências e documentos."
    >
      <Pagina>
        <p className="font-mono text-[10px] uppercase tracking-wide text-faint">
          {acervo.carregando
            ? "Lendo os dados da planilha do Google Sheets…"
            : acervo.origem === "planilha"
              ? "Dados lidos ao vivo da planilha do Google Sheets"
              : "Planilha indisponível agora · exibindo os dados importados anteriormente"}
        </p>
        <FiltroBar
          busca={busca}
          uf={uf}
          onBusca={setBusca}
          onUf={setUf}
          onLimpar={() => {
            setBusca("");
            setUf("");
          }}
        />

        <Indicadores
          itens={[
            {
              rotulo: "Total de unidades",
              valor: dados.total || "—",
              nota: "Aguardando dados da planilha",
            },
            {
              rotulo: "Regularizadas",
              valor: dados.regularizadas || "—",
              nota: "Todos os documentos OK",
            },
            {
              rotulo: "Parciais",
              valor: dados.parciais || "—",
              nota: "Pelo menos um documento pendente",
            },
            {
              rotulo: "Sem documentos",
              valor: dados.semDocumentos || "—",
              nota: "Nenhum arquivo cadastrado",
            },
          ]}
        />

        <TabelaUnidades unidades={lista} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <section className="rounded-lg border border-line bg-surface shadow-sm lg:col-span-7">
            <div className="border-b border-line px-5 py-4">
              <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
                Detalhe da unidade
              </h2>
              <p className="mt-0.5 font-sans text-xs text-muted">
                Situação de cada documento · 10 itens por unidade
              </p>
            </div>
            <div className="px-5 py-4">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-md border border-line bg-background/60 font-display text-sm font-bold text-faint">
                  —
                </div>
                <div className="flex-1">
                  <div className="font-sans text-sm font-medium text-foreground">
                    Selecionar uma unidade
                  </div>
                  <div className="font-mono text-[11px] text-faint">UF · —</div>
                </div>
                <span className="rounded-full border border-line bg-background/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-faint">
                  Sem dados
                </span>
              </div>
              <div className="grid place-items-center rounded-md border border-dashed border-line bg-background/60 px-4 py-10 text-center">
                <p className="max-w-[32ch] font-sans text-sm text-muted">
                  Clique em uma cidade na tabela para abrir a página da unidade e visualizar os documentos dentro do Unidade Hub.
                </p>
              </div>
            </div>
          </section>

          <section className="flex flex-col rounded-lg border border-line bg-surface shadow-sm lg:col-span-5">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
                Pendências críticas
              </h2>
              <span className="rounded-full bg-critical/10 px-2.5 py-1 font-mono text-[10px] font-medium text-critical">
                {pendenciasCriticas.length}
              </span>
            </div>
            <div className="flex-1 px-5 py-4">
              <div className="grid place-items-center rounded-md border border-dashed border-line px-4 py-10 text-center">
                <span className="mb-3 size-2 rounded-full bg-critical/40" />
                <p className="max-w-[26ch] text-balance font-sans text-sm text-muted">
                  {pendenciasCriticas.length === 0
                    ? "Nenhuma pendência crítica registrada."
                    : `${pendenciasCriticas.length} pendências críticas registradas.`}
                </p>
                <p className="mt-1.5 max-w-[30ch] font-sans text-xs text-faint">
                  Unidade · UF · documento · motivo · impacto
                </p>
                <Link
                  to="/pendencias"
                  className="mt-4 font-mono text-[11px] uppercase tracking-wide text-brand hover:underline"
                >
                  Abrir pendências críticas
                </Link>
              </div>
            </div>
            <div className="border-t border-line px-5 py-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                Situações possíveis
              </span>
              <div className="mt-3">
                <LegendaSituacoes />
              </div>
            </div>
          </section>
        </div>
      </Pagina>
    </UnidadeHubShell>
  );
}
