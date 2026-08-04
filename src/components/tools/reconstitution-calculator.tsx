"use client";

import * as React from "react";
import { AlertTriangle, FlaskConical, Info, RotateCcw } from "lucide-react";
import { Syringe } from "./syringe";
import { cn } from "@/lib/utils";

const SYRINGES = [
  { ml: 0.3, units: 30 },
  { ml: 0.5, units: 50 },
  { ml: 1.0, units: 100 },
] as const;

const PEPTIDE_PRESETS = [2, 5, 10, 15, 20, 30];
const WATER_PRESETS = [1, 2, 3, 5];
const DOSE_PRESETS = [50, 100, 250, 500, 1000];

const CUSTOM = "custom" as const;

/** A preset chip row that falls back to a free-text field via "Other". */
function OptionRow({
  label,
  presets,
  value,
  onChange,
  suffix,
  step = "any",
  min = 0,
}: {
  label: string;
  presets: number[];
  value: number;
  onChange: (next: number) => void;
  suffix?: string;
  step?: string;
  min?: number;
}) {
  const isPreset = presets.includes(value);
  const [mode, setMode] = React.useState<"preset" | typeof CUSTOM>(isPreset ? "preset" : CUSTOM);
  const [draft, setDraft] = React.useState(String(value));

  return (
    <fieldset>
      <legend className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => {
              setMode("preset");
              onChange(preset);
            }}
            className={cn(
              "min-w-[3.25rem] rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-all",
              mode === "preset" && value === preset
                ? "border-frost-700 bg-frost-50 text-frost-800 ring-1 ring-frost-700"
                : "border-ink-200 bg-white text-ink-700 hover:border-ink-300 hover:bg-bone-50",
            )}
          >
            {preset}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setMode(CUSTOM);
            setDraft(String(value));
          }}
          className={cn(
            "rounded-xl border border-dashed px-3.5 py-2.5 text-sm font-semibold transition-all",
            mode === CUSTOM
              ? "border-frost-700 bg-frost-50 text-frost-800"
              : "border-ink-300 bg-white text-ink-500 hover:border-ink-400 hover:text-ink-700",
          )}
        >
          Other
        </button>
      </div>

      {mode === CUSTOM && (
        <div className="mt-2.5 flex items-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            step={step}
            min={min}
            value={draft}
            autoFocus
            onChange={(e) => {
              setDraft(e.target.value);
              const parsed = Number.parseFloat(e.target.value);
              if (Number.isFinite(parsed) && parsed > 0) onChange(parsed);
            }}
            className="form-input w-32 rounded-xl border-ink-200 text-sm font-semibold text-ink-900 focus:border-frost-600 focus:ring-frost-600"
            aria-label={`Custom ${label.toLowerCase()}`}
          />
          {suffix && <span className="text-sm text-ink-500">{suffix}</span>}
        </div>
      )}
    </fieldset>
  );
}

function ResultTile({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-bone-300 bg-white px-4 py-4 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">{label}</p>
      <p className="mt-1.5 font-display text-2xl font-semibold text-ink-950">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-ink-500">{sub}</p>}
    </div>
  );
}

