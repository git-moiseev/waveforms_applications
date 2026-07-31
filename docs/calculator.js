const kB = 1.380649e-23;
const c = 299792458;
const minSeconds = 1;
const maxSeconds = 365 * 24 * 60 * 60; // one year

const tintInput = document.getElementById('tint');
const tintRange = document.getElementById('tint-range');
const dtInput = document.getElementById('dt');
const dtRange = document.getElementById('dt-range');
const drInput = document.getElementById('dr');
const drRange = document.getElementById('dr-range');
const ptInput = document.getElementById('pt');
const ptRange = document.getElementById('pt-range');

dtRange.addEventListener('input', () => {
  dtInput.value = dtRange.value;
  calculateRmax();
});

dtInput.addEventListener('input', () => {
  const min = Number(dtRange.min);
  const max = Number(dtRange.max);
  const value = Number(dtInput.value);

  if (Number.isFinite(value)) {
    dtRange.value = Math.max(min, Math.min(max, value));
    calculateRmax();
  }
});

drRange.addEventListener('input', () => {
  drInput.value = drRange.value;
  calculateRmax();
});

drInput.addEventListener('input', () => {
  const min = Number(drRange.min);
  const max = Number(drRange.max);
  const value = Number(drInput.value);

  if (Number.isFinite(value)) {
    drRange.value = Math.max(min, Math.min(max, value));
    calculateRmax();
  }
});

ptRange.addEventListener('input', () => {
  ptInput.value = ptRange.value;
  calculateRmax();
});

ptInput.addEventListener('input', () => {
  const min = Number(ptRange.min);
  const max = Number(ptRange.max);
  const value = Number(ptInput.value);

  if (Number.isFinite(value)) {
    ptRange.value = Math.max(min, Math.min(max, value));
    calculateRmax();
  }
});

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
    fraction *
      (Number(tintRange.max) - Number(tintRange.min))
  );
}

function formatDuration(totalSeconds) {
  totalSeconds = Math.round(totalSeconds);

  const days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;

  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

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

  // A number without a unit is interpreted as seconds.
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

  // Reject unknown characters or incomplete expressions.
  const remainder = text.replace(pattern, '').replace(/\s+/g, '');

  return remainder === '' && total > 0 ? total : NaN;
}

tintRange.addEventListener('input', () => {
  const seconds = sliderToSeconds(Number(tintRange.value));

  tintInput.value = formatDuration(seconds);
  calculate(); // if immediate recalculation is required
});

tintInput.addEventListener('change', () => {
  let seconds = parseDuration(tintInput.value);

  if (!Number.isFinite(seconds)) {
    seconds = minSeconds;
  }

  seconds = Math.min(maxSeconds, Math.max(minSeconds, seconds));

  tintInput.value = formatDuration(seconds);
  tintRange.value = secondsToSlider(seconds);

  calculate();
});

function formatNumber(value, decimals = 3) {
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function calculateRmax() {
  const Dt = parseFloat(document.getElementById('dt').value);
  const Dr = parseFloat(document.getElementById('dr').value);
  const Pt = parseFloat(document.getElementById('pt').value) * 1000; // Convert kW to W
  const freqMHz = parseFloat(document.getElementById('freq').value);
  const etaT = parseFloat(document.getElementById('etaT').value);
  const etaR = parseFloat(document.getElementById('etaR').value);
  const L = parseFloat(document.getElementById('L').value);
  const tint = parseDuration(document.getElementById('tint').value);
  const rho = parseFloat(document.getElementById('rho').value);
  const Tsys = parseFloat(document.getElementById('Tsys').value);

  if ([Dt, Dr, Pt, freqMHz, etaT, etaR, L, tint, rho, Tsys].some(v => !isFinite(v) || v <= 0)) {
    document.getElementById('resultText').textContent = 'Please enter valid positive numbers for all parameters.';
    return;
  }

  const freqHz = freqMHz * 1e6;
  const lambda = c / freqHz;
  const numerator = Math.PI * Dt * Dr;
  const insideSqrt = Pt * etaT * etaR * L * tint / (rho * kB * Tsys);
  const RmaxMeters = (numerator / (4 * lambda)) * Math.sqrt(insideSqrt);
  const parsecInMeters = 3.0856775814913673e16;
  const RmaxParsec = RmaxMeters / parsecInMeters;
  const RmaxLy = RmaxParsec * 3.26156;

  document.getElementById('resultText').innerHTML = `R<sub>max</sub> = <strong>${formatNumber(RmaxParsec, )}</strong> pc<br>R<sub>max</sub> = <strong>${formatNumber(RmaxLy, 2)}</strong> Light years<br>t<sub>int</sub> = <strong>${Math.round(tint)}</strong>`;
}


window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calculateButton').addEventListener('click', calculateRmax);
});

document.addEventListener('DOMContentLoaded', () => {
  const calculateButton = document.getElementById('calculateButton');

  calculateRmax(); // initial calculation

  calculateButton.addEventListener('click', calculateRmax);

  document
    .querySelectorAll('input, select')
    .forEach(element => {
      element.addEventListener('input', calculateRmax);
    });
});