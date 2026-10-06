# Yassin Abdelwahab – portfolio

En enda sida (one-pager) som visar vem jag är, vad jag gör och vad jag har byggt.
Byggd med **Vite** (vanlig JavaScript), **GSAP + ScrollTrigger + SplitText** för animationer
och **Lenis** för mjuk scroll. Resultatet är statiska filer – ingen server, ingen databas.

---

## Kom igång

Du behöver [Node.js](https://nodejs.org) (version 18 eller senare).

1. Öppna en terminal i projektmappen.
2. Installera allt: `npm install`
3. Starta en lokal förhandsvisning: `npm run dev` → öppna adressen som visas (t.ex. http://localhost:5173).
4. Bygg den färdiga sidan: `npm run build` → allt hamnar i mappen `dist/`.

---

## Skärmdumpar på projekten

Kunglig Städning och Pizzeria Tavolino visar riktiga skärmdumpar (dator + mobil):

```
public/images/kunglig-stadning-desktop.webp   (1440 × 900)
public/images/kunglig-stadning-mobile.webp    (390 × 844, sparad i 600 px bredd)
public/images/pizzeria-tavolino-desktop.webp
public/images/pizzeria-tavolino-mobile.webp
```

**Ta nya skärmdumpar (t.ex. när Tavolino-sidan är klar):**

1. Gå till repot på GitHub → fliken **Actions**.
2. Klicka på **Capture project screenshots** i listan till vänster.
3. Klicka **Run workflow** → **Run workflow**.
4. Efter ca 2 minuter har GitHub sparat nya bilder i `public/images/`.
5. Hämta dem (`git pull`) och pusha något – då publiceras sidan om med de nya bilderna.

Vilka sajter som fotas står i `scripts/capture-screenshots.mjs`.

**MO Städservice** har ingen publik länk än och visar därför en platshållare.
När sajten finns: lägg till den i `scripts/capture-screenshots.mjs` (namn `mo-stadservice`), kör steg 1–5,
och byt platshållaren i `index.html` mot samma `<img>`-block som de andra projekten har.

---

## Ändra texter

All text ligger i `index.html`. Filen är uppdelad i tydliga block:

| Block i koden | Vad det är |
| --- | --- |
| `<!-- INTRO / PRELOADER -->` | Den korta introduktionen med namnet och räknaren |
| `<!-- HEADER / NAV -->` | Menyn högst upp |
| `<!-- HERO -->` | Stora namnet + introtexten |
| `<!-- OM / STATEMENT -->` | Stycket "Om mig" |
| `<!-- TJÄNSTER -->` | Rullande band + de tre tjänsterna |
| `<!-- PROJEKT -->` | De tre projekten |
| `<!-- KONTAKT -->` | Mejladressen, knapparna och (valfritt) telefon |
| `<!-- FOOTER -->` | Sidfoten med lokal tid |

Saker som **måste kollas innan publicering** är markerade med `TODO` i `index.html`:

- Kunglig Städning: texten "Förbättrade hemsidan och satte upp Google Ads" – ägaren ska bekräfta.
- MO Städservice: texten "Byggde hemsidan från grunden" ska bekräftas. Länk och status är okända.

**Lägga till telefonnummer:** sök efter `TELEFON` i `index.html`, ta bort kommentar-tecknen och skriv in numret.

**Lägga till ett projekt:** kopiera ett helt `<article class="project" …> … </article>`-block och ändra texterna.
`--hue` styr färgen på platshållaren (ett tal 0–360).

**Samma fält för alla projekt:** nummer + status (valfri), namn, typ & ort, vad du gjorde, länk (valfri).
Hitta inte på en status – lämna märket bort om du inte vet.

**Status-märken:** `<span class="badge badge--live">Live</span>` eller `<span class="badge badge--wip">Pågående</span>`.

---

## Publicera (GitHub Pages – automatiskt)

Sidan ligger på **https://wahazzin.github.io/portfolio/**.

Varje gång något pushas till `main` bygger GitHub sidan och publicerar den automatiskt
(se `.github/workflows/deploy.yml`). Det tar ungefär 1–2 minuter. Du ser hur det går under fliken **Actions** på GitHub.

Första gången måste GitHub Pages slås på:

1. Gå till repot på GitHub → **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, välj **GitHub Actions**.
3. Gå till fliken **Actions**, klicka på **Deploy to GitHub Pages** → **Run workflow** (eller pusha något nytt).

**Vill du hellre använda Netlify Drop?** Ändra `base: '/portfolio/'` till `base: '/'` i `vite.config.js`,
kör `npm run build` och dra mappen `dist` till [app.netlify.com/drop](https://app.netlify.com/drop).

---

## Design – varför det ser ut som det gör

**Palett: "Malmö natt + kobolt".** Nästan svart (`#0a0a0b`) med benvit text (`#eeece6`) och en enda stark
accent – koboltblått (`#2f4bff`). Koboltblått används som *yta* (projektsektionen, knappar, cursor-bubblan)
och aldrig som liten text, så kontrasten alltid håller (vit text på kobolt ≈ 5.9:1). Det känns tryggt och
proffsigt för ett lokalt företag, men ändå djärvt – och det sticker ut från de vanliga lila/rosa AI-mallarna.

**Typsnitt: Bricolage Grotesque + Geist Mono.**
- *Bricolage Grotesque* (rubriker och brödtext) har personlighet i formerna och är ett **variabelt** typsnitt
  (vikt 200–800). Det är det som gör signatureffekten möjlig: bokstäverna i namnet blir feta när muspekaren
  kommer nära, och när man scrollar.
- *Geist Mono* används bara för små etiketter (nummer, tid, platser) – ger en teknisk, "byggd" känsla.
- Båda är gratis (SIL Open Font License) och ligger självhostade i `src/fonts/` (bara latin-tecken = små filer).

---

## Rörelse – vad som händer var

**Grundregel: läsbarhet går alltid före effekter.** Text göms aldrig igen när man scrollar tillbaka,
och ingen text tonas ner. "Om mig" är alltid full benvit; på desktop lyses orden bara *upp* (vitt + glöd).

- **Intro** (≈ 1,45 s): namnet stiger upp, räknare till 100, sedan torkas ytan uppåt.
  Klick, tangent, scroll eller tryck hoppar över. Visas bara vid allra första besöket (sparas i webbläsaren).
- **Hero:** stort namn med variabel vikt som reagerar på muspekaren (desktop).
  Bakgrunden är en lätt WebGL-shader som pausar när den inte syns.
- **Text:** mobil = ingen intoning alls, texten finns bara där.
  Desktop = rad för rad bakom masker, klart innan texten når mitten av skärmen.
- **Tjänster:** rullande band (en rad på mobil). Varje tjänsterad är klickbar: den hoppar till Kontakt
  och fyller i mejlets ämnesrad, t.ex. "Förfrågan: Hemsida" (kan tas bort med "Ta bort ämnet").
- **Projekt:** på desktop fästs sektionen och korten scrollar i sidled, med en räknare (1 / 3) och
  knappar för föregående/nästa nere till höger. På mobil vanlig lista.
- **Kontakt:** mejladressen "scramblas" i ca 0,6 s första gången den syns och landar sedan på rätt bokstäver.
  Skärmläsare och Kopiera-knappen får alltid rätt adress direkt.
- **Header:** får mörk, suddig bakgrund när man scrollat. Göms efter 60 px nedåt, visas efter 60 px uppåt.

**Bara på telefoner** (de kan inte hovra, så de får egna effekter – `src/js/touch.js`):
- Namnet i hero sträcks/lutas lite efter hur snabbt man scrollar och lägger sig när man stannar.
- Projektkorten växer och rätar upp sig när de passerar mitten av skärmen.
- Knappar, tjänsterader och kort får ett tryck-läge (krymper lite + glöd/koboltfyllning).

Allt rör bara transform/opacity (billigt för mobilen).
**Reducerad rörelse** (`prefers-reduced-motion`): ingen intro, ingen mjuk scroll, inga rörliga effekter –
all text syns direkt.

---

## Licenser

- **GSAP** (inkl. ScrollTrigger och SplitText): GreenSocks "Standard No Charge License" – gratis, även för
  kommersiella sajter som den här. (Enda begränsningen gäller att bygga ett verktyg som konkurrerar med Webflow.)
  https://gsap.com/standard-license
- **Lenis:** MIT.
- **Typsnitt:** SIL Open Font License 1.1.

---

## Filer

```
index.html          all text och struktur (kommenterade block)
src/styles.css      all design
src/main.js         startar allt
src/js/             en fil per effekt (intro, hero-bg, kinetic, reveals, marquee, projects, cursor, contact)
src/fonts/          typsnitten
public/images/      lägg skärmdumparna här
```
