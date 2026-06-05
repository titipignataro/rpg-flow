import { COGNITIVE_STYLE } from "./data/constants";

export function getCognitiveStyle(D, I, S, C) {
  const sorted = Object.entries({ D, I, S, C }).sort((a,b) => b[1] - a[1]);
  const first = sorted[0][0];
  const second = sorted[1][0];
  const key = (first + second);
  const reverseKey = (second + first);
  return COGNITIVE_STYLE[key] || COGNITIVE_STYLE[reverseKey] || { name: "Perfil Integrado", traits: ["equilíbrio entre todos os traços", "adaptabilidade", "versatilidade", "compreensão ampla"] };
}

export function getContradictions(state) {
  const contradictions = [];
  const { D, I, S, C } = state;
  
  if (D >= 8 && S >= 8) {
    contradictions.push({
      title: "O Paradoxo da Ação Estável",
      description: "Você gosta de controle e velocidade, mas também busca estabilidade. Isso gera um conflito interno: quer acelerar mudanças, mas odeia consequências caóticas. Você é mais eficaz quando encontra um ritmo sustentável, não quando corre ou espera demais."
    });
  }
  
  if (I >= 8 && C >= 8) {
    contradictions.push({
      title: "O Paradoxo do Conector Seletivo",
      description: "Você ama pessoas, mas é seletivo sobre quem deixa entrar. Isso não é incoerência - é sabedoria. Você socializa com energia, mas reserva sua profundidade para poucos. O desafio é não se isolar enquanto espera encontrar 'os certos'."
    });
  }
  
  if (D >= 8 && I >= 8) {
    contradictions.push({
      title: "O Paradoxo do Líder que Escuta",
      description: "Você tem pulso firme para decidir, mas também energia para engajar. O conflito aparece quando precisa escolher entre velocidade (D) e consenso (I). Sua força está em saber quando cada modo é necessário - e comunicar qual está em uso."
    });
  }
  
  if (C >= 8 && S >= 8) {
    contradictions.push({
      title: "O Paradoxo da Perfeição Paciente",
      description: "Você quer tudo bem feito (C) mas também quer manter a estabilidade (S). Isso pode gerar paralisia por análise. O truque não é abandonar o padrão, mas aceitar que 'bom o suficiente' às vezes é a escolha mais estável a longo prazo."
    });
  }
  
  if (contradictions.length === 0) {
    contradictions.push({
      title: "Perfil Coerente",
      description: "Seus traços se complementam mais do que se contradizem. Isso não significa ausência de complexidade - significa que você encontrou um alinhamento natural entre seus valores e ações. O risco é não desenvolver áreas que naturalmente evitamos."
    });
  }
  
  return contradictions;
}

export function getStressProfile(state) {
  const { D, I, S, C } = state;
  const max = Math.max(D, I, S, C);
  
  if (D === max) {
    return {
      behavior: "Assumir tudo sozinho",
      description: "Sob pressão extrema, você tende a centralizar decisões e responsabilidades. Confia mais em si do que nos outros - o que funciona no curto prazo, mas pode gerar esgotamento. O alerta é quando você para de delegar completamente.",
      warning: "Você está assumindo demais quando deveria compartilhar?"
    };
  }
  if (I === max) {
    return {
      behavior: "Buscar validação externa",
      description: "Em momentos de crise, você procura mais aprovação e conexão do que percebe. Isso pode levar a decisões baseadas em aceitação social, não em mérito técnico. O risco é priorizar 'agradar' em vez de 'resolver'.",
      warning: "Você está tomando decisões para agradar ou para resolver?"
    };
  }
  if (S === max) {
    return {
      behavior: "Congelamento temporário",
      description: "Sob pressão intensa, você tende a demorar mais para reagir - processando internamente antes de agir. Isso é valioso em crises que exigem calma, mas perigoso quando velocidade é essencial. O segredo é reconhecer quando está 'processando' ou 'evitando'.",
      warning: "Você está processando ou está evitando a decisão?"
    };
  }
  if (C === max) {
    return {
      behavior: "Análise excessiva",
      description: "Sob estresse, você busca mais dados, mais cenários, mais validação antes de agir. Isso pode se transformar em paralisia por análise - o mapa perfeito atrasa a partida. O sinal vermelho é quando você começa a refazer análises já concluídas.",
      warning: "Você já tem dados suficientes para decidir agora?"
    };
  }
  return {
    behavior: "Buscar equilíbrio interno",
    description: "Seu perfil equilibrado permite alternar estratégias sob pressão. O desafio é não ficar pulando entre modos sem concluir nenhum. Escolha uma abordagem e execute - a consistência sob pressão gera confiança no entorno.",
    warning: "Estou alternando demais entre estratégias?"
  };
}

