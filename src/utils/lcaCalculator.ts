import type {
  ResinType,
  AdditiveType,
  LcaInput,
  LcaScenarioResult,
  LcaResultSummary,
  ProcessType,
} from '../types/lca';

import {
  RESIN_EMISSION_PER_KG,
  ADDITIVE_EMISSION_PER_KG,
  ELECTRICITY_EMISSION_PER_KWH,
  PROCESS_EMISSION_PER_KG,
  TRANSPORT_EMISSION,
  DISPOSAL_EMISSION_PER_KG,
  FIXED_EMISSION_PER_TON,
  YIELD_RATE,  // 수득율 상수 추가
} from '../data/emissionFactors';

/**
 * % 값을 비율로 변환 (100% -> 1.0)
 */
function percentToRatio(percent: number): number {
  return percent / 100;
}

/**
 * 수득율을 적용한 실제 필요 원료량 계산
 * 
 * @description
 * 왜 이렇게 계산하는가?
 * - 수득율(Yield Rate)은 원료 투입량 대비 최종 제품 산출량의 비율
 * - 95% 수득율 = 100kg 원료 투입 시 95kg 제품 생산
 * - 따라서 원하는 제품량을 생산하려면: 필요 원료량 = 제품량 / 수득율
 * - 예: 1000kg 제품 생산 시, 수득율 95% → 1000 / 0.95 = 1052.63kg 원료 필요
 * 
 * @param productionKg 목표 생산량 (kg)
 * @param yieldRatePercent 수득율 (%, 예: 95)
 * @returns 수득율이 적용된 실제 필요 원료량 (kg)
 */
function applyYieldRate(productionKg: number, yieldRatePercent: number): number {
  // 수득율 % → 비율 변환 (95% → 0.95)
  const yieldRateRatio = yieldRatePercent / 100;
  // 수득율 적용: 실제 필요 원료량 = 목표 생산량 / 수득율
  // 수득율이 0이거나 너무 작으면 기본값 95% 사용
  const safeYieldRate = yieldRateRatio > 0 && yieldRateRatio <= 1 ? yieldRateRatio : YIELD_RATE;
  return productionKg / safeYieldRate;
}

/**
 * 펠릿 단계까지의 탄소 배출량 계산 (GWG용)
 * 원료 + 첨가제 합이 100%가 되어야 함
 * 
 * @description 수득율 적용 (사용자 입력값 또는 기본값 95%)
 * - 실제 필요 원료량 = 목표 생산량 / 수득율
 * - 예: 1000kg 제품 생산 시, 수득율 95% → 1000 / 0.95 = 1052.63kg 원료 필요
 * - 이 함수에서 수득율이 적용됨 (GWG 시나리오 전용)
 */
export function calculatePelletStageEmission(
  input: LcaInput,
  resinMix: Record<ResinType, number>,
  additiveMix: Record<AdditiveType, number>
): number {
  // ========================================
  // [수득율 적용] - 사용자 입력 수득율 사용 (기본값: 95%)
  // 총 생산량에 수득율을 적용하여 실제 필요 원료량 계산
  // ========================================
  const totalKg = applyYieldRate(input.totalProductionKg, input.yieldRate);

  // 레진 배출량 (% 값을 비율로 변환)
  // 각 레진 비율 × 해당 레진 배출계수 × 총 원료량
  let resinEmission = 0;
  for (const resin of Object.keys(resinMix) as ResinType[]) {
    const ratio = percentToRatio(resinMix[resin]);
    resinEmission += ratio * RESIN_EMISSION_PER_KG[resin];
  }
  resinEmission *= totalKg;

  // 첨가제 배출량 (% 값을 비율로 변환)
  // 각 첨가제 비율 × 해당 첨가제 배출계수 × 총 원료량
  let additiveEmission = 0;
  for (const additive of Object.keys(additiveMix) as AdditiveType[]) {
    const ratio = percentToRatio(additiveMix[additive]);
    additiveEmission += ratio * ADDITIVE_EMISSION_PER_KG[additive];
  }
  additiveEmission *= totalKg;

  // 전력 배출량 (펠릿 제조 공정 전력)
  // 전력 사용량 × 전력 배출계수 (0.478 kgCO2/kWh)
  const electricEmission =
    input.pelletElectricityKwh * ELECTRICITY_EMISSION_PER_KWH;

  return resinEmission + additiveEmission + electricEmission;
}

/**
 * 그린웨일 글로벌 운송 배출량 계산 (펠릿 → 고객사)
 */
export function calculateGwgTransportEmission(input: LcaInput): number {
  const ton = input.totalProductionKg / 1000;
  return ton * (
    input.gwgSeaKm * TRANSPORT_EMISSION.seaTonKm +
    input.gwgLandKm * TRANSPORT_EMISSION.landTonKm
  );
}

