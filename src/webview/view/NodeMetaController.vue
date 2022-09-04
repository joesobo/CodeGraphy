<template>
  <Disclosure title="Config" size="sm" class="mt-8">
    <div class="flex flex-col bg-zinc-900 p-2">
      <!-- Loop for number of groups -->
      <div v-for="(group, index) in groupsRef" :key="index">
        <div class="flex items-center h-8">
          <!-- Extension input -->
          <input
            class="rounded-lg border-none p-1 h-6 text-black"
            v-model="group.extension"
            @change="updateSettings"
          />

          <!-- Color picker -->
          <ColorInput
            v-model="group.color"
            position="top"
            format="hex"
            disable-alpha
            class="ml-2"
          />

          <!-- Clear Button -->
          <button @click="removeGroupAtIndex(index)" class="bg-transparent m-0">
            X
          </button>
        </div>
      </div>

      <button @click="createNewGroup" class="mr-2 w-full">New Group</button>
    </div>
  </Disclosure>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { setNodeStyles } from "../../utils/cytoscape/cytoscapeHelper";
import ColorInput from "vue-color-input";
import Disclosure from "../components/Disclosure.vue";

const props = defineProps(["cy", "cyRelative"]);

// @ts-ignore
let groups: any[] = nodeSettings;
// @ts-ignore
let groupsRef: Ref<any[]> = ref(nodeSettings);

const createNewGroup = () => {
  groupsRef.value.push({
    extension: ".test",
    color: "#fff",
  });

  updateSettings();
};

const removeGroupAtIndex = (index: number) => {
  if (index > -1) {
    groupsRef.value.splice(index, 1);
  }

  updateSettings();
};

const updateSettings = () => {
  // @ts-ignore
  vscode.postMessage({
    command: "editMetaSettings",
    text: groups,
  });

  setNodeStyles(props.cy);
  setNodeStyles(props.cyRelative);
};
</script>
