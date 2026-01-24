import { build } from "tsdown"
import { argv } from "node:process"
import Package from "./package.json" with {type: "json"}

const PROD = argv.includes("prod")

await build({
    name: Package.name,
    entry: ["source/index.ts"],
    format: ["cjs","esm"],
    outDir: "dist",
    dts: true,
    clean: true,
    target: "esnext",
    platform: "neutral",
    define: {
        PKG_NAME: JSON.stringify(Package.name),
        PKG_VERSION: JSON.stringify(Package.version)
    },
    minify: PROD,
    sourcemap: !PROD
})