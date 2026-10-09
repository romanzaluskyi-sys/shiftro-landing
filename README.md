# Shiftro — strona i ankieta zgłoszeniowa

Dwie strony bez kroku budowania i bez zależności: `index.html` (landing) i
`ankieta.html` (zgłoszenie lokalu). Podgląd:

    cd shiftro-landing
    python3 -m http.server 8899

i `http://localhost:8899`.

## Zgłoszenia, demo i prezentacja

`ankieta.html` wysyła zgłoszenie do Google Apps Script (`formularz/`): wiersz
w Arkuszu Google, powiadomienie do nas i list do klienta z linkiem do demo
(`demo.shiftro.pl`) i prezentacji (`prezentacja.html`). Instalacja i adres do
wklejenia w `ENDPOINT`: [`formularz/README.md`](formularz/README.md). Dopóki
`ENDPOINT` jest pusty, ankieta pokazuje błąd zamiast udawać, że wysłała.

Ekran podziękowania prowadzi od razu do demo i prezentacji; scenariusz
rozmowy, która następuje potem: [`sprzedaz/rozmowa.md`](sprzedaz/rozmowa.md).
`formularz/` i `sprzedaz/` nie trafiają na stronę (`.vercelignore`).

## Ekrany na stronie są zmyślone

Zrzuty w `img/` nie pochodzą z żadnego prawdziwego lokalu. To makiety HTML w
`mockups/`, które odtwarzają wygląd aplikacji na wymyślonych danych:

- sieć **Grupa Lipowa**: lokale *Lipowa 12*, *Bar Przystań*, *Bistro Rynek*,
  kierowniczka *Kasia W.*;
- zespół na stanowiskach z kodami i kolorami: **KE** kelner, **HO** hostessa,
  **BA** barman, **KU** kucharz, **PK** pomoc kuchenna, **ZM** zmywak.

Liczby w makietach są spójne między ekranami (np. giełda zmian w grafiku i na
telefonie Magdy, utarg dzień po dniu w e-mailu sumuje się do 81 200 zł,
godziny lokali do 612 h). Zmieniając jedną makietę, sprawdź pozostałe.

Wspólne elementy (boczne menu panelu, pasek lokali, pasek zakładek telefonu,
ikony) są w `mockups/app.js`, style w `mockups/app.css`.

Po zmianie makiety:

    sh mockups/render.sh            # wszystkie
    sh mockups/render.sh grafik     # jedna

Skrypt renderuje przez headless Chrome w 2x. Panel i e-mail idą do JPEG,
**tablet i telefony do PNG z przezroczystym tłem** — leżą na kolorowej plamie w
hero i na ciemnym pasie „Dla zespołu”, więc jasny prostokąt wokół urządzenia
byłby widoczny. Chrome po zapisaniu zrzutu potrafi nie zamknąć procesu, dlatego
skrypt czeka na plik i sam go kończy.

## Wygląd

- Znak: **ten sam co w aplikacji** — `gastro-hours-manager/src/components/ShiftroMark.tsx`: kwadrat bez zaokrągleń, trzy pasy, środkowy
  czerwony przesunięty w prawo. Wstawiony jako inline SVG. Nie zaokrąglaj go
  i nie zmieniaj proporcji pasów. Na ciemnym tle (sidebar w makietach, nagłówek
  e-maila) wariant odwrócony: jasny kwadrat, ciemne pasy. Favikona
  (`shiftro-favicon.svg`, też z aplikacji) ma grubsze pasy — to celowe, ma być
  czytelna w 16 px.
- Pismo: **Archivo** — krój marki, ten sam co w aplikacji. W makietach Archivo
  stoi tam, gdzie aplikacja ma `font-['Archivo']` (tytuły, menu, przyciski,
  liczby), a zwykły tekst idzie systemowym sans, jak w aplikacji (Tailwind).
- Kolory w `:root`. Akcent `#DE3A22` — ten sam co środkowy pas znaku Shiftro.
  Kolory stanowisk (`--KE`, `--HO`…) są takie same jak w makietach, więc pasek
  stanowisk pod hero i karty w sekcji „Stanowiska” zgadzają się ze zrzutami.
- Pasma: jasne tło → białe (`.alt`) → ciemne (`.dark`, pas stanowisk i sekcja
  dla zespołu) → czerwony finał w zaokrąglonym bloku.

## Wdrożenie na Vercel

New Project → import repo → Framework Preset **Other**, bez build command,
output directory `.`. Domeny (Project Settings → Domains): `shiftro.pl` i
`www.shiftro.pl`. `emka.shiftro.pl` (aplikacja) to osobny projekt Vercel i ta
strona go nie dotyka.

Katalog `mockups/` jest tylko źródłem zrzutów; strona go nie potrzebuje.
