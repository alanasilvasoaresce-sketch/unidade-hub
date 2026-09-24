import { Link } from "@tanstack/react-router";
import { AlertTriangle, BarChart3, Bell, Building2, FileText, Home, Search, Settings, UserRound } from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { to: "/", label: "Unidades", icon: Building2 },
  { to: "/pendencias", label: "Pendências", icon: AlertTriangle },
  { to: "/dashboard", label: "Relatórios", icon: BarChart3 },
] as const;

function Sidebar() {
  return (
    <aside className="border-sidebar-border bg-sidebar text-sidebar-foreground lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-r">
      <div className="flex h-full flex-col px-4 py-5">
        <Link to="/" className="flex items-center gap-3 px-2">
          <span className="grid size-10 place-items-center rounded-md border border-sidebar-border bg-sidebar-active/20">
            <Home className="size-5" />
          </span>
          <span>
            <span className="block font-display text-lg font-bold leading-none tracking-tight">Unidade Hub</span>
            <span className="mt-1 block font-sans text-xs text-sidebar-muted">Gestão de Unidades</span>
          </span>
        </Link>

        <nav className="mt-5 flex gap-1.5 overflow-x-auto lg:mt-8 lg:block lg:space-y-1.5">
          <Link
            to="/"
            className="flex h-11 shrink-0 items-center gap-3 rounded-md px-3 font-sans text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-active/70 hover:text-sidebar-active-foreground lg:w-full"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-sidebar-active text-sidebar-active-foreground" }}
          >
            <Home className="size-4" />
            Início
          </Link>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={`${item.label}-${item.to}`}
                to={item.to}
                className="flex h-11 shrink-0 items-center gap-3 rounded-md px-3 font-sans text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-active/70 hover:text-sidebar-active-foreground lg:w-full"
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="flex h-11 shrink-0 items-center gap-3 rounded-md px-3 font-sans text-sm font-medium text-sidebar-muted lg:w-full">
            <FileText className="size-4" />
            Documentos
          </div>
          <div className="flex h-11 shrink-0 items-center gap-3 rounded-md px-3 font-sans text-sm font-medium text-sidebar-muted lg:w-full">
            <Settings className="size-4" />
            Configurações
          </div>
        </nav>
      </div>
    </aside>
  );
}

export function UnidadeHubShell({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1 lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-line bg-topbar/95 px-5 py-4 text-sidebar-foreground backdrop-blur sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[1240px] items-center gap-4">
            <div className="relative hidden flex-1 sm:block">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-sidebar-muted" />
              <div className="h-10 rounded-md border border-sidebar-border bg-sidebar-active/20 pl-11 pr-4 font-sans text-sm leading-10 text-sidebar-muted">
                Buscar unidade, cidade ou pendência...
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span className="relative grid size-9 place-items-center rounded-md border border-sidebar-border bg-sidebar-active/15">
                <Bell className="size-4" />
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-critical" />
              </span>
              <span className="grid size-9 place-items-center rounded-full bg-surface text-brand">
                <UserRound className="size-4" />
              </span>
              <span className="hidden font-sans text-sm font-medium sm:inline">Alana Soares</span>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1240px] space-y-7 px-5 py-7 sm:px-8 lg:px-10">
          <section>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {titulo}
            </h1>
            <p className="mt-2 max-w-[72ch] font-sans text-sm text-muted">{descricao}</p>
          </section>
          {children}
        </main>
      </div>
    </div>
  );
}

export function HeroAcervo() {
  return null;
}

export function CabecalhoInterno({ titulo, descricao }: { titulo: string; descricao: string }) {
  return (
    <section>
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">{titulo}</h1>
      <p className="mt-2 max-w-[72ch] font-sans text-sm text-muted">{descricao}</p>
    </section>
  );
}

export function RodapeAcervo() {
  return (
    <footer className="mx-auto max-w-[1240px] px-5 pb-6 text-center font-sans text-xs text-faint sm:px-8 lg:px-10">
      Unidade Hub · gestão de unidades, mais simples e eficiente.
    </footer>
  );
}

export function Pagina({ children }: { children: ReactNode }) {
  return <div className="space-y-7">{children}</div>;
}
