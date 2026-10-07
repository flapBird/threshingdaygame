import React from "react";
import { renderToString } from "react-dom/server";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import App from "../src/App";
import { staticPaths, pageMeta } from "../src/content";
const root = path.resolve("dist/client"),
  template = readFileSync(path.join(root, "index.html"), "utf8");
const esc = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
for (const route of staticPaths) {
  const meta = pageMeta(route),
    url = `https://threshingdaygame.xyz${route}`;
  const noindex = ["/404/", "/my-dragons/"].includes(route);
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${esc(meta.title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?\s*>/,
      `<meta name="description" content="${esc(meta.description)}"/>`,
    )
    .replace(
      /<link rel="canonical" href="[^"]*"\s*\/?\s*>/,
      `<link rel="canonical" href="${url}"/>`,
    )
    .replace(
      /<meta name="robots" content="[^"]*"\s*\/?\s*>/,
      `<meta name="robots" content="${noindex ? "noindex,follow" : "index,follow"}"/>`,
    )
    .replace(
      "</head>",
      `<meta property="og:title" content="${esc(meta.title)}"/><meta property="og:description" content="${esc(meta.description)}"/><meta property="og:type" content="website"/><meta property="og:url" content="${url}"/><meta property="og:image" content="https://threshingdaygame.xyz/images/social-cover.jpg"/><meta name="twitter:card" content="summary_large_image"/></head>`,
    )
    .replace(
      '<div id="root"></div>',
      `<div id="root" data-route="${route}">${renderToString(<App initialPath={route} />)}</div>`,
    );
  const folder = path.join(root, route);
  mkdirSync(folder, { recursive: true });
  writeFileSync(path.join(folder, "index.html"), html);
}
writeFileSync(
  path.join(root, "404.html"),
  readFileSync(path.join(root, "404/index.html")),
);
const urls = staticPaths.filter(
  (p) => !["/404/", "/play/", "/contact/", "/my-dragons/"].includes(p),
);
writeFileSync(
  path.join(root, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((p) => `<url><loc>https://threshingdaygame.xyz${p}</loc></url>`).join("")}</urlset>`,
);
console.log(`Prerendered ${staticPaths.length} static routes and sitemap.`);
