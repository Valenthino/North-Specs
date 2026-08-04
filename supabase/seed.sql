-- ============================================================================
-- North Specs Labs — Seed data (Research Use Only catalogue)
-- Safe to re-run: uses ON CONFLICT (slug) DO NOTHING.
-- Prices are in CAD cents.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
insert into public.categories (name, slug, short_description, description, icon, display_order) values
  ('Metabolic Research', 'metabolic-research',
   'Incretin and metabolic-signalling peptides for research.',
   'GLP-1, GIP and related incretin analogues studied for metabolic and endocrine signalling pathways. Supplied strictly for in-vitro and laboratory research.',
   'activity', 1),
  ('Growth Hormone Secretagogues', 'growth-hormone-secretagogues',
   'GHRH analogues and growth-hormone releasing peptides.',
   'Secretagogue peptides investigated for their action on the somatotropic axis. For laboratory research use only.',
   'trending-up', 2),
  ('Tissue Repair & Recovery', 'tissue-repair-recovery',
   'Peptides studied in tissue, connective and cellular repair models.',
   'Compounds frequently referenced in regenerative and cytoprotective research models. Research use only.',
   'heart-pulse', 3),
  ('Longevity & Cellular Health', 'longevity-cellular-health',
   'Bioregulators and mitochondrial-signalling peptides.',
   'Peptides investigated in cellular ageing, telomere and mitochondrial research. Not for human or veterinary use.',
   'infinity', 4),
  ('Neuro & Cognitive', 'neuro-cognitive',
   'Neuropeptides studied in cognition and neuroprotection.',
   'Nootropic and neuroprotective peptides used in behavioural and neurological research models.',
   'brain', 5),
  ('Bioregulation & Signalling', 'bioregulation-signalling',
   'Melanocortin, kisspeptin and signalling peptides.',
   'Signalling peptides studied across endocrine and receptor-pharmacology research. Research use only.',
   'atom', 6)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
insert into public.products
  (name, slug, subtitle, category_id, cas_number, molecular_formula, molecular_weight,
   sequence, purity, appearance, form, storage, reconstitution, research_areas,
   description, is_featured, is_active)
select v.name, v.slug, v.subtitle,
  (select id from public.categories c where c.slug = v.category_slug),
  v.cas_number, v.molecular_formula, v.molecular_weight, v.sequence, v.purity,
  v.appearance, v.form, v.storage, v.reconstitution, v.research_areas,
  v.description, v.is_featured, true