/**
 * 고객사 운송 배출량 계산 (제품 → 최종 목적지)
 */
export function calculateCustomerTransportEmission(input: LcaInput): number {
  const ton = input.totalProductionKg / 1000;
  return ton * (
    input.customerSeaKm * TRANSPORT_EMISSION.seaTonKm +
    input.customerLandKm * TRANSPORT_EMISSION.landTonKm
  );
}

/**
 * 제품 제조 단계의 배출량 계산 (5개 공정 중 1개 선택)
 * 
 * @description 엑셀 DB 시트 기준 5개 공정 방식:
 * 1. 총 전력 사용량 (kWh) - 배출계수: 0.478 kgCO2/kWh
 * 2. 사출 (kg) - 배출계수: 0.29 kgCO2/kg
 * 3. 압출 (kg) - 배출계수: 0.219 kgCO2/kg (신규 추가)
 * 4. 시트 (kg) - 배출계수: 0.192 kgCO2/kg
 * 5. 필름 (kg) - 배출계수: 0.219 kgCO2/kg
 * 
 * @param input LCA 입력 데이터
 * @returns 제품 제조 단계 탄소 배출량 (kgCO2)
 */
export function calculateProductStageEmission(input: LcaInput): number {
  const { processType, processValue } = input;
  
  if (processType === 'ELECTRICITY') {
    // ========================================
    // [총 전력 사용량 공정] - 엑셀 DB 시트 행 7
    // 배출계수: 0.478 kgCO2/kWh (한국 산업전력 기준)
    // ========================================
    return processValue * ELECTRICITY_EMISSION_PER_KWH;
  } else {
    // ========================================
    // [kg 기반 공정] - 사출, 압출, 필름, 시트
    // 각 공정별 배출계수 적용 (엑셀 DB 시트 행 8-11)
    // - 사출: 0.29 kgCO2/kg
    // - 압출: 0.219 kgCO2/kg
    // - 시트: 0.192 kgCO2/kg
    // - 필름: 0.219 kgCO2/kg
    // ========================================
    return processValue * PROCESS_EMISSION_PER_KG[processType as Exclude<ProcessType, 'ELECTRICITY'>];
  }
}

/**
 * 폐기 시 추가 배출량 계산
 * 퇴비화 시나리오에서 HDPE/LDPE/PP는 퇴비화 불가 → 소각 처리
 */
export function calculateDisposalEmission(
  input: LcaInput,
  resinMix: Record<ResinType, number>,
  scenarioName: 'GWG' | 'HDPE' | 'LDPE' | 'PP'
): number {
  // 펠릿 단계까지만 또는 제품 제조까지는 폐기 배출량 없음
  if (input.disposalMode === 'PELLET_ONLY' || input.disposalMode === 'TO_PRODUCT') {
    return 0;
  }

  // 퇴비화 시나리오
  if (input.disposalMode === 'COMPOST') {
    // HDPE, LDPE, PP는 퇴비화 불가 → 소각으로 처리
    if (scenarioName === 'HDPE' || scenarioName === 'LDPE' || scenarioName === 'PP') {
      // 소각 배출량으로 계산
      return input.totalProductionKg * DISPOSAL_EMISSION_PER_KG.ppPe;
    }
    // GWG는 퇴비화 가능 → 추가 배출량 0
    return 0;
  }

  // 소각 시 배출량 계산
  if (input.disposalMode === 'INCINERATION') {
    let disposalFactor = 0;

    for (const resin of Object.keys(resinMix) as ResinType[]) {
      const ratio = percentToRatio(resinMix[resin]);
      let factor = 0;

      // 레진 그룹에 따른 폐기 배출 계수 적용
      if (resin === 'TPS') {
        factor = DISPOSAL_EMISSION_PER_KG.tps;
      } else if (resin === 'PLA') {
        factor = DISPOSAL_EMISSION_PER_KG.pla;
      } else if (resin === 'PBAT') {
        factor = DISPOSAL_EMISSION_PER_KG.pbat;
      } else {
        // HDPE, LDPE, PP 계열은 모두 ppPe 사용
        factor = DISPOSAL_EMISSION_PER_KG.ppPe;
      }

      disposalFactor += ratio * factor;
    }

    return input.totalProductionKg * disposalFactor;
  }

  return 0;
}

/**
 * 시나리오별 결과 계산
 */
