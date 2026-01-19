// 레진 타입 정의
export type ResinType =
  | 'TPS'
  | 'PLA'
  | 'PBAT'
  | 'HDPE_VIRGIN'
  | 'HDPE_RECYCLE'
  | 'HDPE_BIO'
  | 'LDPE_VIRGIN'
  | 'LDPE_RECYCLE'
  | 'LDPE_BIO'
  | 'PP_VIRGIN'
  | 'PP_RECYCLE'
  | 'PP_BIO';

// 첨가제 타입 정의
export type AdditiveType =
  | 'BIOMASS_1'
  | 'BIOMASS_2'
  | 'ADDITIVE_1'
  | 'ADDITIVE_2'
  | 'ADDITIVE_3';

// 폐기 모드 정의
export type DisposalMode =
  | 'PELLET_ONLY'    // 펠릿 단계까지만
  | 'TO_PRODUCT'     // 제품 제조까지 (공정/운송 포함)
  | 'COMPOST'        // 퇴비화
  | 'INCINERATION';  // 소각

// 고객사 제조 공정 타입 (5개 중 1개 선택)
// 엑셀 DB 시트 기준: 전력 사용량, 사출, 압출, 필름, 시트
export type ProcessType =
  | 'ELECTRICITY'    // 총 전력 사용량 (kWh)
  | 'INJECTION'      // 사출 (원료투입량, kg)
  | 'EXTRUSION'      // 압출 (원료투입량, kg) - 신규 추가
  | 'FILM'           // 필름 (kg)
  | 'SHEET';         // 시트 (kg)

// LCA 입력 데이터 타입
export interface LcaInput {
  totalProductionKg: number;                    // 총 생산량 (kg)
  yieldRate: number;                            // 수득율 (%, 기본값 95) - 사용자 변경 가능
  gwgResinMix: Record<ResinType, number>;       // GWG 원료 배합 (비율, %)
  gwgAdditiveMix: Record<AdditiveType, number>; // GWG 첨가제 배합 (비율, %)
  pelletElectricityKwh: number;                 // 펠릿 제조 전력 사용량 (kWh)
  
  // 그린웨일 글로벌 운송 (펠릿 → 고객사)
  gwgSeaKm: number;                             // 해상 운송 거리 (km)
  gwgLandKm: number;                            // 육상 운송 거리 (km)
  
  // 고객사 운송 (제품 → 최종 목적지)
  customerSeaKm: number;                        // 고객사 해상 운송 거리 (km)
  customerLandKm: number;                       // 고객사 육상 운송 거리 (km)
  
  // 고객사 제조 공정 (5개 중 1개 선택)
  processType: ProcessType;                     // 선택된 공정 타입
  processValue: number;                         // 공정 값 (kWh 또는 kg)
  
  disposalMode: DisposalMode;                   // 폐기 시나리오
}

// 시나리오 이름 타입
export type ScenarioName = 'GWG' | 'HDPE' | 'LDPE' | 'PP';

// 시나리오별 결과 타입
export interface LcaScenarioResult {
  name: ScenarioName;
  pelletStageEmission: number;     // 펠릿 단계까지만의 kgCO2
  gwgTransportEmission: number;    // 그린웨일 글로벌 운송 배출량
  productStageEmission: number;    // 제품 제조(공정) 배출량
  customerTransportEmission: number; // 고객사 운송 배출량
  totalEmission: number;           // 총 배출량
  disposalAddedEmission: number;   // 퇴비/소각에 따른 추가 배출량 (없으면 0)
}

// LCA 결과 요약 타입
export interface LcaResultSummary {
  scenarios: LcaScenarioResult[];
  gwg: LcaScenarioResult;
  hdpe: LcaScenarioResult;
  ldpe: LcaScenarioResult;
  pp: LcaScenarioResult;
}

// 레진 타입 목록 (UI에서 사용)
export const RESIN_TYPES: ResinType[] = [
  'TPS',
  'PLA',
  'PBAT',
  'HDPE_VIRGIN',
  'HDPE_RECYCLE',
  'HDPE_BIO',
  'LDPE_VIRGIN',
  'LDPE_RECYCLE',
  'LDPE_BIO',
  'PP_VIRGIN',
  'PP_RECYCLE',
  'PP_BIO',
];

// 첨가제 타입 목록 (UI에서 사용)
export const ADDITIVE_TYPES: AdditiveType[] = [
  'BIOMASS_1',
  'BIOMASS_2',
  'ADDITIVE_1',
  'ADDITIVE_2',
  'ADDITIVE_3',
];

// 공정 타입 목록 (UI에서 사용)
// 엑셀 DB 시트 기준 5개 공정 방식 모두 포함
export const PROCESS_TYPES: ProcessType[] = [
  'ELECTRICITY',  // 총 전력 사용량
  'INJECTION',    // 사출
  'EXTRUSION',    // 압출 (신규 추가)
  'FILM',         // 필름
  'SHEET',        // 시트
];

// 레진 타입 한글 라벨
export const RESIN_LABELS: Record<ResinType, string> = {
  TPS: 'TPS (카사바전분)',
  PLA: 'PLA',
  PBAT: 'PBAT',
  HDPE_VIRGIN: 'HDPE (버진)',
  HDPE_RECYCLE: 'HDPE (재활용)',
  HDPE_BIO: 'HDPE (바이오)',
  LDPE_VIRGIN: 'LDPE (버진)',
  LDPE_RECYCLE: 'LDPE (재활용)',
  LDPE_BIO: 'LDPE (바이오)',
  PP_VIRGIN: 'PP (버진)',
  PP_RECYCLE: 'PP (재활용)',
  PP_BIO: 'PP (바이오)',
};

// 첨가제 타입 한글 라벨
export const ADDITIVE_LABELS: Record<AdditiveType, string> = {
  BIOMASS_1: 'Biomass 1',
  BIOMASS_2: 'Biomass 2',
  ADDITIVE_1: 'Additive 1',
  ADDITIVE_2: 'Additive 2',
  ADDITIVE_3: 'Additive 3',
};

// 폐기 모드 한글 라벨
export const DISPOSAL_LABELS: Record<DisposalMode, string> = {
  PELLET_ONLY: '펠릿 단계까지만',
  TO_PRODUCT: '제품 제조까지',
  COMPOST: '퇴비화',
  INCINERATION: '소각',
};

// 공정 타입 한글 라벨
// 엑셀 DB 시트 기준 5개 공정 방식 라벨
export const PROCESS_LABELS: Record<ProcessType, string> = {
  ELECTRICITY: '총 전력 사용량 (kWh)',
  INJECTION: '사출 - 원료투입량 (kg)',
  EXTRUSION: '압출 - 원료투입량 (kg)',  // 신규 추가
  FILM: '필름 (kg)',
  SHEET: '시트 (kg)',
};

// 공정 타입 단위
export const PROCESS_UNITS: Record<ProcessType, string> = {
  ELECTRICITY: 'kWh',
  INJECTION: 'kg',
  EXTRUSION: 'kg',  // 신규 추가
  FILM: 'kg',
  SHEET: 'kg',
};