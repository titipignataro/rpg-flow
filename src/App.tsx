import { useState, useEffect, useRef, type ChangeEvent } from "react";

type TraitKey = "i" | "a" | "s";

type PlayerState = Record<TraitKey, number>;

type QuestionChoice = {
  label: string;
  trait: TraitKey;
  weight: number;
};

type QuestionBlock = {
  phase: string;
  cat: string;
  text: string;
  choices: QuestionChoice[];
};

type BadgeRow = {
  id: string;
  icon: string;
  name: string;
  desc: string;
};

type BadgeRule = BadgeRow & {
  condition: (s: PlayerState, q: number, courage: number) => boolean;
};

type ArchetypeDef = {
  name: string;
  condition: (s: PlayerState) => boolean;
  tagline: string;
  traits: { label: string; color: string; insight: string }[];
  insight: string;
};

type SavedResult = {
  state: PlayerState;
  badges: BadgeRow[];
  savedAt: string;
  archetype: string;
};

function isSavedResult(x: unknown): x is SavedResult {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  const st = o.state;
  if (!st || typeof st !== "object") return false;
  const s = st as Record<string, unknown>;
  if (typeof s.i !== "number" || typeof s.a !== "number" || typeof s.s !== "number") return false;
  if (typeof o.savedAt !== "string" || typeof o.archetype !== "string") return false;
  if (!Array.isArray(o.badges)) return false;
  return true;
}

