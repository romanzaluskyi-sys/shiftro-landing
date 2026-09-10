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
