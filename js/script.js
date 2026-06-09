/*
  Script principal da experiencia.
  Coordena dados, modais, mapa, midias, audio, quiz e troca de ambientes.
*/

const videosExperiencia = {
  abertura: {
    tipo: "youtube",
    youtubeId: "J3q73ZQC0O4",
    src: "https://www.youtube.com/watch?v=J3q73ZQC0O4",
    titulo: "Curiosidades das Copas do Mundo",
    canal: "Museu do Futebol",
    poster: "assets/posters/youtube/curiosidades-museu.jpg"
  },
  momentos: {
    tipo: "youtube",
    youtubeId: "Ktsp-7PVRqk",
    src: "https://www.youtube.com/watch?v=Ktsp-7PVRqk",
    titulo: "Histórias bizarras de Copa",
    canal: "Zizao Fut",
    poster: "assets/posters/youtube/historias-bizarras.jpg"
  },
  regras: {
    tipo: "youtube",
    youtubeId: "jtxRUOAu77A",
    src: "https://www.youtube.com/watch?v=jtxRUOAu77A",
    titulo: "80 fatos da Copa do Mundo",
    canal: "SoccerJM",
    poster: "assets/posters/youtube/80-fatos.jpg"
  },
  artilhariaCampo: {
    tipo: "youtube",
    youtubeId: "_3j86ej4_1A",
    src: "https://www.youtube.com/watch?v=_3j86ej4_1A",
    titulo: "Gols marcantes das Copas",
    canal: "Almanaque das Copas",
    poster: "assets/posters/youtube/artilharia-copa.jpg"
  },
  estadiosCampo: {
    tipo: "youtube",
    youtubeId: "BZT8joc2IE8",
    src: "https://www.youtube.com/watch?v=BZT8joc2IE8",
    titulo: "Estádios da Copa",
    canal: "YouTube",
    poster: "assets/posters/youtube/estadios-copa.jpg"
  },
  tunel: {
    tipo: "youtube",
    youtubeId: "zd3RSakBaVw",
    src: "https://www.youtube.com/watch?v=zd3RSakBaVw",
    titulo: "Curiosidades malucas das Copas",
    canal: "Mega Curioso",
    poster: "assets/posters/youtube/curiosidades-malucas.jpg"
  },
  museu: {
    tipo: "youtube",
    youtubeId: "rqwUAj8SH_o",
    src: "https://www.youtube.com/watch?v=rqwUAj8SH_o",
    titulo: "Todas as Copas do Mundo em 18 minutos",
    canal: "Victorando Fut",
    poster: "assets/posters/youtube/historia-18-min.jpg"
  },
  linhaTempo: {
    tipo: "youtube",
    youtubeId: "ma9ATBiC5oM",
    src: "https://www.youtube.com/watch?v=ma9ATBiC5oM",
    titulo: "Questionando todas as Copas",
    canal: "Jozão Futebol",
    poster: "assets/posters/youtube/questionando-copas.jpg"
  },
  bolasCopa: {
    tipo: "youtube",
    youtubeId: "TVA77sCZ1CU",
    src: "https://www.youtube.com/watch?v=TVA77sCZ1CU",
    titulo: "Bolas da Copa do Mundo",
    canal: "YouTube",
    poster: "assets/posters/youtube/bolas-copa.jpg"
  },
  campeoes: {
    tipo: "youtube",
    youtubeId: "aa4jHoN7Pss",
    src: "https://www.youtube.com/watch?v=aa4jHoN7Pss",
    titulo: "Histórias absurdas da Seleção Brasileira",
    canal: "Brasil",
    poster: "assets/posters/youtube/selecao-brasileira.jpg"
  },
  rankingCampeoes: {
    tipo: "youtube",
    youtubeId: "k2BNW8G0j-U",
    src: "https://www.youtube.com/watch?v=k2BNW8G0j-U",
    titulo: "Maiores campeões da Copa",
    canal: "Gravity",
    poster: "assets/posters/youtube/ranking-campeoes-video.jpg"
  },
  mascotes: {
    tipo: "youtube",
    youtubeId: "nx4ecM7RmWc",
    src: "https://www.youtube.com/watch?v=nx4ecM7RmWc",
    titulo: "10 curiosidades da Copa do Mundo",
    canal: "Um Clubista",
    poster: "assets/posters/youtube/10-curiosidades.jpg"
  },
  camisas2022: {
    tipo: "youtube",
    youtubeId: "DhBH8uz9X5M",
    src: "https://www.youtube.com/watch?v=DhBH8uz9X5M",
    titulo: "Todas as camisas para a Copa do Mundo 2022",
    canal: "YouTube",
    poster: "assets/posters/youtube/camisas-2022.jpg"
  },
  mascotesCopas: {
    tipo: "youtube",
    youtubeId: "r9OkZBizbIE",
    src: "https://www.youtube.com/watch?v=r9OkZBizbIE",
    titulo: "Todos os mascotes das Copas do Mundo",
    canal: "YouTube",
    poster: "assets/posters/youtube/mascotes-copas.jpg"
  },
  taca: {
    tipo: "youtube",
    youtubeId: "rqwUAj8SH_o",
    src: "https://www.youtube.com/watch?v=rqwUAj8SH_o",
    titulo: "A história de todas as Copas do Mundo em 18 minutos",
    canal: "Victorando Fut",
    poster: "assets/posters/youtube/historia-18-min.jpg"
  },
  cinema: {
    tipo: "youtube",
    youtubeId: "rqwUAj8SH_o",
    src: "https://www.youtube.com/watch?v=rqwUAj8SH_o",
    titulo: "A história de todas as Copas do Mundo em 18 minutos",
    canal: "Victorando Fut",
    poster: "assets/posters/youtube/historia-18-min.jpg"
  },
  copa1930: {
    tipo: "youtube",
    youtubeId: "Tg-rBNdXVpw",
    src: "https://www.youtube.com/watch?v=Tg-rBNdXVpw",
    titulo: "Copa do Mundo de 1930",
    canal: "Dicas Educação Física",
    poster: "assets/posters/youtube/copa-1930.jpg"
  },
  copa1950: {
    tipo: "youtube",
    youtubeId: "wdA0PwLi8sk",
    src: "https://www.youtube.com/watch?v=wdA0PwLi8sk",
    titulo: "Copa do Mundo de 1950",
    canal: "Dicas Educação Física",
    poster: "assets/posters/youtube/copa-1950.jpg"
  },
  copa2018: {
    tipo: "youtube",
    youtubeId: "Vlc1liKqQwI",
    src: "https://www.youtube.com/watch?v=Vlc1liKqQwI",
    titulo: "A história completa da Copa de 2018",
    canal: "SoccerJM",
    poster: "assets/posters/youtube/copa-2018.jpg"
  },
  origem2018: {
    tipo: "youtube",
    youtubeId: "VplArlh1Htg",
    src: "https://www.youtube.com/watch?v=VplArlh1Htg",
    titulo: "Da origem até 2018",
    canal: "Eurofut",
    poster: "assets/posters/youtube/origem-ate-2018.jpg"
  },
  historiaEducativo: {
    tipo: "youtube",
    youtubeId: "fTRB6bNd-4E",
    src: "https://www.youtube.com/watch?v=fTRB6bNd-4E",
    titulo: "A história da Copa do Mundo",
    canal: "Vídeo educativo",
    poster: "assets/posters/youtube/historia-educativo.jpg"
  },
  historiaAtualizada: {
    tipo: "youtube",
    youtubeId: "fqVFXkjzC-g",
    src: "https://www.youtube.com/watch?v=fqVFXkjzC-g",
    titulo: "A história da Copa atualizada",
    canal: "Eurofut",
    poster: "assets/posters/youtube/historia-atualizada.jpg"
  }
};

