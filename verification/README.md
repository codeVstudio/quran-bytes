# Browser verification

The gallery at [`index.html`](index.html) contains real Chromium screenshots of
the hero, all four chapters, the mission, and the closing section.

This is a historical archive of the original layout, before the black-and-gold
cover, native-scroll simplification, and local site guide were added. The archive
still shows the earlier green concept cover and pinned chapter sequence.

## Refresh, intro, and conversational-guide checks

[`startup-chat-report.json`](startup-chat-report.json) records the latest checks:

- A new page with a stale section fragment starts at the hero.
- Refreshing after navigating to Vision clears the fragment, returns to scroll
  position zero, and restores the closed book.
- Normal section navigation remains functional after startup.
- The intro lasts approximately three seconds, fades in and out, has no skip
  control, and releases the page controls and scroll lock on completion.
- Conversation-topic follow-ups, more specific practice replies, and transparent
  disclosure that the guide is local rather than a live AI model.
- New-conversation reset, suggested prompts, successful reply copying, Enter to
  send, Shift+Enter for multiline input, and safe rendering of user-entered text.
- Mobile bounds, Escape/focus restoration, and reduced-motion startup.
- No guide fetch/XHR requests or uncaught runtime errors were observed.

## Native-scroll regression report

[`native-scroll-report.json`](native-scroll-report.json) records the current
Chromium checks at 1440 × 900, 1024 × 768, and 390 × 844:

This report predates the restored book-opening transition and 3-second intro.
Its 1.5-second timing below records the earlier revision.

- Normal document flow and native scroll behavior at every width, with no
  horizontal overflow, pin spacers, hidden chapters, or time-based scrub delay.
- No movement of the decorative transform after scrolling had stopped.
- A measured intro duration of approximately 1.5 seconds.
- Site-guide answers using Enter and the send button, source attribution,
  religious-ruling scope limits, Escape/focus restoration, and safe text handling.
- No fetch/XHR requests from the site guide.
- Reading controls and intact-Arabic memorization practice.
- Reduced motion, blocked-animation-CDN fallback, and direct `file://` loading.

Response timings include browser-automation overhead. These checks do not
guarantee zero rendering latency or a fixed frame rate on every device.

## Viewports

| Viewport   | Layout                                                            |
| ---------- | ----------------------------------------------------------------- |
| 1440 × 900 | Pinned desktop journey; chapter navigation also exercised         |
| 1024 × 768 | Compact desktop journey                                           |
| 390 × 844  | Natural vertical flow; separate screenshots of each concept panel |

## Checks

- Chapter transitions and visible overlay bounds.
- Arabic kept as intact text, outside the rotating decorative scene.
- Reading preview, speed control, translation toggle.
- Hidden-word reveal/reset and three-repetition loop.
- Translation/source tabs, including arrow-key navigation.
- Dua/hadith tabs and references.
- Native email validation and explicit, front-end-only feedback.
- Contribution role selection, modal focus, Escape, and scroll-lock release.
- Visible keyboard focus.
- Reduced motion: no pinning, loader, float, or tilt; all chapters
  remain in ordinary document flow.
- Opening the actual `index.html` over `file://`, without a server.
- Blocked GSAP CDN: readable, unpinned fallback.
- Disabled JavaScript: readable chapters and disabled email submission controls.
- JavaScript syntax and the workspace's optional production build.

Machine-readable measurements are retained in `report.json`. Network failures
with `blockedReason: "inspector"` are intentional: the fallback test blocks the
two animation CDN files.

## Limits

These are Chromium checks, not a Safari/Firefox compatibility certification or
a measured 60fps performance audit. The forms intentionally do not subscribe,
store, or transmit anything. The recitation control is a visual demonstration,
not real audio. Content permissions and full source/license attribution remain
pre-launch tasks. No reference image was available in the conversation.
