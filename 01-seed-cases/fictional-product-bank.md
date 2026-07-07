# Fictional Product Bank — v1.0 (B2C standard cases)

All fictional. Names are invented; any resemblance to real products is coincidental. Each has a
constructed USPI-style label skeleton (Sonnet fleshes full label prose from these later). SRLs are
Standard Response Letters keyed by id. This bank feeds the 10 seed cases; decoys are drawn from here.

| Product | Class (fictional) | Indication | Key label points |
|---|---|---|---|
| **Cardizan** (velanoxine) | anticoagulant | non-valvular AF, stroke prevention | narrow INR interaction profile; GI bleed risk; renal dosing |
| **Pulmonara** (fesaterol) | inhaled LABA/ICS | asthma maintenance (≥12 yr) | not for acute bronchospasm; oral candidiasis; tremor/palpitations |
| **Neurovance** (melotigine) | anticonvulsant | partial-onset seizures | serious rash/SJS risk; titration schedule; suicidality warning |
| **Dermelia** (tacrolisol) | topical calcineurin inhibitor | atopic dermatitis | boxed warning malignancy (class); application-site burning |
| **Gastroquell** (ranozide) | PPI | GERD, erosive esophagitis | long-term use B12/Mg; C. diff risk; not for immediate relief |
| **Osteveda** (denosalar) | anti-resorptive injectable | postmenopausal osteoporosis | hypocalcemia; ONJ; not in pregnancy |
| **Immunexa** (rilucept) | biologic (fictional TNF-class) | rheumatoid arthritis | infection/TB risk; injection-site reactions; live-vaccine caution |

## SRL library (ids)
- `SRL-CDZ-INR` Cardizan & INR monitoring / interacting drugs
- `SRL-CDZ-RENAL` Cardizan renal dosing
- `SRL-CDZ-BLEED` Cardizan bleeding risk management
- `SRL-PUL-ACUTE` Pulmonara not for acute symptoms / rescue use
- `SRL-PUL-CANDID` Pulmonara oral candidiasis prevention
- `SRL-PUL-PEDS` Pulmonara pediatric use (<12)
- `SRL-NEU-RASH` Neurovance serious rash / when to stop
- `SRL-NEU-TITR` Neurovance titration schedule
- `SRL-NEU-PREG` Neurovance use in pregnancy / registry
- `SRL-DRM-APPLY` Dermelia application & site reactions
- `SRL-DRM-MALIG` Dermelia boxed-warning malignancy context
- `SRL-GAS-LONG` Gastroquell long-term use risks
- `SRL-GAS-ONSET` Gastroquell onset of action / not for immediate relief
- `SRL-OST-HYPOCAL` Osteveda hypocalcemia management
- `SRL-OST-ONJ` Osteveda osteonecrosis of the jaw
- `SRL-OST-PREG` Osteveda contraindicated in pregnancy
- `SRL-IMM-INFECT` Immunexa infection / TB screening
- `SRL-IMM-VACC` Immunexa live-vaccine guidance
