import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies }) => {
  const sessionCookie = cookies.get('session');

  if (sessionCookie?.value) {
    return new Response(JSON.stringify({ authenticated: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  return new Response(JSON.stringify({ authenticated: false }), {
    status: 401,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
