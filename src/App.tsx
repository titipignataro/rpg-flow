import { useState, useEffect, useRef } from "react";
import './App.css';
import { TRAIT_META, ARCHETYPES } from './data/archetypes';
import { QUESTIONS } from './data/questions';
import { SECRET_BADGES, BADGES, FLASH } from './data/constants';
import { getCognitiveStyle, getContradictions, getMotivators, getStressProfile, getTeamCompatibility } from "./calcs";
import { clearSaved, downloadResult, formatDate, loadSaved, parseImport, persistResult } from "./utils";
import ResultScreen from "./components/resultscreen"; 
type DiscKey = "D" | "I" | "S" | "C";



export default function App() {
  const [screen, setScreen] = useState("intro");
  const [state, setState] = useState({ D: 0, I: 0, S: 0, C: 0 });
  const [qIdx, setQIdx] = useState(0);
  const [badges, setBadges] = useState([]);
  const [courage, setCourage] = useState(0);
  const [flash, setFlash] = useState(null);
  const [badgePopup, setBadgePopup] = useState(null);
  const [animKey, setAnimKey] = useState(0);
  const [tab, setTab] = useState("perfil");
  const [savedResult, setSavedResult] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [importError, setImportError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const saved = loadSaved();
    if (saved) setSavedResult(saved);
  }, []);


  const getArchetype = (scores: Record<DiscKey, number> = state) => {
    const traits: DiscKey[] = ["D", "I", "S", "C"];

    let dominantTrait = traits[0];

    traits.forEach((trait) => {
      if (scores[trait] > scores[dominantTrait]) {
        dominantTrait = trait;
      }
    });

    return ARCHETYPES[dominantTrait];
  };

  const handleViewSaved = () => {
    if (!savedResult) return;
    setState(savedResult.state);
    setBadges(savedResult.badges || []);
    setTab("perfil");
    setScreen("result");
  };

  const handleClearSaved = () => {
    if (!confirmClear) { setConfirmClear(true); return; }
    clearSaved(); setSavedResult(null); setConfirmClear(false);
  };

  const handleExportSaved = () => { if (savedResult) downloadResult(savedResult); };

  const handleExportCurrent = () => {
    downloadResult({ state, badges, savedAt: savedResult?.savedAt || new Date().toISOString(), archetype: getArchetype().name });
  };

  const handleImportClick = () => { setImportError(null); fileInputRef.current?.click(); };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = parseImport(String(reader.result ?? ""));
        persistResult(data); setSavedResult(data); setImportError(null);
      } catch (err) {
        setImportError(err instanceof Error ? err.message : "Não foi possível importar.");
      }
    };
    reader.onerror = () => setImportError("Não foi possível ler o arquivo.");
    reader.readAsText(file, "utf-8");
  };

  const startGame = () => {
    setState({ D:0, I:0, S:0, C:0 });
    setQIdx(0); setBadges([]); setCourage(0);
    setFlash(null); setAnimKey(k => k+1);
    setTab("perfil"); setScreen("game");
  };

  const choose = (choiceIdx) => {
    const q = QUESTIONS[qIdx];
    const c = q.choices[choiceIdx];
    const ns = { ...state, [c.trait]: state[c.trait] + c.weight };
    const nc = choiceIdx === 0 ? courage + 1 : courage;
    const nq = qIdx + 1;
    setState(ns); setCourage(nc);

    const msgs = FLASH[c.trait];
    setFlash({ msg: msgs[Math.floor(Math.random() * msgs.length)], trait: c.trait });
    setTimeout(() => setFlash(null), 1400);

    const newB = BADGES.filter(b => !badges.find(e => e.id === b.id) && b.cond(ns, nq, nc));
    const secretB = SECRET_BADGES.filter(b => !badges.find(e => e.id === b.id) && b.condition(ns));
    const allNewBadges = [...newB, ...secretB];

    if (allNewBadges.length) {
      setBadges(prev => [...prev, ...allNewBadges]);
      setBadgePopup(allNewBadges[0]);
      setTimeout(() => setBadgePopup(null), 2400);
    }
    if (nq >= QUESTIONS.length) {
      const resultData = { state: ns, badges: [...badges, ...allNewBadges], savedAt: new Date().toISOString(), archetype: getArchetype(ns).name };
      persistResult(resultData); setSavedResult(resultData);
      setTimeout(() => setScreen("result"), 600);
    } else {
      setQIdx(nq); setAnimKey(k => k+1);
    }
  };

  const arch = getArchetype();
  const q = QUESTIONS[qIdx] || QUESTIONS[0];
  const letters = ["A","B","C","D"];

  const sorted = Object.entries(state).sort((a,b) => b[1]-a[1]);
  const secondKey = sorted[1]?.[0];
  const secondArch = secondKey ? ARCHETYPES[secondKey] : null;

  const pcts = {
    D: Math.min((state.D / 30) * 100, 100),
    I: Math.min((state.I / 30) * 100, 100),
    S: Math.min((state.S / 30) * 100, 100),
    C: Math.min((state.C / 30) * 100, 100),
  };

  return (
    <>
      <div className="psyche-root">

        {/* FLASH */}
        {flash && (
          <div className="feedback-flash" style={{
            background: `rgba(${flash.trait==="D"?"224,92,92":flash.trait==="I"?"212,168,67":flash.trait==="S"?"60,184,122":"139,127,232"},0.1)`,
            color: TRAIT_META[flash.trait].color,
            borderBottom: `1px solid ${TRAIT_META[flash.trait].color}40`,
          }}>
            {flash.msg}
          </div>
        )}

        {/* BADGE POPUP */}
        {badgePopup && (
          <>
            <div className="badge-overlay" onClick={() => setBadgePopup(null)} />
            <div className="badge-popup">
              <span className="badge-icon-lg">{badgePopup.icon}</span>
              <div className="badge-popup-name">{badgePopup.name}</div>
              <div className="badge-popup-desc">{badgePopup.desc}</div>
              {SECRET_BADGES.some(b => b.id === badgePopup.id) && (
                <div className="secret-badge-label">⚡ CONQUISTA SECRETA</div>
              )}
            </div>
          </>
        )}

        {/* ── INTRO ──────────────────────────────────────────────────────────── */}
        {screen === "intro" && (
          <div className="intro-wrap">
            <div className="intro-orb" />
            <div className="intro-title">Psyche</div>
            <div className="intro-sub">Um espelho com 15 perguntas</div>
            <div className="intro-desc">Mapeamento comportamental · DISC</div>
            <div className="disc-tags">
              {Object.entries(TRAIT_META).map(([k, m]) => (
                <span key={k} className="disc-tag" style={{ color: m.color, borderColor: m.color + "35" }}>
                  <span className="disc-dot" style={{ background: m.color }} />
                  {m.label}
                </span>
              ))}
            </div>

            {savedResult && (
              <div className="saved-card">
                <div className="saved-card-header">
                  <span className="saved-card-label">Resultado salvo</span>
                  <span className="saved-card-date">{formatDate(savedResult.savedAt)}</span>
                </div>
                <div className="saved-card-archetype">{savedResult.archetype}</div>
                <div className="saved-mini-bars">
                  {Object.entries(TRAIT_META).map(([k, m]) => (
                    <div key={k}>
                      <div className="saved-mini-label">
                        <span style={{ color: m.color }}>{k}</span>
                        <span>{savedResult.state[k]}</span>
                      </div>
                      <div className="saved-mini-track">
                        <div className="saved-mini-fill" style={{ width: `${Math.min((savedResult.state[k] / 20) * 100, 100)}%`, background: m.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                {savedResult.badges?.length > 0 && (
                  <div className="saved-badges">
                    {savedResult.badges.map(b => (
                      <span key={b.id} title={b.name} style={{ fontSize: "1rem" }}>{b.icon}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <input ref={fileInputRef} type="file" accept=".json,application/json"
              className="file-input-hidden" tabIndex={-1} aria-hidden onChange={handleImportFile} />

            <div className="intro-file-row">
              <button type="button" className="btn-outline" onClick={handleImportClick}>
                Carregar de arquivo
              </button>
              {savedResult && (
                <button type="button" className="btn-outline" onClick={handleExportSaved}>
                  Exportar para arquivo
                </button>
              )}
            </div>
            {importError && <div className="import-error" role="alert">{importError}</div>}

            <div className="intro-btn-row">
              {savedResult && (
                <button className="btn-outline" onClick={handleViewSaved}>
                  Ver resultado salvo
                </button>
              )}
              <button className="btn-primary" onClick={startGame}>
                {savedResult ? "Refazer jornada" : "Iniciar jornada"}
              </button>
            </div>

            {savedResult && (
              <button className="btn-ghost" onClick={handleClearSaved}>
                {confirmClear ? "Confirmar exclusão" : "Apagar resultado salvo"}
              </button>
            )}
          </div>
        )}

        {/* ── GAME ───────────────────────────────────────────────────────────── */}
        {screen === "game" && (
          <>
            <div className="game-header">
              <span className="phase-tag">{q.phase}</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(qIdx / QUESTIONS.length) * 100}%` }} />
              </div>
              <span className="q-counter">{qIdx + 1} / {QUESTIONS.length}</span>
            </div>
            <div className="traits-bar">
              {Object.entries(TRAIT_META).map(([k, m]) => (
                <div key={k} className="trait-item">
                  <div className="trait-label">
                    <span style={{ color: m.color }}>{m.label}</span>
                    <span>{state[k]}</span>
                  </div>
                  <div className="trait-track">
                    <div className="trait-fill" style={{ width: `${pcts[k]}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="scenario-area">
              <div className="scenario-cat">{q.cat}</div>
              <div className="scenario-text" key={`text-${animKey}`} style={{ animation: "slideUp 0.4s ease both" }}>
                {q.text}
              </div>
              <div className="choices-list">
                {q.choices.map((c, i) => (
                  <button key={`${animKey}-${i}`} className="choice-btn"
                    style={{ animation: `slideUp 0.4s ${i * 0.05}s ease both` }}
                    onClick={() => choose(i)}>
                    <span className="choice-letter">{letters[i]}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── RESULT ─────────────────────────────────────────────────────────── */}
        {screen === "result" && (
          <ResultScreen
            state={state}
            badges={badges}
            arch={arch}
            secondArch={secondArch}
            secondKey={secondKey}
            combinedArchetype={arch.name}
            cognitiveStyle={getCognitiveStyle(state.D, state.I, state.S, state.C)}
            contradictions={getContradictions(state)}
            stressProfile={getStressProfile(state)}
            motivators={getMotivators(state)}
            teamCompat={getTeamCompatibility(state)}
            tab={tab}
            setTab={setTab}
            savedResult={savedResult}
            onExportCurrent={handleExportCurrent}
            onGoHome={() => setScreen("intro")}
            onRestart={startGame}
          />
        )}

      </div>
    </>
  );
}