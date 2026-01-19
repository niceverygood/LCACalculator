import type { ResinType, AdditiveType, ProcessType } from '../types/lca';

// ============================================================================
// 배출계수 (kgCO₂eq/kg) - LCA 계산기 발견된 오류 사항_260119.pdf 기준
// 최종 업데이트: 2026-01-19
// ============================================================================

// 수득율 상수 (그린웨일 글로벌 총 생산량 계산 시 적용)
// 수득율 = 0.95 (95%) - 사용자가 UI에서 변경 가능
// 적용 방식: 실제 필요 원료량 = 입력 생산량 / 수득율
export const YIELD_RATE = 0.95;

// ============================================================================
// 레진별 kgCO₂eq/kg 배출 계수 (260119 업데이트)
// ============================================================================
// TPS: 탄소흡수(-0.746) + 공정배출(0.219) = -0.527 (변경 전: -3.12)
// PLA: 탄소흡수(-1.83) + 공정배출(2.44) = 0.61 (변경 전: 0.5)
export const RESIN_EMISSION_PER_KG: Record<ResinType, number> = {
  TPS: -0.527,          // TPS (카사바전분) 합계 [변경: -3.12 → -0.527]
  PLA: 0.61,            // PLA (옥수수전분) 합계 [변경: 0.5 → 0.61]
  PBAT: 3.5,            // PBAT 원료 생산 배출 (변경 없음)
  HDPE_VIRGIN: 2.02,    // HDPE(Virgin) 원료 생산 배출 [변경: 1.9 → 2.02]
  HDPE_RECYCLE: 0.92,   // HDPE(Recycle) 원료 생산 배출 [변경: 0.89 → 0.92]
  HDPE_BIO: -2.01,      // HDPE(Bio-PE) 원료 생산 배출 [변경: -2.15 → -2.01]
  LDPE_VIRGIN: 1.86,    // LDPE(Virgin) 원료 생산 배출 [변경: 1.71 → 1.86]
  LDPE_RECYCLE: 0.87,   // LDPE(Recycle) 원료 생산 배출 [변경: 0.81 → 0.87]
  LDPE_BIO: -2.27,      // LDPE(Bio-PE) 원료 생산 배출 [변경: -2.15 → -2.27]
  PP_VIRGIN: 1.61,      // PP(Virgin) 원료 생산 배출 [변경: 1.47 → 1.61]
  PP_RECYCLE: 0.88,     // PP(Recycle) 원료 생산 배출 [변경: 0.84 → 0.88]
  PP_BIO: 0.3,          // PP(Bio-PP) 원료 생산 배출 (변경 없음)
};

// ============================================================================
// 첨가제별 kgCO₂eq/kg 배출 계수 (260119 업데이트)
// ============================================================================
export const ADDITIVE_EMISSION_PER_KG: Record<AdditiveType, number> = {
  BIOMASS_1: 0.04,      // Talc (자연유래) [변경: 2.6 → 0.04]
  BIOMASS_2: 0.367,     // Coconut powder [변경: 6.99 → 0.367]
  ADDITIVE_1: 1.45,     // Bamboo Powder [변경: 0.86 → 1.45]
  ADDITIVE_2: 1.8,      // Castor oil [변경: 18.9 → 1.8]
  ADDITIVE_3: 3.52,     // HAA Coupling TAB 363 (변경 없음)
};

// 전력 사용 배출 계수 (kgCO2/kWh) - 한국 산업전력 기준, 국가 LCI DB
export const ELECTRICITY_EMISSION_PER_KWH = 0.478;

// ============================================================================
// 고객사 제조 공정별 배출 계수 (kgCO2/kg) - 엑셀 DB 시트 기준
// 공정 방식 5개: 총 전력 사용량, 사출, 압출, 시트, 필름
// ============================================================================
export const PROCESS_EMISSION_PER_KG: Record<Exclude<ProcessType, 'ELECTRICITY'>, number> = {
  INJECTION: 0.29,    // 사출 공정 - 엑셀 DB 시트 행 26 (기존 0.22에서 수정)
  EXTRUSION: 0.219,   // 압출 공정 - 엑셀 DB 시트 행 27 (신규 추가)
  SHEET: 0.192,       // 시트 공정 - 엑셀 DB 시트 행 28 (기존 0.19에서 수정)
  FILM: 0.219,        // 필름 공정 - 엑셀 DB 시트 행 29 (기존 0.58에서 수정)
};

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

// HDPE/LDPE/PP 고정 탄소배출량 (버진, 국내운송 기준) - kgCO2/톤
export const FIXED_EMISSION_PER_TON = {
  HDPE: 2231.8,
  LDPE: 2131.8,
  PP: 1801.8,
} as const;

// HDPE 기본 배합 시나리오
export const HDPE_BASE_MIX: Record<ResinType, number> = {
  TPS: 0,
  PLA: 0,
  PBAT: 0,
  HDPE_VIRGIN: 100,  // % 단위
  HDPE_RECYCLE: 0,
  HDPE_BIO: 0,
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
  LDPE_VIRGIN: 100,  // % 단위
  LDPE_RECYCLE: 0,
  LDPE_BIO: 0,
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
  PP_VIRGIN: 100,  // % 단위
  PP_RECYCLE: 0,
  PP_BIO: 0,
};

// 첨가제 없음 (비교 시나리오용)
export const EMPTY_ADDITIVE_MIX: Record<AdditiveType, number> = {
  BIOMASS_1: 0,
  BIOMASS_2: 0,
  ADDITIVE_1: 0,
  ADDITIVE_2: 0,
  ADDITIVE_3: 0,
};
