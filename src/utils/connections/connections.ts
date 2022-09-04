import readline from "readline"
import fs from "fs"

export type Connection = {
	group: string
	data: {
		id: string
		source: number
		target: number
	}
}

const findConnections = async (
	files: string[],
	startIndex: number,
	currentPath: string
): Promise<Connection[]> => {
	const connections: Connection[] = []

	const lineReader = readline.createInterface({
		input: fs.createReadStream(files[startIndex])
	})
	const sanitizedFiles = sanitize(files)
	const file = sanitizedFiles[startIndex]

	for await (const line of lineReader) {
		// if line starts with import
		if (line.startsWith("import")) {
			// split line up by spaces
			const lineArr = line.split(" ")
			// set import path = to whatever comes after `from`
			const fromIndex = lineArr.findIndex((el) => el === "from")
			let importPath = lineArr[fromIndex + 1].replace(";", "")
			let lastIndex = -1

			// check if root path
			if (importPath.startsWith("'") || importPath.startsWith("\"")) {
				importPath = importPath.replace(/["']/g, "")
				let testPath = ""

				// if a relative path, walk back from current path
				if (importPath.startsWith(".")) {
					const relativePathArr = importPath.split("/")
					const tempPath = file.split("/")

					if (importPath.startsWith("..")) {
						tempPath.pop()
					}

					relativePathArr.forEach((element) => {
						if (element === "." || element === "..") {
							tempPath.pop()
						} else {
							tempPath.push(element)
						}
					})

					testPath = tempPath.join("/")
				}
				// if a direct path, search root dir following path
				else {
					testPath = `${currentPath}/${importPath}`
				}

				lastIndex = indexOfPath(sanitizedFiles, testPath)
			}
			// if just a name, look for file in files
			else {
				lastIndex = indexOfNode(sanitizedFiles, importPath.slice(-1))
			}

			if (lastIndex !== -1) {
				connections.push({
					group: "edges",
					data: {
						id: startIndex + "-" + lastIndex,
						source: startIndex,
						target: lastIndex
					}
				})
			}
		}
	}

	return connections
}

const indexOfPath = (files: string[], testPath: string) => {
	for (let index = 0; index < files.length; index++) {
		if (files[index].includes(testPath)) {
			return index
		}
	}

	return -1
}

const indexOfNode = (files: string[], edgeNode: string) => {
	for (let index = 0; index < files.length; index++) {
		const file = files[index]
		const extensionlessFile = file.split("/")
		const directFileName = extensionlessFile[extensionlessFile.length - 1]

		if (directFileName === edgeNode) {
			return index
		}
	}

	return -1
}

const sanitize = (files: string[]): string[] => {
	const santizedFiles: string[] = []

	files.forEach((file) => {
		santizedFiles.push(
			JSON.stringify(file)
				.replace(";", "")
				.replace(/\\\\/g, "/")
				.replace("\\", "/")
		)
	})

	return santizedFiles
}

export const getConnections = async (files: string[], currentPath: string) => {
	const connections = []
	for (let index = 0; index < files.length; index++) {
		const result = await findConnections(files, index, currentPath)
		if (result.length > 0) {
			connections.push(result)
		}
	}
	return connections
}
