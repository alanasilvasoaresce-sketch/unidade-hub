import { createFileRoute } from "@tanstack/react-router";

import { CabecalhoInterno, Pagina, RodapeAcervo } from "@/components/acervo/SiteChrome";
import { TabelaPendencias } from "@/components/acervo/TabelaPendencias";
import { useAcervo } from "@/lib/useAcervo";

export const Route = createFileRoute("/pendencias")({
  head: () => ({
    meta: [
      { title: "Pendências críticas — Acervo das Unidades" },
      {
        name: "description",
        content:
          "Documentos em falta ou vencidos com impacto operacional, por unidade e UF, com motivo e impacto.",
      },
      { property: "og:title", content: "Pendências críticas — Acervo das Unidades" },
      {
        property: "og:description",
        content: "Unidade, UF, documento, motivo e impacto das pendências críticas.",
      },
    ],
  }),
  component: Pendencias,
});

function Pendencias() {
  const { pendencias: pendenciasCriticas } = useAcervo();
  return (
    <>
      <CabecalhoInterno
        titulo="Pendências críticas"
        descricao="Documentos cuja ausência gera risco regulatório ou operacional. Cada registro traz a unidade, a UF, o documento, o motivo e o impacto."
      />
      <Pagina>
        <div className="flex items-end justify-between">
          <h2 className="font-display text-lg font-bold tracking-tight text-foreground">Registros</h2>
          <span className="rounded-full bg-critical/10 px-2.5 py-1 font-mono text-[10px] font-medium text-critical">
            {pendenciasCriticas.length}
          </span>
        </div>
        <TabelaPendencias pendencias={pendenciasCriticas} />
      </Pagina>
      <RodapeAcervo />
    </>
  );
}
