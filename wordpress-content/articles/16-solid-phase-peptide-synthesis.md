---
title: "How Research Peptides Are Made: Solid-Phase Synthesis, Purification and Cost"
slug: "solid-phase-peptide-synthesis-purification-cost"
excerpt: "Understanding how a peptide is built explains why some sequences cost ten times more than others at the same purity, and where the impurities in your vial come from."
category: "Methodology"
topic: "methodology"
reading_minutes: 8
---

Almost every research peptide in routine use is made by solid-phase peptide synthesis. Knowing roughly how the process works is practically useful, because the failure modes of the synthesis are exactly the impurities that show up in the vial, and the difficulty of the synthesis is what determines the price.

> All products supplied by North Specs Labs are Research Use Only and are not for human or veterinary use.

## The core idea

Before solid-phase methods, peptides were assembled in solution, which required isolating and purifying the growing chain after every step. Yields collapsed as chains lengthened.

The solid-phase approach anchors the growing chain to an insoluble resin bead. Reagents are added in solution, react with the anchored chain, and are then simply washed away. No isolation step is needed between residues. This is what made peptides of useful length practical to produce, and it is why the method won a Nobel Prize.

## The cycle

Synthesis proceeds from the C-terminus toward the N-terminus, the opposite direction to biological translation. Each residue is added by a repeating cycle.

1. **Deprotection.** The temporary protecting group on the N-terminus of the anchored chain is removed, exposing a free amine.
2. **Washing.** Reagents and by-products are washed from the resin.
3. **Coupling.** The next amino acid, with its own N-terminus protected and its side chain protected, is activated by a coupling reagent and reacts with the free amine to form the new peptide bond.
4. **Washing.** Excess reagent is washed away.

The cycle repeats for every residue. When the sequence is complete, a cleavage step releases the peptide from the resin and removes the side-chain protecting groups simultaneously.

## Fmoc and Boc

Two protecting-group strategies dominate, distinguished by the temporary N-terminal group.

**Boc chemistry** uses tert-butyloxycarbonyl, removed with trifluoroacetic acid at each cycle, with final cleavage requiring hydrogen fluoride. It handles certain difficult sequences well but requires specialised equipment for HF handling.

**Fmoc chemistry** uses fluorenylmethyloxycarbonyl, removed under mild basic conditions with piperidine, with final cleavage by TFA. It avoids HF entirely, is more readily automated, and is the standard for most routine synthesis today.

The choice matters to the end user mainly through the impurity profile, since the two strategies fail in somewhat different ways.

## Why yield compounds

This is the central arithmetic of the field. Coupling efficiency is high but not perfect. Suppose each coupling proceeds at 99 percent.

For a 10-residue peptide, overall yield of full-length product is 0.99 to the ninth power, roughly 91 percent. For a 30-residue peptide, 0.99 to the twenty-ninth, roughly 75 percent. For a 50-residue peptide, roughly 61 percent.

At 98 percent coupling efficiency, a 50-residue synthesis yields about 37 percent full-length product. The remainder is deletion sequences.

Two consequences follow. Longer peptides are disproportionately more expensive, because more material must be made and more must be discarded at purification. And longer peptides carry a heavier burden of closely related impurities, which are harder to separate precisely because they differ from the target by a single residue.

## What makes a sequence difficult

Length is not the only driver of cost.

**Aggregation during synthesis.** Some sequences form secondary structure on the resin, burying the reactive amine and slowing coupling. Hydrophobic stretches and beta-sheet-prone sequences are the usual culprits. This is the main reason two peptides of identical length can differ greatly in difficulty.

**Sterically hindered residues.** Bulky residues such as valine, isoleucine and threonine couple more slowly, particularly consecutively.

**Proline.** Proline's ring structure affects both coupling and the conformation of the growing chain, and proline-rich sequences are known to be awkward.

**Aspartimide formation.** Asp-Gly and related sequences are prone to a side reaction under the basic conditions of Fmoc deprotection, forming a cyclic intermediate that opens to give both the desired product and an isomer.

**Cysteine and disulfides.** Peptides requiring specific disulfide pairings need controlled oxidation after assembly, and incorrect pairing gives a product of correct mass and wrong structure.

**Cyclisation.** Head-to-tail or side-chain cyclisation adds steps and can proceed intermolecularly rather than intramolecularly, giving dimers.

**Modifications.** Acylation, PEGylation, phosphorylation and labelling each add steps, and incomplete modification produces a mixture of modified and unmodified peptide.

## Purification

Crude peptide from cleavage is a mixture. Purification is almost always reverse-phase HPLC, separating on hydrophobicity using a water-acetonitrile gradient with trifluoroacetic acid as ion-pairing agent.

Two points matter downstream. Separating a deletion sequence from full-length product is hard precisely because they are chemically similar, so achieving very high purity on a long peptide means discarding a lot of near-miss material, which is where much of the cost sits. And the TFA used in purification remains as counter-ion in the final product, with the biological consequences discussed elsewhere.

After purification the product is lyophilised, giving the fluffy solid or film in the vial.

## Characterisation

Two analyses are standard.

**Analytical HPLC** on the purified product gives the purity figure, as percentage of integrated peak area under stated conditions.

**Mass spectrometry** confirms identity by molecular weight, and detects mass-shifted species: plus 16 for oxidation, plus 1 for deamidation, minus the mass of a residue for a deletion, minus 18 for cyclisation.

Neither detects everything. Co-eluting species hide within the main HPLC peak. Disulfide scrambling and racemisation produce no mass change. This is why a certificate reporting method and conditions is more informative than a bare number.

## Reading a price

Understanding the above makes catalogue pricing legible. A short, unhindered, unmodified sequence at high purity is inexpensive because the synthesis is efficient and purification straightforward. A long, aggregation-prone, acylated or cyclised sequence at the same stated purity is expensive because more material is made, more is discarded, and more analysis is required to confirm what remains.

A long modified peptide offered at a price comparable to a short simple one is worth a question about which corner was cut, and the certificate of analysis is where the answer should be visible.

---

*North Specs Labs supplies research-grade peptides to qualified researchers, laboratories and research institutions. All products are Research Use Only and are not for human consumption or veterinary use.*
