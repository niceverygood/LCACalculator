import type {
  ResinType,
  AdditiveType,
  LcaInput,
  LcaScenarioResult,
  LcaResultSummary,
} from '../types/lca';

import {
  RESIN_EMISSION_PER_KG,
  ADDITIVE_EMISSION_PER_KG,
  ELECTRICITY_EMISSION_PER_KWH,
  PROCESS_EMISSION_PER_KG,
  TRANSPORT_EMISSION,
  DISPOSAL_EMISSION_PER_KG,
  HDPE_BASE_MIX,
  LDPE_BASE_MIX,
  PP_BASE_MIX,
  EMPTY_ADDITIVE_MIX,
} from '../data/emissionFactors';

/**
 * 배합 비율을 정규화 (합계가 1이 되도록)
 * 합계가 0이면 그대로 반환
 */
export function normalizeMix<T extends string>(
  mix: Record<T, number>
): Record<T, number> {
  const sum = Object.values(mix).reduce(
    (acc: number, val) => acc + (val as number),
    0
  );

  if (sum === 0) {
    return mix;
  }

  const normalized = {} as Record<T, number>;
  for (const key of Object.keys(mix) as T[]) {
    normalized[key] = mix[key] / sum;
  }
  return normalized;
}

/**
 * 펠릿 단계까지의 탄소 배출량 계산
 */
export function calculatePelletStageEmission(
  input: LcaInput,
  resinMix: Record<ResinType, number>,
  additiveMix: Record<AdditiveType, number>
): number {
  const normalizedResin = normalizeMix(resinMix);
  const normalizedAdditive = normalizeMix(additiveMix);
  const totalKg = input.totalProductionKg;
  const ton = totalKg / 1000;

  // 레진 배출량
  let resinEmission = 0;
  for (const resin of Object.keys(normalizedResin) as ResinType[]) {
    resinEmission += normalizedResin[resin] * RESIN_EMISSION_PER_KG[resin];
  }
  resinEmission *= totalKg;

  // 첨가제 배출량
  let additiveEmission = 0;
  const additiveSum = Object.values(additiveMix).reduce(
    (acc, val) => acc + val,
    0
  );
  if (additiveSum > 0) {
    for (const additive of Object.keys(normalizedAdditive) as AdditiveType[]) {
      additiveEmission +=
        normalizedAdditive[additive] * ADDITIVE_EMISSION_PER_KG[additive];
    }
    additiveEmission *= totalKg;
  }

  // 전력 배출량
  const electricEmission =
    input.pelletElectricityKwh * ELECTRICITY_EMISSION_PER_KWH;

  // 운송 배출량
  const transportEmission =
    ton *
    (input.pelletSeaKm * TRANSPORT_EMISSION.seaTonKm +
      input.pelletLandKm * TRANSPORT_EMISSION.landTonKm);

  return resinEmission + additiveEmission + electricEmission + transportEmission;
}

/**
 * 제품 제조 단계의 추가 배출량 계산
 */
export function calculateProductStageEmission(input: LcaInput): number {
  // 전력 배출량
  const electricEmission =
    input.productElectricityKwh * ELECTRICITY_EMISSION_PER_KWH;

  // 공정별 배출량
  const sheetEmission = input.sheetKg * PROCESS_EMISSION_PER_KG.sheet;
  const injectionEmission = input.injectionKg * PROCESS_EMISSION_PER_KG.injection;
  const filmEmission = input.filmKg * PROCESS_EMISSION_PER_KG.film;

  return electricEmission + sheetEmission + injectionEmission + filmEmission;
}

/**
 * 폐기 시 추가 배출량 계산
 */
export function calculateDisposalEmission(
  input: LcaInput,
  resinMix: Record<ResinType, number>
): number {
  // 펠릿 단계까지만 또는 제품 제조까지는 폐기 배출량 없음
  if (input.disposalMode === 'PELLET_ONLY' || input.disposalMode === 'TO_PRODUCT') {
    return 0;
  }

  // 퇴비화는 추가 배출량 0으로 가정
  if (input.disposalMode === 'COMPOST') {
    return 0;
  }

  // 소각 시 배출량 계산
  if (input.disposalMode === 'INCINERATION') {
    const normalizedResin = normalizeMix(resinMix);
    let disposalFactor = 0;

    for (const resin of Object.keys(normalizedResin) as ResinType[]) {
      const ratio = normalizedResin[resin];
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
  // GWG 시나리오
  const gwgPellet = calculatePelletStageEmission(
    input,
    input.gwgResinMix,
    input.gwgAdditiveMix
  );
  const gwgProduct = calculateProductStageEmission(input);
  const gwgDisposal = calculateDisposalEmission(input, input.gwgResinMix);
  const gwgTotal = gwgPellet + gwgProduct + gwgDisposal;

  const gwg: LcaScenarioResult = {
    name: 'GWG',
    pelletStageEmission: gwgPellet,
    productStageEmission: gwgProduct,
    totalEmission: gwgTotal,
    disposalAddedEmission: gwgDisposal,
  };

  // HDPE 시나리오
  const hdpePellet = calculatePelletStageEmission(
    input,
    HDPE_BASE_MIX,
    EMPTY_ADDITIVE_MIX
  );
  const hdpeProduct = calculateProductStageEmission(input);
  const hdpeDisposal = calculateDisposalEmission(input, HDPE_BASE_MIX);
  const hdpeTotal = hdpePellet + hdpeProduct + hdpeDisposal;

  const hdpe: LcaScenarioResult = {
    name: 'HDPE',
    pelletStageEmission: hdpePellet,
    productStageEmission: hdpeProduct,
    totalEmission: hdpeTotal,
    disposalAddedEmission: hdpeDisposal,
  };

  // LDPE 시나리오
  const ldpePellet = calculatePelletStageEmission(
    input,
    LDPE_BASE_MIX,
    EMPTY_ADDITIVE_MIX
  );
  const ldpeProduct = calculateProductStageEmission(input);
  const ldpeDisposal = calculateDisposalEmission(input, LDPE_BASE_MIX);
  const ldpeTotal = ldpePellet + ldpeProduct + ldpeDisposal;

  const ldpe: LcaScenarioResult = {
    name: 'LDPE',
    pelletStageEmission: ldpePellet,
    productStageEmission: ldpeProduct,
    totalEmission: ldpeTotal,
    disposalAddedEmission: ldpeDisposal,
  };

  // PP 시나리오
  const ppPellet = calculatePelletStageEmission(
    input,
    PP_BASE_MIX,
    EMPTY_ADDITIVE_MIX
  );
  const ppProduct = calculateProductStageEmission(input);
  const ppDisposal = calculateDisposalEmission(input, PP_BASE_MIX);
  const ppTotal = ppPellet + ppProduct + ppDisposal;

  const pp: LcaScenarioResult = {
    name: 'PP',
    pelletStageEmission: ppPellet,
    productStageEmission: ppProduct,
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

