<template>
	<div class="flex flex-col flex-start mb-4">
		<h1>CodeGraphy</h1>

		<Disclosure title="Full Graph" open>
			<div
				id="cy"
				ref="mainGraphElement"
				class="bg-zinc-900"
				:style="`height: ${windowWidth}px; width: ${windowWidth}px;`"
			></div>

			<button
				id="reload"
				class="w-full mb-2"
				@click="reload(mainCy, sortingOption)"
			>
				Reload
			</button>

			<label>Sorting:</label>
			<select id="sorting-options" class="ml-2 text-black">
				<option value="cose" selected>Cose</option>
				<option value="fcose">FCose</option>
				<option value="cose-bilkent">Cose Bilkent</option>
				<option value="cola">Cola</option>
				<option value="grid">Grid</option>
				<option value="random">Random</option>
				<option value="circle">Circle</option>
				<option value="concentric">Concentric</option>
				<option value="breadthfirst">Breadthfirst</option>
			</select>

			<div class="mt-2 flex items-center">
				<label>Hover:</label>
				<label class="mt-1 ml-2 relative inline-block w-8 h-4">
					<input
						id="hover-switch"
						type="checkbox"
						:checked="canUseHover"
						class="opacity-0 w-0 h-0 text-black"
						@click="toggleHover()"
					/>
					<span class="slider rounded-full before:rounded-full"></span>
				</label>
			</div>

			<div class="mt-2 flex items-center">
				<label>Hide Labels:</label>
				<label class="mt-1 ml-2 relative inline-block w-8 h-4">
					<input
						id="label-switch"
						type="checkbox"
						:checked="canUseLabels"
						class="opacity-0 w-0 h-0 text-black"
						@click="toggleLabels()"
					/>
					<span class="slider rounded-full before:rounded-full"></span>
				</label>
			</div>
		</Disclosure>

		<Disclosure title="Local Graph" class="mt-4">
			<div
				id="cy-relative"
				ref="relativeGraphElement"
				class="bg-zinc-900"
				:style="`height: ${windowWidth}px; width: ${windowWidth}px;`"
			></div>

			<div class="mt-2">
				<label>Local Depth:</label>
				<input
					id="local-depth"
					v-model="localDepth"
					class="ml-2 text-black"
					@change="refreshGraphs"
				/>
			</div>
		</Disclosure>

		<NodeMetaController :cy="mainCy" :cy-relative="relativeCy" />
	</div>
</template>

<script setup lang="ts">
import { Ref, ref, onMounted } from "vue"

import {
	canUseHover,
	toggleHover,
	canUseLabels,
	toggleLabels,
	sortingOption
} from "../utils/node"

import {
	reload,
	setupMainGraph,
	setupRelativeGraph,
	refreshMainGraph,
	refreshLocalGraph
} from "../utils/cytoscape"

import NodeMetaController from "./view/NodeMetaController.vue"
import Disclosure from "./components/Disclosure.vue"

let nodeFiles = files
let nodeConnections = connections
let nodeCurrentFile = currentFile

const mainGraphElement: Ref<HTMLElement | undefined> = ref()
const relativeGraphElement: Ref<HTMLElement | undefined> = ref()

let mainCy: Ref<any> = ref(null)
let relativeCy: Ref<any> = ref(null)

let localDepth = 1

let windowWidth: Ref<number> = ref(window.innerWidth - 32)

onMounted(() => {
	mainCy.value = setupMainGraph(mainGraphElement.value)
	relativeCy.value = setupRelativeGraph(relativeGraphElement.value)

	window.onresize = () => {
		windowWidth.value = window.innerWidth - 32
	}
})

// Handle the message inside the webview
window.addEventListener("message", (event) => {
	const message = event.data // The JSON data our extension sent

	switch (message.command) {
	case "setCurrentFile":
		nodeCurrentFile = message.text

		refreshGraphs()
		return
	case "setFilesAndConnections":
		nodeFiles = message.text.files
		nodeConnections = message.text.connections

		refreshGraphs()
		return
	}
})

const refreshGraphs = () => {
	refreshMainGraph(mainCy.value, nodeCurrentFile, nodeFiles, nodeConnections)
	refreshLocalGraph(
		relativeCy.value,
		nodeCurrentFile,
		nodeFiles,
		nodeConnections,
		localDepth
	)
}
</script>
