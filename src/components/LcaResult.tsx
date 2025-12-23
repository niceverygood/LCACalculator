import type { LcaResultSummary, LcaScenarioResult } from '../types/lca';
import ComparisonBar from './ComparisonBar';

interface LcaResultProps {
  result: LcaResultSummary;
}

export default function LcaResult({ result }: LcaResultProps) {
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
      {/* GWG 펠릿 기준 요약 카드 */}
      <section className="result-card summary-card">
        <h2 className="section-title">GWG 펠릿 기준 요약</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">펠릿 단계 배출량</span>
            <span className="summary-value">
              {gwg.pelletStageEmission.toFixed(2)} <small>kg CO₂</small>
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">제품 제조 추가 배출량</span>
            <span className="summary-value">
              {gwg.productStageEmission.toFixed(2)} <small>kg CO₂</small>
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">폐기 추가 배출량</span>
            <span className="summary-value">
              {gwg.disposalAddedEmission.toFixed(2)} <small>kg CO₂</small>
            </span>
          </div>
          <div className="summary-item highlight">
            <span className="summary-label">총 탄소 배출량</span>
            <span className="summary-value total">
              {gwg.totalEmission.toFixed(2)} <small>kg CO₂</small>
            </span>
          </div>
        </div>
      </section>

      {/* 비교 테이블 */}
      <section className="result-card">
        <h2 className="section-title">탄소 배출량 비교 (GWG vs HDPE/LDPE/PP)</h2>
        <div className="table-container">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>종류</th>
                <th>펠릿 단계</th>
                <th>제품 제조</th>
                <th>폐기 포함</th>
                <th>총합</th>
                <th>GWG 대비</th>
              </tr>
            </thead>
            <tbody>
              <tr className="gwg-row">
                <td>
                  <span className="scenario-badge gwg">GWG</span>
                </td>
                <td>{gwg.pelletStageEmission.toFixed(2)}</td>
                <td>{gwg.productStageEmission.toFixed(2)}</td>
                <td>{gwg.disposalAddedEmission.toFixed(2)}</td>
                <td className="total-cell">{gwg.totalEmission.toFixed(2)}</td>
                <td>-</td>
              </tr>
              <tr>
                <td>
                  <span className="scenario-badge hdpe">HDPE</span>
                </td>
                <td>{hdpe.pelletStageEmission.toFixed(2)}</td>
                <td>{hdpe.productStageEmission.toFixed(2)}</td>
                <td>{hdpe.disposalAddedEmission.toFixed(2)}</td>
                <td className="total-cell">{hdpe.totalEmission.toFixed(2)}</td>
                <td className={getDiff(hdpe, gwg) > 0 ? 'diff-positive' : 'diff-negative'}>
                  {getDiff(hdpe, gwg) > 0 ? '+' : ''}
                  {getDiff(hdpe, gwg).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td>
                  <span className="scenario-badge ldpe">LDPE</span>
                </td>
                <td>{ldpe.pelletStageEmission.toFixed(2)}</td>
                <td>{ldpe.productStageEmission.toFixed(2)}</td>
                <td>{ldpe.disposalAddedEmission.toFixed(2)}</td>
                <td className="total-cell">{ldpe.totalEmission.toFixed(2)}</td>
                <td className={getDiff(ldpe, gwg) > 0 ? 'diff-positive' : 'diff-negative'}>
                  {getDiff(ldpe, gwg) > 0 ? '+' : ''}
                  {getDiff(ldpe, gwg).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td>
                  <span className="scenario-badge pp">PP</span>
                </td>
                <td>{pp.pelletStageEmission.toFixed(2)}</td>
                <td>{pp.productStageEmission.toFixed(2)}</td>
                <td>{pp.disposalAddedEmission.toFixed(2)}</td>
                <td className="total-cell">{pp.totalEmission.toFixed(2)}</td>
                <td className={getDiff(pp, gwg) > 0 ? 'diff-positive' : 'diff-negative'}>
                  {getDiff(pp, gwg) > 0 ? '+' : ''}
                  {getDiff(pp, gwg).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="table-note">
          * 단위: kg CO₂ / GWG 대비: 양수(+)는 더 많은 배출, 음수(-)는 더 적은 배출
        </p>
      </section>

      {/* 비교 바 차트 */}
      <section className="result-card">
        <h2 className="section-title">총 탄소 배출량 비교 차트</h2>
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
            <span>GWG (친환경 펠릿)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#ef4444' }} />
            <span>HDPE (고밀도 폴리에틸렌)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#f97316' }} />
            <span>LDPE (저밀도 폴리에틸렌)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#8b5cf6' }} />
            <span>PP (폴리프로필렌)</span>
          </div>
        </div>
      </section>

      {/* 환경 영향 분석 */}
      <section className="result-card analysis-card">
        <h2 className="section-title">환경 영향 분석</h2>
        <div className="analysis-content">
          {gwg.totalEmission < hdpe.totalEmission &&
          gwg.totalEmission < ldpe.totalEmission &&
          gwg.totalEmission < pp.totalEmission ? (
            <div className="analysis-positive">
              <span className="analysis-icon">🌱</span>
              <div>
                <strong>GWG 펠릿이 가장 친환경적입니다!</strong>
                <p>
                  HDPE 대비 <strong>{(hdpe.totalEmission - gwg.totalEmission).toFixed(2)} kg CO₂</strong> 절감
                  <br />
                  LDPE 대비 <strong>{(ldpe.totalEmission - gwg.totalEmission).toFixed(2)} kg CO₂</strong> 절감
                  <br />
                  PP 대비 <strong>{(pp.totalEmission - gwg.totalEmission).toFixed(2)} kg CO₂</strong> 절감
                </p>
              </div>
            </div>
          ) : (
            <div className="analysis-neutral">
              <span className="analysis-icon">📊</span>
              <div>
                <strong>배합 비율을 조정해 보세요</strong>
                <p>현재 설정에서는 GWG 펠릿이 기존 플라스틱보다 더 많은 탄소를 배출합니다.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

