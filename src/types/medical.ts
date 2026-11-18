export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type Genotype = 'AA' | 'AS' | 'AC' | 'SS' | 'SC' | 'CC';

export interface UserProfile {
  id: string;
  name: string;
  relationship: 'Self' | 'Partner' | 'Child' | 'Parent' | 'Sibling' | 'Other';
  bloodGroup: BloodGroup;
  genotype: Genotype;
  allergies: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  isPrimary?: boolean;
}

export type HealthTrackCategory =
  | 'Hb Level (g/dL)'
  | 'Blood Donation'
  | 'Hydration & Wellness'
  | 'Pain / Crisis Log'
  | 'Lab / Electrophoresis';

export interface PersonalHealthTrack {
  id: string;
  userId: string;
  category: HealthTrackCategory;
  title: string;
  value: string;
  notes: string;
  recordedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  bloodGroup: BloodGroup;
  genotype: Genotype;
  allergies: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  createdAt: string;
}


export interface BloodCompatibilityProfile {
  bloodGroup: BloodGroup;
  canDonateTo: BloodGroup[];
  canReceiveFrom: BloodGroup[];
  isUniversalDonor: boolean;
  isUniversalRecipient: boolean;
  antigens: string;
  antibodies: string;
  rhFactor: 'Positive (+)' | 'Negative (-)';
  physiologicalSummary: string;
}

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';

export interface PunnettCell {
  rowAllele: string;
  colAllele: string;
  genotype: Genotype;
  isSickleCellDisease: boolean;
  isCarrier: boolean;
}

export interface GenotypeProbability {
  genotype: Genotype;
  percentage: number;
  label: string;
  category: 'Normal' | 'Trait / Carrier' | 'Sickle Cell / HbC Disease';
}

export interface GenotypeMatchResult {
  partnerA: Genotype;
  partnerB: Genotype;
  punnettGrid: PunnettCell[][]; // 2x2 matrix
  probabilities: GenotypeProbability[];
  riskLevel: RiskLevel;
  riskTitle: string;
  clinicalSummary: string;
  counselorGuidance: string;
}