export function ReconstitutionCalculator() {
  const [syringeUnits, setSyringeUnits] = React.useState<number>(100);
  const [peptideMg, setPeptideMg] = React.useState(10);
  const [waterMl, setWaterMl] = React.useState(2);
  const [doseMcg, setDoseMcg] = React.useState(250);

  const reset = () => {
    setSyringeUnits(100);
    setPeptideMg(10);
    setWaterMl(2);
    setDoseMcg(250);
  };

  const concentration = peptideMg / waterMl; // mg per ml
  const doseMg = doseMcg / 1000;
  const volumeMl = concentration > 0 ? doseMg / concentration : 0;
  const units = volumeMl * 100; // insulin syringes: 100 units == 1 ml
  const dosesPerVial = doseMcg > 0 ? (peptideMg * 1000) / doseMcg : 0;
  const mcgPerUnit = concentration * 10; // (mg/ml ÷ 100 units) × 1000 mcg

  const overCapacity = units > syringeUnits;
  const tooSmall = units > 0 && units < 2;

  const fmtUnits = units >= 10 ? units.toFixed(1) : units.toFixed(2);

  return (
    <div className="overflow-hidden rounded-3xl border border-bone-300 bg-white shadow-card">
      <div className="grid lg:grid-cols-[1.35fr_1fr]">
        {/* ── Inputs ──────────────────────────────────────── */}
        <div className="space-y-7 border-b border-bone-200 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink-950">
                Peptide reconstitution calculator
              </h2>
              <p className="mt-1.5 text-sm text-ink-600">
                Determine the exact syringe units for your target research dose.
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-2 text-xs font-semibold text-ink-600 transition-colors hover:bg-bone-50 hover:text-ink-900"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>

          <fieldset>
            <legend className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
              Select syringe
            </legend>
            <div className="grid grid-cols-3 gap-2.5">
              {SYRINGES.map((s) => (
                <button
                  key={s.units}
                  type="button"
                  onClick={() => setSyringeUnits(s.units)}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-center transition-all",
                    syringeUnits === s.units
                      ? "border-frost-700 bg-frost-50 ring-1 ring-frost-700"
                      : "border-ink-200 bg-white hover:border-ink-300 hover:bg-bone-50",
                  )}
                >
                  <span
                    className={cn(
                      "block text-sm font-bold",
                      syringeUnits === s.units ? "text-frost-800" : "text-ink-900",
                    )}
                  >
                    {s.ml.toFixed(1)} ml
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-500">{s.units} units</span>
                </button>
              ))}
            </div>
          </fieldset>

          <OptionRow
            label="Peptide amount (mg)"
            presets={PEPTIDE_PRESETS}
            value={peptideMg}
            onChange={setPeptideMg}
            suffix="mg"
            step="0.1"
          />

          <div>
            <OptionRow
              label="Bacteriostatic water (ml)"
              presets={WATER_PRESETS}
              value={waterMl}
              onChange={setWaterMl}
              suffix="ml"
              step="0.1"
            />
            <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-bone-100 px-3 py-2 text-xs text-ink-600">
              Concentration:{" "}
              <span className="font-bold text-ink-950">{concentration.toFixed(2)} mg/ml</span>
            </p>
          </div>

          <OptionRow
            label="Target dose (mcg)"
            presets={DOSE_PRESETS}
            value={doseMcg}
            onChange={setDoseMcg}
            suffix="mcg"
            step="1"
          />
        </div>

        {/* ── Live readout ────────────────────────────────── */}
        <div className="bg-bone-50 p-6 sm:p-8">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500">
            Pull syringe to
          </p>
          <p
            className={cn(
              "mt-1 text-center font-display text-6xl font-semibold leading-none",
              overCapacity ? "text-red-700" : "text-ink-950",
            )}
          >
            {fmtUnits}
          </p>
          <p className="mt-2 text-center text-sm text-ink-600">
            units ({volumeMl.toFixed(3)} ml)
          </p>

          <div className="mx-auto mt-5 h-[300px] w-full max-w-[220px] sm:h-[340px]">
            <Syringe units={units} maxUnits={syringeUnits} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <ResultTile
              value={concentration.toFixed(2)}
              label="Concentration"
              sub="mg/ml"
            />
            <ResultTile
              value={dosesPerVial >= 100 ? Math.floor(dosesPerVial).toString() : dosesPerVial.toFixed(1)}
              label="Per vial"
              sub="doses"
            />
            <ResultTile value={mcgPerUnit.toFixed(1)} label="Per unit" sub="mcg" />
            <ResultTile value={`${doseMcg}`} label="Target dose" sub="mcg" />
          </div>

          {overCapacity && (
            <p className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs leading-relaxed text-red-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>
                This volume needs <strong>{fmtUnits} units</strong> but the selected syringe holds
                only {syringeUnits}. Use a larger syringe, or reconstitute with less bacteriostatic
                water to raise the concentration.
              </span>
            </p>
          )}

          {tooSmall && !overCapacity && (
            <p className="mt-4 flex items-start gap-2 rounded-xl border border-bone-400 bg-bone-100 px-3.5 py-3 text-xs leading-relaxed text-ink-700">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-bone-700" />
              <span>
                Under 2 units is difficult to measure accurately. Adding more bacteriostatic water
                lowers the concentration and gives you a larger, more readable draw.
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-2.5 border-t border-bone-200 bg-white px-6 py-4 sm:px-8">
        <FlaskConical className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-400" aria-hidden />
        <p className="text-xs leading-relaxed text-ink-600">
          For research purposes only. Not intended for human or animal use. This calculator is a
          laboratory convenience tool — always verify measurements independently against your own
          protocol.
        </p>
      </div>
    </div>
  );
}
