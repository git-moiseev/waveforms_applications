'use strict';

const kB = 1.380649e-23;
const c = 299792458;
const parsecInMeters = 3.0856775814913673e16;

const minSeconds = 1;
const maxSeconds = 365 * 24 * 60 * 60;

const signalWaves = document.getElementById('signal-waves');
const resultText = document.getElementById('resultText');

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function logSliderToValue(position, slider, minimum, maximum) {
  const fraction =
    (Number(position) - Number(slider.min)) /
    (Number(slider.max) - Number(slider.min));

  return minimum * Math.pow(maximum / minimum, fraction);
}

function valueToLogSlider(value, slider, minimum, maximum) {
  const safeValue = clamp(Number(value), minimum, maximum);
  const fraction =
    Math.log(safeValue / minimum) /
    Math.log(maximum / minimum);

  return Number(slider.min) +
    fraction * (Number(slider.max) - Number(slider.min));
}

function connectLinearPair(inputId, rangeId, onUpdate = calculateRmax) {
  const input = document.getElementById(inputId);
  const range = document.getElementById(rangeId);

  range.addEventListener('input', () => {
    input.value = range.value;
    onUpdate();
  });

  input.addEventListener('input', () => {
    const value = Number(input.value);

    if (!Number.isFinite(value)) {
      return;
    }

    range.value = clamp(value, Number(range.min), Number(range.max));
    onUpdate();
  });
}

function connectLogPair(
  inputId,
  rangeId,
  minimum,
  maximum,
  decimals = 3,
  onUpdate = calculateRmax
) {
  const input = document.getElementById(inputId);
  const range = document.getElementById(rangeId);

  const updateInputFromRange = () => {
    const value = logSliderToValue(range.value, range, minimum, maximum);
    input.value = Number(value.toPrecision(decimals));
    onUpdate();
  };

  range.addEventListener('input', updateInputFromRange);

  input.addEventListener('input', () => {
    const value = Number(input.value);

    if (!Number.isFinite(value) || value <= 0) {
      return;
    }

    range.value = valueToLogSlider(value, range, minimum, maximum);
    onUpdate();
  });

  range.value = valueToLogSlider(input.value, range, minimum, maximum);
}

function sliderToSeconds(position, slider) {
  return Math.round(
    logSliderToValue(position, slider, minSeconds, maxSeconds)
  );
}

function secondsToSlider(seconds, slider) {
  return valueToLogSlider(seconds, slider, minSeconds, maxSeconds);
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
  const minimum = 1;
  const maximum = 1000000;
  const power = clamp(Number(value) || minimum, minimum, maximum);

  const level =
    (Math.log10(power) - Math.log10(minimum)) /
    (Math.log10(maximum) - Math.log10(minimum));

  const visualLevel = Math.pow(level, 2.5);
  const opacity = 0.01 + visualLevel * 0.55;
  const glowRadius = 1 + visualLevel * 12;
  const glowOpacity = 0.01 + visualLevel * 0.35;

  signalWaves.style.opacity = opacity.toFixed(4);
  signalWaves.style.setProperty(
    '--dot-scale',
    (0.8 + visualLevel * 0.6).toFixed(2)
  );

  signalWaves.style.filter =
    `blur(0.3px) drop-shadow(` +
    `0 0 ${glowRadius.toFixed(2)}px ` +
    `rgba(125, 211, 252, ${glowOpacity.toFixed(4)})` +
    `)`;
}

function calculateRmax() {
  const Dt = Number(document.getElementById('dt').value);
  const Dr = Number(document.getElementById('dr').value);
  const Pt = Number(document.getElementById('pt').value) * 1000;
  const tint = parseDuration(document.getElementById('tint').value);
  const B = Number(document.getElementById('bandwidth').value);
  const Tsys = Number(document.getElementById('Tsys').value);
  const freqMHz = Number(document.getElementById('freq').value);
  const etaT = Number(document.getElementById('etaT').value);
  const etaR = Number(document.getElementById('etaR').value);
  const L = Number(document.getElementById('L').value);
  const rho = Number(document.getElementById('rho').value);

  const values = [
    Dt, Dr, Pt, tint, B, Tsys, freqMHz, etaT, etaR, L, rho
  ];

  if (values.some(value => !Number.isFinite(value) || value <= 0)) {
    resultText.textContent =
      'Please enter valid positive values for all parameters.';
    return;
  }

  const lambda = c / (freqMHz * 1e6);

  /*
   * Noncoherent energy-detection range:
   *
   * Rmax = π Dt Dr / (4 λ)
   *        × sqrt(Pt ηt ηr L / (ρacq kB Tsys))
   *        × (tint / B)^(1/4)
   */
  const apertureFactor =
    Math.PI * Dt * Dr / (4 * lambda);

  const powerAndNoiseFactor = Math.sqrt(
    Pt * etaT * etaR * L /
    (rho * kB * Tsys)
  );

  const noncoherentIntegrationFactor =
    Math.pow(tint / B, 0.25);

  const RmaxMeters =
    apertureFactor *
    powerAndNoiseFactor *
    noncoherentIntegrationFactor;

  const RmaxParsec = RmaxMeters / parsecInMeters;
  const RmaxLy = RmaxParsec * 3.26156;

  resultText.innerHTML =
    `R<sub>max</sub> = <strong>${formatNumber(RmaxParsec, 3)}</strong> pc<br>` +
    `R<sub>max</sub> = <strong>${formatNumber(RmaxLy, 2)}</strong> light-years<br>` +
    `t<sub>int</sub> = <strong>${formatNumber(tint, 0)}</strong> s<br>` +
    `B = <strong>${formatNumber(B, B < 0.01 ? 6 : 3)}</strong> Hz`;
}

function updatePowerAndCalculation() {
  updatePowerEffect(document.getElementById('pt').value);
  calculateRmax();
}

connectLinearPair('dt', 'dt-range');
connectLinearPair('dr', 'dr-range');
connectLinearPair('etaT', 'etaT-range');
connectLinearPair('etaR', 'etaR-range');
connectLinearPair('L', 'L-range');

connectLogPair('pt', 'pt-range', 1, 1000000, 6, updatePowerAndCalculation);
connectLogPair('bandwidth', 'bandwidth-range', 0.000001, 1000000, 6);
connectLogPair('Tsys', 'Tsys-range', 3, 500, 6);
connectLogPair('freq', 'freq-range', 10, 100000, 8);
connectLogPair('rho', 'rho-range', 0.1, 1000, 6);

const tintInput = document.getElementById('tint');
const tintRange = document.getElementById('tint-range');

tintRange.addEventListener('input', () => {
  const seconds = sliderToSeconds(tintRange.value, tintRange);
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
  tintRange.value = secondsToSlider(seconds, tintRange);
  calculateRmax();
});

tintRange.value = secondsToSlider(
  parseDuration(tintInput.value),
  tintRange
);

updatePowerEffect(document.getElementById('pt').value);
calculateRmax();
