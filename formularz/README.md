# Przyjmowanie zgłoszeń — Google Apps Script (0 zł)

Ankieta (`ankieta.html`) wysyła zgłoszenie POST-em do skryptu Google Apps
Script podpiętego pod Arkusz Google. Skrypt:

- dopisuje wiersz do arkusza **Zgłoszenia** (z kolumnami Status i Notatki —
  to jest lista leadów),
- wysyła powiadomienie na Twoją skrzynkę (Odpowiedz → pisze od razu do klienta),
- wysyła klientowi list z linkiem do demo i prezentacji.

Limity darmowego konta Gmail: 100 listów dziennie (każde zgłoszenie to 2), więc
~50 zgłoszeń na dobę. Wiersz w arkuszu zapisuje się zawsze, nawet gdy poczta
odmówi.

## Instalacja (10 minut, jednorazowo)

1. **sheets.new** → nazwij arkusz „Shiftro · zgłoszenia”.
2. **Rozszerzenia → Apps Script**. Usuń zawartość `Kod.gs` i wklej cały
   `formularz/apps-script.gs`. Zapisz (Ctrl/Cmd+S).
3. W `KONFIG` na górze ewentualnie zmień `podpis`, `kalendarz`.
4. Na liście funkcji nad kodem wybierz **przygotuj** → **Uruchom**. Google
   poprosi o uprawnienia: *Przejrzyj uprawnienia → Twoje konto → Zaawansowane →
   Przejdź do projektu (niebezpieczne) → Zezwól*. To Twój własny skrypt; ostrzeżenie
   pojawia się, bo Google go nie weryfikował.
5. Wybierz **testujZgloszenie** → **Uruchom**. Na Twojej skrzynce powinny
   pojawić się dwa listy (powiadomienie i list do klienta), a w arkuszu wiersz
   „Bistro Testowe”. Usuń ten wiersz.
6. **Wdróż → Nowe wdrożenie** → typ **Aplikacja internetowa**:
   - *Wykonaj jako*: **Ja**
   - *Kto ma dostęp*: **Każdy**
   → **Wdróż** → skopiuj **URL aplikacji internetowej** (kończy się na `/exec`).
7. W `ankieta.html` wklej go w `var ENDPOINT = '';` (blok `<script>` na dole).
   Commit, push — Vercel wdroży stronę.
8. Wypełnij ankietę na shiftro.pl swoim adresem i sprawdź: wiersz w arkuszu,
   dwa listy.

## Zmiana skryptu później

Edytuj kod w Apps Script → **Wdróż → Zarządzaj wdrożeniami** → ołówek →
*Wersja: Nowa wersja* → **Wdróż**. URL `/exec` zostaje ten sam.
(„Nowe wdrożenie” dałoby nowy URL i trzeba by zmienić `ENDPOINT`.)

## Dobrze wiedzieć

- List do klienta wychodzi z Twojego Gmaila z nazwą „Shiftro”. Żeby szedł z
  adresu w domenie (np. `kontakt@shiftro.pl`), dodaj ten adres w Gmailu jako
  *Wyślij jako* i zmień w skrypcie `MailApp.sendEmail` na
  `GmailApp.sendEmail(..., { from: 'kontakt@shiftro.pl' })`.
- Na telefonie zainstaluj aplikację Arkusze i włącz powiadomienia Gmaila dla
  tematu „Nowe zgłoszenie” — szybki telefon (w ciągu godziny) mocno podnosi
  szansę na rozmowę.
- Pole `firma` w ankiecie jest niewidoczną pułapką na boty; zgłoszenia z
  wypełnionym `firma` są po cichu odrzucane.
