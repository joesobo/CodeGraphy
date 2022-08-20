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
        ref="cyElement"
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
        ref="cyElementRelative"
        :style="`height: ${windowWidth}px; width: ${windowWidth}px; background-color: #1e1e1e;`"
      ></div>

      <div style="margin-top: 8px">
        <label>Local Depth:</label>
        <input
          style="margin-left: 8px"
          id="local-depth"
          v-model="localDepth"
          @change="refreshLocalGraph"
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

import { processData } from "../utils/dataProcessor";
import { styles, reload, setNodeStyles } from "../utils/cytoscapeHelper";
import { getNewCytoscape } from "../utils/cytoscapeGraphCreator";
import { runNodeClick } from "../utils/nodeClick";
import { canUseHover, toggleHover, runNodeHover } from "../utils/nodeHover";
import { canUseLabels, toggleLabels, runNodeLabels } from "../utils/nodeLabels";
import { sortingOption, runNodeSort } from "../utils/nodeSort";

import NodeMetaController from "./NodeMetaController.vue";
import Disclosure from "./Disclosure.vue";
import WhitelistController from "./WhitelistController.vue";
import BlacklistController from "./BlacklistController.vue";

// @ts-ignore
let nodeFiles = files;
// @ts-ignore
let nodeConnections = connections;
// @ts-ignore
let nodeCurrentFile = currentFile;
// @ts-ignore
let nodeWhitelistSettings: string[] = whitelistSettings;

const cyElement: Ref<HTMLElement | undefined> = ref();
const cyElementRelative: Ref<HTMLElement | undefined> = ref();

let mainCy: Ref<any> = ref(null);
let relativeCy: Ref<any> = ref(null);

let localDepth = 1;

let windowWidth: Ref<number> = ref(window.innerWidth - 32);

onMounted(() => {
  if (cyElement.value && cyElementRelative.value) {
    let nodes = processData(nodeFiles, nodeConnections, nodeWhitelistSettings);
    let cy = getNewCytoscape(nodes, styles(canUseLabels), cyElement.value);

    runNodeHover(cy);
    runNodeLabels(cy);
    runNodeSort(cy);
    runNodeClick(cy, nodes);
    mainCy.value = cy;

    nodes = processData(
      nodeFiles,
      nodeConnections,
      nodeWhitelistSettings,
      1,
      nodeCurrentFile
    );
    let cyRelative = getNewCytoscape(
      nodes,
      styles(canUseLabels),
      cyElementRelative.value
    );

    runNodeSort(cyRelative);
    runNodeClick(cyRelative, nodes);

    relativeCy.value = cyRelative;

    refreshMainGraph();
    refreshLocalGraph();
  }

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

      refreshMainGraph();
      refreshLocalGraph();
    case "setFilesAndConnections":
      nodeFiles = message.text.files;
      nodeConnections = message.text.connections;

      refreshMainGraph();
      refreshLocalGraph();
  }
});

const refreshMainGraph = () => {
  let nodes = processData(nodeFiles, nodeConnections, nodeWhitelistSettings);

  mainCy.value.elements().remove();
  mainCy.value.add(nodes);

  setNodeStyles(mainCy.value, nodeCurrentFile);

  reload(mainCy.value, "reload");
};

const refreshLocalGraph = () => {
  let nodes = processData(
    nodeFiles,
    nodeConnections,
    nodeWhitelistSettings,
    localDepth,
    nodeCurrentFile
  );

  relativeCy.value.elements().remove();
  relativeCy.value.add(nodes);

  // turn off old click listener to update with new depth nodes
  relativeCy.value.off("click");
  runNodeClick(relativeCy.value, nodes);

  setNodeStyles(relativeCy.value, nodeCurrentFile);

  reload(relativeCy.value, "reload");
};
</script>
