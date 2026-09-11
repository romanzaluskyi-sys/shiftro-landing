# Rysunki do lendingu. Świadomie NIE ozdobniki: pierwszy pokazuje kształt
# tygodnia razem z dziurą w obsadzie (czyli to, co system naprawdę liczy),
# trzy kolejne — trzy urządzenia, na których ludzie go dotykają.
INK, MID, SOFT = "#171714", "#605D5D", "#BAB6B6"
ACC, ACC_SOFT, LINE = "#DE3A22", "#FAEAE6", "#B7B6AE"
MUT = "#6E6E66"

# ── 1. Rytm tygodnia ──────────────────────────────────────────────────────
DNI = ["pon", "wt", "śr", "czw", "pt", "sob", "nd"]
# (rola, od, do) — godziny 8:00–24:00. Liczby zmian zgadzają się z nagłówkami
# tabeli grafiku niżej na stronie: 4, 4, (dziura), 4, 5, 6, 4.
PLAN = [
    [(0, 8, 16), (1, 10, 18), (2, 14, 22), (0, 16, 24)],
    [(0, 8, 16), (1, 10, 18), (2, 14, 22), (1, 17, 24)],
    [(0, 8, 12), (1, 15, 20), (2, 16, 24)],
    [(0, 8, 16), (1, 12, 22), (2, 14, 22), (0, 16, 24)],
    [(0, 8, 16), (1, 12, 22), (2, 14, 24), (0, 16, 24), (2, 18, 24)],
    [(0, 8, 16), (1, 10, 18), (2, 12, 20), (0, 14, 22), (1, 16, 24), (2, 18, 24)],
    [(0, 9, 17), (1, 12, 20), (2, 14, 22), (0, 16, 24)],
]
KOLOR = [INK, MID, SOFT]
W, KOL = 1204, 172.0
PAD, H0, DH, DY = 7, 16, 22, 26          # margines kolumny, wysokość paska, odstęp
TOP, GODZ0, GODZN = 30, 8, 24

def x_godz(dzien, g, szer):
    return dzien * KOL + PAD + (g - GODZ0) / (GODZN - GODZ0) * szer

szer_kol = KOL - 2 * PAD
naj = max(len(d) for d in PLAN)
baza = TOP + (naj - 1) * DY + H0 + 14
wys = baza + 30

czesci = []
# dziura w obsadzie na środę, 12–15 — jedyne miejsce w akcentie
gx, gx2 = x_godz(2, 12, szer_kol), x_godz(2, 15, szer_kol)
czesci.append(f'<rect x="{gx:.1f}" y="{TOP-12:.0f}" width="{gx2-gx:.1f}" height="{baza-TOP+12:.0f}" fill="{ACC_SOFT}"/>')
for x in (gx, gx2):
    czesci.append(f'<line x1="{x:.1f}" y1="{TOP-12:.0f}" x2="{x:.1f}" y2="{baza:.0f}" stroke="{ACC}" stroke-width="2"/>')
czesci.append(f'<text x="{(gx+gx2)/2:.1f}" y="{TOP-20:.0f}" text-anchor="middle" font-family="Archivo, sans-serif" font-size="12" font-weight="800" fill="{ACC}">brak 12–15</text>')

for i, dzien in enumerate(PLAN):
    for j, (rola, od, do) in enumerate(dzien):
        x1, x2 = x_godz(i, od, szer_kol), x_godz(i, do, szer_kol)
        y = TOP + j * DY
        czesci.append(f'<rect x="{x1:.1f}" y="{y:.0f}" width="{x2-x1:.1f}" height="{H0}" fill="{KOLOR[rola]}"/>')
    sx = i * KOL + PAD
    czesci.append(f'<text x="{sx:.1f}" y="{baza+22:.0f}" font-family="Archivo, sans-serif" font-size="11" font-weight="800" letter-spacing="1.4" fill="{MUT}">{DNI[i].upper()}</text>')
    if i:
        czesci.append(f'<line x1="{i*KOL:.1f}" y1="{TOP-12:.0f}" x2="{i*KOL:.1f}" y2="{baza:.0f}" stroke="{LINE}" stroke-width="1"/>')
czesci.append(f'<line x1="0" y1="{baza:.0f}" x2="{W}" y2="{baza:.0f}" stroke="{INK}" stroke-width="2"/>')

