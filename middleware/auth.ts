export default defineNuxtRouteMiddleware(async (_event) => {
  if (import.meta.client) return;

  const { $verifyJwtToken } = useNuxtApp();
  const config = useRuntimeConfig();
  console.log("middleware is fired!");

  const jwt = useCookie("NotesJWT");
  console.log("JWT:", jwt.value);

  if (!jwt.value) {
    return navigateTo("/register");
  }
  try {
    await $verifyJwtToken(jwt.value, config.jwt_secret);
    // console.log("Success");
  } catch (error) {
    console.error(error);
    return navigateTo("/register");
  }
});

// jsonwebtoken = klfjdsalkfjklsdajkl4jfkslkdfjl.fadsjklfjsdklfjskla.asdfsafsdasdfsafsadjksldfjsdkl
// jsonwebtoken = header.payload.signature
