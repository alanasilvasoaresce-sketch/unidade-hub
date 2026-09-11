import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({ nome: z.string().min(1), uf: z.string().min(2).max(2) });

export const obterArquivosDaUnidade = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { buscarArquivosDaUnidade } = await import("@/lib/drive.server");
    return buscarArquivosDaUnidade(data.nome, data.uf);
  });
