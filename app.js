// Pinned to a specific pixelloom version so this demo can't silently change
// behavior if a future release changes the API.
import { gridToPath, gridToSvg } from 'https://unpkg.com/pixelloom@0.1.1/src/index.js';

const PRESETS = {
  donut: {
    width: 3,
    height: 3,
    pixels: [true, true, true, true, false, true, true, true, true],
  },
  lTromino: {
    width: 2,
    height: 2,
    pixels: [true, true, true, false],
  },
  nestedHoles: {
    width: 5,
    height: 5,
    // prettier-ignore
    pixels: [
      true, true,  true,  true,  true,
      true, false, false, false, true,
      true, false, true,  false, true,
      true, false, false, false, true,
      true, true,  true,  true,  true,
    ],
  },
  selfTouchingPinch: {
    width: 4,
    height: 4,
    // prettier-ignore
    pixels: [
      false, true,  true,  true,
      false, true,  false, true,
      false, false, true,  true,
      false, false, false, false,
    ],
  },
};

const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const gridEl = document.getElementById('grid');
const previewEl = document.getElementById('preview');
const pathEl = document.querySelector('#path code');
const statsEl = document.getElementById('stats');

let width = PRESETS.donut.width;
let height = PRESETS.donut.height;
let pixels = PRESETS.donut.pixels.slice();

function naiveRectsSvg(pixels, width, height) {
  let rects = '';
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (pixels[y * width + x]) rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><g fill="#000">${rects}</g></svg>`;
}

function clamp(value) {
  return Math.min(32, Math.max(1, Number(value) || 1));
}

function renderGrid() {
  gridEl.style.setProperty('--cols', width);
  gridEl.style.setProperty('--rows', height);
  gridEl.innerHTML = '';
  for (let i = 0; i < width * height; i++) {
    const x = i % width;
    const y = Math.floor(i / width);
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cell';
    cell.setAttribute('aria-pressed', String(Boolean(pixels[i])));
    cell.setAttribute('aria-label', `pixel ${x}, ${y}`);
    cell.addEventListener('click', () => {
      pixels[i] = !pixels[i];
      cell.setAttribute('aria-pressed', String(pixels[i]));
      updateOutput();
    });
    gridEl.appendChild(cell);
  }
}

function updateOutput() {
  const svg = gridToSvg(pixels, width, height);
  const naive = naiveRectsSvg(pixels, width, height);

  previewEl.innerHTML = svg;
  pathEl.textContent = gridToPath(pixels, width, height) || '(empty)';

  const optimizedSize = svg.length;
  const naiveSize = naive.length;
  const savedPct = Math.round((1 - optimizedSize / naiveSize) * 100);
  statsEl.textContent = `${optimizedSize}B optimized vs ${naiveSize}B naive rect-per-pixel (${savedPct}% smaller)`;
}

function setGrid(newWidth, newHeight, newPixels) {
  width = newWidth;
  height = newHeight;
  pixels = newPixels ? newPixels.slice() : new Array(width * height).fill(false);
  widthInput.value = width;
  heightInput.value = height;
  renderGrid();
  updateOutput();
}

widthInput.addEventListener('change', () => setGrid(clamp(widthInput.value), height));
heightInput.addEventListener('change', () => setGrid(width, clamp(heightInput.value)));

// Number inputs change value on scroll while focused - blur on wheel so
// scrolling the page doesn't silently resize the grid underneath you.
widthInput.addEventListener('wheel', () => widthInput.blur());
heightInput.addEventListener('wheel', () => heightInput.blur());

document.getElementById('clear').addEventListener('click', () => setGrid(width, height));
document.getElementById('fill').addEventListener('click', () => setGrid(width, height, new Array(width * height).fill(true)));

document.querySelectorAll('[data-preset]').forEach((button) => {
  button.addEventListener('click', () => {
    const preset = PRESETS[button.dataset.preset];
    setGrid(preset.width, preset.height, preset.pixels);
  });
});

setGrid(width, height, pixels);
