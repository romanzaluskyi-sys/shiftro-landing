#!/bin/sh
# Renderuje makiety z mockups/*.html do img/ w 2x: panel i e-mail jako JPEG,
# tablet i telefony jako PNG z przezroczystym tłem (leżą na kolorowych pasach strony).
# Użycie: sh mockups/render.sh            — wszystkie
#         sh mockups/render.sh grafik     — jedna
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TMP="${TMPDIR:-/tmp}/shiftro-render"
mkdir -p "$TMP"

# nazwa  szerokość  wysokość
SIZES="grafik 1400 952
decyzje 1400 875
puls 1400 972
email 700 1300
tablet 1240 880
tel-pulpit 400 855
tel-gielda 400 855
tel-raport 400 855"

echo "$SIZES" | while read -r name w h; do
  if [ -n "$1" ] && [ "$1" != "$name" ]; then continue; fi
  rm -f "$TMP/$name.png"
  # Chrome zapisuje zrzut, ale potrafi potem nie zamknąć procesu — czekamy na plik i kończymy go sami.
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
    --window-size="$w,$h" --default-background-color=00000000 --user-data-dir="$TMP/profile" \
    --screenshot="$TMP/$name.png" "file://$PWD/$name.html" >/dev/null 2>&1 &
  pid=$!
  i=0
  while [ ! -s "$TMP/$name.png" ] && [ $i -lt 60 ]; do sleep 0.5; i=$((i+1)); done
  sleep 0.5
  kill $pid 2>/dev/null || true
  wait $pid 2>/dev/null || true
  case "$name" in
    tablet|tel-*) cp "$TMP/$name.png" "../img/$name.png"; out="img/$name.png" ;;
    *) sips -s format jpeg -s formatOptions 72 "$TMP/$name.png" --out "../img/$name.jpg" >/dev/null; out="img/$name.jpg" ;;
  esac
  echo "$out  ${w}x${h} @2x"
done
