# Waveform Applications

This repository accompanies the study of practical applications of a computationally efficient narrowband waveform originally developed for blind signal acquisition.

The primary focus is long-range radio communication under conditions where the receiver has **no prior knowledge** of the transmitted waveform, timing, or protocol. The repository combines theoretical analysis with an interactive communication-range calculator.

---

## Repository Contents

### 1. Communication Range from Transmitter and Receiver Parameters

Derives the communication-range equation for blind noncoherent signal acquisition.

Topics include:

- Friis transmission equation
- antenna gain and effective aperture
- receiver system temperature
- detector bandwidth
- noncoherent integration
- acquisition threshold
- communication-range scaling laws
- comparison with conventional SETI range calculators

---

### 2. Communication Range Parameter Table

Provides communication-range estimates for representative combinations of

- transmitter power,
- antenna diameter,
- receiver system temperature,
- integration time.

The tables are calculated using the noncoherent acquisition model and are intended as quick engineering reference values.

---

### 3. Propagation Through a Dispersive and Scintillating Channel

Discusses propagation effects that influence narrowband interstellar communication, including

- plasma dispersion,
- Doppler shift,
- scintillation,
- coherence bandwidth,
- coherence time,
- practical propagation losses.

The objective is to estimate how interstellar propagation modifies the ideal communication range.

---

## Interactive Communication Range Calculator

The repository includes a browser-based calculator that implements the same mathematical model used throughout the documentation.

Features include:

- interactive parameter adjustment;
- blind noncoherent detection model;
- real-time communication-range calculation;
- logarithmic sliders for wide dynamic ranges;
- detector bandwidth and integration-time modelling;
- visualization of transmitter power.

Open:

```
index.html
```

in any modern web browser.

---

## Repository Structure

```text
.
├── 1. Communication Range from Transmitter and Receiver Parameters.md
├── 2. Communication Range Parameter Table.md
├── 3. Propagation Through a Dispersive and Scintillating Channel.md
├── index.html
├── calc
│   ├── calculator.js
│   ├── style.css
│   └── bg.png
├── LICENSE
└── README.md
```

---

## Mathematical Model

The communication-range calculator is based on blind **noncoherent energy detection**.

The maximum detection range is

```math
R_{\max}=
\frac{\pi D_tD_r}{4\lambda}
\sqrt{
\frac{P_t\eta_t\eta_rL}
{\rho_{\mathrm{acq}}k_{\mathrm B}T_{\mathrm{sys}}}
}
\left(
\frac{t_{\mathrm{int}}}{B}
\right)^{1/4}
```

where

- $D_t,D_r$ — transmitter and receiver antenna diameters;
- $P_t$ — transmitter power;
- $T_{\mathrm{sys}}$ — receiver system temperature;
- $B$ — detector bandwidth;
- $t_{\mathrm{int}}$ — noncoherent integration time;
- $\rho_{\mathrm{acq}}$ — acquisition threshold.

---

## Assumptions

Unless stated otherwise, the calculations assume

- free-space propagation;
- operation near the neutral hydrogen line (1420.405751 MHz);
- blind noncoherent acquisition;
- stationary Gaussian receiver noise;
- ideal antenna pointing.

Propagation losses beyond free space are discussed separately in the propagation chapter.

---

## Intended Audience

This repository may be useful for researchers and engineers working in

- SETI;
- radio astronomy;
- deep-space communications;
- detection theory;
- microwave engineering;
- phased-array systems;
- weak-signal detection.

---

## Status

The repository is under active development.

Future work includes

- additional propagation models;
- computational complexity analysis;
- receiver architecture comparisons;
- waveform optimization;
- additional interactive tools.

Contributions, comments, and technical discussions are welcome.
