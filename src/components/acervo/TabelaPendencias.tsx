import type { PendenciaCritica } from "@/lib/acervo";

const th =
  "px-4 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted";

export function TabelaPendencias({ pendencias }: { pendencias: PendenciaCritica[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-line">
            <th className={th}>Unidade</th>
            <th className={th}>UF</th>
            <th className={th}>Documento</th>
            <th className={th}>Motivo</th>
            <th className={th}>Impacto</th>
          </tr>
        </thead>
        <tbody className="font-sans text-sm">
          {pendencias.map((p) => (
            <tr key={p.id} className="border-b border-line/70 align-top hover:bg-background/60">
              <td className="px-4 py-2.5 font-medium text-foreground">{p.unidade}</td>
              <td className="px-4 py-2.5 font-mono text-xs text-muted">{p.uf}</td>
              <td className="px-4 py-2.5 text-muted">{p.documento}</td>
              <td className="px-4 py-2.5 text-muted">{p.motivo}</td>
              <td className="px-4 py-2.5 text-critical">{p.impacto}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {pendencias.length === 0 && (
        <div className="grid place-items-center border-t border-line px-4 py-12 text-center">
          <span className="mb-3 size-2 rounded-full bg-critical/40" />
          <p className="max-w-[32ch] text-balance font-sans text-sm text-muted">
            Nenhuma pendência crítica registrada.
          </p>
          <p className="mt-1.5 max-w-[40ch] font-sans text-xs text-faint">
            Unidade · UF · documento · motivo · impacto
          </p>
        </div>
      )}
    </div>
  );
}
