<template>
  <ClientOnly v-if="!colorMode?.forced">
    <Button variant="outline" @click="isDark = !isDark">
      <Moon v-if="isDark" class="w-6 h-6" />
      <Sun v-if="!isDark" class="w-6 h-6" />
    </Button>
  </ClientOnly>
</template>

<script setup lang="ts">
// import { Icon } from "@iconify/vue";
import { Button } from "@/components/ui/button";
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
