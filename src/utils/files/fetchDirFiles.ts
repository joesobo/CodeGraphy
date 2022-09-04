import fs from "fs"
import path from "path"
import { containsBlacklist } from "./blacklistHelper"

let files: string[] = []
let dirs: string[] = []

// returns a full list of files in a dir and its subdirs
// ignores any files or folders blacklisted
export const fetchDirFiles = (
	directory: any,
	blacklistSettings: string[],
	clear?: boolean
) => {
	if (clear) {
		files = []
		dirs = []
	}

	try {
		const dirContent = fs.readdirSync(directory)

		dirContent.forEach((dirPath) => {
			const fullPath = path.join(directory, dirPath)

			if (!containsBlacklist(fullPath, blacklistSettings)) {
				if (fs.statSync(fullPath).isFile()) {
					files.push(fullPath)
				} else {
					dirs.push(fullPath)
				}
			}
		})

		if (dirs.length !== 0) {
			fetchDirFiles(dirs.pop(), blacklistSettings, false)
		}

		return files
	} catch (ex) {
		console.log(ex)
		return []
	}
}
