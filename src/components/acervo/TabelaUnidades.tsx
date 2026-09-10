import { Link } from "@tanstack/react-router";

import { progressoDocumentos, type Unidade } from "@/lib/acervo";
import { StatusGeralChip } from "./StatusChip";

const th =
  "px-4 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted";

export function TabelaUnidades({ unidades }: { unidades: Unidade[] }) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-foreground">Unidades</h2>
          <p className="mt-0.5 font-sans text-xs text-muted">Progresso de documentos por unidade</p>
        </div>
        <span className="font-mono text-[11px] text-faint">
          {unidades.length} {unidades.length === 1 ? "unidade" : "unidades"} carregadas
        </span>
      </div>
      <div className="overflow-hidden rounded-lg border border-line bg-surface">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-line">
              <th className={th}>Unidade</th>
              <th className={th}>UF</th>
              <th className={th}>Status geral</th>
              <th className={th}>Classificação</th>
              <th className={`${th} text-right`}>Progresso</th>
            </tr>
          </thead>
          <tbody className="font-sans text-sm">
            {unidades.map((unidade) => {
              const progresso = progressoDocumentos(unidade);
              return (
                <tr key={unidade.id} className="border-b border-line/70 hover:bg-background/60">
                  <td className="px-4 py-2.5">
                    <Link
                      to="/unidades/$id"
                      params={{ id: unidade.id }}
                      className="font-medium text-foreground hover:text-brand"
                    >
                      {unidade.nome}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted">{unidade.uf}</td>
                  <td className="px-4 py-2.5">
                    <StatusGeralChip status={unidade.statusGeral} />
                  </td>
                  <td className="px-4 py-2.5 text-muted">{unidade.classificacao ?? "—"}</td>
                  <td className="px-4 py-2.5">
                    <div className="ml-auto flex w-32 items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-line/60">
                        <div
                          className="h-1.5 rounded-full bg-brand"
                          style={{ width: `${progresso.percentual}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-faint">
                        {progresso.ok}/{progresso.total}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {unidades.length === 0 && (
          <div className="flex items-center gap-2.5 border-t border-line bg-background/50 px-4 py-3.5">
            <span className="size-1.5 rounded-full bg-brand" />
            <p className="font-sans text-xs text-muted">
              Sem unidades carregadas. Os dados serão importados da planilha Excel e dos PDFs
              organizados por unidade.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
