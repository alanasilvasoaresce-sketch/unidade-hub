# Unidade Hub

Crie um sistema web chamado "Acervo das Unidades" para gerenciamento e consulta das documentações das unidades de uma instituição de ensino.

O sistema deve ter uma aparência profissional, limpa, moderna e fácil de usar.

A página inicial deve apresentar:

Um título "Acervo das Unidades".

Um campo de pesquisa para pesquisar pelo nome da unidade.

Um filtro por UF/estado.

Um resumo com:

Total de unidades

Unidades regularizadas

Unidades parciais

Unidades sem documentos

Uma lista ou tabela com todas as unidades.

Cada unidade deve possuir uma página de detalhes contendo:

Nome da Unidade

UF

Contrato de Locação Vigente

CNPJ

Alvará de Funcionamento da Prefeitura

AVCB/CLCB

Plano e Laudo de Acessibilidade

Plano de Emergência com Rota de Fuga

IPTU

Planta Baixa dos Espaços Locados

Arquivo Excel dos Laboratórios de Saúde

Arquivo com Quantidade de Carteiras por Sala e Área em Metros

Status Geral

Classificação da Unidade

Para cada documento, mostrar claramente a situação:

OK

FALTA

PENDENTE

Quando houver um arquivo disponível, deverá existir um botão "Visualizar documento".

Também quero uma área de "Pendências Críticas", mostrando a unidade, UF, documento, motivo e impacto.

Crie também uma área de Dashboard com os indicadores gerais das documentações.

Por enquanto, não crie dados fictícios e não invente documentos. A estrutura deve ser preparada para receber posteriormente os dados reais da minha planilha Excel e os arquivos PDF organizados por unidade.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d8c849dd-d0f4-4904-b794-ba9128941a09).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
