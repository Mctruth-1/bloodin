import {
  BloodGroup,
  BloodCompatibilityProfile,
  Genotype,
  GenotypeMatchResult,
  GenotypeProbability,
  PunnettCell,
  RiskLevel,
} from '../types/medical';

export const BLOOD_GROUPS: BloodGroup[] = [
  'O-',
  'O+',
  'A-',
  'A+',
  'B-',
  'B+',
  'AB-',
  'AB+',
];

export const GENOTYPES: Genotype[] = ['AA', 'AS', 'AC', 'SS', 'SC', 'CC'];

/**
 * Medically accurate Red Blood Cell (RBC) Transfusion Matrix
 * Rules:
 * - ABO compatibility:
 *   O can donate RBCs to O, A, B, AB
 *   A can donate RBCs to A, AB
 *   B can donate RBCs to B, AB
 *   AB can donate RBCs to AB only
 * - Rh(D) compatibility:
 *   Rh- can donate to both Rh- and Rh+
 *   Rh+ can donate ONLY to Rh+
 */
export const BLOOD_COMPATIBILITY_MAP: Record<BloodGroup, BloodCompatibilityProfile> = {
  'O-': {
    bloodGroup: 'O-',
    canDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-'],
    isUniversalDonor: true,
    isUniversalRecipient: false,
    antigens: 'None (No A, B, or RhD antigens on red cells)',
    antibodies: 'Anti-A and Anti-B antibodies in plasma',
    rhFactor: 'Negative (-)',
    physiologicalSummary:
      'Universal Red Cell Donor. Because O- red blood cells lack A, B, and RhD surface antigens, they do not trigger acute hemolytic reactions in recipients of any blood group during emergency transfusions.',
  },
  'O+': {
    bloodGroup: 'O+',
    canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O-', 'O+'],
    isUniversalDonor: false,
    isUniversalRecipient: false,
    antigens: 'RhD antigen only (No A or B antigens)',
    antibodies: 'Anti-A and Anti-B antibodies in plasma',
    rhFactor: 'Positive (+)',
    physiologicalSummary:
      'High-demand donor type (~38% of the population). O+ red blood cells lack A and B antigens and can be safely transfused to any Rh-positive patient.',
  },
  'A-': {
    bloodGroup: 'A-',
    canDonateTo: ['A-', 'A+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-', 'A-'],
    isUniversalDonor: false,
    isUniversalRecipient: false,
    antigens: 'A antigen only (No RhD antigen)',
    antibodies: 'Anti-B antibodies in plasma',
    rhFactor: 'Negative (-)',
    physiologicalSummary:
      'Carries A surface antigens without the RhD protein. Can donate red cells to both A and AB patients regardless of Rh status.',
  },
  'A+': {
    bloodGroup: 'A+',
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+'],
    isUniversalDonor: false,
    isUniversalRecipient: false,
    antigens: 'A antigen and RhD antigen',
    antibodies: 'Anti-B antibodies in plasma',
    rhFactor: 'Positive (+)',
    physiologicalSummary:
      'Presents both A and RhD surface antigens alongside Anti-B plasma antibodies. Compatible with A+ and AB+ recipients.',
  },
  'B-': {
    bloodGroup: 'B-',
    canDonateTo: ['B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-', 'B-'],
    isUniversalDonor: false,
    isUniversalRecipient: false,
    antigens: 'B antigen only (No RhD antigen)',
    antibodies: 'Anti-A antibodies in plasma',
    rhFactor: 'Negative (-)',
    physiologicalSummary:
      'Presents B surface antigens without RhD. Essential donor for B and AB patients of both Rh-negative and Rh-positive status.',
  },
  'B+': {
    bloodGroup: 'B+',
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['O-', 'O+', 'B-', 'B+'],
    isUniversalDonor: false,
    isUniversalRecipient: false,
    antigens: 'B antigen and RhD antigen',
    antibodies: 'Anti-A antibodies in plasma',
    rhFactor: 'Positive (+)',
    physiologicalSummary:
      'Carries B and RhD antigens with Anti-A antibodies in plasma. Can safely receive from O and B donors.',
  },
  'AB-': {
    bloodGroup: 'AB-',
    canDonateTo: ['AB-', 'AB+'],
    canReceiveFrom: ['O-', 'A-', 'B-', 'AB-'],
    isUniversalDonor: false,
    isUniversalRecipient: false,
    antigens: 'A and B antigens (No RhD antigen)',
    antibodies: 'None (No Anti-A or Anti-B antibodies)',
    rhFactor: 'Negative (-)',
    physiologicalSummary:
      'Rarest blood group (<1% globally). Lacks Anti-A and Anti-B antibodies, allowing receipt from all Rh-negative blood groups; universal plasma donor.',
  },
  'AB+': {
    bloodGroup: 'AB+',
    canDonateTo: ['AB+'],
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    isUniversalDonor: false,
    isUniversalRecipient: true,
    antigens: 'A, B, and RhD antigens on red cells',
    antibodies: 'None (No Anti-A, Anti-B, or Anti-RhD antibodies)',
    rhFactor: 'Positive (+)',
    physiologicalSummary:
      'Universal Red Cell Recipient. Because AB+ plasma contains neither Anti-A nor Anti-B antibodies and red cells already express A, B, and RhD antigens, AB+ individuals can safely receive packed red blood cells from any blood group.',
  },
};

