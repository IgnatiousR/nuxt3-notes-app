<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { Pencil, SquarePen, Trash2, ChevronRight, LogOut } from "lucide-vue-next";
import { ref, onMounted } from "vue";
definePageMeta({
  middleware: ["auth"],
});

useHead({
  title: "Notes",
});

const textarea = ref(null);
const updatedNote = ref({ id: null, title: "", content: "", updatedAt: Date.now() });
const notes = ref();
const selectedNote = ref({ id: null, title: "", content: "", updatedAt: Date.now() });
const show = ref(true);
const editing = ref(false);
const isLoading = ref(true);

function enableEdit() {
  editing.value = true;
  // wait for next DOM update then focus input
  requestAnimationFrame(() => {
    const input = document.getElementById("inline-input");
    input?.focus();
  });
}

function disableEdit() {
  editing.value = false;
}

const debounceFn = useDebounceFn(async () => {
  await updateNote();
}, 1000);

async function updateNote() {
  try {
    await $fetch(`/api/notes/${selectedNote.value.id}`, {
      method: "PATCH",
      body: {
        // title: updatedNote.value.title,
        // content: updatedNote.value.content,
        title: selectedNote.value.title,
        content: selectedNote.value.content,
      },
    });
  } catch (err) {
    console.error(err);
  }
}

async function deleteNote() {
  console.log("Deleted");
  await $fetch(`/api/notes/${selectedNote.value.id}`, {
    method: "DELETE",
  });

  const index = notes.value.findIndex((note) => {
    return note.id === selectedNote.value.id;
  });
  console.log(index);
  notes.value.splice(index, 1);
  selectedNote.value = notes.value[0];
  textarea.value?.$el?.focus();
}

async function createNewNote() {
  try {
    const newNote = await $fetch("/api/notes", {
      method: "POST",
    });
    notes.value.unshift(newNote);
    selectedNote.value = notes.value[0];
    // textarea.value.focus();
    textarea.value?.$el?.focus();
  } catch (err) {
    console.error(err);
  }
}

function logout() {
  const jwtCookie = useCookie("NotesJWT");
  jwtCookie.value = null;
  navigateTo("/login");
}

onMounted(async () => {
  notes.value = await $fetch("/api/notes");
  if (notes.value.length > 0) selectedNote.value = notes.value[0];
  else {
    await createNewNote();
    selectedNote.value = notes.value[0];
  }
  updatedNote.value = selectedNote.value;
  textarea.value?.$el?.focus();
});

// const { data, pending, error, refresh } = await useFetch('/api/notes')
// console.log("UseFetch:",data.value);
</script>
<template>
  <div>
    <div class="h-screen flex dark:bg-zinc-900 bg-zinc-100">
      <div
        :class="[show ? 'w-[400px] p-8' : 'w-20 p-4']"
        class="dark:bg-black bg-white overflow-auto scrollbar-thin dark:scrollbar-thumb-zinc-800 dark:scrollbar-track-zinc-900 transition-all duration-200 flex flex-col"
      >
        <div class="flex justify-between">
          <div v-if="show" class="flex items-center">
            <Pencil class="w-6 h-6 mr-2 text-yellow-500" />
            <h1 class="font-semibold text-xl">Notes<span class="text-yellow-500">App</span></h1>
          </div>

          <!-- <Button variant="secondary" size="icon" @click="show = !show"
            ><ChevronRight :class="[show ? '-rotate-180' : '']" class="w-4 h-4 transition-all duration-500" />
          </Button> -->
        </div>

        <!-- today container -->
        <div v-auto-animate class="flex-grow">
          <div v-if="show">
            <p class="font-bold text-xs mt-12 mb-4">Notes</p>

            <div class="ml-2 space-y-2">
              <div
                v-for="note in notes"
                :key="note.id"
                :class="{
                  'bg-yellow-600': note.id == selectedNote.id,
                  'hover:bg-yellow-600/50': note.id !== selectedNote.id,
                }"
                class="p-3 rounded-lg cursor-pointer border"
                @click="
                  () => {
                    selectedNote = note;
                    textarea.$el?.focus();
                  }
                "
              >
                <h3 class="text-sm font-bold dark:text-white">{{ note.title }}</h3>
                <div class="text-sm space-x-2">
                  <span class="dark:text-zinc-100">{{ new Date(note.updatedAt).toLocaleDateString() }}</span>
                  <span class="dark:text-zinc-50 line-clamp-2">{{ note.content }}</span>
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
          <Button
            variant="ghost"
            class="dark:text-zinc-400 text-zinc-700 hover:cursor-pointer hover:dark:text-white"
            @click="createNewNote"
            ><SquarePen class="w-6 h-6 dark:text-zinc-300 text-zinc-800" /> Create Note</Button
          >
          <div class="flex space-x-4">
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <button
                  class="dark:text-zinc-400 text-zinc-600 hover:cursor-pointer hover:dark:text-white hover:text-black"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle class="text-red-500">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription class="text-red-600">
                    The note will be deleted permanently.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction @click="deleteNote">Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <ColorSelector />
            <button
              class="dark:text-zinc-400 text-zinc-600 hover:cursor-pointer hover:dark:text-white hover:text-black"
              @click="logout"
            >
              <LogOut class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="mx-10 md:mx-50 mt-10">
          <h2 v-if="!editing" class="text-xl mb-2 cursor-pointer" @click="enableEdit">{{ selectedNote.title }}</h2>
          <Input
            v-else
            id="inline-input"
            v-model="selectedNote.title"
            type="text"
            placeholder="Title"
            class="text-xl mb-2"
            @input="debounceFn"
            @blur="disableEdit"
            @keyup.enter="disableEdit"
          />
          <p class="mb-2">{{ new Date(selectedNote.updatedAt).toLocaleDateString() }}</p>
          <div class="grid w-full gap-2">
            <Textarea ref="textarea" v-model="selectedNote.content" class="text-zinc-400" @input="debounceFn" />
            <!-- <Button>Send message</Button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
