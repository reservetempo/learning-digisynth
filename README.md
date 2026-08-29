# learning-digisynth

A small static learning site that explains, for a layman, what is being built in the
`digi-synth0001` project — a standalone JUCE/C++ polyphonic synthesizer for a tablet
touchscreen and a 12-encoder hardware controller.

The synth's own `PLAN.md` is written for a machine to execute: ~130 terse steps across
13 phases. This site is the readable half — one page per idea, with the vocabulary
defined, the code quoted and explained, the software-architecture lesson named, and links
out to the best explainers on each topic.

**41 lessons in 13 parts.** Written one at a time; greyed-out titles on the contents page
are not written yet.

## Reading it

Open `index.html`. That is the whole site — hand-written HTML, one stylesheet, no build
step, no JavaScript, no tracking. It works equally well from a local file or over HTTPS.

## Publishing

GitHub Pages, served from the `main` branch at the repository root. `.nojekyll` is present
so the files are served exactly as written.

## Adding a lesson

`CONTENT-PLAN.md` is the checklist and the recipe: pick the first unticked lesson, follow
the seven steps, tick the box, stop. `assets/_template.html` is the page skeleton every
lesson is copied from.

## Layout

```
index.html            the contents — 13 parts, 41 lessons
glossary.html         every alien word, one anchor each
further-reading.html  every external link, grouped by topic
about.html            how the site maps to the build, and how to read it
CONTENT-PLAN.md       the lesson checklist and the per-lesson recipe
assets/site.css       the whole design system
assets/_template.html the lesson skeleton
lessons/*.html        one file per lesson
tools/check-links.js  verification: run `node tools/check-links.js` before committing
```
