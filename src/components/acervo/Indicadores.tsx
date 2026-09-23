type Indicador = {
  rotulo: string;
  valor: number | string;
  nota: string;
};

export function Indicadores({ itens }: { itens: Indicador[] }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {itens.map((item) => (
        <div key={item.rotulo} className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
              {item.rotulo}
            </span>
            <span className="size-2 rounded-full bg-brand" />
          </div>
          <div className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground">
            {item.valor}
          </div>
          <p className="mt-1.5 font-sans text-xs text-faint">{item.nota}</p>
        </div>
      ))}
    </section>
  );
}
