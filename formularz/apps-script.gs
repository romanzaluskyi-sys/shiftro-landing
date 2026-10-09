/**
 * Shiftro — przyjmowanie zgłoszeń z ankieta.html (Google Apps Script).
 *
 * Każde zgłoszenie:
 *   1. dopisuje wiersz do arkusza „Zgłoszenia” (to jest lista leadów, z kolumną Status),
 *   2. wysyła powiadomienie na konto, które wdrożyło skrypt,
 *   3. wysyła klientowi list z linkiem do demo i prezentacji.
 *
 * Instalacja krok po kroku: formularz/README.md.
 * Po każdej zmianie tego pliku: Wdróż → Zarządzaj wdrożeniami → edytuj → Nowa wersja.
 * Adres /exec zostaje ten sam, więc ankieta.html nie wymaga zmian.
 */

const KONFIG = {
  // Kto dostaje powiadomienia. Puste = konto, które wdrożyło skrypt.
  powiadomienia: '',
  // Nazwa nadawcy w liście do klienta.
  nadawca: 'Shiftro',
  // Podpis pod listem do klienta.
  podpis: 'Zespół Shiftro',
  demo: 'https://demo.shiftro.pl',
  prezentacja: 'https://shiftro.pl/prezentacja.html',
  // Link do kalendarza rezerwacji (np. Google Calendar → Harmonogram spotkań). Puste = przycisk znika z listu.
  kalendarz: '',
};

const ARKUSZ = 'Zgłoszenia';
const STATUSY = ['Nowe', 'Dzwoniłem — nie odebrał', 'Rozmowa umówiona', 'Po rozmowie', 'Test w lokalu', 'Klient', 'Nie pasuje'];
const KOLUMNY = [
  ['data', 'Data'], ['mode', 'Czego szuka'], ['lokal', 'Lokal'], ['miasto', 'Miasto'], ['typ', 'Typ'],
  ['lokale', 'Ile lokali'], ['ludzie', 'Ludzi w lokalu'], ['dzis', 'Grafik dziś'], ['bol', 'Co boli'],
  ['tablet', 'Tablet'], ['kiedy', 'Kiedy start'], ['osoba', 'Osoba'], ['telefon', 'Telefon'],
  ['email', 'E-mail'], ['rola', 'Rola'], ['zrodlo', 'Źródło'], ['status', 'Status'], ['notatki', 'Notatki'],
  // Nowe kolumny tylko na końcu: wiersze dopisują się po pozycji, a starsze zgłoszenia już stoją w arkuszu.
  ['kalkulator', 'Kalkulator'],
];
const ETYKIETY = {
  mode: { test: 'Bezpłatny test w lokalu', demo: 'Najpierw demo' },
  dzis: { arkusz: 'Arkusz Excel / Google', papier: 'Papier i zeszyt', aplikacja: 'Inna aplikacja', glowa: 'W głowie kierownika' },
  tablet: { jest: 'Tak, stoi na stałe', dokupimy: 'Nie, ale dokupimy', telefony: 'Wolimy telefony pracowników' },
  kiedy: { 'od razu': 'Od razu', 'w miesiac': 'W ciągu miesiąca', pozniej: 'Później, rozgląda się' },
  rola: { wlasciciel: 'Właściciel', kierownik: 'Kierownik', pracownik: 'Pracownik' },
};

function doPost(e) {
  const p = (e && e.parameter) || {};
  // Pułapka na boty: pole „firma” jest niewidoczne dla ludzi.
  if (p.firma) return odpowiedz({ ok: true });
  if (!p.lokal || !p.osoba || !p.telefon) return odpowiedz({ ok: false, blad: 'brak wymaganych pól' });

  const z = {};
  KOLUMNY.forEach(function (k) { z[k[0]] = String(p[k[0]] || '').trim().slice(0, 2000); });
  z.data = new Date();
  z.status = 'Nowe';
  z.notatki = '';

  const zamek = LockService.getScriptLock();
  zamek.waitLock(15000);
  try {
    arkusz().appendRow(KOLUMNY.map(function (k) { return k[0] === 'data' ? z.data : bezFormul(z[k[0]]); }));
  } finally {
    zamek.releaseLock();
  }

  // Wiersz już jest w arkuszu. Błąd poczty nie może zgubić zgłoszenia, więc tylko go logujemy.
  try { powiadom(z); } catch (err) { console.error('Powiadomienie: ' + err); }
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(z.email)) {
    try { listDoKlienta(z); } catch (err) { console.error('List do klienta: ' + err); }
  }
  return odpowiedz({ ok: true });
}

