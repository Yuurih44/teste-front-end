// O contrato informa valores numéricos sem indicar centavos; os preços são tratados em reais.
export const money = (price: number) =>
  price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
