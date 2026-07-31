const kB = 1.380649e-23;
const c = 299792458;

function formatNumber(value) {
  return value.toLocaleString('ru-RU', { maximumFractionDigits: 6, minimumFractionDigits: 3 });
}

function calculateRmax() {
  const Dt = parseFloat(document.getElementById('dt').value);
  const Dr = parseFloat(document.getElementById('dr').value);
  const Pt = parseFloat(document.getElementById('pt').value);
  const freqMHz = parseFloat(document.getElementById('freq').value);
  const etaT = parseFloat(document.getElementById('etaT').value);
  const etaR = parseFloat(document.getElementById('etaR').value);
  const L = parseFloat(document.getElementById('L').value);
  const tint = parseFloat(document.getElementById('tint').value);
  const rho = parseFloat(document.getElementById('rho').value);
  const Tsys = parseFloat(document.getElementById('Tsys').value);

  if ([Dt, Dr, Pt, freqMHz, etaT, etaR, L, tint, rho, Tsys].some(v => !isFinite(v) || v <= 0)) {
    document.getElementById('resultText').textContent = 'Пожалуйста, введите положительные числовые значения для всех параметров.';
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

  document.getElementById('resultText').innerHTML = `R<sub>max</sub> = <strong>${formatNumber(RmaxParsec)}</strong> pc<br>R<sub>max</sub> = <strong>${formatNumber(RmaxLy)}</strong> свет.лет<br>λ = <strong>${formatNumber(lambda)}</strong> м`;
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calculateButton').addEventListener('click', calculateRmax);
});
