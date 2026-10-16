# Arquitetura

A aplicação separa a composição da página, os componentes compartilhados e as funcionalidades de catálogo, conta e compras.

| Diretório                 | Responsabilidade                                       |
| ------------------------- | ------------------------------------------------------ |
| `src/app`                 | Inicialização dos providers e composição da página.    |
| `src/components/layout`   | Cabeçalho e rodapé.                                    |
| `src/components/sections` | Banner, departamentos, parceiros, marcas e newsletter. |
| `src/components/ui`       | Diálogos, ícones, logo e controles reutilizáveis.      |
| `src/features/catalog`    | Catálogos, consulta à API, busca, filtros e vitrines.  |
| `src/features/account`    | Perfil e preferências de assinatura.                   |
| `src/features/shopping`   | Estado, regras e interface de carrinho e favoritos.    |
| `src/styles`              | Tokens, estilos Sass e regras responsivas.             |
| `src/utils`               | Formatação monetária e navegação.                      |

## Dados e estado

Sem parâmetros, `App` abre a versão ampliada com o catálogo oficial da Econverse. `?versao=teste` seleciona a versão focada no enunciado, que usa sempre o catálogo oficial e oculta os recursos extras. Na versão ampliada, `?catalog=real` carrega o catálogo local de iPhones; `?catalog=assessment`, o padrão, seleciona o catálogo oficial.

O catálogo oficial é consultado em `api/products`, relativo ao caminho base da aplicação. Em desenvolvimento e na produção com Node, esse endereço usa um proxy para a API da Econverse. No GitHub Pages, ele fornece a cópia obtida durante a publicação. A resposta é validada antes de chegar à página. Na versão ampliada, o departamento ativo fica na URL, permitindo usar voltar e avançar no navegador.

`Storefront` monta as seções, seleciona os produtos do departamento e controla busca e diálogos. Busca, filtros e ordenação são funções separadas da apresentação. `StoreProvider` compartilha carrinho e favoritos entre departamentos; o navegador armazena identificadores e quantidades, enquanto preços e imagens vêm do catálogo carregado.

O endpoint não inclui identificador ou categoria. Por isso, o nome do produto identifica o item persistido e os celulares recebem a categoria Celular na interface. Essa associação não altera os dados da resposta. Categorias adicionais e os demais departamentos usam produtos locais.

## Compras e conta

As regras do carrinho calculam valores em centavos e limitam quantidades a 99. Itens que não existem mais no catálogo não entram no total. Carrinho e favoritos usam `localStorage`; perfil e preferências de assinatura ficam em `sessionStorage`.

Perfil e assinatura não estão ligados a um serviço externo. O fluxo de compra da versão ampliada termina na conferência do carrinho, sem cobrança ou envio de pedido. A newsletter apenas valida o formulário em memória, sem persistir o cadastro ou enviar dados.

## Desenvolvimento e testes

Os testes unitários ficam próximos dos módulos. Os cenários completos do navegador ficam em `e2e/`. O workflow de qualidade executa formatação, lint, tipos, testes e build.

O proxy do Vite atende o desenvolvimento. Na produção com Node, `npm run build` gera `dist/` e `npm start` executa `server.mjs`, que serve os arquivos e encaminha as consultas à API.

Na hospedagem estática do GitHub Pages, o workflow `deploy-pages.yml` compila com o caminho base `/teste-front-end/` e executa `scripts/prepare-static-catalog.mjs` com `SITES_STATIC_CATALOG=1`. O script consulta a API oficial e grava o JSON em `dist/api/products`. O navegador acessa essa cópia, renovada em cada publicação; a hospedagem não executa `server.mjs`.
