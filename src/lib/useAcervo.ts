import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { pendenciasCriticas, unidades as unidadesArquivo } from "@/lib/acervo";
import { obterAcervoDaPlanilha } from "@/lib/sheets.functions";

/**
 * Dados do acervo lidos ao vivo da planilha do Google Sheets.
 * Enquanto a leitura não responde — ou se ela falhar — usamos os dados
 * importados anteriormente do arquivo, para nada ficar vazio na tela.
 */
export function useAcervo() {
  const buscar = useServerFn(obterAcervoDaPlanilha);
  const consulta = useQuery({
    queryKey: ["acervo-planilha"],
    staleTime: 0,
    queryFn: () => buscar(),
  });

  const daPlanilha = consulta.data && consulta.data.unidades.length > 0;

  return {
    unidades: daPlanilha ? consulta.data!.unidades : unidadesArquivo,
    pendencias: daPlanilha ? consulta.data!.pendencias : pendenciasCriticas,
    origem: daPlanilha ? ("planilha" as const) : ("arquivo" as const),
    carregando: consulta.isPending,
    erro: consulta.isError,
  };
}
