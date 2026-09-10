import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import heroCampus from "@/assets/hero-campus.jpg";

const linkClasses = "font-mono text-[11px] uppercase tracking-wide transition-colors";

function Nav({ tone }: { tone: "escuro" | "claro" }) {
  const base = tone === "escuro" ? "text-stone-300/70 hover:text-white" : "text-muted hover:text-foreground";
  const ativo = tone === "escuro" ? "text-white" : "text-foreground";
  return (
    <nav className="flex items-center gap-5">
      <Link to="/" className={`${linkClasses} ${base}`} activeProps={{ className: `${linkClasses} ${ativo}` }}>
        Unidades
      </Link>
      <Link
        to="/pendencias"
        className={`${linkClasses} ${base}`}
        activeProps={{ className: `${linkClasses} ${ativo}` }}
      >
        Pendências críticas
      </Link>
      <Link
        to="/dashboard"
        className={`${linkClasses} ${base}`}
        activeProps={{ className: `${linkClasses} ${ativo}` }}
      >
        Dashboard
      </Link>
    </nav>
  );
}

export function HeroAcervo() {
  return (
    <section className="relative h-[360px]">
      <img
        src={heroCampus}
        alt="Corredor de um campus universitário moderno em luz difusa"
        width={1920}
        height={720}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />
      <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-between px-8 py-8">
        <div className="flex items-center justify-between text-stone-200/80">
          <div className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-[3px] bg-brand" />
            <span className="font-display text-sm font-semibold tracking-tight">Acervo das Unidades</span>
          </div>
          <Nav tone="escuro" />
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-300/70">
            Consultas · Compliance
          </p>
          <h1 className="mt-2 text-balance font-display text-[44px] font-extrabold leading-[1.02] tracking-tight text-white">
            Acervo das Unidades
          </h1>
          <p className="mt-3 max-w-[46ch] text-pretty font-sans text-sm text-stone-200/80">
            Consulta de documentos e status de regularidade por unidade.
          </p>
        </div>
      </div>
    </section>
  );
}

export function CabecalhoInterno({ titulo, descricao }: { titulo: string; descricao: string }) {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto max-w-[1440px] px-8 py-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-[3px] bg-brand" />
            <span className="font-display text-sm font-semibold tracking-tight text-foreground">
              Acervo das Unidades
            </span>
          </Link>
          <Nav tone="claro" />
        </div>
        <h1 className="mt-6 text-balance font-display text-3xl font-extrabold tracking-tight text-foreground">
          {titulo}
        </h1>
        <p className="mt-2 max-w-[60ch] text-pretty font-sans text-sm text-muted">{descricao}</p>
      </div>
    </header>
  );
}

export function RodapeAcervo() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2.5">
          <span className="size-2.5 rounded-[3px] bg-brand" />
          <span className="font-display text-sm font-semibold tracking-tight text-foreground">
            Acervo das Unidades
          </span>
        </div>
        <span className="font-mono text-[11px] text-faint">
          Acervo das Unidades · v0.1 · dados a importar
        </span>
      </div>
    </footer>
  );
}

export function Pagina({ children }: { children: ReactNode }) {
  return <main className="mx-auto max-w-[1440px] space-y-9 px-8 py-9">{children}</main>;
}
