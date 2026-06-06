import { TRAIT_META, ARCHETYPES } from '../../data/archetypes';
import { SECRET_BADGES } from '../../data/constants';

export default function TabContent({ tab, arch, secondArch, secondKey, contradictions, badges, cognitiveStyle, motivators, teamCompat, stressProfile }) {
  
  const renderPerfil = () => (
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
            {badges.map((b) => (
              <div key={b.id} className={`badge-chip ${SECRET_BADGES.some((sb) => sb.id === b.id) ? "secret-badge" : ""}`}>
                {b.icon} {b.name}
                {SECRET_BADGES.some((sb) => sb.id === b.id) && <span className="secret-badge-icon">⚡</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  const renderCognitivo = () => (
    <>
      <div className="cognitive-card">
        <h3>🧠 Seu estilo cognitivo</h3>
        <p className="cognitive-name">{cognitiveStyle.name}</p>
        <div className="cognitive-traits">
          {cognitiveStyle.traits.map((trait, idx) => (<span key={idx} className="cognitive-trait">{trait}</span>))}
        </div>
      </div>
      <div className="insight-block" style={{ borderLeftColor: "#8b7fe8" }}>
        <h3>Como você processa informação</h3>
        <p>Seu estilo cognitivo reflete como você naturalmente organiza pensamentos, toma decisões e interage com informações complexas. Isso não é fixo - é um padrão que você desenvolveu e que pode ser expandido com consciência.</p>
      </div>
    </>
  );

  const renderMotivacao = () => (
    <>
      <div className="motivator-grid">
        <div className="motivator-section">
          <h4 style={{ color: "#3cb87a" }}>✨ O QUE TE ENERGIZA</h4>
          <div className="motivator-list">{motivators.primary.energizes.map((item, idx) => (<span key={idx} className="motivator-item energize">✓ {item}</span>))}</div>
        </div>
        <div className="motivator-section">
          <h4 style={{ color: "#e05c5c" }}>⚠️ O QUE TE DRENA</h4>
          <div className="motivator-list">{motivators.primary.drains.map((item, idx) => (<span key={idx} className="motivator-item drain">✗ {item}</span>))}</div>
        </div>
        {motivators.secondaryTrait !== motivators.primaryTrait && (
          <div className="motivator-section secondary">
            <h4 style={{ color: TRAIT_META[motivators.secondaryTrait].color }}>+ Influência secundária ({TRAIT_META[motivators.secondaryTrait].label})</h4>
            <div className="motivator-list">{motivators.secondary.energizes.slice(0, 2).map((item, idx) => (<span key={idx} className="motivator-item">✓ {item}</span>))}</div>
          </div>
        )}
      </div>
      <div className="insight-block growth">
        <h3>A chave para sua energia sustentável</h3>
        <p>Ambientes que respeitam seus energizadores e minimizam seus drenadores não são apenas mais confortáveis - são onde você produz seu melhor trabalho sem sacrificar sua saúde mental.</p>
      </div>
    </>
  );

  const renderRelacoes = () => (
    <>
      <div className="section-label">Compatibilidade natural</div>
      {teamCompat.map((comp, idx) => (
        <div key={idx} className="compat-item">
          <span className="compat-dot" style={{ background: TRAIT_META[comp.trait].color }} />
          <div className="compat-reason"><strong style={{ color: TRAIT_META[comp.trait].color }}>{TRAIT_META[comp.trait].label}</strong> — {comp.reason}</div>
        </div>
      ))}
      <div className="section-label">Tensões naturais</div>
      {arch.tension_with.map((w) => (
        <div key={w.id} className="compat-item tension">
          <span className="compat-dot" style={{ background: "#444" }} />
          <div className="compat-reason"><strong style={{ color: "#7a7870" }}>{ARCHETYPES[w.id].name}</strong> — {w.reason}</div>
        </div>
      ))}
      <div className="insight-block" style={{ borderLeftColor: "#d4a843" }}>
        <h3>Como você se conecta</h3>
        <p>Relações para você não são apenas redes - são ecossistemas. Você se conecta melhor quando entende o papel que cada pessoa joga naturalmente, e quando se sente compreendido no seu próprio papel.</p>
      </div>
    </>
  );

  const renderPressao = () => (
    <>
      <div className="stress-card">
        <h3>📉 Sob pressão extrema</h3>
        <p className="stress-behavior"><strong style={{ color: "#e05c5c" }}>{stressProfile.behavior}</strong></p>
        <p className="stress-description">{stressProfile.description}</p>
        <div className="warning-quote">🧠 Pergunta para refletir: {stressProfile.warning}</div>
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
  );

  const renderCrescimento = () => (
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
        {arch.questions.map((q, i) => (<div key={i} className="q-card"><p>{q}</p></div>))}
      </div>
      {contradictions.length > 0 && (
        <div className="insight-block" style={{ borderLeftColor: "#8b7fe8" }}>
          <h3>Trabalhando com suas contradições</h3>
          <p>Suas contradições internas não são defeitos - são indicadores de maturidade psicológica. Pessoas integradas não são pessoas sem conflitos internos, são pessoas que aprenderam a dançar com eles.</p>
        </div>
      )}
    </>
  );

  const tabsMap = {
    perfil: renderPerfil,
    cognitivo: renderCognitivo,
    motivacao: renderMotivacao,
    relacoes: renderRelacoes,
    pressao: renderPressao,
    crescimento: renderCrescimento,
  };

  return tabsMap[tab]();
}