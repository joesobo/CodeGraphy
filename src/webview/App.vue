<template>
  <div>Click the button to increase the number</div>
  <div>{{ count }}</div>
  <button @click="inc">Increase</button>
</template>

<script lang="ts">
import { ref } from "vue";

export default {
  setup() {
    const count = ref(0);
    const inc = () => {
      count.value++;
    };
    return {
      count,
      inc,
    };
  },
};
</script>
