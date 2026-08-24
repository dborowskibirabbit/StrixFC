# strixfc.pl — strona tymczasowa

Statyczna strona Strix Fight Club na czas budowy docelowego serwisu.
Bez frameworków, bez build stepu — wrzucasz katalog na serwer i działa.

## Struktura

```
strixfc-www/
├── index.html                 struktura strony
├── .nojekyll                  wyłącza Jekylla na GitHub Pages
└── assets/
    ├── css/style.css          cała warstwa wizualna
    ├── js/app.js              grafik + panel „dziś na macie"
    ├── fonts/                 Anton i Manrope, subsety latin + latin-ext
    │   ├── anton-latin.woff2
    │   ├── anton-latin-ext.woff2
    │   ├── manrope-latin.woff2
    │   └── manrope-latin-ext.woff2
    └── img/
        ├── logo-strix.png     logotyp w nagłówku
        ├── x-mark.png         sygnet X w tle hero
        ├── klub-01…03.jpg     galeria, poziomy pasek 3:2 (1080×720)
        ├── og-image.jpg       miniatura przy udostępnianiu (1200×630)
        ├── favicon-32.png
        └── apple-touch-icon.png
```

## Wgranie

**Zwykły hosting** — skopiuj zawartość `strixfc-www/` do katalogu domeny (`public_html`,
`www` albo `htdocs`). Nic więcej.

**GitHub Pages** — wrzuć zawartość do repozytorium, Settings → Pages → Deploy from a branch,
katalog `/ (root)`. Plik `.nojekyll` jest po to, żeby Pages nie przetwarzał katalogu `assets`.

## Co gdzie zmieniać

**Grafik treningów** → `assets/js/app.js`, góra pliku. Dwa obiekty:

- `PLAN` — grafik od 1 września
- `WAKACJE` — grafik wakacyjny

Format wpisu: `['start','koniec','Nazwa','Trener · grupa', 'mat'|'soon']`
`mat` podświetla wpis jak wolną matę, `soon` wyszarza go jako „wkrótce" i pomija w panelu „dziś".
Klucze 0–6, gdzie 0 to niedziela.

`const START_WRZESIEN = new Date(2026,8,1)` decyduje, który grafik jest aktywny.
Do 31 sierpnia panel „Dziś na macie" pokazuje wakacyjny, potem przełącza się sam.

**Zdjęcia galerii** → 3 kadry z `brand/Foto_finalne/`, wersje webowe w `assets/img/`:

| Plik | Kadr źródłowy | Środek kadru (`centering` y) |
|---|---|---|
| `klub-01.jpg` | `STRIX_foto_04_sala-przestrzen_16x9` | 0.55 |
| `klub-02.jpg` | `STRIX_foto_01_boks-grupa_4x5` | 0.42 |
| `klub-03.jpg` | `STRIX_foto_03_szereg-uderzenie_4x5` | 0.45 |

Wszystkie 1080×720 (3:2), JPEG q82, progressive. Kadry 4:5 przycięte do poziomu — punkt środkowy
dobrany tak, żeby nie ucinało głów; przy podmianie sprawdzić to na nowo.

**Układ:** trzy kafle na całą szerokość, `repeat(3,1fr)`.
Poniżej 620 px pasek przewija się w bok, kafel ma minimum 280 px.
Wysokość kafla wynika z `aspect-ratio:3/2` — dlatego `.gal img` ma `height:auto`,
inaczej atrybut `height` z HTML nadpisuje proporcje.

Zdjęcia są już obrobione wg brandbooka. **Nie nakładać filtrów CSS** (`saturate`, `contrast`) —
usunięte z `.gal img` właśnie z tego powodu.

**Link do karnetów** → `index.html`, szukaj `id="karnet"`. Teraz `href="#"`.

**Teksty i kontakt** → `index.html`. Telefon występuje w trzech miejscach
(przycisk hero, sekcja kontakt, pasek mobilny) — podmieniając, zmień wszystkie.

## Kolory i typografia

```
grafit tło    #131211      karta    #1D1B19      linia   #332F2A
terakota      #BB8963      tekst    #F2EFEA      szary   #989189
```

Nagłówki: **Anton**. Tekst: **Manrope**. Oba na licencji SIL Open Font License,
komercyjnie bez opłat, hostowane lokalnie — żadnych zapytań do Google Fonts.

**Silki nie ma i nie może być na stronie** — klub ma licencję wyłącznie desktopową.
Manrope jest jej zamiennikiem w wersji webowej.

## Mapa

Osadzona przez `maps.google.com/maps?...&output=embed`, bez klucza API.
Przyciemniona filtrem CSS (`.mapbox iframe`), bo Google nie pozwala kolorować embeda.
Gdyby się nie załadowała, pod spodem jest kafelek z pinezką i adresem — strona nie wygląda na zepsutą.