export function getBloodCompatibility(bloodGroup: BloodGroup): BloodCompatibilityProfile {
  return BLOOD_COMPATIBILITY_MAP[bloodGroup];
}

export function normalizeAllelePair(a1: string, a2: string): Genotype {
  const order: Record<string, number> = { A: 1, S: 2, C: 3 };
  const sorted = [a1, a2].sort((x, y) => (order[x] || 99) - (order[y] || 99));
  return (sorted[0] + sorted[1]) as Genotype;
}

const GENOTYPE_DESCRIPTIONS: Record<
  Genotype,
  { label: string; category: GenotypeProbability['category'] }
> = {
  AA: {
    label: 'Normal Adult Hemoglobin',
    category: 'Normal',
  },
  AS: {
    label: 'Sickle Cell Trait (Asymptomatic Carrier)',
    category: 'Trait / Carrier',
  },
  AC: {
    label: 'Hemoglobin C Trait (Asymptomatic Carrier)',
    category: 'Trait / Carrier',
  },
  SS: {
    label: 'Sickle Cell Anemia (HbSS Disease)',
    category: 'Sickle Cell / HbC Disease',
  },
  SC: {
    label: 'Hemoglobin SC Disease (Sickle-HbC Disease)',
    category: 'Sickle Cell / HbC Disease',
  },
  CC: {
    label: 'Hemoglobin C Disease (Mild Hemolytic Condition)',
    category: 'Sickle Cell / HbC Disease',
  },
};

/**
 * Computes exact Mendelian Punnett Square probabilities (each pregnancy)
 * for Partner A and Partner B hemoglobin genotypes.
 */