function doGet() {
  return odpowiedz({ ok: true, info: 'Shiftro: tu działa przyjmowanie zgłoszeń. Wysyłaj POST.' });
}

// Uruchom raz z edytora: tworzy arkusz z nagłówkami i listą statusów.
function przygotuj() {
  const a = arkusz();
  a.getRange(1, 1, 1, KOLUMNY.length).setValues([KOLUMNY.map(function (k) { return k[1]; })]).setFontWeight('bold');
  a.setFrozenRows(1);
  const kolStatus = KOLUMNY.findIndex(function (k) { return k[0] === 'status'; }) + 1;
  a.getRange(2, kolStatus, 1000, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(STATUSY, true).setAllowInvalid(true).build()
  );
  a.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm');
}

// Uruchom z edytora, żeby nadać uprawnienia i zobaczyć oba listy na własnej skrzynce.
function testujZgloszenie() {
  const ja = Session.getEffectiveUser().getEmail();
  doPost({ parameter: {
    mode: 'test', lokal: 'Bistro Testowe', miasto: 'Gdańsk', typ: 'bistro', lokale: '2-3', ludzie: '11-25',
    dzis: 'arkusz', bol: 'zamiany ustalane na Messengerze', tablet: 'jest', kiedy: 'w miesiac',
    osoba: 'Jan Testowy', telefon: '+48 600 000 000', email: ja, rola: 'wlasciciel', zrodlo: 'test z edytora',
  } });
}

function arkusz() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(ARKUSZ) || ss.insertSheet(ARKUSZ);
}

