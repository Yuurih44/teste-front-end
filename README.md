# Econverse — teste front-end

Implementação responsiva do protótipo do [teste para Desenvolvedor Front-End Jr.](https://www.figma.com/proto/rWnzPeoxgynuNPsJjV0VmV/Teste-Front-End-Jr?node-id=1-1248&scaling=min-zoom&page-id=0%3A1&starting-point-node-id=1%3A1248), feita com React, TypeScript e Sass.

![Página inicial em desktop](docs/screenshots/desktop.png)

## Começar

Requer Node.js 22.13 ou superior e npm. Com nvm, use `nvm use` para carregar a versão definida em `.nvmrc`.

```sh
npm ci
npm run dev
```

O Vite informa o endereço local, normalmente `http://localhost:5173`.

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

## Catálogos

A página inicial exibe dez modelos de iPhone com nomes, preços e fotos por variante. O registro da consulta, com SKUs, origem e data, está em [`reference/precos-fontes.json`](reference/precos-fontes.json); a aplicação usa a cópia em `public/data/products-real.json`.

O parâmetro `?catalog=assessment` consulta o endpoint fornecido no teste: `https://app.econverse.com.br/teste-front-end/junior/tecnologia/lista-produtos/produtos.json`. Como a API não habilita CORS para o navegador, `/api/products` encaminha a solicitação. O proxy funciona no Vite durante o desenvolvimento e no servidor Node em produção; a aplicação precisa ser hospedada com um servidor ou proxy equivalente.

Os outros departamentos e as categorias adicionais de Tecnologia usam dados locais. Seus preços são exemplos e estão identificados na interface. Carrinho, favoritos, conta, assinatura e newsletter funcionam localmente; não há checkout, autenticação ou envio de dados a serviços externos.

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
