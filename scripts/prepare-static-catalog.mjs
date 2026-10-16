import { mkdir, writeFile } from "node:fs/promises";

if (process.env.SITES_STATIC_CATALOG !== "1") process.exit(0);

const source =
  "https://app.econverse.com.br/teste-front-end/junior/tecnologia/lista-produtos/produtos.json";
const response = await fetch(source, { signal: AbortSignal.timeout(15000) });
if (!response.ok) {
  throw new Error(
    `Não foi possível obter o catálogo oficial (${response.status}).`,
  );
}

const catalog = await response.json();
if (!catalog || catalog.success !== true || !Array.isArray(catalog.products)) {
  throw new Error("O catálogo oficial retornou um formato inválido.");
}

await mkdir("dist/api", { recursive: true });
await writeFile("dist/api/products", JSON.stringify(catalog));
console.log(
  `Catálogo oficial preparado para o site (${catalog.products.length} produtos).`,
);
