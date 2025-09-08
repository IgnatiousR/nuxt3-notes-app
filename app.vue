<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt';
import { Toaster } from "@/components/ui/sonner";
</script>
 
<template>
  <Analytics />
  <Toaster rich-colors theme="dark" position="top-center" :expand="true" />
  <NuxtPage />
</template>
