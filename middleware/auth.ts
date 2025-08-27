export default defineNuxtRouteMiddleware(async (_event) => {
  if (import.meta.client) return;

  const { $verifyJwtToken } = useNuxtApp();
  const config = useRuntimeConfig();
  console.log('middleware is fired!');
  console.log('Path:', _event.path);

  const jwt = useCookie('NotesJWT');
  console.log('JWT:', jwt.value);

  if (!jwt.value) {
    return navigateTo('/register');
  }
  try {
    const decoded = $verifyJwtToken(jwt.value, config.jwtSecret);
    console.log('D:', decoded);
  } catch (error) {
    console.error(error);
    return navigateTo('/register');
  }
});

// jsonwebtoken = klfjdsalkfjklsdajkl4jfkslkdfjl.fadsjklfjsdklfjskla.asdfsafsdasdfsafsadjksldfjsdkl
// jsonwebtoken = header.payload.signature
