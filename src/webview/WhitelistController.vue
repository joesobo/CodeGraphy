<template>
  <Disclosure title="Whitelist" ref="nodeGroupController" size="sm">
    <div
      style="
        display: flex;
        flex-direction: column;
        background-color: #1e1e1e;
        padding: 8px;
      "
    >
      <!-- Loop for number of groups -->
      <div v-for="(group, index) in groupsRef" :key="index">
        <div style="display: flex; align-items: center">
          <!-- Extension input -->
          <input
            style="border-radius: 8px; border: none; padding: 4px"
            v-model="group.extension"
            @change="updateSettings"
          />

          <!-- Clear Button -->
          <button
            @click="removeGroupAtIndex(index)"
            style="background: none; margin: 0"
          >
            X
          </button>
        </div>
      </div>

      <button @click="createNewGroup" style="margin-right: 8px; width: 100%">
        New Group
      </button>
    </div>
  </Disclosure>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import Disclosure from "./Disclosure.vue";

const nodeGroupController: Ref<HTMLElement | undefined> = ref();

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
    groups.splice(index, 1);
  }

  updateSettings();
};

const updateSettings = () => {
  // @ts-ignore
  vscode.postMessage({
    command: "editSettings",
    text: groups,
  });
};
</script>
