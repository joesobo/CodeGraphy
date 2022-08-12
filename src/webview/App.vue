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

    <button @click="toggleMainGraph()" class="hover-button">
      <h3>Full Graph</h3>
    </button>
    <div v-show="displayMainGraph">
      <div id="cy" ref="cyElement"></div>

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

      <NodeMetaController :cy="mainCy" :cyRelative="relativeCy" />
    </div>

    <button
      @click="toggleRelativeGraph()"
      class="hover-button"
      style="margin-top: 32px"
    >
      <h3>Local Graph</h3>
    </button>
    <div v-show="displayRelativeGraph">
      <div id="cy-relative" ref="cyElementRelative"></div>

      <div style="margin-top: 8px">
        <label>Local Depth:</label>
        <input
          style="margin-left: 8px"
          id="local-depth"
          v-model="localDepth"
          @change="depthChange"
        />
      </div>
    </div>
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

// @ts-ignore
const nodeFiles = files;
// @ts-ignore
const nodeConnections = connections;
// @ts-ignore
let nodeCurrentFile = currentFile;

const cyElement: Ref<HTMLElement | undefined> = ref();
const cyElementRelative: Ref<HTMLElement | undefined> = ref();

let displayMainGraph: Ref<boolean> = ref(true);
let displayRelativeGraph: Ref<boolean> = ref(false);

let mainCy: Ref<any> = ref(null);
let relativeCy: Ref<any> = ref(null);

let localDepth = 1;

onMounted(() => {
  if (cyElement.value && cyElementRelative.value) {
    let nodes = processData(nodeFiles, nodeConnections);
    let cy = getNewCytoscape(nodes, styles(canUseLabels), cyElement.value);

    // set initial style for opened file
    setNodeStyles(cy, nodeCurrentFile);

    runNodeHover(cy);
    runNodeLabels(cy);
    runNodeSort(cy);
    mainCy.value = cy;

    nodes = processData(nodeFiles, nodeConnections, 1, nodeCurrentFile);
    let cyRelative = getNewCytoscape(
      nodes,
      styles(canUseLabels),
      cyElementRelative.value
    );

    // set initial style for opened file
    setNodeStyles(cyRelative, nodeCurrentFile);

    relativeCy.value = cyRelative;

    reload(cy, "reload");
    reload(cyRelative, "reload");

    runNodeClick(mainCy.value, relativeCy.value);
  }
});

// Handle the message inside the webview
window.addEventListener("message", (event) => {
  const message = event.data; // The JSON data our extension sent

  switch (message.command) {
    case "setCurrentFile":
      nodeCurrentFile = message.text;
  }
});

const depthChange = () => {
  let nodes = processData(
    nodeFiles,
    nodeConnections,
    localDepth,
    nodeCurrentFile
  );

  relativeCy.value.elements().remove();
  relativeCy.value.add(nodes);

  // set initial style for opened file
  setNodeStyles(relativeCy.value, nodeCurrentFile);

  reload(relativeCy.value, "reload");

  mainCy.value.off("click");
  runNodeClick(mainCy.value, relativeCy.value, localDepth);
};

const toggleMainGraph = () => {
  displayMainGraph.value = !displayMainGraph.value;
};

const toggleRelativeGraph = () => {
  displayRelativeGraph.value = !displayRelativeGraph.value;
};
</script>
