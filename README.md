# Econverse — teste front-end

Implementação responsiva do protótipo do [teste para Desenvolvedor Front-End Jr.](https://www.figma.com/proto/rWnzPeoxgynuNPsJjV0VmV/Teste-Front-End-Jr?node-id=1-1248&scaling=min-zoom&page-id=0%3A1&starting-point-node-id=1%3A1248), feita com React, TypeScript e Sass.

![Página inicial em desktop com produtos da API da Econverse](docs/screenshots/desktop.png)

## O projeto tem 2 versões

| Versão                         | O que inclui                                                                                                 | Acesso                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| **1. Versão oficial do teste** | Somente o escopo solicitado pela Econverse: layout, catálogo oficial em JSON e modal de detalhes do produto. | [ABRIR VERSÃO OFICIAL DO TESTE](https://yuurih44.github.io/teste-front-end/?versao=teste) |
| **2. Versão ampliada**         | O mesmo layout, com departamentos e funcionalidades extras, como favoritos, carrinho, conta e assinatura.    | [ABRIR VERSÃO AMPLIADA](https://yuurih44.github.io/teste-front-end/)                      |

**São dois modos no mesmo projeto.** Para avaliar os requisitos da vaga, comece pela **Versão oficial do teste**. A **Versão ampliada** está disponível separadamente para demonstrar as melhorias extras.

O GitHub Pages publica a versão atual automaticamente a cada atualização da branch `main`, pelo workflow [`Publicar no GitHub Pages`](.github/workflows/deploy-pages.yml).

## Executar o teste

```sh
npm ci
npm run dev
```

Depois de iniciar o Vite, abra a versão desejada no endereço informado pelo terminal, normalmente:

| Versão                                 | Endereço local                        |
| -------------------------------------- | ------------------------------------- |
| Oficial do teste                       | `http://localhost:5173/?versao=teste` |
| Ampliada com catálogo oficial          | `http://localhost:5173/`              |
| Ampliada com catálogo local de iPhones | `http://localhost:5173/?catalog=real` |

O parâmetro `versao=teste` seleciona a versão focada no enunciado. Sem ele, a aplicação abre a versão ampliada. O parâmetro `catalog` escolhe os dados, não a versão: `assessment` usa o catálogo oficial e é o padrão; `real` usa o catálogo local de iPhones, disponível somente na versão ampliada. Na versão oficial do teste, o catálogo é sempre o da Econverse.

Em desenvolvimento, a página consulta o JSON oficial pelo proxy `/api/products`. Os departamentos adicionais usam dados demonstrativos locais.

## Requisitos

No Windows, você só precisa instalar o **Node.js** e o **npm** se ainda não estiverem no computador. Se já tiver uma versão compatível do Node.js e o npm, pule a instalação e vá direto ao passo 3.

1. Abra o **Prompt de Comando (cmd)** e confira se já estão instalados:

   ```bat
   node -v
   npm -v
   ```

   O projeto aceita Node.js 22.13 ou superior da linha 22, Node.js 24 ou versões a partir da 26.

2. Se não estiverem instalados, instale o **Node.js 22**, que já inclui o **npm**:

   ```bat
   winget install --id OpenJS.NodeJS.22 --exact --source winget
   ```

   Se sua versão do Node.js não for compatível, atualize-a antes de continuar. Depois da instalação, feche e abra novamente o Prompt de Comando e confira com `node -v` e `npm -v`.

   Se o comando `winget` não estiver disponível, use o [instalador oficial do Node.js](https://nodejs.org/en/download).

3. Na pasta do projeto, instale as dependências e inicie a aplicação:

   ```bat
   npm ci
   npm run dev
   ```

## Scripts

| Comando                | Uso                                                 |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Inicia o servidor de desenvolvimento.               |
| `npm run check`        | Executa lint, verificação de tipos, testes e build. |
| `npm run test:e2e`     | Compila e executa os testes no Playwright.          |
| `npm run format:check` | Confere a formatação.                               |
| `npm run build`        | Gera a versão de produção em `dist/`.               |
| `npm start`            | Serve a aplicação compilada e o proxy da API.       |

Para rodar os testes de navegador pela primeira vez, instale o Chromium com `npx playwright install chromium`.

Para executar a versão de produção localmente, use `npm run build` e depois `npm start`. O servidor usa a porta 3000 por padrão; a versão oficial fica em `http://localhost:3000/?versao=teste`.

## Catálogos

A página sem parâmetros consome o JSON oficial da Econverse. Para consultar os dez modelos de iPhone com nomes, preços e fotos por variante, abra `?catalog=real`. Os SKUs, a origem e a data da consulta estão em [`reference/precos-fontes.json`](reference/precos-fontes.json); a aplicação usa a cópia em `public/data/products-real.json`.

O endpoint consultado é `https://app.econverse.com.br/teste-front-end/junior/tecnologia/lista-produtos/produtos.json`. Como a API não habilita CORS para o navegador, o Vite e o servidor Node de produção encaminham as solicitações de `/api/products` para esse endpoint.

No GitHub Pages, a hospedagem é estática: o workflow obtém o JSON oficial durante a publicação e salva uma cópia em `api/products`, dentro da pasta do site. A demonstração consulta essa cópia em `/teste-front-end/api/products`, atualizada a cada nova publicação, sem precisar de um servidor Node em execução.

Na versão ampliada, os outros departamentos e as categorias adicionais de Tecnologia usam dados demonstrativos locais. Seus preços são exemplos e estão identificados na interface.

Carrinho e favoritos persistem em `localStorage`. Conta e assinatura são demonstrações locais, sem autenticação, cobrança ou envio de e-mails; o perfil e as preferências ficam em `sessionStorage`. A newsletter apenas valida o formulário, sem enviar ou persistir o cadastro. O fluxo de compra termina na conferência do carrinho, sem pagamento ou envio de pedido.

## Extras demonstrativos

Além dos requisitos do teste, optei por incluir favoritos, carrinho, conta, assinatura e navegação por departamentos. Também adicionei produtos de outras categorias para tornar a experiência mais realista, sem me limitar aos celulares e mantendo o mesmo layout do protótipo. Achei que essas melhorias deixariam a loja mais completa e eficiente.

## Projeto

```text
src/
  app/                    Inicialização e composição da página
  components/             Layout, seções e elementos compartilhados
  features/
    account/               Perfil e preferências de assinatura
    catalog/               Dados, API, busca e apresentação de produtos
    shopping/              Carrinho, favoritos e persistência
  styles/                 Tokens, estilos e regras responsivas
  utils/                  Formatação e navegação
e2e/                       Testes de navegador
public/                     Imagens, fontes e dados servidos pela aplicação
docs/                       Arquitetura, créditos e capturas
reference/                  Enunciado e registros usados no projeto
```

Os módulos de cada funcionalidade mantêm juntos seus componentes, regras e testes. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) descreve o fluxo da aplicação. O enunciado e o roteiro de validação ficam em `reference/`.

## Verificação

`npm run check` cobre lint, TypeScript, testes unitários e build. `npm run test:e2e` percorre os fluxos de busca, navegação, carrinho, favoritos e diálogos no navegador. O workflow em `.github/workflows/quality.yml` executa as verificações em pushes e pull requests.

As imagens e fontes locais têm suas origens registradas em [`docs/IMAGE-CREDITS.md`](docs/IMAGE-CREDITS.md). A licença da Poppins está em `public/fonts/OFL.txt`.
