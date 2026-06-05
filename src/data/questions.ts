export const QUESTIONS = [
  // Fase 1 — Risco
  {
    phase: "Fase 1 — Risco", cat: "Decisão sob pressão",
    text: "Uma oportunidade real aparece, mas exige que você aja nas próximas 2 horas — sem todos os dados que gostaria.",
    choices: [
      { label: "Age. Informação incompleta é a condição padrão — esperar é uma decisão também.", trait: "D", weight: 2 },
      { label: "Chama alguém de confiança para pensar junto antes de se comprometer.", trait: "I", weight: 2 },
      { label: "Espera. Oportunidade apressada tende a ser armadilha.", trait: "S", weight: 2 },
      { label: "Mapeia o que ainda dá para descobrir em tempo útil e decide com isso.", trait: "C", weight: 2 },
    ]
  },
  {
    phase: "Fase 1 — Risco", cat: "Ambiente em colapso",
    text: "O projeto está em colapso: prazos, escopo e motivação — tudo desmontando. Você não é o líder oficial, mas ninguém está agindo.",
    choices: [
      { label: "Assume. Cargo é detalhe quando algo precisa ser salvo.", trait: "D", weight: 2 },
      { label: "Começa a reengajar as pessoas — sem comprometimento humano, qualquer estrutura cai.", trait: "I", weight: 2 },
      { label: "Estabiliza o que ainda funciona e constrói a partir disso.", trait: "S", weight: 2 },
      { label: "Diagnostica o problema real antes de propor qualquer intervenção.", trait: "C", weight: 2 },
    ]
  },
  {
    phase: "Fase 1 — Risco", cat: "Falha visível",
    text: "Algo que você entregou tem um erro grave. Ainda dá para consertar, mas a janela é curta — e algumas pessoas já perceberam.",
    choices: [
      { label: "Age imediatamente para corrigir. Explicação vem depois do problema resolvido.", trait: "D", weight: 2 },
      { label: "Comunica o erro com transparência e já apresenta a solução junto.", trait: "I", weight: 2 },
      { label: "Corrige com cuidado, sem pressa excessiva — erro sobre erro é pior.", trait: "S", weight: 2 },
      { label: "Entende a origem antes de corrigir, para não repetir no próprio conserto.", trait: "C", weight: 2 },
    ]
  },
  // Fase 2 — Relações
  {
    phase: "Fase 2 — Relações", cat: "Discordância em grupo",
    text: "Num grupo, alguém defende uma ideia que você tem boas razões para questionar. A maioria parece concordar.",
    choices: [
      { label: "Apresenta a discordância diretamente — maioria não torna ideia certa.", trait: "D", weight: 2 },
      { label: "Faz perguntas que levam o grupo a reconsiderar, sem confronto aberto.", trait: "I", weight: 2 },
      { label: "Espera o momento certo — forçar a divergência agora pode travar tudo.", trait: "S", weight: 2 },
      { label: "Pede dados ou premissas que sustentem a posição antes de se posicionar.", trait: "C", weight: 2 },
    ]
  },
  {
    phase: "Fase 2 — Relações", cat: "Pedido impossível",
    text: "Alguém que você respeita pede ajuda num momento em que você já está no limite. Recusar parece ingrato.",
    choices: [
      { label: "Recusa com clareza. Prometer o que não consegue entregar seria pior.", trait: "D", weight: 2 },
      { label: "Ajuda mesmo assim — relações se constroem nos momentos difíceis.", trait: "I", weight: 2 },
      { label: "Negocia o que consegue fazer sem se comprometer além do real.", trait: "S", weight: 2 },
      { label: "Avalia o custo real de cada opção antes de responder.", trait: "C", weight: 2 },
    ]
  },
  {
    phase: "Fase 2 — Relações", cat: "Feedback difícil",
    text: "Você precisa dar um retorno duro para alguém que você valoriza. A mensagem é necessária — mas pode machucar.",
    choices: [
      { label: "Diz o que precisa ser dito, com clareza. Clareza é respeito.", trait: "D", weight: 2 },
      { label: "Cuida do tom tanto quanto do conteúdo — como se diz importa tanto quanto o quê.", trait: "I", weight: 2 },
      { label: "Espera o contexto certo e o momento adequado para falar.", trait: "S", weight: 2 },
      { label: "Prepara a conversa com fatos específicos para que seja construtiva, não emocional.", trait: "C", weight: 2 },
    ]
  },
  // Fase 3 — Mente
  {
    phase: "Fase 3 — Mente", cat: "Como você aprende",
    text: "Você precisa dominar algo complexo e novo em pouco tempo. Qual caminho você segue naturalmente?",
    choices: [
      { label: "Mergulha direto na prática. Erra rápido, corrige rápido.", trait: "D", weight: 2 },
      { label: "Aprende com quem já sabe — troca e conversa encurtam caminhos.", trait: "I", weight: 2 },
      { label: "Segue um caminho gradual: base sólida antes de avançar.", trait: "S", weight: 2 },
      { label: "Lê, pesquisa, monta um modelo mental — depois pratica.", trait: "C", weight: 2 },
    ]
  },
  {
    phase: "Fase 3 — Mente", cat: "Processamento interno",
    text: "Algo te afeta emocionalmente de forma significativa. Como você tende a lidar internamente nas primeiras horas?",
    choices: [
      { label: "Processa rápido e segue. Ficar parado no que aconteceu não resolve.", trait: "D", weight: 2 },
      { label: "Precisa falar — expressar em voz alta ajuda a organizar.", trait: "I", weight: 2 },
      { label: "Processa no próprio tempo, em silêncio, sem pressa para concluir.", trait: "S", weight: 2 },
      { label: "Analisa o que gerou a emoção para entender o padrão antes de reagir.", trait: "C", weight: 2 },
    ]
  },
  {
    phase: "Fase 3 — Mente", cat: "Dia sem obrigações",
    text: "Um dia livre, sem agenda. Como sua mente tende a se ocupar naturalmente?",
    choices: [
      { label: "Planeja, executa, realiza algo concreto. Ociosidade inquieta.", trait: "D", weight: 2 },
      { label: "Busca encontros, conversas, trocas. Silêncio prolongado pesa.", trait: "I", weight: 2 },
      { label: "Descansa de verdade — recarregar em paz é o que precisa.", trait: "S", weight: 2 },
      { label: "Lê, pesquisa, aprofunda algo que desperta curiosidade.", trait: "C", weight: 2 },
    ]
  },
  // Fase 4 — Trabalho
  {
    phase: "Fase 4 — Trabalho", cat: "O que te esgota",
    text: "Qual dessas situações drena mais a sua energia de forma consistente?",
    choices: [
      { label: "Burocracia, excesso de processo e falta de autonomia para agir.", trait: "D", weight: 2 },
      { label: "Isolamento prolongado, pouca interação, ambientes frios e formais.", trait: "I", weight: 2 },
      { label: "Mudanças constantes sem aviso, instabilidade e falta de clareza.", trait: "S", weight: 2 },
      { label: "Imprecisão, falta de critério e pressão para decidir sem dados suficientes.", trait: "C", weight: 2 },
    ]
  },
  {
    phase: "Fase 4 — Trabalho", cat: "Receber crítica",
    text: "Alguém que você respeita questiona sua abordagem de forma direta e sem rodeios.",
    choices: [
      { label: "Ouve, avalia se faz sentido e decide. Não precisa concordar para considerar.", trait: "D", weight: 2 },
      { label: "A forma importa. Crítica bem colocada é ouro; mal colocada vira ruído.", trait: "I", weight: 2 },
      { label: "Processa com calma. Não reage imediatamente — precisa digerir.", trait: "S", weight: 2 },
      { label: "Quer entender exatamente o que falhou e por quê. Especificidade é o que permite agir.", trait: "C", weight: 2 },
    ]
  },
  {
    phase: "Fase 4 — Trabalho", cat: "Motivação central",
    text: "No fundo, o que mais te move num projeto de longa duração?",
    choices: [
      { label: "Ver resultados concretos. A execução bem feita é a própria recompensa.", trait: "D", weight: 2 },
      { label: "As pessoas envolvidas crescerem junto com o projeto.", trait: "I", weight: 2 },
      { label: "Construir algo que dure — estável, consistente, confiável.", trait: "S", weight: 2 },
      { label: "Resolver o que poucos conseguem. A profundidade do problema importa.", trait: "C", weight: 2 },
    ]
  },
  // Fase 5 — Valores
  {
    phase: "Fase 5 — Valores", cat: "Integridade sob pressão",
    text: "Um atalho antiético resolveria um problema real agora, sem consequências visíveis imediatas.",
    choices: [
      { label: "Não. Reputação se constrói em anos e destrói em segundos.", trait: "D", weight: 2 },
      { label: "Não — mas reconheço o impulso. O custo relacional seria alto demais.", trait: "I", weight: 2 },
      { label: "Nunca. Integridade não tem escala — ou existe ou não.", trait: "S", weight: 2 },
      { label: "Não vale a pena. Analisaria os riscos e chegaria à mesma conclusão de qualquer forma.", trait: "C", weight: 2 },
    ]
  },
  {
    phase: "Fase 5 — Valores", cat: "Mudança não escolhida",
    text: "Uma mudança grande e inevitável chega à sua vida — sem que você tenha pedido ou planejado.",
    choices: [
      { label: "Adapta o plano rapidamente e segue. Resistir ao inevitável é desperdício.", trait: "D", weight: 2 },
      { label: "Vê o que essa mudança abre — toda transição tem uma porta.", trait: "I", weight: 2 },
      { label: "Processa o luto primeiro. Não adianta avançar fingindo que está tudo bem.", trait: "S", weight: 2 },
      { label: "Mapeia os impactos antes de qualquer reação.", trait: "C", weight: 2 },
    ]
  },
  {
    phase: "Fase 5 — Valores", cat: "Como quer ser lembrado",
    text: "Pense nas pessoas com quem você trabalhou nos últimos anos. Como quer que descrevam sua presença?",
    choices: [
      { label: "Como alguém que fazia acontecer, mesmo no caos.", trait: "D", weight: 2 },
      { label: "Como alguém que energizava o ambiente e trazia as pessoas junto.", trait: "I", weight: 2 },
      { label: "Como alguém confiável, presente e sem jogos.", trait: "S", weight: 2 },
      { label: "Como alguém que via o que os outros não conseguiam articular.", trait: "C", weight: 2 },
    ]
  },
];
