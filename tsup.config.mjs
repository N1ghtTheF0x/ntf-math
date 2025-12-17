import { defineConfig } from "tsup"
import Package from "./package.json" with {type: "json"}

export default defineConfig({
    entry: ["./source/index.ts"],
    clean: true,
    dts: true,
    format: ["cjs","esm"],
    target: "esnext",
    platform: "neutral",
    define: {
        PKG_NAME: JSON.stringify(Package.name),
        PKG_VERSION: JSON.stringify(Package.version)
    }
})