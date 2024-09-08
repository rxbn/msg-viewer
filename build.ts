import html from 'bun-plugin-html';

Bun.build({
  entrypoints: ["./index.html"],
  outdir: "./build",
  minify: true,
  plugins: [
    html({ inline: true }),
  ]
});