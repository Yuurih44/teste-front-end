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
- Auditoria axe-core da página, do modal e do carrinho, com regras WCAG 2 A/AA e 2.1 AA no modo `prefers-contrast: more`. O modo padrão preserva os tons cinza do protótipo, que não atendem ao contraste AA em alguns textos.
- Catálogo local de iPhones com nomes, preços e imagens por variante; modo escuro do sistema preserva a página clara.
- Separação do catálogo de referência, fotos por variante e ausência de links de lojas no modal. As fontes permanecem na documentação.

Os testes usam a cópia do JSON em `e2e/fixtures/` exclusivamente para tornar a execução independente do serviço externo. A página inicial consulta a API da Econverse; os testes do catálogo local usam `?catalog=real`. A auditoria automática auxilia a encontrar problemas, mas não substitui uma avaliação manual completa de acessibilidade.

## Referência comercial

`reference/precos-fontes.json` registra SKU, preço retornado pelo catálogo da Trocafone, URL, foto original, estoque na coleta e data/hora. A cópia de apresentação está em `public/data/products-real.json` e abastece `?catalog=real`. A página inicial consulta a API da Econverse.

Esses valores são referências registradas na coleta, sem promessa de atualização contínua ou de disponibilidade. A capacidade, cor e condição são parte do nome do aparelho. As fotos são ilustrativas dos modelos e cores, conforme o anúncio do fornecedor, e não fotografias individuais de cada aparelho seminovo.


## Ampliação da experiência e fidelidade visual

A suíte tem 30 testes unitários e 15 cenários de navegador executados em desktop e celular: 29 execuções passam e uma verificação exclusiva de geometria desktop é ignorada no projeto mobile.

Os fluxos adicionais verificam carrinho, totais, quantidades, persistência após recarregar, favoritos, ordenação e ações diretas nos cartões da visualização com fotos reais. Os dados de carrinho/favoritos são separados entre os catálogos e não incluem dados pessoais. Nenhum checkout ou pedido real é enviado.

O teste de geometria verifica os parâmetros observados no protótipo: cabeçalho 144px, banner 390px, campo de busca 630 × 48px em x=405, primeiro cartão em y=947 e cores primárias dos botões. Isso impede regressões nesses pontos, mas não substitui a comparação integral com o Figma.

## Organização do código

A divisão das responsabilidades está em `docs/ARCHITECTURE.md`. Os testes das regras de busca verificam acentos, espaços e preservação da ordem original. Os de carrinho verificam cálculo em centavos, produtos removidos, quantidades inválidas e nomes coincidentes com propriedades herdadas do JavaScript.

## Departamentos

Os testes de navegador percorrem os seis departamentos demonstrativos em desktop e celular, verificam produtos e fotos nas três vitrines e comparam as dimensões dos cartões com as de Tecnologia. Também verificam filtros de ferramentas, carrinho misto, total, favoritos, recarga e retorno pelo histórico. Os testes unitários verificam a seleção do departamento, os seis filtros e as identidades dos produtos demonstrativos.

## Favoritos, livros, conta e assinatura

Os testes também verificam os corações nos cartões, sincronização dos favoritos, catálogo de livros e pesquisa por Enter; a cor do ícone selecionado e manutenção da posição vertical ao trocar de departamento; formulário de perfil, edição, saída, assinatura com consentimento obrigatório, recarga e cancelamento. Conta e assinatura recebem auditoria axe em alto contraste, como os demais diálogos. O modelo rejeita preferências de sessão inválidas.
