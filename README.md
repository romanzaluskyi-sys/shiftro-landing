# Shiftro — strona i ankieta zgłoszeniowa

Jeden plik `index.html`, bez kroku budowania i bez zależności. Podgląd:

    cd shiftro-landing
    python3 -m http.server 8899

i `http://localhost:8899`.

## Zanim trafi na produkcję: podłącz formularz

W `index.html`, w bloku `<script>` na dole:

    var FORMSPREE_ID = "TWOJE_ID";

1. Załóż formularz na https://formspree.io (darmowy plan wystarcza na start),
   jako adres odbiorczy podaj roman.zaluskyi@gmail.com.
2. Formspree da adres `https://formspree.io/f/XXXXXXXX` — wklej TU samo
   `XXXXXXXX`.

Dopóki stoi placeholder, formularz **nie udaje**, że wysłał: pokazuje błąd z
adresem zapasowym. To celowe — cicha wysyłka donikąd gubi zgłoszenia bez
żadnego śladu.

Zgłoszenie leci na maila z polskimi etykietami pól ("Liczba pracowników", nie
`pracownicy`), z tematem zawierającym nazwę lokalu i z `reply-to` ustawionym na
adres zgłaszającego — odpowiada się prosto z klienta pocztowego.

## Wdrożenie na Vercel

    git init && git add -A && git commit -m "Landing"
    # utwórz repo na GitHubie i wypchnij

Potem w Vercel: New Project → import repo → Framework Preset **Other**, bez
build command, output directory `.`.

Domeny (Project Settings → Domains): `shiftro.pl` i `www.shiftro.pl`. W GoDaddy
**edytuj** istniejący rekord A `@` (dziś wskazuje na parking GoDaddy) na IP
podane przez Vercel, a `www` przestaw z CNAME na `shiftro.pl` na CNAME podany
przez Vercel. Jeden z dwóch ustaw jako główny, drugi jako Redirect.

`emka.shiftro.pl` (aplikacja) to osobny projekt Vercel i ta zmiana go nie
dotyka.

## Skąd wzięły się kolory

Makieta przyszła z systemu "Modernist" z Claude Design, który ma własny akcent
`#ec3013`. Tokeny w `:root` są **zestrojone z aplikacją**
(`src/components/manager/designTokens.ts`): akcent `#DE3A22`, tło `#F1F1EE`,
tekst `#171714`. Powód: znak Shiftro ma w środkowym pasie dokładnie `#DE3A22` i
stojąc obok przycisku w innym czerwonym wygląda jak pomyłka drukarni.

Zaokrąglenia zostają na `0px` — tak zaprojektowany jest ten system i tak
wygląda sam znak. To świadoma różnica wobec aplikacji, która ma `rounded`.

## Nazwy w makiecie

Zakładki panelu kierownika w makiecie odpowiadają `NAV_ITEMS` z
`ManagerShell.tsx` co do treści i kolejności (13 pozycji). Nazwy przycisków
pracownika ("Rozpocznij zmianę", "Popraw zmianę") też są te z aplikacji.

Jedna drobna rozbieżność, świadomie zostawiona: pasek zakładek na makietach
telefonu ma 5 pozycji (Pulpit · Zmiana · Raport · Zadania · Więcej), a aplikacja
ma 6 — brakuje "Grafik". Jeśli chcesz zgodności co do joty, dopisz szóstą
pozycję w trzech makietach telefonu.

## Rysunki

Cztery ilustracje na stronie są **ręcznie napisanym SVG wprost w `index.html`**,
nie plikami i nie zdjęciami. Ta sama paleta co reszta: `#171714` / `#605D5D` /
`#BAB6B6` na paski, `#DE3A22` wyłącznie na jedną rzecz na rysunek, zero
zaokrągleń.

- **Rytm tygodnia** (pod hero) — zmiany trzech stanowisk na osi 8:00–24:00,
  z zaznaczoną dziurą w obsadzie w środę. Liczby zmian w kolejnych dniach
  zgadzają się z nagłówkami tabeli grafiku niżej na stronie (4, 4, ·, 4, 5, 6,
  4) — jeśli zmieniasz jedno, zmień drugie, inaczej strona przeczy sama sobie.
  ⚠️ Ten pas ma proporcje 5,3:1, więc na telefonie zszedłby do 60px wysokości
  (paski po 4px). Ma **drugą wersję**: poniżej 860px wchodzi `.rytm-waski` —
  ten sam tydzień obrócony, dzień to wiersz, godziny lecą w poprzek. Mieści
  siedem dni w pionie telefonu bez przewijania. Przewijany pas w poziomie,
  który tu był wcześniej, zawsze pokazuje kawałek i udaje, że to całość.
- **Trzy urządzenia** (nad listą 01–09) — tablet na barze, telefon pracownika,
  karta dnia. Proporcje 4:3, skalują się bez żadnych sztuczek.
- **Dziewięć miniatur 116×72** w wierszach cech 01–09, po jednej na cechę.
  Zastąpiły ikonki z zestawu ogólnego: ikonka „zegar" przy odbiciu zmiany i
  „dokument" przy raportach mogą stać przy czymkolwiek, a te pokazują
  mechanizm, o którym mówi akapit obok. Kolejność miniatur MUSI odpowiadać
  kolejności nagłówków — skrypt podmieniający to sprawdza.

Generator leży obok, w `grafika.py` — to on złożył te SVG z listy zmian i
kolorów. Do działania strony nie jest potrzebny (rysunki są już wbudowane w
`index.html`), ale poprawianie rysunków ręcznie w 4000 znakach `<rect>` jest
drogą donikąd: zmień dane w `grafika.py`, uruchom `python3 grafika.py out.json`
i podmień.