const QUESTIONS: QuestionBlock[] = [
  {
    phase: "Fase 1 — Risco", cat: "Tomada de decisão",
    text: "Uma oportunidade única aparece, mas exige que você aja nas próximas 2 horas sem todos os dados que gostaria de ter.",
    choices: [
      { label: "Age. Você aprende melhor no movimento.", trait: "a", weight: 2 },
      { label: "Pesquisa o máximo possível nesse tempo e age com o que tem.", trait: "i", weight: 2 },
      { label: "Pede mais prazo. Sem informação suficiente, não há decisão boa.", trait: "s", weight: 2 },
      { label: "Deixa passar. Oportunidades apressadas costumam ser armadilhas.", trait: "s", weight: 1 },
    ]
  },
  {
    phase: "Fase 1 — Risco", cat: "Pressão social",
    text: "Você discorda da direção que um grupo está tomando. Todos parecem animados com a ideia.",
    choices: [
      { label: "Fala o que pensa, mesmo que gere desconforto.", trait: "s", weight: 2 },
      { label: "Observa mais um pouco antes de se posicionar.", trait: "i", weight: 2 },
      { label: "Se adapta — talvez o grupo veja algo que você não está vendo.", trait: "a", weight: 2 },
      { label: "Fala em privado com alguém influente do grupo.", trait: "i", weight: 1 },
    ]
  },
  {
    phase: "Fase 1 — Risco", cat: "Criatividade",
    text: "Você precisa resolver um problema urgente. Sua primeira solução não funcionou.",
    choices: [
      { label: "Tenta uma abordagem completamente diferente, do zero.", trait: "a", weight: 2 },
      { label: "Analisa o que deu errado para não repetir o erro.", trait: "i", weight: 2 },
      { label: "Vai na solução mais segura, mesmo que menos original.", trait: "s", weight: 2 },
      { label: "Pede uma segunda opinião antes de tentar de novo.", trait: "s", weight: 1 },
    ]
  },
  {
    phase: "Fase 2 — Relações", cat: "Conflito interpessoal",
    text: "Um colega toma crédito pelo seu trabalho em público, sem perceber o que fez.",
    choices: [
      { label: "Corrige na hora, com leveza.", trait: "s", weight: 2 },
      { label: "Conversa a sós depois — conflito público raramente ajuda.", trait: "i", weight: 2 },
      { label: "Deixa rolar. Quem importa sabe a verdade.", trait: "a", weight: 2 },
      { label: "Fica incomodado, mas não age — ainda processa como lidar.", trait: "i", weight: 1 },
    ]
  },
  {
    phase: "Fase 2 — Relações", cat: "Empatia",
    text: "Um amigo te pede ajuda, mas o momento é péssimo para você.",
    choices: [
      { label: "Ajuda mesmo assim — o compromisso vem primeiro.", trait: "s", weight: 2 },
      { label: "Ajuda, mas comunica claramente o custo para você.", trait: "i", weight: 2 },
      { label: "Propõe uma alternativa que funcione para os dois.", trait: "a", weight: 2 },
      { label: "Recusa com honestidade — você não pode fingir que está bem quando não está.", trait: "s", weight: 1 },
    ]
  },
  {
    phase: "Fase 2 — Relações", cat: "Liderança",
    text: "Você assume um projeto com uma equipe desmotivada. Qual é seu primeiro movimento?",
    choices: [
      { label: "Entende o que desmotivou cada pessoa individualmente.", trait: "i", weight: 2 },
      { label: "Dá uma estrutura e direção clara — incerteza paralisa.", trait: "s", weight: 2 },
      { label: "Cria um resultado rápido para gerar impulso.", trait: "a", weight: 2 },
      { label: "Observa a dinâmica alguns dias antes de agir.", trait: "i", weight: 1 },
    ]
  },
  {
    phase: "Fase 3 — Mente", cat: "Autoanálise",
    text: "Você comete um erro importante. Como você reage internamente nas primeiras horas?",
    choices: [
      { label: "Analisa o que levou ao erro — quer entender o padrão.", trait: "i", weight: 2 },
      { label: "Foca em como consertar o mais rápido possível.", trait: "a", weight: 2 },
      { label: "Sente o peso, mas passa para o próximo passo com método.", trait: "s", weight: 2 },
      { label: "Fica travado um tempo — precisa processar antes de agir.", trait: "i", weight: 1 },
    ]
  },
  {
    phase: "Fase 3 — Mente", cat: "Planejamento",
    text: "Como você geralmente organiza uma semana com muito a fazer?",
    choices: [
      { label: "Lista tudo, prioriza, bloqueia tempo no calendário.", trait: "s", weight: 2 },
      { label: "Mantém uma visão geral na cabeça e age conforme o que pede mais atenção.", trait: "a", weight: 2 },
      { label: "Cria um sistema adaptável — estrutura, mas com margem para o imprevisto.", trait: "i", weight: 2 },
      { label: "Vai de acordo com o fluxo de energia — forçar nem sempre é produtivo.", trait: "a", weight: 1 },
    ]
  },
  {
    phase: "Fase 3 — Mente", cat: "Criatividade sob pressão",
    text: "Você tem uma apresentação importante daqui a 3 horas. Ela está incompleta.",
    choices: [
      { label: "Foca no que tem, ajusta o escopo e entrega limpo.", trait: "s", weight: 2 },
      { label: "Improvisa e usa a pressão como combustível.", trait: "a", weight: 2 },
      { label: "Prioriza as ideias mais fortes e corta o resto.", trait: "i", weight: 2 },
      { label: "Pede para postergar — entrega ruim é pior que atraso.", trait: "s", weight: 1 },
    ]
  },
  {
    phase: "Fase 4 — Trabalho", cat: "Estilo de trabalho",
    text: "Qual ambiente você tende a produzir melhor?",
    choices: [
      { label: "Silêncio e previsibilidade — sei o que esperar do dia.", trait: "s", weight: 2 },
      { label: "Dinâmico e incerto — a variedade me mantém aceso.", trait: "a", weight: 2 },
      { label: "Qualquer um, desde que eu tenha tempo de reflexão.", trait: "i", weight: 2 },
      { label: "Em colaboração — ideias surgem no atrito com outras mentes.", trait: "i", weight: 1 },
    ]
  },
  {
    phase: "Fase 4 — Trabalho", cat: "Feedback",
    text: "Alguém critica seu trabalho de forma direta, mas pouco delicada.",
    choices: [
      { label: "Separa o conteúdo da forma. Crítica válida é válida.", trait: "i", weight: 2 },
      { label: "Recebe bem — prefiro dor de crescimento à zona de conforto.", trait: "a", weight: 2 },
      { label: "Pede para reformular. Forma importa tanto quanto conteúdo.", trait: "s", weight: 2 },
      { label: "Ouve, mas precisa de tempo para processar antes de responder.", trait: "i", weight: 1 },
    ]
  },
  {
    phase: "Fase 4 — Trabalho", cat: "Propósito",
    text: "O que mais te motiva num projeto?",
    choices: [
      { label: "Saber que estou construindo algo que vai além de mim.", trait: "i", weight: 2 },
      { label: "Entregar resultado. A execução me energiza.", trait: "a", weight: 2 },
      { label: "Ter clareza de papéis, metas e processo.", trait: "s", weight: 2 },
      { label: "Aprender algo novo no caminho.", trait: "i", weight: 1 },
    ]
  },
  {
    phase: "Fase 5 — Valores", cat: "Ética",
    text: "Uma pequena desonestidade resolveria um problema grande para você agora.",
    choices: [
      { label: "Não. Integridade não tem escala — ou existe ou não.", trait: "s", weight: 2 },
      { label: "Depende da escala do dano. Analiso caso a caso.", trait: "i", weight: 2 },
      { label: "Evito, mas reconheço que o mundo real não é binário.", trait: "a", weight: 2 },
      { label: "Sinto a tentação, mas o custo interno é alto demais.", trait: "s", weight: 1 },
    ]
  },
  {
    phase: "Fase 5 — Valores", cat: "Mudança",
    text: "Uma mudança grande e inevitável aparece na sua vida.",
    choices: [
      { label: "Busco o padrão — toda mudança carrega uma lição.", trait: "i", weight: 2 },
      { label: "Me movimento com ela. Resistir custa mais do que fluir.", trait: "a", weight: 2 },
      { label: "Crio uma estrutura para atravessá-la com estabilidade.", trait: "s", weight: 2 },
      { label: "Processo o luto primeiro — não consigo avançar sem isso.", trait: "i", weight: 1 },
    ]
  },
  {
    phase: "Fase 5 — Valores", cat: "Legado",
    text: "Como você quer ser lembrado pelas pessoas com quem trabalhou?",
    choices: [
      { label: "Como alguém que entendia o que os outros não viam.", trait: "i", weight: 2 },
      { label: "Como alguém que fazia acontecer, mesmo no caos.", trait: "a", weight: 2 },
      { label: "Como alguém confiável, claro e sem jogos.", trait: "s", weight: 2 },
      { label: "Como alguém que deixou as pessoas melhores do que as encontrou.", trait: "i", weight: 1 },
    ]
  },
];

