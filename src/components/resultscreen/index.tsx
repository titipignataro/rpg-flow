import { IoArrowBack } from 'react-icons/io5';
import { TABS } from '../../data/constants';
import ProfileSection from './ProfileSection';
import TabContent from './TabContent';

export default function ResultScreen({
  state,
  badges,
  arch,
  secondArch,
  secondKey,
  combinedArchetype,
  cognitiveStyle,
  contradictions,
  stressProfile,
  motivators,
  teamCompat,
  tab,
  setTab,
  onExportCurrent,
  onGoHome,
  onRestart,
}) {
  return (
    <div className="result-wrap">
      <div className="result-header">
        <ProfileSection 
          state={state}
          arch={arch}
          secondArch={secondArch}
          secondKey={secondKey}
          combinedArchetype={combinedArchetype}
          cognitiveStyle={cognitiveStyle}
        />
      </div>

      <div className="tabs-row">
        {TABS.map((t) => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        <TabContent 
          tab={tab}
          arch={arch}
          secondArch={secondArch}
          secondKey={secondKey}
          contradictions={contradictions}
          badges={badges}
          cognitiveStyle={cognitiveStyle}
          motivators={motivators}
          teamCompat={teamCompat}
          stressProfile={stressProfile}
        />
      </div>

      <div className="result-actions">
        <div className="save-notice">
          <span className="save-dot" />
          Resultado salvo automaticamente
        </div>
        <button type="button" className="btn-secondary btn-full" onClick={onExportCurrent}>
          Exportar resultado (.json)
        </button>
        <div className="flex gap-2">
          <div className="flex-1 flex">
            <button className="btn-secondary flex-1 flex items-center justify-center gap-2" onClick={onGoHome}>
              <div>
                <IoArrowBack />
              </div>
              <div>
                Voltar ao início
              </div>
              </button>
          </div>
          <div className="flex-1 flex">
            <button className="btn-secondary flex-1" onClick={onRestart}>Refazer do zero</button>
          </div>
        </div>
      </div>
    </div>
  );
}