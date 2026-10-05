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

## Lägga in skärmdumpar på projekten

Varje projekt har en animerad platshållare tills du lägger in en riktig bild.

1. Ta en skärmdump av sajten (gärna 1600 × 1000 px, liggande).
2. Spara den som **.jpg** i mappen `public/images/` med exakt de här namnen:
   - `kunglig-stadning.jpg`
   - `mo-stadservice.jpg`
   - `pizzeria-tavolino.jpg`
3. Öppna `index.html` och sök efter `SKÄRMDUMP`.
4. Under varje träff finns en rad som börjar med `<!-- <img`. Ta bort `<!--` i början och `-->` i slutet av just den raden.
5. Spara och pusha (eller kör `npm run build` lokalt). Klart – platshållaren göms automatiskt bakom bilden.

Tips: komprimera bilden först (t.ex. på [squoosh.app](https://squoosh.app)) så att den blir under ~200 KB.

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

- **Intro** (max ~1,8 s): namnet stiger upp bakom masker, räknare till 100, sedan torkas ytan uppåt.
  Klick, tangent eller scroll hoppar över. Visas bara första besöket per flik.
- **Hero:** stort namn med variabel vikt som reagerar på muspekaren (desktop) och på scroll (alla).
  Bakgrunden är en lätt WebGL-shader som pausar när den inte syns. Saknas WebGL syns en statisk gradient.
- **Text:** rubriker avslöjas rad för rad bakom masker; stycket "Om mig" tänds ord för ord när man scrollar.
- **Tjänster:** två rullande band som går snabbare när man scrollar och byter riktning med scrollen.
- **Projekt:** på desktop fästs sektionen och korten scrollar i sidled; på mobil vanlig lista.
  Muspekaren blir en "Visa"-bubbla över projekt med länk.
- **Kontakt:** mejladressen byggs upp bokstav för bokstav; på mobil rullar en viktvåg genom den.

**Mobil:** shadern renderas i lägre upplösning och 30 fps, ingen custom cursor, ingen mjuk-scroll av touch.
**Reducerad rörelse** (`prefers-reduced-motion`): ingen intro, ingen mjuk scroll, inga stora rörelser –
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