## Rytm pasm

Sekcje idą naprzemiennie: tło → `--color-surface` → tło → `--color-surface` →
tło → **ciemny `#171714`** → tło → `--color-surface` → **czerwony**. Tło siedzi
na `<section>`, a `max-width: 1200px` zeszło na wewnętrzny `<div>` — inaczej pas
kończyłby się na 1200px zamiast iść przez cały ekran.

Poziome `<hr>` MIĘDZY sekcjami zniknęły: przy zmianie koloru kreska na styku
wygląda jak pomyłka, a nie jak podział. Te, które zostały, są wewnątrz
formularza ankiety i dzielą jego części — to co innego.

Ciemny pas wypada dokładnie tam, gdzie strona przechodzi od kierownika do
pracownika. To nie ozdoba: to granica dwóch części opowieści, i dlatego akurat
tam. Kontrast tekstu na nim sprawdzony — 15,9 dla nagłówków, 8,9 dla podpisów,
6,4 dla nadtytułu.

## Pasek liczb pod hero

Z siedmiu kafli zostały **trzy**: 0 zł, 1 dzień, 4 lokale. Odpadło to, co mówi
coś o produkcie, a nic czytelnikowi — „13 zakładek panelu kierownika",
„30 / 14 / 7 dni przypomnień", „60–90 s zamknięcie dnia" (w tym miejscu strony
nikt jeszcze nie wie, co to zamknięcie dnia) i „2 min ankieta", która wróciła
tam, gdzie znaczy coś konkretnego — obok przycisku wysyłki.

Każda liczba ma teraz pod sobą ZDANIE, nie etykietę wersalikami. Liczba bez
zdania obok jest ozdobą: „4 lokale" nie mówi nic, „4 lokale pracują na tym
codziennie, na sali — to nie jest prezentacja" mówi wszystko.

## ⚠️ Kolor na ciemnym pasie

`color` ustawiony na `<section>` **wcieka do makiet w środku**. Ciemny pas raz
już to zrobił: dziesięć elementów w białych makietach telefonów (godziny,
„Popraw zmianę", „84,5 h") odziedziczyło jasny kolor i zrobiło się niewidoczne
na białym. Dlatego każdy biały kontener makiety ma własne
`color: var(--color-text)`.

Sprawdzając kontrast, licz go dla **całej** strony bez filtrów. Pierwsza
kontrola tego błędu nie złapała, bo wykluczała elementy na białym tle — czyli
dokładnie te, które były zepsute.

## Nagłówki bez kropek

Nagłówki (h1/h2/h3 i przekaz w ostatniej sekcji) nie kończą się kropką.
Nagłówek nie jest zdaniem — kropka każe go czytać jak zdanie i spowalnia.
Znak zapytania zostaje, bo pyta naprawdę.

Ostatnia sekcja to sam przekaz i przycisk: akapit, który tam stał, powtarzał
to, co strona powiedziała już dwa razy wyżej. W miejscu, w którym prosisz o
decyzję, każde dodatkowe zdanie jest powodem, żeby jej nie podjąć.

## Przyklejony nagłówek — tylko od 861px

`.naglowek` dostaje `position: sticky` wyłącznie w media query od 861px (tej
samej granicy co wariant rytmu tygodnia — jedna liczba w całym pliku jest
łatwiejsza do trzymania niż trzy). Na telefonie zostaje `static`: 73px na stałe
to jedna piąta ekranu, a strona jest krótka.

Dwie rzeczy, bez których to nie działa:
- **Tło musi być nieprzezroczyste** (`var(--color-bg)`). Pasma przewijają się
  POD nagłówkiem; bez tła ciemny pas przechodziłby przez napisy.
- **`scroll-margin-top: 88px` na `#dla-restauracji` i `#dla-pracownikow`.** Bez tego
  kotwica z menu zatrzymuje się ZA nagłówkiem i pierwsze wiersze sekcji są
  zasłonięte. 88 = 73px wysokości nagłówka plus oddech.

## Nagłówek odjechany od góry

Tło nagłówka jest stałe (`#F1F1EE`) i nigdy się nie zmienia — zmienia się to,
co pod niego wjeżdża. Na tle strony go nie widać, ale nad szarym pasmem i nad
ciemnym jasny pasek z włosową kreską pod spodem wygląda jak przypadek.

Dlatego `.naglowek.odjechany` dostaje **pełną kreskę** w kolorze tekstu zamiast
cienia: ta strona rozdziela wszystko kreskami 2px, a miękki cień byłby z innego
języka. Klasę przypina słuchacz `scroll` (`window.scrollY > 4`).

⚠️ Reguła ma `!important` i to jedyne takie miejsce w pliku. Nagłówek ma
`border-bottom` w stylu **inline**, a inline bije regułę klasy — bez
`!important` klasa przypinała się, kolor się nie zmieniał, i wyglądało to na
niedziałający JavaScript.

⚠️ Sprawdzając to w podglądzie: programowy `window.scrollTo` z wstrzykniętego
skryptu NIE wysyła w tej panelce zdarzenia `scroll`, więc klasa się nie
przypina i wygląda na zepsutą. Prawdziwe kółko myszy działa. Testuj kółkiem.

## Kotwice

`Produkt` w menu nazywa się teraz **`Dla restauracji`** — razem z
`Dla pracowników` mówi czytelnikowi, dla KOGO jest każda część; „Produkt" mówił
tylko, że produkt istnieje. Kotwica poszła za etykietą: `#produkt` →
`#dla-restauracji`. Stare adresy z `#produkt` przestaną skakać do sekcji
(otworzą stronę od góry) — jeśli taki link gdzieś krąży, to jest ten moment,
żeby go podmienić.
