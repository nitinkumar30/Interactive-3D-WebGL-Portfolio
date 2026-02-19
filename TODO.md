# 🎨 Portfolio ITOM — Master To-Do List

> **Cel:** Dopieścić portfolio do poziomu **AWWWARDS SOTD / FWA** — zero kompromisów.  
> **Data startu:** 2026-02-13  
> **Stack:** React + Three.js (R3F) + GSAP + Vite

---

## 🔴 Priorytet 1 — Krytyczne błędy i brakujące funkcjonalności

### 1. Naprawić wyciekające chmury z About do Corridor
- [X] Zbadać `SkyChunk.jsx` — obecny `CORRIDOR_CLIP_Z = -8` nie trzyma, chmury "uciekają" do korytarza
- [X] Rozważyć dodanie clippingu per-kamera zamiast stałego Z-threshold
- [X] Dodać testy wizualne — wejście/wyjście z About w obie strony
- **Pliki:** [SkyChunk.jsx](file:///c:/Users/tomsz/Desktop/portfolio/portfolio-itom/src/components/canvas/rooms/About/SkyChunk.jsx), [InfiniteSkyManager.jsx](file:///c:/Users/tomsz/Desktop/portfolio/portfolio-itom/src/components/canvas/rooms/About/InfiniteSkyManager.jsx)

### 2. Naprawić wyświetlanie monitorów po kliknięciu w The Studio
- [X] Debugować `handleMonitorClick` w `StudioRoom.jsx` — kamera nie zawsze centruje monitora poprawnie
- [X] Sprawdzić czy `openOverlay(item)` faktycznie otwiera overlay z poprawnymi danymi
- [X] Przetestować na mobile i desktop — inne `responsiveParams`
- [X] Poprawić `GlobalOverlay.jsx` — `ContentCard` jeśli nie pokazuje contentu poprawnie
- **Pliki:** [StudioRoom.jsx](file:///c:/Users/tomsz/Desktop/portfolio/portfolio-itom/src/components/canvas/rooms/Studio/StudioRoom.jsx), [GlobalOverlay.jsx](file:///c:/Users/tomsz/Desktop/portfolio/portfolio-itom/src/components/ui/GlobalOverlay.jsx)

---

## 🟠 Priorytet 2 — Kluczowe ulepszenia (wizualne i UX)

### 3. Dopracować tekstury i Awards w About
- [X] Sprawdzić czytelność istniejących tekstur (SOTY, SOTD, SOTM, FEATURED) — czy nie są za małe/za duże
- [X] Poprawić pozycje i rozmiary kart Awards w `AwardsMilestone`
- [X] Dodać animację "View" — kliknięcie na kategorię nagród → wyświetlenie wszystkich nagród w danej kategorii
  - [X] Zaprojektować UI — popup/overlay na canvas lub HTML overlay
  - [X] Dodać interakcję kliknięcia na kartę Award
  - [X] Animować rozwinięcie listy (GSAP)
- **Pliki:** [InfiniteSkyManager.jsx](file:///c:/Users/tomsz/Desktop/portfolio/portfolio-itom/src/components/canvas/rooms/About/InfiniteSkyManager.jsx)

### 4. Dodać dekoracje do Corridor (jest pusty!)
- [X] Istniejące dekoracje (`Doodles.jsx`) — zweryfikować co jest renderowane i czego brakuje
- [X] Wykorzystać istniejące tekstury z `/textures/corridor/decorations/`:
  - `coffee_cup.webp`, `coffee_debug.webp`, `idea_process.webp`, `paper_airplane.webp`, `paper_ball.webp`, `pencil.webp`, `while_true_loop.webp`
- [X] Dodać nowe elementy:
  - [X] Ramki/obrazki na ścianach w stylu "hand-drawn" (np. szkice projektów)
  - [X] Biurko/stoliczek z kawą i notatkami
  - [X] Znaki/strzałki prowadzące do pokojów
  - [X] Rośliny w doniczkach (styl paper/sketch)
  - [X] Regał z książkami (cienkie prostokąty z teksturami)
  - [X] Tabliczki z cytatami (motywacyjne/programistyczne)
- [X] Rozłożyć dekoracje po obu stronach korytarza
- [X] Dodać subtelne animacje (floating, pulsing)
- **Pliki:** [Corridor.jsx](file:///c:/Users/tomsz/Desktop/portfolio/portfolio-itom/src/components/canvas/corridor/Corridor.jsx), [Doodles.jsx](file:///c:/Users/tomsz/Desktop/portfolio/portfolio-itom/src/components/canvas/corridor/Doodles.jsx), [CorridorWalls.jsx](file:///c:/Users/tomsz/Desktop/portfolio/portfolio-itom/src/components/canvas/corridor/CorridorWalls.jsx)

### 5. Poprawić grafiki — czytelność vs detale w tle
- [ ] About Room: Sprawdzić kontrast tekstów na tle chmur (milestones)
- [ ] Gallery Room: Upewnić się, że karty projektów są czytelne na tle domków i liny
- [ ] Studio Room: Sprawdzić czy info na monitorach jest czytelne
- [ ] Contact Room: Upewnić się, że opcje kontaktowe wyróżniają się
- [ ] Korytarz: Sygnatura drzwi dobrze widoczna, dekoracje nie przytłaczają
- [ ] Dodać głębię — elementy ważne z większą opacitą, tło z mniejszą
- **Pliki:** Wszystkie pokoje (About, Studio, Gallery, Contact)

### 6. Interaktywne elementy: B&W → kolor na hover
- [ ] Zaprojektować shader/material swap: elementy interaktywne domyślnie w grayscale
- [ ] Na hover → animowana tranzycja do pełnego koloru (GSAP lub shader uniform)
- [ ] Elementy docelowe:
  - [ ] Drzwi w korytarzu (sygnatura pokoju)
  - [ ] Monitory w Studio
  - [ ] Karty projektów w Gallery
  - [ ] Beczki social media w Contact
  - [ ] Karty Awards w About
- [ ] Opcja: shader `saturation` uniform animowany od 0 do 1
- **Pliki:** Nowe utility + modyfikacja wszystkich pokojów

---

## 🟡 Priorytet 3 — Nowe funkcjonalności

### 7. Dodać poradnik/tutorial dla użytkownika
- [ ] Zdecydować format:
  - **Opcja A:** Tooltips przy pierwszym wejściu (np. "Scroll to fly" w About)
  - **Opcja B:** Dymki informacyjne pojawiające się na 3-4 sek
  - **Opcja C:** Pomocnik/ikona "?" w narożniku z opisem interakcji
- [ ] Poradnik per pokój:
  - [ ] **Corridor:** "Click a door to enter" + "Use map to teleport"
  - [ ] **About:** "Scroll to fly through my story"
  - [ ] **Studio:** "Drag to rotate • Scroll to browse • Click to view"
  - [ ] **Gallery:** "Scroll to browse • Click to inspect"
  - [ ] **Contact:** "Choose a contact method"
- [ ] Wyświetlać tylko za pierwszym razem (localStorage)
- [ ] Animacja wejścia/wyjścia (fade + slide)
- **Pliki:** Nowy komponent UI

### 8. Dodać dźwięki (na końcu)
- [ ] `AudioManager.jsx` jest ready — ma `play()`, `stop()`, `fade()`, volume control
- [ ] Lista dźwięków do dodania:
  - [ ] **Ambient:** Cichy background loop (papier, wiatr?)
  - [ ] **Corridor:** Kroki / szuranie
  - [ ] **Doors:** Otwieranie/zamykanie drzwi
  - [ ] **About:** Wiatr podczas lotu, whoosh przy chmurach
  - [ ] **Studio:** Bzyczenie elektroniki, klik przy wyborze monitora
  - [ ] **Gallery:** Szelest papieru/ubrań na linie
  - [ ] **Contact:** Szum morza, splash przy rzucaniu butelki
  - [ ] **UI:** Hover sounds, teleport swoosh
- [ ] Utworzyć folder `/public/sounds/`
- [ ] Dodać UI toggle (już istnieje `AudioControls.jsx`)
- **Pliki:** [AudioManager.jsx](file:///c:/Users/tomsz/Desktop/portfolio/portfolio-itom/src/context/AudioManager.jsx), [AudioControls.jsx](file:///c:/Users/tomsz/Desktop/portfolio/portfolio-itom/src/components/ui/AudioControls.jsx)

### 9. Easter Eggs & detale
- [ ] Konami code? Sekretny pokój?
- [ ] Kliknięcie w avatar w About → animacja zmiany wyrazu twarzy
- [ ] Kliknięcie wielokrotne w samolot papierowy → looping/spin  
- [ ] Ukryty element gdzieś w korytarzu (np. pod obrazkiem)
- [ ] Secret mode: Dark mode toggle (cały świat B&W → negatyw)
- [ ] Progress bar/counter: "You discovered X/Y secrets"
- [ ] Kliknięcie w kawę w korytarzu → animacja pary
- [ ] "404" drzwi gdzieś w korytarzu → zabawna animacja
- **Pliki:** Różne — zależnie od pomysłu

---

## 🟢 Priorytet 4 — Polish & Optymalizacja

### 10. Poprawić content data w Studio
- [ ] Uzupełnić prawdziwe URL-e (YouTube, Blog, TikTok)
- [ ] Dodać thumbnails (prawdziwe grafiki lub wygenerowane)
- [ ] Zaktualizować daty i metryki
- **Pliki:** [contentData.js](file:///c:/Users/tomsz/Desktop/portfolio/portfolio-itom/src/components/canvas/rooms/Studio/contentData.js)

### 11. Performance & responsywność
- [ ] Audit na mobile (szczególnie About — dużo clouds + milestones)
- [ ] Sprawdzić `PerformanceContext.jsx` — quality reduction na słabych urządzeniach
- [ ] Przetestować teleportację na wszystkie pokoje — brak glitchy
- [ ] Sprawdzić memory leaks (tworzące się `new THREE.Vector3()` w useFrame!)
  - `InfiniteSkyManager.jsx` linijki 155-157, 470-471, 710-711 — nowe Vector3 co klatkę!
  - `SkyChunk.jsx` linia 145 — `new THREE.Vector3()` co klatkę
- [ ] LOD (Level of Detail) — mniejsza ilość chmur/doodli daleko od kamery

### 12. Accessibility & SEO
- [ ] Aria labels na interaktywnych elementach UI
- [ ] Keyboard navigation (Tab key) przez drzwi i pokoje
- [ ] Meta tagi i OG image dla sharing
- [ ] Preloader pokaże % ładowania assetów (jest `Preloader.jsx`, może wymaga update)

### 13. Animacje i microinterakcje
- [ ] Cursor customowy na hover nad elementami interaktywnymi (jest w `/public/cursors/`)
- [ ] Parallax na tłach pokojów (hook `useMouseParallax.js` istnieje)
- [ ] Smooth page transitions — paper texture transitions (jest `PaperTransition.jsx`)
- [ ] Dodać subtelne particle effects (pyłki w korytarzu? Świetliki w About?)

---

## 📊 Dodatkowe obserwacje z analizy kodu

| Kwestia | Szczegóły | Priorytet |
|---------|-----------|-----------|
| Vector3 allocation w useFrame | 5+ miejsc tworzących `new THREE.Vector3()` co klatkę — memory pressure | 🔴 |
| `contentData.js` — placeholder data | Wszystkie URL-e, thumbnails = null, dane przykładowe | 🟠 |
| `Doodles.jsx` — 310 linii ale mogą nie renderować się w pełni | Sprawdzić czy `SketchElement`, `AnimatedStar`, `ThoughtBubble` etc. są aktywne | 🟡 |
| `AudioManager.jsx` — fade() jest stub | `fade()` natychmiast pauzuje zamiast gradualnie ściszać | 🟡 |
| Brak textur w Gallery | Karty projektów mogą nie mieć prawdziwych screenshot'ów | 🟠 |
| `StudioRoom.jsx` — podwójna guard check L267 | `if (dragDistance > 5 \|\| isAnimating \|\| !towerRef.current) return;` zduplikowane | 🟢 |

---

## ⏱ Sugerowana kolejność pracy

```
Tydzień 1: #1 (chmury) → #2 (monitory) → #4 (dekoracje korytarza)
Tydzień 2: #3 (awards) → #5 (czytelność grafik) → #6 (B&W→kolor hover)
Tydzień 3: #7 (tutorial) → #10 (prawdziwy content) → #11 (performance)
Tydzień 4: #9 (easter eggs) → #13 (microinterakcje) → #8 (dźwięki)
Na koniec: #12 (accessibility) → Final QA
```
