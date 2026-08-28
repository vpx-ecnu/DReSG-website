(function () {
  const data = window.DRESG_SUPP_DATA;
  const imageDimensions = {
    "style_009.webp": [423, 421],
    "style_018.webp": [916, 920],
    "style_020.webp": [320, 197],
    "style_021.webp": [520, 520],
    "style_028.webp": [250, 330],
    "style_038.webp": [639, 947],
    "style_069.webp": [718, 953],
    "style_071.webp": [512, 512],
    "style_085.webp": [509, 676],
    "style_094.webp": [1344, 896],
    "family-078/style_078.webp": [1080, 1440],
    "fern-060/style_060.webp": [706, 720],
    "horns-075/style_075.webp": [1400, 933],
    "m60-079/style_079.webp": [1080, 1440],
    "train-081/style_081.webp": [1024, 1024],
    "trex-065/style_065.webp": [2880, 1953]
  };

  function join(root, file) {
    return `${root.replace(/\/+$/, "")}/${file.replace(/^\/+/, "")}`;
  }

  function pathFor(spec) {
    if (spec.root === "content") return join(data.paths.contentRoot, spec.file);
    if (spec.root === "main") return join(data.paths.mainRoot, spec.file);
    if (spec.root === "style") return join(data.paths.styleRoot, spec.file);
    return join(data.paths.supplementRoot, spec.file);
  }

  const tntScenes = new Set(["m60", "family", "train", "truck"]);
  const llffScenes = new Set(["fern", "trex", "horns", "fortress"]);

  function formatSceneName(scene) {
    const normalized = String(scene || "").toLowerCase();
    if (tntScenes.has(normalized)) return normalized.toUpperCase();
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }

  function formatSceneTitle(title) {
    return String(title || "")
      .split(/\s*([+&])\s*/)
      .map((part) => (part === "+" || part === "&" ? part : formatSceneName(part)))
      .join(" ");
  }

  function formatMediaLabel(label) {
    const text = String(label || "");
    const match = text.match(/^([a-z0-9]+)(.*)$/i);
    if (!match) return text;

    const scene = match[1].toLowerCase();
    if (!tntScenes.has(scene) && !llffScenes.has(scene)) return text;
    return `${formatSceneName(scene)}${match[2]}`;
  }

  function mediaRatioFor(spec, type) {
    if (Number.isFinite(spec.ratio) && spec.ratio > 0) return spec.ratio;
    if (type === "image") return 4 / 3;

    const file = String(spec.file || "").toLowerCase();
    if (file.includes("m60")) return 1074 / 544;
    if (["family", "train", "truck"].some((scene) => file.includes(scene))) return 9 / 5;
    return 4 / 3;
  }

  function mediaCard(spec) {
    const card = document.createElement("article");
    const type = spec.type || "video";
    const displayLabel = formatMediaLabel(spec.label);
    const dimensions = type === "image" ? imageDimensions[spec.file] : null;
    const sizeAttributes = dimensions ? ` width="${dimensions[0]}" height="${dimensions[1]}"` : "";
    card.className = "media-card";
    card.style.setProperty("--media-ratio", String(mediaRatioFor(spec, type)));
    const src = pathFor(spec);
    card.innerHTML = `
      <div class="media-label">
        <span>${displayLabel}</span>
        <small>${spec.tag || ""}</small>
      </div>
      <div class="media-shell ${type === "image" ? "media-shell-image" : "media-shell-video"}">
        ${
          type === "image"
            ? `<a class="media-image-open" href="${src}" target="_blank" rel="noopener" aria-haspopup="dialog" aria-controls="image-viewer" aria-label="View full-size ${displayLabel}">
                 <img src="${src}"${sizeAttributes} alt="${displayLabel}" loading="lazy" decoding="async">
               </a>`
            : `<video controls muted loop playsinline preload="none" data-src="${src}" data-state="idle" aria-label="${displayLabel}"${spec.root === "content" ? " data-content-video" : ""}></video>
               <div class="media-status" role="status" aria-live="polite">Loads when nearby</div>
               <button class="media-load" type="button" aria-label="Play ${displayLabel} video" hidden>Play</button>`
        }
      </div>
    `;
    return card;
  }

  function videoCard(spec) {
    return mediaCard({ ...spec, type: "video", root: "supplement" });
  }

  function renderSet(container, set) {
    const section = document.createElement("section");
    const hasRows = Array.isArray(set.rows) && set.rows.length > 0;
    section.className = "item video-set";
    section.innerHTML = `
      <div class="video-set-header">
        <h3>${formatSceneTitle(set.title)}</h3>
        <div class="video-set-meta">${set.meta || ""}</div>
      </div>
      ${hasRows ? '<div class="comparison-rows"></div>' : '<div class="reference-grid"></div><div class="media-grid"></div>'}
    `;

    if (hasRows) {
      const rows = section.querySelector(".comparison-rows");
      set.rows.forEach((row, index) => {
        const rowSection = document.createElement("section");
        rowSection.className = `comparison-row${index > 0 ? " is-continuation" : ""}`;
        rowSection.setAttribute("aria-label", formatSceneTitle(row.title));
        rowSection.innerHTML = '<div class="comparison-row-grid"></div>';
        const grid = rowSection.querySelector(".comparison-row-grid");
        row.references.forEach((item) => grid.append(mediaCard(item)));
        row.videos.forEach((item) => grid.append(videoCard(item)));
        rows.append(rowSection);
      });
    } else {
      const refs = section.querySelector(".reference-grid");
      const videos = section.querySelector(".media-grid");
      const refClass = set.referenceClass ? set.referenceClass : set.references.length === 2 ? "two-up" : "";
      const mediaClass = set.mediaClass ? set.mediaClass : set.columns === 2 ? "two-up" : "";
      if (refClass) refs.classList.add(refClass);
      if (mediaClass) videos.classList.add(mediaClass);
      set.references.forEach((item) => refs.append(mediaCard(item)));
      set.videos.forEach((item) => videos.append(videoCard(item)));
    }

    container.append(section);
  }

  function renderMainResult(pair) {
    const section = document.createElement("section");
    const sceneRatio = mediaRatioFor({ file: `main_${pair.scene}.mp4` }, "video");
    section.className = "item video-set";
    section.innerHTML = `
      <div class="video-set-header">
        <h3>${formatSceneTitle(pair.scene)}</h3>
        <div class="video-set-meta">${pair.pair}</div>
      </div>
      <div class="main-support-grid"></div>
      <div class="main-method-grid"></div>
    `;
    const support = section.querySelector(".main-support-grid");
    support.append(
      mediaCard({ label: "Content", tag: "Input", type: "video", root: "content", file: `main_${pair.scene}.mp4` }),
      mediaCard({ label: "Style", tag: "Reference", type: "image", root: "main", file: `${pair.pair}/style_${pair.style}.webp`, ratio: sceneRatio })
    );
    const methods = section.querySelector(".main-method-grid");
    data.methods.forEach(([method, label]) => {
      methods.append(
        mediaCard({
          label,
          tag: method === "ours" ? "Ours" : "Baseline",
          type: "video",
          root: "main",
          file: `${pair.pair}/${method}_${pair.scene}_${pair.style}.mp4`
        })
      );
    });
    return section;
  }

  function setupImageViewer() {
    const triggers = Array.from(document.querySelectorAll(".media-image-open"));
    if (!triggers.length) return;

    const viewer = document.createElement("dialog");
    viewer.id = "image-viewer";
    viewer.className = "image-viewer";
    viewer.setAttribute("aria-labelledby", "image-viewer-caption");
    viewer.innerHTML = `
      <div class="image-viewer-panel">
        <button class="image-viewer-close" type="button" aria-label="Close full-size image">Close</button>
        <img class="image-viewer-image" alt="">
        <p id="image-viewer-caption" class="image-viewer-caption"></p>
      </div>
    `;
    document.body.append(viewer);

    const viewerImage = viewer.querySelector(".image-viewer-image");
    const viewerCaption = viewer.querySelector(".image-viewer-caption");
    const closeButton = viewer.querySelector(".image-viewer-close");
    let activeTrigger = null;
    let lockedScrollY = 0;

    function finishClose() {
      document.body.classList.remove("is-image-viewer-open");
      document.body.style.removeProperty("top");
      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, lockedScrollY);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
      viewerImage.removeAttribute("src");
      viewerImage.alt = "";
      viewerCaption.textContent = "";
      const trigger = activeTrigger;
      activeTrigger = null;
      if (trigger) window.requestAnimationFrame(() => trigger.focus({ preventScroll: true }));
    }

    function closeViewer() {
      if (!viewer.hasAttribute("open")) return;
      if (typeof viewer.close === "function") viewer.close();
      else {
        viewer.removeAttribute("open");
        finishClose();
      }
    }

    function openViewer(trigger) {
      const thumbnail = trigger.querySelector("img");
      if (!thumbnail) return;
      activeTrigger = trigger;
      viewerImage.src = trigger.href;
      viewerImage.alt = thumbnail.alt;
      viewerCaption.textContent = thumbnail.alt;
      lockedScrollY = window.scrollY;
      document.body.style.top = `-${lockedScrollY}px`;
      document.body.classList.add("is-image-viewer-open");
      viewer.showModal();
      closeButton.focus({ preventScroll: true });
    }

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        const modifiedClick = event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
        if (modifiedClick || typeof viewer.showModal !== "function") return;
        event.preventDefault();
        openViewer(trigger);
      });
      trigger.addEventListener("keydown", (event) => {
        if (event.key !== " " || event.metaKey || event.ctrlKey || event.altKey) return;
        event.preventDefault();
        trigger.click();
      });
    });
    closeButton.addEventListener("click", closeViewer);
    viewer.addEventListener("click", (event) => {
      if (event.target === viewer) closeViewer();
    });
    viewer.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeViewer();
    });
    viewer.addEventListener("close", finishClose);
  }

  function restoreHashScroll() {
    if (!window.location.hash) return;
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) window.requestAnimationFrame(() => target.scrollIntoView());
  }

  function setupDeferredVideos() {
    const videos = Array.from(document.querySelectorAll("video[data-src]"));
    const states = new Map();
    const attached = new Set();
    const loading = new Set();
    const queued = new Set();
    const attachQueue = [];
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = navigator.connection;
    const supportsIntersection = "IntersectionObserver" in window;
    let reduceMotion = motionQuery.matches;
    let saveData = Boolean(connection && connection.saveData);
    let warmObserver = null;
    let playObserver = null;
    const playVisibilityRatio = 0.15;

    function isInViewport(video) {
      return stateFor(video).ratio > 0;
    }

    function limits() {
      const columns = window.innerWidth > 980 ? 3 : window.innerWidth > 680 ? 2 : 1;
      const visibleVideoCount = videos.filter(
        (video) => isInViewport(video) && video.dataset.state !== "error"
      ).length;
      const warmAttached = columns;
      const manualAttached = videos.filter((video) => {
        const state = stateFor(video);
        return state.manualRequested && !isInViewport(video) && video.dataset.state !== "error";
      }).length;
      const maxAttached = saveData ? 2 : visibleVideoCount + warmAttached + manualAttached;
      return {
        playing: reduceMotion || saveData ? 1 : videos.length,
        attached: maxAttached,
        warm: saveData ? 0 : warmAttached,
        concurrent: saveData ? 1 : Math.max(2, columns)
      };
    }

    function stateFor(video) {
      if (!states.has(video)) {
        states.set(video, {
          nearby: false,
          ratio: 0,
          lastUsed: 0,
          detachTimer: 0,
          manualRequested: false,
          userPaused: false,
          userInitiated: false,
          programmaticPauseCount: 0,
          autoPlayPending: false,
          playToken: 0,
          token: 0,
          attempt: null
        });
      }
      return states.get(video);
    }

    function shellFor(video) {
      return video.closest(".media-shell-video");
    }

    function statusFor(video) {
      const shell = shellFor(video);
      return shell && shell.querySelector(".media-status");
    }

    function buttonFor(video) {
      const shell = shellFor(video);
      return shell && shell.querySelector(".media-load");
    }

    function idleStatus() {
      return supportsIntersection && !reduceMotion && !saveData ? "Loads when nearby" : "Select Play to load";
    }

    function needsManualFallback(video) {
      const state = stateFor(video);
      const deferredBySaveData =
        saveData && (video.dataset.state === "idle" || video.dataset.state === "queued");
      return (
        video.dataset.state === "error" ||
        reduceMotion ||
        !supportsIntersection ||
        state.userPaused ||
        deferredBySaveData
      );
    }

    function setStatus(video, text, hidden) {
      const status = statusFor(video);
      if (!status) return;
      status.textContent = text;
      status.hidden = Boolean(hidden);
    }

    function setFallback(video, visible) {
      const button = buttonFor(video);
      if (!button) return;
      const hadFocus = document.activeElement === button;
      button.hidden = !visible;
      button.textContent = "Play";
      button.removeAttribute("aria-busy");
      button.removeAttribute("aria-disabled");
      if (!visible && hadFocus && video.dataset.state === "ready") {
        try {
          video.focus({ preventScroll: true });
        } catch (_error) {
          video.focus();
        }
      }
    }

    function setLoadingFallback(video) {
      const button = buttonFor(video);
      if (!button) return;
      button.hidden = false;
      button.textContent = "Loading…";
      button.setAttribute("aria-busy", "true");
      button.setAttribute("aria-disabled", "true");
    }

    function viewportDistance(video) {
      const rect = video.getBoundingClientRect();
      return Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
    }

    function compareLoadCandidates(a, b) {
      if (isInViewport(a) !== isInViewport(b)) return isInViewport(a) ? -1 : 1;
      const ratioDelta = stateFor(b).ratio - stateFor(a).ratio;
      if (Math.abs(ratioDelta) > 0.01) return ratioDelta;
      const inputDelta =
        Number(Boolean(b.closest(".reference-grid, .main-support-grid"))) -
        Number(Boolean(a.closest(".reference-grid, .main-support-grid")));
      if (inputDelta) return inputDelta;
      return viewportDistance(a) - viewportDistance(b);
    }

    function removeFromQueue(video, resetState) {
      queued.delete(video);
      for (let index = attachQueue.length - 1; index >= 0; index -= 1) {
        if (attachQueue[index] === video) attachQueue.splice(index, 1);
      }
      if (resetState && video.dataset.state === "queued") {
        video.dataset.state = "idle";
        setStatus(video, idleStatus(), false);
        setFallback(video, needsManualFallback(video));
      }
    }

    function cleanupAttempt(video) {
      const state = stateFor(video);
      const attempt = state.attempt;
      if (!attempt) return;
      video.removeEventListener("loadedmetadata", attempt.onMetadata);
      video.removeEventListener("error", attempt.onError);
      window.clearTimeout(attempt.timer);
      state.attempt = null;
    }

    function pauseVideo(video) {
      const state = stateFor(video);
      state.playToken += 1;
      state.autoPlayPending = false;
      if (video.paused) return;
      state.programmaticPauseCount += 1;
      video.pause();
    }

    function playVideo(video) {
      if (video.dataset.state !== "ready") return;
      const state = stateFor(video);
      state.lastUsed = Date.now();
      if (!video.paused) {
        setFallback(video, false);
        return;
      }

      const playToken = state.playToken + 1;
      state.playToken = playToken;
      state.autoPlayPending = true;
      video
        .play()
        .then(() => {
          if (playToken !== state.playToken || video.dataset.state !== "ready") return;
          state.autoPlayPending = false;
          state.lastUsed = Date.now();
          setFallback(video, false);
          reconcilePlayback();
        })
        .catch((error) => {
          if (playToken !== state.playToken) return;
          state.autoPlayPending = false;
          if (error && error.name === "AbortError") return;
          if (video.dataset.state !== "ready") return;
          state.userPaused = true;
          setFallback(video, true);
          reconcilePlayback();
        });
    }

    function detachVideo(video) {
      const state = stateFor(video);
      window.clearTimeout(state.detachTimer);
      state.detachTimer = 0;
      state.token += 1;
      cleanupAttempt(video);
      loading.delete(video);
      removeFromQueue(video, false);
      pauseVideo(video);
      video.dataset.state = "idle";
      video.removeAttribute("src");
      video.preload = "none";
      video.load();
      const shell = shellFor(video);
      if (shell) shell.classList.remove("is-ready");
      attached.delete(video);
      state.manualRequested = false;
      state.userInitiated = false;
      state.programmaticPauseCount = 0;
      state.autoPlayPending = false;
      setStatus(video, idleStatus(), false);
      setFallback(video, needsManualFallback(video));
    }

    function markVideoError(video) {
      const state = stateFor(video);
      state.token += 1;
      cleanupAttempt(video);
      loading.delete(video);
      removeFromQueue(video, false);
      pauseVideo(video);
      video.dataset.state = "error";
      video.removeAttribute("src");
      video.preload = "none";
      video.load();
      const shell = shellFor(video);
      if (shell) shell.classList.remove("is-ready");
      attached.delete(video);
      state.manualRequested = false;
      state.userInitiated = false;
      state.programmaticPauseCount = 0;
      state.autoPlayPending = false;
      setStatus(video, "Video unavailable", false);
      setFallback(video, true);
      refreshWarmQueue();
      pumpQueue();
      reconcilePlayback();
    }

    function compareVictims(a, b) {
      const aState = stateFor(a);
      const bState = stateFor(b);
      if (aState.manualRequested !== bState.manualRequested) return aState.manualRequested ? 1 : -1;
      if (isInViewport(a) !== isInViewport(b)) return isInViewport(a) ? 1 : -1;
      if (a.paused !== b.paused) return a.paused ? -1 : 1;
      if (Math.abs(aState.ratio - bState.ratio) > 0.01) return aState.ratio - bState.ratio;
      if (aState.nearby !== bState.nearby) return aState.nearby ? 1 : -1;
      const distanceDelta = viewportDistance(b) - viewportDistance(a);
      if (Math.abs(distanceDelta) > 1) return distanceDelta;
      return aState.lastUsed - bState.lastUsed;
    }

    function enforceAttachedLimit() {
      const maxAttached = limits().attached;
      while (attached.size > maxAttached) {
        const candidates = Array.from(attached).sort(compareVictims);
        const victim = candidates[0];
        if (!victim) break;
        detachVideo(victim);
      }
    }

    function enforceLoadingLimit() {
      const maxLoading = limits().concurrent;
      while (loading.size > maxLoading) {
        const candidates = Array.from(loading).sort(compareVictims);
        const victim = candidates[0];
        if (!victim) break;
        detachVideo(victim);
      }
    }

    function makeRoomFor(candidate) {
      const maxAttached = limits().attached;
      if (attached.size < maxAttached) return true;

      const candidateState = stateFor(candidate);
      const manual = candidateState.manualRequested;
      let candidates = Array.from(attached).filter((video) => video !== candidate);

      if (!manual) {
        const candidateVisible = isInViewport(candidate);
        candidates = candidates.filter((video) => {
          const state = stateFor(video);
          return (
            !state.manualRequested &&
            !isInViewport(video) &&
            (candidateVisible || video.dataset.state !== "loading")
          );
        });
      }

      candidates.sort(compareVictims);
      const victim = candidates[0];
      if (!victim) return false;

      if (!manual) {
        const victimState = stateFor(victim);
        const candidateIsCloser =
          !victimState.nearby ||
          isInViewport(candidate) ||
          viewportDistance(candidate) < viewportDistance(victim);
        if (!candidateIsCloser) return false;
      }

      detachVideo(victim);
      return attached.size < maxAttached;
    }

    function finishLoad(video, token, succeeded) {
      const state = stateFor(video);
      if (token !== state.token || !loading.delete(video)) return;
      cleanupAttempt(video);

      if (!succeeded) {
        markVideoError(video);
        return;
      }

      video.dataset.state = "ready";
      state.lastUsed = Date.now();
      const shell = shellFor(video);
      if (shell) shell.classList.add("is-ready");
      setStatus(video, "", true);
      setFallback(video, false);
      enforceAttachedLimit();
      reconcilePlayback();
      refreshWarmQueue();
      pumpQueue();
    }

    function attachVideo(video) {
      if (attached.size >= limits().attached || loading.size >= limits().concurrent) return false;

      const state = stateFor(video);
      state.token += 1;
      state.playToken += 1;
      state.autoPlayPending = false;
      state.programmaticPauseCount = 0;
      const token = state.token;
      const onMetadata = () => finishLoad(video, token, true);
      const onError = () => finishLoad(video, token, false);
      const timer = window.setTimeout(() => finishLoad(video, token, false), 15000);

      state.attempt = { onMetadata, onError, timer };
      loading.add(video);
      attached.add(video);
      video.dataset.state = "loading";
      video.preload = "metadata";
      setStatus(video, "Loading…", false);
      if (state.manualRequested) setLoadingFallback(video);
      else setFallback(video, false);
      video.addEventListener("loadedmetadata", onMetadata);
      video.addEventListener("error", onError);
      video.src = video.dataset.src;
      video.load();
      return true;
    }

    function sortQueue() {
      attachQueue.sort((a, b) => {
        const manualDelta = Number(stateFor(b).manualRequested) - Number(stateFor(a).manualRequested);
        if (manualDelta) return manualDelta;
        return compareLoadCandidates(a, b);
      });
    }

    function pumpQueue() {
      sortQueue();

      while (loading.size >= limits().concurrent && attachQueue.length) {
        const candidate = attachQueue[0];
        const candidateState = stateFor(candidate);
        if (!candidateState.manualRequested && !isInViewport(candidate)) break;

        const warmLoading = Array.from(loading)
          .filter((video) => !stateFor(video).manualRequested && !isInViewport(video))
          .sort(compareVictims);
        const victim = warmLoading[0];
        if (!victim) break;
        detachVideo(victim);
      }

      while (loading.size < limits().concurrent && attachQueue.length) {
        const video = attachQueue.shift();
        queued.delete(video);
        const state = stateFor(video);
        const autoEligible = (state.nearby || isInViewport(video)) && !reduceMotion && !state.userPaused;
        if (video.dataset.state !== "queued" || (!state.manualRequested && !autoEligible)) {
          if (video.dataset.state === "queued") {
            video.dataset.state = "idle";
            setStatus(video, idleStatus(), false);
            setFallback(video, needsManualFallback(video));
          }
          continue;
        }

        if (!makeRoomFor(video)) {
          attachQueue.unshift(video);
          queued.add(video);
          break;
        }

        if (!attachVideo(video)) {
          attachQueue.unshift(video);
          queued.add(video);
          break;
        }
      }
    }

    function enqueueAttach(video, manual, pumpNow = true) {
      const state = stateFor(video);
      if (manual) {
        state.manualRequested = true;
        state.userPaused = false;
        state.userInitiated = true;
        window.clearTimeout(state.detachTimer);
        state.detachTimer = 0;
      }

      if (video.dataset.state === "ready") {
        state.lastUsed = Date.now();
        if (manual) {
          setFallback(video, false);
          reconcilePlayback();
        }
        return;
      }

      if (video.dataset.state === "loading") {
        if (manual) {
          setStatus(video, "Loading…", false);
          setLoadingFallback(video);
        }
        return;
      }

      if (video.dataset.state === "queued") {
        if (manual) {
          removeFromQueue(video, false);
          queued.add(video);
          attachQueue.unshift(video);
          setStatus(video, "Loading…", false);
          setLoadingFallback(video);
          if (pumpNow) pumpQueue();
        }
        return;
      }

      if (video.dataset.state === "error") {
        if (!manual) {
          setFallback(video, true);
          return;
        }
        video.dataset.state = "idle";
      }

      if ((!manual && reduceMotion) || (!manual && state.userPaused)) {
        setFallback(video, true);
        return;
      }

      video.dataset.state = "queued";
      queued.add(video);
      if (manual) attachQueue.unshift(video);
      else attachQueue.push(video);
      setStatus(video, manual ? "Loading…" : "Preparing…", false);
      if (manual) setLoadingFallback(video);
      else setFallback(video, false);
      if (pumpNow) pumpQueue();
    }

    function refreshWarmQueue() {
      if (!supportsIntersection) return;

      const eligible = videos
        .filter((video) => {
          const state = stateFor(video);
          return (
            (state.nearby || isInViewport(video)) &&
            !state.userPaused &&
            video.dataset.state !== "error"
          );
        })
        .sort(compareLoadCandidates);
      const desired = reduceMotion
        ? []
        : saveData
          ? eligible.slice(0, limits().attached)
          : [
              ...eligible.filter(isInViewport),
              ...eligible.filter((video) => !isInViewport(video)).slice(0, limits().warm)
            ];
      const desiredSet = new Set(desired);

      Array.from(queued).forEach((video) => {
        const state = stateFor(video);
        if (!state.manualRequested && !desiredSet.has(video)) removeFromQueue(video, true);
      });

      desired.forEach((video) => {
        if (video.dataset.state === "idle") enqueueAttach(video, false, false);
      });
      enforceAttachedLimit();
      pumpQueue();
    }

    function reconcilePlayback() {
      if (document.hidden) {
        attached.forEach(pauseVideo);
        return;
      }

      const candidates = videos
        .filter((video) => {
          const state = stateFor(video);
          const visibleEnough =
            state.ratio >= playVisibilityRatio ||
            state.manualRequested ||
            (!supportsIntersection && state.userInitiated);
          const motionAllowed = !reduceMotion || state.userInitiated;
          return (
            video.dataset.state === "ready" &&
            visibleEnough &&
            motionAllowed &&
            (!state.userPaused || state.manualRequested)
          );
        })
        .sort((a, b) => {
          const aState = stateFor(a);
          const bState = stateFor(b);
          if (aState.manualRequested !== bState.manualRequested) return aState.manualRequested ? -1 : 1;
          const ratioDelta = bState.ratio - aState.ratio;
          if (Math.abs(ratioDelta) > 0.01) return ratioDelta;
          return viewportDistance(a) - viewportDistance(b);
        });

      const winners = new Set(candidates.slice(0, limits().playing));
      attached.forEach((video) => {
        if (video.dataset.state !== "ready") return;
        if (winners.has(video)) playVideo(video);
        else pauseVideo(video);
      });

      videos.forEach((video) => {
        const state = stateFor(video);
        if (video.dataset.state === "ready" && state.manualRequested) state.manualRequested = false;
      });
    }

    function scheduleDelayedDetach(video) {
      const state = stateFor(video);
      window.clearTimeout(state.detachTimer);
      state.detachTimer = window.setTimeout(() => {
        if (state.nearby || state.ratio >= playVisibilityRatio) return;
        detachVideo(video);
        refreshWarmQueue();
        pumpQueue();
        reconcilePlayback();
      }, 12000);
    }

    function createWarmObserver() {
      if (!supportsIntersection) return;
      if (warmObserver) warmObserver.disconnect();

      videos.forEach((video) => {
        const state = stateFor(video);
        state.nearby = false;
        window.clearTimeout(state.detachTimer);
        state.detachTimer = 0;
      });

      warmObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target;
            const state = stateFor(video);
            state.nearby = entry.isIntersecting;
            window.clearTimeout(state.detachTimer);
            state.detachTimer = 0;
            if (!entry.isIntersecting && video.hasAttribute("src")) scheduleDelayedDetach(video);
          });
          refreshWarmQueue();
        },
        { rootMargin: saveData ? "0px" : "500px 0px 600px 0px", threshold: 0 }
      );

      videos.forEach((video) => warmObserver.observe(video));
    }

    document.addEventListener("click", (event) => {
      const button = event.target.closest(".media-load");
      if (!button) return;
      if (button.getAttribute("aria-disabled") === "true") return;
      const shell = button.closest(".media-shell-video");
      const video = shell && shell.querySelector("video[data-src]");
      if (!video) return;
      enqueueAttach(video, true);
    });

    videos.forEach((video) => {
      const state = stateFor(video);
      video.addEventListener("pause", () => {
        if (state.programmaticPauseCount > 0) {
          state.programmaticPauseCount -= 1;
          return;
        }
        if (video.dataset.state === "ready" && !video.ended) {
          state.userPaused = true;
          state.userInitiated = true;
          state.manualRequested = false;
        }
      });
      video.addEventListener("play", () => {
        if (state.autoPlayPending || video.paused || video.dataset.state !== "ready") return;
        state.userPaused = false;
        state.userInitiated = true;
        state.manualRequested = true;
        window.setTimeout(reconcilePlayback, 0);
      });
      video.addEventListener("error", () => {
        if (video.dataset.state === "ready") markVideoError(video);
      });
    });

    if (supportsIntersection) {
      createWarmObserver();
      playObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const state = stateFor(entry.target);
            state.ratio = entry.isIntersecting ? entry.intersectionRatio : 0;
            if (state.ratio < playVisibilityRatio) pauseVideo(entry.target);
          });
          refreshWarmQueue();
          reconcilePlayback();
        },
        { threshold: [0, playVisibilityRatio, 0.65] }
      );
      videos.forEach((video) => playObserver.observe(video));
    } else {
      videos.forEach((video) => {
        setStatus(video, idleStatus(), false);
        setFallback(video, true);
      });
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) attached.forEach(pauseVideo);
      else reconcilePlayback();
    });

    const onMotionChange = (event) => {
      reduceMotion = event.matches;
      if (reduceMotion) {
        videos.forEach((video) => {
          const state = stateFor(video);
          state.manualRequested = false;
          state.userInitiated = false;
          if (video.dataset.state === "ready") pauseVideo(video);
        });
      }
      videos.forEach((video) => {
        if (video.dataset.state === "idle" || video.dataset.state === "queued") {
          setStatus(video, idleStatus(), false);
        }
        setFallback(video, needsManualFallback(video));
      });
      enforceAttachedLimit();
      enforceLoadingLimit();
      refreshWarmQueue();
      pumpQueue();
      reconcilePlayback();
    };

    if (motionQuery.addEventListener) motionQuery.addEventListener("change", onMotionChange);
    else if (motionQuery.addListener) motionQuery.addListener(onMotionChange);

    if (connection && connection.addEventListener) {
      connection.addEventListener("change", () => {
        const nextSaveData = Boolean(connection.saveData);
        if (nextSaveData === saveData) return;
        saveData = nextSaveData;
        videos.forEach((video) => {
          if (video.dataset.state === "idle" || video.dataset.state === "queued") {
            setStatus(video, idleStatus(), false);
          }
          setFallback(video, needsManualFallback(video));
        });
        createWarmObserver();
        enforceAttachedLimit();
        enforceLoadingLimit();
        refreshWarmQueue();
        pumpQueue();
        reconcilePlayback();
      });
    }

    let resizeTimer = 0;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        enforceAttachedLimit();
        enforceLoadingLimit();
        refreshWarmQueue();
        pumpQueue();
        reconcilePlayback();
      }, 120);
    });

    if (reduceMotion || saveData) {
      videos.forEach((video) => {
        setStatus(video, idleStatus(), false);
        setFallback(video, true);
      });
    }
  }

  function init() {
    data.sections.forEach((section) => {
      const container = document.getElementById(section.containerId);
      if (!container) return;
      section.sets.forEach((set) => renderSet(container, set));
    });

    const main = document.getElementById("main-results-container");
    if (main) data.mainResults.forEach((pair) => main.append(renderMainResult(pair)));
    setupImageViewer();
    setupDeferredVideos();
    restoreHashScroll();
  }

  init();
})();