const modelosSketchfab = {
  jogadorBrasil: {
    titulo: "Jogador do Brasil",
    descricao: "Modelo interativo do Sketchfab aberto a partir do jogador posicionado no gramado, próximo à bola central.",
    embed: "https://sketchfab.com/models/9f5c53887f154af682f8bd9e33ed1be1/embed?autostart=1",
    pagina: "https://sketchfab.com/3d-models/a-p-rigged-endrick-felipe-brazil-worldcup-2026-9f5c53887f154af682f8bd9e33ed1be1",
    credito: "Modelo 3D: A-P Rigged Endrick Felipe Brazil Worldcup 2026, por 3D Footballer no Sketchfab."
  },
  tacaFifa: {
    titulo: "FIFA Trophy",
    descricao: "Modelo interativo do Sketchfab aberto a partir da taça central da sala de troféus.",
    embed: "https://sketchfab.com/models/8a7abb3c91644e5da66546e7ec552f22/embed?autostart=1",
    pagina: "https://sketchfab.com/3d-models/fifa-trophy-8a7abb3c91644e5da66546e7ec552f22",
    credito: "Modelo 3D: FIFA Trophy, por prabinpandey631 no Sketchfab."
  },
  bolaTrionda: {
    titulo: "2026 FIFA World Cup Ball Trionda",
    descricao: "Modelo interativo do Sketchfab aberto a partir da bola posicionada no circulo central do campo.",
    embed: "https://sketchfab.com/models/ecb011fedb1b4bef8247283ad57bbf3b/embed?autostart=1&preload=1&transparent=1",
    pagina: "https://sketchfab.com/3d-models/2026-fifa-world-cup-ball-trionda-ecb011fedb1b4bef8247283ad57bbf3b",
    credito: "Modelo 3D: 2026 FIFA WORLD CUP BALL TRIONDA, por gusgovea10 no Sketchfab."
  }
};

const conteudosPadrao = {
  praca: {
    titulo: "Praça externa",
    texto: "A praça apresenta fachada, bilheteria, bandeiras, telas externas e portões de acesso. Use o portão central para a arquibancada ou a porta lateral para o museu."
  },
  arquibancada: {
    titulo: "Arquibancada",
    texto: "As fileiras simulam áreas bloqueadas. Caminhe pelos corredores centrais, acione o som da torcida e siga pela escada/porta para chegar ao campo."
  },
  campo: {
    titulo: "Campo",
    texto: "O campo tem gramado, linhas, gols, bancos e placas. A saída para o túnel existe apenas pela entrada central sinalizada no fundo."
  },
  tunel: {
    titulo: "Túnel dos jogadores",
    texto: "Corredor fechado com paredes, luzes LED, fumaça e frases motivacionais. As laterais bloqueiam passagem, e as duas extremidades conectam campo e museu."
  },
  museu: {
    titulo: "Museu do Futebol",
    texto: "Ambiente interno com vitrines, painéis históricos, galeria e salas temáticas. As vitrines e paredes são sólidas; use as portas sinalizadas."
  },
  linhaTempo: {
    titulo: "Linha do Tempo",
    texto: "Corredor com painéis por período histórico. Avance até o final para chegar ao quiz ou use a porta lateral para os campeões."
  },
  campeoes: {
    titulo: "Sala dos Campeões",
    texto: "Bandeiras e cards de países campeões apresentam número de títulos, anos das conquistas e curiosidades históricas."
  },
  camisas: {
    titulo: "Galeria de Camisas",
    texto: "A galeria agora funciona como uma instalação em vídeo sobre os uniformes da Copa de 2022, com amostras de cor e uma leitura curatorial sobre identidade visual."
  },
  mascotes: {
    titulo: "Sala das Mascotes",
    texto: "Sala lúdica com vídeo em português sobre os mascotes das Copas, totens cenográficos e uma placa sobre a estreia das mascotes em 1966."
  },
  taca: {
    titulo: "Sala da Taça",
    texto: "A taça gira sobre pedestal iluminado, cercada por imagens existentes e um vídeo de apoio histórico que conecta símbolo, conquista e legado."
  },
  cinema: {
    titulo: "Sala de Cinema",
    texto: "Pequena sala imersiva com luz baixa, fileiras de assentos, tela principal grande e sessão em vídeo sobre a história das Copas do Mundo."
  },
  quizFinal: {
    titulo: "Sala de Quiz Final",
    texto: "Responda perguntas sobre regras, história, ambientes e curiosidades. A pontuação aparece no painel do quiz."
  },
  curiosidades: [
    "A primeira Copa do Mundo foi disputada em 1930.",
    "O Brasil é o maior campeão mundial no conjunto de dados desta experiência.",
    "Os estádios modernos usam rotas separadas para público, imprensa, atletas e operação."
  ]
};

