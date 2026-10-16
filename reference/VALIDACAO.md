# Verificação da entrega

## Comandos reproduzíveis

```sh
npm ci
npm run check
npx playwright install chromium
npm run test:e2e
npm run format:check
```

`check` reúne ESLint, TypeScript estrito, testes de comportamento e compilação de produção. O Playwright sobe o servidor de produção automaticamente. Em Linux, caso faltem bibliotecas do navegador, use `npx playwright install --with-deps chromium`.

## Escopo dos testes de navegador

- Seleção do produto correto, preço, quantidade e total.
- Ciclo de Tab no modal, Escape, clique externo e devolução do foco.
- Busca, categoria vazia, erro da API e nova tentativa.
- Limites das setas do carrossel e navegação pelo teclado.
- Ausência de transbordamento horizontal em desktop e celular.
- Auditoria axe-core da página e dos diálogos. No modo padrão, preserva as cores do protótipo e audita as regras exceto contraste; em `prefers-contrast: more`, audita todas as regras WCAG 2 A/AA e 2.1 AA.
- Catálogo local de iPhones com nomes, preços e imagens por variante; modo escuro do sistema preserva a página clara.
- Separação do catálogo de referência, fotos por variante e ausência de links de lojas no modal. As fontes permanecem na documentação.

Os testes usam a cópia do JSON em `e2e/fixtures/` exclusivamente para tornar a execução independente do serviço externo. A página inicial consulta a API da Econverse; os testes do catálogo local usam `?catalog=real`. Os tons padrão seguem a referência, inclusive os textos cinza que não atingem contraste AA; usuários que preferem contraste reforçado recebem cores mais escuras. A auditoria automática auxilia a encontrar problemas, mas não substitui uma avaliação manual completa de acessibilidade.

## Referência comercial

`reference/precos-fontes.json` registra SKU, preço retornado pelo catálogo da Trocafone, URL, foto original, estoque na coleta e data/hora. A cópia de apresentação está em `public/data/products-real.json` e abastece `?catalog=real`. A página inicial consulta a API da Econverse.

Esses valores são referências registradas na coleta, sem promessa de atualização contínua ou de disponibilidade. A capacidade, cor e condição são parte do nome do aparelho. As fotos são ilustrativas dos modelos e cores, conforme o anúncio do fornecedor, e não fotografias individuais de cada aparelho seminovo.


## Ampliação da experiência e fidelidade visual

A suíte contém 31 testes unitários e 17 cenários de navegador, executados em desktop e celular. O Playwright lista 34 execuções: 33 aplicáveis e uma verificação exclusiva de geometria desktop ignorada no projeto mobile. Esses números descrevem a composição atual da suíte; os resultados de cada execução devem ser consultados no terminal ou no workflow de qualidade.

Os fluxos adicionais verificam carrinho, totais, quantidades, persistência após recarregar, favoritos, ordenação e ações diretas nos cartões da visualização com fotos reais. Os dados de carrinho/favoritos são separados entre os catálogos e não incluem dados pessoais. Nenhum checkout ou pedido real é enviado.

O teste de geometria verifica os parâmetros medidos no PDF em viewport de 1440px: cabeçalho 144px, banner 390px, campo de busca 630 × 48px em x=405, primeiro cartão em y=947, altura total da página de 4660px e cores primárias dos botões. O modal, em viewport de 1440 × 834px, mede 769 × 299px e fica centralizado. O conteúdo comercial, os textos e os controles de favoritos foram adaptados conforme os requisitos posteriores; essas diferenças de conteúdo não mudam a geometria principal.

## Organização do código

A divisão das responsabilidades está em `docs/ARCHITECTURE.md`. Os testes das regras de busca verificam acentos, espaços e preservação da ordem original. Os de carrinho verificam cálculo em centavos, produtos removidos, quantidades inválidas e nomes coincidentes com propriedades herdadas do JavaScript.

## Departamentos

Os testes de navegador percorrem os seis departamentos demonstrativos em desktop e celular, verificam produtos e fotos nas três vitrines e comparam as dimensões dos cartões com as de Tecnologia. Também verificam filtros de ferramentas, carrinho misto, total, favoritos, recarga e retorno pelo histórico. Os testes unitários verificam a seleção do departamento, os seis filtros e as identidades dos produtos demonstrativos.

## Favoritos, livros, conta e assinatura

Os testes também verificam os corações nos cartões, sincronização dos favoritos, catálogo de livros e pesquisa por Enter; a cor do ícone selecionado e manutenção da posição vertical ao trocar de departamento; formulário de perfil, edição, saída, assinatura com consentimento obrigatório, recarga e cancelamento. Conta e assinatura recebem auditoria axe em alto contraste, como os demais diálogos. O modelo rejeita preferências de sessão inválidas.
