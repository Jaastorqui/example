# Solar System

A simple HTML5 canvas animation of the 8 planets of the Solar System orbiting the Sun.

## Planets included

Mercury, Venus, Earth (with the Moon), Mars, Jupiter, Saturn (with ring), Uranus, Neptune.

## How to run

Just open `index.html` in a browser. No build step required.

## How to add or tweak a planet

All planets are described in a single data array at the top of `app.js`:

```js
var planets = [
  { name: 'mercury', src: 'mercurio.png', orbit: 70, size: 14, period: 20, color: '#b1b1b1' },
  // ...
];
```

- `src`    — optional image path. If `null` or missing, the planet is drawn as a
  colored circle using `color`. This makes it easy to add planets before you
  have a proper image asset for them.
- `orbit`  — distance from the Sun in pixels.
- `size`   — drawn diameter in pixels.
- `period` — seconds for a full revolution (scaled, not realistic).
- `color`  — fallback color.
- `hasMoon`/`hasRing` — optional flags for Earth's moon and Saturn's ring.

To add a new body (e.g. Pluto, a dwarf planet, or a moon), just append a new
entry to the `planets` array.
