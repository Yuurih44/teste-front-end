import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import Newsletter from "./Newsletter";
test("valida o cadastro demonstrativo sem enviar dados ao servidor", async () => {
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);
  const user = userEvent.setup();
  render(<Newsletter onTerms={() => {}} />);
  await user.type(
    screen.getByRole("textbox", { name: "Seu nome" }),
    "Pessoa Teste",
  );
  await user.type(
    screen.getByRole("textbox", { name: "Seu e-mail" }),
    "teste@example.com",
  );
  await user.click(screen.getByRole("checkbox"));
  await user.click(screen.getByRole("button", { name: "Inscrever" }));
  expect(screen.getByRole("status")).toHaveTextContent(
    "Nenhum dado foi enviado",
  );
  expect(fetch).not.toHaveBeenCalled();
});
