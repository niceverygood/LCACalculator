import type { ResinType, AdditiveType, ProcessType } from '../types/lca';

// ============================================================================
// 엑셀 DB 시트 기준 배출계수 (3.LCA 평가 방법_GWG_251224_C_M.xlsx)
// 최종 업데이트: 2024-12-24
// ============================================================================

// 수득율 상수 (그린웨일 글로벌 총 생산량 계산 시 적용)
// 엑셀 DB 시트 행 25: 수득율 = 0.95 (95%)
// 적용 방식: 실제 필요 원료량 = 입력 생산량 / 수득율
export const YIELD_RATE = 0.95;

// 레진별 kgCO2/kg 배출 계수 (엑셀 DB 시트 기준)
// TPS: 탄소흡수(-3.52) + 공정배출(0.4) = -3.12
// PLA: 탄소흡수(-1.83) + 공정배출(2.33) = 0.5
export const RESIN_EMISSION_PER_KG: Record<ResinType, number> = {
  TPS: -3.12,           // TPS (카사바전분) 합계
  PLA: 0.5,             // PLA (옥수수전분) 합계
  PBAT: 3.5,            // PBAT 원료 생산 배출
  HDPE_VIRGIN: 1.9,     // HDPE(Virgin) 원료 생산 배출
  HDPE_RECYCLE: 0.89,   // HDPE(Recycle) 원료 생산 배출
  HDPE_BIO: -2.15,      // HDPE(Bio-PE) 원료 생산 배출
  LDPE_VIRGIN: 1.71,    // LDPE(Virgin) 원료 생산 배출
  LDPE_RECYCLE: 0.81,   // LDPE(Recycle) 원료 생산 배출
  LDPE_BIO: -2.15,      // LDPE(Bio-PE) 원료 생산 배출
  PP_VIRGIN: 1.47,      // PP(Virgin) 원료 생산 배출
  PP_RECYCLE: 0.84,     // PP(Recycle) 원료 생산 배출
  PP_BIO: 0.3,          // PP(Bio-PP) 원료 생산 배출
};

// 첨가제별 kgCO2/kg 배출 계수 (엑셀 DB 시트 기준)
export const ADDITIVE_EMISSION_PER_KG: Record<AdditiveType, number> = {
  BIOMASS_1: 2.6,       // Talc (자연유래) - Sheet 2 출처 첨부
  BIOMASS_2: 6.99,      // Coconut powder
  ADDITIVE_1: 0.86,     // Bamboo Powder
  ADDITIVE_2: 18.9,     // Castor oil
  ADDITIVE_3: 3.52,     // HAA Coupling TAB 363
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
