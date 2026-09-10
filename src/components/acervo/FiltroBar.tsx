import { ufs } from "@/lib/acervo";

type Props = {
  busca: string;
  uf: string;
  onBusca: (valor: string) => void;
  onUf: (valor: string) => void;
  onLimpar: () => void;
};

export function FiltroBar({ busca, uf, onBusca, onUf, onLimpar }: Props) {
  return (
    <section className="sticky top-0 z-20 -mx-8 border-y border-line bg-background/95 px-8 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="relative max-w-md flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-faint">
            ⌕
          </span>
          <input
            type="search"
            value={busca}
            onChange={(e) => onBusca(e.target.value)}
            aria-label="Pesquisar pelo nome da unidade"
            placeholder="Pesquisar pelo nome da unidade"
            className="h-10 w-full rounded-md border border-line bg-surface pl-9 pr-3 font-sans text-sm text-foreground placeholder:text-faint focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <select
          value={uf}
          onChange={(e) => onUf(e.target.value)}
          aria-label="Filtrar por UF"
          className="h-10 rounded-md border border-line bg-surface px-3 font-sans text-sm text-foreground focus:border-brand focus:outline-none"
        >
          <option value="">Todas as UFs</option>
          {ufs.map((sigla) => (
            <option key={sigla} value={sigla}>
              {sigla}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onLimpar}
          className="h-10 rounded-md bg-brand px-4 font-sans text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
        >
          Limpar filtros
        </button>
      </div>
    </section>
  );
}
