<script setup>
import { ref } from "vue";

const show = ref(true);
</script>

<template>
  <div v-auto-animate class="bg-black p-8 inline-block overflow-hidden">
    <button
      class="px-4 py-2 bg-yellow-500 rounded-md text-black font-bold"
      @click="show = !show"
    >
      Toggle
    </button>

    <!-- width animates here -->
    <div
      :class="[show ? 'w-[400px]' : 'w-0']"
      class="mt-4 bg-black text-white p-4 rounded-lg overflow-hidden transition-all duration-500"
    >
      Animated div 🚀
    </div>
  </div>
</template>
