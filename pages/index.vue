<script setup lang="ts">
import { Textarea } from "@/components/ui/textarea";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { Input } from "@/components/ui/input"
import { Pencil, SquarePen, Trash2, LogOut, MenuIcon } from "lucide-vue-next";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from '@/components/ui/skeleton'
import { ref, onMounted, onBeforeUnmount } from "vue";
import { toast } from "vue-sonner";

definePageMeta({
  middleware: ["auth"],
});

useHead({
  title: "Notes",
});

interface Note {
  id: number | null
  title: string
  content: string
  updatedAt: number
}

const textarea = ref<InstanceType<typeof Textarea> | null>(null)
const updatedNote = ref<Note>({
  id: null,
  title: "",
  content: "",
  updatedAt: Date.now(),
});
const notes = ref();
const selectedNote = ref<Note>({
  id: null,
  title: "",
  content: "",
  updatedAt: Date.now(),
});
const show = ref(true);
const editing = ref(false);
const isLoading = ref(true);
const sheetOpen = ref(false)

function enableEdit() {
  editing.value = true;
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

  const index = notes.value.findIndex((note: Note) => {
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
  toast.success("Logged out successfully!", { duration: 1500 });
  setTimeout(() => {
    navigateTo("/login");
  }, 1500);
}

function handleResize() {
  if (window.innerWidth >= 768) {
    sheetOpen.value = false // 👈 auto-close when going to desktop
  }
}


onMounted(async () => {
  isLoading.value = true;
  window.addEventListener("resize", handleResize);
  try{
    notes.value = await $fetch("/api/notes");
  if (notes.value.length > 0) selectedNote.value = notes.value[0];
  else {
    await createNewNote();
    selectedNote.value = notes.value[0];
  }
  updatedNote.value = selectedNote.value;
  textarea.value?.$el?.focus();
  }
  catch(err){console.error(err);}
  finally {
    isLoading.value = false;
  }
  
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize)
})
</script>
<template>
  <div>
    <div class="h-screen flex dark:bg-zinc-900 bg-zinc-100">
      <div
        class="hidden md:block w-[400px] p-8 dark:bg-black bg-white overflow-auto transition-all duration-200 flex flex-col"
      >
        <div class="flex justify-between">
          <div v-if="show" class="flex items-center">
            <Pencil class="w-6 h-6 mr-2 text-yellow-500" />
            <h1 class="font-semibold text-xl">Notes<span class="text-yellow-500">App</span></h1>
          </div>
        </div>

        <!-- today container -->
        <div v-auto-animate class="flex-grow">
          <div v-if="show">
            <p class="font-bold text-xs mt-12 mb-4">Notes</p>

            <div v-if="isLoading" class="ml-2 space-y-2">
              <Skeleton class="h-[125px] w-[240px] rounded-lg border-1" />
              <Skeleton class="h-[125px] w-[240px] rounded-lg border" />
              <Skeleton class="h-[125px] w-[240px] rounded-lg border" />
              <Skeleton class="h-[125px] w-[240px] rounded-lg border" />
              <Skeleton class="h-[125px] w-[240px] rounded-lg border" />
            </div>

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
                    textarea?.$el?.focus();
                  }
                "
              >
                <h3 class="text-sm font-bold dark:text-white">{{ note.title }}</h3>
                <div class="text-sm space-x-2">
                  <span class="dark:text-zinc-100">{{ new Date(note.updatedAt).toLocaleDateString() }}</span>
                  <span class="dark:text-zinc-50 line-clamp-2">{{ note.content }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full">
        <div class="flex justify-between w-full p-4 items-start">
          <Sheet v-model:open="sheetOpen">
            <SheetTrigger as-child>
              <button 
                :disabled="isLoading" 
                class="block md:hidden"
                :class="{ 'cursor-not-allowed': isLoading, 'cursor-pointer': !isLoading }"
              >
                <MenuIcon
                  class="w-5 h-5 dark:text-zinc-300 text-zinc-800 hover:dark:text-white"
                  :class="{ 'opacity-50': isLoading }"
                />
              </button>
            </SheetTrigger>

            <SheetContent side="left" class="block md:hidden w-[300px] p-6">
              <div class="flex justify-between">
                <div v-if="show" class="flex items-center">
                  <Pencil class="w-6 h-6 mr-2 text-yellow-500" />
                  <h1 class="font-semibold text-xl">Notes<span class="text-yellow-500">App</span></h1>
                </div>
              </div>

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
                          selectedNote = note
                          textarea?.$el?.focus()
                          sheetOpen = false 
                        }
                      "
                    >
                      <h3 class="text-sm font-bold dark:text-white">{{ note.title }}</h3>
                      <div class="text-sm space-x-2">
                        <span class="dark:text-zinc-100">{{ new Date(note.updatedAt).toLocaleDateString() }}</span>
                        <span class="dark:text-zinc-50 line-clamp-2">{{ note.content }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <button
            :disabled="isLoading" 
            :class="{ 'cursor-not-allowed': isLoading, 'cursor-pointer': !isLoading }"
            class="flex gap-2 items-center dark:text-zinc-400 text-zinc-700 hover:dark:text-white"
            @click="createNewNote"
            ><SquarePen class="w-5 h-5 dark:text-zinc-300 text-zinc-800" /> Create Note</button
          >
          <div class="flex space-x-4">
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <button
                  :disabled="isLoading" 
                  :class="{ 'cursor-not-allowed': isLoading, 'cursor-pointer': !isLoading }"
                  class="dark:text-zinc-400 text-zinc-600 hover:dark:text-white hover:text-black"
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
                  <AlertDialogCancel class="cursor-pointer">Cancel</AlertDialogCancel>
                  <AlertDialogAction class="cursor-pointer bg-red-500 hover:bg-red-600" @click="deleteNote">Continue</AlertDialogAction>
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

        <div v-if="isLoading" class="mx-10 md:mx-50 mt-10 space-y-2">
          <Skeleton class="h-[28px] w-full rounded-lg" />
          <Skeleton class="h-[25px] w-full rounded-lg" />
          <Skeleton class="h-[125px] w-full rounded-lg" />
        </div>
        <div v-else class="mx-10 md:mx-50 mt-10">
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
            <Textarea ref="textarea" v-model="selectedNote.content" class="text-zinc-600 dark:text-zinc-400" @input="debounceFn" />
            <!-- <Button>Send message</Button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
