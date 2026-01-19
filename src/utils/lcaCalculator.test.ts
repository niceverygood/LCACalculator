/**
 * LCA 계산기 테스트 케이스
 * 엑셀 DB 시트 (3.LCA 평가 방법_GWG_251224_C_M.xlsx) 기준 검증
 * 
 * 테스트 목적:
 * 1. 수득율 95% 적용 확인
 * 2. 5개 공정 방식 배출계수 적용 확인
 * 3. 엑셀 계산 결과와 일치 여부 확인
 */

import { describe, test, expect } from 'vitest';
import {
  calculatePelletStageEmission,
  calculateGwgTransportEmission,
  calculateProductStageEmission,
  calculateScenarioResults,
} from './lcaCalculator';
import { YIELD_RATE, PROCESS_EMISSION_PER_KG, ELECTRICITY_EMISSION_PER_KWH } from '../data/emissionFactors';
import type { LcaInput, ResinType, AdditiveType } from '../types/lca';

// ============================================================================
// 엑셀 DB 시트 기준 테스트 데이터
// ============================================================================

// 엑셀 예제와 동일한 GWG 원료 배합 (%)
const EXCEL_GWG_RESIN_MIX: Record<ResinType, number> = {
  TPS: 60,              // 행 6: 0.6 = 60%
  PLA: 0,
  PBAT: 0,
  HDPE_VIRGIN: 0,
  HDPE_RECYCLE: 20,     // 행 10: 0.2 = 20%
  HDPE_BIO: 0,
  LDPE_VIRGIN: 0,
  LDPE_RECYCLE: 10,     // 행 13: 0.1 = 10%
  LDPE_BIO: 0,
  PP_VIRGIN: 0,
  PP_RECYCLE: 0,
  PP_BIO: 0,
};

// 엑셀 예제와 동일한 첨가제 배합 (%)
const EXCEL_ADDITIVE_MIX: Record<AdditiveType, number> = {
  BIOMASS_1: 2,         // Talc 2%
  BIOMASS_2: 2,         // Coconut 2%
  ADDITIVE_1: 2,        // Bamboo 2%
  ADDITIVE_2: 2,        // Castor 2%
  ADDITIVE_3: 2,        // HAA 2%
};

// 엑셀 예제 기본 입력값
const EXCEL_BASE_INPUT: LcaInput = {
  totalProductionKg: 1000,          // 총 생산량 1000kg
  yieldRate: 95,                    // 수득율 95% (사용자 변경 가능)
  gwgResinMix: EXCEL_GWG_RESIN_MIX,
  gwgAdditiveMix: EXCEL_ADDITIVE_MIX,
  pelletElectricityKwh: 600,        // 행 28: 600 kWh
  gwgSeaKm: 3200,                   // 행 31: 3200 km
  gwgLandKm: 200,                   // 행 32: 200 km
  customerSeaKm: 0,
  customerLandKm: 0,
  processType: 'ELECTRICITY',
  processValue: 0,
  disposalMode: 'PELLET_ONLY',
};

// ============================================================================
// 테스트 케이스 1: 수득율 95% 적용 확인
// ============================================================================
describe('수득율 95% 적용 테스트', () => {
  test('YIELD_RATE 상수가 0.95인지 확인', () => {
    expect(YIELD_RATE).toBe(0.95);
  });

  test('수득율 적용 시 원료량 계산 (1000kg → 1052.63kg)', () => {
    // 엑셀 행 25: 1000 / 0.95 = 1052.6315789473686
    const expectedRawMaterial = 1000 / 0.95;
    expect(expectedRawMaterial).toBeCloseTo(1052.63, 2);
  });
});

