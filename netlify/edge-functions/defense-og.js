// The site is a single-page app: every route is served the same index.html, so
// every route would otherwise share the site-wide link preview. The defense
// invitation is the one page people paste into WhatsApp, Slack and email, so
// rewrite its preview tags on the way out.
//
// Runs before the SPA redirect; context.next() returns the index.html the
// redirect resolves to, which we stream through an HTMLRewriter-style replace.

const TITLE = "Ali's PhD Defense — 23 October 2026, TU Delft";
const DESCRIPTION =
    'You are invited to the public defence of Ali Khatami’s doctoral thesis at the Aula, ' +
    'TU Delft, on Friday 23 October 2026 at 12:30. RSVP on the page.';
const URL_ = 'https://akhatami.com/defense';
const IMAGE = 'https://akhatami.com/thesis-cover.jpg';

const META = `
    <link rel="canonical" href="${URL_}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Ali Khatami" />
    <meta property="og:title" content="${TITLE}" />
    <meta property="og:description" content="${DESCRIPTION}" />
    <meta property="og:url" content="${URL_}" />
    <meta property="og:image" content="${IMAGE}" />
    <meta property="og:image:width" content="1800" />
    <meta property="og:image:height" content="1235" />
    <meta property="og:image:alt" content="The cover of the thesis: stone staircases rising through the dark toward a gold-topped summit" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${TITLE}" />
    <meta name="twitter:description" content="${DESCRIPTION}" />
    <meta name="twitter:image" content="${IMAGE}" />
    <meta name="twitter:image:alt" content="The cover of the thesis: stone staircases rising through the dark toward a gold-topped summit" />
`;

// Every tag the site-wide block in public/index.html emits, so nothing is left
// pointing at the home page.
const STRIP =
    /[ \t]*<(?:link rel="canonical"|meta (?:property="og:|name="twitter:|name="description"))[^>]*>\r?\n?/g;

export default async (request, context) => {
    const response = await context.next();
    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html')) return response;

    const html = await response.text();
    const rewritten = html
        .replace(STRIP, '')
        .replace(/<title>[^<]*<\/title>/, `<title>${TITLE}</title>`)
        .replace(
            '</head>',
            `${META}    <meta name="description" content="${DESCRIPTION}" />\n  </head>`
        );

    const headers = new Headers(response.headers);
    // The body changed length; let the platform recompute it.
    headers.delete('content-length');

    return new Response(rewritten, { status: response.status, headers });
};

export const config = { path: '/defense' };
