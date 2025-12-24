import type { LcaInput, ResinType, AdditiveType, DisposalMode, ProcessType } from '../types/lca';
import {
  RESIN_TYPES,
  ADDITIVE_TYPES,
  PROCESS_TYPES,
  RESIN_LABELS,
  ADDITIVE_LABELS,
  DISPOSAL_LABELS,
  PROCESS_LABELS,
  PROCESS_UNITS,
} from '../types/lca';

interface LcaFormProps {
  value: LcaInput;
  onChange: (next: LcaInput) => void;
}

export default function LcaForm({ value, onChange }: LcaFormProps) {
  // 숫자 입력 핸들러 (NaN 방지)
  const handleNumberChange = (
    field: keyof LcaInput,
    inputValue: string
  ) => {
    const parsed = parseFloat(inputValue);
    const numValue = isNaN(parsed) ? 0 : parsed;
    onChange({ ...value, [field]: numValue });
  };

  // 레진 배합 비율 변경 핸들러 (% 단위)
  const handleResinChange = (resin: ResinType, inputValue: string) => {
    const parsed = parseFloat(inputValue);
    const numValue = isNaN(parsed) ? 0 : Math.max(0, parsed);
    onChange({
      ...value,
      gwgResinMix: { ...value.gwgResinMix, [resin]: numValue },
    });
  };

  // 첨가제 배합 비율 변경 핸들러 (% 단위)
  const handleAdditiveChange = (additive: AdditiveType, inputValue: string) => {
    const parsed = parseFloat(inputValue);
    const numValue = isNaN(parsed) ? 0 : Math.max(0, parsed);
    onChange({
      ...value,
      gwgAdditiveMix: { ...value.gwgAdditiveMix, [additive]: numValue },
    });
  };

  // 폐기 모드 변경 핸들러
  const handleDisposalChange = (mode: DisposalMode) => {
    onChange({ ...value, disposalMode: mode });
  };

  // 공정 타입 변경 핸들러
  const handleProcessTypeChange = (processType: ProcessType) => {
    onChange({ ...value, processType, processValue: 0 });
  };

  // 레진 합계 계산 (% 단위)
  const resinSum = Object.values(value.gwgResinMix).reduce(
    (acc, val) => acc + val,
    0
  );

  // 첨가제 합계 계산 (% 단위)
  const additiveSum = Object.values(value.gwgAdditiveMix).reduce(
    (acc, val) => acc + val,
    0
  );

  // 원료 + 첨가제 총합 (100%가 되어야 함)
  const totalSum = resinSum + additiveSum;
  const isTotalValid = Math.abs(totalSum - 100) < 0.01;

  return (
    <div className="lca-form">
      {/* 원료 배합 비율 섹션 */}
      <section className="form-section">
        <h2 className="section-title">원료 배합 비율 입력 (GWG 펠릿)</h2>
        <div className="input-grid">
          {RESIN_TYPES.map((resin) => (
            <div key={resin} className="input-group">
              <label htmlFor={`resin-${resin}`}>{RESIN_LABELS[resin]} (%)</label>
              <input
                type="number"
                id={`resin-${resin}`}
                value={value.gwgResinMix[resin] || ''}
                onChange={(e) => handleResinChange(resin, e.target.value)}
                placeholder="0"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          ))}
        </div>
        <div className="sum-display valid">
          <span>원료 합계: {resinSum.toFixed(2)}%</span>
        </div>
      </section>

      {/* 첨가제 배합 비율 섹션 */}
      <section className="form-section">
        <h2 className="section-title">첨가제 배합 비율 입력</h2>
        <div className="input-grid">
          {ADDITIVE_TYPES.map((additive) => (
            <div key={additive} className="input-group">
              <label htmlFor={`additive-${additive}`}>
                {ADDITIVE_LABELS[additive]} (%)
              </label>
              <input
                type="number"
                id={`additive-${additive}`}
                value={value.gwgAdditiveMix[additive] || ''}
                onChange={(e) => handleAdditiveChange(additive, e.target.value)}
                placeholder="0"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          ))}
        </div>
        <div className="sum-display valid">
          <span>첨가제 합계: {additiveSum.toFixed(2)}%</span>
        </div>
      </section>

      {/* 원료 + 첨가제 총합 표시 */}
      <section className="form-section">
        <div className={`sum-display ${isTotalValid ? 'valid' : 'warning'}`}>
          <span>📊 원료 + 첨가제 총합: {totalSum.toFixed(2)}%</span>
          {!isTotalValid && (
            <span className="warning-text">⚠️ 총합이 100%가 되어야 합니다!</span>
          )}
        </div>
      </section>

      {/* 총 생산량 및 펠릿 공정 섹션 */}
      <section className="form-section">
        <h2 className="section-title">총 생산량 및 펠릿 공정</h2>
        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="totalProductionKg">총 생산량 (kg)</label>
            <input
              type="number"
              id="totalProductionKg"
              value={value.totalProductionKg || ''}
              onChange={(e) => handleNumberChange('totalProductionKg', e.target.value)}
              placeholder="1000"
              min="0"
            />
          </div>
          <div className="input-group">
            <label htmlFor="pelletElectricityKwh">펠릿 전력 사용량 (kWh)</label>
            <input
              type="number"
              id="pelletElectricityKwh"
              value={value.pelletElectricityKwh || ''}
              onChange={(e) => handleNumberChange('pelletElectricityKwh', e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
        </div>
      </section>

      {/* 그린웨일 글로벌 운송 섹션 */}
      <section className="form-section">
        <h2 className="section-title">그린웨일 글로벌 운송 (펠릿 → 고객사)</h2>
        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="gwgSeaKm">해상 운송 거리 (km)</label>
            <input
              type="number"
              id="gwgSeaKm"
              value={value.gwgSeaKm || ''}
              onChange={(e) => handleNumberChange('gwgSeaKm', e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
          <div className="input-group">
            <label htmlFor="gwgLandKm">육상 운송 거리 (km)</label>
            <input
              type="number"
              id="gwgLandKm"
              value={value.gwgLandKm || ''}
              onChange={(e) => handleNumberChange('gwgLandKm', e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
        </div>
      </section>

      {/* 고객사 제조 공정 입력 섹션 (4개 중 1개 선택) */}
      <section className="form-section">
        <h2 className="section-title">고객사 제조 공정 (1개 선택)</h2>
        <div className="input-group" style={{ marginBottom: '12px' }}>
          <label htmlFor="processType">공정 방식 선택</label>
          <select
            id="processType"
            value={value.processType}
            onChange={(e) => handleProcessTypeChange(e.target.value as ProcessType)}
          >
            {PROCESS_TYPES.map((type) => (
              <option key={type} value={type}>
                {PROCESS_LABELS[type]}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="processValue">
            {PROCESS_LABELS[value.processType]}
          </label>
          <input
            type="number"
            id="processValue"
            value={value.processValue || ''}
            onChange={(e) => handleNumberChange('processValue', e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
          />
        </div>
      </section>

      {/* 고객사 운송 섹션 */}
      <section className="form-section">
        <h2 className="section-title">고객사 운송 (제품 → 최종 목적지)</h2>
        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="customerSeaKm">해상 운송 거리 (km)</label>
            <input
              type="number"
              id="customerSeaKm"
              value={value.customerSeaKm || ''}
              onChange={(e) => handleNumberChange('customerSeaKm', e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
          <div className="input-group">
            <label htmlFor="customerLandKm">육상 운송 거리 (km)</label>
            <input
              type="number"
              id="customerLandKm"
              value={value.customerLandKm || ''}
              onChange={(e) => handleNumberChange('customerLandKm', e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
        </div>
      </section>

      {/* 폐기 시나리오 섹션 */}
      <section className="form-section">
        <h2 className="section-title">폐기 시나리오</h2>
        <div className="input-group">
          <label htmlFor="disposalMode">폐기 방식 선택</label>
          <select
            id="disposalMode"
            value={value.disposalMode}
            onChange={(e) => handleDisposalChange(e.target.value as DisposalMode)}
          >
            {(Object.keys(DISPOSAL_LABELS) as DisposalMode[]).map((mode) => (
              <option key={mode} value={mode}>
                {DISPOSAL_LABELS[mode]}
              </option>
            ))}
          </select>
        </div>
        {value.disposalMode === 'COMPOST' && (
          <div className="sum-display warning" style={{ marginTop: '12px' }}>
            <span>ℹ️ HDPE, LDPE, PP는 퇴비화 불가 → 소각 처리로 계산됩니다</span>
          </div>
        )}
      </section>
    </div>
  );
}