from (values
  ('Semaglutide', 'semaglutide', 'GLP-1 receptor agonist', 'metabolic-research',
   '910463-68-2', 'C187H291N45O59', 4113.58,
   'HAEGTFTSDVSSYLEGQAAKEFIAWLVRGRG (modified)', '≥99%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C, protect from light.',
   'Reconstitute with bacteriostatic or sterile water; keep refrigerated after reconstitution.',
   array['Metabolic signalling','Endocrinology','Incretin research'],
   'Semaglutide is a long-acting GLP-1 receptor agonist widely referenced in metabolic and incretin-signalling research. Supplied as a lyophilized powder for laboratory research applications only.', true),
  ('Tirzepatide', 'tirzepatide', 'Dual GIP/GLP-1 receptor agonist', 'metabolic-research',
   '2023788-19-2', 'C225H348N48O68', 4813.53,
   'YXEGTFTSDYSIXLDKIAQKAFVQWLIAGGPSSGAPPPS (modified)', '≥99%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C, protect from light.',
   'Reconstitute with bacteriostatic or sterile water; keep refrigerated after reconstitution.',
   array['Metabolic signalling','Dual incretin research','Endocrinology'],
   'Tirzepatide is a dual GIP and GLP-1 receptor agonist studied extensively in incretin-pathway research. For in-vitro / laboratory research use only.', true),
  ('Retatrutide', 'retatrutide', 'Triple GIP/GLP-1/glucagon agonist', 'metabolic-research',
   '2381089-83-2', 'C221H346N46O66', 4731.30,
   'Multi-agonist analogue', '≥99%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C, protect from light.',
   'Reconstitute with bacteriostatic or sterile water; keep refrigerated after reconstitution.',
   array['Triple-agonist research','Metabolic signalling'],
   'Retatrutide is a triple receptor agonist (GIP/GLP-1/glucagon) referenced in advanced metabolic-signalling studies. Research use only.', true),
  ('Tesamorelin', 'tesamorelin', 'GHRH analogue', 'metabolic-research',
   '218949-48-5', 'C221H366N72O67S', 5135.87,
   'YAEGTFTSDYSKYLDKMHTHTHTHTHTH', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic water; refrigerate after reconstitution.',
   array['Somatotropic axis','Lipid metabolism research'],
   'Tesamorelin is a stabilised GHRH analogue used in endocrine and metabolic research models. Research use only.', false),
  ('AOD-9604', 'aod-9604', 'hGH fragment 176-191', 'metabolic-research',
   '221231-10-3', 'C78H123N23O23S2', 1815.08,
   'YLRIVQCRSVEGSCGF', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic or sterile water.',
   array['Lipid metabolism research','hGH fragment studies'],
   'AOD-9604 is a modified fragment of human growth hormone (176-191) studied in lipid-metabolism research. Research use only.', false),
  ('MOTS-c', 'mots-c', 'Mitochondrial-derived peptide', 'longevity-cellular-health',
   '1627580-64-6', 'C101H152N28O23S2', 2174.55,
   'MRWQEMGYIFYPRKLR', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic or sterile water.',
   array['Mitochondrial research','Cellular metabolism'],
   'MOTS-c is a mitochondrial-derived peptide investigated in metabolic and cellular-stress research. Research use only.', true),
  ('CJC-1295 with DAC', 'cjc-1295-dac', 'Long-acting GHRH analogue', 'growth-hormone-secretagogues',
   '863288-34-0', 'C165H269N47O46', 3647.19,
   'Modified GRF (1-29) with DAC', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic water; refrigerate after reconstitution.',
   array['Somatotropic axis','GHRH research'],
   'CJC-1295 with DAC is a long-acting GHRH analogue used in somatotropic-axis research. Research use only.', false),
  ('Ipamorelin', 'ipamorelin', 'Selective GH secretagogue', 'growth-hormone-secretagogues',
   '170851-70-4', 'C38H49N9O5', 711.85,
   'Aib-His-D-2-Nal-D-Phe-Lys-NH2', '≥99%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic or sterile water.',
   array['GH secretagogue research','Ghrelin-receptor studies'],
   'Ipamorelin is a selective growth-hormone secretagogue and ghrelin-receptor agonist referenced in endocrine research. Research use only.', true),
  ('Sermorelin', 'sermorelin', 'GHRH (1-29)', 'growth-hormone-secretagogues',
   '86168-78-7', 'C149H246N44O42S', 3357.93,
   'GRF (1-29)', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic water; refrigerate after reconstitution.',
   array['Somatotropic axis','GHRH research'],
   'Sermorelin is a GHRH (1-29) analogue widely used in somatotropic-axis research models. Research use only.', false),
  ('Hexarelin', 'hexarelin', 'GH-releasing hexapeptide', 'growth-hormone-secretagogues',
   '140703-51-1', 'C47H58N12O6', 887.02,
   'His-D-2-methyl-Trp-Ala-Trp-D-Phe-Lys-NH2', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic or sterile water.',
   array['GH secretagogue research'],
   'Hexarelin is a synthetic growth-hormone releasing hexapeptide used in secretagogue research. Research use only.', false),
  ('BPC-157', 'bpc-157', 'Body Protection Compound', 'tissue-repair-recovery',
   '137525-51-0', 'C62H98N16O22', 1419.53,
   'GEPPPGKPADDAGLV', '≥99%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic or sterile water.',
   array['Cytoprotection research','Connective-tissue models','Gastrointestinal research'],
   'BPC-157 is a synthetic pentadecapeptide referenced extensively in cytoprotective and tissue-repair research models. Research use only.', true),
  ('TB-500', 'tb-500', 'Thymosin Beta-4 fragment', 'tissue-repair-recovery',
   '77591-33-4', 'C212H350N56O78S', 4963.44,
   'Ac-SDKP (active region of Thymosin β4)', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic or sterile water.',
   array['Actin-regulation research','Tissue-repair models'],
   'TB-500 corresponds to the active region of Thymosin Beta-4 and is studied in actin-regulation and tissue-repair research. Research use only.', true),
  ('GHK-Cu', 'ghk-cu', 'Copper tripeptide-1', 'tissue-repair-recovery',
   '89030-95-5', 'C14H24N6O4Cu', 403.94,
   'Gly-His-Lys : Cu(II)', '≥99%',
   'Blue lyophilized powder', 'Lyophilized powder', 'Store lyophilized at -20°C, protect from light.',
   'Reconstitute with sterile water.',
   array['Dermatological research','Copper-peptide studies'],
   'GHK-Cu is a copper-binding tripeptide widely referenced in skin, collagen and copper-peptide research. Research use only.', false),
  ('Epithalon', 'epithalon', 'Telomerase-research tetrapeptide', 'longevity-cellular-health',
   '307297-39-8', 'C14H22N4O9', 390.35,
   'Ala-Glu-Asp-Gly', '≥99%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic or sterile water.',
   array['Telomere research','Pineal bioregulation'],
   'Epithalon (Epitalon) is a synthetic tetrapeptide studied in telomere and cellular-ageing research. Research use only.', true),
  ('Thymosin Alpha-1', 'thymosin-alpha-1', 'Immunomodulatory peptide', 'longevity-cellular-health',
   '62304-98-7', 'C129H215N33O55', 3108.30,
   'Ac-SDAAVDTSSEITTKDLKEKKEVVEEAEN', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic or sterile water.',
   array['Immunology research','Cellular signalling'],
   'Thymosin Alpha-1 is a 28-amino-acid peptide studied in immunomodulation research. Research use only.', false),
  ('Semax', 'semax', 'ACTH(4-10) analogue nootropic', 'neuro-cognitive',
   '80714-61-0', 'C37H51N9O10S', 813.92,
   'Met-Glu-His-Phe-Pro-Gly-Pro', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with sterile or bacteriostatic water.',
   array['Neuroprotection research','Cognition models'],
   'Semax is a synthetic ACTH(4-10) analogue used in neuroprotection and cognition research. Research use only.', false),
  ('Selank', 'selank', 'Tuftsin-analogue anxiolytic peptide', 'neuro-cognitive',
   '129954-34-3', 'C33H57N11O9', 751.90,
   'Thr-Lys-Pro-Arg-Pro-Gly-Pro', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with sterile or bacteriostatic water.',
   array['Anxiolytic research','Neuropeptide studies'],
   'Selank is a synthetic analogue of tuftsin studied in anxiolytic and neuropeptide research. Research use only.', false),
  ('PT-141', 'pt-141', 'Bremelanotide (melanocortin agonist)', 'bioregulation-signalling',
   '189691-06-3', 'C50H68N14O10', 1025.16,
   'Ac-Nle-cyclo(Asp-His-D-Phe-Arg-Trp-Lys)-OH', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with sterile or bacteriostatic water.',
   array['Melanocortin-receptor research'],
   'PT-141 (Bremelanotide) is a melanocortin-receptor agonist referenced in receptor-pharmacology research. Research use only.', false),
  ('Melanotan II', 'melanotan-ii', 'Melanocortin agonist', 'bioregulation-signalling',
   '121062-08-6', 'C50H69N15O9', 1024.18,
   'Ac-Nle-cyclo(Asp-His-D-Phe-Arg-Trp-Lys)-NH2', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C, protect from light.',
   'Reconstitute with sterile or bacteriostatic water.',
   array['Melanocortin research','Pigmentation models'],
   'Melanotan II is a synthetic melanocortin-receptor agonist used in pigmentation and receptor research. Research use only.', false)
) as v(name, slug, subtitle, category_slug, cas_number, molecular_formula, molecular_weight,
       sequence, purity, appearance, form, storage, reconstitution, research_areas,
       description, is_featured)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Variants (sizes / prices in CAD cents)
