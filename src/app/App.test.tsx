import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, test, expect } from "vitest";
import App from "./App";
const products = [
  {
    productName: "Iphone branco",
    descriptionShort: "Descrição do branco",
    photo: "https://example.com/white.png",
    price: 15000,
  },
  {
    productName: "Iphone mini",
    descriptionShort: "Descrição do mini",
    photo: "https://example.com/mini.png",
    price: 9000,
  },
];
const success = () =>
  Promise.resolve({
    ok: true,
    json: async () => ({ success: true, products }),
  });
test("abre o produto selecionado, calcula quantidade e devolve o foco ao fechar", async () => {
  vi.stubGlobal("fetch", vi.fn(success));
  const user = userEvent.setup();
  render(<App />);
  const trigger = (
    await screen.findAllByRole("button", {
      name: "Ver detalhes de Iphone mini",
    })
  )[0];
  await user.click(trigger);
  const dialog = screen.getByRole("dialog", { name: "Iphone mini" });
  expect(dialog).toHaveTextContent("Descrição do mini");
  expect(dialog).toHaveTextContent("9.000,00");
  expect(
    screen.getByRole("button", { name: "Diminuir quantidade" }),
  ).toBeDisabled();
  await user.click(screen.getByRole("button", { name: "Aumentar quantidade" }));
  await user.click(screen.getByRole("button", { name: /^Comprar$/ }));
  expect(screen.getByText(/2 unidades no carrinho/)).toHaveTextContent(
    "18.000,00",
  );
  await user.click(
    screen.getByRole("button", { name: "Fechar detalhes do produto" }),
  );
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});
test("mostra erro e permite tentar novamente", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockImplementation(success),
  );
  const user = userEvent.setup();
  render(<App />);
  expect((await screen.findAllByRole("alert"))[0]).toHaveTextContent(
    "Não foi possível",
  );
  await user.click(
    screen.getAllByRole("button", { name: "Tentar novamente" })[0],
  );
  expect(
    (
      await screen.findAllByRole("button", {
        name: "Ver detalhes de Iphone branco",
      })
    )[0],
  ).toBeInTheDocument();
});
test("não atribui produtos a categorias ausentes do JSON", async () => {
  vi.stubGlobal("fetch", vi.fn(success));
  render(<App />);
  await screen.findAllByRole("button", {
    name: "Ver detalhes de Iphone branco",
  });
  fireEvent.click(screen.getByRole("button", { name: "Tablets" }));
  expect(screen.getByRole("status")).toHaveTextContent("Nenhum produto");
  fireEvent.click(screen.getAllByRole("button", { name: "Ver todos" })[0]);
  expect(document.querySelectorAll(".product-card")).toHaveLength(6);
});
test("aborta a requisição pendente ao desmontar", async () => {
  let signal: AbortSignal | undefined;
  vi.stubGlobal(
    "fetch",
    vi.fn((_url, options) => {
      signal = options.signal;
      return new Promise(() => {});
    }),
  );
  const { unmount } = render(<App />);
  await waitFor(() => expect(signal).toBeDefined());
  unmount();
  expect(signal?.aborted).toBe(true);
});

test("filtra a vitrine pela busca e permite recuperar o catálogo", async () => {
  vi.stubGlobal("fetch", vi.fn(success));
  const user = userEvent.setup();
  render(<App />);
  await screen.findAllByRole("button", {
    name: "Ver detalhes de Iphone branco",
  });
  await user.type(screen.getByRole("searchbox"), "MINI");
  await user.click(screen.getByRole("button", { name: "Buscar" }));
  const first = document.getElementById("produtos")!;
  expect(first.querySelectorAll(".product-card")).toHaveLength(1);
  expect(first).toHaveTextContent("Iphone mini");
  expect(first).not.toHaveTextContent("Iphone branco");
  await user.clear(screen.getByRole("searchbox"));
  await user.click(screen.getByRole("button", { name: "Buscar" }));
  expect(
    document.getElementById("produtos")!.querySelectorAll(".product-card"),
  ).toHaveLength(2);
});

test("adiciona ao carrinho, recalcula quantidade e restaura os itens salvos", async () => {
  vi.stubGlobal("fetch", vi.fn(success));
  const user = userEvent.setup();
  const view = render(<App />);
  await user.click(
    (
      await screen.findAllByRole("button", {
        name: "Ver detalhes de Iphone mini",
      })
    )[0],
  );
  await user.click(screen.getByRole("button", { name: "Aumentar quantidade" }));
  await user.click(screen.getByRole("button", { name: "Comprar" }));
  await user.click(screen.getByRole("button", { name: "Ver meu carrinho →" }));
  let dialog = screen.getByRole("dialog", { name: "Meu carrinho" });
  expect(dialog).toHaveTextContent("18.000,00");
  await user.click(
    screen.getByRole("button", { name: "Aumentar quantidade de Iphone mini" }),
  );
  expect(dialog).toHaveTextContent("27.000,00");
  view.unmount();
  render(<App />);
  await screen.findAllByRole("button", { name: "Ver detalhes de Iphone mini" });
  await user.click(screen.getByRole("button", { name: "Meu carrinho" }));
  dialog = screen.getByRole("dialog", { name: "Meu carrinho" });
  expect(dialog).toHaveTextContent("27.000,00");
  await user.click(
    screen.getByRole("button", { name: "Remover Iphone mini do carrinho" }),
  );
  expect(dialog).toHaveTextContent("Seu carrinho está vazio");
});

test("salva um favorito pelos detalhes sem acrescentar controles à vitrine inicial", async () => {
  vi.stubGlobal("fetch", vi.fn(success));
  const user = userEvent.setup();
  render(<App />);
  await user.click(
    (
      await screen.findAllByRole("button", {
        name: "Ver detalhes de Iphone branco",
      })
    )[0],
  );
  await user.click(
    screen.getByRole("button", { name: "Veja mais detalhes do produto >" }),
  );
  await user.click(
    screen.getByRole("button", { name: "Salvar nos favoritos" }),
  );
  await user.click(
    screen.getByRole("button", { name: "Fechar detalhes do produto" }),
  );
  await user.click(screen.getByRole("button", { name: "Meus favoritos" }));
  expect(
    screen.getByRole("dialog", { name: "Meus favoritos" }),
  ).toHaveTextContent("Iphone branco");
  await user.click(
    screen.getByRole("button", { name: "Remover Iphone branco dos favoritos" }),
  );
  expect(screen.getByRole("dialog")).toHaveTextContent(
    "Sua lista começa com um favorito",
  );
});

test("ordena resultados e sincroniza o campo ao voltar para ofertas", async () => {
  vi.stubGlobal("fetch", vi.fn(success));
  const user = userEvent.setup();
  render(<App />);
  await screen.findAllByRole("button", {
    name: "Ver detalhes de Iphone branco",
  });
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  await user.type(screen.getByRole("searchbox"), "iphone");
  await user.click(screen.getByRole("button", { name: "Buscar" }));
  await user.selectOptions(
    screen.getByRole("combobox", { name: "Ordenar por" }),
    "price-asc",
  );
  expect(document.querySelector("#produtos .product-card")).toHaveTextContent(
    "Iphone mini",
  );
  await user.click(screen.getByRole("button", { name: "Ofertas do dia" }));
  expect(screen.getByRole("searchbox")).toHaveValue("");
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
});
