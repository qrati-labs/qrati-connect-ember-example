interface Env {
  ASSETS: { fetch: (request: Request | string) => Promise<Response> };
  GTM_ID?: string;
  VITE_GTM_ID?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const prefix = '/connect/ember-example';

    if (url.pathname === prefix || url.pathname === `${prefix}/`) {
      url.pathname = '/';
    } else if (url.pathname.startsWith(`${prefix}/`)) {
      url.pathname = url.pathname.slice(prefix.length) || '/';
    }

    const response = await env.ASSETS.fetch(new Request(url, request));
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('text/html')) return response;

    let html = await response.text();
    const gtmId = env.VITE_GTM_ID || env.GTM_ID;
    if (gtmId && gtmId !== '__GTM_ID__') html = html.replaceAll('__GTM_ID__', gtmId);
    return new Response(html, { status: response.status, statusText: response.statusText, headers: response.headers });
  },
};
