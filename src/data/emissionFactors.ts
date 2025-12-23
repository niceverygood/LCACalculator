import type { ResinType, AdditiveType } from '../types/lca';

// 레진별 kgCO2/kg 배출 계수 (엑셀 DB 시트 기준)
export const RESIN_EMISSION_PER_KG: Record<ResinType, number> = {
  TPS: -3.12,           // TPS (카사바전분) 합계
  PLA: 0.5,             // PLA 합계
  PBAT: 3.5,
  HDPE_VIRGIN: 1.9,
  HDPE_RECYCLE: 0.89,
  HDPE_BIO: -2.15,
  LDPE_VIRGIN: 1.71,
  LDPE_RECYCLE: 0.81,
  LDPE_BIO: -2.15,
  PP_VIRGIN: 1.47,
  PP_RECYCLE: 0.84,
  PP_BIO: 0.3,
};

// 첨가제별 kgCO2/kg 배출 계수
export const ADDITIVE_EMISSION_PER_KG: Record<AdditiveType, number> = {
  TALC: 2.6,
  COCONUT: 6.99,
  BAMBOO: 0.86,
  CASTOR_OIL: 18.9,
  TAB_363: 3.52,
};

// 전력 사용 배출 계수 (kgCO2/kWh)
export const ELECTRICITY_EMISSION_PER_KWH = 0.478;

// 공정별 배출 계수 (kgCO2/kg)
export const PROCESS_EMISSION_PER_KG = {
  sheet: 0.19,      // 중공 공정 (시트)
  injection: 0.22,  // 사출 공정
  film: 0.58,       // Blow 공정 (필름)
} as const;

// 운송 배출 계수
export const TRANSPORT_EMISSION = {
  seaTonKm: 0.0085,   // 해상 운송 (선박) - kgCO2/ton·km
  landTonKm: 0.15,    // 육상 운송 (트럭) - kgCO2/ton·km
} as const;

// 폐기(소각) 배출 계수 (kgCO2/kg)
export const DISPOSAL_EMISSION_PER_KG = {
  tps: 1.63,    // TPS 소각
  pla: 1.83,    // PLA 소각
  ppPe: 3.1,    // PP/PE 소각
  pbat: 2.4,    // PBAT 소각
} as const;

// HDPE 기본 배합 시나리오
export const HDPE_BASE_MIX: Record<ResinType, number> = {
  TPS: 0,
  PLA: 0,
  PBAT: 0,
  HDPE_VIRGIN: 0.65,
  HDPE_RECYCLE: 0.25,
  HDPE_BIO: 0.1,
  LDPE_VIRGIN: 0,
  LDPE_RECYCLE: 0,
  LDPE_BIO: 0,
  PP_VIRGIN: 0,
  PP_RECYCLE: 0,
  PP_BIO: 0,
};

// LDPE 기본 배합 시나리오
export const LDPE_BASE_MIX: Record<ResinType, number> = {
  TPS: 0,
  PLA: 0,
  PBAT: 0,
  HDPE_VIRGIN: 0,
  HDPE_RECYCLE: 0,
  HDPE_BIO: 0,
  LDPE_VIRGIN: 0.65,
  LDPE_RECYCLE: 0.25,
  LDPE_BIO: 0.1,
  PP_VIRGIN: 0,
  PP_RECYCLE: 0,
  PP_BIO: 0,
};

// PP 기본 배합 시나리오
export const PP_BASE_MIX: Record<ResinType, number> = {
  TPS: 0,
  PLA: 0,
  PBAT: 0,
  HDPE_VIRGIN: 0,
  HDPE_RECYCLE: 0,
  HDPE_BIO: 0,
  LDPE_VIRGIN: 0,
  LDPE_RECYCLE: 0,
  LDPE_BIO: 0,
  PP_VIRGIN: 0.65,
  PP_RECYCLE: 0.25,
  PP_BIO: 0.1,
};

// 첨가제 없음 (비교 시나리오용)
export const EMPTY_ADDITIVE_MIX: Record<AdditiveType, number> = {
  TALC: 0,
  COCONUT: 0,
  BAMBOO: 0,
  CASTOR_OIL: 0,
  TAB_363: 0,
};

