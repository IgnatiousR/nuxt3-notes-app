export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.client) return;

  const { $verifyJwtToken } = useNuxtApp();
  const config = useRuntimeConfig();
  console.log('middleware is fired!');
  console.log('P:', to.path);
  const jwt = useCookie('NotesJWT');

  if (!jwt.value) {
    return;
  }

  try {
    $verifyJwtToken(jwt.value, config.jwtSecret);

    if (to.path === '/login' || to.path === '/register') {
      return navigateTo('/');
    }
  } catch (error) {
    console.error('Invalid JWT:', error);
  }
});
