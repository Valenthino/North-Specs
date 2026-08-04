---
title: "Why Your Peptide Assay Disagrees: Purity, Counter-Ions and Reproducibility"
slug: "peptide-assay-reproducibility-purity-counterions"
excerpt: "Most irreproducible peptide results are not biology. They are material. A practical guide to the variables that make the same nominal compound behave differently between batches and between laboratories."
category: "Methodology"
topic: "methodology"
reading_minutes: 9
---

When a peptide experiment fails to replicate, the usual first suspects are protocol differences and biological variability. Frequently the real cause is simpler: the two experiments did not use the same material, even though both vials carried the same name.

This is not a marginal problem. Peptide identity and purity are experimental variables, and treating them as constants is one of the more common sources of wasted effort in this field.

> All products supplied by North Specs Labs are Research Use Only and are not for human or veterinary use.

## What "95% pure" does not tell you

A purity figure is a statement about one analytical method under one set of conditions. Typically it means the target peptide accounted for that percentage of integrated peak area by HPLC at a stated wavelength.

Several things follow that are easy to miss.

**The remaining percentage is not inert filler.** It consists of synthesis-related species that are chemically similar to the target, which is exactly why they co-purify. Similar molecules can have biological activity, including antagonist activity at the same receptor.

**Peak area is not mass.** Detection at 214 or 280 nanometres responds to specific bonds and residues. A species lacking the chromophore is under-represented; one with more aromatic residues is over-represented. Percentage by peak area and percentage by mass are different numbers.

**HPLC does not see everything.** Species that co-elute with the target appear within the main peak. Non-peptide content, including water, salts and counter-ions, is generally not captured by the purity figure at all.

**Peptide content is a separate measurement.** Net peptide content, the fraction of the vial mass that is actually peptide rather than water and salt, is commonly between 70 and 90 percent for a lyophilised research peptide. If you weigh out material assuming it is pure peptide, your actual concentration may be 20 to 30 percent below your nominal concentration. This alone accounts for a great deal of apparent inter-laboratory variability in dose-response work.

## Counter-ions: the most under-appreciated variable

Most peptides are purified by reverse-phase HPLC using trifluoroacetic acid as an ion-pairing agent. TFA remains associated with basic residues in the final product as the counter-ion.

Trifluoroacetate is not biologically neutral. It is cytotoxic in some cell systems at concentrations that occur in poorly desalted material. It can affect cell proliferation and viability assays directly, and it can interfere with assays sensitive to pH or ionic conditions.

The practical consequences:

- A peptide with many basic residues carries proportionally more counter-ion.
- A concentration-dependent effect in a cell assay that appears at higher concentrations may be the counter-ion, not the peptide.
- Two batches with the same stated purity but different residual TFA can give different results in the same assay.
- Acetate salt exchange is available and is worth requesting for cell-based work where this matters.

If a cell viability curve shows an unexplained drop at the top of the concentration range, counter-ion content should be checked before the result is interpreted as a biphasic response.

## Degradation pathways worth knowing

**Oxidation.** Methionine, cysteine and tryptophan are susceptible. Methionine oxidation adds 16 daltons and is readily visible by mass spectrometry. Oxidised peptide can have reduced or altered activity. Light, air and prolonged storage in solution all accelerate it.

**Deamidation.** Asparagine and glutamine deamidate, particularly at higher pH, converting to aspartate and glutamate. This changes charge, which changes receptor interaction. Asn-Gly sequences are especially prone.

**Aggregation.** Hydrophobic sequences aggregate, and aggregates are pharmacologically distinct from monomer. Shaking during reconstitution promotes it, which is why gentle swirling is the standard instruction rather than a nicety.

**Disulfide scrambling.** Peptides with more than one cysteine can form incorrect disulfide pairings, giving a molecule of correct mass and incorrect structure. Mass spectrometry alone will not detect this.

**Adsorption.** Peptides adsorb to plastic and glass surfaces. At low concentrations, a meaningful fraction can be lost to tube walls, so the concentration in solution is below the nominal value. Low-binding tubes and carrier protein where compatible both mitigate this.

## Synthesis-related impurities

**Deletion sequences** arise from incomplete coupling, giving peptides missing one or more residues. They are structurally similar and can retain partial activity, which shifts a dose-response curve without producing an obviously anomalous result.

**Truncated sequences** from premature chain termination.

**Protecting-group residues** from incomplete deprotection.

**Racemisation** at susceptible residues during synthesis, producing diastereomers with different activity.

**Incomplete modification** where the peptide is acylated, cyclised or otherwise modified. A partially acylated preparation is a mixture of two pharmacologically distinct species, and for compounds where the modification confers the key property this is a substantial problem.

## What to record and what to ask for

For work that needs to be reproducible, record the supplier, the batch number, the stated purity with the analytical method, the net peptide content, the counter-ion, and the reconstitution date and diluent.

From the certificate of analysis, the useful contents are: the batch identifier matching the vial, the analytical method and conditions, the HPLC purity result with the chromatogram if available, mass spectrometry confirming the expected mass, net peptide content, counter-ion identity and residual content, and the testing party and date.

A purity claim without a batch number and a method is not a specification. It is marketing.

## Designing around the problem

**Use one batch for a study.** Where a dose-response relationship or a between-condition comparison is the measurement, running it within a single batch removes material variation as a confounder. If a study must span batches, note the change and consider bridging with an overlapping condition.

**Quantify rather than assume.** Amino acid analysis or quantitative UV where the sequence has a suitable chromophore gives actual peptide concentration rather than nominal.

**Include the counter-ion control.** In cell-based work, a matched vehicle containing the counter-ion at the equivalent concentration separates peptide effect from salt effect.

**Test endotoxin for immunological work.** Endotoxin activates the pathways such assays measure and produces artefacts indistinguishable from real effects without a polymyxin B control.

**Aliquot immediately.** Freeze-thaw cycles degrade material. Single-use aliquots prepared at reconstitution remove that variable entirely.

**Report material properly.** Publications that state supplier, batch and purity allow others to replicate. Those that state only the compound name do not, and a substantial share of the reproducibility difficulty in this field traces to that omission.

---

*North Specs Labs supplies research-grade peptides to qualified researchers, laboratories and research institutions. All products are Research Use Only and are not for human consumption or veterinary use.*