export function calculateScenarioResults(input: LcaInput): LcaResultSummary {
  const ton = input.totalProductionKg / 1000;
  
  // GWG 시나리오
  const gwgPellet = calculatePelletStageEmission(
    input,
    input.gwgResinMix,
    input.gwgAdditiveMix
  );
  const gwgGwgTransport = calculateGwgTransportEmission(input);
  const gwgProduct = calculateProductStageEmission(input);
  const gwgCustomerTransport = calculateCustomerTransportEmission(input);
  const gwgDisposal = calculateDisposalEmission(input, input.gwgResinMix, 'GWG');
  const gwgTotal = gwgPellet + gwgGwgTransport + gwgProduct + gwgCustomerTransport + gwgDisposal;

  const gwg: LcaScenarioResult = {
    name: 'GWG',
    pelletStageEmission: gwgPellet,
    gwgTransportEmission: gwgGwgTransport,
    productStageEmission: gwgProduct,
    customerTransportEmission: gwgCustomerTransport,
    totalEmission: gwgTotal,
    disposalAddedEmission: gwgDisposal,
  };

  // HDPE 시나리오 - 고정값 사용 (버진, 국내운송 기준)
  const hdpePellet = ton * FIXED_EMISSION_PER_TON.HDPE;
  const hdpeGwgTransport = 0; // 고정값에 이미 국내운송 포함
  const hdpeProduct = calculateProductStageEmission(input);
  const hdpeCustomerTransport = calculateCustomerTransportEmission(input);
  const hdpeDisposal = calculateDisposalEmission(input, { 
    TPS: 0, PLA: 0, PBAT: 0, 
    HDPE_VIRGIN: 100, HDPE_RECYCLE: 0, HDPE_BIO: 0,
    LDPE_VIRGIN: 0, LDPE_RECYCLE: 0, LDPE_BIO: 0,
    PP_VIRGIN: 0, PP_RECYCLE: 0, PP_BIO: 0 
  }, 'HDPE');
  const hdpeTotal = hdpePellet + hdpeGwgTransport + hdpeProduct + hdpeCustomerTransport + hdpeDisposal;

  const hdpe: LcaScenarioResult = {
    name: 'HDPE',
    pelletStageEmission: hdpePellet,
    gwgTransportEmission: hdpeGwgTransport,
    productStageEmission: hdpeProduct,
    customerTransportEmission: hdpeCustomerTransport,
    totalEmission: hdpeTotal,
    disposalAddedEmission: hdpeDisposal,
  };

  // LDPE 시나리오 - 고정값 사용 (버진, 국내운송 기준)
  const ldpePellet = ton * FIXED_EMISSION_PER_TON.LDPE;
  const ldpeGwgTransport = 0; // 고정값에 이미 국내운송 포함
  const ldpeProduct = calculateProductStageEmission(input);
  const ldpeCustomerTransport = calculateCustomerTransportEmission(input);
  const ldpeDisposal = calculateDisposalEmission(input, {
    TPS: 0, PLA: 0, PBAT: 0,
    HDPE_VIRGIN: 0, HDPE_RECYCLE: 0, HDPE_BIO: 0,
    LDPE_VIRGIN: 100, LDPE_RECYCLE: 0, LDPE_BIO: 0,
    PP_VIRGIN: 0, PP_RECYCLE: 0, PP_BIO: 0
  }, 'LDPE');
  const ldpeTotal = ldpePellet + ldpeGwgTransport + ldpeProduct + ldpeCustomerTransport + ldpeDisposal;

  const ldpe: LcaScenarioResult = {
    name: 'LDPE',
    pelletStageEmission: ldpePellet,
    gwgTransportEmission: ldpeGwgTransport,
    productStageEmission: ldpeProduct,
    customerTransportEmission: ldpeCustomerTransport,
    totalEmission: ldpeTotal,
    disposalAddedEmission: ldpeDisposal,
  };

  // PP 시나리오 - 고정값 사용 (버진, 국내운송 기준)
  const ppPellet = ton * FIXED_EMISSION_PER_TON.PP;
  const ppGwgTransport = 0; // 고정값에 이미 국내운송 포함
  const ppProduct = calculateProductStageEmission(input);
  const ppCustomerTransport = calculateCustomerTransportEmission(input);
  const ppDisposal = calculateDisposalEmission(input, {
    TPS: 0, PLA: 0, PBAT: 0,
    HDPE_VIRGIN: 0, HDPE_RECYCLE: 0, HDPE_BIO: 0,
    LDPE_VIRGIN: 0, LDPE_RECYCLE: 0, LDPE_BIO: 0,
    PP_VIRGIN: 100, PP_RECYCLE: 0, PP_BIO: 0
  }, 'PP');
  const ppTotal = ppPellet + ppGwgTransport + ppProduct + ppCustomerTransport + ppDisposal;

  const pp: LcaScenarioResult = {
    name: 'PP',
    pelletStageEmission: ppPellet,
    gwgTransportEmission: ppGwgTransport,
    productStageEmission: ppProduct,
    customerTransportEmission: ppCustomerTransport,
    totalEmission: ppTotal,
    disposalAddedEmission: ppDisposal,
  };

  return {
    scenarios: [gwg, hdpe, ldpe, pp],
    gwg,
    hdpe,
    ldpe,
    pp,
  };
}
