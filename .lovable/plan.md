# Plano

## Objetivo
Ajustar o Unidade Hub para ficar mais próximo da referência visual enviada e permitir abrir documentos dentro do próprio sistema, sem redirecionar o usuário para uma página do Google Drive.

## Mudanças previstas
- Remover a paisagem da tela inicial.
- Aplicar fundo azul-claro/lavanda, com cartões brancos e menu lateral azul-marinho.
- Manter a leitura ao vivo das 196 unidades pelo Google Sheets, sem alterar a conexão existente.
- Manter a busca dos documentos nas pastas das unidades no Google Drive, sem copiar nem apagar arquivos.
- Trocar o botão “Visualizar documento” para abrir um visualizador integrado no detalhe da unidade.
- Organizar os documentos por tipo dentro do detalhe da unidade: Contrato, CNPJ, Alvará, AVCB, IPTU, Plano de Emergência, Planta Baixa e demais documentos existentes.

## Visualizador de documentos
- O sistema continuará buscando o arquivo correspondente no Google Drive.
- Para PDFs, o botão abrirá um painel/modal dentro do Unidade Hub com o documento incorporado.
- Usarei o link de pré-visualização do Google Drive quando possível, mantendo o arquivo no Drive.
- Se o Google bloquear a pré-visualização por permissão, login ou política da conta, o sistema mostrará uma mensagem clara e manterá uma opção de abrir o arquivo original.

## Detalhes técnicos
- A integração atual com Google Sheets não será modificada.
- A integração atual com Google Drive será preservada e ampliada para retornar também o ID do arquivo.
- O visualizador usará o ID do arquivo para montar uma URL de preview do Google Drive, sem salvar o PDF no projeto.
- A página de detalhes passará a ter uma área principal para lista de documentos e visualização integrada.