const quizPadrao = [
  {
    pergunta: "Em qual ambiente fica o telão externo de abertura?",
    alternativas: ["Praça externa", "Sala da Taça", "Túnel dos jogadores", "Galeria de Camisas"],
    correta: 0,
    explicacao: "A praça externa concentra fachada, bilheteria e telão de abertura.",
    ambiente: "praca"
  },
  {
    pergunta: "Qual caminho leva da arquibancada ao campo?",
    alternativas: ["Atravessar as cadeiras", "Usar a porta/escada sinalizada", "Passar pela lateral bloqueada", "Entrar pela vitrine"],
    correta: 1,
    explicacao: "As arquibancadas são bloqueadas; a passagem ocorre apenas pela porta sinalizada.",
    ambiente: "arquibancada"
  },
  {
    pergunta: "O que acontece ao tentar atravessar uma parede?",
    alternativas: ["A câmera atravessa", "O movimento é impedido", "O quiz inicia", "O vídeo pausa"],
    correta: 1,
    explicacao: "A função podeMoverPara impede a nova posição quando há colisão.",
    ambiente: "museu"
  },
  {
    pergunta: "Onde fica a bola central?",
    alternativas: ["Museu", "Campo", "Sala dos Campeões", "Praça"],
    correta: 1,
    explicacao: "A bola está no círculo central do campo.",
    ambiente: "campo"
  },
  {
    pergunta: "Qual sala possui uma taça dourada girando?",
    alternativas: ["Sala da Taça", "Linha do Tempo", "Arquibancada", "Sala das Mascotes"],
    correta: 0,
    explicacao: "A Sala da Taça tem pedestal, partículas douradas e rotação lenta.",
    ambiente: "taca"
  },
  {
    pergunta: "Qual arquivo controla as perguntas do quiz?",
    alternativas: ["data/quiz.json", "css/style.css", "js/movimento.js", "assets/audio/clique.wav"],
    correta: 0,
    explicacao: "As perguntas são carregadas de data/quiz.json.",
    ambiente: "quizFinal"
  },
  {
    pergunta: "Qual ambiente tem vitrines históricas?",
    alternativas: ["Museu do Futebol", "Campo", "Praça externa", "Túnel"],
    correta: 0,
    explicacao: "O museu tem vitrines e painéis históricos.",
    ambiente: "museu"
  },
  {
    pergunta: "O que os botões Q e E fazem no desktop?",
    alternativas: ["Alternam quiz", "Giram a câmera", "Trocam vídeo", "Fecham a página"],
    correta: 1,
    explicacao: "Q gira para a esquerda e E gira para a direita.",
    ambiente: "praca"
  },
  {
    pergunta: "Qual sala apresenta um vídeo sobre os uniformes da Copa de 2022?",
    alternativas: ["Galeria de Camisas", "Sala da Taça", "Linha do Tempo", "Praça externa"],
    correta: 0,
    explicacao: "A Galeria de Camisas foi atualizada como uma instalação em vídeo sobre os mantos da Copa de 2022.",
    ambiente: "camisas"
  },
  {
    pergunta: "Qual ambiente tem totens animados?",
    alternativas: ["Sala das Mascotes", "Arquibancada", "Campo", "Sala dos Campeões"],
    correta: 0,
    explicacao: "A Sala das Mascotes usa totens com animação leve.",
    ambiente: "mascotes"
  },
  {
    pergunta: "Qual ambiente funciona como uma pequena sala de exibição dentro do museu?",
    alternativas: ["Sala de Cinema", "Campo", "Praça externa", "Arquibancada"],
    correta: 0,
    explicacao: "A Sala de Cinema tem tela grande, luz baixa e assentos voltados para o documentário.",
    ambiente: "cinema"
  },
  {
    pergunta: "Como editar textos da experiência?",
    alternativas: ["Alterando data/conteudos.json", "Apagando index.html", "Renomeando css", "Bloqueando o JavaScript"],
    correta: 0,
    explicacao: "Os textos editáveis ficam em data/conteudos.json.",
    ambiente: "museu"
  },
  {
    pergunta: "Por onde o usuário deve passar entre salas?",
    alternativas: ["Por portas e áreas de transição", "Por qualquer parede", "Pelas vitrines", "Pelos telões"],
    correta: 0,
    explicacao: "As transições usam áreas de porta definidas em js/colisoes.js.",
    ambiente: "quizFinal"
  }
];

const estadoQuiz = {
  perguntas: [],
  indice: 0,
  pontuacao: 0,
  respondida: false,
  filtro: "todos"
};

let conteudos = conteudosPadrao;
let perguntasQuiz = quizPadrao;
let modalGenerico;
let modalMapa;
let contextoAudio;
let osciladoresAtivos = [];
let youtubeApiPromise;
let youtubePlayer;
let audioAtenuadoPorModal = false;
let quadroAudioAmbiente = null;

const audioAmbienteConfig = {
  arquibancada: { audio: "audioTorcida", tipo: "torcida", volume: "arquibancada" },
  campo: { audio: "audioTorcida", tipo: "torcida", volume: 0.96 },
  tunel: { audio: "audioTorcida", tipo: "torcida", volume: "tunel" },
  museu: { audio: "audioMuseu", tipo: "museu", volume: 0.22 },
  linhaTempo: { audio: "audioMuseu", tipo: "museu", volume: 0.2 },
  campeoes: { audio: "audioMuseu", tipo: "museu", volume: 0.18 },
  camisas: { audio: "audioMuseu", tipo: "museu", volume: 0.16 },
  mascotes: { audio: "audioMuseu", tipo: "museu", volume: 0.16 },
  taca: { audio: "audioTaca", tipo: "taca", volume: 0.36 },
  cinema: { audio: "audioMuseu", tipo: "museu", volume: 0.12 },
  quizFinal: { audio: "audioMuseu", tipo: "museu", volume: 0.12 }
};

