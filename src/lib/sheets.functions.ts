import { createServerFn } from "@tanstack/react-start";

export const obterAcervoDaPlanilha = createServerFn({ method: "GET" }).handler(async () => {
  const { buscarAcervoDaPlanilha } = await import("@/lib/sheets.server");
  return buscarAcervoDaPlanilha();
});
