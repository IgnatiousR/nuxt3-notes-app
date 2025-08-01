<template>
  <div class="h-screen flex">
    <!-- sidebar -->
    <div class="bg-zinc-900 w-[518px] p-8 flex flex-col justify-center">
      <h1 class="font-semibold text-xl">
        Notes<span class="text-yellow-500">App</span>
      </h1>
      <h1 class="font-bold text-lg mt-8">Sign up for a free account</h1>
      <p class="text-sm">
        Already registered?
        <span class="font-bold text-yellow-500 underline mt-0.5">Log in</span>
        to your account
      </p>

      <form @submit.prevent="submit">
        <div class="mt-10">
          <label class="block text-sm text-zinc-300 mb-1">Email Address</label>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="block w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded placeholder:text-zinc-500"
          />
        </div>
        <div class="mt-5">
          <label class="block text-sm text-zinc-300 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="block w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded placeholder:text-zinc-500"
          />
        </div>

        <!-- sign up button -->
        <div class="">
          <button
            class="mt-4 bg-yellow-500 rounded-full w-full px-4 py-2 text-black text-sm font-bold cursor-pointer hover:bg-yellow-600"
          >
            Sign Up
          </button>
        </div>
        <!-- /sign up button -->
      </form>
    </div>
    <!-- /sidebar -->
    <!-- note introduction -->
    <div>Main</div>
    <!-- /note introduction -->
  </div>
</template>

<script setup>
const email = ref("");
const password = ref("");

async function submit() {
  console.log("Email: ", email.value);
  console.log("Password: ", password.value);

  // const response = await $fetch("/api/user", {
  //   method: "POST",
  //   body: {
  //     email: email.value,
  //     password: password.value,
  //   },
  // });

  // console.log(response);
}
</script>
