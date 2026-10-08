// Wspólne elementy makiet: ikony, boczne menu panelu, pasek lokali, pasek zakładek telefonu.
var ICON = {
  home: '<path d="M3 11 12 4l9 7v9H3z"/>',
  ok: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  inbox: '<path d="M3 13h5l1 3h6l1-3h5M5 5h14l2 8v6H3v-6z"/>',
  cal: '<rect x="4" y="5" width="16" height="15" rx="1"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  task: '<rect x="5" y="4" width="14" height="16" rx="1"/><path d="m9 12 2 2 4-4"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M9 12h6M9 16h6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2 .6 3 2.6 3 6"/>',
  chart: '<path d="M4 4v16h16M8 16v-4M12 16V8M16 16v-6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  pulse: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
  flag: '<path d="M5 21V4h12l-2 4 2 4H5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>',
  swap: '<path d="M4 8h14l-4-4M20 16H6l4 4"/>',
  chk: '<path d="m5 12 4 4 10-10"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  left: '<path d="m15 5-7 7 7 7"/>',
  right: '<path d="m9 5 7 7-7 7"/>',
  warn: '<path d="M12 3 2 20h20zM12 10v4M12 17v.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/>',
  send: '<path d="M21 3 3 10l7 3 3 7z"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="1"/><path d="M16 4H4v12"/>',
  thermo: '<path d="M10 4a2 2 0 0 1 4 0v10a4 4 0 1 1-4 0z"/>',
  tag: '<path d="M3 12V3h9l9 9-9 9z"/><circle cx="8" cy="8" r="1.5"/>',
  cloud: '<path d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18z"/>',
  userplus: '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-7 7-7s7 3 7 7M19 8v6M16 11h6"/>',
  sun: '<circle cx="12" cy="14" r="4"/><path d="M12 4v3M4 14H2M22 14h-2M5.6 7.6l1.5 1.5M18.4 7.6l-1.5 1.5M3 20h18"/>'
};
// Znak Shiftro 1:1 z gastro-hours-manager/src/components/ShiftroMark.tsx.
// tone "dark" = znak na ciemnym tle: jasny kwadrat, ciemne pasy.
function mark(size, tone) {
  var tlo = tone === 'dark' ? '#F1F1EE' : '#171714', pas = tone === 'dark' ? '#171714' : '#F1F1EE';
  return '<svg class="mark" width="' + size + '" height="' + size + '" viewBox="0 0 100 100"><rect width="100" height="100" fill="' + tlo + '"/>' +
    '<rect x="18" y="26" width="52" height="15" fill="' + pas + '"/><rect x="30" y="47" width="52" height="15" fill="#DE3A22"/>' +
    '<rect x="18" y="68" width="30" height="15" fill="' + pas + '"/></svg>';
}
function ic(name, size) {
  var s = size ? ' style="width:' + size + 'px;height:' + size + 'px"' : '';
  return '<svg class="i" viewBox="0 0 24 24"' + s + '>' + ICON[name] + '</svg>';
}

var NAV = [
  ['home', 'Pulpit'], ['ok', 'Zatwierdzanie zmian', 'decyzje'], ['inbox', 'Skrzynka', 'skrzynka'],
  ['cal', 'Grafik'], ['task', 'Zadania'], ['pulse', 'Puls'], ['file', 'Rejestr godzin'],
  ['clock', 'Aktywni'], ['users', 'Pracownicy', 'ludzie'], ['chart', 'Raporty i koszty'], ['gear', 'Ustawienia']
];
var LOKALE = ['Cała sieć', 'Lipowa 12', 'Bar Przystań', 'Bistro Rynek'];

function panel(opts) {
  var side = '<aside class="side"><div class="brand"><div class="logo">' + mark(30, 'dark') + 'Shiftro</div>' +
    '<small>Kasia W. · kierownik sieci<br>Grupa Lipowa</small></div><nav>' +
    NAV.map(function (n) {
      var cnt = n[2] && opts.counts[n[2]] ? '<span class="n">' + opts.counts[n[2]] + '</span>' : '';
      return '<a class="' + (n[1] === opts.active ? 'on' : '') + '">' + ic(n[0]) + n[1] + cnt + '</a>';
    }).join('') + '</nav></aside>';
  var top = '<header class="top">' + LOKALE.map(function (l) {
    return '<span class="loc' + (l === opts.loc ? ' on' : '') + '">' + l + '</span>';
  }).join('') + '<span class="meta">' + opts.meta + '</span><span class="ib">' + ic('user') + '</span><span class="ib">' + ic('bell') + '</span></header>';
  var main = document.getElementById('main');
  var app = document.createElement('div');
  app.className = 'app';
  app.innerHTML = side + '<div class="body">' + top + '</div>';
  main.parentNode.insertBefore(app, main);
  app.querySelector('.body').appendChild(main);
}

var TABS = [['home', 'Pulpit'], ['clock', 'Zmiana'], ['cal', 'Grafik'], ['file', 'Raport'], ['task', 'Zadania'], ['more', 'Więcej']];
function tabs(active, badges) {
  badges = badges || {};
  document.getElementById('tabs').innerHTML = TABS.map(function (t) {
    var b = badges[t[1]] ? '<i class="n">' + badges[t[1]] + '</i>' : '';
    return '<span class="' + (t[1] === active ? 'on' : '') + '">' + ic(t[0]) + t[1] + b + '</span>';
  }).join('');
}

// <i data-i="nazwa"></i> zamienia się w ikonę
document.addEventListener('DOMContentLoaded', function () {
  [].forEach.call(document.querySelectorAll('[data-mark]'), function (el) {
    el.outerHTML = mark(+el.getAttribute('data-s'), el.getAttribute('data-mark'));
  });
  [].forEach.call(document.querySelectorAll('[data-i]'), function (el) {
    el.outerHTML = ic(el.getAttribute('data-i'), el.getAttribute('data-s'));
  });
});
