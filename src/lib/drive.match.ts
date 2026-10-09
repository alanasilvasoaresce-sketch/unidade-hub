/**
 * Associação entre uma unidade da planilha e a pasta dela no Google Drive.
 * Os nomes das pastas nem sempre têm a mesma grafia da planilha
 * (ex.: "ABATETUBA" x "Abaetetuba_PA", "SÃO LUIZ" x "São Luís_MA"), então
 * comparamos por UF + semelhança de nome, em vez de exigir nome idêntico.
 */
export type PastaDrive = { id: string; name: string };

const UFS = new Set(
  "ac al ap am ba ce df es go ma mt ms mg pa pb pr pe pi rj rn rs ro rr sc sp se to".split(" "),
);
const IGNORAR = new Set(["de", "da", "do", "das", "dos", "e"]);

export function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function distancia(a: string, b: string) {
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let anterior = dp[0]!;
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = dp[j]!;
      dp[j] = Math.min(dp[j]! + 1, dp[j - 1]! + 1, anterior + (a[i - 1] === b[j - 1] ? 0 : 1));
      anterior = temp;
    }
  }
  return dp[b.length]!;
}

function semelhanca(a: string, b: string) {
  if (!a || !b) return 0;
  return 1 - distancia(a, b) / Math.max(a.length, b.length);
}

export function pontuarPasta(nome: string, uf: string, pasta: string) {
  const palavrasPasta = normalizar(pasta).split(" ");
  const ufs = palavrasPasta.filter((p) => UFS.has(p));
  const ufAlvo = normalizar(uf);
  
  const cidadePasta = palavrasPasta.filter((p) => !UFS.has(p) && !IGNORAR.has(p));
  const cidade = normalizar(nome)
    .split(" ")
    .filter((p) => !IGNORAR.has(p));
  const total = semelhanca(cidade.join(""), cidadePasta.join(""));
  // Nome composto (ex.: "Fortaleza Jóquei" x "Fortaleza North Shopping Jóquei"):
  // média da melhor correspondência de cada palavra da cidade.
  const palavras = cidade.filter((p) => p.length >= 3);
  const porPalavra =
    palavras.length === 0
      ? 0
      : palavras.reduce(
          (soma, p) => soma + Math.max(0, ...cidadePasta.map((q) => semelhanca(p, q))),
          0,
        ) / palavras.length;
  const base = Math.max(total, porPalavra);
  if (ufs.length === 0) return base * 0.95;
  return ufs.includes(ufAlvo) ? base : base * 0.8;
}

/** Melhor pasta para a unidade, ou null se nenhuma for parecida o bastante. */
export function escolherPasta<T extends PastaDrive>(nome: string, uf: string, pastas: T[]) {
  let melhor: T | null = null;
  let melhorNota = 0;
  for (const pasta of pastas) {
    const nota = pontuarPasta(nome, uf, pasta.name);
    if (nota > melhorNota) {
      melhor = pasta;
      melhorNota = nota;
    }
  }
  return melhorNota >= 0.7 ? melhor : null;
}
