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
  await page.goto("/");
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
  await page.emulateMedia({ contrast: "more" });
  const violations = (
    await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze()
  ).violations;
  expect(violations).toEqual([]);
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
  await expect(first.getByRole("status")).toContainText("Nenhum produto");
  await first.getByRole("button", { name: "Ver todos", exact: true }).click();
  await expect(first.locator(".product-card")).toHaveCount(10);
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
  await page.emulateMedia({ contrast: "more" });
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
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

test("carrinho e favoritos persistem sem modificar a vitrine inicial", async ({
  page,
}) => {
  const first = page.locator("#produtos");
  await expect(first.getByRole("combobox")).toHaveCount(0);
  await expect(first.locator(".favorite-button")).toHaveCount(0);
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