RYTM = (f'<svg viewBox="0 0 {W} {wys:.0f}" width="100%" style="display:block;height:auto;" '
        f'role="img" aria-label="Tydzień pracy lokalu: zmiany ułożone na osi godzin, ze zaznaczoną dziurą w obsadzie w środę między 12:00 a 15:00">'
        + "".join(czesci) + "</svg>")

# ── 2. Trzy urządzenia ────────────────────────────────────────────────────
def znak(x, y, s):
    """Znak Shiftro w skali s (bok 100)."""
    k = s / 100
    return (f'<g transform="translate({x},{y}) scale({k:.3f})">'
            f'<rect width="100" height="100" fill="{INK}"/>'
            f'<rect x="18" y="26" width="52" height="15" fill="#F1F1EE"/>'
            f'<rect x="30" y="47" width="52" height="15" fill="{ACC}"/>'
            f'<rect x="18" y="68" width="30" height="15" fill="#F1F1EE"/></g>')

TABLET = f'''<svg viewBox="0 0 320 240" width="100%" style="display:block;height:auto;" role="img" aria-label="Tablet stojący na barze z listą imion pracowników">
<rect x="0" y="206" width="320" height="34" fill="#E7E7E2"/>
<line x1="0" y1="206" x2="320" y2="206" stroke="{INK}" stroke-width="2"/>
<rect x="146" y="192" width="28" height="14" fill="{INK}"/>
<rect x="62" y="26" width="196" height="166" fill="#fff" stroke="{INK}" stroke-width="2.5"/>
{znak(76, 40, 22)}
<rect x="104" y="45" width="52" height="10" fill="{INK}"/>
<rect x="76" y="76" width="168" height="24" fill="#F1F1EE" stroke="{LINE}" stroke-width="1.5"/>
<rect x="86" y="84" width="62" height="8" fill="{MID}"/>
<rect x="76" y="108" width="168" height="24" fill="{ACC_SOFT}" stroke="{ACC}" stroke-width="2"/>
<rect x="86" y="116" width="76" height="8" fill="{ACC}"/>
<rect x="76" y="140" width="168" height="24" fill="#F1F1EE" stroke="{LINE}" stroke-width="1.5"/>
<rect x="86" y="148" width="54" height="8" fill="{MID}"/>
<circle cx="228" cy="120" r="9" fill="none" stroke="{ACC}" stroke-width="2"/>
<circle cx="228" cy="120" r="17" fill="none" stroke="{ACC}" stroke-width="1.5" opacity="0.45"/>
</svg>'''

TELEFON = f'''<svg viewBox="0 0 320 240" width="100%" style="display:block;height:auto;" role="img" aria-label="Telefon pracownika z najbliższą zmianą i kolejnymi dniami grafiku">
<rect x="108" y="16" width="104" height="208" fill="#fff" stroke="{INK}" stroke-width="2.5"/>
<rect x="142" y="16" width="36" height="7" fill="{INK}"/>
<rect x="120" y="38" width="44" height="8" fill="{INK}"/>
<rect x="120" y="58" width="80" height="46" fill="{ACC_SOFT}" stroke="{ACC}" stroke-width="2"/>
<rect x="120" y="58" width="5" height="46" fill="{ACC}"/>
<rect x="133" y="70" width="48" height="9" fill="{ACC}"/>
<rect x="133" y="86" width="32" height="6" fill="{MID}"/>
<rect x="120" y="116" width="80" height="30" fill="#F1F1EE" stroke="{LINE}" stroke-width="1.5"/>
<rect x="130" y="126" width="40" height="7" fill="{MID}"/>
<rect x="120" y="156" width="80" height="30" fill="#F1F1EE" stroke="{LINE}" stroke-width="1.5"/>
<rect x="130" y="166" width="52" height="7" fill="{MID}"/>
<line x1="108" y1="198" x2="212" y2="198" stroke="{INK}" stroke-width="2"/>
<rect x="118" y="207" width="14" height="8" fill="{ACC}"/>
<rect x="141" y="207" width="14" height="8" fill="{SOFT}"/>
<rect x="164" y="207" width="14" height="8" fill="{SOFT}"/>
<rect x="187" y="207" width="14" height="8" fill="{SOFT}"/>
</svg>'''