export function calculateGenotypeCompatibility(
  partnerA: Genotype,
  partnerB: Genotype
): GenotypeMatchResult {
  const allelesA = [partnerA[0], partnerA[1]];
  const allelesB = [partnerB[0], partnerB[1]];

  const punnettGrid: PunnettCell[][] = [];
  const counts: Partial<Record<Genotype, number>> = {};

  for (let r = 0; r < 2; r++) {
    const row: PunnettCell[] = [];
    for (let c = 0; c < 2; c++) {
      const combined = normalizeAllelePair(allelesA[r], allelesB[c]);
      counts[combined] = (counts[combined] || 0) + 1;
      row.push({
        rowAllele: allelesA[r],
        colAllele: allelesB[c],
        genotype: combined,
        isSickleCellDisease: combined === 'SS' || combined === 'SC' || combined === 'CC',
        isCarrier: combined === 'AS' || combined === 'AC',
      });
    }
    punnettGrid.push(row);
  }

  const probabilities: GenotypeProbability[] = (Object.keys(counts) as Genotype[]).map(
    (gt) => ({
      genotype: gt,
      percentage: (counts[gt]! / 4) * 100,
      label: GENOTYPE_DESCRIPTIONS[gt].label,
      category: GENOTYPE_DESCRIPTIONS[gt].category,
    })
  );

  // Sort probabilities: AA first, then carriers, then disease states
  const sortOrder: Record<Genotype, number> = {
    AA: 1,
    AS: 2,
    AC: 3,
    CC: 4,
    SC: 5,
    SS: 6,
  };
  probabilities.sort((a, b) => sortOrder[a.genotype] - sortOrder[b.genotype]);

  const ssOrScProb =
    ((counts['SS'] || 0) + (counts['SC'] || 0)) * 25;
  const ccProb = (counts['CC'] || 0) * 25;
  const carrierProb = ((counts['AS'] || 0) + (counts['AC'] || 0)) * 25;

  let riskLevel: RiskLevel = 'LOW';
  let riskTitle = 'Low Risk / Genetically Compatible';
  let clinicalSummary = '';
  let counselorGuidance = '';

  if (ssOrScProb > 0) {
    riskLevel = 'HIGH';
    riskTitle = `High Risk for Sickle Cell Disease (${ssOrScProb}% per pregnancy)`;
    clinicalSummary = `In each pregnancy, there is a ${ssOrScProb}% chance of inheriting a clinically significant Sickle Cell condition (such as HbSS or HbSC)${
      carrierProb > 0 ? ` and a ${carrierProb}% chance of being a healthy carrier` : ''
    }.`;
    counselorGuidance =
      'We gently recommend scheduling a consultation with a certified genetic counselor or clinical hematologist. Modern reproductive medicine offers supportive family-planning pathways, early prenatal diagnostics, and pre-implantation genetic testing (PGT-M).';
  } else if (ccProb > 0) {
    riskLevel = 'MODERATE';
    riskTitle = `Moderate Risk — Hemoglobin C Disease (${ccProb}% per pregnancy)`;
    clinicalSummary = `There is NO risk of Sickle Cell Anemia (HbSS/HbSC), but there is a ${ccProb}% chance per pregnancy of Hemoglobin CC (which typically causes mild chronic hemolytic anemia) and ${carrierProb}% carrier probability.`;
    counselorGuidance =
      'Speaking with a genetic counselor or hematologist can help you understand Hemoglobin C inheritance, which is clinically much milder than Sickle Cell Disease.';
  } else if (carrierProb > 0) {
    riskLevel = 'MODERATE';
    riskTitle = 'Safe Compatibility (Carrier Trait Possible)';
    clinicalSummary = `0% risk of Sickle Cell Disease! Because at least one partner carries normal AA hemoglobin, children will NOT inherit Sickle Cell Disease. Each pregnancy carries a ${carrierProb}% chance of inheriting a benign carrier trait (AS or AC).`;
    counselorGuidance =
      'This pairing is medically safe for family planning. Knowing whether future children inherit the AS or AC trait helps inform their own future health records.';
  } else {
    riskLevel = 'LOW';
    riskTitle = 'Low Risk / Safe Compatibility (100% AA)';
    clinicalSummary =
      '100% probability of normal adult hemoglobin (AA) in every pregnancy, with 0% risk of Sickle Cell Disease or carrier traits.';
    counselorGuidance =
      'Both partners carry exclusively normal Hemoglobin A alleles. Always confirm genotypes with laboratory Hemoglobin Electrophoresis or HPLC testing.';
  }

  return {
    partnerA,
    partnerB,
    punnettGrid,
    probabilities,
    riskLevel,
    riskTitle,
    clinicalSummary,
    counselorGuidance,
  };
}
