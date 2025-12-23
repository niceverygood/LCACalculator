interface ComparisonBarProps {
  label: string;
  value: number;
  max: number;
  color?: string;
}

export default function ComparisonBar({
  label,
  value,
  max,
  color = '#4a90d9',
}: ComparisonBarProps) {
  // 음수 값 처리
  const absMax = Math.max(Math.abs(max), Math.abs(value));
  const normalizedMax = absMax === 0 ? 1 : absMax;
  
  // 퍼센트 계산 (음수도 표시)
  const percentage = Math.abs(value) / normalizedMax * 100;
  const isNegative = value < 0;

  return (
    <div className="comparison-bar-container">
      <div className="comparison-bar-label">
        <span className="label-text">{label}</span>
        <span className={`label-value ${isNegative ? 'negative' : ''}`}>
          {value.toFixed(2)} kg CO₂
        </span>
      </div>
      <div className="comparison-bar-track">
        <div
          className={`comparison-bar-fill ${isNegative ? 'negative' : ''}`}
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: isNegative ? '#22c55e' : color,
          }}
        />
      </div>
    </div>
  );
}