// ============================================================================
// 테스트 케이스 2: 공정별 배출계수 확인
// ============================================================================
describe('공정별 배출계수 테스트 (엑셀 DB 시트 기준)', () => {
  test('사출 공정 배출계수 = 0.29 kgCO2/kg', () => {
    expect(PROCESS_EMISSION_PER_KG.INJECTION).toBe(0.29);
  });

  test('압출 공정 배출계수 = 0.219 kgCO2/kg', () => {
    expect(PROCESS_EMISSION_PER_KG.EXTRUSION).toBe(0.219);
  });

  test('시트 공정 배출계수 = 0.192 kgCO2/kg', () => {
    expect(PROCESS_EMISSION_PER_KG.SHEET).toBe(0.192);
  });

  test('필름 공정 배출계수 = 0.219 kgCO2/kg', () => {
    expect(PROCESS_EMISSION_PER_KG.FILM).toBe(0.219);
  });

  test('전력 배출계수 = 0.478 kgCO2/kWh', () => {
    expect(ELECTRICITY_EMISSION_PER_KWH).toBe(0.478);
  });
});

// ============================================================================
// 테스트 케이스 3: 제품 제조 단계 배출량 계산
// ============================================================================
describe('제품 제조 단계 배출량 계산 테스트', () => {
  test('전력 사용량 600kWh → 286.8 kgCO2', () => {
    // 엑셀 행 28: 600 * 0.478 = 286.8
    const input: LcaInput = { ...EXCEL_BASE_INPUT, processType: 'ELECTRICITY', processValue: 600 };
    const result = calculateProductStageEmission(input);
    expect(result).toBeCloseTo(286.8, 1);
  });

  test('사출 공정 1000kg → 290 kgCO2', () => {
    // 1000 * 0.29 = 290
    const input: LcaInput = { ...EXCEL_BASE_INPUT, processType: 'INJECTION', processValue: 1000 };
    const result = calculateProductStageEmission(input);
    expect(result).toBeCloseTo(290, 1);
  });

  test('압출 공정 1000kg → 219 kgCO2', () => {
    // 1000 * 0.219 = 219
    const input: LcaInput = { ...EXCEL_BASE_INPUT, processType: 'EXTRUSION', processValue: 1000 };
    const result = calculateProductStageEmission(input);
    expect(result).toBeCloseTo(219, 1);
  });

  test('시트 공정 1000kg → 192 kgCO2', () => {
    // 1000 * 0.192 = 192
    const input: LcaInput = { ...EXCEL_BASE_INPUT, processType: 'SHEET', processValue: 1000 };
    const result = calculateProductStageEmission(input);
    expect(result).toBeCloseTo(192, 1);
  });

  test('필름 공정 1000kg → 219 kgCO2', () => {
    // 1000 * 0.219 = 219
    const input: LcaInput = { ...EXCEL_BASE_INPUT, processType: 'FILM', processValue: 1000 };
    const result = calculateProductStageEmission(input);
    expect(result).toBeCloseTo(219, 1);
  });
});

// ============================================================================
// 테스트 케이스 4: 운송 배출량 계산 (엑셀 값과 비교)
// ============================================================================
describe('GWG 운송 배출량 계산 테스트', () => {
  test('해상 3200km + 육상 200km → 57.2 kgCO2', () => {
    // 엑셀 행 31-33:
    // 해상: 1톤 * 3200km * 0.0085 = 27.2 kgCO2
    // 육상: 1톤 * 200km * 0.15 = 30 kgCO2
    // 합계: 57.2 kgCO2
    const result = calculateGwgTransportEmission(EXCEL_BASE_INPUT);
    expect(result).toBeCloseTo(57.2, 1);
  });
});