function odpowiedz(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Tekst zaczynający się od = + - @ arkusz potraktowałby jak formułę.
function bezFormul(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function esc(v) {
  return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function etykieta(pole, v) {
  return (ETYKIETY[pole] && ETYKIETY[pole][v]) || v;
}

function powiadom(z) {
  const do_ = KONFIG.powiadomienia || Session.getEffectiveUser().getEmail();
  const tel = z.telefon.replace(/[^\d+]/g, '');
  const wiersze = KOLUMNY
    .filter(function (k) { return ['data', 'status', 'notatki'].indexOf(k[0]) < 0 && z[k[0]]; })
    .map(function (k) {
      return '<tr><td style="padding:6px 12px 6px 0;color:#615d55;vertical-align:top">' + esc(k[1]) +
        '</td><td style="padding:6px 0;font-weight:600">' + esc(etykieta(k[0], z[k[0]])) + '</td></tr>';
    }).join('');
  const html =
    '<div style="font-family:Arial,sans-serif;font-size:15px;color:#15140f">' +
    '<p style="font-size:18px;font-weight:700;margin:0 0 4px">' + esc(z.lokal) + ', ' + esc(z.miasto) + '</p>' +
    '<p style="margin:0 0 16px"><a href="tel:' + esc(tel) + '" style="color:#de3a22;font-weight:700">Zadzwoń: ' + esc(z.telefon) + '</a></p>' +
    '<table style="border-collapse:collapse">' + wiersze + '</table>' +
    '<p style="margin-top:20px"><a href="' + esc(SpreadsheetApp.getActiveSpreadsheet().getUrl()) + '">Otwórz arkusz zgłoszeń</a> · ' +
    'scenariusz rozmowy: sprzedaz/rozmowa.md</p></div>';
  MailApp.sendEmail({
    to: do_,
    subject: 'Nowe zgłoszenie: ' + z.lokal + ', ' + z.miasto + ' · ' + etykieta('mode', z.mode),
    htmlBody: html,
    replyTo: z.email || undefined,
    name: 'Shiftro · zgłoszenia',
  });
}

function listDoKlienta(z) {
  const imie = z.osoba.split(/\s+/)[0];
  const przycisk = function (href, tekst, glowny) {
    return '<a href="' + esc(href) + '" style="display:inline-block;padding:14px 22px;border-radius:999px;font-weight:700;text-decoration:none;' +
      (glowny ? 'background:#de3a22;color:#ffffff;border:2px solid #de3a22' : 'background:#ffffff;color:#15140f;border:2px solid #15140f') +
      '">' + tekst + '</a>';
  };
  const krok = function (nr, kiedy, tresc) {
    return '<tr><td style="padding:12px 14px 12px 0;vertical-align:top;white-space:nowrap;color:#de3a22;font-weight:700">' + nr + ' · ' + kiedy +
      '</td><td style="padding:12px 0;vertical-align:top;border-top:1px solid #e2dccf">' + tresc + '</td></tr>';
  };
  const bol = z.bol
    ? '<p style="margin:0 0 18px;padding:12px 16px;background:#f7f4ee;border-left:3px solid #de3a22">W zgłoszeniu: „' + esc(z.bol) + '”. Od tego zaczniemy rozmowę.</p>'
    : '';
  const pracownik = z.rola === 'pracownik'
    ? '<p style="margin:0 0 18px">Zgłaszasz lokal jako pracownik — zanim cokolwiek uruchomimy, poprosimy o zgodę właściciela lub kierownika.</p>'
    : '';

  const html =
    '<div style="background:#f7f4ee;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#15140f">' +
    '<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden">' +
    '<div style="background:#15140f;color:#ffffff;padding:18px 24px;font-size:20px;font-weight:800">Shiftro</div>' +
    '<div style="padding:28px 24px;font-size:16px;line-height:1.55">' +
    '<p style="margin:0 0 14px">Dzień dobry ' + esc(imie) + ',</p>' +
    '<p style="margin:0 0 18px">dziękujemy za zgłoszenie <b>' + esc(z.lokal) + '</b>. Nie musisz czekać na telefon — Shiftro możesz zobaczyć już teraz.</p>' +
    bol + pracownik +
    '<p style="margin:0 0 6px;font-size:18px;font-weight:800">Demo</p>' +
    '<p style="margin:0 0 14px">Prawdziwa aplikacja na przykładowej sieci lokali. Wybierasz rolę jednym kliknięciem: <b>Panel kierownika</b>, <b>Tablet w lokalu</b> albo <b>Telefon pracownika</b>. Bez zakładania konta; co noc dane wracają do stanu początkowego, więc klikaj śmiało.</p>' +
    '<p style="margin:0 0 24px">' + przycisk(KONFIG.demo, 'Wejdź do demo', true) + '</p>' +
    '<p style="margin:0 0 6px;font-size:18px;font-weight:800">Prezentacja</p>' +
    '<p style="margin:0 0 14px">Pięć minut czytania: co robi Shiftro, jak wygląda wdrożenie w jeden dzień i ile kosztuje.</p>' +
    '<p style="margin:0 0 28px">' + przycisk(KONFIG.prezentacja, 'Otwórz prezentację', false) + '</p>' +
    '<p style="margin:0 0 6px;font-size:18px;font-weight:800">Co dalej</p>' +
    '<table style="border-collapse:collapse;width:100%;font-size:15px">' +
    krok(1, 'teraz', 'Demo i prezentacja, kiedy Ci wygodnie. Nic nie instalujesz.') +
    krok(2, 'do 2 dni', 'Zadzwonimy na numer ' + esc(z.telefon) + '. 20 minut: zapytamy, jak dziś układacie grafik, pokażemy Shiftro na Waszych stanowiskach i powiemy wprost, czy pasuje.' +
      (KONFIG.kalendarz ? '<br><a href="' + esc(KONFIG.kalendarz) + '" style="color:#de3a22;font-weight:700">Wolisz sam wybrać termin? Umów rozmowę</a>' : '')) +
    krok(3, 'test', 'Jeśli pasuje: wdrożenie w jeden dzień, kilka tygodni testu za 0 zł, bez umowy na rok.') +
    '</table>' +
    '<p style="margin:24px 0 0">Masz pytanie? Po prostu odpowiedz na tego maila.</p>' +
    '<p style="margin:14px 0 0">' + esc(KONFIG.podpis) + '<br><a href="https://shiftro.pl" style="color:#615d55">shiftro.pl</a></p>' +
    '</div></div></div>';

  const tekst =
    'Dzień dobry ' + imie + ',\n\n' +
    'dziękujemy za zgłoszenie ' + z.lokal + '. Shiftro możesz zobaczyć już teraz.\n\n' +
    'Demo (bez zakładania konta): ' + KONFIG.demo + '\n' +
    'Prezentacja: ' + KONFIG.prezentacja + '\n\n' +
    'Co dalej:\n1. Teraz: demo i prezentacja, kiedy Ci wygodnie.\n' +
    '2. W ciągu 2 dni roboczych zadzwonimy na ' + z.telefon + ' (20 minut).\n' +
    (KONFIG.kalendarz ? '   Termin możesz też wybrać sam: ' + KONFIG.kalendarz + '\n' : '') +
    '3. Jeśli pasuje: wdrożenie w jeden dzień, test za 0 zł, bez umowy na rok.\n\n' +
    'Masz pytanie? Odpowiedz na tego maila.\n\n' + KONFIG.podpis + '\nshiftro.pl';

  MailApp.sendEmail({
    to: z.email,
    subject: 'Shiftro: demo i prezentacja dla ' + z.lokal,
    body: tekst,
    htmlBody: html,
    name: KONFIG.nadawca,
    replyTo: KONFIG.powiadomienia || Session.getEffectiveUser().getEmail(),
  });
}
