<template>
  <Disclosure title="Whitelist" size="sm">
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
            v-model="groupsRef[index]"
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
import Disclosure from "../components/Disclosure.vue";

// @ts-ignore
let groups: any[] = whitelistSettings;
// @ts-ignore
let groupsRef: Ref<any[]> = ref(whitelistSettings);

const createNewGroup = () => {
  groupsRef.value.push(".test");

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
    command: "editWhitelistSettings",
    text: groups,
  });
};
</script>
