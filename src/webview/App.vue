<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 16px;
    "
  >
    <h1>CodeGraphy</h1>

    <Disclosure title="Full Graph" open>
      <div
        id="cy"
        ref="mainGraphElement"
        :style="`height: ${windowWidth}px; width: ${windowWidth}px; background-color: #1e1e1e;`"
      ></div>

      <button
        id="reload"
        style="width: 100%; margin-bottom: 8px"
        @click="reload(mainCy, sortingOption)"
      >
        Reload
      </button>

      <label>Sorting:</label>
      <select style="margin-left: 8px" id="sorting-options">
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

      <div style="margin-top: 8px; display: flex; align-items: center">
        <label>Hover:</label>
        <label class="switch">
          <input
            type="checkbox"
            id="hover-switch"
            :checked="canUseHover"
            @click="toggleHover()"
          />
          <span class="slider round"></span>
        </label>
      </div>

      <div style="margin-top: 8px; display: flex; align-items: center">
        <label>Hide Labels:</label>
        <label class="switch">
          <input
            type="checkbox"
            id="label-switch"
            :checked="canUseLabels"
            @click="toggleLabels()"
          />
          <span class="slider round"></span>
        </label>
      </div>
    </Disclosure>

    <Disclosure title="Local Graph" style="margin-top: 32px">
      <div
        id="cy-relative"
        ref="relativeGraphElement"
        :style="`height: ${windowWidth}px; width: ${windowWidth}px; background-color: #1e1e1e;`"
      ></div>

      <div style="margin-top: 8px">
        <label>Local Depth:</label>
        <input
          style="margin-left: 8px"
          id="local-depth"
          v-model="localDepth"
          @change="refreshLocalGraph(relativeCy, nodeCurrentFile, localDepth)"
        />
      </div>
    </Disclosure>

    <Disclosure title="Config" size="sm" style="margin-top: 32px">
      <NodeMetaController :cy="mainCy" :cyRelative="relativeCy" />
      <WhitelistController />
      <BlacklistController />
    </Disclosure>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, onMounted } from "vue";

import {
  canUseHover,
  toggleHover,
  canUseLabels,
  toggleLabels,
  sortingOption,
} from "../utils/node";

import {
  reload,
  setupMainGraph,
  setupRelativeGraph,
  refreshMainGraph,
  refreshLocalGraph,
} from "../utils/cytoscape";

import NodeMetaController from "./view/NodeMetaController.vue";
import WhitelistController from "./view/WhitelistController.vue";
import BlacklistController from "./view/BlacklistController.vue";

import Disclosure from "./components/Disclosure.vue";

// @ts-ignore
let nodeFiles = files;
// @ts-ignore
let nodeConnections = connections;
// @ts-ignore
let nodeCurrentFile = currentFile;

const mainGraphElement: Ref<HTMLElement | undefined> = ref();
const relativeGraphElement: Ref<HTMLElement | undefined> = ref();

let mainCy: Ref<any> = ref(null);
let relativeCy: Ref<any> = ref(null);

let localDepth = 1;

let windowWidth: Ref<number> = ref(window.innerWidth - 32);

onMounted(() => {
  mainCy.value = setupMainGraph(mainGraphElement.value);
  relativeCy.value = setupRelativeGraph(relativeGraphElement.value);

  window.onresize = () => {
    windowWidth.value = window.innerWidth - 32;
  };
});

// Handle the message inside the webview
window.addEventListener("message", (event) => {
  const message = event.data; // The JSON data our extension sent

  switch (message.command) {
    case "setCurrentFile":
      nodeCurrentFile = message.text;

      refreshMainGraph(mainCy.value, nodeCurrentFile);
      refreshLocalGraph(relativeCy.value, nodeCurrentFile, localDepth);
      return;
    case "setFilesAndConnections":
      nodeFiles = message.text.files;
      nodeConnections = message.text.connections;

      refreshMainGraph(mainCy.value, nodeCurrentFile);
      refreshLocalGraph(relativeCy.value, nodeCurrentFile, localDepth);
      return;
  }
});
</script>
