import { ufs } from "@/lib/acervo";
import { Button } from "@/components/ui/button";

type Props = {
  busca: string;
  uf: string;
  onBusca: (valor: string) => void;
  onUf: (valor: string) => void;
  onLimpar: () => void;
};

export function FiltroBar({ busca, uf, onBusca, onUf, onLimpar }: Props) {
  return (
    <section className="sticky top-[73px] z-20 rounded-lg border border-line bg-surface/95 px-4 py-3 backdrop-blur">
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
        <Button
          type="button"
          onClick={onLimpar}
        >
          Limpar filtros
        </Button>
      </div>
    </section>
  );
}
