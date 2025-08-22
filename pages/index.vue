<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { Pencil, SquarePen, Trash2, ChevronRight } from "lucide-vue-next";
definePageMeta({
  middleware: ["auth"],
});

// function changeSize() {
//   size.value = 0;
// }
const show = ref(true);
</script>
<template>
  <div>
    <div class="h-screen flex bg-zinc-900">
      <!-- sidebar -->
      <!-- <div :class="`bg-black w-[${size}px] p-8`"> -->

      <div
        :class="[show ? 'w-[400px] p-8' : 'w-20 p-4']"
        class="bg-black overflow-hidden transition-all duration-200"
      >
        <div class="flex justify-between">
          <div v-if="show" class="flex items-center">
            <Pencil class="w-6 h-6 mr-2 text-yellow-500" />
            <h1 class="font-semibold text-xl text-white">
              Notes<span class="text-yellow-500">App</span>
            </h1>
          </div>

          <Button variant="secondary" size="icon" @click="show = !show"
            ><ChevronRight
              :class="[show ? '-rotate-180' : '']"
              class="w-4 h-4 transition-all duration-500"
            />
            <!-- <ChevronLeft v-if="show" class="w-4 h-4" /> -->
          </Button>
        </div>

        <!-- today container -->
        <div v-auto-animate>
          <div v-if="show">
            <p class="font-bold text-xs mt-12 mb-4">Today</p>
            <div class="ml-2 space-y-2">
              <div class="p-3 bg-yellow-600 rounded-lg">
                <h3 class="text-sm font-bold">Finished reading</h3>
                <div class="text-sm space-x-2">
                  <span class="text-zinc-100">Today</span>
                  <span class="text-zinc-50">The Midnight library</span>
                </div>
              </div>
              <div
                class="p-3 rounded outline-black outline-solid hover:outline-yellow-500"
              >
                <h3 class="text-sm font-bold">Finished reading</h3>
                <div class="text-sm space-x-2">
                  <span class="text-zinc-100">Today</span>
                  <span class="text-zinc-50">The Midnight library</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- /today container -->

        <!-- yesterday container -->
        <!-- <div :class="{ hidden: !show }">
          <p class="font-bold text-xs mt-12 mb-4">Today</p>
          <div class="ml-2 space-y-2">
            <div class="p-3 bg-yellow-500 rounded-lg">
              <h3 class="text-sm font-bold">Finished reading</h3>
              <div class="text-sm space-x-2">
                <span class="text-zinc-100">Today</span>
                <span class="text-zinc-50">The Midnight library</span>
              </div>
            </div>
            <div
              class="p-3 rounded outline-black outline-solid hover:outline-yellow-500"
            >
              <h3 class="text-sm font-bold">Finished reading</h3>
              <div class="text-sm space-x-2">
                <span class="text-zinc-100">Today</span>
                <span class="text-zinc-50">The Midnight library</span>
              </div>
            </div>
          </div>
        </div> -->
        <!-- /yesterday container -->

        <!-- last 30 days container -->
        <!-- /last 30 days container -->
      </div>

      <div class="flex justify-between w-full p-4 items-start">
        <Button variant="ghost" class="text-zinc-400 hover:cursor-pointer"
          ><SquarePen class="w-6 h-6 text-zinc-300" /> Create Note</Button
        >
        <button class="text-zinc-400 hover:cursor-pointer hover:text-white">
          <Trash2 class="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>
</template>