KARTA = f'''<svg viewBox="0 0 320 240" width="100%" style="display:block;height:auto;" role="img" aria-label="Karta dnia: lista wpisów do odhaczenia i utarg dnia">
<rect x="46" y="22" width="228" height="196" fill="#fff" stroke="{INK}" stroke-width="2.5"/>
<line x1="46" y1="56" x2="274" y2="56" stroke="{INK}" stroke-width="2"/>
<rect x="62" y="34" width="58" height="10" fill="{INK}"/>
<rect x="232" y="34" width="26" height="10" fill="{ACC}"/>
'''
for i, zrobione in enumerate([True, True, True, False, False]):
    y = 72 + i * 24
    if zrobione:
        KARTA += (f'<rect x="62" y="{y}" width="14" height="14" fill="{ACC}"/>'
                  f'<path d="M65.5 {y+7.5} l3.5 3.5 l6-7" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
                  f'<rect x="88" y="{y+4}" width="{104 - i*12}" height="7" fill="{SOFT}"/>')
    else:
        KARTA += (f'<rect x="62" y="{y}" width="14" height="14" fill="none" stroke="{INK}" stroke-width="2"/>'
                  f'<rect x="88" y="{y+4}" width="{126 - i*14}" height="7" fill="{MID}"/>')
KARTA += f'''<line x1="46" y1="188" x2="274" y2="188" stroke="{INK}" stroke-width="2"/>
<rect x="62" y="198" width="40" height="8" fill="{MUT}"/>
<rect x="196" y="194" width="62" height="16" fill="{INK}"/>
</svg>'''

if __name__ == "__main__":
    import json, sys
    json.dump({"rytm": RYTM, "tablet": TABLET, "telefon": TELEFON, "karta": KARTA},
              open(sys.argv[1], "w"))
    print("rytm:", len(RYTM), "| tablet:", len(TABLET), "| telefon:", len(TELEFON), "| karta:", len(KARTA))

# ── 1b. Rytm tygodnia, wariant wąski ─────────────────────────────────────
# Ten sam tydzień obrócony: dzień to WIERSZ, godziny lecą w poprzek. Siedem
# dni mieści się w pionie telefonu bez przewijania i bez chowania czegokolwiek
# — przewijany pas w poziomie zawsze pokazuje kawałek i udaje, że to całość.
def rytm_waski():
    W2, LEWA, PRAWA = 380, 40, 8
    GORA, WIERSZ, PASEK, ODST = 26, 36, 5, 1
    os_szer = W2 - LEWA - PRAWA
    gx = lambda g: LEWA + (g - GODZ0) / (GODZN - GODZ0) * os_szer
    cz = []
    for g in (8, 12, 16, 20, 24):
        cz.append(f'<text x="{gx(g):.1f}" y="12" text-anchor="middle" font-family="Archivo, sans-serif" font-size="9" font-weight="700" fill="{MUT}">{g}</text>')
        cz.append(f'<line x1="{gx(g):.1f}" y1="18" x2="{gx(g):.1f}" y2="{GORA + 7*WIERSZ:.0f}" stroke="{LINE}" stroke-width="1"/>')
    for i, dzien in enumerate(PLAN):
        y0 = GORA + i * WIERSZ
        cz.append(f'<text x="0" y="{y0 + 16:.0f}" font-family="Archivo, sans-serif" font-size="10" font-weight="800" letter-spacing="0.8" fill="{MUT}">{DNI[i].upper()}</text>')
        if i == 2:  # środa — dziura w obsadzie
            a, b = gx(12), gx(15)
            cz.append(f'<rect x="{a:.1f}" y="{y0+2:.0f}" width="{b-a:.1f}" height="{WIERSZ-6:.0f}" fill="{ACC_SOFT}"/>')
            for x in (a, b):
                cz.append(f'<line x1="{x:.1f}" y1="{y0+2:.0f}" x2="{x:.1f}" y2="{y0+WIERSZ-4:.0f}" stroke="{ACC}" stroke-width="1.5"/>')
            cz.append(f'<text x="{a:.1f}" y="{y0+WIERSZ-7:.0f}" font-family="Archivo, sans-serif" font-size="9" font-weight="800" fill="{ACC}">brak 12–15</text>')
        for j, (rola, od, do) in enumerate(dzien):
            y = y0 + 4 + j * (PASEK + ODST)
            cz.append(f'<rect x="{gx(od):.1f}" y="{y:.0f}" width="{gx(do)-gx(od):.1f}" height="{PASEK}" fill="{KOLOR[rola]}"/>')
        cz.append(f'<line x1="0" y1="{y0+WIERSZ:.0f}" x2="{W2}" y2="{y0+WIERSZ:.0f}" stroke="{LINE if i < 6 else INK}" stroke-width="{1 if i < 6 else 2}"/>')
    h = GORA + 7 * WIERSZ + 4
    return (f'<svg viewBox="0 0 {W2} {h:.0f}" width="100%" style="display:block;height:auto;" role="img" '
            f'aria-label="Tydzień pracy lokalu: każdy dzień to wiersz, zmiany rozłożone na godzinach, z dziurą w obsadzie w środę">'
            + "".join(cz) + "</svg>")

