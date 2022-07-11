<template>
  <h1>CodeGraphy</h1>

  <h3>Full Graph</h3>
  <div id="cy"></div>

  <button id="reload" style="width: 100%; margin-bottom: 8px">Reload</button>

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
    <div id="cy-relative"></div>

    <div style="margin-top: 8px">
      <label>Local Depth:</label>
      <input style="margin-left: 8px" id="local-depth" value="1" />
    </div>
  </div>
</template>

<script setup lang="ts">
let canUseHover = true;
let canUseLabels = true;

const toggleHover = () => {
  canUseHover = !canUseHover;
};

const toggleLabels = () => {
  canUseLabels = !canUseLabels;
};
</script>