const idsAudioAmbiente = ["audioTorcida", "audioMuseu", "audioTaca"];

function limitarVolume(valor) {
  return Math.max(0, Math.min(1, valor));
}

function interpolarVolume(inicio, fim, progresso) {
  return inicio + (fim - inicio) * limitarVolume(progresso);
}

async function carregarJSON(caminho, fallback) {
  try {
    const resposta = await fetch(caminho, { cache: "no-store" });
    if (!resposta.ok) {
      throw new Error(`Falha ao carregar ${caminho}`);
    }
    return await resposta.json();
  } catch (erro) {
    console.warn(`Usando fallback local para ${caminho}.`, erro);
    return fallback;
  }
}

function obterModal(id) {
  const elemento = document.getElementById(id);
  if (!elemento) {
    return null;
  }

  if (window.bootstrap?.Modal) {
    return bootstrap.Modal.getOrCreateInstance(elemento);
  }

  return {
    show: () => elemento.classList.add("show"),
    hide: () => elemento.classList.remove("show")
  };
}

function textoNaturalMidia(tipo, titulo, complemento = "") {
  const mensagens = {
    video: "Vale a pena assistir com calma: tem muita história nesse quadro.",
    imagem: "Chegue mais perto e explore este momento da história da Copa.",
    modelo: "Este conteúdo ajuda a enxergar o futebol para além do placar.",
    texto: "Aqui, a memória do jogo ganha imagem, voz e emoção."
  };
  const base = mensagens[tipo] || mensagens.texto;
  return complemento ? `${base}\n\n${complemento}` : `${base}${titulo ? `\n\n${titulo}` : ""}`;
}

function abrirModalConteudo(titulo, texto, imagem, videoSrc, poster) {
  const tituloModal = document.getElementById("modalTitulo");
  const textoModal = document.getElementById("modalTexto");
  const imagemModal = document.getElementById("modalImagem");
  const videoModal = document.getElementById("modalVideo");
  const youtubeModal = document.getElementById("modalYoutube");
  const controlesYoutube = document.getElementById("controlesYoutube");
  const sketchfabModal = document.getElementById("modalSketchfab");
  const creditosSketchfab = document.getElementById("creditosSketchfab");

  tituloModal.textContent = titulo;
  textoModal.textContent = texto || textoNaturalMidia(videoSrc ? "video" : imagem ? "imagem" : "texto", titulo);
  audioAtenuadoPorModal = Boolean(videoSrc);
  atualizarAudioAmbiente?.(true);
  youtubeModal.hidden = true;
  controlesYoutube.hidden = true;
  sketchfabModal.hidden = true;
  creditosSketchfab.hidden = true;

  imagemModal.hidden = !imagem;
  if (imagem) {
    imagemModal.src = imagem;
    imagemModal.alt = titulo;
  } else {
    imagemModal.removeAttribute("src");
    imagemModal.alt = "";
  }

  videoModal.hidden = !videoSrc;
  if (videoSrc) {
    videoModal.src = videoSrc;
    videoModal.poster = poster || "";
    videoModal.load();
  } else {
    videoModal.pause();
    videoModal.removeAttribute("src");
    videoModal.removeAttribute("poster");
  }

  modalGenerico?.show();
  return videoModal;
}

function carregarYoutubeApi() {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise((resolve) => {
      const callbackAnterior = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        callbackAnterior?.();
        resolve(window.YT);
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(script);
      }
    });
  }

  return youtubeApiPromise;
}

function destruirYoutubePlayer() {
  if (youtubePlayer?.destroy) {
    youtubePlayer.destroy();
  }
  youtubePlayer = null;

  const youtubeModal = document.getElementById("modalYoutube");
  let playerEl = document.getElementById("modalYoutubePlayer");
  if (!playerEl && youtubeModal) {
    playerEl = document.createElement("div");
    playerEl.id = "modalYoutubePlayer";
    playerEl.className = "modal-youtube-player";
    youtubeModal.replaceChildren(playerEl);
  } else if (playerEl) {
    playerEl.innerHTML = "";
  }
}

function abrirModalYoutube(video, titulo, descricao) {
  const tituloModal = document.getElementById("modalTitulo");
  const textoModal = document.getElementById("modalTexto");
  const imagemModal = document.getElementById("modalImagem");
  const videoModal = document.getElementById("modalVideo");
  const youtubeModal = document.getElementById("modalYoutube");
  const controlesYoutube = document.getElementById("controlesYoutube");

  destruirYoutubePlayer();
  const playerEl = document.getElementById("modalYoutubePlayer");
  tituloModal.textContent = titulo || video.titulo || "Vídeo";
  textoModal.textContent = descricao || textoNaturalMidia("video", video.titulo, `${video.titulo || "Vídeo"} — ${video.canal || "YouTube"}`);
  audioAtenuadoPorModal = true;
  atualizarAudioAmbiente?.(true);

  imagemModal.hidden = true;
  imagemModal.removeAttribute("src");
  videoModal.pause();
  videoModal.hidden = true;
  videoModal.removeAttribute("src");
  videoModal.removeAttribute("poster");
  youtubeModal.hidden = false;
  controlesYoutube.hidden = false;
  playerEl.innerHTML = "";

  modalGenerico?.show();

  carregarYoutubeApi().then((YT) => {
    if (youtubeModal.hidden) {
      return;
    }

    youtubePlayer = new YT.Player("modalYoutubePlayer", {
      videoId: video.youtubeId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 0,
        enablejsapi: 1,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        origin: window.location.origin
      },
      events: {
        onReady: (evento) => evento.target.playVideo(),
        onError: () => {
          textoModal.textContent = `${textoModal.textContent}\n\nNão foi possível reproduzir o embed neste navegador. Link original: ${video.src}`;
        }
      }
    });
  });
}

