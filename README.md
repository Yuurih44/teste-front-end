# Teste Front-End — Econverse

Página em **React, TypeScript e Sass**, sem biblioteca de UI, desenvolvida a partir do [protótipo do teste](https://www.figma.com/proto/rWnzPeoxgynuNPsJjV0VmV/Teste-Front-End-Jr?node-id=1-1248&scaling=min-zoom&page-id=0%3A1&starting-point-node-id=1%3A1248).

Inclui cabeçalho com busca, banner de Black Friday, departamentos, três vitrines, banners de parceiros, marcas, newsletter e rodapé. Carrinho e favoritos funcionam pelos ícones existentes no cabeçalho; a ordenação aparece após uma busca. Ao selecionar um produto, o modal exibe os dados daquele item consultado na API.

![Página inicial em desktop](docs/screenshots/desktop.png)

## Executar

Requisito: **Node.js 22.13+ (linha 22 LTS), 24 ou 26+** e npm. Há um `.nvmrc` para quem utiliza nvm.

```bash
npm ci
npm run dev
```

Abra a URL exibida pelo Vite, normalmente **http://localhost:5173**.

## Compilar e executar em produção

```bash
npm run build
npm start
```

A compilação verifica os tipos TypeScript e gera `dist/`. O servidor Node serve a aplicação e o proxy do catálogo em **http://localhost:3000**. A porta pode ser configurada pela variável `PORT`.

Também é possível conferir o build com `npm run preview`; o preview inclui o mesmo proxy fixo do catálogo.

## Testes

```bash
npm test

# Fluxo completo: lint, tipos, testes e build
npm run check

# Navegador em desktop e celular (inclui auditoria axe)
npx playwright install chromium
npm run test:e2e

# Verificação de formatação
npm run format:check
```

Vitest e Testing Library verificam:

- Produto correto no modal, quantidade, total e restauração de foco.
- Erro da API e nova tentativa, categorias sem produtos e busca.
- Cancelamento de requisições ao desmontar e validação do contrato do JSON.
- Formulário demonstrativo da newsletter, sem envio de dados.
- Carrinho e favoritos persistentes, totais, quantidades e recuperação de armazenamento inválido.
- Ordenação da busca e sincronização do campo ao voltar para as ofertas.

O Playwright verifica os fluxos reais no navegador e o axe-core verifica regras automáticas WCAG A/AA com a preferência de alto contraste ativada. Os tons padrão seguem o Figma. A integração contínua em `.github/workflows/quality.yml` executa as verificações em cada push e pull request. O fluxo também pode ser executado localmente com os comandos acima.

A versão também foi verificada no Chromium com a API real, nas larguras de 320, 390, 768, 1024 e 1440 pixels: carrossel, busca, categorias, modal, fechamento por Escape e clique externo, quantidade e newsletter. Capturas selecionadas estão em `docs/screenshots/`.

## Organização

```text
src/
  app/                Inicialização, providers e composição da página
  components/
    layout/           Cabeçalho e rodapé
    sections/         Banner, departamentos, parceiros, marcas e newsletter
    ui/               Diálogo, ícones, logo e controle de quantidade
  features/
    catalog/          API, modelos, busca, ordenação, hooks e componentes
    shopping/         Carrinho, favoritos, contexto e persistência
  utils/              Moeda e navegação
  styles/             Sass por seção, tokens e responsividade
e2e/                  Testes de navegador e fixture da API
public/               Fontes, imagens e catálogo opcional
docs/                 Arquitetura e capturas da implementação
reference/            Enunciado, fontes dos recursos e validação
server.mjs            Servidor de produção e proxy do catálogo
```

Os testes unitários ficam próximos dos módulos que verificam. `App` inicializa a aplicação e `Storefront` compõe a página. Regras de busca, ordenação, quantidades e total são funções independentes da interface. Veja as responsabilidades, o fluxo dos dados e as decisões em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## API e decisões

O catálogo é consultado em:

```text
https://app.econverse.com.br/teste-front-end/junior/tecnologia/lista-produtos/produtos.json
```

Como esse endpoint não permite consultas de outra origem por CORS, a interface utiliza `/api/products`. O proxy do Vite no desenvolvimento e `server.mjs` em produção encaminham a consulta ao endereço fixo da empresa, com timeout de 10 segundos. O projeto deve ser hospedado com esse servidor Node ou um proxy equivalente, e não somente como arquivos estáticos.

- Uma única consulta abastece Tecnologia. As três vitrines exibem o departamento selecionado; a busca filtra a primeira, enquanto as demais mantêm todos os itens daquele departamento.
- O JSON da empresa contém somente celulares e não possui campo de categoria. Em Tecnologia, as demais categorias da vitrine exibem estado vazio. Os outros departamentos utilizam produtos demonstrativos locais, sem substituir ou alterar a resposta da API.
- Nomes, descrições, fotos e preços dos produtos vêm da API. Valores são tratados em reais, pois o contrato não informa centavos. O JSON não contém preço anterior, portanto não foi inventado desconto para preencher o preço riscado ilustrativo do Figma.
- Parcelamento e frete grátis seguem os textos do layout. O botão Comprar adiciona ao carrinho local. O carrinho permite alterar quantidades, remover itens, esvaziar e conferir o total; não realiza cobrança ou envio de pedido. O teste não fornece checkout, login ou serviço de pedidos.
- A newsletter valida nome, e-mail e consentimento localmente e informa que a inscrição é demonstrativa. Não armazena nem envia dados.
- Links institucionais, pedidos e conta exibem uma mensagem de indisponibilidade. Carrinho e favoritos são funcionais e guardam apenas identificadores e quantidades no navegador, em chaves separadas para cada catálogo. Não há integração externa para essas áreas no enunciado.
- Banner, parceiros e ícones de departamentos foram extraídos do protótipo e servidos localmente. As fontes Poppins são servidas localmente, com licença em `public/fonts/OFL.txt`. O logotipo foi capturado do protótipo em resolução 4× e é servido localmente, sem depender da fonte para renderizar. As imagens dos produtos no modo padrão continuam usando as URLs da API; esse catálogo depende de conexão à internet.

## Layout e acessibilidade

A referência principal é o protótipo completo em azul e amarelo. A imagem isolada do enunciado utiliza rosa; o protótipo completo foi priorizado. As medidas foram conferidas no protótipo público em resolução desktop.

O modal utiliza `dialog`, com contenção de foco com ciclo explícito de Tab, fechamento por Escape, botão ou fundo, bloqueio da rolagem e retorno do foco ao acionador. A página inclui HTML semântico, hierarquia de títulos, link para pular ao conteúdo, labels, estados de carregamento/erro, foco visível, idioma pt-BR, descrição para SEO e suporte a movimento reduzido. A adaptação para celular e tablet foi feita a partir do layout desktop; não foi fornecido um frame mobile separado.

## Interações adicionais preservando a composição do Figma

- **Carrinho:** abra um produto, escolha a quantidade e clique em Comprar. “Ver meu carrinho” ou o ícone do cabeçalho abre a lista com controles de quantidade, remoção e total. Há limite de 99 unidades por produto.
- **Favoritos:** no modal, abra “Veja mais detalhes do produto” e use “Salvar nos favoritos”. O coração do cabeçalho abre a lista; dela é possível abrir ou remover um produto salvo.
- **Busca:** após pesquisar, os resultados oferecem ordenação por relevância, preço crescente, preço decrescente e nome. A vitrine inicial mantém a sequência do JSON e não recebe uma barra de filtros adicional.
- **Persistência:** carrinho e favoritos voltam ao recarregar a página. Os preços são sempre lidos do catálogo atual, não do armazenamento do navegador. Se o armazenamento estiver indisponível, as interações continuam funcionando em memória.
- **Carregamento:** skeletons ocupam a área das vitrines durante a consulta, com animação desativada quando o sistema pede movimento reduzido.

## Conferência visual

As capturas foram comparadas em 1440 × 1000. Foram corrigidos o amarelo `#F7CA11`, o campo de busca em x=405 com 630 × 48 px, a área do cabeçalho de 144 px, o banner de 390 px e o início dos cartões em y=947. O Playwright verifica esses parâmetros da referência no desktop; o caso é intencionalmente desconsiderado no projeto mobile, que usa outra resolução.

A composição inicial segue a referência; os recursos novos ficam nos fluxos acionados pelo usuário. Os tons cinza padrão do protótipo foram preservados conforme solicitado. A preferência de sistema `prefers-contrast: more` aumenta o contraste desses textos, e é nesse modo que os testes automáticos axe são executados. Preservar as medidas principais não comprova igualdade de todos os pixels: alguns ícones ainda são reconstruções, e o conteúdo dos produtos obedece ao JSON em vez dos exemplos estáticos da imagem.

## Departamentos funcionais

Os sete botões existentes alternam o conteúdo das vitrines na mesma landing page. Banner, fontes, cores, dimensões dos cartões e botões mantêm os estilos da página inicial. As seis posições da barra de categorias recebem os filtros correspondentes ao departamento escolhido.

- **Tecnologia:** API original da empresa, ou catálogo de celulares de referência quando `?catalog=real` está presente.
- **Supermercado, Bebidas, Ferramentas, Saúde, Esportes e Fitness e Moda:** 38 produtos demonstrativos com imagens locais. Os preços são fictícios e são identificados como demonstrativos nos cartões e no modal. Saúde apresenta cuidados pessoais, sem medicamentos.
- **Navegação:** a URL registra o departamento, por exemplo `/?department=ferramentas`. Recarregar, voltar e avançar preservam o departamento. Supermercado e Moda no menu superior também abrem suas vitrines.
- **Compras:** carrinho e favoritos são compartilhados entre os departamentos, com persistência. A busca e os filtros atuam no departamento selecionado. Os modos padrão e `?catalog=real` continuam com armazenamento separado.
- **Disponibilidade:** os departamentos demonstrativos funcionam mesmo se a API de Tecnologia estiver indisponível. Não há substituição silenciosa do catálogo original.

Os dados estão em `src/features/catalog/data/departments.json`. A procedência das fotos e suas licenças estão em [docs/IMAGE-CREDITS.md](docs/IMAGE-CREDITS.md) e `reference/departamentos-fontes.json`. Não é necessário consultar serviços de imagens para usar esses departamentos depois da instalação.

## Visualização com modelos e preços de referência

Como demonstração opcional, existe uma visualização em **http://localhost:5173/?catalog=real**. Ela usa uma cópia de consulta de dez variantes de iPhone 11 Pro Max e iPhone 13 mini: capacidade, cor, condição de seminovo, foto correspondente e preço fornecido pelo catálogo público da Trocafone.

Nesta visualização, os cartões têm coração para favoritar e botão para adicionar diretamente ao carrinho. As mesmas ações também continuam disponíveis pelo modal e pelos ícones do cabeçalho.

As fontes, SKUs, fotos originais e horários da consulta estão em `reference/precos-fontes.json`. As referências externas ficam na documentação, sem links de lojas na interface. O modal informa a data e a disponibilidade registrada na consulta. Preços e estoque podem mudar; esta página não representa uma oferta de venda nem atualiza esses preços continuamente.

**Para avaliação do teste, utilize a URL padrão**, sem parâmetros: ela continua consumindo o JSON da Econverse, sem substituição ou alteração de seus preços e fotos. Não há troca silenciosa de catálogo em caso de falha.

Veja o escopo detalhado dos testes em `reference/VALIDACAO.md`.

## Entrega

O enunciado original está em `reference/ENUNCIADO.md`. Esta implementação deve ser avaliada pela URL padrão, que consome a API solicitada. Para entrega à empresa, utilize o link deste repositório conforme as instruções do enunciado.