const BADGES: BadgeRule[] = [
  { id: "adaptador", icon: "⚡", name: "Adaptador Nato", desc: "5+ pontos em Adaptação", condition: (s) => s.a >= 5 },
  { id: "oraculo", icon: "◈", name: "Oráculo", desc: "5+ pontos em Intuição", condition: (s) => s.i >= 5 },
  { id: "arquiteto", icon: "▦", name: "Arquiteto", desc: "5+ pontos em Estrutura", condition: (s) => s.s >= 5 },
  { id: "equilibrado", icon: "◎", name: "Equilíbrio Raro", desc: "Todas as traits em ≥3", condition: (s) => s.i >= 3 && s.a >= 3 && s.s >= 3 },
  { id: "decisor", icon: "▶", name: "Decisor", desc: "Completou todas as fases", condition: (_s, q) => q >= 15 },
  { id: "corajoso", icon: "◆", name: "Sem Fugir", desc: "Escolheu sempre a opção mais difícil", condition: (_s, _q, courage) => courage >= 4 },
];

const ARCHETYPES: ArchetypeDef[] = [
  {
    name: "O Estrategista Intuitivo",
    condition: (s) => s.i >= s.a && s.i >= s.s,
    tagline: "Você vê o que ainda não existe.",
    traits: [
      { label: "Intuição", color: "#a78bfa", insight: "Você lê padrões invisíveis e antecipa o que outros não conseguem articular. Isso é um dom — e uma responsabilidade." },
      { label: "Modo de trabalho", color: "#7a7870", insight: "Você precisa de tempo de reflexão para operar no seu melhor. Ambientes que forçam decisões rápidas te custam mais do que parecem." },
    ],
    insight: "Sua maior força não é a velocidade — é a profundidade. Você constrói entendimento antes de agir, e isso cria resultados mais duráveis. O risco é a paralisia pela análise. Saiba quando o mapa é bom o suficiente para partir.",
  },
  {
    name: "O Executor Adaptável",
    condition: (s) => s.a >= s.i && s.a >= s.s,
    tagline: "Você floresce no caos.",
    traits: [
      { label: "Adaptação", color: "#34d399", insight: "Você se orienta pelo resultado, não pelo plano. Isso te torna um ativo inestimável em ambientes voláteis — e às vezes um risco em ambientes que precisam de consistência." },
      { label: "Modo de trabalho", color: "#7a7870", insight: "Você produz melhor com liberdade de improviso. Estrutura excessiva tende a te travar mais do que ajudar." },
    ],
    insight: "Sua inteligência é cinética — ela emerge no movimento. Você aprende fazendo, e isso é uma vantagem rara. O ponto de atenção: sem alguma âncora estrutural, decisões rápidas podem deixar rastros difíceis de consertar.",
  },
  {
    name: "O Arquiteto Confiável",
    condition: (s) => s.s >= s.i && s.s >= s.a,
    tagline: "Você constrói coisas que duram.",
    traits: [
      { label: "Estrutura", color: "#f59e0b", insight: "Você tem clareza sobre o que quer e como chegar lá. Pessoas ao seu redor tendem a se sentir mais seguras — sua presença organiza o entorno." },
      { label: "Modo de trabalho", color: "#7a7870", insight: "Você performa melhor quando há clareza de papel, expectativas e processo. Ambiguidade crônica te consome energia desproporcional." },
    ],
    insight: "Sua consistência é o que mais impressiona quem trabalha com você. Você entrega o que promete — e isso é mais raro do que parece. O ponto de atenção: em cenários que exigem improv, permita-se sair do roteiro.",
  },
];

const feedbackMsgs: Record<TraitKey, string[]> = {
  i: ["Padrão detectado", "Processamento profundo", "Sinal interno captado"],
  a: ["Movimento primeiro", "Fluxo ativado", "Resposta rápida"],
  s: ["Ancoragem ativa", "Estrutura mantida", "Clareza preservada"],
};

const accentColors: Record<TraitKey, string> = { i: "#a78bfa", a: "#34d399", s: "#f59e0b" };

const STORAGE_KEY = "psyche_saved_result";

function loadSavedResult(): SavedResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isSavedResult(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function saveResult(data: SavedResult) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function clearSavedResult() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

const EXPORT_FILE_VERSION = 1;

function safeExportFilenameDate(iso: string) {
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return "data";
  }
}

