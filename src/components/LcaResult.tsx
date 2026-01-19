import type { LcaResultSummary, LcaScenarioResult } from '../types/lca';
import ComparisonBar from './ComparisonBar';
import { useLanguage } from '../i18n';

interface LcaResultProps {
  result: LcaResultSummary;
}

export default function LcaResult({ result }: LcaResultProps) {
  const { t } = useLanguage();
  const { gwg, hdpe, ldpe, pp, scenarios } = result;

  // 바 차트를 위한 최댓값 계산
  const maxEmission = Math.max(
    ...scenarios.map((s) => Math.abs(s.totalEmission))
  );

  // 차이 계산 헬퍼
  const getDiff = (scenario: LcaScenarioResult, base: LcaScenarioResult) => {
    const diff = scenario.totalEmission - base.totalEmission;
    return diff;
  };

  // 시나리오별 색상
  const scenarioColors: Record<string, string> = {
    GWG: '#22c55e',
    HDPE: '#ef4444',
    LDPE: '#f97316',
    PP: '#8b5cf6',
  };

  return (
    <div className="lca-result">
      {/* GWG 펠릿 기준 요약 카드 - 소수점 3째 자리 반올림 */}
      <section className="result-card summary-card">
        <h2 className="section-title">{t('resultSummaryTitle')}</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">{t('pelletEmission')}</span>
            <span className="summary-value">
              {gwg.pelletStageEmission.toFixed(3)} <small>{t('kgCO2')}</small>
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">{t('gwgTransportEmission')}</span>
            <span className="summary-value">
              {gwg.gwgTransportEmission.toFixed(3)} <small>{t('kgCO2')}</small>
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">{t('productEmission')}</span>
            <span className="summary-value">
              {gwg.productStageEmission.toFixed(3)} <small>{t('kgCO2')}</small>
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">{t('customerTransportEmission')}</span>
            <span className="summary-value">
              {gwg.customerTransportEmission.toFixed(3)} <small>{t('kgCO2')}</small>
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">{t('disposalEmission')}</span>
            <span className="summary-value">
              {gwg.disposalAddedEmission.toFixed(3)} <small>{t('kgCO2')}</small>
            </span>
          </div>
          <div className="summary-item highlight">
            <span className="summary-label">{t('totalEmission')}</span>
            <span className="summary-value total">
              {gwg.totalEmission.toFixed(3)} <small>{t('kgCO2')}</small>
            </span>
          </div>
        </div>
      </section>

      {/* 비교 테이블 */}
      <section className="result-card">
        <h2 className="section-title">{t('resultComparisonTitle')}</h2>
        <div className="table-container">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>{t('tableType')}</th>
                <th>{t('tablePellet')}</th>
                <th>{t('tableGwgTransport')}</th>
                <th>{t('tableProduct')}</th>
                <th>{t('tableCustomerTransport')}</th>
                <th>{t('tableDisposal')}</th>
                <th>{t('tableTotal')}</th>
                <th>{t('tableVsGwg')}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="gwg-row">
                <td>
                  <span className="scenario-badge gwg">GWG</span>
                </td>
                <td>{gwg.pelletStageEmission.toFixed(1)}</td>
                <td>{gwg.gwgTransportEmission.toFixed(1)}</td>
                <td>{gwg.productStageEmission.toFixed(1)}</td>
                <td>{gwg.customerTransportEmission.toFixed(1)}</td>
                <td>{gwg.disposalAddedEmission.toFixed(1)}</td>
                <td className="total-cell">{gwg.totalEmission.toFixed(1)}</td>
                <td>-</td>
              </tr>
              <tr>
                <td>
                  <span className="scenario-badge hdpe">HDPE</span>
                </td>
                <td>{hdpe.pelletStageEmission.toFixed(1)}</td>
                <td>{hdpe.gwgTransportEmission.toFixed(1)}</td>
                <td>{hdpe.productStageEmission.toFixed(1)}</td>
                <td>{hdpe.customerTransportEmission.toFixed(1)}</td>
                <td>{hdpe.disposalAddedEmission.toFixed(1)}</td>
                <td className="total-cell">{hdpe.totalEmission.toFixed(1)}</td>
                <td className={getDiff(hdpe, gwg) > 0 ? 'diff-positive' : 'diff-negative'}>
                  {getDiff(hdpe, gwg) > 0 ? '+' : ''}
                  {getDiff(hdpe, gwg).toFixed(1)}
                </td>
              </tr>
              <tr>
                <td>
                  <span className="scenario-badge ldpe">LDPE</span>
                </td>
                <td>{ldpe.pelletStageEmission.toFixed(1)}</td>
                <td>{ldpe.gwgTransportEmission.toFixed(1)}</td>
                <td>{ldpe.productStageEmission.toFixed(1)}</td>
                <td>{ldpe.customerTransportEmission.toFixed(1)}</td>
                <td>{ldpe.disposalAddedEmission.toFixed(1)}</td>
                <td className="total-cell">{ldpe.totalEmission.toFixed(1)}</td>
                <td className={getDiff(ldpe, gwg) > 0 ? 'diff-positive' : 'diff-negative'}>
                  {getDiff(ldpe, gwg) > 0 ? '+' : ''}
                  {getDiff(ldpe, gwg).toFixed(1)}
                </td>
              </tr>
              <tr>
                <td>
                  <span className="scenario-badge pp">PP</span>
                </td>
                <td>{pp.pelletStageEmission.toFixed(1)}</td>
                <td>{pp.gwgTransportEmission.toFixed(1)}</td>
                <td>{pp.productStageEmission.toFixed(1)}</td>
                <td>{pp.customerTransportEmission.toFixed(1)}</td>
                <td>{pp.disposalAddedEmission.toFixed(1)}</td>
                <td className="total-cell">{pp.totalEmission.toFixed(1)}</td>
                <td className={getDiff(pp, gwg) > 0 ? 'diff-positive' : 'diff-negative'}>
                  {getDiff(pp, gwg) > 0 ? '+' : ''}
                  {getDiff(pp, gwg).toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="table-note">
          {t('tableNote')}
          <br />
          {t('tableNote2')}
        </p>
      </section>

      {/* 비교 바 차트 */}
      <section className="result-card">
        <h2 className="section-title">{t('resultChartTitle')}</h2>
        <div className="bar-chart-container">
          {scenarios.map((scenario) => (
            <ComparisonBar
              key={scenario.name}
              label={scenario.name}
              value={scenario.totalEmission}
              max={maxEmission}
              color={scenarioColors[scenario.name]}
            />
          ))}
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#22c55e' }} />
            <span>{t('legendGwg')}</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#ef4444' }} />
            <span>{t('legendHdpe')}</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#f97316' }} />
            <span>{t('legendLdpe')}</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#8b5cf6' }} />
            <span>{t('legendPp')}</span>
          </div>
        </div>
      </section>

      {/* 환경 영향 분석 */}
      <section className="result-card analysis-card">
        <h2 className="section-title">{t('resultAnalysisTitle')}</h2>
        <div className="analysis-content">
          {gwg.totalEmission < hdpe.totalEmission &&
          gwg.totalEmission < ldpe.totalEmission &&
          gwg.totalEmission < pp.totalEmission ? (
            <div className="analysis-positive">
              <span className="analysis-icon">🌱</span>
              <div>
                <strong>{t('analysisPositiveTitle')}</strong>
                <p>
                  HDPE {t('analysisPositiveVs')} <strong>{(hdpe.totalEmission - gwg.totalEmission).toFixed(2)} {t('kgCO2')}</strong> {t('analysisPositiveSaved')}
                  <br />
                  LDPE {t('analysisPositiveVs')} <strong>{(ldpe.totalEmission - gwg.totalEmission).toFixed(2)} {t('kgCO2')}</strong> {t('analysisPositiveSaved')}
                  <br />
                  PP {t('analysisPositiveVs')} <strong>{(pp.totalEmission - gwg.totalEmission).toFixed(2)} {t('kgCO2')}</strong> {t('analysisPositiveSaved')}
                </p>
              </div>
            </div>
          ) : (
            <div className="analysis-neutral">
              <span className="analysis-icon">📊</span>
              <div>
                <strong>{t('analysisNeutralTitle')}</strong>
                <p>{t('analysisNeutralDesc')}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
