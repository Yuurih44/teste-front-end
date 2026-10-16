import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
const catalog = JSON.parse(
  readFileSync(new URL("./fixtures/products.json", import.meta.url), "utf8"),
);

test.beforeEach(async ({ page }) => {
  await page.route("**/api/products", (route) =>
    route.fulfill({ json: catalog }),
  );
  // As fotos não participam dos testes de lógica nem exigem o servidor da empresa.
  await page.route("**/fotos-produtos/*", (route) =>
    route.fulfill({
      path: "public/images/tecnologia.png",
      contentType: "image/png",
    }),
  );
  await page.goto("/?catalog=assessment");
  await expect(page.locator("#produtos .product-card")).toHaveCount(
    catalog.products.length,
  );
});

test("modal usa o produto clicado e mantém o foco acessível", async ({
  page,
}) => {
  const trigger = page.locator("#produtos").getByRole("button", {
    name: "Ver detalhes de IPHONE 13 MINI 1",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", {
    name: "IPHONE 13 MINI 1",
    exact: true,
  });
  await expect(dialog).toContainText("9.000,00");
  await expect(
    dialog.getByRole("button", { name: "Diminuir quantidade" }),
  ).toBeDisabled();
  await dialog.getByRole("button", { name: "Aumentar quantidade" }).click();
  await dialog.getByRole("button", { name: "Comprar", exact: true }).click();
  await expect(dialog.getByText(/2 unidades no carrinho/)).toContainText(
    "18.000,00",
  );
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  const audit = (checkContrast = true) => {
    const builder = new AxeBuilder({ page }).withTags([
      "wcag2a",
      "wcag2aa",
      "wcag21aa",
    ]);
    if (!checkContrast) builder.disableRules(["color-contrast"]);
    return builder.analyze();
  };
  expect((await audit(false)).violations).toEqual([]);
  await page.emulateMedia({ contrast: "more" });
  expect((await audit()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.mouse.click(2, 2);
  await expect(dialog).not.toBeVisible();
});

test("busca, categorias e nova tentativa funcionam no navegador", async ({
  page,
}) => {
  const first = page.locator("#produtos");
  await page.getByRole("searchbox").fill("mini 5");
  await page.getByRole("button", { name: "Buscar", exact: true }).click();
  await expect(first.locator(".product-card")).toHaveCount(1);
  await expect(first).toContainText("IPHONE 13 MINI 5");
  await page.getByRole("searchbox").fill("");
  await page.getByRole("button", { name: "Buscar", exact: true }).click();
  await first.getByRole("button", { name: "Tablets", exact: true }).click();
  await expect(first.locator(".product-card")).toHaveCount(3);
  await first.getByRole("button", { name: "Ver todos", exact: true }).click();
  await expect(first.locator(".product-card")).toHaveCount(30);
  await page.route("**/api/products", (route) =>
    route.fulfill({ status: 502, json: { error: "Indisponível" } }),
  );
  await page.reload();
  await expect(first.getByRole("alert")).toBeVisible();
  await page.route("**/api/products", (route) =>
    route.fulfill({ json: catalog }),
  );
  await first.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(first.locator(".product-card")).toHaveCount(10);
});

test("carrossel respeita os limites, layout não transborda e alto contraste passa no axe", async ({
  page,
}) => {
  const first = page.locator("#produtos");
  const previous = first.getByRole("button", { name: "Produtos anteriores" });
  const next = first.getByRole("button", { name: "Próximos produtos" });
  await expect(previous).toBeDisabled();
  await expect(next).toBeEnabled();
  await first.locator(".product-list").focus();
  await page.keyboard.press("ArrowRight");
  await expect(previous).toBeEnabled();
  await first
    .locator(".product-list")
    .evaluate((element) =>
      element.scrollTo({ left: element.scrollWidth, behavior: "instant" }),
    );
  await expect(next).toBeDisabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const audit = (checkContrast = true) => {
    const builder = new AxeBuilder({ page }).withTags([
      "wcag2a",
      "wcag2aa",
      "wcag21aa",
    ]);
    if (!checkContrast) builder.disableRules(["color-contrast"]);
    return builder.analyze();
  };
  expect((await audit(false)).violations).toEqual([]);
  await page.emulateMedia({ contrast: "more" });
  expect((await audit()).violations).toEqual([]);
});

test("abre com os iPhones reais e fotos correspondentes sem consultar a API genérica", async ({
  page,
}) => {
  let apiRequests = 0;
  await page.route("**/api/products", (route) => {
    apiRequests++;
    return route.abort();
  });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/?catalog=real");
  const colors = await page.evaluate(() => ({
    scheme: getComputedStyle(document.documentElement).colorScheme,
    background: getComputedStyle(document.body).backgroundColor,
  }));
  expect(colors.scheme).toBe("light only");
  expect(colors.background).toBe("rgb(255, 255, 255)");
  const cards = page.locator("#produtos .product-card");
  await expect(cards).toHaveCount(10);
  await expect(cards.nth(0)).toContainText(
    "iPhone 11 Pro Max 64GB Prateado Muito Bom",
  );
  await expect(cards.nth(0)).toContainText("1.849,00");
  await expect(cards.nth(0).locator("img")).toHaveAttribute(
    "src",
    "/images/phones/26008.webp",
  );
  await expect(cards.nth(1)).toContainText("iPhone 13 Mini 256GB Verde");
  await expect(cards.nth(1).locator("img")).toHaveAttribute(
    "src",
    "/images/phones/39492.webp",
  );
  await expect(cards.nth(0).locator("img")).toHaveJSProperty("complete", true);
  expect(
    await cards
      .nth(0)
      .locator("img")
      .evaluate((img: HTMLImageElement) => img.naturalWidth),
  ).toBeGreaterThan(0);
  expect(apiRequests).toBe(0);
});

test("catálogo de referência mantém fontes e fotos separadas da API do teste", async ({
  page,
}) => {
  let assessmentRequests = 0;
  await page.route("**/api/products", (route) => {
    assessmentRequests++;
    return route.abort();
  });
  await page.goto("/?catalog=real");
  const first = page.locator("#produtos");
  await expect(first.locator(".product-card")).toHaveCount(10);
  await expect(first.locator(".product-card").first()).toContainText(
    "Seminovo",
  );
  await expect(first.locator(".product-card").first()).toContainText(
    "1.849,00",
  );
  const mini = first.locator(".product-card").nth(1);
  await expect(mini).toContainText("iPhone 13 Mini 256GB Verde Muito Bom");
  await expect(mini.locator("img")).toHaveAttribute(
    "src",
    /\/images\/phones\/.+\.webp/,
  );
  await mini.getByRole("button", { name: /Ver detalhes/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("link")).toHaveCount(0);
  await expect(dialog).not.toContainText("Trocafone");
  await expect(dialog).toContainText("Consulta:");
  await expect(dialog).toContainText("2.549,00");
  expect(assessmentRequests).toBe(0);
});

test("carrinho e favoritos persistem entre o modal e os cartões", async ({
  page,
}) => {
  const first = page.locator("#produtos");
  await expect(first.getByRole("combobox")).toHaveCount(0);
  await expect(first.locator(".favorite-button")).toHaveCount(10);
  const name = "Iphone 11 PRO MAX BRANCO 1";
  await first
    .getByRole("button", { name: `Ver detalhes de ${name}`, exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Veja mais detalhes do produto >",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Salvar nos favoritos", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Aumentar quantidade", exact: true })
    .click();
  await page.getByRole("button", { name: "Comprar", exact: true }).click();
  await page
    .getByRole("button", { name: "Ver meu carrinho →", exact: true })
    .click();
  let cart = page.getByRole("dialog", { name: "Meu carrinho", exact: true });
  await expect(cart).toContainText("30.000,00");
  await cart
    .getByRole("button", {
      name: `Aumentar quantidade de ${name}`,
      exact: true,
    })
    .click();
  await expect(cart).toContainText("45.000,00");
  await cart
    .getByRole("button", { name: "Conferir pedido", exact: true })
    .click();
  await expect(
    cart.getByRole("status").filter({ hasText: "Seu pedido" }),
  ).toContainText("sem cobrança");
  await page.emulateMedia({ contrast: "more" });
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.reload();
  await page.getByRole("button", { name: "Meu carrinho", exact: true }).click();
  cart = page.getByRole("dialog", { name: "Meu carrinho", exact: true });
  await expect(cart).toContainText("45.000,00");
  await page
    .getByRole("button", { name: "Fechar carrinho", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Meus favoritos", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Meus favoritos", exact: true }),
  ).toContainText(name);
  await page
    .getByRole("dialog")
    .getByRole("button", { name: `Remover ${name} dos favoritos`, exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Sua lista começa com um favorito",
  );
  await page
    .getByRole("button", { name: "Fechar favoritos", exact: true })
    .click();
  await page.getByRole("button", { name: "Meu carrinho", exact: true }).click();
  await page
    .getByRole("button", { name: `Remover ${name} do carrinho`, exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Seu carrinho está vazio",
  );
});

test("ordenação aparece na busca e não altera a ordem do JSON sem busca", async ({
  page,
}) => {
  const first = page.locator("#produtos");
  await expect(page.getByRole("combobox")).toHaveCount(0);
  await page.getByRole("searchbox").fill("iphone");
  await page.getByRole("button", { name: "Buscar", exact: true }).click();
  await page
    .getByRole("combobox", { name: "Ordenar por" })
    .selectOption("price-asc");
  await expect(first.locator(".product-card").first()).toContainText(
    "IPHONE 13 MINI 4",
  );
  await page
    .getByRole("combobox", { name: "Ordenar por" })
    .selectOption("price-desc");
  await expect(first.locator(".product-card").first()).toContainText(
    "Iphone 11 PRO MAX BRANCO 5",
  );
  await page
    .getByRole("button", { name: "Ofertas do dia", exact: true })
    .click();
  await expect(page.getByRole("searchbox")).toHaveValue("");
  await expect(page.getByRole("combobox")).toHaveCount(0);
  await expect(first.locator(".product-card").first()).toContainText(
    "Iphone 11 PRO MAX BRANCO 1",
  );
});

test("dimensões e cores principais correspondem à referência desktop", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "O protótipo de referência tem 1440 pixels de largura.",
  );
  const boxes = await page.evaluate(() =>
    Object.fromEntries(
      [".header-main", ".hero", ".search", "#produtos .product-card"].map(
        (selector) => {
          const rect = document
            .querySelector(selector)!
            .getBoundingClientRect();
          return [
            selector,
            { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          ];
        },
      ),
    ),
  );
  expect(boxes[".hero"]).toMatchObject({
    x: 0,
    y: 144,
    width: 1440,
    height: 390,
  });
  expect(boxes[".search"]).toMatchObject({ x: 405, width: 630, height: 48 });
  expect(boxes["#produtos .product-card"].y).toBeCloseTo(947, 0);
  expect(
    await page.locator("body").evaluate((element) => element.scrollHeight),
  ).toBe(4660);
  await expect(page.locator(".hero .yellow-button")).toHaveCSS(
    "background-color",
    "rgb(247, 202, 17)",
  );
  await expect(page.locator("#produtos .primary-button").first()).toHaveCSS(
    "background-color",
    "rgb(52, 66, 181)",
  );
  await expect(page.locator(".hero h1")).toHaveCSS("font-size", "48px");
});

test("favorita e adiciona ao carrinho diretamente no catálogo com fotos reais", async ({
  page,
}) => {
  await page.goto("/?catalog=real");
  const card = page.locator("#produtos .product-card").first();
  await expect(card).toContainText("1.849,00");
  const name = "iPhone 11 Pro Max 64GB Prateado Muito Bom — Usado";
  const favorite = card.getByRole("button", {
    name: `Adicionar ${name} aos favoritos`,
    exact: true,
  });
  await favorite.click();
  await expect(
    card.getByRole("button", {
      name: `Remover ${name} dos favoritos`,
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await card
    .getByRole("button", { name: `Adicionar ${name} ao carrinho`, exact: true })
    .click();
  await expect(card.getByRole("status")).toContainText("Produto no carrinho");
  await page.getByRole("button", { name: "Meu carrinho", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Meu carrinho", exact: true }),
  ).toContainText("1.849,00");
  await page
    .getByRole("button", { name: `Remover ${name} do carrinho`, exact: true })
    .click();
  await page
    .getByRole("button", { name: "Fechar carrinho", exact: true })
    .click();
  await expect(card.getByRole("status")).toBeEmpty();
  await page
    .getByRole("button", { name: "Meus favoritos", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Meus favoritos", exact: true }),
  ).toContainText(name);
});

test("departamentos trocam as três vitrines e preservam as dimensões dos cartões", async ({
  page,
}) => {
  const navigation = page.getByRole("navigation", {
    name: "Navegar por departamento",
  });
  const first = page.locator("#produtos");
  const initialBox = await first.locator(".product-card").first().boundingBox();
  const cases = [
    ["Supermercado", "Maçãs frescas", 8],
    ["Bebidas", "Água mineral", 5],
    ["Ferramentas", "Furadeira sem fio", 5],
    ["Saúde", "Sabonete líquido para as mãos", 6],
    ["Esportes e Fitness", "Bola de futebol", 6],
    ["Moda", "Camisa xadrez azul e preta", 8],
  ] as const;
  for (const [department, name, count] of cases) {
    await navigation
      .getByRole("button", { name: department, exact: true })
      .click();
    await expect(
      navigation.getByRole("button", { name: department, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    for (const id of ["produtos", "destaques", "mais-produtos"]) {
      const section = page.locator(`#${id}`);
      await expect(section.locator(".product-card")).toHaveCount(count);
      await expect(section.locator(".product-card").first()).toContainText(
        name,
      );
    }
    const card = first.locator(".product-card").first();
    await expect(card).toContainText("Preço demonstrativo");
    await expect(card.locator("img")).toHaveJSProperty("complete", true);
    expect(
      await card
        .locator("img")
        .evaluate((img: HTMLImageElement) => img.naturalWidth),
    ).toBeGreaterThan(0);
    const box = await card.boundingBox();
    expect(box!.width).toBeCloseTo(initialBox!.width, 0);
    expect(box!.height).toBeCloseTo(initialBox!.height, 0);
  }
  await navigation
    .getByRole("button", { name: "Tecnologia", exact: true })
    .click();
  await expect(first.locator(".product-card")).toHaveCount(10);
  await expect(first.locator(".product-card").first()).toContainText(
    "Iphone 11 PRO MAX BRANCO 1",
  );
  await expect(first.locator(".product-card").first()).not.toContainText(
    "Preço demonstrativo",
  );
});

test("Tecnologia mostra acessórios, tablets, notebooks e TVs com imagens locais", async ({
  page,
}) => {
  const first = page.locator("#produtos");
  const categories = [
    ["Acessórios", 8],
    ["Tablets", 3],
    ["Notebooks", 5],
    ["TVs", 4],
  ] as const;
  for (const [name, count] of categories) {
    const button = first.getByRole("button", { name, exact: true });
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(first.locator(".product-card")).toHaveCount(count);
    const image = first.locator(".product-card img").first();
    await expect(image).toHaveJSProperty("complete", true);
    expect(
      await image.evaluate((img: HTMLImageElement) => img.naturalWidth),
    ).toBeGreaterThan(0);
    await expect(first.locator(".product-card").first()).toContainText(
      "Preço demonstrativo",
    );
  }
});

test("filtros e carrinho funcionam entre departamentos com histórico e persistência", async ({
  page,
}) => {
  const navigation = page.getByRole("navigation", {
    name: "Navegar por departamento",
  });
  const first = page.locator("#produtos");
  await navigation
    .getByRole("button", { name: "Ferramentas", exact: true })
    .click();
  await first.getByRole("button", { name: "Furadeiras", exact: true }).click();
  await expect(first.locator(".product-card")).toHaveCount(2);
  await first
    .getByRole("button", {
      name: "Ver detalhes de Furadeira sem fio",
      exact: true,
    })
    .click();
  let dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Preço demonstrativo");
  await dialog
    .getByRole("button", {
      name: "Veja mais detalhes do produto >",
      exact: true,
    })
    .click();
  await dialog
    .getByRole("button", { name: "Salvar nos favoritos", exact: true })
    .click();
  await dialog.getByRole("button", { name: "Comprar", exact: true }).click();
  await dialog
    .getByRole("button", { name: "Fechar detalhes do produto", exact: true })
    .click();
  await navigation
    .getByRole("button", { name: "Esportes e Fitness", exact: true })
    .click();
  await first
    .getByRole("button", {
      name: "Ver detalhes de Bola de futebol",
      exact: true,
    })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Comprar", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Ver meu carrinho →", exact: true })
    .click();
  dialog = page.getByRole("dialog", { name: "Meu carrinho", exact: true });
  await expect(dialog).toContainText("Furadeira sem fio");
  await expect(dialog).toContainText("Bola de futebol");
  await expect(dialog).toContainText("319,80");
  await page.reload();
  await expect(
    navigation.getByRole("button", { name: "Esportes e Fitness", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Meu carrinho", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("319,80");
  await page
    .getByRole("button", { name: "Fechar carrinho", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Meus favoritos", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Furadeira sem fio");
  await page
    .getByRole("button", { name: "Fechar favoritos", exact: true })
    .click();
  await page.goBack();
  await expect(
    navigation.getByRole("button", { name: "Ferramentas", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(first.locator(".product-card")).toHaveCount(5);
});

test("ícones selecionados ficam azuis e a troca de departamento não rola a página", async ({
  page,
}) => {
  const navigation = page.getByRole("navigation", {
    name: "Navegar por departamento",
  });
  const tools = navigation.getByRole("button", {
    name: "Ferramentas",
    exact: true,
  });
  await tools.scrollIntoViewIfNeeded();
  const previousScroll = await page.evaluate(() => window.scrollY);
  await tools.click();
  await expect(tools).toHaveAttribute("aria-pressed", "true");
  await expect(tools.locator(".department-icon")).toHaveCSS(
    "color",
    "rgb(52, 66, 181)",
  );
  await expect(
    navigation
      .getByRole("button", { name: "Tecnologia", exact: true })
      .locator(".department-icon"),
  ).toHaveCSS("color", "rgb(22, 22, 22)");
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(
    previousScroll,
    0,
  );
  await expect(page.locator("#produtos .favorite-button")).toHaveCount(5);
});

test("Livros abre o catálogo, permite favoritar pelo cartão e pesquisar por Enter", async ({
  page,
}) => {
  await page
    .getByRole("navigation", { name: "Departamentos", exact: true })
    .getByRole("button", { name: "Livros", exact: true })
    .click();
  const first = page.locator("#produtos");
  await expect(first.locator(".product-card")).toHaveCount(6);
  const favorite = first.getByRole("button", {
    name: "Adicionar Dom Casmurro aos favoritos",
    exact: true,
  });
  await favorite.click();
  await expect(
    first.getByRole("button", {
      name: "Remover Dom Casmurro dos favoritos",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Meus favoritos", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Dom Casmurro");
  await page
    .getByRole("button", { name: "Fechar favoritos", exact: true })
    .click();
  await page.getByRole("searchbox").fill("mensagem");
  await page.getByRole("searchbox").press("Enter");
  await expect(first.locator(".product-card")).toHaveCount(1);
  await expect(first).toContainText("Mensagem");
  await first
    .getByRole("button", { name: "Ver detalhes de Mensagem", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Fernando Pessoa");
  await expect(page.getByRole("dialog")).toContainText("24,90");
});

test("conta e assinatura validam, persistem na sessão e permitem editar e cancelar", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Minha conta", exact: true }).click();
  let dialog = page.getByRole("dialog", { name: "Minha conta", exact: true });
  await expect(dialog).toContainText("sem autenticação real");
  await dialog
    .getByRole("button", { name: "Salvar perfil", exact: true })
    .click();
  await expect(dialog.getByLabel("Nome", { exact: true })).toBeVisible();
  await dialog.getByLabel("Nome", { exact: true }).fill("Yuri Silva");
  await dialog.getByLabel("E-mail", { exact: true }).fill("yuri@example.com");
  await dialog
    .getByRole("button", { name: "Salvar perfil", exact: true })
    .click();
  await expect(dialog).toContainText("Olá, Yuri Silva!");
  await dialog
    .getByRole("button", { name: "Editar perfil", exact: true })
    .click();
  await dialog.getByLabel("Nome", { exact: true }).fill("Yuri");
  await dialog
    .getByRole("button", { name: "Salvar perfil", exact: true })
    .click();
  await expect(dialog).toContainText("Olá, Yuri!");
  await page.emulateMedia({ contrast: "more" });
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await dialog
    .getByRole("button", { name: "Fechar minha conta", exact: true })
    .click();
  await page.getByRole("button", { name: "Assinatura", exact: true }).click();
  dialog = page.getByRole("dialog", { name: "Assinatura", exact: true });
  await expect(
    dialog.getByLabel("E-mail da assinatura", { exact: true }),
  ).toHaveValue("yuri@example.com");
  await dialog.getByLabel("Frequência", { exact: true }).selectOption("mensal");
  await dialog
    .getByRole("button", {
      name: "Ativar assinatura demonstrativa",
      exact: true,
    })
    .click();
  await expect(dialog.getByRole("checkbox")).not.toBeChecked();
  await dialog.getByRole("checkbox").check();
  await dialog
    .getByRole("button", {
      name: "Ativar assinatura demonstrativa",
      exact: true,
    })
    .click();
  await expect(dialog).toContainText("Assinatura demonstrativa ativa");
  await expect(dialog).toContainText("Frequência: mensal");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.reload();
  await page.getByRole("button", { name: "Assinatura", exact: true }).click();
  dialog = page.getByRole("dialog", { name: "Assinatura", exact: true });
  await expect(dialog).toContainText("Assinatura demonstrativa ativa");
  await dialog
    .getByRole("button", { name: "Cancelar assinatura", exact: true })
    .click();
  await expect(dialog.getByRole("status")).toContainText("cancelada");
  await dialog
    .getByRole("button", { name: "Fechar assinatura", exact: true })
    .click();
  await page.getByRole("button", { name: "Minha conta", exact: true }).click();
  dialog = page.getByRole("dialog", { name: "Minha conta", exact: true });
  await expect(dialog).toContainText("Olá, Yuri!");
  await dialog
    .getByRole("button", { name: "Sair do perfil", exact: true })
    .click();
  await expect(dialog.getByLabel("Nome", { exact: true })).toHaveValue("");
});
