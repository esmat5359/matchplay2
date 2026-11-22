// Seeking that works on every host.
// Some static hosts and CDNs answer a video request without byte-range support. The browser then cannot jump into the
// middle of the file, so a chapter click or a click on the progress bar silently restarts the video at 0:00.
// These helpers (1) wait for the metadata before seeking, and (2) when a seek lands back at the start, download the
// file once and play it from memory, where seeking always works.

/** Resolves once the duration is known. Starts fetching the metadata if the element is idle (preload="none"). */
export function whenReady(v) {
  return new Promise((resolve) => {
    if (v.readyState >= 1) return resolve();
    v.addEventListener("loadedmetadata", () => resolve(), { once: true });
    if (v.networkState !== 2) { // 2 = already loading
      if (v.preload === "none") v.preload = "metadata";
      v.load();
    }
  });
}

/** Jump to `t` seconds (clamped) and optionally start playing from there. */
export async function seekTo(v, t, { play = true } = {}) {
  await whenReady(v);
  const max = Number.isFinite(v.duration) ? Math.max(0, v.duration - 0.3) : t;
  v.currentTime = Math.min(Math.max(0, t), max);
  if (play) v.play().catch(() => {});
}

async function toMemory(v, t, resume, card) {
  card?.classList.add("buffering");
  try {
    const res = await fetch(v.currentSrc || v.src);
    const url = URL.createObjectURL(new Blob([await res.blob()], { type: "video/mp4" }));
    await new Promise((done) => { v.addEventListener("loadedmetadata", done, { once: true }); v.src = url; v.load(); });
    v.currentTime = t;
    if (resume) v.play().catch(() => {});
  } catch { /* keep whatever the browser managed to do */ } finally { card?.classList.remove("buffering"); }
}

/** Watches every seek (chapter buttons and the native progress bar). If a jump to a later point ends in the first
 *  seconds, the host does not support range requests: switch to an in-memory copy and repeat the jump once. */
export function guardSeeking(v, card) {
  let want = null, paused = true, recovered = false;
  v.addEventListener("seeking", () => { want = v.currentTime; paused = v.paused; });
  v.addEventListener("seeked", () => {
    const t = want; want = null;
    if (recovered || t == null || t < 3 || v.currentTime > 2) return;
    recovered = true;
    toMemory(v, t, !paused, card);
  });
}