export function getMotivators(state) {
  const { D, I, S, C } = state;
  const max = Math.max(D, I, S, C);
  
  const motivators = {
    D: {
      energizes: ["autonomia para agir", "desafios claros", "decisões rápidas", "resultados visíveis"],
      drains: ["microgerenciamento", "burocracia excessiva", "lentidão proposital", "falta de direção"]
    },
    I: {
      energizes: ["reconhecimento genuíno", "colaboração criativa", "ambiente dinâmico", "liberdade de expressão"],
      drains: ["isolamento prolongado", "críticas destrutivas", "rigidez excessiva", "falta de feedback"]
    },
    S: {
      energizes: ["estabilidade emocional", "processos claros", "ambiente previsível", "reconhecimento consistente"],
      drains: ["mudanças constantes", "conflitos abertos", "pressão por velocidade", "falta de clareza"]
    },
    C: {
      energizes: ["domínio técnico", "precisão analítica", "autonomia intelectual", "desafios complexos"],
      drains: ["improviso constante", "decisões sem dados", "superficialidade", "interrupções frequentes"]
    }
  };
  
  let primary = max === D ? "D" : max === I ? "I" : max === S ? "S" : "C";
  const sorted = Object.entries(state).sort((a,b) => b[1] - a[1]);
  const second = sorted[1][0];
  
  return {
    primary: motivators[primary],
    secondary: motivators[second],
    primaryTrait: primary,
    secondaryTrait: second
  };
}

export function getTeamCompatibility(state) {
  const { D, I, S, C } = state;
  const max = Math.max(D, I, S, C);
  const compatibilities = [];
  
  if (max === D) {
    compatibilities.push({ trait: "I", reason: "Complementa sua decisão com energia relacional - eles trazem as pessoas enquanto você traz o rumo." });
    compatibilities.push({ trait: "S", reason: "Fornece estabilidade onde você tende a acelerar demais - evitando que a equipe queime etapas." });
    compatibilities.push({ trait: "C", reason: "Valida seus instintos com análise - evitando decisões baseadas apenas em impulso." });
  }
  else if (max === I) {
    compatibilities.push({ trait: "D", reason: "Dá estrutura à sua energia - transformando entusiasmo em execução." });
    compatibilities.push({ trait: "S", reason: "Ancora sua criatividade com consistência - evitando dispersão." });
    compatibilities.push({ trait: "C", reason: "Adiciona profundidade analítica às suas conexões relacionais." });
  }
  else if (max === S) {
    compatibilities.push({ trait: "D", reason: "Empurra a ação onde você tende a esperar - quebrando a inércia quando necessário." });
    compatibilities.push({ trait: "I", reason: "Traz energia e dinamismo para a estabilidade que você constrói." });
    compatibilities.push({ trait: "C", reason: "Reforça sua necessidade de processo com análise aprofundada." });
  }
  else if (max === C) {
    compatibilities.push({ trait: "D", reason: "Tira a análise do papel - transformando reflexão em ação." });
    compatibilities.push({ trait: "I", reason: "Comunica suas ideias complexas para o resto do mundo." });
    compatibilities.push({ trait: "S", reason: "Dá continuidade aos seus projetos - garantindo que não morram na implementação." });
  }
  
  return compatibilities;
}