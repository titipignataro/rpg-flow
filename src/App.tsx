import { useState, useEffect, useRef } from "react";
import { FaCrown, FaStarHalfAlt } from "react-icons/fa";
import './App.css';
import { TRAIT_META, ARCHETYPES } from './data/archetypes';
import { QUESTIONS } from './data/questions';
import {  SECRET_BADGES, BADGES, FLASH, TABS } from './data/constants';
import { getCognitiveStyle, getContradictions, getMotivators, getStressProfile, getTeamCompatibility } from "./calcs";
import RadarChart from "./components/radarchart";
import { clearSaved, downloadResult, formatDate, loadSaved, parseImport, persistResult } from "./utils";

const STORAGE_KEY = "psyche_saved_result";
const EXPORT_VERSION = 2;

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

  const getArch = (s = state) => {
    const keys = ["D","I","S","C"];
    let best = keys[0];
    keys.forEach(k => { if (s[k] > s[best]) best = k; });
    return ARCHETYPES[best];
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
    downloadResult({ state, badges, savedAt: savedResult?.savedAt || new Date().toISOString(), archetype: getArch().name });
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
      const resultData = { state: ns, badges: [...badges, ...allNewBadges], savedAt: new Date().toISOString(), archetype: getArch(ns).name };
      persistResult(resultData); setSavedResult(resultData);
      setTimeout(() => setScreen("result"), 600);
    } else {
      setQIdx(nq); setAnimKey(k => k+1);
    }
  };

  const arch = getArch();
  const q = QUESTIONS[qIdx] || QUESTIONS[0];
  const letters = ["A","B","C","D"];
  const maxVal = 30;

  const sorted = Object.entries(state).sort((a,b) => b[1]-a[1]);
  const secondKey = sorted[1]?.[0];
  const secondArch = secondKey ? ARCHETYPES[secondKey] : null;

  const cognitiveStyle = getCognitiveStyle(state.D, state.I, state.S, state.C);
  const contradictions = getContradictions(state);
  const stressProfile = getStressProfile(state);
  const motivators = getMotivators(state);
  const teamCompat = getTeamCompatibility(state);
  const combinedArchetype = arch.name;

  const pcts = {
    D: Math.min((state.D / maxVal) * 100, 100),
    I: Math.min((state.I / maxVal) * 100, 100),
    S: Math.min((state.S / maxVal) * 100, 100),
    C: Math.min((state.C / maxVal) * 100, 100),
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
                <div className="secret-badge-label">
                  ⚡ CONQUISTA SECRETA
                </div>
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
          <div className="result-wrap">
            <div className="result-header">
              <div className="profile-display">
                <div className="primary-profile">
                  <div className="primary-profile-badge" style={{ 
                    background: `linear-gradient(135deg, ${arch.color}20, ${arch.color}10)`,
                    borderColor: `${arch.color}40`
                  }}>
                    <FaCrown className="primary-profile-icon" style={{ color: arch.color }} />
                    <span className="primary-profile-label" style={{ color: arch.color }}>Perfil Principal</span>
                  </div>
                  <div className="result-name" style={{ 
                    color: arch.color,
                    textShadow: `0 0 40px ${arch.color}40, 0 0 80px ${arch.color}20`
                  }}>{combinedArchetype}</div>
                </div>
                
                {secondArch && secondKey !== arch.id && (
                  <div className="secondary-profile">
                    <div className="secondary-profile-badge" style={{ 
                      background: `linear-gradient(135deg, ${TRAIT_META[secondKey].color}15, ${TRAIT_META[secondKey].color}08)`,
                      borderColor: `${TRAIT_META[secondKey].color}30`
                    }}>
                      <FaStarHalfAlt className="secondary-profile-icon" style={{ color: TRAIT_META[secondKey].color }} />
                      <span className="secondary-profile-label" style={{ color: TRAIT_META[secondKey].color }}>Influência Secundária</span>
                    </div>
                    <div className="subperfil-text" style={{ 
                      color: TRAIT_META[secondKey].color,
                      textShadow: `0 0 30px ${TRAIT_META[secondKey].color}30`
                    }}>
                      {secondArch.name}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="result-tagline">{arch.tagline}</div>
              <div className="result-tag-row">
                <span className="result-tag primary-tag" style={{
                  color: arch.color,
                  borderColor: arch.color + "60",
                  background: arch.color + "15"
                }}>
                  {arch.disc} dominante
                </span>
                {secondArch && secondKey !== arch.id && (
                  <span className="result-tag secondary-tag" style={{
                    color: TRAIT_META[secondKey].color,
                    borderColor: TRAIT_META[secondKey].color + "50",
                    background: TRAIT_META[secondKey].color + "12"
                  }}>
                    {TRAIT_META[secondKey].label} secundária
                  </span>
                )}
                <span className="result-tag" style={{
                  color: "#a78bfa",
                  borderColor: "#a78bfa60",
                  background: "#a78bfa15"
                }}>
                  {cognitiveStyle.name}
                </span>
              </div>

              <div className="scores-radar-grid">
                <div className="scores-panel">
                  <div className="scores-panel-label">
                    Dimensões de Comportamento
                    <span>Intensidade 0–30</span>
                  </div>
                  {Object.entries(TRAIT_META).map(([k, m]) => (
                    <div key={k} className="score-bar-row">
                      <div className="score-bar-header">
                        <span className="score-bar-label" style={{ color: m.color }}>
                          {m.label}
                        </span>
                        <span className="score-bar-val" style={{ color: m.color }}>{state[k]}.0</span>
                      </div>
                      <div className="score-bar-track">
                        <div className="score-bar-fill" style={{
                          width: `${Math.min((state[k] / maxVal) * 100, 100)}%`,
                          background: `linear-gradient(90deg, ${m.color}99, ${m.color})`
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="radar-panel">
                  <RadarChart state={state} />
                  <div className="radar-panel-label">Mapeamento de Competências Estruturais</div>
                </div>
              </div>
            </div>

            {/* TABS */}
            <div className="tabs-row">
              {TABS.map(t => (
                <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="tab-content">

              {/* PERFIL */}
              {tab === "perfil" && (
                <>
                  <div className="insight-block" style={{ borderLeftColor: arch.color }}>
                    <h3>Visão geral</h3>
                    <p>{arch.overview}</p>
                  </div>
                  
                  {contradictions.map((contradiction, idx) => (
                    <div key={idx} className="contradiction-card">
                      <h3>⚖️ {contradiction.title}</h3>
                      <p>{contradiction.description}</p>
                    </div>
                  ))}

                  <div className="insight-block" style={{ borderLeftColor: arch.color }}>
                    <h3>Como você aparece para o mundo</h3>
                    <p>{arch.publicVsPrivate}</p>
                  </div>

                  {secondArch && secondKey !== arch.id && (
                    <div className="secondary-trait-section">
                      <div className="section-label">Traço secundário — {secondArch.name}</div>
                      <div className="trait-card">
                        <h4 style={{ color: TRAIT_META[secondKey].color }}>{TRAIT_META[secondKey].label}</h4>
                        <p>Seu segundo traço mais forte adiciona uma camada ao seu perfil principal. Você tende a combinar a {arch.disc.toLowerCase()} do {arch.name} com a {TRAIT_META[secondKey].label.toLowerCase()} do {secondArch.name} — criando uma combinação que raramente é descrita por um único perfil.</p>
                      </div>
                    </div>
                  )}

                  {badges.length > 0 && (
                    <div className="badges-section">
                      <div className="section-label">Conquistas</div>
                      <div className="badges-row">
                        {badges.map(b => (
                          <div key={b.id} className={`badge-chip ${SECRET_BADGES.some(sb => sb.id === b.id) ? 'secret-badge' : ''}`}>
                            {b.icon} {b.name}
                            {SECRET_BADGES.some(sb => sb.id === b.id) && <span className="secret-badge-icon">⚡</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ESTILO COGNITIVO */}
              {tab === "cognitivo" && (
                <>
                  <div className="cognitive-card">
                    <h3>🧠 Seu estilo cognitivo</h3>
                    <p className="cognitive-name">{cognitiveStyle.name}</p>
                    <div className="cognitive-traits">
                      {cognitiveStyle.traits.map((trait, idx) => (
                        <span key={idx} className="cognitive-trait">{trait}</span>
                      ))}
                    </div>
                  </div>

                  <div className="insight-block" style={{ borderLeftColor: "#8b7fe8" }}>
                    <h3>Como você processa informação</h3>
                    <p>Seu estilo cognitivo reflete como você naturalmente organiza pensamentos, toma decisões e interage com informações complexas. Isso não é fixo - é um padrão que você desenvolveu e que pode ser expandido com consciência.</p>
                  </div>
                </>
              )}

              {/* MOTIVAÇÃO */}
              {tab === "motivacao" && (
                <>
                  <div className="motivator-grid">
                    <div className="motivator-section">
                      <h4 style={{ color: "#3cb87a" }}>✨ O QUE TE ENERGIZA</h4>
                      <div className="motivator-list">
                        {motivators.primary.energizes.map((item, idx) => (
                          <span key={idx} className="motivator-item energize">✓ {item}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="motivator-section">
                      <h4 style={{ color: "#e05c5c" }}>⚠️ O QUE TE DRENA</h4>
                      <div className="motivator-list">
                        {motivators.primary.drains.map((item, idx) => (
                          <span key={idx} className="motivator-item drain">✗ {item}</span>
                        ))}
                      </div>
                    </div>

                    {motivators.secondaryTrait !== motivators.primaryTrait && (
                      <div className="motivator-section secondary">
                        <h4 style={{ color: TRAIT_META[motivators.secondaryTrait].color }}>
                          + Influência secundária ({TRAIT_META[motivators.secondaryTrait].label})
                        </h4>
                        <div className="motivator-list">
                          {motivators.secondary.energizes.slice(0, 2).map((item, idx) => (
                            <span key={idx} className="motivator-item">✓ {item}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="insight-block growth">
                    <h3>A chave para sua energia sustentável</h3>
                    <p>Ambientes que respeitam seus energizadores e minimizam seus drenadores não são apenas mais confortáveis - são onde você produz seu melhor trabalho sem sacrificar sua saúde mental.</p>
                  </div>
                </>
              )}

              {/* RELAÇÕES */}
              {tab === "relacoes" && (
                <>
                  <div className="section-label">Compatibilidade natural</div>
                  {teamCompat.map((comp, idx) => (
                    <div key={idx} className="compat-item">
                      <span className="compat-dot" style={{ background: TRAIT_META[comp.trait].color }} />
                      <div className="compat-reason">
                        <strong style={{ color: TRAIT_META[comp.trait].color }}>{TRAIT_META[comp.trait].label}</strong> — {comp.reason}
                      </div>
                    </div>
                  ))}

                  <div className="section-label">Tensões naturais</div>
                  {arch.tension_with.map(w => (
                    <div key={w.id} className="compat-item tension">
                      <span className="compat-dot" style={{ background: "#444" }} />
                      <div className="compat-reason">
                        <strong style={{ color: "#7a7870" }}>{ARCHETYPES[w.id].name}</strong> — {w.reason}
                      </div>
                    </div>
                  ))}

                  <div className="insight-block" style={{ borderLeftColor: "#d4a843" }}>
                    <h3>Como você se conecta</h3>
                    <p>Relações para você não são apenas redes - são ecossistemas. Você se conecta melhor quando entende o papel que cada pessoa joga naturalmente, e quando se sente compreendido no seu próprio papel.</p>
                  </div>
                </>
              )}

              {/* SOB PRESSÃO */}
              {tab === "pressao" && (
                <>
                  <div className="stress-card">
                    <h3>📉 Sob pressão extrema</h3>
                    <p className="stress-behavior">
                      <strong style={{ color: "#e05c5c" }}>{stressProfile.behavior}</strong>
                    </p>
                    <p className="stress-description">
                      {stressProfile.description}
                    </p>
                    <div className="warning-quote">
                      🧠 Pergunta para refletir: {stressProfile.warning}
                    </div>
                  </div>

                  <div className="insight-block warn">
                    <h3>O que muda quando a pressão aumenta</h3>
                    <p>{arch.underPressure}</p>
                  </div>

                  <div className="blindspot-section">
                    <div className="section-label">Ponto cego principal</div>
                    <div className="insight-block" style={{ borderLeftColor: "#e05c5c" }}>
                      <h3>O que você tende a não ver</h3>
                      <p>{arch.blindspot}</p>
                    </div>
                  </div>
                </>
              )}

              {/* CRESCIMENTO */}
              {tab === "crescimento" && (
                <>
                  <div className="insight-block growth">
                    <h3>Sua maior alavanca</h3>
                    <p>{arch.growth}</p>
                  </div>

                  <div className="insight-block" style={{ borderLeftColor: "#a78bfa" }}>
                    <h3>Como receber feedback de você</h3>
                    <p>{arch.feedbackTip}</p>
                  </div>

                  <div className="questions-section">
                    <div className="section-label">Perguntas para levar</div>
                    {arch.questions.map((q, i) => (
                      <div key={i} className="q-card"><p>{q}</p></div>
                    ))}
                  </div>

                  {contradictions.length > 0 && (
                    <div className="insight-block" style={{ borderLeftColor: "#8b7fe8" }}>
                      <h3>Trabalhando com suas contradições</h3>
                      <p>Suas contradições internas não são defeitos - são indicadores de maturidade psicológica. Pessoas integradas não são pessoas sem conflitos internos, são pessoas que aprenderam a dançar com eles.</p>
                    </div>
                  )}
                </>
              )}

            </div>

            <div className="result-actions">
              <div className="save-notice"><span className="save-dot" />Resultado salvo automaticamente</div>
              <button type="button" className="btn-secondary btn-full" onClick={handleExportCurrent}>
                Exportar resultado (.json)
              </button>
              <div className="btn-row">
                <button className="btn-secondary" onClick={() => setScreen("intro")}>← Voltar ao início</button>
                <button className="btn-secondary" onClick={startGame}>Refazer do zero</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}