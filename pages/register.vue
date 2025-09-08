<script setup lang="ts">
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
// import { h } from "vue";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "vue-sonner";
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css";
import { Loader2, Pencil, MoveRight, Eye, EyeOff } from "lucide-vue-next";

definePageMeta({
  middleware: ["block-auth"],                  
})

useHead({
    title: 'Register',
})

const loading = ref(false);
const show_password = ref(false);
const show_password_confirm = ref(false);

const formSchema = toTypedSchema(
  z
    .object({
      username: z.string().min(2).max(50),
      email: z.string().email().min(2).max(50),
      password: z.string().min(6),
      password_confirmation: z.string().min(6),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: "Passwords don't match",
      path: ["password_confirmation"],
    })
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;

  try {
    const response = await $fetch("/api/user", {
      method: "POST",
      body: {
        name: values.username,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      },
    });

    console.log("res:", response);

    toast.success("Account registered successfully.");
    setTimeout(() => {
      loading.value = false;
      navigateTo("/");
    }, 3000);
  } catch (error) {
    // console.log("Err:", error.response?._data?.message);
    // toast.error(error.response?._data?.message);
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
    <div class="h-screen flex">
      <!-- sidebar -->
      <div class="bg-zinc-100 dark:bg-zinc-900 w-[518px] p-8 flex flex-col justify-center">
        <div class="flex items-center">
          <Pencil class="w-6 h-6 mr-2 text-yellow-500" />
          <h1 class="font-semibold text-xl dark:text-white">
            Notes<span class="text-yellow-500">App</span>
          </h1>
        </div>

        <h1 class="font-bold text-lg mt-8">Sign up for a free account</h1>
        <p class="text-sm">
          Already registered?
          <NuxtLink
            to="/login"
            class="font-bold text-yellow-500 underline mt-0.5"
            >Log in</NuxtLink
          >
          to your account
        </p>

        <form class="space-y-5 mt-10" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem v-auto-animate>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Name" v-bind="componentField" />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem v-auto-animate>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
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
                <div class="relative w-full items-center">
                  <Input
                    :type="show_password ? 'text' : 'password'"
                    :placeholder="show_password ? 'Password' : '********'"
                    v-bind="componentField"
                  />
                  <div
                    class="absolute end-0 inset-y-0 flex items-center justify-center px-2 mr-1 cursor-pointer"
                    @click="show_password = !show_password"
                  >
                    <EyeOff
                      v-if="!show_password"
                      class="size-5 text-muted-foreground"
                    />
                    <Eye
                      v-if="show_password"
                      class="size-5 text-muted-foreground"
                    />
                  </div>
                </div>
              </FormControl>
              <!-- <FormDescription> </FormDescription> -->
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password_confirmation">
            <FormItem v-auto-animate>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div class="relative w-full items-center">
                  <Input
                    :type="show_password_confirm ? 'text' : 'password'"
                    :placeholder="
                      show_password_confirm
                        ? 'Confirm Password'
                        : '****************'
                    "
                    v-bind="componentField"
                  />
                  <div
                    class="absolute end-0 inset-y-0 flex items-center justify-center px-2 mr-1 cursor-pointer"
                    @click="show_password_confirm = !show_password_confirm"
                  >
                    <EyeOff
                      v-if="!show_password_confirm"
                      class="size-5 text-muted-foreground"
                    />
                    <Eye
                      v-if="show_password_confirm"
                      class="size-5 text-muted-foreground"
                    />
                  </div>
                </div>
              </FormControl>
              <!-- <FormDescription> </FormDescription> -->
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- <Button type="submit"> Submit </Button> -->
          <Button
            :disabled="loading"
            class="mt-4 bg-yellow-500 rounded-full w-full px-4 py-2 text-black text-sm font-bold cursor-pointer hover:bg-yellow-600"
            ><Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" /> Sign
            Up <MoveRight class="w-5 h-5 mr-2" />
          </Button>
          <Toaster
            rich-colors
            theme="dark"
            position="top-center"
            :expand="true"
          />
        </form>
      </div>
    </div>
  </div>
</template>
