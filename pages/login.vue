<script setup lang="ts">
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
// import { h } from "vue";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "vue-sonner";
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css";
import { Loader2, Pencil, MoveRight } from "lucide-vue-next";

const loading = ref(false);

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  toast.success("After 3 sec");
  setTimeout(() => {
    loading.value = false;
    navigateTo("/");
  }, 3000);

  // toast("You submitted the following values:", {
  //   description: "" + values.username,
  // });

  try {
    const response = await $fetch("/api/user", {
      method: "POST",
      body: {
        email: values.email,
        password: values.password,
      },
    });

    console.log("res:", response);

    toast.success("Account registered successfully.");
  } catch (error) {
    if (error && typeof error === "object" && "response" in error) {
      const err = error as { response?: { _data?: { message?: string } } };
      console.log("Err:", err.response?._data?.message);
      toast.error(err.response?._data?.message || "Something went wrong");
    } else {
      console.error("Unexpected error", error);
      toast.error("Something went wrong");
    }
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <div class="h-screen flex bg-zinc-900">
      <!-- sidebar -->
      <div class="bg-black w-[518px] p-8 flex flex-col justify-center">
        <div class="flex items-center">
          <Pencil class="w-6 h-6 mr-2 text-yellow-500" />
          <h1 class="font-semibold text-xl text-white">
            Notes<span class="text-yellow-500">App</span>
          </h1>
        </div>

        <h1 class="font-bold text-lg mt-8">Log in to your account</h1>
        <p class="text-sm">
          Don't have an account?
          <NuxtLink
            to="/register"
            class="font-bold text-yellow-500 underline mt-0.5"
            >Sign up</NuxtLink
          >
          for one
        </p>

        <form class="space-y-5 mt-10" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem v-auto-animate>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="shadcn@g.c"
                  v-bind="componentField"
                />
              </FormControl>
              <!-- <FormDescription> </FormDescription> -->
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem v-auto-animate>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="********"
                  v-bind="componentField"
                />
              </FormControl>
              <!-- <FormDescription> </FormDescription> -->
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- <Button type="submit"> Submit </Button> -->
          <Button
            :disabled="loading"
            class="items-center mt-4 bg-yellow-500 rounded-full w-full px-4 py-2 text-black text-sm font-bold cursor-pointer hover:bg-yellow-600"
            ><Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" /> Login
            <MoveRight class="w-5 h-5 mr-2" />
          </Button>
          <!-- <Toaster
            close-button
            rich-colors
            theme="dark"
            position="top-center"
            :expand="true"
          /> -->
          <Toaster
            rich-colors
            theme="dark"
            position="top-center"
            :expand="true"
          />
        </form>
      </div>

      <div>Main</div>
    </div>
  </div>
</template>
