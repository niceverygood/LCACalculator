import { useState, useMemo } from 'react';
import type { LcaInput, ResinType, AdditiveType } from './types/lca';
import { calculateScenarioResults } from './utils/lcaCalculator';
import Layout from './components/Layout';
import LcaForm from './components/LcaForm';
import LcaResult from './components/LcaResult';

// 기본 레진 배합 초기값 (% 단위)
const defaultResinMix: Record<ResinType, number> = {
  TPS: 62,
  PLA: 0,
  PBAT: 0,
  HDPE_VIRGIN: 0,
  HDPE_RECYCLE: 28,
  HDPE_BIO: 0,
  LDPE_VIRGIN: 0,
  LDPE_RECYCLE: 0,
  LDPE_BIO: 0,
  PP_VIRGIN: 0,
  PP_RECYCLE: 0,
  PP_BIO: 0,
};

// 기본 첨가제 배합 초기값 (% 단위) - 원료 + 첨가제 합이 100%
const defaultAdditiveMix: Record<AdditiveType, number> = {
  BIOMASS_1: 2,
  BIOMASS_2: 2,
  ADDITIVE_1: 2,
  ADDITIVE_2: 2,
  ADDITIVE_3: 2,
};

// 기본 LCA 입력값
const defaultInput: LcaInput = {
  totalProductionKg: 1000,
  gwgResinMix: defaultResinMix,
  gwgAdditiveMix: defaultAdditiveMix,
  pelletElectricityKwh: 0,
  // 그린웨일 글로벌 운송
  gwgSeaKm: 1000,
  gwgLandKm: 0,
  // 고객사 운송
  customerSeaKm: 0,
  customerLandKm: 100,
  // 고객사 제조 공정 (4개 중 1개 선택)
  processType: 'FILM',
  processValue: 600,
  disposalMode: 'PELLET_ONLY',
};

function App() {
  const [input, setInput] = useState<LcaInput>(defaultInput);

  // 입력값이 변경될 때마다 결과 재계산
  const result = useMemo(() => {
    return calculateScenarioResults(input);
  }, [input]);

  return (
    <Layout
      left={<LcaForm value={input} onChange={setInput} />}
      right={<LcaResult result={result} />}
    />
  );
}

export default App;