RYTM_WASKI = rytm_waski()

# ── 3. Dziewięć miniatur do listy cech 01–09 ─────────────────────────────
# Zastępują ikonki z zestawu ogólnego. Ikonka „zegar" przy odbiciu zmiany i
# ikonka „dokument" przy raportach mogą stać przy czymkolwiek; te pokazują
# konkretny mechanizm, o którym mówi akapit obok.
def _svg(tresc, opis):
    return (f'<svg viewBox="0 0 116 72" width="116" style="display:block;height:auto;" '
            f'role="img" aria-label="{opis}">{tresc}</svg>')

def miniatury():
    m = []
    # 01 — dotknięcie imienia na liście
    m.append(_svg(
        f'<rect x="4" y="8" width="74" height="15" fill="{SOFT}"/>'
        f'<rect x="4" y="28" width="74" height="15" fill="{ACC_SOFT}" stroke="{ACC}" stroke-width="2"/>'
        f'<rect x="10" y="33" width="34" height="5" fill="{ACC}"/>'
        f'<rect x="4" y="48" width="74" height="15" fill="{SOFT}"/>'
        f'<circle cx="95" cy="36" r="7" fill="none" stroke="{ACC}" stroke-width="2"/>'
        f'<circle cx="95" cy="36" r="13" fill="none" stroke="{ACC}" stroke-width="1.5" opacity="0.45"/>',
        "Lista imion na tablecie, jedno dotknięte"))
    # 02 — grafik w telefonie
    m.append(_svg(
        f'<rect x="6" y="10" width="9" height="52" fill="{SOFT}"/><rect x="19" y="10" width="9" height="52" fill="{SOFT}"/>'
        f'<rect x="32" y="10" width="9" height="52" fill="{SOFT}"/>'
        f'<rect x="52" y="4" width="40" height="64" fill="#fff" stroke="{INK}" stroke-width="2"/>'
        f'<rect x="64" y="4" width="16" height="4" fill="{INK}"/>'
        f'<rect x="58" y="16" width="28" height="12" fill="{ACC_SOFT}" stroke="{ACC}" stroke-width="1.5"/>'
        f'<rect x="58" y="34" width="28" height="8" fill="{SOFT}"/><rect x="58" y="48" width="28" height="8" fill="{SOFT}"/>',
        "Grafik widoczny w telefonie pracownika"))
    # 03 — korekta godziny: stara przekreślona, nowa przyjęta
    m.append(_svg(
        f'<rect x="4" y="14" width="56" height="12" fill="{SOFT}"/>'
        f'<line x1="4" y1="20" x2="60" y2="20" stroke="{INK}" stroke-width="2"/>'
        f'<rect x="4" y="42" width="56" height="12" fill="{ACC}"/>'
        f'<path d="M76 46 l7 7 l14 -16" fill="none" stroke="{ACC}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
        "Poprawiona godzina zatwierdzona przez kierownika"))
    # 04 — wolne zaznaczone w kalendarzu
    kal = f'<rect x="14" y="8" width="88" height="56" fill="#fff" stroke="{INK}" stroke-width="2"/><rect x="14" y="8" width="88" height="11" fill="{INK}"/>'
    for r in range(3):
        for c in range(5):
            x, y = 20 + c * 17, 25 + r * 13
            kol = ACC if (r == 1 and 1 <= c <= 3) else SOFT
            kal += f'<rect x="{x}" y="{y}" width="12" height="8" fill="{kol}"/>'
    m.append(_svg(kal, "Zakres dni zaznaczony w kalendarzu jako wolne"))
    # 05 — checklista, trzy z czterech
    ch = ""
    for i, ok in enumerate([True, True, True, False]):
        y = 8 + i * 16
        if ok:
            ch += (f'<rect x="6" y="{y}" width="12" height="12" fill="{ACC}"/>'
                   f'<path d="M9 {y+6} l3 3 l5.5 -6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
                   f'<rect x="26" y="{y+3}" width="{72 - i*10}" height="6" fill="{SOFT}"/>')
        else:
            ch += (f'<rect x="6" y="{y}" width="12" height="12" fill="none" stroke="{INK}" stroke-width="2"/>'
                   f'<rect x="26" y="{y+3}" width="84" height="6" fill="{MID}"/>')
    m.append(_svg(ch, "Checklista zmiany, trzy zadania z czterech odhaczone"))
    # 06 — karta dnia z utargiem
    m.append(_svg(
        f'<rect x="10" y="6" width="96" height="60" fill="#fff" stroke="{INK}" stroke-width="2"/>'
        f'<line x1="10" y1="22" x2="106" y2="22" stroke="{INK}" stroke-width="2"/>'
        f'<rect x="17" y="11" width="26" height="6" fill="{INK}"/><rect x="88" y="11" width="11" height="6" fill="{ACC}"/>'
        f'<rect x="17" y="30" width="44" height="5" fill="{SOFT}"/><rect x="17" y="41" width="34" height="5" fill="{SOFT}"/>'
        f'<rect x="17" y="52" width="24" height="5" fill="{SOFT}"/>'
        f'<rect x="66" y="36" width="33" height="21" fill="{INK}"/>',
        "Karta dnia z wpisami i utargiem"))
    # 07 — termin, który mija
    m.append(_svg(
        f'<rect x="12" y="6" width="52" height="60" fill="#fff" stroke="{INK}" stroke-width="2"/>'
        f'<rect x="19" y="14" width="30" height="5" fill="{INK}"/>'
        f'<rect x="19" y="27" width="38" height="5" fill="{SOFT}"/><rect x="19" y="38" width="30" height="5" fill="{SOFT}"/>'
        f'<rect x="19" y="49" width="26" height="5" fill="{ACC}"/>'
        f'<path d="M88 22 L106 56 L70 56 Z" fill="{ACC}"/>'
        f'<rect x="86" y="34" width="4" height="11" fill="#fff"/><rect x="86" y="48" width="4" height="4" fill="#fff"/>',
        "Dokument z terminem, który dobiega końca"))
    # 08 — koszt i godziny miesiąca
    slupki = ""
    for i, h in enumerate([18, 30, 24, 40, 33]):
        x = 8 + i * 21
        slupki += f'<rect x="{x}" y="{58 - h}" width="14" height="{h}" fill="{ACC if i == 3 else SOFT}"/>'
    m.append(_svg(slupki + f'<line x1="4" y1="58" x2="112" y2="58" stroke="{INK}" stroke-width="2"/>'
                  + f'<rect x="4" y="64" width="46" height="5" fill="{MID}"/>',
                  "Godziny i koszt rozbite na miesiące"))
    # 09 — tablet w lokalu i telefon prywatny
    m.append(_svg(
        f'<rect x="4" y="12" width="62" height="46" fill="#fff" stroke="{INK}" stroke-width="2"/>'
        f'<rect x="11" y="20" width="26" height="5" fill="{INK}"/>'
        f'<rect x="11" y="31" width="48" height="6" fill="{ACC_SOFT}" stroke="{ACC}" stroke-width="1.5"/>'
        f'<rect x="11" y="44" width="38" height="6" fill="{SOFT}"/>'
        f'<rect x="27" y="58" width="16" height="4" fill="{INK}"/>'
        f'<rect x="80" y="6" width="30" height="60" fill="#fff" stroke="{INK}" stroke-width="2"/>'
        f'<rect x="89" y="6" width="12" height="3" fill="{INK}"/>'
        f'<rect x="86" y="18" width="18" height="10" fill="{ACC}"/>'
        f'<rect x="86" y="34" width="18" height="6" fill="{SOFT}"/><rect x="86" y="46" width="18" height="6" fill="{SOFT}"/>',
        "Tablet stojący w lokalu i prywatny telefon pracownika"))
    return m

MINIATURY = miniatury()
