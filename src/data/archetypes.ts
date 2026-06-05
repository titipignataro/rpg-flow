export const TRAIT_META = {
  D: { label: "Dominância",   color: "#e05c5c" },
  I: { label: "Influência",   color: "#d4a843" },
  S: { label: "Estabilidade", color: "#3cb87a" },
  C: { label: "Consciência",  color: "#8b7fe8" },
};

export const ARCHETYPES = {
  D: {
    id: "D",
    name: "O Comandante",
    disc: "Dominância",
    tagline: "Você não espera o futuro — você o fabrica.",
    color: "#e05c5c",
    overview: "Sua inteligência é executiva. Você enxerga o caminho mais curto entre onde está e onde quer chegar — e raramente hesita. Em ambientes que se movem rápido você ganha energia; ambientes lentos e burocráticos te consomem. Você pensa em resultados antes de pensar em processos, e isso te torna inestimável em cenários que precisam de direção.",
    underPressure: "Sob pressão alta, você pode se tornar excessivamente diretivo — cortando contribuições antes que amadureçam. Sua velocidade é um ativo, mas funciona como filtro que elimina perspectivas que precisaram de mais tempo para emergir. O que parece decisão para você pode parecer atropelamento para os outros.",
    blindspot: "Você tende a subestimar o custo emocional que sua velocidade impõe ao entorno. O que parece objetividade pode soar como frieza — criando resistência silenciosa que você raramente detecta até ser tarde.",
    publicVsPrivate: "Para o mundo, você parece seguro e decidido. Internamente, existe uma pressão constante de desempenho que poucas pessoas conhecem.",
    feedbackTip: "Seja direto e vá ao ponto. Argumente com resultado, não com emoção. Não precisa de rodeios — prefere franqueza a elogios vazios.",
    growth: "Sua maior alavanca é a escuta real — não a escuta performática que aguarda a vez de falar. Permita-se ser convencido. A decisão que muda de direção por causa de algo que você ouviu é mais forte do que a que ignorou.",
    questions: [
      "Quando foi a última vez que mudei de posição por causa de algo que ouvi?",
      "Existe alguém no meu entorno cuja perspectiva eu consistentemente descarto?",
    ],
    works_with: [
      { id: "S", reason: "Te dá execução consistente e estabilidade onde você tende a acelerar demais." },
      { id: "C", reason: "Te dá profundidade analítica que complementa sua velocidade de decisão." },
    ],
    tension_with: [
      { id: "I", reason: "Tensão de ritmo: você prioriza resultado, eles priorizam processo relacional. Não é incompatibilidade — é necessidade de ajuste consciente." },
    ],
  },
  I: {
    id: "I",
    name: "O Catalisador",
    disc: "Influência",
    tagline: "Você transforma salas frias em movimento.",
    color: "#d4a843",
    overview: "Sua inteligência é relacional e criativa. Você percebe o estado emocional de um grupo antes de qualquer dado ser apresentado — e sabe como mudar esse estado. Em ambientes de alta interação você é multiplicador; em isolamento prolongado, você murcha. Você vê possibilidades onde outros veem obstáculos.",
    underPressure: "Sob pressão, você pode buscar aprovação em excesso — ajustando sua posição para reduzir conflito antes de proteger o que é certo. Seu desejo de conexão pode se tornar evitação de atrito necessário. O entusiasmo que mobiliza no início pode dissipar antes da linha de chegada.",
    blindspot: "Você tende a iniciar mais do que conclui. Projetos precisam de quem os mantenha vivos no meio — e esse é o capítulo que te custa mais. A energia do começo não garante a entrega do fim.",
    publicVsPrivate: "Para o mundo, você parece naturalmente confiante e sociável. Internamente, a necessidade de validação pode ser mais intensa do que qualquer um imagina.",
    feedbackTip: "Cuide do tom e do contexto. Crítica crua sem relação prévia gera defensividade. Uma conversa de 1:1 é mais eficaz do que em público — o conteúdo chega melhor quando a relação está segura.",
    growth: "Sua maior alavanca é a profundidade de comprometimento. Não de análise — de conclusão. Escolha menos frentes e vá até o fim em cada uma. O que você termina vale mais do que o que você começa.",
    questions: [
      "Em quais projetos iniciei mas não conclui nos últimos seis meses?",
      "Estou buscando conexão genuína ou estou buscando validação?",
    ],
    works_with: [
      { id: "S", reason: "Te ancora — dá consistência e ritmo onde você tende a variar." },
      { id: "D", reason: "Te dá foco e direção onde você tende a se dispersar em possibilidades." },
    ],
    tension_with: [
      { id: "C", reason: "Tensão de linguagem: você fala em possibilidades, eles falam em evidências. A complementaridade existe — mas exige tradução consciente dos dois lados." },
    ],
  },
  S: {
    id: "S",
    name: "O Guardião",
    disc: "Estabilidade",
    tagline: "Você constrói o chão em que os outros caminham.",
    color: "#3cb87a",
    overview: "Sua inteligência é a da continuidade. Você sustenta sistemas, relações e processos com uma consistência que poucos conseguem manter. Mudanças abruptas não te assustam — você sente os custos invisíveis que elas impõem, e essa percepção te torna mais cauteloso do que o ambiente às vezes pede. Sua presença organiza o entorno de forma que as pessoas só percebem quando você não está.",
    underPressure: "Sob pressão, você tende a absorver mais do que deveria — preferindo sustentar o peso a criar atrito. Essa generosidade tem limite, e quando é ultrapassado o esgotamento é silencioso e difícil de reverter. Você pode segurar feedback necessário por tempo demais.",
    blindspot: "Você pode demorar demais para dar retornos difíceis. A harmonia que você protege hoje pode custar a transparência que o outro precisaria amanhã. Bondade sem franqueza pode ser uma forma sutil de distância.",
    publicVsPrivate: "Para o mundo, você parece paciente e inabalável. Internamente, pode haver muito mais frustração acumulada do que você mostra — e às vezes mais do que deveria.",
    feedbackTip: "Dê tempo para processar. Não exija resposta imediata. Seja específico e paciente — deixe espaço para voltar com reflexão. Pressionar por reação rápida tende a gerar fechamento.",
    growth: "Sua maior alavanca é a voz. Você já enxerga o que está errado antes da maioria — o passo seguinte é falar antes que o custo se acumule. Clareza a tempo é cuidado.",
    questions: [
      "O que estou segurando que precisaria ter sido dito há tempo?",
      "Estou sendo consistente ou estou evitando o conflito que seria necessário?",
    ],
    works_with: [
      { id: "D", reason: "Te dá direção e empurrão quando você tende a esperar pelo momento perfeito." },
      { id: "C", reason: "Valida sua necessidade de processo e qualidade — trabalham na mesma frequência." },
    ],
    tension_with: [
      { id: "I", reason: "Tensão de profundidade: eles querem variedade e velocidade relacional; você prefere consistência e continuidade." },
    ],
  },
  C: {
    id: "C",
    name: "O Arquiteto",
    disc: "Consciência",
    tagline: "Você vê o que ainda não foi dito.",
    color: "#8b7fe8",
    overview: "Sua inteligência é estrutural e profunda. Você constrói modelos internos sofisticados antes de falar, e isso cria uma qualidade de pensamento que poucos alcançam. Ambientes que toleram imprecisão te incomodam visceralmente. Você prefere silêncio útil à conversa vazia — e isso pode ser tanto uma força quanto uma barreira.",
    underPressure: "Sob pressão, você pode entrar em modo de análise indefinida — buscando mais dados antes de uma decisão que já poderia ter sido tomada. Sua precisão pode se tornar paralisia quando o ambiente exige velocidade. O mapa perfeito atrasa a partida.",
    blindspot: "Você pode subestimar o impacto de como se comunica. O que parece objetividade pode soar como distância. Pessoas precisam se sentir vistas, não apenas analisadas — e essa distinção tende a escapar do seu radar.",
    publicVsPrivate: "Para o mundo, você parece seguro e racional. Internamente, existe um padrão de exigência muito mais alto do que o mundo consegue ver — e que raramente você vocaliza.",
    feedbackTip: "Seja específico, factual e objetivo. Dê exemplos concretos. Julgamentos vagos são ruído — precisão é o que permite absorver e agir. Evite generalizações como 'sempre' ou 'nunca'.",
    growth: "Sua maior alavanca é a presença humana. Não presença analítica — presença real. Permita que as pessoas te conheçam além das suas ideias. O que você pensa impressiona; o que você sente conecta.",
    questions: [
      "Tenho adiado alguma decisão esperando por dados que talvez nunca cheguem?",
      "As pessoas ao meu redor se sentem vistas ou apenas analisadas?",
    ],
    works_with: [
      { id: "D", reason: "Te empurra à ação quando você tende a analisar além do necessário." },
      { id: "S", reason: "Te dá paciência e continuidade onde você tenderia a refazer tudo do zero." },
    ],
    tension_with: [
      { id: "I", reason: "Tensão de linguagem: você fala em lógica, eles falam em relações. A complementaridade é real — mas exige esforço de tradução dos dois lados." },
    ],
  },
};
