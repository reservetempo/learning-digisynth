# learning-digisynth — content plan

> **Read this file first, in a fresh context. It is the checklist and the recipe.**
> Pick the first unticked lesson, follow the recipe, tick the box, stop.
> One lesson per session. Do not start the next one.

The site shadows `C:\Users\DomPC\Desktop\digi-synth0001` — a 13-phase, ~130-step JUCE/C++
synthesizer build. Each lesson here covers roughly three PLAN steps, grouped by *idea* rather
than by step number.

---

## The recipe — building one lesson

1. **Pick** the first unticked lesson below. It names the PLAN steps it covers.
2. **Read only those steps.** From the synth project:
   `grep -n "^- \[.\] \*\*<id> " ../../digi-synth0001/PLAN.md`, then read from that line to the next
   line starting `- [`. Never `cat PLAN.md` — it is 62 KB.
   The ***Trap:*** lines are the most valuable text in the whole project. They are real mistakes,
   already paid for once. Put them in the lesson.
3. **If the step is ticked `[x]`**, the code exists:
   - read the real source file it produced (`digi-synth0001/src/...`) and quote it verbatim;
   - read `digi-synth0001/docs/steps/<id>.md` if it exists — that is the retrospective;
   - read its line in `digi-synth0001/PROGRESS.log`;
   - set the badge to `status-built` / `Built`.

   **If the step is unticked**, the code does not exist. Write illustrative snippets, caption them
   `<span class="notyet">illustrative — this file does not exist yet</span>`, and set the badge to
   `status-planned` / `Planned`.
4. **Read at most one `###` section** of `digi-synth0001/docs/ARCHITECTURE.md` if the lesson needs
   it. Locate with `grep -n "^###"`, read with `sed -n '<a>,<b>p'`. Never the whole file.
5. **Copy `assets/_template.html`** to `lessons/<id>-<slug>.html` and fill in the ten blocks.
   Set the part class on `<body>` (`p-a` … `p-m`).
6. **Update, in this order:**
   - the previous lesson's pager — replace its "not written yet" span with a real next link;
   - `index.html` — remove `class="todo"` from the `<li>` and turn the `<span class="title">`
     into an `<a class="title" href="lessons/...">`;
   - `glossary.html` — add any new terms, keeping letters alphabetical;
   - `further-reading.html` — add any new links (check they resolve first);
   - this file — tick the box.
7. **Verify** (see below), then stop.

### Rules that keep 41 pages coherent

- Never invent a step that is not in `PLAN.md`.
- Never let a `class="jargon"` link point at a glossary anchor that does not exist.
- Introduce each term exactly once, in the earliest lesson that needs it; link to the glossary after.
- Every snippet ≤ 25 lines. If it needs more, it needs cutting, not scrolling.
- No external `<script>` or `<link>` tags, ever. The site must work offline from `file://`.
- Say **voice** for one of the six synths and **note** for one sounding note, always.
- ~1200–1800 words. Shorter is fine if the idea is small; padding is not.

### Verify before committing

1. **`node tools/check-links.js`** — must print `0 problem(s)`. It checks every internal link,
   every glossary anchor, the stylesheet, and that no external script or stylesheet has crept in.
2. Open the page in a browser and look at it. Note that opening `file://` pages through the
   Claude Code preview pane strips the stylesheet (it serves them as `data:` URLs) — to see the
   real thing, serve the folder over HTTP and browse `http://localhost:<port>/`.
3. Check the mobile width — no horizontal scrolling of the page itself; code scrolls in its own box.
4. Anything captioned **real code** must match the file it came from. Diff it; do not trust memory.
   If a quote has been simplified for readability, the caption must say so
   (e.g. *"from the design doc, jargon trimmed"*) rather than claiming to be verbatim.

---

## The lessons

### Part A — Orientation · accent `#dfdfdf`
- [x] **a1 · What we are actually building** — `lessons/a1-what-were-building.html`
      *Covers: PLAN Context, Decisions already made.* The instrument, the 2.67 ms deadline,
      why the design is parallel. Architecture idea: let the constraint choose the design.
      C++: `constexpr`.
- [ ] **a2 · How this project is run**
      *Covers: PLAN step protocol, 0.6, 0.7, 0.9.* One step per session, the size budget, the
      *Verify* gate, four documents with one job each, why context is a budget.
      Architecture idea: documentation as an interface.

### Part B — Getting a program to exist · Phase 0 · accent `#8fa0ff`
- [ ] **b1 · From text to a running program** — *Covers: 0.1, 0.3.* Compiler, linker, CMake,
      FetchContent, what JUCE is, `/W4 /WX` as a design decision. C++: translation units and linking.
