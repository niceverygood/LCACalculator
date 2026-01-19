import type { LcaInput, ResinType, AdditiveType, DisposalMode, ProcessType } from '../types/lca';
import {
  RESIN_TYPES,
  ADDITIVE_TYPES,
  PROCESS_TYPES,
} from '../types/lca';
import { useLanguage } from '../i18n';

interface LcaFormProps {
  value: LcaInput;
  onChange: (next: LcaInput) => void;
}

// Resin key to translation key mapping
const RESIN_TRANSLATION_KEYS: Record<ResinType, string> = {
  TPS: 'resinTPS',
  PLA: 'resinPLA',
  PBAT: 'resinPBAT',
  HDPE_VIRGIN: 'resinHDPE_VIRGIN',
  HDPE_RECYCLE: 'resinHDPE_RECYCLE',
  HDPE_BIO: 'resinHDPE_BIO',
  LDPE_VIRGIN: 'resinLDPE_VIRGIN',
  LDPE_RECYCLE: 'resinLDPE_RECYCLE',
  LDPE_BIO: 'resinLDPE_BIO',
  PP_VIRGIN: 'resinPP_VIRGIN',
  PP_RECYCLE: 'resinPP_RECYCLE',
  PP_BIO: 'resinPP_BIO',
};

// Additive labels (not translated)
const ADDITIVE_LABELS: Record<AdditiveType, string> = {
  BIOMASS_1: 'Biomass 1',
  BIOMASS_2: 'Biomass 2',
  ADDITIVE_1: 'Additive 1',
  ADDITIVE_2: 'Additive 2',
  ADDITIVE_3: 'Additive 3',
};

// Process type to translation key mapping
// 엑셀 DB 시트 기준 5개 공정 방식 모두 포함
const PROCESS_TRANSLATION_KEYS: Record<ProcessType, string> = {
  ELECTRICITY: 'processElectricity',
  INJECTION: 'processInjection',
  EXTRUSION: 'processExtrusion',  // 신규 추가: 압출 공정
  FILM: 'processFilm',
  SHEET: 'processSheet',
};

// Disposal mode to translation key mapping
const DISPOSAL_TRANSLATION_KEYS: Record<DisposalMode, string> = {
  PELLET_ONLY: 'disposalPelletOnly',
  TO_PRODUCT: 'disposalToProduct',
  COMPOST: 'disposalCompost',
  INCINERATION: 'disposalIncineration',
};

export default function LcaForm({ value, onChange }: LcaFormProps) {
  const { t } = useLanguage();

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
        <h2 className="section-title">{t('resinSection')}</h2>
        <div className="input-grid">
          {RESIN_TYPES.map((resin) => (
            <div key={resin} className="input-group">
              <label htmlFor={`resin-${resin}`}>
                {t(RESIN_TRANSLATION_KEYS[resin] as any)} (%)
              </label>
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
          <span>{t('resinSum')}: {resinSum.toFixed(2)}%</span>
        </div>
      </section>

      {/* 첨가제 배합 비율 섹션 */}
      <section className="form-section">
        <h2 className="section-title">{t('additiveSection')}</h2>
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
          <span>{t('additiveSum')}: {additiveSum.toFixed(2)}%</span>
        </div>
      </section>

      {/* 원료 + 첨가제 총합 표시 */}
      <section className="form-section">
        <div className={`sum-display ${isTotalValid ? 'valid' : 'warning'}`}>
          <span>📊 {t('totalSum')}: {totalSum.toFixed(2)}%</span>
          {!isTotalValid && (
            <span className="warning-text">{t('totalWarning')}</span>
          )}
        </div>
      </section>

      {/* 총 생산량 및 펠릿 공정 섹션 */}
      <section className="form-section">
        <h2 className="section-title">{t('productionSection')}</h2>
        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="totalProductionKg">{t('totalProduction')}</label>
            <input
              type="number"
              id="totalProductionKg"
              value={value.totalProductionKg || ''}
              onChange={(e) => handleNumberChange('totalProductionKg', e.target.value)}
              placeholder="1000"
              min="0"
            />
          </div>
          {/* 수득율 입력 필드 - 사용자가 변경 가능 */}
          <div className="input-group">
            <label htmlFor="yieldRate">{t('yieldRate')}</label>
            <input
              type="number"
              id="yieldRate"
              value={value.yieldRate || ''}
              onChange={(e) => handleNumberChange('yieldRate', e.target.value)}
              placeholder="95"
              min="1"
              max="100"
              step="0.1"
            />
          </div>
          <div className="input-group">
            <label htmlFor="pelletElectricityKwh">{t('pelletElectricity')}</label>
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
        <h2 className="section-title">{t('gwgTransportSection')}</h2>
        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="gwgSeaKm">{t('seaTransport')}</label>
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
            <label htmlFor="gwgLandKm">{t('landTransport')}</label>
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
        <h2 className="section-title">{t('customerProcessSection')}</h2>
        <div className="input-group" style={{ marginBottom: '12px' }}>
          <label htmlFor="processType">{t('processType')}</label>
          <select
            id="processType"
            value={value.processType}
            onChange={(e) => handleProcessTypeChange(e.target.value as ProcessType)}
          >
            {PROCESS_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(PROCESS_TRANSLATION_KEYS[type] as any)}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="processValue">
            {t(PROCESS_TRANSLATION_KEYS[value.processType] as any)}
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
        <h2 className="section-title">{t('customerTransportSection')}</h2>
        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="customerSeaKm">{t('seaTransport')}</label>
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
            <label htmlFor="customerLandKm">{t('landTransport')}</label>
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
        <h2 className="section-title">{t('disposalSection')}</h2>
        <div className="input-group">
          <label htmlFor="disposalMode">{t('disposalMode')}</label>
          <select
            id="disposalMode"
            value={value.disposalMode}
            onChange={(e) => handleDisposalChange(e.target.value as DisposalMode)}
          >
            {(['PELLET_ONLY', 'TO_PRODUCT', 'COMPOST', 'INCINERATION'] as DisposalMode[]).map((mode) => (
              <option key={mode} value={mode}>
                {t(DISPOSAL_TRANSLATION_KEYS[mode] as any)}
              </option>
            ))}
          </select>
        </div>
        {value.disposalMode === 'COMPOST' && (
          <div className="sum-display warning" style={{ marginTop: '12px' }}>
            <span>{t('compostWarning')}</span>
          </div>
        )}
      </section>
    </div>
  );
}
