import { documentosExigidos, situacaoDe, type Unidade } from "@/lib/acervo";
import { StatusChip } from "./StatusChip";

export function ChecklistDocumentos({ unidade }: { unidade?: Unidade }) {
  return (
    <div className="space-y-2">
      {documentosExigidos.map((doc, i) => {
        const item = unidade ? situacaoDe(unidade, doc.id) : { situacao: "SEM_DADOS" as const };
        return (
          <div
            key={doc.id}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 ${
              item.situacao === "SEM_DADOS"
                ? "border border-dashed border-line"
                : "border border-line bg-background/40"
            }`}
          >
            <span className="w-4 font-mono text-[10px] text-faint">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 font-sans text-sm text-muted">{doc.nome}</span>
            {"arquivoUrl" in item && item.arquivoUrl && (
              <a
                href={item.arquivoUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-line bg-surface px-2.5 py-1 font-sans text-xs font-medium text-brand hover:border-brand"
              >
                Visualizar documento
              </a>
            )}
            <StatusChip situacao={item.situacao} />
          </div>
        );
      })}
    </div>
  );
}
