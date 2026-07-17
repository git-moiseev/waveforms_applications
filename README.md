# Application of Hierarchical Waveforms to Interstellar Beacons

## Overview

This repository accompanies the paper:

> **Application of Hierarchical Waveforms to Interstellar Beacons**

The paper investigates whether the hierarchical two-frequency waveform introduced in the companion work

> **Waveform Design for Computationally Efficient Blind Acquisition**

is suitable for long-range interstellar communication.

Rather than proposing a new detection algorithm, this work evaluates the waveform under realistic astrophysical conditions, including Doppler motion, interstellar propagation, scintillation, receiver uncertainty, and practical beacon design constraints.

---

## Motivation

Most interstellar beacon concepts focus primarily on minimizing transmitter energy or maximizing received signal power.

This work considers a different optimization objective:

> **Minimize the computational cost required for an unknown receiver to discover and recognize an artificial signal.**

The underlying assumption is that an extraterrestrial receiver has no prior knowledge of

* the modulation,
* the protocol,
* the packet format,
* the transmission schedule,
* or even the existence of the beacon.

The beacon should therefore reveal its own structure as efficiently as possible.

---

## Companion Paper

This paper builds upon the theoretical framework developed in

**Waveform Design for Computationally Efficient Blind Acquisition**

where the hierarchical two-frequency waveform and the blind acquisition strategy are introduced.

The present work addresses a different question:

> **Does this waveform remain effective after propagation through the interstellar medium?**

---

## Topics Covered

The paper investigates:

* microwave frequency selection;
* Doppler effects caused by relative motion;
* interstellar plasma dispersion;
* multipath scattering;
* interstellar scintillation;
* robustness of hierarchical frequency geometry;
* practical beacon protocol design;
* repeated transmissions and long-term detectability;
* computational implications for an unknown receiver.

---

## Scope

The analysis concentrates on relatively nearby Galactic targets (approximately 1000 light-years), where interstellar propagation effects are well understood and can be quantified using established astrophysical models.

The objective is not to optimize transmitter power, but to determine whether the proposed waveform preserves its computational advantages after realistic propagation.

---

## Main Result

The analysis indicates that, for microwave carrier frequencies and practical frequency-state separations,

* interstellar propagation significantly affects received amplitude and phase,
* but does not destroy the underlying two-frequency geometry of the waveform.

Consequently, the hierarchical blind-acquisition strategy developed in the companion paper remains applicable under typical interstellar propagation conditions.

The dominant limitation is expected to be reduced detection sensitivity due to scintillation rather than corruption of the transmitted waveform.

---

## Repository Structure

```
1. Introduction
2. Interstellar Communication Requirements
3. Microwave Transmission Window
4. Doppler Environment
5. Propagation Through the Interstellar Medium
6. Robustness of Hierarchical Waveforms
7. Beacon Protocol Design
8. Detection Strategy
9. Discussion
10. Conclusions
```

---

## Intended Audience

This work may be of interest to researchers in

* SETI,
* radio astronomy,
* signal processing,
* digital communications,
* detection theory,
* space communications.

---

## Status

Work in progress.

Comments, corrections, alternative analyses, and critical review are welcome.