- [ ] **b2 · The first window** — *Covers: 0.2, 0.4 + ARCHITECTURE § UI scaling.* JUCE's Component
      and message-thread model; a fixed 1400×1920 design surface and one transform; why there is no
      responsive layout on purpose.
- [ ] **b3 · Scripts, and the first test** — *Covers: 0.5, 0.8.* Automating build/test/run, Catch2,
      ctest, and the trap where an empty suite reports a pass.

### Part C — The primitives that make it fast · Phase 1 · accent `#40c4ff`
- [ ] **c1 · Constants and compile-time checks** — *Covers: 1.1.* `constexpr`, `static_assert`,
      headers vs translation units, why a header nothing includes is never compiled.
- [ ] **c2 · Eight notes at once** — *Covers: 1.2a, 1.2b.* SIMD from scratch, one note per lane,
      and why `min` must not be `std::min`.
- [ ] **c3 · Three engines behind one name** — *Covers: 1.3a, 1.3ba, 1.3bb, 1.4a, 1.4b, 1.4ca,
      1.4cb.* Compile-time backend selection, oracle testing, mutation testing, and the NaN
      divergence that turned out to be unstable (see `docs/steps/1.3ba.md`).
- [ ] **c4 · Code without branches** — *Covers: 1.5a, 1.5b, 1.5ca, 1.5cb.* Masks and `select`.
      Note `docs/steps/1.5ca.md`: a test fixture that hid a bug in its own oracle.
- [ ] **c5 · Tiny numbers, big stalls** — *Covers: 1.6.* Denormals, FTZ/DAZ, and RAII. Note the
      trap where the obvious test passes while testing nothing (the optimiser folds the constant).
- [ ] **c6 · Handing work between threads** — *Covers: 1.7, 1.8.* Races, a lock-free SPSC queue,
      the RCU pattern, memory ordering in plain words.
- [ ] **c7 · Six cores, one block** — *Covers: 1.9, 1.10, 1.11.* Thread pool, spin barrier,
      P-core affinity, MMCSS "Pro Audio", measuring in microseconds.

### Part D — Describing every knob · Phase 2 · accent `#1de9b6`
- [ ] **d1 · One source of truth** — *Covers: 2.1, 2.2, 2.12, 2.13.* `ParamDef` as a constexpr
      table, X-macros, adding a parameter as a one-line edit, validating the whole table in a test.
- [ ] **d2 · What a synth's knobs actually are** — *Covers: 2.3–2.7.* The big vocabulary lesson:
      cutoff, resonance, drive, unison, detune, transpose, wavetable position, envelope times.
- [ ] **d3 · Storing and shaping a value** — *Covers: 2.8–2.11 and 1.12.* Atomics, cache lines,
      false sharing, normalized ↔ real, skew, formatting, encoder detents, and smoothing.

### Part E — Making sound come out · Phase 3 · accent `#64ffda`
- [ ] **e1 · The audio callback** — *Covers: 3.1, 3.2.* Sample rate, buffers, frames, latency,
      xruns, ASIO vs WASAPI, and the rules: no allocation, no locks, no logging.
- [ ] **e2 · The block cycle** — *Covers: 3.3–3.10.* The seven steps, chunking, parallel dispatch,
      the master stage, offline render, benchmarking, viz ring buffers.

### Part F — Notes and polyphony · Phase 4 · accent `#ffd740`
- [ ] **f1 · What a "voice" is** — *Covers: 4.1–4.4.* Note events with sample offsets, 16 notes as
      2 SIMD groups, voice stealing.
- [ ] **f2 · Glide, unison, and playing dynamics** — *Covers: 4.5–4.7.* Portamento, detuned stacks,
      note-derived modulation sources.

### Part G — Oscillators and wavetables · Phase 5 · accent `#aa88ff`
- [ ] **g1 · What a spectrum is** — *Covers: 5.1, 5.2.* Harmonics, the FFT, bins, the two domains.
- [ ] **g2 · Wavetables, aliasing and mipmaps** — *Covers: 5.3–5.8.* Nyquist, aliasing,
      band-limiting, mipmaps, and loading real CC0 banks.
- [ ] **g3 · Playing and warping a wave** — *Covers: 5.9–5.14.* Phase accumulators, interpolation,
      the phase-domain distort modes, FM, ring mod, hard sync.
