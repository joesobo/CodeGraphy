<template>
	<Disclosure title="Config" size="sm" class="mt-8">
		<div class="flex flex-col bg-zinc-900 p-2">
			<h2 class="text-base font-semibold">Selected</h2>
			<div class="flex items-center h-8 pb-2">
				<!-- Extension input -->
				<p class="text-xs font-bold">Selected Color:</p>

				<!-- Color picker -->
				<ColorInput
					v-model="selectedRef"
					position="top"
					format="hex"
					disable-alpha
					class="ml-[78px]"
					@change="updateSelectedSetting"
				/>
			</div>

			<h2 class="text-base font-semibold">Node Meta</h2>
			<!-- Loop for number of groups -->
			<div v-for="(group, index) in groupsRef" :key="index">
				<div class="flex items-center h-8">
					<!-- Extension input -->
					<input
						v-model="group.extension"
						class="rounded-lg border-none p-1 h-6 text-black"
						@change="updateMetaSettings"
					/>

					<!-- Color picker -->
					<ColorInput
						v-model="group.color"
						position="top"
						format="hex"
						disable-alpha
						class="ml-2"
						@change="updateMetaSettings"
					/>

					<!-- Clear Button -->
					<button class="bg-transparent m-0" @click="removeGroupAtIndex(index)">
						X
					</button>
				</div>
			</div>

			<button class="mr-2 w-full" @click="createNewGroup">New Group</button>
		</div>
	</Disclosure>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue"
import { setNodeStyles } from "../../utils/cytoscape/cytoscapeHelper"
import Disclosure from "../components/Disclosure.vue"
import ColorInput from "vue-color-input"

const props = defineProps<{ cy: any; cyRelative: any }>()

let groups: any[] = nodeSettings
let groupsRef: Ref<any[]> = ref(nodeSettings)
let selectedRef: Ref<string> = ref(selectedColor)

const createNewGroup = () => {
	groupsRef.value.push({
		extension: ".test"
	})

	updateMetaSettings()
}

const removeGroupAtIndex = (index: number) => {
	if (index > -1) {
		groupsRef.value.splice(index, 1)
	}

	updateMetaSettings()
}

const updateSelectedSetting = () => {
	selectedColor = selectedRef.value
	vscode.postMessage({
		command: "editSelectedSetting",
		text: selectedRef.value
	})

	setNodeStyles(props.cy, currentFile)
	setNodeStyles(props.cyRelative, currentFile)
}

const updateMetaSettings = () => {
	nodeSettings = groupsRef.value
	vscode.postMessage({
		command: "editMetaSettings",
		text: groups
	})

	setNodeStyles(props.cy, currentFile)
	setNodeStyles(props.cyRelative, currentFile)
}
</script>
