# Quran Bytes

A standalone, responsive concept landing page for a free, open-source,
ad-free Islamic learning platform.

## Open locally

Open `index.html` directly in a modern browser. No install, framework, or build
step is required. Keep the core files and cover asset together:

```text
index.html                Semantic content, inline SVG artwork, CDN links
style.css                 Responsive layouts, typography, CSS 3D book and arch
main.js                   Demo controls, local site guide, optional decoration
assets/quran-cover.webp   Supplied black-and-gold cover, optimized for the web
```

The page, controls, and help guide work without a build step or server. Google
Fonts use a CDN, with local font fallbacks. GSAP / ScrollTrigger are loaded lazily
only on motion-enabled desktop layouts; they never block forms or site help.
If those scripts cannot load, the complete page remains readable and interactive.

## GitHub Pages

Publish the folder containing these files and the `assets` directory using GitHub Pages
**Settings → Pages → Deploy from a branch**. Asset paths are relative, so the
page also works under a repository subpath.

The pre-existing Vite/React scaffold is not used by the page. It is retained for
the Make workspace; its optional `pnpm run build` publishing command also copies
the standalone classic script into the output.

## Before launch

- Connect both preview forms to Formspree or a comparable opt-in service.
  Integration points are marked `TODO` in HTML and JavaScript. They currently
  validate locally and explicitly report that nothing is sent or saved.
- Supply the official repository and, only if wanted, donation URLs. No such
  links are currently displayed; their placeholders are comments.
- Verify content, translation permissions, source editions, and attribution.
  The cited Qur’anic text is an excerpt of Al-Muzzammil 73:4; the translation
  excerpt is attributed to Saheeh International.
- Replace the working name if appropriate. All unfinished product features are
  marked **Planned**, and interfaces are labeled **Concept preview**.

## Accessibility and motion

The Arabic reading passages are kept intact and outside the rotating 3D artwork. The hifz
cover is positioned over an unmodified text node rather than splitting Arabic
letters or words. Native buttons, keyboard-operable tabs, visible focus, form
labels, live feedback, and a native modal dialog are provided.

The supplied cover artwork follows the floating book as one image. Its proportions
and full ornamental border are preserved without cropping or stretching.

Every chapter uses normal vertical document flow, on desktop and mobile.
There is no scroll pinning, wheel interception, hidden chapter sequence, smooth
scroll override, pointer tilt, magnetic-button delay, or time-based scrub lag.
Optional decorative transforms follow scroll progress directly. The floating
book pauses off-screen, and the native browser cursor is used throughout.
On desktop, the cover opens around its right-hand spine before the book fades
into the reading section, without pausing or smoothing the page’s scrolling.
After the intro, the hero headline reveals line by line using lightweight CSS
transforms. A fine-line crescent and a few small SVG stars decorate only the
hero; there are no particle effects or continuous celestial animations.

The CSS-driven intro fades in and out over 3 seconds, with no skip control, and
does not wait for fonts or animation scripts. Page controls become interactive
when it finishes. With
`prefers-reduced-motion: reduce`, the intro and decorative motion are disabled,
and animation libraries are not requested.

Browser scroll restoration is disabled at startup and stale URL fragments are
cleared, so a refresh starts at the hero rather than restoring an old section.
Normal section links and scrolling remain available after the intro.

## Site-help guide

The lower-right chat button opens a small, keyboard-accessible site guide. It
answers common questions about the planned features, sources, free access,
launch updates, and contributing. It remembers the current conversation topic,
handles contextual follow-ups, and suggests useful next questions. The multiline
composer sends on Enter and adds a new line on Shift+Enter. Replies can be copied
where clipboard access is supported, and the new-conversation button clears the
current exchange.

Answers are selected locally from a fixed knowledge base; this is
**not an open-ended AI service or religious adviser**.
Questions are not sent to a server or persisted, and conversation history is
bounded in memory. Unknown questions receive an honest explanation of scope.