function controlarYoutube(acao) {
  if (!youtubePlayer) {
    return;
  }

  if (acao === "play") {
    youtubePlayer.playVideo?.();
  } else if (acao === "pause") {
    youtubePlayer.pauseVideo?.();
  } else if (acao === "stop") {
    youtubePlayer.stopVideo?.();
  } else if (acao === "voltar") {
    const atual = youtubePlayer.getCurrentTime?.() || 0;
    youtubePlayer.seekTo?.(Math.max(0, atual - 10), true);
  } else if (acao === "avancar") {
    const atual = youtubePlayer.getCurrentTime?.() || 0;
    youtubePlayer.seekTo?.(atual + 10, true);
  }
}

function limparSketchfab() {
  const sketchfabModal = document.getElementById("modalSketchfab");
  const sketchfabFrame = document.getElementById("modalSketchfabFrame");
  const creditosSketchfab = document.getElementById("creditosSketchfab");

  if (sketchfabFrame) {
    sketchfabFrame.removeAttribute("src");
  }
  if (sketchfabModal) {
    sketchfabModal.hidden = true;
  }
  if (creditosSketchfab) {
    creditosSketchfab.hidden = true;
  }
}

function abrirSketchfabModelo(chaveModelo) {
  pausarVideos();
  const modelo = modelosSketchfab[chaveModelo] || modelosSketchfab.jogadorBrasil;

  const tituloModal = document.getElementById("modalTitulo");
  const textoModal = document.getElementById("modalTexto");
  const imagemModal = document.getElementById("modalImagem");
  const videoModal = document.getElementById("modalVideo");
  const youtubeModal = document.getElementById("modalYoutube");
  const controlesYoutube = document.getElementById("controlesYoutube");
  const sketchfabModal = document.getElementById("modalSketchfab");
  const sketchfabFrame = document.getElementById("modalSketchfabFrame");
  const creditosSketchfab = document.getElementById("creditosSketchfab");

  tituloModal.textContent = modelo.titulo;
  textoModal.textContent = `${modelo.descricao}\n\nOrigem: ${modelo.pagina}`;

  imagemModal.hidden = true;
  imagemModal.removeAttribute("src");
  videoModal.pause();
  videoModal.hidden = true;
  videoModal.removeAttribute("src");
  videoModal.removeAttribute("poster");
  youtubeModal.hidden = true;
  controlesYoutube.hidden = true;
  sketchfabFrame.title = modelo.titulo;
  sketchfabFrame.src = modelo.embed;
  creditosSketchfab.textContent = modelo.credito;
  sketchfabModal.hidden = false;
  creditosSketchfab.hidden = false;

  modalGenerico?.show();
}

function abrirSketchfabJogador() {
  abrirSketchfabModelo("jogadorBrasil");
}

function abrirSketchfabTaca() {
  abrirSketchfabModelo("tacaFifa");
}

function abrirSketchfabBola() {
  abrirSketchfabModelo("bolaTrionda");
}

function abrirModalTexto(titulo, texto) {
  pausarVideos();
  abrirModalConteudo(titulo, texto);
}

function ampliarImagem(imagem, titulo, descricao) {
  pausarVideos();
  abrirModalConteudo(titulo || "Imagem", descricao || "Imagem ampliada.", imagem);
}

function pausarVideos() {
  const videoModal = document.getElementById("modalVideo");
  if (videoModal) {
    videoModal.pause();
  }
  audioAtenuadoPorModal = false;
  atualizarAudioAmbiente?.(true);
  destruirYoutubePlayer();
  limparSketchfab();

  const youtubeModal = document.getElementById("modalYoutube");
  const controlesYoutube = document.getElementById("controlesYoutube");
  if (youtubeModal) {
    youtubeModal.hidden = true;
  }
  if (controlesYoutube) {
    controlesYoutube.hidden = true;
  }

  document.querySelectorAll("video").forEach((video) => {
    if (video !== videoModal) {
      video.pause();
    }
  });
}

function tocarVideo(idVideo, titulo = "Vídeo", descricao = "") {
  pausarVideos();
  const video = videosExperiencia[idVideo] || { src: idVideo, poster: "" };

  if (video.tipo === "youtube" || video.youtubeId) {
    abrirModalYoutube(video, titulo || video.titulo, descricao || `${video.titulo} — ${video.canal}`);
    return;
  }

  const videoModal = abrirModalConteudo(titulo, descricao || "Clique em reproduzir para iniciar o video.", null, video.src, video.poster);

  const mensagemBloqueio = "Se o navegador bloquear a reprodução automática ou se o arquivo de vídeo ainda não existir, o pôster temático permanece em exibição.";

  const tratarErro = () => {
    const textoModal = document.getElementById("modalTexto");
    const imagemModal = document.getElementById("modalImagem");
    if (textoModal && !textoModal.textContent.includes("pôster temático")) {
      textoModal.textContent = `${textoModal.textContent}\n\n${mensagemBloqueio}`;
    }
    if (imagemModal && video.poster) {
      videoModal.pause();
      videoModal.hidden = true;
      imagemModal.src = video.poster;
      imagemModal.alt = titulo;
      imagemModal.hidden = false;
    }
  };

  videoModal.onerror = tratarErro;
  const tentativa = videoModal.play();

  if (tentativa?.catch) {
    tentativa.catch(tratarErro);
  }
}

function trocarVideo(tela, video) {
  const elemento = typeof tela === "string" ? document.getElementById(tela) : tela;
  const dadosVideo = typeof video === "string" ? videosExperiencia[video] || { src: video } : video;

  if (!elemento || !dadosVideo) {
    abrirModalTexto("Trocar vídeo", "Tela ou vídeo não encontrado. Confira o id informado.");
    return;
  }

  elemento.dataset.videoAtual = dadosVideo.src;
  if (dadosVideo.poster) {
    elemento.setAttribute("material", window.materialTextura?.(dadosVideo.poster) || `shader: flat; src: url(${dadosVideo.poster}); color: #ffffff; side: double`);
  }
}

function trocarImagem(painel, imagem) {
  const elemento = typeof painel === "string" ? document.getElementById(painel) : painel;

  if (!elemento) {
    return;
  }

  if (elemento.tagName?.toLowerCase().startsWith("a-")) {
    elemento.setAttribute("material", window.materialTextura?.(imagem) || `shader: flat; src: url(${imagem}); color: #ffffff; side: double`);
  } else {
    elemento.src = imagem;
  }
}

