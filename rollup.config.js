import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import { terser } from "rollup-plugin-terser"
import typescript from "@rollup/plugin-typescript"
import path from "path"
import fs from "fs"

const production = !process.env.ROLLUP_WATCH

export default fs
	.readdirSync(path.join(__dirname, "src", "renderView"))
	.map((input) => {
		const name = input.split(".")[0]
		return {
			input: "src/renderView/" + input,
			output: {
				sourcemap: true,
				format: "iife",
				name: "app",
				file: "dist/compiled/" + name + ".js"
			},
			plugins: [
				// If you have external dependencies installed from
				// npm, you'll most likely need these plugins. In
				// some cases you'll need additional configuration -
				// consult the documentation for details:
				// https://github.com/rollup/plugins/tree/master/packages/commonjs
				resolve({
					browser: true
				}),
				commonjs(),
				typescript({
					tsconfig: "tsconfig.json",
					sourceMap: !production,
					inlineSources: !production
				}),

				// In dev mode, call `npm run start` once
				// the bundle has been generated
				// !production && serve(),

				// Watch the `public` directory and refresh the
				// browser on changes when not in production
				// !production && livereload("public"),

				// If we're building for production (npm run build
				// instead of npm run dev), minify
				production && terser()
			],
			watch: {
				clearScreen: false
			}
		}
	})
