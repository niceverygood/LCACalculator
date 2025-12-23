import { useState, useMemo } from 'react';
import type { LcaInput, ResinType, AdditiveType } from './types/lca';
import { calculateScenarioResults } from './utils/lcaCalculator';
import Layout from './components/Layout';
import LcaForm from './components/LcaForm';
import LcaResult from './components/LcaResult';

// 기본 레진 배합 초기값
const defaultResinMix: Record<ResinType, number> = {
  TPS: 0.62,
  PLA: 0,
  PBAT: 0,
  HDPE_VIRGIN: 0,
  HDPE_RECYCLE: 0.28,
  HDPE_BIO: 0,
  LDPE_VIRGIN: 0,
  LDPE_RECYCLE: 0,
  LDPE_BIO: 0,
  PP_VIRGIN: 0,
  PP_RECYCLE: 0,
  PP_BIO: 0,
};

// 기본 첨가제 배합 초기값
const defaultAdditiveMix: Record<AdditiveType, number> = {
  TALC: 0.02,
  COCONUT: 0.02,
  BAMBOO: 0.02,
  CASTOR_OIL: 0.02,
  TAB_363: 0.02,
};

// 기본 LCA 입력값
const defaultInput: LcaInput = {
  totalProductionKg: 1000,
  gwgResinMix: defaultResinMix,
  gwgAdditiveMix: defaultAdditiveMix,
  pelletElectricityKwh: 0,
  pelletSeaKm: 1000,
  pelletLandKm: 0,
  productElectricityKwh: 0,
  sheetKg: 0,
  injectionKg: 0,
  filmKg: 600,
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