function criarContextoAudio() {
  if (!contextoAudio) {
    const AudioContexto = window.AudioContext || window.webkitAudioContext;
    if (AudioContexto) {
      contextoAudio = new AudioContexto();
    }
  }

  return contextoAudio;
}

function pararAudioSintetico() {
  osciladoresAtivos.forEach(({ oscilador, ganho }) => {
    try {
      ganho.gain.linearRampToValueAtTime(0.0001, contextoAudio.currentTime + 0.08);
      oscilador.stop(contextoAudio.currentTime + 0.1);
    } catch (erro) {
      console.warn("Falha ao parar audio sintetico.", erro);
    }
  });
  osciladoresAtivos = [];
}

function tocarSintese(tipo) {
  const audio = criarContextoAudio();
  if (!audio || !window.estadoExperiencia.audioAtivo) {
    return;
  }

  pararAudioSintetico();

  const frequencias = {
    torcida: [170, 220, 310],
    museu: [110, 165],
    taca: [260, 392, 523],
    clique: [620]
  };

  (frequencias[tipo] || frequencias.clique).forEach((frequencia, indice) => {
    const oscilador = audio.createOscillator();
    const ganho = audio.createGain();
    oscilador.frequency.value = frequencia;
    oscilador.type = tipo === "clique" ? "square" : "sine";
    ganho.gain.value = tipo === "clique" ? 0.035 : 0.018 / (indice + 1);
    oscilador.connect(ganho).connect(audio.destination);
    oscilador.start();

    if (tipo === "clique") {
      ganho.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.08);
      oscilador.stop(audio.currentTime + 0.09);
    } else {
      osciladoresAtivos.push({ oscilador, ganho });
    }
  });
}

function tocarElementoAudio(idAudio, tipo, opcoes = {}) {
  const elemento = document.getElementById(idAudio);
  if (!elemento || !window.estadoExperiencia.audioAtivo) {
    return;
  }

  elemento.onerror = () => tocarSintese(tipo);
  elemento.loop = Boolean(opcoes.loop);
  elemento.volume = opcoes.volume ?? elemento.volume ?? 1;
  if (opcoes.reiniciar) {
    elemento.currentTime = 0;
  }
  const tentativa = elemento.play();
  if (tentativa?.catch) {
    tentativa.catch(() => tocarSintese(tipo));
  }
}

function volumeTunelPorProximidade() {
  const posicao = window.obterPosicaoCamera?.() || { z: -10 };
  const progresso = (posicao.z + 10.5) / 20.5;
  return interpolarVolume(0.18, 0.74, progresso);
}

function volumeArquibancadaPorProximidade() {
  const posicao = window.obterPosicaoCamera?.() || { z: 11 };
  const progresso = (11 - posicao.z) / 23;
  return interpolarVolume(0.26, 0.74, progresso);
}

function obterVolumeBaseAudio(config) {
  if (config.volume === "tunel") {
    return volumeTunelPorProximidade();
  }

  if (config.volume === "arquibancada") {
    return volumeArquibancadaPorProximidade();
  }

  return config.volume;
}

function obterAlvosAudioAmbiente() {
  const alvos = Object.fromEntries(idsAudioAmbiente.map((id) => [id, 0]));

  if (!window.estadoExperiencia.audioAtivo) {
    return alvos;
  }

  const ambiente = window.estadoExperiencia.ambienteAtual || "praca";
  const config = audioAmbienteConfig[ambiente];
  if (!config) {
    return alvos;
  }

  const volumeBase = obterVolumeBaseAudio(config);
  alvos[config.audio] = audioAtenuadoPorModal ? volumeBase * 0.22 : volumeBase;
  return alvos;
}

function garantirLoopAudio(elemento, tipo) {
  if (!elemento || elemento._tentandoPlay) {
    return;
  }

  elemento.loop = true;
  elemento._tentandoPlay = true;
  const tentativa = elemento.play();
  if (tentativa?.catch) {
    tentativa.catch(() => {
      if (!elemento._fallbackSintetico) {
        tocarSintese(tipo);
        elemento._fallbackSintetico = true;
      }
    }).finally(() => {
      elemento._tentandoPlay = false;
    });
  } else {
    elemento._tentandoPlay = false;
  }
}

function atualizarAudioAmbiente(imediato = false) {
  const alvos = obterAlvosAudioAmbiente();

  idsAudioAmbiente.forEach((idAudio) => {
    const elemento = document.getElementById(idAudio);
    if (!elemento) {
      return;
    }

    const ambiente = Object.values(audioAmbienteConfig).find((config) => config.audio === idAudio);
    const alvo = alvos[idAudio] || 0;
    const atual = Number.isFinite(elemento.volume) ? elemento.volume : 0;
    const proximo = imediato ? alvo : atual + (alvo - atual) * 0.08;
    elemento.volume = Math.max(0, Math.min(1, proximo));

    if (alvo > 0.01 && window.estadoExperiencia.audioAtivo) {
      garantirLoopAudio(elemento, ambiente?.tipo || "torcida");
    } else if (elemento.volume < 0.01) {
      elemento.pause();
    }
  });

  const botaoSom = document.getElementById("btnSom");
  if (botaoSom) {
    botaoSom.textContent = window.estadoExperiencia.audioAtivo ? "Silenciar" : "Som";
  }
}

function loopAudioAmbiente() {
  atualizarAudioAmbiente(false);
  quadroAudioAmbiente = window.requestAnimationFrame(loopAudioAmbiente);
}

function iniciarLoopAudioAmbiente() {
  if (!quadroAudioAmbiente) {
    quadroAudioAmbiente = window.requestAnimationFrame(loopAudioAmbiente);
  }
}

function pararLoopAudioAmbiente() {
  if (quadroAudioAmbiente) {
    window.cancelAnimationFrame(quadroAudioAmbiente);
    quadroAudioAmbiente = null;
  }
}

function silenciarTudo() {
  pararLoopAudioAmbiente();
  document.querySelectorAll("audio").forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 0;
  });
  pararAudioSintetico();
  window.estadoExperiencia.audioAtivo = false;
  atualizarAudioAmbiente(true);
}

