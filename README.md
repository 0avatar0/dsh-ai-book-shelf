# AI Book Shelf / AI 书架

[![GitHub](https://img.shields.io/badge/GitHub-0avatar0%2Fdsh--ai--book--shelf-181717?logo=github)](https://github.com/0avatar0/dsh-ai-book-shelf)
[![Release](https://img.shields.io/badge/release-v2.7.0-2ea44f)](https://github.com/0avatar0/dsh-ai-book-shelf/releases/tag/v2.7.0)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

A persistent DSH Web UI plugin that adds a full-page multi-format reader to the
sidebar, an AI explanation rail for selected text, a paper library with
translation and bilingual comparison, and a dossier library with searchable
files and AI summaries.

## Highlights

- **Read many formats** — EPUB, PDF, TXT, Markdown, HTML, FB2 and DOCX.
- **Ask without leaving the page** — select text for background, context,
  explanations and follow-ups in the right rail.
- **Search the whole shelf** — full-book `Ctrl+F`, online book search (Project
  Gutenberg, Standard Ebooks, Chinese Wikimedia sources) and custom OPDS sources.
- **Paper mode** — paragraph/whole-paper translation, bilingual comparison, AI
  explanations and follow-ups.
- **Dossier mode** — folders, Ctrl+A multi-import, keyword search, AI summaries
  of results, and per-folder skills.

## Install

1. Download `dsh-ai-book-shelf-2.7.0.tgz` from the
   [latest release](https://github.com/0avatar0/dsh-ai-book-shelf/releases/tag/v2.7.0),
   or install from npm with `dsh-ai-book-shelf@2.7.0`.
2. In DSH open **Plugins → Add plugin** and choose the downloaded tgz, or paste
   the npm package spec.
3. Reload the plugin and open **AI 书架 / AI Book Shelf** in the sidebar.

Chinese step-by-step guide: [INSTALL-zh.md](INSTALL-zh.md). Publishing and npm
instructions: [PUBLISHING.md](PUBLISHING.md).

## What it does

- **Shelf** — scans the archive shelf (the first registered workspace by
  default, which is `D:\BookLib` on this deployment), plus any extra
  `libraryDirs`, for supported book files.
- **Copies external books** — a book opened or imported from outside the
  archive shelf is copied into `archiveDir` first. Identical files are reused;
  a name collision gets a ` (2)` suffix rather than overwriting anything.
- **Dossier mode** — a separate dossier library with folders, multi-select
  import (Ctrl/Cmd or Ctrl+A in the file picker), folder-scoped full-text
  search, streamed AI summaries, and folder skills. Creating a folder adds an
  empty skill you can fill in; an imported `SKILL.md` can replace it, and AI
  summaries follow it.
- **Public-domain search** — the **Search books** tab queries Project Gutenberg
  (Gutendex, with the Gutenberg website search as a fallback), a Chinese-only
  Project Gutenberg catalog (`lang=zh`), Chinese Wikisource, Chinese Wikibooks,
  and Standard Ebooks, then saves the chosen book (EPUB, or an HTML book for
  the Wikimedia sources) into the archive shelf. Simplified Chinese queries are
  also tried as traditional Chinese for the Chinese catalogs. Results stream
  into the page one source at a time; slower sources keep searching while the
  first results are already usable. The search store lives outside the Library
  component, so opening a book or switching Harness pages does not abort the
  stream; returning restores the query and results, and the Host keeps result
  ids downloadable for 30 minutes. Only
  public-domain / openly licensed catalogs are used; DRM and unauthorized book
  sources are not supported. Choose which catalogs to query with **Choose
  sources**; the selected source homepages are shown as small links. A custom
  **OPDS** search URL can be added, but only entries that declare an
  `open-access` EPUB acquisition link are accepted. Several custom OPDS sources
  can be added with the **+** button. The built-in Chinese catalogs cover
  traditional Chinese Gutenberg titles and Wikisource; other catalogs are
  mostly English.
- **Reader** — parses the book into chapters, sanitizes HTML, and renders a
  comfortable serif reading page with per-book progress. EPUB keeps its OPF
  spine, headings, lists, tables, images and TOC; PDF/Text/Markdown/HTML/FB2/
  DOCX are normalized into readable chapters.
- **Ask while selecting** — the floating selection bar contains a question
  field to the left of **解释**. Type a specific question and press Enter or
  **解释**, or leave it blank for a direct explanation. The question is sent
  together with the book, chapter, selection, and nearby context; the right
  rail opens and streams the answer.
- **Follow-ups** — keep the whole Q&A thread in the panel and send the previous
  turns to the model, so pronouns and earlier details stay in context. You can
  stop the stream, copy the answer, or use quick asks (translate / example /
  background).
- **Per-book annotations** — every completed explanation and its follow-ups are
  saved on the Host under the archive directory. Opening a book opens the right
  annotation rail with that book's saved records; click a record to reopen its
  Q&A thread and continue asking. Records survive browser reloads and restarts.
- **Paper mode** — a separate paper library for English PDFs, with virtual
  folders (create, drag papers in, rename), paragraph-level translation into a
  JSON translation file, manual correction, retranslation, whole-paper
  translation saved as a new Chinese paper, and a bilingual compare view.
  Paper reading reuses the reader's AI explanation and full-book search; the
  compare view has the same right-side AI rail, selection question bar,
  follow-ups, saved annotation history and per-answer collapse as books, and
  works for both the English source and the Chinese translation. Annotation
  history and threads can delete a whole thread or an individual follow-up
  question/answer pair, with an X in the record's top-right corner and a
  second-click confirmation. The paper library supports right-click menus for
  new folders, importing into a folder, and renaming; the new-folder control is
  an icon on the right. Books can be hidden/unhidden or deleted (moved to
  `.epub-reader/trash`) from the book-card context menu. Papers can be deleted
  from their card context menu (two-step confirmation); a source paper also
  removes its Chinese translation paper and moves the PDF/translation file to
  the paper trash. Paper copies live in
  `.epub-reader/papers`, separate from the book shelf. The compare toggle sits
  in the paper reader header and can be hidden again; each
  translation box is resizable from its bottom edge, auto-fits its text on
  first open, remembers its height/collapsed state, and can be collapsed
  individually or all at once. Translation text supports AI explanation.
- **Zoom** — Ctrl/Cmd + mouse wheel changes the reading font size in both books
  and papers; the paper compare view also zooms its source/translation text.
- **AI panels** — explanations are expanded by default and can be collapsed
  individually or with one “Collapse all” action.
- **Find in book** — `Ctrl/Cmd+F` opens a full-book search across every
  chapter, including PDF/HTML/DOCX books. Results show chapter, occurrence and
  a text snippet; clicking one jumps to the chapter and highlights every match.
  The reader toolbar shows the shortcut next to the search button. Simplified
  Chinese queries also match traditional text (`陈文龙` finds `陳文龍`).
- **Keyboard** — `Ctrl/Cmd+Shift+E` explains the current selection,
  `Alt+←` / `Alt+→` move between chapters, `Esc` closes search/rail.

## Supported formats

| Format | Support |
|---|---|
| `.epub` | Full spine, chapters, TOC, images, cover |
| `.pdf` | Text-layer extraction, 8 pages per chapter; scanned PDFs need OCR first |
| `.txt` / `.text` | Plain text, automatically chunked |
| `.md` / `.markdown` | Headings, paragraphs, lists, quotes, code blocks |
| `.html` / `.htm` / `.xhtml` | Sanitized HTML body |
| `.fb2` | FictionBook XML |
| `.docx` | Word paragraphs and Heading 1–3 chapters |
| `.mobi` / `.azw3` / `.azw` | Convert to EPUB or PDF first (for example with Calibre) |

PDF extraction uses a vendored PDF.js runtime under `vendor/pdfjs/`; the package
has no npm runtime dependency for it.

## Configuration

Edit the installed row's config in the profile patch (or the plugin's
`cordis.patch.yml` before installing):

```yaml
- id: epub-reader
  name: '@local/dsh-epub-reader'
  config:
    # Where outside books are copied and what the shelf scans by default.
    # Empty = the first registered workspace (D:\BookLib here), then cwd.
    archiveDir: D:\BookLib
    # Extra folders to scan, if any. Absolute paths are allowed.
    libraryDirs:
      - D:\Books
    # Optional; otherwise the Host's default model is used.
    # Example: explainProvider: deepseek-account
    #          explainModel: deepseek-flash
    explainProvider: deepseek-account
    explainModel: deepseek-flash
    # Off by default: the API answers only loopback browser requests.
    allowRemote: false
```

The Host routes are mounted under `/api/epub-reader`. They accept only
same-origin browser requests, expose only `.epub` files found under a configured
shelf root, copy external files into the archive before parsing, and stream
explanations over SSE.

## Notes

- Books are opened read-only; progress is stored in the browser's `localStorage`.
- DRM-protected books are not supported.
- PDF support is text-first: a scanned/image-only PDF returns `PDF_NO_TEXT`
  instead of showing blank pages. Run OCR or convert it to a text PDF first.
- MOBI/AZW3 are not parsed directly; convert them to EPUB/PDF before importing.
- The plugin uses the official `llm` Host service; no API key is read by the
  plugin itself.
- Only the first 5 opened books are retained in memory; a re-open re-parses the
  file.
- Annotation history is stored in `<archiveDir>/.epub-reader/annotations.json`
  and keyed by the EPUB content fingerprint, so the same book keeps its records
  even at a different path. Copy that folder with the EPUB when moving a shelf
  to another machine if the annotations should travel with it.
- Search results are cached for 30 minutes so a result can be downloaded; a
  stale id returns `SEARCH_EXPIRED` and the UI asks you to search again.
- Clearing the search field (the browser's X) or pressing **Stop searching**
  aborts the in-flight request instead of leaving the spinner running.
- Custom OPDS sources must be lawful/open-access catalogs. The Host only accepts
  EPUB acquisition links marked `open-access`; it is not a generic downloader.
- Downloads are bounded to 120 MB and fetched only from allow-listed
  `gutenberg.org` / `standardebooks.org` hosts. Large books can take a while.
- The search feature needs outbound network access from the DSH Host process.

## License

Plugin code is released under the [MIT License](LICENSE). The bundled PDF.js
runtime keeps its own Apache-2.0 license under `vendor/pdfjs/LICENSE`; bundled
fonts keep the licenses in `vendor/pdfjs/standard_fonts/`.
