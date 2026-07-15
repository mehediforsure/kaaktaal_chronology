# Kaaktaal Web — Project Overview

This document provides a comprehensive technical and functional overview of the **Kaaktaal Web** application (Version 1.3). It is designed to explain how the website works, detailing the architecture, database integration, distinct sections (rooms), and core features.

---

## 1. Project Concept & Design Language
**Kaaktaal** (কাকতাল — "coincidence" in Bengali) is an immersive digital cultural archive built for a Bangladeshi musical and artistic project. Rather than a standard informational website, it is crafted as a **brutalist museum-style experiential archive** structured around the themes of **Coincidence & Serendipity**.

### Visual Aesthetic & Style:
* **Color Palette**: Off-white paper background (`#F8F7F4`), near-black ink text (`#111113`), and a striking crimson red accent (`#d31a1a`).
* **Typography**: Rich typographical system using *Syne* for titles, *BD Plakatbau* for brand display, *EB Garamond* for serif styling, *Courier Prime* for typewriter vibes, and *Space Mono* for high-tech monospace labels.
* **Layouts**: Asymmetrical grids, typewriter-like layouts, and dynamic animations powered by Framer Motion.

---

## 2. Architecture & Tech Stack

The application was recently migrated from a single-page Vite application to a modern, search-engine-optimized **Next.js 16 (App Router)** setup:

* **Framework**: Next.js 16.2 (React 19)
* **Styling**: Tailwind CSS v4 with custom `@theme` system
* **Animations**: Framer Motion (`motion`)
* **AI Integration**: Google Gemini AI (`@google/genai`)
* **Database**: Supabase (PostgreSQL client)
* **Hosting**: Vercel

---

## 3. Core Database Structure (Supabase)

To manage content dynamically, the site connects to **Supabase** with fail-safe local mock-data fallbacks ensuring the website remains fully functional even in offline environments or database outages.

### Tables & Schemas:
1. **`releases`**: Stores official albums, EP information, cover arts, and publication dates.
2. **`songs_official`**: Detailed records of official releases containing lyrics, stories, release IDs, genres, and moods.
3. **`lyrics_bank`**: Dedicated bank containing Bengali and English translations of lyrics, searchable and filterable by comma-separated song IDs.

### Database Clients:
* **Standard Client (`supabase`)**: Client-side read-only queries with anonymous keys.
* **Admin Client (`supabaseAdmin`)**: Service-role-based client used in secure API server routes to perform bypass actions safely.

---

## 4. The Room-Based Navigation (Sections)

Instead of traditional page routing, Kaaktaal runs on a single-page **room-switching pattern** that provides seamless, animated transitions between areas:

* **Home Room (`home`)**: The entrance to the archive. Features the main portal gateway and the **Journal Section** showing typewriter-styled logs.
* **Portal Room (`portal`)**: An immersive grid of song cards. Clicking a song opens a detailed, slide-out drawer containing cover art, lyrics, and production logs.
* **Music Room (`music`)**: A filterable music catalog designed in a custom **zigzag layout** which displays album titles, release dates, and links to explore songs.
* **Finder Room (`finder`)**: A multi-tab hub for discovery:
  * *Few & Far Between*: Curated collections categorized by theme (e.g., "Songs of Dhaka").
  * *Seek*: The AI inquiry terminal.
  * *Map*: The geography panel.
* **Memory Room (`memory`)**: A locked space where users can read or submit personal stories and interpretations of Kaaktaal songs.
* **Map Room (`map`)**: A fully interactive SVG-based map of Bangladesh allowing users to explore regional musical influences.
* **Accident Room (`accident`)**: A catalog log compiling all randomly triggered "divine accidents."

---

## 5. Key Interactive Features

### A. The Engagement & Unlock System
To encourage exploration, the app runs a client-side tracking system via `EngagementProvider`. It measures user actions (time spent, songs opened, map clicks, and rooms visited) and saves them in `localStorage`.
* **Unlock Mechanic**: Secret rooms (like the *Memory Room*) will unlock only after a user interacts with enough sections (e.g., visiting 3+ rooms and spending over 120 seconds).

### B. The Crow & Divine Accidents
An animated crow floats around specific pages. When clicked, it triggers a **"Divine Accident"**—a random event overlay drawing from a pool of ~40 custom cards:
* Lyric snippets with translations
* Vault restricted info cards (unpublished tracks)
* Fan interpretations
* Interactive philosophical questions

### C. Inquiry Terminal (Gemini AI)
An AI-powered Q&A interface where users can ask questions about the project. The backend route uses the **Gemini 3.5 Flash** model with a system prompt instructing it to act as a *"wise, poetic archivist of the Kaaktaal vaults"*.

### D. Automated Journals & Telegram Integration
To keep the archive feeling fresh, the project includes an automated cron-triggerable endpoint (`/api/admin/journal/generate`):
1. **Generation**: The endpoint calls Gemini to write a new poetic journal entry.
2. **Notification**: It pushes a draft preview to the admin's Telegram chat.
3. **Admin Actions**: The Telegram notification includes a custom **Inline Keyboard URL Button** (`📝 Review & Publish`) that dynamically resolves to the admin panel URL, allowing the admin to approve or publish the draft in one click.
