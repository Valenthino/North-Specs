(() => {
  'use strict';

  const root = document.querySelector('[data-reconstitution-calculator]');
  if (!root) return;

  const peptide = root.querySelector('[data-calc-peptide]');
  const water = root.querySelector('[data-calc-water]');
  const dose = root.querySelector('[data-calc-dose]');
  const syringeOptions = [...root.querySelectorAll('input[name="syringe"]')];
  const resultUnits = root.querySelector('[data-result-units]');
  const resultVolume = root.querySelector('[data-result-volume]');
  const resultConcentration = root.querySelector('[data-result-concentration]');
  const resultPerUnit = root.querySelector('[data-result-per-unit]');
  const resultDoses = root.querySelector('[data-result-doses]');
  const resultCapacity = root.querySelector('[data-result-capacity]');
  const warning = root.querySelector('[data-calc-warning]');
  const liquid = root.querySelector('[data-syringe-liquid]');
  const seal = root.querySelector('[data-syringe-seal]');
  const marker = root.querySelector('[data-syringe-marker]');
  const markerLabel = root.querySelector('[data-syringe-label]');
  const ticks = root.querySelector('[data-syringe-ticks]');
  const syringeSvg = root.querySelector('[data-syringe]');

  const TOP = 83;
  const HEIGHT = 308;

  const selectedCapacity = () => Number(syringeOptions.find((input) => input.checked)?.value || 100);
  const numberValue = (input) => Math.max(0, Number.parseFloat(input.value) || 0);
  const unitFormat = (value) => value >= 10 ? value.toFixed(1) : value.toFixed(2);

  const drawTicks = (capacity) => {
    ticks.replaceChildren();
    for (let i = 0; i <= 20; i += 1) {
      const value = (i * capacity) / 20;
      const y = TOP + (value / capacity) * HEIGHT;
      const major = i % 4 === 0;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', major ? '107' : '116');
      line.setAttribute('x2', '128');
      line.setAttribute('y1', String(y));
      line.setAttribute('y2', String(y));
      line.setAttribute('stroke', '#405046');
      line.setAttribute('stroke-opacity', major ? '.72' : '.35');
      line.setAttribute('stroke-width', major ? '1.5' : '1');
      ticks.append(line);
      if (major) {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', '138');
        label.setAttribute('y', String(y + 4));
        label.setAttribute('fill', '#4b5a4c');
        label.setAttribute('font-size', '11');
        label.setAttribute('font-weight', '600');
        label.textContent = Number.isInteger(value) ? String(value) : value.toFixed(1);
        ticks.append(label);
      }
    }
  };

  const calculate = () => {
    const peptideMg = numberValue(peptide);
    const waterMl = numberValue(water);
    const doseMcg = numberValue(dose);
    const capacity = selectedCapacity();
    const concentration = waterMl > 0 ? peptideMg / waterMl : 0;
    const volumeMl = concentration > 0 ? (doseMcg / 1000) / concentration : 0;
    const units = volumeMl * 100;
    const doses = doseMcg > 0 ? (peptideMg * 1000) / doseMcg : 0;
    const perUnit = concentration * 10;
    const clamped = Math.max(0, Math.min(units, capacity));
    const fraction = capacity > 0 ? clamped / capacity : 0;
    const offset = fraction * HEIGHT;

    resultUnits.textContent = unitFormat(units);
    resultVolume.textContent = volumeMl.toFixed(3);
    resultConcentration.textContent = concentration.toFixed(2);
    resultPerUnit.textContent = perUnit.toFixed(1);
    resultDoses.textContent = doses >= 100 ? String(Math.floor(doses)) : doses.toFixed(1);
    resultCapacity.textContent = String(capacity);
    markerLabel.textContent = unitFormat(clamped);

    liquid.style.transformOrigin = `71px ${TOP}px`;
    liquid.style.transform = `scaleY(${fraction})`;
    seal.style.transform = `translateY(${offset}px)`;
    marker.style.transform = `translateY(${offset}px)`;
    syringeSvg.setAttribute('aria-label', `Syringe calculated at ${unitFormat(units)} units of ${capacity}`);

    if (units > capacity) {
      warning.hidden = false;
      warning.className = 'nsl-calc-warning is-error';
      warning.textContent = `The result is ${unitFormat(units)} units, exceeding the selected ${capacity}-unit syringe. Recheck the protocol inputs and equipment selection.`;
    } else if (units > 0 && units < 2) {
      warning.hidden = false;
      warning.className = 'nsl-calc-warning is-caution';
      warning.textContent = `The calculated mark is below 2 units. Verify that the selected equipment can measure this volume with the precision required by the laboratory procedure.`;
    } else {
      warning.hidden = true;
      warning.textContent = '';
    }
  };

  root.querySelectorAll('.nsl-preset-row').forEach((row) => {
    const target = document.getElementById(row.dataset.target);
    row.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        target.value = button.dataset.value;
        calculate();
      });
    });
  });

  [peptide, water, dose, ...syringeOptions].forEach((input) => input.addEventListener('input', () => {
    if (input.name === 'syringe') drawTicks(selectedCapacity());
    calculate();
  }));

  root.querySelector('[data-calc-reset]').addEventListener('click', () => {
    peptide.value = '10';
    water.value = '2';
    dose.value = '250';
    syringeOptions.forEach((input) => { input.checked = input.value === '100'; });
    drawTicks(100);
    calculate();
  });

  drawTicks(selectedCapacity());
  calculate();
})();
