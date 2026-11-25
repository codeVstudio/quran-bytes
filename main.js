/* Quran Bytes — progressive enhancement.
   All content and the natural vertical layout work without GSAP or JavaScript. */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const header = $("#site-header");
  const chapters = $$(".chapter");

  // Keep hidden page controls out of keyboard navigation during the brief intro.
  if (document.documentElement.classList.contains("is-intro-active")) {
    const regions = [header, $("#main"), $("#site-help"), $(".skip-link")];
    regions.forEach((region) => {
      region.inert = true;
    });
    document.addEventListener(
      "qb:intro-complete",
      () => {
        regions.forEach((region) => {
          region.inert = false;
        });
      },
      { once: true },
    );
  }

  /* 01 — Controls initialize independently of animation libraries. */
  function initReadingPreview() {
    const play = $("#recitation-preview");
    const wave = $("#waveform");
    let playing = false;
    play.addEventListener("click", () => {
      playing = !playing;
      play.setAttribute("aria-pressed", String(playing));
      play.setAttribute(
        "aria-label",
        playing ? "Pause visual recitation preview" : "Play visual recitation preview, no audio",
      );
      $("use", play).setAttribute("href", playing ? "#icon-pause" : "#icon-play");
      if (!reducedMotion.matches) wave.classList.toggle("is-playing", playing);
      $("#recitation-status").textContent = playing
        ? "Visual preview only — no audio is playing."
        : "Preview paused. Audio is planned.";
    });

    const speeds = [1, 0.75, 1.25];
    let speedIndex = 0;
    $("#preview-speed").addEventListener("click", (event) => {
      speedIndex = (speedIndex + 1) % speeds.length;
      const speed = speeds[speedIndex];
      event.currentTarget.textContent = `${speed}×`;
      event.currentTarget.setAttribute("aria-label", `Visual preview speed: ${speed} times`);
      wave.style.setProperty("--preview-speed", `${1 / speed}s`);
    });

    $("#translation-toggle").addEventListener("click", (event) => {
      const button = event.currentTarget;
      const show = button.getAttribute("aria-pressed") !== "true";
      button.setAttribute("aria-pressed", String(show));
      $("#reading-translation").style.visibility = show ? "visible" : "hidden";
    });
  }

  function initMemorizationPreview() {
    const verse = $("#practice-verse");
    const mask = $("#word-mask");
    const hideButton = $("#hide-word");
    const container = $("#verse-practice");

    // Measure the intact text node. Never split or transform Arabic glyphs.
    function positionMask() {
      const text = verse.firstChild;
      const word = "تَرْتِيلًا";
      const start = text.textContent.lastIndexOf(word);
      if (start < 0) return;
      const range = document.createRange();
      range.setStart(text, start);
      range.setEnd(text, start + word.length);
      const rect = range.getBoundingClientRect();
      const parent = container.getBoundingClientRect();
      mask.style.left = `${rect.left - parent.left - 3}px`;
      mask.style.top = `${rect.top - parent.top - 1}px`;
      mask.style.width = `${rect.width + 6}px`;
      mask.style.height = `${rect.height + 2}px`;
    }
    const setRevealed = (revealed) => {
      mask.hidden = revealed;
      hideButton.hidden = !revealed;
      mask.setAttribute("aria-expanded", String(revealed));
      $("#memorize-status").textContent = revealed
        ? "The word is revealed. Read it, then try recalling it again."
        : "Tap the covered word to reveal it.";
      if (!revealed) positionMask();
    };
    mask.addEventListener("click", () => {
      setRevealed(true);
      hideButton.focus({ preventScroll: true });
    });
    hideButton.addEventListener("click", () => {
      setRevealed(false);
      mask.focus({ preventScroll: true });
    });
    if ("ResizeObserver" in window) new ResizeObserver(positionMask).observe(container);
    window.addEventListener("resize", positionMask, { passive: true });
    document.fonts.ready.then(positionMask);
    positionMask();

    let repeats = 0;
    $("#repeat-button").addEventListener("click", (event) => {
      repeats = repeats === 3 ? 0 : repeats + 1;
      $("#repeat-count").textContent = repeats;
      $$(".repeat-dots i").forEach((dot, index) =>
        dot.classList.toggle("is-complete", index < repeats),
      );
      event.currentTarget.setAttribute(
        "aria-label",
        repeats === 3 ? "Start a new practice loop" : "Mark one repetition complete",
      );
      $("#memorize-status").textContent =
        repeats === 3
          ? "Three repetitions complete. Tap the arrow to begin a new loop."
          : `${repeats} of 3 repetitions marked in this preview.`;
    });
  }

  // Standard keyboard-operable tabs (Left/Right, Home/End).
  function initTabs() {
    $$('[role="tablist"]').forEach((list) => {
      const tabs = $$('[role="tab"]', list);
      function select(tab, focus = false) {
        tabs.forEach((item) => {
          const selected = item === tab;
          item.setAttribute("aria-selected", String(selected));
          item.tabIndex = selected ? 0 : -1;
          document.getElementById(item.getAttribute("aria-controls")).hidden = !selected;
        });
        if (focus) tab.focus({ preventScroll: true });
      }
      tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => select(tab));
        tab.addEventListener("keydown", (event) => {
          let next;
          if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
          if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
          if (event.key === "Home") next = 0;
          if (event.key === "End") next = tabs.length - 1;
          if (next !== undefined) {
            event.preventDefault();
            select(tabs[next], true);
          }
        });
      });
    });
  }

  function initForms() {
    // TODO: Replace these preview handlers with Formspree (or similar).
    // Only report a real subscription after a confirmed successful response.
    $("#updates-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const feedback = $("#updates-feedback");
      feedback.textContent =
        "Thank you — launch sign-up is opening soon, and nothing was sent or saved yet.";
      feedback.classList.add("is-feedback");
    });
    // Remain disabled without JS: never fall back to a GET containing an email.
    $("#updates-email").disabled = false;
    $("#updates-form button").disabled = false;

    const dialog = $("#contribute-dialog");
    const openButton = $("#open-contribute");
    function closeDialog() {
      dialog.close();
      document.body.classList.remove("dialog-open");
      openButton.focus({ preventScroll: true });
    }
    openButton.addEventListener("click", () => {
      dialog.showModal();
      document.body.classList.add("dialog-open");
    });
    openButton.disabled = false;
    $("#close-contribute").addEventListener("click", closeDialog);
    dialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        closeDialog();
    });
    $("#contribute-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const feedback = $("#contribute-feedback");
      const selected = $$('input[name="skills"]:checked', event.currentTarget);
      feedback.textContent = selected.length
        ? "Thank you for the intention. Contribution sign-up is opening soon — your details weren’t sent or saved yet."
        : "Choose at least one way you’d like to help before submitting.";
      feedback.classList.add("is-feedback");
    });
  }

  /* 02 — Instant, private site help. This is a local FAQ guide, not an AI
     service or a source of religious rulings. No messages leave this tab. */
  function initHelp() {
    const widget = $("#site-help");
    const panel = $("#help-panel");
    const toggle = $("#help-toggle");
    const question = $("#help-question");
    const messages = $("#help-messages");
    const suggestions = $("#help-suggestions");
    const form = $("#help-form");
    const sendButton = $("button[type='submit']", form);
    const greeting = messages.firstElementChild.cloneNode(true);
    let lastTopic = null;
    const answers = [
      {
        id: "rulings",
        match: /fatwa|halal|haram|ruling|permissib|divorce|حلال|حرام|فتوى/,
        text: "I’m a guide to this website, not a scholar or a source of religious rulings. Please take personal religious questions to a qualified scholar. I can help you find the learning previews and their references.",
        link: ["Explore the learning previews", "#explore"],
      },
      {
        id: "guide",
        match:
          /\bai\b|chatgpt|\bgpt\b|\bllm\b|artificial intelligence|what.*model|who.*you|real.*bot|are.*human/,
        text: "I’m the on-device Quran Bytes site guide, not a live AI model or a person. I can answer project questions and help with follow-ups using the information on this page. Your questions aren’t sent to an AI provider.",
      },
      {
        id: "privacy",
        match: /privacy|private|data|stored|saved|record|personal/,
        text: "This guide answers locally in your browser. Your questions aren’t sent to a server or saved when you leave. The launch-update and contribution forms are also previews: they don’t send or save your details yet.",
      },
      {
        id: "free",
        match: /free|cost|price|\bpay\b|advertis|open code|مجاني/,
        text: "Quran Bytes is intended to be free, open-source, and ad-free. The project’s mission is learning without ads or paywalls.",
        link: ["Read the vision", "#vision"],
      },
      {
        id: "launch",
        match: /launch|\blive\b|ready|available|release|notif|updates?|early|join|email|sign.?up/,
        text: "Quran Bytes isn’t live yet. The learning interfaces are concept previews and the features are planned. You can find the launch-updates form at the bottom of the page, but sign-up is not connected yet, so no email will be sent or saved.",
        link: ["Find launch updates", "#get-involved"],
      },
      {
        id: "contribute",
        match:
          /contribut|volunteer|\bdesign(?:ers?|ing)?\b|\bdevelopers?\b|\breviewers?\b|content review|educator|skills|how can i help|i want to help|help.*build|join.*team|github|repository/,
        text: "Developers, designers, translators, educators, and content reviewers are welcome. Use “Contribute your skills” to explore the interest form. It’s a front-end preview for now, and the official repository link hasn’t been provided yet.",
        link: ["Get involved", "#get-involved"],
      },
      {
        id: "sources",
        match:
          /source|reference|translat|tafsir|meaning|verse|ayah|muzzammil|73.?4|language|urdu|bengali|indonesian|مصدر|ترجمة/,
        text: "The reading preview uses an excerpt from Surah Al-Muzzammil 73:4, with an English translation excerpt attributed to Saheeh International. Open “Source notes” in the Understand section for the details. Tafsir and additional languages are planned.",
        link: ["Explore meaning and sources", "#understand"],
      },
      {
        id: "memorize",
        match: /hifz|memori|repeat|revis|hidden|covered|mask|حفظ|مراجعة/,
        text: "In the Memorize preview, select the covered word to reveal it, hide it again to test recall, and use the arrow to mark a repetition. Three marks complete the practice loop. Full hifz tools and revision scheduling are planned; this preview doesn’t save progress.",
        link: ["Try memorization practice", "#memorize"],
      },
      {
        id: "practice",
        match: /dua|duas|hadith|daily|sunnah|دعاء|حديث/,
        text: "The Practice preview has Dua and Hadith tabs. The sample dua cites Sunan Ibn Majah 251; the hadith about learning and teaching the Qur’an cites Sahih al-Bukhari 5027. Daily learning tools and structured learning paths are planned.",
        link: ["Open daily practice", "#practice"],
      },
      {
        id: "audio",
        match: /recit|\baudio\b|\bplay\b|listen|\bsound\b/,
        text: "The play control demonstrates a recitation waveform visually; it does not play audio. You can try the speed control and translation toggle. Real recitation audio is planned.",
        link: ["Try the reading preview", "#read"],
      },
      {
        id: "accessibility",
        match: /scroll|slow|lag|motion|accessib|keyboard|animation|loader/,
        text: "The page uses normal browser scrolling, with no pinned chapters or delayed smoothing. The intro fades in and out over 3 seconds, and refreshing returns you to the hero. Reduced-motion preferences disable the intro and decorative motion.",
      },
      {
        id: "reading",
        match: /\bread(?:ing)?\b|\bquran\b|qur an|قرآن|قراءة/,
        text: "The Read section previews a quiet Arabic reading view with an English translation and visual recitation controls. The text shown is an excerpt of Al-Muzzammil 73:4. The complete reading platform is planned.",
        link: ["Begin with an ayah", "#read"],
      },
      {
        id: "overview",
        match: /learn|feature|platform|about|offer|what.*can|what.*bytes/,
        text: "Quran Bytes is a free, open-source Islamic learning project. Planned features include Qur’an reading, hifz practice, translations and sources, hadith, duas, and structured learning. This page lets you try a few concept interfaces.",
        link: ["Explore the previews", "#explore"],
      },
      {
        id: "greeting",
        match: /salaam|salam|assalamu|\bhello\b|\bhi\b|السلام/,
        text: "Wa alaikum assalam, and welcome. I can help with Quran Bytes, its planned learning features, sources, or getting involved. What would you like to know?",
      },
    ];
    const details = {
      reading:
        "Sure — open the Read preview to see the ayah and its English translation. “Aa” toggles the translation, the arrow control previews a recitation waveform, and the speed button cycles through playback speeds. The waveform is visual only; audio is planned.",
      memorize:
        "Here’s a quick way to try it:\n1. Read the verse once.\n2. Select the covered word to reveal it, then hide it again.\n3. Recall the word and mark a repetition with the arrow.\n\nThree marks complete a loop. This demo doesn’t save progress.",
      sources:
        "The sample is an excerpt from Al-Muzzammil 73:4. Its English translation excerpt is attributed to Saheeh International. In Understand, switch to “Source notes” to see the attribution beside the original. Tafsir sources and more languages are still to be confirmed.",
      practice:
        "You can switch between Dua and Hadith in the Practice preview. The dua for beneficial knowledge references Sunan Ibn Majah 251. The hadith about learning and teaching the Qur’an references Sahih al-Bukhari 5027.",
      contribute:
        "You can help with development, design, translation, education, or content review. Open “Contribute your skills,” choose the areas that fit you, and explore the interest form. It is not connected yet, so no details are submitted.",
      launch:
        "There isn’t a confirmed launch date yet. The launch-updates form is a front-end preview, not an active mailing list. When a signup service is connected, the page can collect opt-in updates; right now it sends and saves nothing.",
      free: "The intention is simple: free access, open-source development, clear sources, and community support. No advertising or learning paywalls are planned. You can read those commitments in the Vision section.",
      audio:
        "The control lets you try the interface rather than listen to a recording. Select play to animate the waveform, cycle the speed button, or toggle the translation. No sound is currently played.",
      privacy:
        "The conversation exists only in this tab and is cleared on refresh or when you start a new chat. Matching happens locally, with no AI service receiving your messages. The two interest forms are also unconnected previews.",
      overview:
        "You can explore four connected ideas: Read, Memorize, Understand, and Practice. Each section has a small interactive concept. Full Qur’an reading, revision tools, additional languages, hadith, duas, and structured learning are planned.",
      guide:
        "I use a small, built-in knowledge base and the topic of our current conversation to answer follow-up questions. I’m not a generative model, so I’ll say when something is outside my scope rather than inventing an answer.",
      accessibility:
        "The intro finishes automatically after 3 seconds. Outside that intro, scrolling is fully native. Buttons and tabs support keyboard navigation, Enter sends chat messages, Shift+Enter adds a line, and reduced motion disables decorative animations.",
    };
    const followUps = {
      reading: ["Is there audio?", "Where are the sources?"],
      memorize: ["How does it work?", "Is my progress saved?"],
      sources: ["Tell me more", "What about memorization?"],
      practice: ["Tell me more", "Where are the sources?"],
      contribute: ["Which skills can I contribute?", "Is there a repository?"],
      launch: ["Is there a launch date?", "How can I contribute?"],
      free: ["How can I contribute?", "What can I learn?"],
      audio: ["Try reading", "What about memorization?"],
      privacy: ["Are you a real AI?", "What can I learn?"],
      guide: ["What can I learn?", "How do I memorize?"],
    };
    const normalize = (value) =>
      value
        .toLowerCase()
        .normalize("NFKC")
        .replace(/[’']/g, "")
        .replace(/\bopen[- ]source\b/g, "open code")
        .replace(/\s+/g, " ")
        .trim();
    const getTopic = (id) => answers.find((item) => item.id === id);
    function resizeComposer() {
      sendButton.disabled = !question.value.trim();
      if (panel.hidden) return;
      question.style.height = "auto";
      question.style.height = `${Math.min(question.scrollHeight, 96)}px`;
    }
    function showSuggestions(id) {
      suggestions.replaceChildren();
      const prompts = followUps[id] ?? ["What can I learn?", "How can I contribute?"];
      for (const prompt of prompts) {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.question = prompt;
        button.textContent = prompt;
        suggestions.append(button);
      }
      suggestions.hidden = false;
    }
    function resolve(text) {
      const normalized = normalize(text);
      if (/^(thank(?:s| you)|jazakallah(?: khair)?|جزاك الله خيرا)[.!?\s]*$/.test(normalized)) {
        return {
          id: lastTopic ?? "overview",
          text: "You’re very welcome. If you’d like, we can explore another part of Quran Bytes together.",
        };
      }
      if (lastTopic === "memorize" && /progress|saved|stored/.test(normalized)) {
        return {
          ...getTopic("memorize"),
          text: "Not in this preview — your repetition count only lasts while this page is open. Accounts, saved progress, and revision scheduling aren’t connected yet. You can still try the hidden-word practice and repetition loop here.",
        };
      }
      const direct = answers.find(
        (item) =>
          ["rulings", "guide", "privacy", "free"].includes(item.id) && item.match.test(normalized),
      );
      if (direct) return direct;
      if (
        lastTopic &&
        /^(?:tell me more|more(?: please)?|go on|explain(?: more)?|how(?: does| do)? (?:it|that|this) work|how do i (?:try|use) it|can i try it)[.!?\s]*$/.test(
          normalized,
        )
      ) {
        const topic = getTopic(lastTopic);
        return { ...topic, text: details[lastTopic] ?? topic.text };
      }
      const ranked = answers
        .map((item) => {
          const match = normalized.match(item.match);
          return { item, score: match ? match[0].length + (item.id === lastTopic ? 1 : 0) : 0 };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score);
      if (ranked.length) {
        const topic = ranked[0].item;
        return topic.id === lastTopic && details[topic.id]
          ? { ...topic, text: details[topic.id] }
          : topic;
      }
      return {
        id: "unknown",
        text: "That’s outside my site knowledge, and I don’t want to guess. I can help with Quran Bytes, reading, hifz, sources, launch updates, and contributing. For religious rulings or personal guidance, please speak with a qualified scholar.",
      };
    }
    const setOpen = (open) => {
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      syncHelpViewport();
      if (open) {
        resizeComposer();
        question.focus({ preventScroll: true });
      } else toggle.focus({ preventScroll: true });
    };
    function syncHelpViewport() {
      if (panel.hidden || !window.visualViewport) {
        widget.style.removeProperty("--help-vv-bottom");
        widget.style.removeProperty("--help-max-height");
        return;
      }
      const vv = window.visualViewport;
      const bottomInset = Math.max(0, Math.round(window.innerHeight - (vv.height + vv.offsetTop)));
      const reservedChrome = vv.height < 520 ? 72 : 104;
      const availableHeight = Math.max(180, Math.floor(vv.height - reservedChrome));
      widget.style.setProperty("--help-vv-bottom", `${bottomInset}px`);
      widget.style.setProperty("--help-max-height", `${availableHeight}px`);
    }
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", syncHelpViewport, { passive: true });
      window.visualViewport.addEventListener("scroll", syncHelpViewport, { passive: true });
    }
    window.addEventListener("resize", syncHelpViewport, { passive: true });
    function addMessage(text, fromGuide, link) {
      const message = document.createElement("div");
      message.className = `help-message help-message-${fromGuide ? "guide" : "you"}`;
      if (fromGuide) {
        const avatar = document.createElement("span");
        avatar.className = "help-message-avatar";
        avatar.setAttribute("aria-hidden", "true");
        avatar.textContent = "QB";
        message.append(avatar);
      }
      const bubble = document.createElement("div");
      bubble.className = "help-bubble";
      const speaker = document.createElement("span");
      speaker.className = "help-speaker";
      speaker.textContent = fromGuide ? "Quran Bytes guide" : "You";
      const content = document.createElement("p");
      content.textContent = text;
      content.dir = "auto";
      bubble.append(speaker, content);
      if (link) {
        const anchor = document.createElement("a");
        anchor.textContent = `${link[0]} ↗`;
        anchor.href = link[1];
        anchor.addEventListener("click", () => setOpen(false));
        bubble.append(anchor);
      }
      if (fromGuide && navigator.clipboard?.writeText) {
        const copy = document.createElement("button");
        copy.type = "button";
        copy.className = "help-copy";
        copy.textContent = "Copy";
        copy.setAttribute("aria-label", "Copy this reply");
        copy.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(text);
            copy.textContent = "Copied";
            copy.setAttribute("aria-label", "Reply copied");
          } catch {
            copy.textContent = "Select text to copy";
            copy.setAttribute("aria-label", "Copy unavailable; select the reply text to copy");
          }
          setTimeout(() => {
            copy.textContent = "Copy";
            copy.setAttribute("aria-label", "Copy this reply");
          }, 1600);
        });
        bubble.append(copy);
      }
      message.append(bubble);
      messages.append(message);
      while (messages.children.length > 25) messages.firstElementChild.remove();
      messages.scrollTop = messages.scrollHeight;
    }
    function answer(value) {
      const text = value.trim().slice(0, 500);
      if (!text) return;
      addMessage(text, false);
      const response = resolve(text);
      addMessage(response.text, true, response.link);
      if (!["unknown", "greeting", "rulings"].includes(response.id)) lastTopic = response.id;
      showSuggestions(response.id);
      question.value = "";
      resizeComposer();
    }
    toggle.addEventListener("click", () => setOpen(panel.hidden));
    $("#help-close").addEventListener("click", () => setOpen(false));
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      answer(question.value);
      question.focus({ preventScroll: true });
    });
    suggestions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-question]");
      if (button) answer(button.dataset.question);
    });
    question.addEventListener("input", resizeComposer);
    question.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
        event.preventDefault();
        if (question.value.trim()) form.requestSubmit();
      }
    });
    $("#help-reset").addEventListener("click", () => {
      lastTopic = null;
      messages.replaceChildren(greeting.cloneNode(true));
      question.value = "";
      showSuggestions("overview");
      resizeComposer();
      question.focus({ preventScroll: true });
    });
    widget.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !panel.hidden) {
        event.preventDefault();
        setOpen(false);
      }
    });
    document.addEventListener("pointerdown", (event) => {
      if (!panel.hidden && !widget.contains(event.target)) {
        panel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    widget.hidden = false;
    resizeComposer();
  }

  /* 03 — Header decoration never measures layout inside a scroll handler. */
  function initHeader() {
    const mission = $("#vision");
    let missionStart = 0;
    let missionEnd = 0;
    let headerHeight = 83;
    let scheduled = false;
    const update = () => {
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 25);
      header.classList.toggle(
        "is-dark",
        y + headerHeight >= missionStart && y + headerHeight < missionEnd,
      );
      scheduled = false;
    };
    const measure = () => {
      const rect = mission.getBoundingClientRect();
      const scrolledCss = parseFloat(getComputedStyle(header).getPropertyValue("--header-scrolled-h"));
      headerHeight = Number.isFinite(scrolledCss) && scrolledCss > 0 ? scrolledCss : header.offsetHeight || 68;
      missionStart = rect.top + window.scrollY;
      missionEnd = rect.bottom + window.scrollY;
      update();
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!scheduled) {
          scheduled = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true },
    );
    window.addEventListener("resize", measure, { passive: true });
    if ("ResizeObserver" in window) new ResizeObserver(measure).observe($("#main"));
    document.fonts.ready.then(measure);
    measure();
  }

  /* 04 — A one-shot headline reveal, timed after the intro rather than hidden
     behind it. CSS handles the motion; no animation library is needed. */
  function initHeroEntrance() {
    if (reducedMotion.matches) return;
    const root = document.documentElement;
    const lastLine = $("#hero-title .text-line:last-child > span");
    if (!lastLine) return;
    let fallbackTimer = 0;
    const finish = () => {
      clearTimeout(fallbackTimer);
      root.classList.remove("hero-reveal-ready", "hero-reveal-play");
      lastLine.removeEventListener("animationend", onEnd);
      reducedMotion.removeEventListener("change", onPreference);
      document.removeEventListener("qb:intro-complete", play);
    };
    const onEnd = (event) => {
      if (event.target === lastLine && event.animationName === "hero-line-reveal") finish();
    };
    const onPreference = () => {
      if (reducedMotion.matches) finish();
    };
    const play = () => {
      if (reducedMotion.matches) finish();
      else {
        root.classList.add("hero-reveal-play");
        // Keep the headline readable even if an animation-end event is lost.
        fallbackTimer = setTimeout(finish, 1800);
      }
    };
    root.classList.add("hero-reveal-ready");
    lastLine.addEventListener("animationend", onEnd);
    reducedMotion.addEventListener("change", onPreference);
    if (root.classList.contains("is-intro-active")) {
      document.addEventListener("qb:intro-complete", play, { once: true });
    } else {
      play();
    }
  }

  /* 04b — Keep the 3D hero stage cleanly centered between copy and CTA on portrait phones. */
  function initResponsiveStage() {
    const hero = $(".hero");
    const heroCopy = $(".hero-copy");
    const heroDesc = $(".hero-description");
    const stage = $("#visual-stage");
    if (!hero || !heroCopy || !heroDesc || !stage) return;

    const sync = () => {
      const isPortraitPhone = window.innerWidth < 600 && window.innerHeight > 560;
      if (!isPortraitPhone) {
        hero.style.removeProperty("--mobile-stage-gap");
        stage.style.removeProperty("--mobile-stage-top");
        return;
      }
      const heroRect = hero.getBoundingClientRect();
      const descRect = heroDesc.getBoundingClientRect();
      const stageHeight = stage.offsetHeight || 240;
      const topGap = 14;
      const bottomGap = 18;
      const descBottom = descRect.bottom - heroRect.top;
      hero.style.setProperty("--mobile-stage-gap", `${Math.ceil(stageHeight + topGap + bottomGap)}px`);
      stage.style.setProperty(
        "--mobile-stage-top",
        `${Math.round(heroRect.top + window.scrollY + descBottom + topGap + stageHeight / 2)}px`,
      );
    };

    window.addEventListener("resize", sync, { passive: true });
    window.addEventListener("orientationchange", sync, { passive: true });
    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(sync);
      ro.observe(heroCopy);
      ro.observe(stage);
    }
    document.fonts.ready.then(sync);
    sync();
  }

  /* 05 — Decoration follows native scrolling directly. No pinning, hidden
     chapters, wheel interception, or time-based scrub catch-up. The optional
     libraries load only on desktop, after essential controls are interactive. */
  function initMotion() {
    const desktop = matchMedia("(min-width: 1000px) and (prefers-reduced-motion: no-preference)");
    let loading = null;
    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.append(script);
      });
    const load = () => {
      if (!desktop.matches || loading) return;
      loading = (async () => {
        if (!window.gsap)
          await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js");
        if (!window.ScrollTrigger)
          await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js");
        const { gsap, ScrollTrigger } = window;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        media.add(desktop.media, () => {
          document.documentElement.classList.add("has-journey-art");
          const position = $(".stage-position");
          gsap.set(position, { x: 0 });
          const opening = gsap.timeline({
            scrollTrigger: {
              trigger: ".hero",
              start: "top -10%",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          // Open around the right-hand spine before fading into the reading view.
          // Scroll progress drives every transform directly, with no catch-up delay.
          opening
            .to(
              ".book",
              {
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                duration: 0.65,
                ease: "none",
              },
              0,
            )
            .to(
              ".book-cover",
              {
                rotationY: 145,
                duration: 0.65,
                ease: "none",
              },
              0.05,
            )
            .to(
              ".book-float",
              {
                x: () => -$(".book-float").offsetWidth * 0.3,
                scale: 0.86,
                duration: 0.7,
                ease: "none",
              },
              0.05,
            )
            .to(
              ".book-float",
              {
                autoAlpha: 0,
                y: -12,
                duration: 0.2,
                ease: "none",
              },
              0.8,
            );
          chapters.slice(1).forEach((chapter, index) => {
            const left = () => -Math.min(innerWidth, 1485) * 0.45;
            gsap.fromTo(
              position,
              { x: index % 2 === 0 ? 0 : left },
              {
                x: index % 2 === 0 ? left : 0,
                ease: "none",
                immediateRender: false,
                scrollTrigger: {
                  trigger: chapter,
                  start: "top 85%",
                  end: "top 35%",
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            );
          });
          gsap.to("#visual-stage", {
            autoAlpha: 0,
            ease: "none",
            scrollTrigger: { trigger: "#vision", start: "top bottom", end: "top 35%", scrub: true },
          });
          return () => document.documentElement.classList.remove("has-journey-art");
        });
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      })().catch(() => {
        // A failed CDN leaves the full page and local help completely usable.
      });
    };
    desktop.addEventListener("change", load);
    if ("requestIdleCallback" in window) requestIdleCallback(load, { timeout: 250 });
    else setTimeout(load, 0);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        $(".book-bob").style.animationPlayState = entry.isIntersecting ? "running" : "paused";
      }).observe($("#top"));
    }
  }

  initHeroEntrance();
  initResponsiveStage();
  initReadingPreview();
  initMemorizationPreview();
  initTabs();
  initForms();
  initHelp();
  initHeader();
  initMotion();
})();
