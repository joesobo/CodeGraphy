import { Connection } from "utils/connections"

declare global {
	let connections: Connection[][]
	let files: string[]
	let currentFile: string
	let nodeSettings: Record<string, any>[]
	let blacklistSettings: string[]
	let vscode: any

	interface Window {
		process: any
	}
}
