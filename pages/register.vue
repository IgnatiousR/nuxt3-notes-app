<template>
  <div class="h-screen flex">
    <!-- sidebar -->
    <div class="bg-zinc-900 w-[518px] p-8">
      <h1 class="font-semibold text-xl">
        Notes<span class="text-yellow-500">App</span>
      </h1>
      <h1 class="font-bold text-lg mt-8">Sign up for a free account</h1>
      <p class="text-sm">
        Already registered?
        <span class="font-bold text-yellow-500 underline mt-0.5">Log in</span>
        to your account
      </p>

      <div class="mt-10">
        <label class="block text-sm text-zinc-300 mb-1">Email Address</label>
        <input
          type="email"
          placeholder="Email"
          class="block w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded placeholder:text-zinc-500"
        />
      </div>
      <div class="mt-5">
        <label class="block text-sm text-zinc-300 mb-1">Password</label>
        <input
          type="password"
          placeholder="Password"
          class="block w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded placeholder:text-zinc-500"
        />
      </div>
    </div>
    <!-- /sidebar -->
    <!-- note introduction -->
    <div></div>
    <!-- /note introduction -->
  </div>
</template>
