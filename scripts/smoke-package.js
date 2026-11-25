import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { fileURLToPath, URL } from "node:url";

const project = fileURLToPath(new URL("../", import.meta.url));
const { name } = JSON.parse(readFileSync(join(project, "package.json"), "utf8"));
const npm = process.env.npm_execpath;
assert.ok(npm, "Run this check with npm run test:package");

const consumer = mkdtempSync(join(tmpdir(), "react-transfer-list-package-"));
const cache = join(consumer, "npm-cache");

function runNpm(args, cwd) {
  // A publish dry run still needs a real tarball inside the temporary directory.
  return execFileSync(
    process.execPath,
    [npm, ...args, "--no-dry-run", "--cache", cache],
    {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "inherit"],
    },
  );
}

try {
  // prepack calls this script, so the nested pack must skip lifecycle scripts.
  const [{ filename, files }] = JSON.parse(
    runNpm(
      ["pack", "--ignore-scripts", "--json", "--pack-destination", consumer],
      project,
    ),
  );
  const paths = new Set(files.map(({ path }) => path));
  for (const entry of ["dist/index.cjs", "dist/index.esm.js", "dist/index.d.ts"]) {
    assert.ok(paths.has(entry), `Missing package entry: ${entry}`);
  }

  runNpm(
    [
      "install",
      "--offline",
      "--ignore-scripts",
      "--legacy-peer-deps",
      "--no-package-lock",
      "--no-audit",
      "--no-fund",
      join(consumer, filename),
    ],
    consumer,
  );

  // Use the repository's installed peer dependencies without hitting the registry.
  for (const peer of ["react", "react-dom"]) {
    symlinkSync(
      join(project, "node_modules", peer),
      join(consumer, "node_modules", peer),
      "junction",
    );
  }

  const specifier = JSON.stringify(name);
  const checks = `
    assert.equal(typeof pkg.TransferList, "function");
    assert.equal(pkg.default, pkg.TransferList);
    assert.equal(typeof pkg.mapToFilterOptions, "function");
    const html = renderToString(createElement(pkg.TransferList, {
      label: "Package smoke test",
      remoteUrl: [],
    }));
    assert.match(html, /Package smoke test included/);
  `;

  for (const [format, imports] of [
    [
      "commonjs",
      `
        const assert = require("node:assert/strict");
        const pkg = require(${specifier});
        const { createElement } = require("react");
        const { renderToString } = require("react-dom/server");
      `,
    ],
    [
      "module",
      `
        import assert from "node:assert/strict";
        import * as pkg from ${specifier};
        import { createElement } from "react";
        import { renderToString } from "react-dom/server";
      `,
    ],
  ]) {
    execFileSync(
      process.execPath,
      [`--input-type=${format}`, "--eval", imports + checks],
      {
        cwd: consumer,
        stdio: "inherit",
      },
    );
  }
  process.stdout.write("Packed CommonJS and ESM entry points passed.\n");
} finally {
  rmSync(consumer, { recursive: true, force: true });
}
