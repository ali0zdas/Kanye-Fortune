/**
 * Kanye Fortune — Core Domain Types & Interface Contracts
 */

export type EraId = 'donda' | 'graduation' | '808s' | 'yeezus';

export type ViewMode = 'card' | 'receipt';

export type QuoteMood = 'philosophical' | 'boastful' | 'introspective' | 'creative' | 'humorous';

export interface DestinyVerdict {
  title: string;
  subtitle: string;
}

export interface YeezyArtifact {
  name: string;
  description: string;
  iconName: string;
}

export interface KanyeFortunePackage {
  id: string;
  timestamp: number;
  userQuestion: string | null;
  quote: string;
  source: 'api' | 'offline_vault';
  era: EraId;
  destinyVerdict: DestinyVerdict;
  oracleInterpretation: string;
  actionableCommand: string;
  auraScore: number;
  auraTitle: string;
  luckyArtifact: YeezyArtifact;
  luckyNumbers: [number, number, number];
}