function alternarAudioAmbiente(tipo = "torcida") {
  if (tipo === "clique") {
    tocarClique();
    return;
  }

  window.estadoExperiencia.audioAtivo = true;
  iniciarLoopAudioAmbiente();
  atualizarAudioAmbiente(true);
}

function tocarClique() {
  if (!window.estadoExperiencia.audioAtivo) {
    return;
  }

  tocarElementoAudio("audioClique", "clique", { reiniciar: true, volume: 0.45 });
}

function obterConteudoAmbiente(ambiente) {
  return conteudos[ambiente] || conteudosPadrao[ambiente] || {
    titulo: window.nomesAmbientes?.[ambiente] || "Ambiente",
    texto: "Conteúdo disponível em data/conteudos.json."
  };
}

function atualizarPainelLateral() {
  const ambiente = window.estadoExperiencia.ambienteAtual;
  const nome = document.getElementById("nomeAmbiente");
  if (nome) {
    nome.textContent = window.nomesAmbientes?.[ambiente] || ambiente;
  }
}

function atualizarPainelQuizPorAmbiente() {
  const painel = document.getElementById("painelQuizCena");
  if (!painel) {
    return;
  }

  if (window.estadoExperiencia.ambienteAtual === "quizFinal") {
    painel.hidden = false;
    if (!estadoQuiz.perguntas.length) {
      iniciarQuiz("todos");
    }
  } else if (!estadoQuiz.perguntas.length || estadoQuiz.filtro === "todos") {
    painel.hidden = true;
  }
}

function trocarAmbiente(ambiente, posicaoEntrada) {
  const destino = window.posicoesSeguras?.[ambiente] || window.posicoesSeguras?.praca;
  const posicao = posicaoEntrada || destino;

  window.estadoExperiencia.ambienteAtual = ambiente;
  window.limparMovimentos?.();
  pausarVideos();
  criarAmbiente(ambiente);
  window.aplicarPosicaoCamera?.(posicao, posicao.rotY ?? destino.rotY ?? 0);
  atualizarPainelLateral();
  atualizarPainelQuizPorAmbiente();
  atualizarAudioAmbiente(true);
}

function montarMapa() {
  const grade = document.getElementById("botoesMapa");
  if (!grade) {
    return;
  }

  grade.innerHTML = "";
  Object.entries(window.nomesAmbientes || {}).forEach(([chave, nome]) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = nome;
    botao.addEventListener("click", () => {
      tocarClique();
      modalMapa?.hide();
      trocarAmbiente(chave);
    });
    grade.appendChild(botao);
  });
}

function mostrarDicas() {
  const ambiente = window.estadoExperiencia.ambienteAtual;
  const conteudo = obterConteudoAmbiente(ambiente);
  const curiosidades = Array.isArray(conteudos.curiosidades) ? conteudos.curiosidades : conteudosPadrao.curiosidades;
  const dicaExtra = curiosidades[Math.floor(Math.random() * curiosidades.length)];
  abrirModalTexto(conteudo.titulo, `${conteudo.texto}\n\nDica: ${dicaExtra}`);
}

function renderizarQuiz() {
  const perguntaEl = document.getElementById("quizPergunta");
  const alternativasEl = document.getElementById("quizAlternativas");
  const feedbackEl = document.getElementById("quizFeedback");
  const pontuacaoEl = document.getElementById("quizPontuacao");
  const ambienteEl = document.getElementById("quizAmbiente");
  const btnProxima = document.getElementById("btnProximaPergunta");

  if (!perguntaEl || !alternativasEl || !feedbackEl || !pontuacaoEl || !btnProxima) {
    return;
  }

  pontuacaoEl.textContent = `${estadoQuiz.pontuacao} pontos`;
  ambienteEl.textContent = estadoQuiz.filtro === "todos" ? "Quiz Final" : `Quiz: ${window.nomesAmbientes?.[estadoQuiz.filtro] || estadoQuiz.filtro}`;
  alternativasEl.innerHTML = "";
  feedbackEl.textContent = "";
  estadoQuiz.respondida = false;
  btnProxima.disabled = true;
  btnProxima.textContent = "Próxima";

  if (estadoQuiz.indice >= estadoQuiz.perguntas.length) {
    perguntaEl.textContent = `Resultado: ${estadoQuiz.pontuacao} de ${estadoQuiz.perguntas.length}`;
    feedbackEl.textContent = "Quiz finalizado. Use Reiniciar para jogar novamente ou explore outro ambiente pelo mapa.";
    btnProxima.disabled = true;
    return;
  }

  const perguntaAtual = estadoQuiz.perguntas[estadoQuiz.indice];
  perguntaEl.textContent = `${estadoQuiz.indice + 1}. ${perguntaAtual.pergunta}`;

  perguntaAtual.alternativas.forEach((alternativa, indice) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = alternativa;
    botao.addEventListener("click", () => responderQuiz(indice));
    alternativasEl.appendChild(botao);
  });
}

function responderQuiz(indiceEscolhido) {
  if (estadoQuiz.respondida) {
    return;
  }

  const perguntaAtual = estadoQuiz.perguntas[estadoQuiz.indice];
  const botoes = document.querySelectorAll("#quizAlternativas button");
  const feedbackEl = document.getElementById("quizFeedback");
  const pontuacaoEl = document.getElementById("quizPontuacao");
  const btnProxima = document.getElementById("btnProximaPergunta");

  estadoQuiz.respondida = true;

  botoes.forEach((botao, indice) => {
    botao.disabled = true;
    if (indice === perguntaAtual.correta) {
      botao.classList.add("correta");
    } else if (indice === indiceEscolhido) {
      botao.classList.add("errada");
    }
  });

  if (indiceEscolhido === perguntaAtual.correta) {
    estadoQuiz.pontuacao += 1;
    feedbackEl.textContent = `Correto. ${perguntaAtual.explicacao}`;
  } else {
    feedbackEl.textContent = `Resposta incorreta. ${perguntaAtual.explicacao}`;
  }

  pontuacaoEl.textContent = `${estadoQuiz.pontuacao} pontos`;
  btnProxima.disabled = false;
  tocarClique();
}

