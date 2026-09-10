import type { SituacaoDocumento, StatusGeral } from "@/lib/acervo";
import { rotuloSituacao, rotuloStatusGeral } from "@/lib/acervo";

const classesSituacao: Record<SituacaoDocumento, string> = {
  OK: "bg-ok/10 text-ok",
  PENDENTE: "bg-partial/15 text-partial",
  FALTA: "bg-critical/10 text-critical",
  SEM_DADOS: "bg-line/50 text-faint",
};

const pontoSituacao: Record<SituacaoDocumento, string> = {
  OK: "bg-ok",
  PENDENTE: "bg-partial",
  FALTA: "bg-critical",
  SEM_DADOS: "bg-faint",
};

export function StatusChip({ situacao }: { situacao: SituacaoDocumento }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${classesSituacao[situacao]}`}
    >
      <span className={`size-1.5 rounded-full ${pontoSituacao[situacao]}`} />
      {rotuloSituacao[situacao]}
    </span>
  );
}

const classesStatusGeral: Record<StatusGeral, string> = {
  REGULARIZADA: "bg-ok/10 text-ok",
  PARCIAL: "bg-partial/15 text-partial",
  SEM_DOCUMENTOS: "bg-critical/10 text-critical",
  SEM_DADOS: "bg-line/50 text-faint",
};

export function StatusGeralChip({ status }: { status: StatusGeral }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${classesStatusGeral[status]}`}
    >
      {rotuloStatusGeral[status]}
    </span>
  );
}

export function LegendaSituacoes() {
  return (
    <div className="flex flex-wrap gap-2">
      <StatusChip situacao="OK" />
      <StatusChip situacao="PENDENTE" />
      <StatusChip situacao="FALTA" />
    </div>
  );
}
