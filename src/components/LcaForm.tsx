import type { LcaInput, ResinType, AdditiveType, DisposalMode } from '../types/lca';
import {
  RESIN_TYPES,
  ADDITIVE_TYPES,
  RESIN_LABELS,
  ADDITIVE_LABELS,
  DISPOSAL_LABELS,
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

  // 레진 배합 비율 변경 핸들러
  const handleResinChange = (resin: ResinType, inputValue: string) => {
    const parsed = parseFloat(inputValue);
    const numValue = isNaN(parsed) ? 0 : Math.max(0, parsed);
    onChange({
      ...value,
      gwgResinMix: { ...value.gwgResinMix, [resin]: numValue },
    });
  };

  // 첨가제 배합 비율 변경 핸들러
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

  // 레진 합계 계산
  const resinSum = Object.values(value.gwgResinMix).reduce(
    (acc, val) => acc + val,
    0
  );

  // 첨가제 합계 계산
  const additiveSum = Object.values(value.gwgAdditiveMix).reduce(
    (acc, val) => acc + val,
    0
  );

  return (
    <div className="lca-form">
      {/* 원료 배합 비율 섹션 */}
      <section className="form-section">
        <h2 className="section-title">원료 배합 비율 입력 (GWG 펠릿)</h2>
        <div className="input-grid">
          {RESIN_TYPES.map((resin) => (
            <div key={resin} className="input-group">
              <label htmlFor={`resin-${resin}`}>{RESIN_LABELS[resin]}</label>
              <input
                type="number"
                id={`resin-${resin}`}
                value={value.gwgResinMix[resin] || ''}
                onChange={(e) => handleResinChange(resin, e.target.value)}
                placeholder="0"
                min="0"
                max="1"
                step="0.01"
              />
            </div>
          ))}
        </div>
        <div className={`sum-display ${Math.abs(resinSum - 1) > 0.01 ? 'warning' : 'valid'}`}>
          <span>현재 합계: {resinSum.toFixed(2)}</span>
          {Math.abs(resinSum - 1) > 0.01 && (
            <span className="warning-text">⚠️ 합계가 1이 아닙니다!</span>
          )}
        </div>
      </section>

      {/* 첨가제 배합 비율 섹션 */}
      <section className="form-section">
        <h2 className="section-title">첨가제 배합 비율 입력</h2>
        <div className="input-grid">
          {ADDITIVE_TYPES.map((additive) => (
            <div key={additive} className="input-group">
              <label htmlFor={`additive-${additive}`}>
                {ADDITIVE_LABELS[additive]}
              </label>
              <input
                type="number"
                id={`additive-${additive}`}
                value={value.gwgAdditiveMix[additive] || ''}
                onChange={(e) => handleAdditiveChange(additive, e.target.value)}
                placeholder="0"
                min="0"
                max="1"
                step="0.01"
              />
            </div>
          ))}
        </div>
        <div className={`sum-display ${additiveSum > 0 && Math.abs(additiveSum - 1) > 0.01 ? 'warning' : 'valid'}`}>
          <span>현재 합계: {additiveSum.toFixed(2)}</span>
          {additiveSum > 0 && Math.abs(additiveSum - 1) > 0.01 && (
            <span className="warning-text">⚠️ 합계가 1이 아닙니다!</span>
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
          <div className="input-group">
            <label htmlFor="pelletSeaKm">해상 운송 거리 (km)</label>
            <input
              type="number"
              id="pelletSeaKm"
              value={value.pelletSeaKm || ''}
              onChange={(e) => handleNumberChange('pelletSeaKm', e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
          <div className="input-group">
            <label htmlFor="pelletLandKm">육상 운송 거리 (km)</label>
            <input
              type="number"
              id="pelletLandKm"
              value={value.pelletLandKm || ''}
              onChange={(e) => handleNumberChange('pelletLandKm', e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
        </div>
      </section>

      {/* 제품 제조 공정 입력 섹션 */}
      <section className="form-section">
        <h2 className="section-title">제품 제조 공정 입력</h2>
        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="productElectricityKwh">2차 제조 전력 사용량 (kWh)</label>
            <input
              type="number"
              id="productElectricityKwh"
              value={value.productElectricityKwh || ''}
              onChange={(e) => handleNumberChange('productElectricityKwh', e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
          <div className="input-group">
            <label htmlFor="injectionKg">사출 공정 원료량 (kg)</label>
            <input
              type="number"
              id="injectionKg"
              value={value.injectionKg || ''}
              onChange={(e) => handleNumberChange('injectionKg', e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
          <div className="input-group">
            <label htmlFor="filmKg">필름 공정 원료량 (kg)</label>
            <input
              type="number"
              id="filmKg"
              value={value.filmKg || ''}
              onChange={(e) => handleNumberChange('filmKg', e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
          <div className="input-group">
            <label htmlFor="sheetKg">시트 공정 원료량 (kg)</label>
            <input
              type="number"
              id="sheetKg"
              value={value.sheetKg || ''}
              onChange={(e) => handleNumberChange('sheetKg', e.target.value)}
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
      </section>
    </div>
  );
}

