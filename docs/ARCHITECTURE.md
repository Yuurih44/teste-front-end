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

Sem parâmetros, `App` consulta a API da Econverse pelo proxy `/api/products`. Com `?catalog=real`, carrega o catálogo local de iPhones. A resposta da API é validada antes de chegar à página. O departamento ativo fica na URL, permitindo usar voltar e avançar no navegador.

`Storefront` monta as seções, seleciona os produtos do departamento e controla busca e diálogos. Busca, filtros e ordenação são funções separadas da apresentação. `StoreProvider` compartilha carrinho e favoritos entre departamentos; o navegador armazena identificadores e quantidades, enquanto preços e imagens vêm do catálogo carregado.

O endpoint não inclui identificador ou categoria. Por isso, o nome do produto identifica o item persistido e os celulares recebem a categoria Celular na interface. Essa associação não altera os dados da resposta. Categorias adicionais e os demais departamentos usam produtos locais.

## Compras e conta

As regras do carrinho calculam valores em centavos e limitam quantidades a 99. Itens que não existem mais no catálogo não entram no total. Carrinho e favoritos usam `localStorage`; perfil e preferências de assinatura ficam em `sessionStorage`.

Perfil e assinatura não estão ligados a um serviço externo. O fluxo de compra termina na conferência do carrinho, sem cobrança ou envio de pedido.

## Desenvolvimento e testes

Os testes unitários ficam próximos dos módulos. Os cenários completos do navegador ficam em `e2e/`. O proxy do Vite atende o desenvolvimento; `server.mjs` fornece o mesmo encaminhamento na versão de produção. O workflow do GitHub executa formatação, lint, tipos, testes e build.