function avancarQuiz() {
  if (!estadoQuiz.respondida) {
    return;
  }

  estadoQuiz.indice += 1;
  renderizarQuiz();
}

function iniciarQuiz(filtro = "todos") {
  const painel = document.getElementById("painelQuizCena");
  const perguntasFiltradas = filtro === "todos"
    ? perguntasQuiz
    : perguntasQuiz.filter((pergunta) => pergunta.ambiente === filtro);

  estadoQuiz.perguntas = perguntasFiltradas.length ? perguntasFiltradas : perguntasQuiz;
  estadoQuiz.indice = 0;
  estadoQuiz.pontuacao = 0;
  estadoQuiz.respondida = false;
  estadoQuiz.filtro = filtro;

  if (painel) {
    painel.hidden = false;
  }

  renderizarQuiz();
}

function reiniciarQuiz() {
  iniciarQuiz(estadoQuiz.filtro || "todos");
}

function voltarTelaInicial() {
  const telaInicial = document.getElementById("telaInicial");
  const app = document.getElementById("appExperiencia");
  window.estadoExperiencia.experienciaIniciada = false;
  window.limparMovimentos?.();
  pausarVideos();
  silenciarTudo();
  app.setAttribute("aria-hidden", "true");
  telaInicial.hidden = false;
  telaInicial.style.display = "grid";
}

function iniciarExperiencia() {
  const telaInicial = document.getElementById("telaInicial");
  const app = document.getElementById("appExperiencia");
  telaInicial.style.display = "none";
  telaInicial.hidden = true;
  app.setAttribute("aria-hidden", "false");

  window.estadoExperiencia.experienciaIniciada = true;
  window.estadoExperiencia.audioAtivo = true;
  iniciarLoopAudioAmbiente();
  trocarAmbiente("praca");
}

function verificarWebXR() {
  const status = document.getElementById("statusWebXR");
  if (!status) {
    return;
  }

  if (!navigator.xr?.isSessionSupported) {
    status.textContent = "Sem WebXR";
    return;
  }

  navigator.xr.isSessionSupported("immersive-vr")
    .then((suportado) => {
      status.textContent = suportado ? "WebXR OK" : "WebXR parcial";
      status.classList.toggle("disponivel", suportado);
    })
    .catch(() => {
      status.textContent = "WebXR parcial";
    });
}

function inicializarEventos() {
  modalGenerico = obterModal("modalGenerico");
  modalMapa = obterModal("modalMapa");

  document.getElementById("btnEntrar")?.addEventListener("click", iniciarExperiencia);
  document.getElementById("btnMapa")?.addEventListener("click", () => {
    tocarClique();
    modalMapa?.show();
  });
  document.getElementById("btnSom")?.addEventListener("click", () => {
    if (window.estadoExperiencia.audioAtivo) {
      silenciarTudo();
    } else {
      alternarAudioAmbiente(window.estadoExperiencia.ambienteAtual === "taca" ? "taca" : window.estadoExperiencia.ambienteAtual === "museu" ? "museu" : "torcida");
    }
  });
  document.getElementById("btnDicas")?.addEventListener("click", mostrarDicas);
  document.getElementById("btnQuiz")?.addEventListener("click", () => iniciarQuiz(window.estadoExperiencia.ambienteAtual === "quizFinal" ? "todos" : window.estadoExperiencia.ambienteAtual));
  document.getElementById("btnResetar")?.addEventListener("click", resetarCamera);
  document.getElementById("btnAlternarControles")?.addEventListener("click", alternarControlesVisuais);
  document.getElementById("btnVoltarInicio")?.addEventListener("click", voltarTelaInicial);
  document.getElementById("btnProximaPergunta")?.addEventListener("click", avancarQuiz);
  document.getElementById("btnReiniciarQuiz")?.addEventListener("click", reiniciarQuiz);
  document.getElementById("btnYoutubePlay")?.addEventListener("click", () => controlarYoutube("play"));
  document.getElementById("btnYoutubePause")?.addEventListener("click", () => controlarYoutube("pause"));
  document.getElementById("btnYoutubeStop")?.addEventListener("click", () => controlarYoutube("stop"));
  document.getElementById("btnYoutubeVoltar")?.addEventListener("click", () => controlarYoutube("voltar"));
  document.getElementById("btnYoutubeAvancar")?.addEventListener("click", () => controlarYoutube("avancar"));

  document.getElementById("modalGenerico")?.addEventListener("hidden.bs.modal", pausarVideos);
}

async function inicializarAplicacao() {
  [conteudos, perguntasQuiz] = await Promise.all([
    carregarJSON("data/conteudos.json", conteudosPadrao),
    carregarJSON("data/quiz.json", quizPadrao)
  ]);

  montarMapa();
  verificarWebXR();
  inicializarEventos();
  criarAmbiente("praca");
  window.aplicarPosicaoCamera?.(window.posicoesSeguras.praca, window.posicoesSeguras.praca.rotY);
  atualizarPainelLateral();
}

document.addEventListener("DOMContentLoaded", inicializarAplicacao);

window.videosExperiencia = videosExperiencia;
window.abrirModalTexto = abrirModalTexto;
window.ampliarImagem = ampliarImagem;
window.abrirSketchfabJogador = abrirSketchfabJogador;
window.abrirSketchfabTaca = abrirSketchfabTaca;
window.abrirSketchfabBola = abrirSketchfabBola;
window.tocarVideo = tocarVideo;
window.pausarVideos = pausarVideos;
window.trocarVideo = trocarVideo;
window.trocarImagem = trocarImagem;
window.silenciarTudo = silenciarTudo;
window.alternarAudioAmbiente = alternarAudioAmbiente;
window.atualizarAudioAmbiente = atualizarAudioAmbiente;
window.iniciarLoopAudioAmbiente = iniciarLoopAudioAmbiente;
window.tocarClique = tocarClique;
window.iniciarQuiz = iniciarQuiz;
window.reiniciarQuiz = reiniciarQuiz;
window.trocarAmbiente = trocarAmbiente;