-- ---------------------------------------------------------------------------
insert into public.product_variants (product_id, name, sku, size_mg, price_cents, stock_quantity, display_order)
select p.id, x.name, x.sku, x.size_mg, x.price_cents, x.stock, x.ord
from (values
  ('semaglutide','5 mg','NS-SEMA-05',5,8900,120,1),
  ('semaglutide','10 mg','NS-SEMA-10',10,15900,80,2),
  ('tirzepatide','10 mg','NS-TIRZ-10',10,16900,90,1),
  ('tirzepatide','15 mg','NS-TIRZ-15',15,22900,60,2),
  ('retatrutide','10 mg','NS-RETA-10',10,19900,50,1),
  ('tesamorelin','10 mg','NS-TESA-10',10,13900,40,1),
  ('aod-9604','5 mg','NS-AOD-05',5,6900,70,1),
  ('mots-c','10 mg','NS-MOTS-10',10,9900,55,1),
  ('cjc-1295-dac','5 mg','NS-CJCD-05',5,7900,65,1),
  ('ipamorelin','10 mg','NS-IPAM-10',10,7900,110,1),
  ('sermorelin','5 mg','NS-SERM-05',5,7400,60,1),
  ('hexarelin','5 mg','NS-HEXA-05',5,6900,45,1),
  ('bpc-157','5 mg','NS-BPC-05',5,5900,150,1),
  ('bpc-157','10 mg','NS-BPC-10',10,9900,120,2),
  ('tb-500','5 mg','NS-TB5-05',5,8900,90,1),
  ('tb-500','10 mg','NS-TB5-10',10,15900,60,2),
  ('ghk-cu','50 mg','NS-GHK-50',50,6400,80,1),
  ('epithalon','10 mg','NS-EPI-10',10,6900,75,1),
  ('epithalon','50 mg','NS-EPI-50',50,17900,30,2),
  ('thymosin-alpha-1','5 mg','NS-TA1-05',5,9400,40,1),
  ('semax','30 mg','NS-SMX-30',30,8900,50,1),
  ('selank','10 mg','NS-SLK-10',10,7400,50,1),
  ('pt-141','10 mg','NS-PT1-10',10,6900,65,1),
  ('melanotan-ii','10 mg','NS-MT2-10',10,6400,70,1)
) as x(product_slug, name, sku, size_mg, price_cents, stock, ord)
join public.products p on p.slug = x.product_slug
on conflict (sku) do nothing;

