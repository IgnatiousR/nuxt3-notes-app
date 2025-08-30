<!-- <script setup>
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
    <div
      :class="[show ? 'w-[400px]' : 'w-0']"
      class="mt-4 bg-black text-white p-4 rounded-lg overflow-hidden transition-all duration-500"
    >
      Animated div 🚀
    </div>
  </div>
</template> -->
<template>
  <div class="mx-50">
    <TipTapEditor />
    <div class="w-20 h-20 bg-red-500 text-center hover:bg-yellow-500 hover:scale-150 ease-in-out transition duration-200">a</div>
  </div>
</template>

<script setup>
import TipTapEditor from '~/components/TipTapEditor.vue';

</script>