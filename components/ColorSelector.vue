<template>
  <ClientOnly v-if="!colorMode?.forced">
    <!-- <Button variant="outline" class="cursor-pointer border-0 bg-transparent" @click="isDark = !isDark">
      <Moon v-if="isDark" class="w-6 h-6" />
      <Sun v-if="!isDark" class="w-6 h-6" />
    </Button> -->
    <button
      class="dark:text-zinc-400 text-zinc-600 hover:cursor-pointer hover:dark:text-white hover:text-black"
      @click="isDark = !isDark"
    >
      <Moon v-if="isDark" class="w-5 h-5" />
      <Sun v-if="!isDark" class="w-5 h-5" />
    </button>
  </ClientOnly>
</template>

<script setup lang="ts">
// import { Icon } from "@iconify/vue";
// import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-vue-next";

const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});
</script>
