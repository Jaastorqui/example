// Solar System — 8 planets
// Images are used when available; otherwise a colored circle is drawn as a fallback.
//
// The whole scene is described in "design units" (a virtual coordinate space
// where the outermost orbit sits near the edge of a 1200x1200 canvas). At draw
// time everything is uniformly scaled to whatever size the canvas actually has,
// so the same code works for a 1200px canvas, a 500px canvas, or anything in
// between — including when the browser window is resized.

var sun = new Image();
var moon = new Image();

// Design-space constants. All planet `orbit`/`size` values are expressed in
// these units; the final pixel size is `value * scale` where `scale` is
// computed from the real canvas size (see `draw`).
var DESIGN_SIZE = 1200;       // reference canvas size (width === height)
var DESIGN_RADIUS = 600;      // half of DESIGN_SIZE — usable radius from center
var SUN_SIZE = 200;           // sun diameter in design units

// Planet definitions.
// orbit  : distance from the Sun (in design units)
// size   : drawn diameter of the planet (in design units)
// period : seconds for a full revolution (scaled, not realistic)
// color  : fallback color if no image is available
var planets = [
  { name: 'mercury', src: 'mercurio.png',       orbit:  70, size: 14, period: 20, color: '#b1b1b1' },
  { name: 'venus',   src: null,                  orbit: 100, size: 20, period: 30, color: '#e8c27a' },
  { name: 'earth',   src: 'Canvas_earth.png',    orbit: 150, size: 24, period: 60, color: '#3a7bd5', hasMoon: true },
  { name: 'mars',    src: 'marte.png',           orbit: 200, size: 20, period: 75, color: '#c1440e' },
  { name: 'jupiter', src: null,                  orbit: 280, size: 50, period: 120, color: '#d4a373' },
  { name: 'saturn',  src: null,                  orbit: 360, size: 42, period: 180, color: '#e3c98a', hasRing: true },
  { name: 'uranus',  src: null,                  orbit: 430, size: 30, period: 240, color: '#7fd3d6' },
  { name: 'neptune', src: null,                  orbit: 500, size: 30, period: 300, color: '#3f54ba' }
];
sun.src = 'Canvas_sun.png';
moon.src = 'Canvas_moon.png';

function init() {


  planets.forEach(function (p) {
    if (p.src) {
      p.img = new Image();
      p.img.onload = function () { p.imgReady = true; };
      p.img.src = p.src;
    }
  });

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  window.requestAnimationFrame(draw);
}

// Makes the canvas square and as large as it can fit in the viewport, while
// also respecting the device pixel ratio so drawings stay crisp on HiDPI
// screens. The CSS size is what the user sees; the backing-store size is
// multiplied by `devicePixelRatio`.
function resizeCanvas() {
  var canvas = document.getElementById('canvas');
  var style = window.getComputedStyle(canvas);
  var cssWidth = parseFloat(style.width);
  var cssHeight = parseFloat(style.height);


  var margin = 24; // small breathing room around the scene
  var available = Math.min(
    window.innerWidth  - margin * 2,
    window.innerHeight - margin * 2 - 60 // leave room for the <h1> heading
  );

  var dpr = window.devicePixelRatio || 1;
  canvas.width  = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
}

function drawPlanet(ctx, p, time, scale) {
  // `time` is a monotonically increasing value in seconds, so the angle grows
  // continuously and planets don't "jump" back when the wall-clock second/minute
  // rolls over (which was the case when using Date#getSeconds()).
  var angle = (2 * Math.PI / p.period) * time;
  var orbit = p.orbit * scale;
  var size = p.size * scale;

  // Orbit path
  ctx.beginPath();
  ctx.arc(0, 0, orbit, 0, Math.PI * 2, false);
  ctx.stroke();

  ctx.save();
  ctx.rotate(angle);
  ctx.translate(orbit, 0);

  // Saturn's ring
  if (p.hasRing) {
    ctx.save();
    ctx.rotate(-angle * 0.5);
    ctx.strokeStyle = 'rgba(230, 210, 160, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.9, size * 0.35, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.restore();
  }

  // Planet body: image when loaded, otherwise colored circle
  if (p.imgReady) {
    var half = size / 2;
    ctx.drawImage(p.img, -half, -half, size, size);
  } else {
    ctx.beginPath();
    ctx.fillStyle = p.color;
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
  }

  // Earth's moon — also uses the continuous `time` (seconds) to avoid jumps.
  if (p.hasMoon) {
    ctx.save();
    ctx.rotate((2 * Math.PI / 6) * time);
    ctx.translate(0, 28.5 * scale);
    var moonSize = 7 * scale;
    ctx.drawImage(moon, -moonSize / 2, -moonSize / 2, moonSize, moonSize);
    ctx.restore();
  }

  ctx.restore();
}

function draw() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  // The scale factor converts design units into actual pixels of the current
  // backing store. Using the backing-store size (canvas.width/height) rather
  // than the CSS size means the drawing remains sharp on HiDPI displays.
  var scale = canvas.width / DESIGN_SIZE;

  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2); // Center of the solar system

  // Continuous time in seconds since the page loaded. Using a monotonic clock
  // (performance.now) avoids any wall-clock wrap-around or system-time jumps
  // that would make every planet reset its position at the same moment.
  var time = performance.now() / 1000;
  planets.forEach(function (p) { drawPlanet(ctx, p, time, scale); });

  // Sun at the center, scaled with the rest of the scene
  var sunSize = SUN_SIZE * scale;
  ctx.drawImage(sun, -sunSize / 2, -sunSize / 2, sunSize, sunSize);

  ctx.restore();

  window.requestAnimationFrame(draw);
}

init();
