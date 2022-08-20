<template>
  <details :open="open" @toggle="toggleState">
    <summary :tabindex="disabled ? -1 : 0">
      <h1
        style="margin-top: 0.5em; margin-bottom: 0.5em; color: white"
        :style="size === 'lg' ? 'font-size: 1.5em;' : 'font-size: 1em;'"
      >
        {{ title }}
      </h1>
      <div v-if="state" class="dropdown-icon rotate" />
      <div v-else class="dropdown-icon" />
    </summary>

    <slot />
  </details>
</template>

<script setup lang="ts">
import { ref } from "vue";

type DisclosureProps = {
  title: string;
  size?: string;
  open?: boolean;
  disabled?: boolean;
};

const props = withDefaults(defineProps<DisclosureProps>(), {
  open: false,
  disabled: false,
  size: "lg",
});

let state = ref(props.open);

const toggleState = () => {
  state.value = !state.value;
};

if (state.value) {
  toggleState();
}
</script>
