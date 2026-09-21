import { createFileRoute } from "@tanstack/react-router";

import { Indicadores } from "@/components/acervo/Indicadores";
import { CabecalhoInterno, Pagina, RodapeAcervo } from "@/components/acervo/SiteChrome";
import {
  contagemPorDocumento,
  contagemPorSituacao,
  documentosExigidos,
  resumo,
} from "@/lib/acervo";
import { useAcervo } from "@/lib/useAcervo";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard documental — Acervo das Unidades" },
      {
        name: "description",
        content:
          "Indicadores gerais da documentação das unidades: regularidade, pendências e cobertura por tipo de documento.",
      },
      { property: "og:title", content: "Dashboard documental — Acervo das Unidades" },
      {
        property: "og:description",
        content: "Indicadores gerais de regularidade documental das unidades.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const acervo = useAcervo();
  const unidades = acervo.unidades;
  const pendenciasCriticas = acervo.pendencias;
  const dados = resumo(unidades);
  const situacoes = contagemPorSituacao(unidades);
  const porDocumento = contagemPorDocumento(unidades);
  const totalItens = unidades.length * documentosExigidos.length;
  const cobertura = totalItens === 0 ? 0 : Math.round((situacoes.OK / totalItens) * 100);

  return (
    <>
      <CabecalhoInterno
        titulo="Dashboard documental"
        descricao="Indicadores gerais do acervo. Os números são calculados automaticamente a partir das unidades cadastradas."
      />
      <Pagina>
        <Indicadores
          itens={[
            { rotulo: "Total de unidades", valor: dados.total || "—", nota: "Base cadastrada" },
            {
              rotulo: "Índice de regularidade",
              valor: totalItens === 0 ? "—" : `${cobertura}%`,
              nota: "Documentos com situação OK",
            },
            {
              rotulo: "Documentos pendentes",
              valor: situacoes.PENDENTE || "—",
              nota: "Em análise ou renovação",
            },
            {
              rotulo: "Pendências críticas",
              valor: pendenciasCriticas.length || "—",
              nota: "Impacto operacional",
            },
          ]}
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <section className="rounded-lg border border-line bg-surface lg:col-span-5">
            <div className="border-b border-line px-5 py-4">
              <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
                Situação das unidades
              </h2>
              <p className="mt-0.5 font-sans text-xs text-muted">Distribuição por status geral</p>
            </div>
            <div className="space-y-3 px-5 py-4">
              {[
                { rotulo: "Regularizadas", valor: dados.regularizadas, cor: "bg-ok" },
                { rotulo: "Parciais", valor: dados.parciais, cor: "bg-partial" },
                { rotulo: "Sem documentos", valor: dados.semDocumentos, cor: "bg-critical" },
              ].map((linha) => {
                const pct = dados.total === 0 ? 0 : Math.round((linha.valor / dados.total) * 100);
                return (
                  <div key={linha.rotulo}>
                    <div className="flex items-center justify-between font-sans text-sm">
                      <span className="text-muted">{linha.rotulo}</span>
                      <span className="font-mono text-xs text-faint">
                        {linha.valor} · {pct}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-line/60">
                      <div className={`h-1.5 rounded-full ${linha.cor}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              {dados.total === 0 && (
                <p className="pt-2 font-sans text-xs text-faint">
                  Sem unidades cadastradas — os gráficos são preenchidos após a importação.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-line bg-surface lg:col-span-7">
            <div className="border-b border-line px-5 py-4">
              <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
                Cobertura por documento
              </h2>
              <p className="mt-0.5 font-sans text-xs text-muted">
                Quantidade de unidades em cada situação
              </p>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-5 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                    Documento
                  </th>
                  <th className="px-3 py-2.5 text-right font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                    OK
                  </th>
                  <th className="px-3 py-2.5 text-right font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                    Pendente
                  </th>
                  <th className="px-5 py-2.5 text-right font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                    Falta
                  </th>
                </tr>
              </thead>
              <tbody className="font-sans text-sm">
                {porDocumento.map((doc) => (
                  <tr key={doc.id} className="border-b border-line/70 last:border-0">
                    <td className="px-5 py-2.5 text-muted">{doc.nome}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs text-ok">
                      {dados.total === 0 ? "—" : doc.ok}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs text-partial">
                      {dados.total === 0 ? "—" : doc.pendente}
                    </td>
                    <td className="px-5 py-2.5 text-right font-mono text-xs text-critical">
                      {dados.total === 0 ? "—" : doc.falta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </Pagina>
      <RodapeAcervo />
    </>
  );
}
