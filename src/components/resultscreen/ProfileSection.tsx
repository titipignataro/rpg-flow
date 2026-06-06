import { TRAIT_META } from '../../data/archetypes';
import RadarChart from "../radarchart";

export default function ProfileSection({ state, arch, secondArch, secondKey, combinedArchetype, cognitiveStyle }) {
  const maxVal = 30;

  return (
    <>
      <div className="profile-display">
        <div className="primary-profile">
          <div className="primary-profile-badge">
            <span className="primary-profile-label">RELATÓRIO ANALÍTICO DE PERFIL</span>
          </div>
          <div className="result-name" style={{ color: arch.color, textAlign: "center" }}>
            {combinedArchetype}
          </div>
          <div className="result-tagline">{arch.tagline}</div>
        </div>

        {secondArch && secondKey !== arch.id && (
          <div className="secondary-profile">
            <div className="primary-profile-badge">
              <div className="primary-profile-label">Perfil Secundário</div>
            </div>
            <div className="subperfil-text" style={{ color: TRAIT_META[secondKey].color, textAlign: "center" }}>
              {secondArch.name}
            </div>
          </div>
        )}
      </div>

      <div className="result-tag-row">
        <span className="result-tag primary-tag cursor-pointer" style={{ color: arch.color, borderColor: arch.color + "60", background: arch.color + "15" }}>
          {arch.disc} dominante
        </span>
        {secondArch && secondKey !== arch.id && (
          <span className="result-tag secondary-tag" style={{ color: TRAIT_META[secondKey].color, borderColor: TRAIT_META[secondKey].color + "50", background: TRAIT_META[secondKey].color + "12" }}>
            {TRAIT_META[secondKey].label} secundária
          </span>
        )}
        <span className="result-tag" style={{ color: "#a78bfa", borderColor: "#a78bfa60", background: "#a78bfa15" }}>
          {cognitiveStyle.name}
        </span>
      </div>

      <div className="scores-radar-grid">
        <div className="scores-panel">
          <div className="scores-panel-label">
            Dimensões de Comportamento
            <div className="text-center">Max {maxVal}</div>
          </div>
          {Object.entries(TRAIT_META).map(([k, m]) => (
            <div key={k} className="score-bar-row">
              <div className="score-bar-header">
                <div className="score-bar-label" style={{ color: m.color }}>
                  <div className="score-bar-icon"><m.icon /></div>
                  <span>{m.label}</span>
                </div>
                <span className="score-bar-val" style={{ color: m.color }}>{state[k]}.0</span>
              </div>
              <div className="score-bar-track">
                <div className="score-bar-fill" style={{ width: `${Math.min((state[k] / maxVal) * 100, 100)}%`, background: `linear-gradient(90deg, ${m.color}99, ${m.color})` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="radar-panel">
          <RadarChart state={state} />
          <div className="radar-panel-label">Mapeamento de Competências Estruturais</div>
        </div>
      </div>
    </>
  );
}