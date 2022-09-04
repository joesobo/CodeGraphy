<template>
  <details :open="open" @toggle="toggleState" class="cursor-pointer w-full">
    <summary
      :tabindex="disabled ? -1 : 0"
      class="flex justify-between items-center list-none border-transparent hover:border-b hover:border-solid hover:border-white"
    >
      <h1
        :class="size === 'lg' ? 'text-base' : 'text-sm'"
        class="my-2 text-white font-semibold"
      >
        {{ title }}
      </h1>
      <div
        v-if="state"
        class="after:content-['▼'] h-4 w-4 text-center z-10 rotate-180"
      />
      <div v-else class="after:content-['▼'] h-4 w-4 text-center z-10" />
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
