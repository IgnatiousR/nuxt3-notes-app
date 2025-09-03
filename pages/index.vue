<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { Pencil, SquarePen, Trash2, ChevronRight } from "lucide-vue-next";
definePageMeta({
  middleware: ["auth"],
});

useHead({
  title: "Notes",
});

const updateNoted = ref("");
async function updateNote() {
  console.log("Updated");
}

const notes = ref();
const selectedNote = ref({ id: null, title: "", content: "", updatedAt: Date.now() });
onMounted(async () => {
  // const reponse = await $fetch("/api/notes");
  // console.log(reponse);
  notes.value = await $fetch("/api/notes");
  if (notes.value.length > 0) selectedNote.value = notes.value[0];
  console.log("s:", selectedNote.value);
});

// const { data, pending, error, refresh } = await useFetch('/api/notes')
// console.log("UseFetch:",data.value);

const show = ref(true);
</script>
<template>
  <div>
    <div class="h-screen flex dark:bg-zinc-900 bg-zinc-100">
      <div
        :class="[show ? 'w-[400px] p-8' : 'w-20 p-4']"
        class="hidden md:block dark:bg-black bg-white overflow-hidden transition-all duration-200"
      >
        <div class="flex justify-between">
          <div v-if="show" class="flex items-center">
            <Pencil class="w-6 h-6 mr-2 text-yellow-500" />
            <h1 class="font-semibold text-xl">Notes<span class="text-yellow-500">App</span></h1>
          </div>

          <Button variant="secondary" size="icon" @click="show = !show"
            ><ChevronRight :class="[show ? '-rotate-180' : '']" class="w-4 h-4 transition-all duration-500" />
            <!-- <ChevronLeft v-if="show" class="w-4 h-4" /> -->
          </Button>
        </div>

        <!-- today container -->
        <div v-auto-animate>
          <div v-if="show">
            <p class="font-bold text-xs mt-12 mb-4">Today</p>
            <div class="ml-2 space-y-2">
              <div
                v-for="note in notes"
                :key="note.id"
                :class="{
                  'bg-yellow-600': note.id == selectedNote.id,
                  'hover:bg-yellow-600/50': note.id !== selectedNote.id,
                }"
                class="p-3 rounded-lg cursor-pointer"
                @click="selectedNote = note"
              >
                <h3 class="text-sm font-bold text-white">{{ note.title }}</h3>
                <div class="text-sm space-x-2">
                  <span class="text-zinc-100">{{
                    new Date(note.updatedAt).toLocaleDateString() === new Date().toLocaleDateString()
                      ? "Today"
                      : new Date(note.updatedAt).toLocaleDateString()
                  }}</span>
                  <span class="text-zinc-50 line-clamp-2">{{ note.content }}</span>
                </div>
              </div>
              <!-- <div class="p-3 rounded outline-white dark:outline-black outline-solid hover:outline-yellow-500">
                <h3 class="text-sm font-bold">Finished reading</h3>
                <div class="text-sm space-x-2">
                  <span class="text-zinc-800 dark:text-zinc-50">Today</span>
                  <span class="text-zinc-800 dark:text-zinc-50">The Midnight library</span>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="w-full">
        <div class="flex justify-between w-full p-4 items-start">
          <Button variant="ghost" class="dark:text-zinc-400 text-zinc-700 hover:cursor-pointer"
            ><SquarePen class="w-6 h-6 dark:text-zinc-300 text-zinc-800" /> Create Note</Button
          >
          <div class="flex space-x-2">
            <button
              class="dark:text-zinc-400 text-zinc-600 hover:cursor-pointer hover:dark:text-white hover:text-black"
            >
              <Trash2 class="w-5 h-5" />
            </button>
            <ColorSelector />
          </div>
        </div>

        <div class="mx-10 md:mx-50 mt-10">
          <h2 class="text-xl mb-2">{{ selectedNote.title }}</h2>
          <p class="mb-2">{{ new Date(selectedNote.updatedAt).toLocaleDateString() }}</p>
          <div class="grid w-full gap-2">
            <Textarea v-model="selectedNote.content" class="text-zinc-400" @input="updateNote" />
            <!-- <Button>Send message</Button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
