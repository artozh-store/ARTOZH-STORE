// Cloudflare Pages Function: GET /api/products
// Configure Production environment variables in Cloudflare Pages:
// SUPABASE_URL = https://YOUR_PROJECT.supabase.co
// SUPABASE_ANON_KEY = Supabase publishable/anon key
// Never use a service_role key here.
// Redeploy after Cloudflare environment variables update
export async function onRequestGet({ env }) {
  const supabaseUrl = env.SUPABASE_URL;
  const anonKey = env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return Response.json({ error: 'Product API is not configured.' }, {
      status: 503,
      headers: { 'Cache-Control': 'no-store' }
    });
  }

  let base;
  try {
    base = new URL(supabaseUrl);
    if (base.protocol !== 'https:') throw new Error('HTTPS required');
  } catch {
    return Response.json({ error: 'Invalid SUPABASE_URL configuration.' }, {
      status: 500,
      headers: { 'Cache-Control': 'no-store' }
    });
  }

  const endpoint = new URL('/rest/v1/products', base);
  endpoint.search = new URLSearchParams({
    select: '*',
    is_active: 'eq.true',
    order: 'id.asc'
  }).toString();

  try {
    const upstream = await fetch(endpoint, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: 'application/json'
      }
    });

    if (!upstream.ok) {
      return Response.json({ error: 'Unable to load products.' }, {
        status: 502,
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    const products = await upstream.json();
    return Response.json(products, {
      headers: {
        'Cache-Control': 'public, max-age=30, s-maxage=60',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch {
    return Response.json({ error: 'Product service temporarily unavailable.' }, {
      status: 502,
      headers: { 'Cache-Control': 'no-store' }
    });
  }
}
