// Estilo Cognitivo (MBTI vibe)
export const COGNITIVE_STYLE = {
  DC: { name: "Executor Estratégico", traits: ["pensa antes de agir", "valoriza eficiência", "prefere autonomia", "questiona processos ruins"] },
  CD: { name: "Analista Assertivo", traits: ["busca dados antes de decidir", "age com confiança", "valoriza lógica", "comunicação direta"] },
  DI: { name: "Líder Inspirador", traits: ["motiva pelo exemplo", "comunicação carismática", "visão de futuro", "age com energia"] },
  ID: { name: "Influenciador Competitivo", traits: ["persuasão estratégica", "foco em resultados", "rede de contatos forte", "energia contagiante"] },
  CS: { name: "Arquiteto", traits: ["pensa em sistemas", "valoriza estrutura", "prefere precisão", "cria soluções duradouras"] },
  SC: { name: "Guardião Metódico", traits: ["segue processos", "valoriza consistência", "atenção a detalhes", "confiável"] },
  IS: { name: "Diplomata", traits: ["constrói pontes", "valoriza harmonia", "comunicação suave", "empatia natural"] },
  SI: { name: "Conector", traits: ["facilita relações", "valoriza colaboração", "comunicação acolhedora", "cria laços duradouras"] },
};

// Badges Secretos
export const SECRET_BADGES = [
  { id: "paradoxo_vivo", icon: "⚡", name: "Paradoxo Vivo", desc: "Contradições internas descobertas", condition: (s: any) => (s.D >= 8 && s.S >= 8) || (s.I >= 8 && s.C >= 8) },
  { id: "diplomata_ferro", icon: "🛡️", name: "Diplomata de Ferro", desc: "Influência e Dominância combinadas", condition: (s: any) => s.I >= 8 && s.D >= 8 },
  { id: "caos_organizado", icon: "🌀", name: "Caos Organizado", desc: "Consciência e Influência altas", condition: (s: any) => s.C >= 8 && s.I >= 8 },
  { id: "equilibrista", icon: "⚖️", name: "Equilibrista", desc: "Todos os traços entre 5 e 15", condition: (s: any) => s.D >= 5 && s.D <= 15 && s.I >= 5 && s.I <= 15 && s.S >= 5 && s.S <= 15 && s.C >= 5 && s.C <= 15 },
  { id: "extremo", icon: "🎯", name: "Especialista", desc: "Um traço acima de 15", condition: (s: any) => s.D > 15 || s.I > 15 || s.S > 15 || s.C > 15 },
  { id: "camaleao", icon: "🦎", name: "Camaleão", desc: "Todos os traços acima de 8", condition: (s: any) => s.D >= 8 && s.I >= 8 && s.S >= 8 && s.C >= 8 },
];

// Badges
export const BADGES = [
  { id: "alta_D", icon: "◆", name: "Executor Nato",     desc: "Dominância alta — 10+ pontos", cond: (s: any) => s.D >= 10 },
  { id: "alta_I", icon: "◉", name: "Conector",          desc: "Influência alta — 10+ pontos", cond: (s: any) => s.I >= 10 },
  { id: "alta_S", icon: "▣", name: "Pilar",             desc: "Estabilidade alta — 10+ pontos", cond: (s: any) => s.S >= 10 },
  { id: "alta_C", icon: "◈", name: "Analista Profundo", desc: "Consciência alta — 10+ pontos", cond: (s: any) => s.C >= 10 },
  { id: "equil",  icon: "⬡", name: "Perfil Integrado",  desc: "Todos os traços ≥ 5",           cond: (s: any) => s.D >= 5 && s.I >= 5 && s.S >= 5 && s.C >= 5 },
  { id: "full",   icon: "▶", name: "Jornada Completa",  desc: "Completou todas as fases",      cond: (_s: any, q: any) => q >= 15 },
  { id: "direto", icon: "⚡", name: "Sem Rodeios",       desc: "4+ respostas diretas (opção A)", cond: (_s: any, _q: any, c: any) => c >= 4 },
];

// Flash messages
export const FLASH = {
  D: ["Alta dominância", "Orientação a resultado", "Modo execução"],
  I: ["Influência relacional", "Conexão ativa", "Modo social"],
  S: ["Estabilidade presente", "Âncora ativa", "Modo consistência"],
  C: ["Análise profunda", "Precisão detectada", "Modo consciência"],
};

// Tabs
export const TABS = [
  { id: "perfil",    label: "Perfil" },
  { id: "cognitivo", label: "Estilo" },
  { id: "motivacao", label: "Motivação" },
  { id: "relacoes",  label: "Relações" },
  { id: "pressao",   label: "Sob Pressão" },
  { id: "crescimento", label: "Crescimento" },
];
