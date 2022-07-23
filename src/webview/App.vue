<template>
  <h1>CodeGraphy</h1>
  <div id="cy" ref="cyElement"></div>

  <h3>Full Graph</h3>

  <button
    id="reload"
    style="width: 100%; margin-bottom: 8px"
    @click="reload(mainCy, sortingOption)"
  >
    Reload
  </button>

  <div style="display: flex; flex-direction: column; margin-bottom: 8px">
    <div>
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
    </div>

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

    <h3 style="margin-top: 32px">Local Graph</h3>
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
</template>

<script setup lang="ts">
import { Ref, ref, onMounted } from "vue";
import { processData } from "../utils/dataProcessor";
import { styles, reload } from "../utils/cytoscapeHelper";
import { getNewCytoscape } from "../utils/cytoscapeGraphCreator";
import { runNodeClick } from "../utils/nodeClick";
import { canUseHover, toggleHover, runNodeHover } from "../utils/nodeHover";
import { canUseLabels, toggleLabels, runNodeLabels } from "../utils/nodeLabels";
import { sortingOption, runNodeSort } from "../utils/nodeSort";

// @ts-ignore
const nodeFiles = files;
// @ts-ignore
const nodeConnections = connections;
// @ts-ignore
const nodeCurrentFile = currentFile;

const cyElement: Ref<HTMLElement | undefined> = ref();
const cyElementRelative: Ref<HTMLElement | undefined> = ref();

let mainCy: any = null;
let relativeCy: any = null;

let localDepth = 1;

onMounted(() => {
  if (cyElement.value && cyElementRelative.value) {
    let nodes = processData(nodeFiles, nodeConnections);
    let cy = getNewCytoscape(nodes, styles(canUseLabels), cyElement.value);
    runNodeHover(cy);
    runNodeClick(cy);
    runNodeLabels(cy);
    runNodeSort(cy);
    mainCy = cy;

    nodes = processData(nodeFiles, nodeConnections, 1, nodeCurrentFile);
    let cyRelative = getNewCytoscape(
      nodes,
      styles(canUseLabels),
      cyElementRelative.value
    );
    relativeCy = cyRelative;

    reload(cy, "reload");
    reload(cyRelative, "reload");
  }
});

const depthChange = () => {
  let nodes = processData(
    nodeFiles,
    nodeConnections,
    localDepth,
    nodeCurrentFile
  );

  relativeCy.elements().remove();
  relativeCy.add(nodes);
  reload(relativeCy, "reload");
};
</script>
