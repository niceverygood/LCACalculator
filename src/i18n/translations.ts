export type Language = 'ko' | 'en';

export const translations = {
  ko: {
    // Header
    title: '탄소 배출량 계산기 (LCA Calculator)',
    subtitle: 'GWG 펠릿 vs HDPE/LDPE/PP 비교 분석',
    
    // Form sections
    resinSection: '원료 배합 비율 입력 (GWG 펠릿)',
    additiveSection: '첨가제 배합 비율 입력',
    productionSection: '총 생산량 및 펠릿 공정',
    gwgTransportSection: '그린웨일 글로벌 운송 (펠릿 → 고객사)',
    customerProcessSection: '고객사 제조 공정 (1개 선택)',
    customerTransportSection: '고객사 운송 (제품 → 최종 목적지)',
    disposalSection: '폐기 시나리오',
    
    // Labels
    totalProduction: '총 생산량 (kg)',
    pelletElectricity: '펠릿 전력 사용량 (kWh)',
    seaTransport: '해상 운송 거리 (km)',
    landTransport: '육상 운송 거리 (km)',
    processType: '공정 방식 선택',
    disposalMode: '폐기 방식 선택',
    
    // Sum displays
    resinSum: '원료 합계',
    additiveSum: '첨가제 합계',
    totalSum: '원료 + 첨가제 총합',
    totalWarning: '⚠️ 총합이 100%가 되어야 합니다!',
    compostWarning: 'ℹ️ HDPE, LDPE, PP는 퇴비화 불가 → 소각 처리로 계산됩니다',
    
    // Process types
    processElectricity: '총 전력 사용량 (kWh)',
    processInjection: '사출 - 원료투입량 (kg)',
    processFilm: '필름 (kg)',
    processSheet: '시트 (kg)',
    
    // Disposal modes
    disposalPelletOnly: '펠릿 단계까지만',
    disposalToProduct: '제품 제조까지',
    disposalCompost: '퇴비화',
    disposalIncineration: '소각',
    
    // Resin labels
    resinTPS: 'TPS (카사바전분)',
    resinPLA: 'PLA',
    resinPBAT: 'PBAT',
    resinHDPE_VIRGIN: 'HDPE (버진)',
    resinHDPE_RECYCLE: 'HDPE (재활용)',
    resinHDPE_BIO: 'HDPE (바이오)',
    resinLDPE_VIRGIN: 'LDPE (버진)',
    resinLDPE_RECYCLE: 'LDPE (재활용)',
    resinLDPE_BIO: 'LDPE (바이오)',
    resinPP_VIRGIN: 'PP (버진)',
    resinPP_RECYCLE: 'PP (재활용)',
    resinPP_BIO: 'PP (바이오)',
    
    // Result section
    resultSummaryTitle: 'GWG 펠릿 기준 요약',
    resultComparisonTitle: '탄소 배출량 비교 (GWG vs HDPE/LDPE/PP)',
    resultChartTitle: '총 탄소 배출량 비교 차트',
    resultAnalysisTitle: '환경 영향 분석',
    
    // Result labels
    pelletEmission: '펠릿 단계 배출량',
    gwgTransportEmission: '그린웨일 운송 배출량',
    productEmission: '고객사 제조 배출량',
    customerTransportEmission: '고객사 운송 배출량',
    disposalEmission: '폐기 추가 배출량',
    totalEmission: '총 탄소 배출량',
    
    // Table headers
    tableType: '종류',
    tablePellet: '펠릿',
    tableGwgTransport: 'GW운송',
    tableProduct: '제조',
    tableCustomerTransport: '고객운송',
    tableDisposal: '폐기',
    tableTotal: '총합',
    tableVsGwg: 'GWG 대비',
    
    // Table notes
    tableNote: '* 단위: kg CO₂ / GWG 대비: 양수(+)는 더 많은 배출, 음수(-)는 더 적은 배출',
    tableNote2: '* HDPE/LDPE/PP: 버진, 국내운송 기준 고정값 (2231.8 / 2131.8 / 1801.8 kg CO₂/톤)',
    
    // Chart legend
    legendGwg: 'GWG (친환경 펠릿)',
    legendHdpe: 'HDPE (고밀도 폴리에틸렌)',
    legendLdpe: 'LDPE (저밀도 폴리에틸렌)',
    legendPp: 'PP (폴리프로필렌)',
    
    // Analysis
    analysisPositiveTitle: 'GWG 펠릿이 가장 친환경적입니다!',
    analysisPositiveVs: '대비',
    analysisPositiveSaved: '절감',
    analysisNeutralTitle: '배합 비율을 조정해 보세요',
    analysisNeutralDesc: '현재 설정에서는 GWG 펠릿이 기존 플라스틱보다 더 많은 탄소를 배출합니다.',
    
    // Footer
    footer: '© 2024 LCA Calculator - 탄소 배출량 분석 도구',
    
    // Units
    kgCO2: 'kg CO₂',
  },
  en: {
    // Header
    title: 'Carbon Emission Calculator (LCA)',
    subtitle: 'GWG Pellet vs HDPE/LDPE/PP Comparison',
    
    // Form sections
    resinSection: 'Raw Material Mix Ratio (GWG Pellet)',
    additiveSection: 'Additive Mix Ratio',
    productionSection: 'Total Production & Pellet Process',
    gwgTransportSection: 'Green Whale Global Transport (Pellet → Customer)',
    customerProcessSection: 'Customer Manufacturing Process (Select 1)',
    customerTransportSection: 'Customer Transport (Product → Destination)',
    disposalSection: 'Disposal Scenario',
    
    // Labels
    totalProduction: 'Total Production (kg)',
    pelletElectricity: 'Pellet Electricity (kWh)',
    seaTransport: 'Sea Transport Distance (km)',
    landTransport: 'Land Transport Distance (km)',
    processType: 'Select Process Type',
    disposalMode: 'Select Disposal Method',
    
    // Sum displays
    resinSum: 'Raw Material Total',
    additiveSum: 'Additive Total',
    totalSum: 'Raw Material + Additive Total',
    totalWarning: '⚠️ Total must be 100%!',
    compostWarning: 'ℹ️ HDPE, LDPE, PP cannot be composted → Calculated as incineration',
    
    // Process types
    processElectricity: 'Total Electricity (kWh)',
    processInjection: 'Injection - Material Input (kg)',
    processFilm: 'Film (kg)',
    processSheet: 'Sheet (kg)',
    
    // Disposal modes
    disposalPelletOnly: 'Pellet Stage Only',
    disposalToProduct: 'Up to Product Manufacturing',
    disposalCompost: 'Composting',
    disposalIncineration: 'Incineration',
    
    // Resin labels
    resinTPS: 'TPS (Cassava Starch)',
    resinPLA: 'PLA',
    resinPBAT: 'PBAT',
    resinHDPE_VIRGIN: 'HDPE (Virgin)',
    resinHDPE_RECYCLE: 'HDPE (Recycled)',
    resinHDPE_BIO: 'HDPE (Bio)',
    resinLDPE_VIRGIN: 'LDPE (Virgin)',
    resinLDPE_RECYCLE: 'LDPE (Recycled)',
    resinLDPE_BIO: 'LDPE (Bio)',
    resinPP_VIRGIN: 'PP (Virgin)',
    resinPP_RECYCLE: 'PP (Recycled)',
    resinPP_BIO: 'PP (Bio)',
    
    // Result section
    resultSummaryTitle: 'GWG Pellet Summary',
    resultComparisonTitle: 'Carbon Emission Comparison (GWG vs HDPE/LDPE/PP)',
    resultChartTitle: 'Total Carbon Emission Chart',
    resultAnalysisTitle: 'Environmental Impact Analysis',
    
    // Result labels
    pelletEmission: 'Pellet Stage Emission',
    gwgTransportEmission: 'GW Transport Emission',
    productEmission: 'Manufacturing Emission',
    customerTransportEmission: 'Customer Transport Emission',
    disposalEmission: 'Disposal Emission',
    totalEmission: 'Total Carbon Emission',
    
    // Table headers
    tableType: 'Type',
    tablePellet: 'Pellet',
    tableGwgTransport: 'GW Trans.',
    tableProduct: 'Manuf.',
    tableCustomerTransport: 'Cust. Trans.',
    tableDisposal: 'Disposal',
    tableTotal: 'Total',
    tableVsGwg: 'vs GWG',
    
    // Table notes
    tableNote: '* Unit: kg CO₂ / vs GWG: (+) more emission, (-) less emission',
    tableNote2: '* HDPE/LDPE/PP: Virgin, domestic transport (2231.8 / 2131.8 / 1801.8 kg CO₂/ton)',
    
    // Chart legend
    legendGwg: 'GWG (Eco-friendly Pellet)',
    legendHdpe: 'HDPE (High-Density Polyethylene)',
    legendLdpe: 'LDPE (Low-Density Polyethylene)',
    legendPp: 'PP (Polypropylene)',
    
    // Analysis
    analysisPositiveTitle: 'GWG Pellet is the most eco-friendly!',
    analysisPositiveVs: 'vs',
    analysisPositiveSaved: 'saved',
    analysisNeutralTitle: 'Try adjusting the mix ratio',
    analysisNeutralDesc: 'With current settings, GWG pellet emits more carbon than conventional plastics.',
    
    // Footer
    footer: '© 2024 LCA Calculator - Carbon Emission Analysis Tool',
    
    // Units
    kgCO2: 'kg CO₂',
  },
} as const;

export type TranslationKey = keyof typeof translations.ko;

