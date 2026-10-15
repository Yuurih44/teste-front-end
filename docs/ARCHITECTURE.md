# Estrutura e responsabilidades

A aplicação usa React, TypeScript e Sass. A organização separa composição da página, apresentação, acesso a dados e regras de negócio, sem acrescentar dependências.

## Áreas

| Diretório                          | Responsabilidade                                                        |
| ---------------------------------- | ----------------------------------------------------------------------- |
| `src/app`                          | Inicialização dos providers e composição da página em `Storefront`      |
| `src/components/layout`            | Cabeçalho e rodapé                                                      |
| `src/components/sections`          | Seções institucionais e promocionais da página                          |
| `src/components/ui`                | Elementos reutilizáveis: diálogo, ícones, logo e controle de quantidade |
| `src/features/catalog/api`         | Consulta HTTP e validação da resposta externa                           |
| `src/features/catalog/model`       | Contrato do produto, busca e ordenação                                  |
| `src/features/catalog/hooks`       | Carregamento assíncrono e comportamento do carrossel                    |
| `src/features/catalog/components`  | Vitrine, cartão, imagem, skeleton e modal do produto                    |
| `src/features/shopping/model`      | Persistência, quantidades, montagem do carrinho e total                 |
| `src/features/shopping/context`    | Estado compartilhado e ações de carrinho/favoritos                      |
| `src/features/shopping/hooks`      | Acesso ao contexto da loja                                              |
| `src/features/shopping/components` | Diálogos do carrinho e dos favoritos                                    |
| `src/utils`                        | Formatação monetária e navegação compartilhadas                         |
| `src/styles`                       | Sass por seção, tokens e regras responsivas                             |

## Fluxo dos dados

1. `App` escolhe o catálogo a partir da URL e chama `useProducts`.
2. O serviço consulta o endpoint, valida o contrato e devolve produtos tipados. O hook controla carregamento, erro, cancelamento e nova tentativa.
3. `Storefront` compõe as seções e controla a busca e os diálogos. As funções de busca e ordenação não modificam a sequência original do catálogo.
4. `StoreProvider` compartilha as ações da loja. O navegador guarda identificadores e quantidades; preços e fotos sempre vêm do catálogo carregado.
5. As regras de carrinho derivam os itens válidos e calculam totais em centavos. Produtos removidos do catálogo não entram no total; quantidades ficam entre 1 e 99.

## Decisões de escopo

O JSON não oferece ID nem categoria. O nome identifica o produto na persistência, o que pressupõe nomes únicos no catálogo fornecido. Uma API com IDs permitiria substituir essa chave sem depender do nome. As categorias sem itens exibem estado vazio.

O catálogo opcional de referência usa a mesma interface e uma chave de armazenamento distinta. A página padrão continua consumindo a API exigida pelo teste.

Context é suficiente para o volume atual de estado compartilhado. Não há camada global para busca ou diálogos, nem abstração genérica de repositórios para um único endpoint. A interface do catálogo usa o hook de compras para ações do usuário; o modelo de compras depende apenas dos tipos do produto e não importa componentes de catálogo.

O proxy tem destino fixo para resolver o CORS da API fornecida. Desenvolvimento e preview compartilham a configuração; o servidor Node implementa o encaminhamento no build de produção.

## Verificação

Testes unitários ficam próximos do código que verificam; os testes de integração da página estão em `src/app`. Playwright em `e2e` verifica os fluxos no navegador, teclado, persistência, medidas principais do desktop e acessibilidade automática em alto contraste. O workflow do GitHub executa formatação, lint, tipos, testes e build.
