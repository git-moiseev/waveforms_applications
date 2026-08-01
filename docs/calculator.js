'use strict';

const kB = 1.380649e-23;
const c = 299792458;

const minSeconds = 1;
const maxSeconds = 365 * 24 * 60 * 60;

const dtInput = document.getElementById('dt');
const dtRange = document.getElementById('dt-range');

const drInput = document.getElementById('dr');
const drRange = document.getElementById('dr-range');

const ptInput = document.getElementById('pt');
const ptRange = document.getElementById('pt-range');

const tintInput = document.getElementById('tint');
const tintRange = document.getElementById('tint-range');

const signalWaves = document.getElementById('signal-waves');
const resultText = document.getElementById('resultText');

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function connectNumberAndRange(numberInput, rangeInput, onUpdate) {
  rangeInput.addEventListener('input', () => {
    numberInput.value = rangeInput.value;
    onUpdate();
  });

  numberInput.addEventListener('input', () => {
    const value = Number(numberInput.value);

    if (!Number.isFinite(value)) {
      return;
    }

    rangeInput.value = clamp(
      value,
      Number(rangeInput.min),
      Number(rangeInput.max)
    );

    onUpdate();
  });
}

function sliderToSeconds(position) {
  const fraction =
    (position - Number(tintRange.min)) /
    (Number(tintRange.max) - Number(tintRange.min));

  return Math.round(
    minSeconds * Math.pow(maxSeconds / minSeconds, fraction)
  );
}

function secondsToSlider(seconds) {
  const fraction =
    Math.log(seconds / minSeconds) /
    Math.log(maxSeconds / minSeconds);

  return Math.round(
    Number(tintRange.min) +
    fraction * (Number(tintRange.max) - Number(tintRange.min))
  );
}

function formatDuration(totalSeconds) {
  let remaining = Math.round(totalSeconds);

  const days = Math.floor(remaining / 86400);
  remaining %= 86400;

  const hours = Math.floor(remaining / 3600);
  remaining %= 3600;

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return [
    days && `${days}d`,
    hours && `${hours}h`,
    minutes && `${minutes}m`,
    (seconds || (!days && !hours && !minutes)) && `${seconds}s`
  ]
    .filter(Boolean)
    .join(' ');
}

function parseDuration(value) {
  const text = String(value).trim().toLowerCase();

  if (/^\d+(?:\.\d+)?$/.test(text)) {
    return Number(text);
  }

  const units = {
    y: 365 * 86400,
    d: 86400,
    h: 3600,
    m: 60,
    s: 1
  };

  const pattern = /(\d+(?:\.\d+)?)\s*([ydhms])/g;

  let total = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    total += Number(match[1]) * units[match[2]];
  }

  const remainder = text
    .replace(pattern, '')
    .replace(/\s+/g, '');

  return remainder === '' && total > 0 ? total : NaN;
}

function formatNumber(value, decimals = 3) {
  return Number(value)
    .toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
    .replace(/,/g, '\u202F');
}

function updatePowerEffect(value) {
  const minPower = Number(ptRange.min);
  const maxPower = Number(ptRange.max);

  const power = clamp(
    Number(value) || minPower,
    minPower,
    maxPower
  );

  const level =
    (Math.log10(power) - Math.log10(minPower)) /
    (Math.log10(maxPower) - Math.log10(minPower));

  /*
   * Делает верхнюю часть диапазона визуально выразительнее.
   * При 1000 kW visualLevel ≈ 0.49,
   * при 10000 kW visualLevel = 1.
   */
  const visualLevel = Math.pow(level, 2.5);

  const opacity = 0.01 + visualLevel * 0.55;
  const glowRadius = 1 + visualLevel * 12;
  const glowOpacity = 0.01 + visualLevel * 0.35;

  signalWaves.style.opacity = opacity.toFixed(4);

  const dot = signalWaves;

  dot.style.setProperty("--dot-scale", (0.8 + visualLevel * 0.6).toFixed(2));

  signalWaves.style.filter =
    `blur(0.3px) drop-shadow(` +
    `0 0 ${glowRadius.toFixed(2)}px ` +
    `rgba(125, 211, 252, ${glowOpacity.toFixed(4)})` +
    `)`;
}

function calculateRmax() {
  const Dt = Number(dtInput.value);
  const Dr = Number(drInput.value);
  const Pt = Number(ptInput.value) * 1000;

  const freqMHz = Number(document.getElementById('freq').value);
  const etaT = Number(document.getElementById('etaT').value);
  const etaR = Number(document.getElementById('etaR').value);
  const L = Number(document.getElementById('L').value);
  const rho = Number(document.getElementById('rho').value);
  const Tsys = Number(document.getElementById('Tsys').value);
  const tint = parseDuration(tintInput.value);

  const values = [
    Dt,
    Dr,
    Pt,
    freqMHz,
    etaT,
    etaR,
    L,
    rho,
    Tsys,
    tint
  ];

  if (values.some(value => !Number.isFinite(value) || value <= 0)) {
    resultText.textContent =
      'Please enter valid positive values for all parameters.';
    return;
  }

  const freqHz = freqMHz * 1e6;
  const lambda = c / freqHz;

  const numerator = Math.PI * Dt * Dr;
  const insideSqrt =
    Pt * etaT * etaR * L * tint /
    (rho * kB * Tsys);

  const RmaxMeters =
    (numerator / (4 * lambda)) *
    Math.sqrt(insideSqrt);

  const parsecInMeters = 3.0856775814913673e16;
  const RmaxParsec = RmaxMeters / parsecInMeters;
  const RmaxLy = RmaxParsec * 3.26156;

  resultText.innerHTML =
    `R<sub>max</sub> = <strong>${formatNumber(RmaxParsec, 3)}</strong> pc<br>` +
    `R<sub>max</sub> = <strong>${formatNumber(RmaxLy, 2)}</strong> light-years<br>` +
    `t<sub>int</sub> = <strong>${formatNumber(tint, 0)}</strong> s`;
}

function updatePowerAndCalculation() {
  updatePowerEffect(ptInput.value);
  calculateRmax();
}

connectNumberAndRange(dtInput, dtRange, calculateRmax);
connectNumberAndRange(drInput, drRange, calculateRmax);
connectNumberAndRange(ptInput, ptRange, updatePowerAndCalculation);

tintRange.addEventListener('input', () => {
  const seconds = sliderToSeconds(Number(tintRange.value));

  tintInput.value = formatDuration(seconds);
  calculateRmax();
});

tintInput.addEventListener('change', () => {
  let seconds = parseDuration(tintInput.value);

  if (!Number.isFinite(seconds)) {
    seconds = minSeconds;
  }

  seconds = clamp(seconds, minSeconds, maxSeconds);

  tintInput.value = formatDuration(seconds);
  tintRange.value = secondsToSlider(seconds);

  calculateRmax();
});

document
  .querySelectorAll('#Tsys, #freq, #etaT, #etaR, #L, #rho')
  .forEach(input => {
    input.addEventListener('input', calculateRmax);
  });

tintRange.value = secondsToSlider(parseDuration(tintInput.value));

updatePowerEffect(ptInput.value);
calculateRmax();