/** Serializa o resultado para download (.json). */
function downloadResultFile(data: {
  state: { i: number; a: number; s: number };
  badges: unknown;
  savedAt: string;
  archetype: string;
}) {
  const payload = {
    version: EXPORT_FILE_VERSION,
    app: "psyche",
    state: data.state,
    badges: data.badges,
    savedAt: data.savedAt,
    archetype: data.archetype,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `psyche-resultado-${safeExportFilenameDate(data.savedAt)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function normalizeImportedBadges(raw: unknown): BadgeRow[] {
  if (!Array.isArray(raw)) return [];
  const out: BadgeRow[] = [];
  for (const b of raw) {
    if (!b || typeof b !== "object" || !("id" in b) || typeof (b as { id: unknown }).id !== "string") continue;
    const row = b as { id: string; icon?: unknown; name?: unknown; desc?: unknown };
    const def = BADGES.find((d) => d.id === row.id);
    if (def) out.push({ id: def.id, icon: def.icon, name: def.name, desc: def.desc });
    else {
      out.push({
        id: row.id,
        icon: typeof row.icon === "string" ? row.icon : "◇",
        name: typeof row.name === "string" ? row.name : row.id,
        desc: typeof row.desc === "string" ? row.desc : "",
      });
    }
  }
  return out;
}

/**
 * Lê JSON de arquivo exportado (ou legado igual ao localStorage).
 * @returns mesmo formato usado em saveResult / savedResult
 */
function parseAndNormalizeImportedResult(text: string): SavedResult {
  let o;
  try {
    o = JSON.parse(text);
  } catch {
    throw new Error("O arquivo não é um JSON válido.");
  }
  if (!o || typeof o !== "object") {
    throw new Error("Conteúdo do arquivo inválido.");
  }
  if (o.app != null && o.app !== "psyche") {
    throw new Error("Este arquivo não parece ser um resultado do Psyche.");
  }
  const state = o.state;
  if (
    !state ||
    typeof state !== "object" ||
    typeof state.i !== "number" ||
    typeof state.a !== "number" ||
    typeof state.s !== "number"
  ) {
    throw new Error("Faltam pontuações (Intuição, Adaptação, Estrutura) ou estão incorretas.");
  }
  const nextState = {
    i: Math.max(0, Math.round(state.i)),
    a: Math.max(0, Math.round(state.a)),
    s: Math.max(0, Math.round(state.s)),
  };
  const badges = normalizeImportedBadges(o.badges);
  const savedAt =
    typeof o.savedAt === "string" && !Number.isNaN(Date.parse(o.savedAt))
      ? o.savedAt
      : new Date().toISOString();
  const computed =
    (ARCHETYPES.find((a) => a.condition(nextState)) || ARCHETYPES[0]).name;
  const archetype = typeof o.archetype === "string" ? o.archetype : computed;

  return {
    state: nextState,
    badges,
    savedAt,
    archetype,
  };
}

// ── Radar Canvas ──────────────────────────────────────────────────────────────
function RadarChart({ state }: { state: PlayerState }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cx = 110, cy = 110, r = 80;
    const labels = ["Intuição", "Adaptação", "Estrutura"];
    const colors = ["#a78bfa", "#34d399", "#f59e0b"];
    const vals = [state.i, state.a, state.s];
    const maxVal = 20;

    ctx.clearRect(0, 0, 220, 220);

    for (let level = 1; level <= 4; level++) {
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI / 3) - Math.PI / 2;
        const x = cx + (r * level / 4) * Math.cos(angle);
        const y = cy + (r * level / 4) * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI / 3) - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.stroke();
    }

    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI / 3) - Math.PI / 2;
      const pct = Math.min(vals[i] / maxVal, 1);
      const x = cx + r * pct * Math.cos(angle);
      const y = cy + r * pct * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(167,139,250,0.15)";
    ctx.fill();
    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI / 3) - Math.PI / 2;
      const pct = Math.min(vals[i] / maxVal, 1);
      const x = cx + r * pct * Math.cos(angle);
      const y = cy + r * pct * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = colors[i];
      ctx.fill();

      const lx = cx + (r + 20) * Math.cos(angle);
      const ly = cy + (r + 20) * Math.sin(angle);
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(labels[i], lx, ly);
    }
  }, [state]);

  return <canvas ref={canvasRef} width={220} height={220} />;
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("intro"); // intro | game | result
  const [state, setState] = useState<PlayerState>({ i: 0, a: 0, s: 0 });
  const [qIdx, setQIdx] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState<BadgeRow[]>([]);
  const [courageCount, setCourageCount] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; trait: TraitKey } | null>(null);
  const [badgePopup, setBadgePopup] = useState<BadgeRule | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [savedResult, setSavedResult] = useState<SavedResult | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved result on mount
  useEffect(() => {
    const saved = loadSavedResult();
    if (saved) setSavedResult(saved);
  }, []);

  const startGame = () => {
    setState({ i: 0, a: 0, s: 0 });
    setQIdx(0);
    setEarnedBadges([]);
    setCourageCount(0);
    setFeedback(null);
    setConfirmClear(false);
    setAnimKey(k => k + 1);
    setScreen("game");
  };

  const viewSavedResult = () => {
    if (!savedResult) return;
    setState(savedResult.state);
    setEarnedBadges(savedResult.badges);
    setScreen("result");
  };

  const handleClearSaved = () => {
    if (!confirmClear) { setConfirmClear(true); return; }
    clearSavedResult();
    setSavedResult(null);
    setConfirmClear(false);
  };

  const handleExportSaved = () => {
    if (savedResult) downloadResultFile(savedResult);
  };

  const handleExportCurrentResult = () => {
    downloadResultFile({
      state,
      badges: earnedBadges,
      savedAt: savedResult?.savedAt || new Date().toISOString(),
      archetype: archetype.name,
    });
  };

  const handleImportClick = () => {
    setImportError(null);
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        const data = parseAndNormalizeImportedResult(text);
        saveResult(data);
        setSavedResult(data);
        setImportError(null);
      } catch (err) {
        setImportError(err instanceof Error ? err.message : "Não foi possível importar.");
      }
    };
    reader.onerror = () => setImportError("Não foi possível ler o arquivo.");
    reader.readAsText(file, "utf-8");
  };

  const choose = (choice: QuestionChoice, idx: number) => {
    const nextState = { ...state, [choice.trait]: state[choice.trait] + choice.weight };
    const nextCourage = idx === 0 ? courageCount + 1 : courageCount;
    const nextQ = qIdx + 1;

    setState(nextState);
    setCourageCount(nextCourage);

    // feedback flash
    const msgs = feedbackMsgs[choice.trait];
    setFeedback({ msg: msgs[Math.floor(Math.random() * msgs.length)], trait: choice.trait });
    setTimeout(() => setFeedback(null), 1400);

    // check badges
    const newBadges = BADGES.filter(b =>
      !earnedBadges.find(e => e.id === b.id) && b.condition(nextState, nextQ, nextCourage)
    );
    if (newBadges.length > 0) {
      setEarnedBadges(prev => [...prev, ...newBadges]);
      setBadgePopup(newBadges[0]);
      setTimeout(() => setBadgePopup(null), 2200);
    }

    if (nextQ >= QUESTIONS.length) {
      const resultData = {
        state: nextState,
        badges: [...earnedBadges, ...newBadges],
        savedAt: new Date().toISOString(),
        archetype: (ARCHETYPES.find(a => a.condition(nextState)) || ARCHETYPES[0]).name,
      };
      saveResult(resultData);
      setSavedResult(resultData);
      setTimeout(() => setScreen("result"), 600);
    } else {
      setQIdx(nextQ);
      setAnimKey(k => k + 1);
    }
  };

  const archetype = ARCHETYPES.find(a => a.condition(state)) || ARCHETYPES[0];
  const q = QUESTIONS[qIdx] || QUESTIONS[0];
  const letters = ["A", "B", "C", "D"];

  // ── Styles ──────────────────────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;1,300&family=DM+Mono:wght@400;500&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .psyche-root {
      background: #0c0c0f;
      min-height: 100vh;
      font-family: 'Crimson Pro', Georgia, serif;
      color: #e8e6df;
      position: relative;
      overflow: hidden;
    }

    /* INTRO */
    .intro-wrap {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 3rem 2rem;
    }
    .intro-orb {
      width: 120px; height: 120px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #a78bfa, #4c1d95);
      margin: 0 auto 2rem;
      position: relative;
      animation: pulse 3s ease-in-out infinite;
    }
    .intro-orb::after {
      content: '';
      position: absolute;
      inset: -12px;
      border-radius: 50%;
      border: 1px solid rgba(167,139,250,0.2);
      animation: ring 3s ease-in-out infinite;
    }
    .intro-title { font-size: 2.6rem; font-weight: 300; letter-spacing: -0.02em; margin-bottom: 0.5rem; animation: fadeIn 0.8s ease both; }
    .intro-sub { font-size: 1.1rem; color: #7a7870; font-style: italic; margin-bottom: 1.5rem; animation: fadeIn 0.8s 0.2s ease both; }

    /* SAVED RESULT CARD */
    .saved-card {
      background: #13131a; border: 1px solid rgba(167,139,250,0.25);
      border-radius: 6px; padding: 1rem 1.25rem;
      width: 100%; max-width: 360px; margin-bottom: 1.5rem;
      animation: fadeIn 0.8s 0.3s ease both;
    }
    .saved-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; }
    .saved-card-label { font-family: 'DM Mono', monospace; font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: #a78bfa; }
    .saved-card-date { font-family: 'DM Mono', monospace; font-size: 0.62rem; color: #7a7870; }
    .saved-card-archetype { font-size: 1.1rem; font-weight: 300; margin-bottom: 0.85rem; }
    .saved-mini-bars { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; margin-bottom: 0.75rem; }
    .saved-mini-label { font-family: 'DM Mono', monospace; font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase; display: flex; justify-content: space-between; margin-bottom: 3px; }
    .saved-mini-track { height: 3px; background: #1c1c26; border-radius: 3px; overflow: hidden; }
    .saved-mini-fill { height: 100%; border-radius: 3px; }
    .saved-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem; }
    .saved-badge-chip { font-size: 1rem; cursor: default; }
    .intro-btn-row { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; animation: fadeIn 0.8s 0.45s ease both; margin-bottom: 0.75rem; }
    .btn-secondary { background: transparent; border: 1px solid rgba(167,139,250,0.35); color: #a78bfa; padding: 0.9rem 1.75rem; font-family: 'DM Mono', monospace; font-size: 0.82rem; letter-spacing: 0.08em; cursor: pointer; border-radius: 4px; transition: all 0.2s; text-transform: uppercase; }
    .btn-secondary:hover { border-color: #a78bfa; background: rgba(167,139,250,0.07); }
    .btn-clear { background: transparent; border: none; color: #7a7870; font-family: 'DM Mono', monospace; font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; padding: 0.5rem; transition: color 0.2s; animation: fadeIn 0.8s 0.5s ease both; }
    .btn-clear:hover { color: #f87171; }
    .result-save-notice { display: flex; align-items: center; gap: 0.5rem; font-family: 'DM Mono', monospace; font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; color: #7a7870; margin-bottom: 1rem; }
    .save-dot { width: 6px; height: 6px; border-radius: 50%; background: #34d399; display: inline-block; flex-shrink: 0; }
    .result-btn-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .result-btn-row .btn-restart { flex: 1; min-width: 140px; }
    .result-export-row { width: 100%; margin-bottom: 1rem; }
    .result-export-row .btn-secondary { width: 100%; }
    .file-input-hidden { position: absolute; width: 0; height: 0; opacity: 0; pointer-events: none; }
    .import-error { color: #f87171; font-family: 'DM Mono', monospace; font-size: 0.72rem; text-align: center; margin-top: 0.75rem; max-width: 380px; line-height: 1.4; }
    .intro-file-row { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; margin-bottom: 0.25rem; animation: fadeIn 0.8s 0.42s ease both; }

    /* BUTTONS */
    .btn-primary {
      background: #1c1c26; border: 1px solid rgba(255,255,255,0.14);
      color: #e8e6df; padding: 0.9rem 2.5rem;
      font-family: 'DM Mono', monospace; font-size: 0.85rem;
      letter-spacing: 0.08em; cursor: pointer; border-radius: 4px;
      transition: all 0.2s; text-transform: uppercase;
      animation: fadeIn 0.8s 0.4s ease both;
    }
    .btn-primary:hover { border-color: #a78bfa; color: #a78bfa; }
    .btn-restart {
      width: 100%; background: transparent; border: 1px solid rgba(255,255,255,0.14);
      color: #7a7870; padding: 0.85rem;
      font-family: 'DM Mono', monospace; font-size: 0.78rem;
      letter-spacing: 0.08em; text-transform: uppercase;
      cursor: pointer; border-radius: 4px; transition: all 0.2s;
    }
    .btn-restart:hover { border-color: #a78bfa; color: #a78bfa; }

    /* GAME HEADER */
    .game-header {
      padding: 1.25rem 1.5rem 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      display: flex; align-items: center; gap: 1rem;
    }
    .phase-tag { font-family: 'DM Mono', monospace; font-size: 0.7rem; letter-spacing: 0.12em; color: #7a7870; text-transform: uppercase; }
    .progress-bar { flex: 1; height: 2px; background: #1c1c26; border-radius: 2px; overflow: hidden; }
    .progress-fill { height: 100%; background: #a78bfa; transition: width 0.5s ease; border-radius: 2px; }
    .q-counter { font-family: 'DM Mono', monospace; font-size: 0.75rem; color: #7a7870; min-width: 48px; text-align: right; }

    /* TRAIT BARS */
    .traits-bar {
      padding: 1rem 1.5rem;
      display: grid; grid-template-columns: 1fr 1fr 1fr;
      gap: 0.75rem;
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }
    .trait-item { display: flex; flex-direction: column; gap: 4px; }
    .trait-label { font-family: 'DM Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; display: flex; justify-content: space-between; }
    .trait-track { height: 4px; background: #1c1c26; border-radius: 4px; overflow: hidden; }
    .trait-fill { height: 100%; border-radius: 4px; transition: width 0.6s cubic-bezier(0.34,1.56,0.64,1); }

    /* SCENARIO */
    .scenario-area { padding: 2rem 1.5rem 1.5rem; }
    .scenario-cat { font-family: 'DM Mono', monospace; font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; color: #7a7870; margin-bottom: 0.75rem; }
    .scenario-text { font-size: 1.35rem; font-weight: 300; line-height: 1.65; margin-bottom: 2rem; max-width: 560px; }
    .choices-list { display: flex; flex-direction: column; gap: 0.6rem; }
    .choice-btn {
      background: #13131a; border: 1px solid rgba(255,255,255,0.07);
      color: #e8e6df; padding: 1rem 1.25rem;
      font-family: 'Crimson Pro', Georgia, serif; font-size: 1rem;
      line-height: 1.5; text-align: left; cursor: pointer;
      border-radius: 4px; transition: all 0.18s;
      display: flex; gap: 0.75rem; align-items: flex-start;
    }
    .choice-btn:hover { border-color: rgba(255,255,255,0.14); background: #1c1c26; transform: translateX(4px); }
    .choice-letter { font-family: 'DM Mono', monospace; font-size: 0.7rem; letter-spacing: 0.05em; color: #7a7870; margin-top: 2px; min-width: 16px; }

    /* FEEDBACK FLASH */
    .feedback-flash {
      position: fixed; top: 0; left: 0; right: 0;
      padding: 0.75rem 1.5rem;
      font-family: 'DM Mono', monospace; font-size: 0.78rem;
      letter-spacing: 0.06em; text-align: center; z-index: 100;
      animation: flashAnim 1.4s ease forwards; pointer-events: none;
    }

    /* BADGE POPUP */
    .badge-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 199; }
    .badge-popup {
      position: fixed; top: 50%; left: 50%;
      transform: translate(-50%,-50%);
      background: #1c1c26; border: 1px solid rgba(255,255,255,0.14);
      border-radius: 8px; padding: 2rem 2.5rem;
      text-align: center; z-index: 200;
      animation: badgePop 0.5s ease both; max-width: 300px;
    }
    .badge-icon-lg { font-size: 3rem; margin-bottom: 0.75rem; display: block; }
    .badge-popup-name { font-size: 1.3rem; font-weight: 400; margin-bottom: 0.25rem; }
    .badge-popup-desc { font-size: 0.9rem; color: #7a7870; font-style: italic; }

    /* RESULT */
    .result-wrap { padding: 2rem 1.5rem; min-height: 100vh; }
    .result-header { text-align: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.07); }
    .result-archetype-label { font-family: 'DM Mono', monospace; font-size: 0.7rem; letter-spacing: 0.16em; text-transform: uppercase; color: #7a7870; margin-bottom: 0.5rem; }
    .result-name { font-size: 2.4rem; font-weight: 300; margin-bottom: 0.5rem; }
    .result-tagline { font-style: italic; color: #7a7870; font-size: 1.05rem; }
    .radar-wrap { display: flex; justify-content: center; margin: 1.5rem 0; }
    .result-traits { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1.5rem; }
    .result-trait-card { background: #13131a; border: 1px solid rgba(255,255,255,0.07); border-radius: 6px; padding: 1rem 1.25rem; }
    .result-trait-card h4 { font-family: 'DM Mono', monospace; font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.4rem; }
    .result-trait-card p { font-size: 0.95rem; color: #7a7870; line-height: 1.6; font-style: italic; }
    .insight-section { background: #13131a; border-left: 2px solid #a78bfa; padding: 1.25rem; border-radius: 0 4px 4px 0; margin-bottom: 1.5rem; }
    .insight-section h3 { font-family: 'DM Mono', monospace; font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; color: #a78bfa; margin-bottom: 0.6rem; }
    .insight-section p { font-size: 1rem; line-height: 1.7; }
    .badges-section { margin-bottom: 1.5rem; }
    .badges-section h3 { font-family: 'DM Mono', monospace; font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: #7a7870; margin-bottom: 0.75rem; }
    .badges-grid { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .badge-chip { background: #13131a; border: 1px solid rgba(255,255,255,0.07); border-radius: 4px; padding: 0.5rem 0.75rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; }

    /* KEYFRAMES */
    @keyframes pulse { 0%,100%{transform:scale(1);opacity:0.9} 50%{transform:scale(1.05);opacity:1} }
    @keyframes ring { 0%,100%{transform:scale(1);opacity:0.3} 50%{transform:scale(1.08);opacity:0.6} }
    @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
    @keyframes flashAnim { 0%{opacity:1} 70%{opacity:1} 100%{opacity:0} }
    @keyframes badgePop { 0%{transform:translate(-50%,-50%) scale(0.5);opacity:0} 70%{transform:translate(-50%,-50%) scale(1.05)} 100%{transform:translate(-50%,-50%) scale(1);opacity:1} }
  `;

  const maxVal = 30;
  const pctI = Math.min((state.i / maxVal) * 100, 100);
  const pctA = Math.min((state.a / maxVal) * 100, 100);
  const pctS = Math.min((state.s / maxVal) * 100, 100);

  return (
    <>
      <style>{css}</style>
      <div className="psyche-root">

        {/* FEEDBACK FLASH */}
        {feedback && (
          <div
            className="feedback-flash"
            style={{
              background: `rgba(${feedback.trait === "i" ? "167,139,250" : feedback.trait === "a" ? "52,211,153" : "245,158,11"},0.1)`,
              color: accentColors[feedback.trait],
              borderBottom: `1px solid ${accentColors[feedback.trait]}`,
            }}
          >
            {feedback.msg}
          </div>
        )}

        {/* BADGE POPUP */}
        {badgePopup && (
          <>
            <div className="badge-overlay" />
            <div className="badge-popup">
              <span className="badge-icon-lg">{badgePopup.icon}</span>
              <div className="badge-popup-name">{badgePopup.name}</div>
              <div className="badge-popup-desc">{badgePopup.desc}</div>
            </div>
          </>
        )}

        {/* INTRO */}
        {screen === "intro" && (
          <div className="intro-wrap">
            <div className="intro-orb" />
            <div className="intro-title">Psyche</div>
            <div className="intro-sub">Um espelho com 15 perguntas</div>

            {savedResult && (
              <div className="saved-card">
                <div className="saved-card-header">
                  <span className="saved-card-label">Resultado salvo</span>
                  <span className="saved-card-date">{formatDate(savedResult.savedAt)}</span>
                </div>
                <div className="saved-card-archetype">{savedResult.archetype}</div>
                <div className="saved-mini-bars">
                  {([
                    { key: "i" as TraitKey, label: "Intuição", color: "#a78bfa" },
                    { key: "a" as TraitKey, label: "Adaptação", color: "#34d399" },
                    { key: "s" as TraitKey, label: "Estrutura", color: "#f59e0b" },
                  ] as const).map(({ key, label, color }) => (
                    <div key={key}>
                      <div className="saved-mini-label">
                        <span style={{ color }}>{label}</span>
                        <span>{savedResult.state[key]}</span>
                      </div>
                      <div className="saved-mini-track">
                        <div
                          className="saved-mini-fill"
                          style={{
                            width: `${Math.min((savedResult.state[key] / 20) * 100, 100)}%`,
                            background: color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {savedResult.badges && savedResult.badges.length > 0 && (
                  <div className="saved-badges">
                    {savedResult.badges.map(b => (
                      <span key={b.id} className="saved-badge-chip" title={b.name}>{b.icon}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="file-input-hidden"
              tabIndex={-1}
              aria-hidden
              onChange={handleImportFile}
            />

            <div className="intro-file-row">
              <button type="button" className="btn-secondary" onClick={handleImportClick}>
                Carregar de arquivo
              </button>
              {savedResult && (
                <button type="button" className="btn-secondary" onClick={handleExportSaved}>
                  Exportar para arquivo
                </button>
              )}
            </div>
            {importError && (
              <div className="import-error" role="alert">
                {importError}
              </div>
            )}

            <div className="intro-btn-row">
              {savedResult && (
                <button className="btn-secondary" onClick={viewSavedResult}>
                  Ver resultado salvo
                </button>
              )}
              <button className="btn-primary" onClick={startGame}>
                {savedResult ? "Refazer jornada" : "Iniciar jornada"}
              </button>
            </div>

            {savedResult && (
              <button className="btn-clear" onClick={handleClearSaved}>
                {confirmClear ? "Confirmar exclusão" : "Apagar resultado salvo"}
              </button>
            )}
          </div>
        )}

        {/* GAME */}
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
              <div className="trait-item">
                <div className="trait-label">
                  <span style={{ color: "#a78bfa" }}>Intuição</span>
                  <span>{state.i}</span>
                </div>
                <div className="trait-track">
                  <div className="trait-fill" style={{ width: `${pctI}%`, background: "#a78bfa" }} />
                </div>
              </div>
              <div className="trait-item">
                <div className="trait-label">
                  <span style={{ color: "#34d399" }}>Adaptação</span>
                  <span>{state.a}</span>
                </div>
                <div className="trait-track">
                  <div className="trait-fill" style={{ width: `${pctA}%`, background: "#34d399" }} />
                </div>
              </div>
              <div className="trait-item">
                <div className="trait-label">
                  <span style={{ color: "#f59e0b" }}>Estrutura</span>
                  <span>{state.s}</span>
                </div>
                <div className="trait-track">
                  <div className="trait-fill" style={{ width: `${pctS}%`, background: "#f59e0b" }} />
                </div>
              </div>
            </div>

            <div className="scenario-area">
              <div className="scenario-cat">{q.cat}</div>
              <div className="scenario-text" key={`text-${animKey}`} style={{ animation: "slideUp 0.4s ease both" }}>
                {q.text}
              </div>
              <div className="choices-list">
                {q.choices.map((c, i) => (
                  <button
                    key={`${animKey}-${i}`}
                    className="choice-btn"
                    style={{ animation: `slideUp 0.4s ${i * 0.05}s ease both` }}
                    onClick={() => choose(c, i)}
                  >
                    <span className="choice-letter">{letters[i]}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* RESULT */}
        {screen === "result" && (
          <div className="result-wrap">
            <div className="result-header">
              <div className="result-archetype-label">Seu arquétipo</div>
              <div className="result-name">{archetype.name}</div>
              <div className="result-tagline">{archetype.tagline}</div>
            </div>

            <div className="radar-wrap">
              <RadarChart state={state} />
            </div>

            <div className="result-traits">
              {archetype.traits.map((t, i) => (
                <div className="result-trait-card" key={i}>
                  <h4><span style={{ color: t.color }}>{t.label}</span></h4>
                  <p>{t.insight}</p>
                </div>
              ))}
            </div>

            <div className="insight-section">
              <h3>Insight central</h3>
              <p>{archetype.insight}</p>
            </div>

            <div className="badges-section">
              <h3>Conquistas</h3>
              <div className="badges-grid">
                {earnedBadges.length === 0 ? (
                  <span style={{ color: "#7a7870", fontSize: "0.9rem", fontStyle: "italic" }}>
                    Nenhuma conquista desbloqueada nessa rodada.
                  </span>
                ) : (
                  earnedBadges.map((b) => (
                    <div className="badge-chip" key={b.id}>
                      <span>{b.icon}</span>
                      <span>{b.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="result-save-notice"><span className="save-dot" />Resultado salvo automaticamente</div>
            <div className="result-export-row">
              <button type="button" className="btn-secondary" onClick={handleExportCurrentResult}>
                Exportar resultado (.json)
              </button>
            </div>
            <div className="result-btn-row">
              <button className="btn-restart" onClick={() => setScreen("intro")}>← Voltar ao início</button>
              <button className="btn-restart" onClick={startGame}>Refazer do zero</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}