import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // Check if the current path is the login page, logout endpoint, or API routes
  const isLoginPage = context.url.pathname === '/login';
  const isLogoutEndpoint = context.url.pathname === '/logout';
  const isApiRoute = context.url.pathname.startsWith('/api/');

  // Skip auth check for login, logout, and API routes
  if (isLoginPage || isLogoutEndpoint || isApiRoute) {
    return next();
  }

  // Check for session cookie
  const sessionCookie = context.cookies.get('session');
  const isLoggedIn = !!sessionCookie?.value;

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return context.redirect('/login');
  }

  // User is authenticated, continue to the page
  return next();
});
