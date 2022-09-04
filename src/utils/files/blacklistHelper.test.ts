import { containsBlacklist } from "./blacklistHelper"

// returns true for anything that matches in the blacklist
// Expected blacklist settings:
// .js
// file.js
// folder/
describe("blacklist", () => {
	describe("extension tests", () => {
		const testInputs = ["file.js", "folder/file.js"]
		const blacklistSettings: string[] = [".js"]

		testInputs.forEach((input) => {
			test(`blacklist '.js' filters [${input}] out`, () => {
				expect(containsBlacklist(input, blacklistSettings)).toBeTruthy()
			})
		})
	})

	describe("file tests", () => {
		const testInputs = ["file.js", "folder/file.js"]
		const blacklistSettings: string[] = ["file.js"]

		testInputs.forEach((input) => {
			test(`blacklist 'file.js' filters [${input}] out`, () => {
				expect(containsBlacklist(input, blacklistSettings)).toBeTruthy()
			})
		})
	})

	describe("folder tests", () => {
		const testInputs = [
			"folder",
			"folder/",
			"folder/*",
			"folder/file.js",
			"nested/folder/file.js"
		]
		const blacklistSettings: string[] = ["folder"]

		testInputs.forEach((input) => {
			test(`blacklist 'folder' filters [${input}] out`, () => {
				expect(containsBlacklist(input, blacklistSettings)).toBeTruthy()
			})
		})
	})
})
