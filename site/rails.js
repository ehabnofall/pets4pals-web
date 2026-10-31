// Side rails: start the BOBOS FM videos only while the rails are showing
// (wide screens), keep them muted until the visitor turns the sound on
// (one rail at a time), and pause them when the tab is hidden.
(function () {
  var rails = [].slice.call(document.querySelectorAll('.rail'));
  if (!rails.length || !window.matchMedia) return;
  var wide = window.matchMedia('(min-width: 1280px)');
  function video(r) { return r.querySelector('video'); }
  function play(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  function setSound(r, on) {
    var b = r.querySelector('.rail-sound');
    b.textContent = on ? '\uD83D\uDD0A' : '\uD83D\uDD07';
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    var label = on ? b.getAttribute('data-off') : b.getAttribute('data-on');
    b.setAttribute('aria-label', label);
    b.title = label;
  }
  function update() {
    rails.forEach(function (r) {
      var v = video(r);
      if (wide.matches && !document.hidden) {
        if (!v.getAttribute('src')) {
          // MP4 (H.264) plays almost everywhere; WebM for browsers without it.
          var mp4 = v.canPlayType('video/mp4; codecs="avc1.4D401E, mp4a.40.2"');
          v.src = v.getAttribute(mp4 ? 'data-mp4' : 'data-webm');
        }
        play(v);
      } else if (!v.paused) {
        v.pause();
      }
    });
  }
  rails.forEach(function (r) {
    r.querySelector('.rail-sound').addEventListener('click', function () {
      var v = video(r), on = v.muted;
      rails.forEach(function (o) { video(o).muted = true; setSound(o, false); });
      if (on) { v.muted = false; play(v); setSound(r, true); }
    });
  });
  if (wide.addEventListener) wide.addEventListener('change', update); else wide.addListener(update);
  document.addEventListener('visibilitychange', update);
  update();
})();
