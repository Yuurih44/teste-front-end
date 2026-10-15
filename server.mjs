import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve("dist");
const types = {
  ".json": "application/json; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff2": "font/woff2",
};
createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405).end();
    return;
  }
  if (url.pathname === "/api/products") {
    try {
      const response = await fetch(
        "https://app.econverse.com.br/teste-front-end/junior/tecnologia/lista-produtos/produtos.json",
        { signal: AbortSignal.timeout(10000) },
      );
      if (!response.ok) throw new Error("Upstream unavailable");
      const data = await response.text();
      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(req.method === "HEAD" ? undefined : data);
    } catch {
      res
        .writeHead(502, { "Content-Type": "application/json" })
        .end(JSON.stringify({ error: "Catálogo indisponível" }));
    }
    return;
  }
  try {
    const path = resolve(
      root,
      "." +
        decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname),
    );
    if (!path.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    const data = await readFile(path);
    res.writeHead(200, {
      "Content-Type": types[extname(path)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(req.method === "HEAD" ? undefined : data);
  } catch {
    res.writeHead(404).end("Não encontrado");
  }
}).listen(Number(process.env.PORT || 3000), "0.0.0.0", () =>
  console.log("Aplicação disponível na porta " + (process.env.PORT || 3000)),
);