- [ ] **g4 · When an idea is too expensive** — *Covers: 5.15–5.19.* The ~600 MFLOP/s estimate that
      killed per-block FFT, and the prerendered morph axis that replaced it.

### Part H — Filters and modulators · Phase 6 · accent `#ffb74d`
- [ ] **h1 · What a filter is** — *Covers: 6.1, 6.2.* Cutoff, resonance, poles, TPT/SVF, the ladder.
- [ ] **h2 · Combs, formants, and one module for all of them** — *Covers: 6.3, 6.4.* Runtime model
      selection without paying for it per sample.
- [ ] **h3 · Things that move by themselves** — *Covers: 6.5–6.9.* DAHDSR envelopes, LFOs, random
      modulators, macros, and feeding live values to the screen.

### Part I — Effects · Phase 7 · accent `#ff5252`
- [ ] **i1 · An interface for effects** — *Covers: 7.1.* Abstract base classes, virtual dispatch,
      what a vtable costs, designing something implemented eleven times.
- [ ] **i2 · A chain you can reorder while it runs** — *Covers: 7.2.* RCU in practice, allocation on
      the render thread, crossfading a swap.
- [ ] **i3 · Effects made of delay** — *Covers: 7.5–7.9.* One delay line behind chorus, flanger,
      phaser, echo and the Hadamard FDN reverb.
- [ ] **i4 · Shaping level and spectrum** — *Covers: 7.3, 7.4, 7.10–7.12.* Waveshaping, compression,
      EQ, and testing something whose output is a matter of taste.

### Part J — The modulation matrix · Phase 8 · accent `#ff99e9`
- [ ] **j1 · The matrix** — *Covers: 8.1–8.4.* Routes, immutable snapshots, bipolar depth, and the
      `modRange` trick that keeps a full-depth modulation musical.
- [ ] **j2 · Modulation across voices** — *Covers: 8.5–8.7.* Resolving cross-voice routes before
      dispatch so no synchronisation is needed; proving the cost with a stress test.

### Part K — The sequencer · Phase 9 · accent `#fff6e1`
- [ ] **k1 · Musical time** — *Covers: 9.1, 9.3, 9.5.* Tempo, PPQ, sample-accurate events, and why
      nearly-right timing is audibly wrong.
- [ ] **k2 · Euclidean rhythms** — *Covers: 9.2, 9.4, 9.6–9.9.* Bjorklund's algorithm, swing,
      probability, ratchets, scale quantization.

### Part L — The interface · Phases 10–12 · accent `#ff8180`
- [ ] **l1 · Painting at 60 frames a second** — *Covers: 10.1–10.4.* Theme constants, embedded
      fonts, Direct2D, the repaint driver, the RootScaler transform.
- [ ] **l2 · The building blocks of the panel** — *Covers: 10.5–10.9.* Nav bars, the 1080×286
      module frame, encoder readouts, the simulated encoder strips.
- [ ] **l3 · Twelve real encoders** — *Covers: 10.10–10.13.* MIDI in, the event hub, and binding a
      physical knob to whatever the current page says it controls.
- [ ] **l4 · Pages and displays** — *Covers: 11.1–11.12.* The page abstraction, the wavetable 3D
      view, filter response curve, envelope and LFO editors, the matrix page.
- [ ] **l5 · The sequencer section** — *Covers: 12.1–12.5.* Step grids, chord entry, the global
      matrix page, the master page, playhead animation.

### Part M — Making it real · Phase 13 · accent `#d3d6d6`
- [ ] **m1 · Randomiser, stress and hardening** — *Covers: 13.1–13.5.* A musical randomiser, a
      10-minute full-load test, profiling, NaN fuzzing, the audio-thread allocation guard.
- [ ] **m2 · Shipping to the tablet** — *Covers: 13.6–13.9.* Production fullscreen mode, ASIO
      bring-up, end-to-end acceptance, and writing down what was left out.

---

## Site conventions (settled — do not re-decide)

| Thing | Decision |
|---|---|
| Tech | Hand-written static HTML + `assets/site.css`. No build step, no framework, no npm. |
| Hosting | GitHub Pages, `main` branch, repo root, `.nojekyll` present. |
| Interactivity | Diagrams only — inline SVG. No Web Audio, no audio players. |
| Theme | Dark only, Vital palette from `digi-synth0001/docs/ARCHITECTURE.md` § Vital colour map. |
| Highlighting | Hand-marked `<span class="k t c s f n pp">`. No library, no CDN. |
| File naming | `lessons/<part><n>-<slug>.html`, e.g. `lessons/c2-eight-notes-at-once.html`. |