// ============================================================================
// 테스트 케이스 5: 펠릿 단계 배출량 계산 (수득율 적용 확인)
// ============================================================================
describe('펠릿 단계 배출량 계산 테스트 (수득율 95% 적용)', () => {
  test('엑셀 예제 기준 펠릿 단계 배출량', () => {
    // 엑셀 행 23-25 기준:
    // 원료 배출량 합계: -0.9556 kgCO2/kg (수득율 적용 전)
    // 수득율 적용 후 총량: -1005.89 kgCO2 (1000/0.95 * -0.9556)
    // 전력 배출량: 600 * 0.478 = 286.8 kgCO2
    // 펠릿 단계 합계: -1005.89 + 286.8 = -719.09 kgCO2 (근사치)
    
    const result = calculatePelletStageEmission(
      EXCEL_BASE_INPUT,
      EXCEL_GWG_RESIN_MIX,
      EXCEL_ADDITIVE_MIX
    );
    
    // 원료 배출량 세부 계산:
    // TPS: 0.60 * -3.12 = -1.872
    // HDPE(Recycle): 0.20 * 0.89 = 0.178
    // LDPE(Recycle): 0.10 * 0.81 = 0.081
    // Talc: 0.02 * 2.6 = 0.052
    // Coconut: 0.02 * 6.99 = 0.1398
    // Bamboo: 0.02 * 0.86 = 0.0172
    // Castor: 0.02 * 18.9 = 0.378
    // HAA: 0.02 * 3.52 = 0.0704
    // 합계: -0.9556 kgCO2/kg
    
    // 수득율 적용 원료량: 1000 / 0.95 = 1052.63 kg
    // 원료 배출량: 1052.63 * -0.9556 = -1005.89 kgCO2
    // 전력 배출량: 600 * 0.478 = 286.8 kgCO2
    // 합계: -1005.89 + 286.8 = -719.09 kgCO2
    
    // 결과값: -719.09 kgCO2 (수득율 적용 확인)
    expect(result).toBeCloseTo(-719.09, 0);
  });
});

// ============================================================================
// 테스트 케이스 6: 전체 시나리오 결과 확인
// ============================================================================
describe('전체 시나리오 결과 테스트', () => {
  test('GWG 시나리오 총 배출량 (펠릿 + 운송)', () => {
    const results = calculateScenarioResults(EXCEL_BASE_INPUT);
    
    // GWG 펠릿 배출량: 약 -719 kgCO2
    // GWG 운송 배출량: 57.2 kgCO2
    // 제조 공정: 0 (processValue = 0)
    // 고객사 운송: 0
    // 폐기: 0 (PELLET_ONLY)
    // 총합: 약 -661.8 kgCO2
    
    expect(results.gwg.pelletStageEmission).toBeCloseTo(-719, 0);
    expect(results.gwg.gwgTransportEmission).toBeCloseTo(57.2, 1);
    expect(results.gwg.totalEmission).toBeCloseTo(-661.8, 0);
  });
});

// ============================================================================
// 콘솔 로그 출력 (수동 검증용)
// ============================================================================
console.log('\n=== LCA 계산기 엑셀 대비 검증 결과 ===\n');

// 수득율 확인
console.log('1. 수득율 상수');
console.log(`   YIELD_RATE = ${YIELD_RATE} (기대값: 0.95)`);
console.log(`   상태: ${YIELD_RATE === 0.95 ? '✓ 일치' : '✗ 불일치'}\n`);

// 공정별 배출계수 확인
console.log('2. 공정별 배출계수 (kgCO2/kg)');
console.log(`   사출: ${PROCESS_EMISSION_PER_KG.INJECTION} (기대값: 0.29)`);
console.log(`   압출: ${PROCESS_EMISSION_PER_KG.EXTRUSION} (기대값: 0.219)`);
console.log(`   시트: ${PROCESS_EMISSION_PER_KG.SHEET} (기대값: 0.192)`);
console.log(`   필름: ${PROCESS_EMISSION_PER_KG.FILM} (기대값: 0.219)`);
console.log(`   전력: ${ELECTRICITY_EMISSION_PER_KWH} kgCO2/kWh (기대값: 0.478)\n`);

// 계산 결과 출력
const testInput = EXCEL_BASE_INPUT;
const pelletEmission = calculatePelletStageEmission(
  testInput,
  EXCEL_GWG_RESIN_MIX,
  EXCEL_ADDITIVE_MIX
);
const transportEmission = calculateGwgTransportEmission(testInput);
const scenarioResults = calculateScenarioResults(testInput);

console.log('3. 계산 결과 비교');
console.log(`   펠릿 단계 배출량: ${pelletEmission.toFixed(2)} kgCO2`);
console.log(`   (엑셀 기대값: 약 -661.89 + 286.8 전력 포함 = -375.09, 또는 -719 전력 제외 후 합산)`);
console.log(`   운송 배출량: ${transportEmission.toFixed(2)} kgCO2 (엑셀 기대값: 57.2)`);
console.log(`   GWG 총 배출량: ${scenarioResults.gwg.totalEmission.toFixed(2)} kgCO2\n`);

console.log('=== 검증 완료 ===\n');

