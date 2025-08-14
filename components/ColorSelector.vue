<template>
  <ClientOnly v-if="!colorMode?.forced">
    <Button @click="isDark = !isDark">
      <!-- <Icon
        :icon="isDark ? 'radix-icons:moon' : 'radix-icons:sun'"
        class="h-32 w-32 dark:text-black text-white"
      /> -->
      <Moon v-if="isDark" color="black" :size="32" />
      <Sun v-if="!isDark" color="white" :size="32" />
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