-- ---------------------------------------------------------------------------
-- Certificates of Analysis (sample batches)
-- ---------------------------------------------------------------------------
insert into public.coa_documents (product_id, batch_number, purity, test_method, test_date)
select p.id, x.batch, x.purity, x.method, x.test_date::date
from (values
  ('semaglutide','NS-SEMA-2607A','99.4%','HPLC / MS','2026-07-14'),
  ('tirzepatide','NS-TIRZ-2606B','99.1%','HPLC / MS','2026-06-28'),
  ('bpc-157','NS-BPC-2607C','99.7%','HPLC / MS','2026-07-02'),
  ('tb-500','NS-TB5-2606A','98.9%','HPLC / MS','2026-06-19'),
  ('ipamorelin','NS-IPAM-2607B','99.5%','HPLC / MS','2026-07-09')
) as x(product_slug, batch, purity, method, test_date)
join public.products p on p.slug = x.product_slug
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Learn / educational articles
-- ---------------------------------------------------------------------------
insert into public.learn_articles (title, slug, excerpt, category, reading_minutes, content) values
  ('Reconstituting Lyophilized Peptides: A Lab Primer', 'reconstituting-lyophilized-peptides',
   'A step-by-step laboratory reference for reconstituting lyophilized research peptides with bacteriostatic water.',
   'Handling', 6,
   E'## Reconstitution basics\n\nLyophilized (freeze-dried) peptides are reconstituted with an appropriate sterile diluent — typically bacteriostatic or sterile water — for research handling.\n\n> Research use only. The information below is provided for laboratory reference and is not medical guidance.\n\n### Suggested workflow\n1. Allow the vial to reach room temperature.\n2. Calculate the required diluent volume for your target working concentration.\n3. Add diluent slowly down the vial wall; do not inject directly onto the powder.\n4. Swirl gently — never shake — until fully dissolved.\n5. Label and refrigerate; record the reconstitution date.\n\n### Storage after reconstitution\nReconstituted peptides are generally kept refrigerated (2–8°C) and protected from light. Consult your own SOPs and the product specification.'),
  ('Reading a Certificate of Analysis (COA)', 'reading-a-certificate-of-analysis',
   'How to interpret purity, identity and test-method data on a peptide COA.',
   'Compliance', 5,
   E'## What a COA tells you\n\nA Certificate of Analysis documents the identity and purity of a specific batch.\n\n- **Purity (HPLC):** the percentage of the target peptide, commonly reported as ≥98% or ≥99%.\n- **Identity (MS):** mass-spectrometry confirmation of molecular weight.\n- **Batch number:** ties the certificate to a specific production lot.\n- **Test date:** when the analysis was performed.\n\nEvery North Specs product page links to the batch COA where available.'),
  ('Cold-Chain Handling & Storage of Research Peptides', 'cold-chain-handling-storage',
   'Best-practice storage, freeze-thaw and cold-chain guidance for research peptides.',
   'Handling', 7,
   E'## Keeping peptides stable\n\nMost lyophilized peptides are stored at **-20°C** long term and are stable for extended periods when kept dry and protected from light.\n\n### Freeze-thaw\nRepeated freeze-thaw cycles can degrade peptides. Aliquot reconstituted material to minimise cycles.\n\n### Cold chain\nNorth Specs ships with appropriate protection. On arrival, inspect and transfer to -20°C promptly.'),
  ('Research Use Only: Compliance for Canadian Labs', 'research-use-only-compliance-canada',
   'What "Research Use Only" means and the compliance expectations for Canadian research buyers.',
   'Compliance', 4,
   E'## Research Use Only (RUO)\n\nAll North Specs products are supplied strictly for **laboratory and in-vitro research**. They are **not** drugs, supplements, cosmetics or food, and are **not for human or veterinary use**.\n\n### Buyer expectations\n- Purchases are for legitimate research entities and qualified researchers.\n- Products must be handled under appropriate laboratory conditions.\n- Products may not be resold or relabelled for human use.\n\nBy ordering you confirm you understand and accept these terms.')
on conflict (slug) do nothing;
