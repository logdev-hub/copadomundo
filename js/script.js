/*
  Script principal da experiencia.
  Coordena dados, modais, mapa, midias, audio, quiz e troca de ambientes.
*/

const videosExperiencia = {
  abertura: {
    src: "assets/video/abertura-copa.mp4",
    poster: "assets/posters/poster-abertura.jpg"
  },
  momentos: {
    src: "assets/video/momentos-historicos.mp4",
    poster: "assets/posters/poster-abertura.jpg"
  },
  regras: {
    src: "assets/video/regras-futebol.mp4",
    poster: "assets/posters/poster-abertura.jpg"
  },
  tunel: {
    src: "assets/video/tunel-jogadores.mp4",
    poster: "assets/posters/poster-tunel.jpg"
  },
  museu: {
    src: "assets/video/museu-futebol.mp4",
    poster: "assets/posters/poster-abertura.jpg"
  },
  linhaTempo: {
    src: "assets/video/linha-tempo.mp4",
    poster: "assets/posters/poster-abertura.jpg"
  },
  campeoes: {
    src: "assets/video/campeoes-copa.mp4",
    poster: "assets/posters/poster-abertura.jpg"
  },
  mascotes: {
    src: "assets/video/mascotes-copa.mp4",
    poster: "assets/posters/poster-abertura.jpg"
  },
  taca: {
    src: "assets/video/taca-copa.mp4",
    poster: "assets/posters/poster-taca.jpg"
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
    texto: "Bandeiras e cards de países campeões apresentam número de títulos e curiosidades editáveis."
  },
  camisas: {
    titulo: "Galeria de Camisas",
    texto: "Camisas em molduras e vitrines transparentes. Clique nas peças para ampliar e use os botões para alternar modelos."
  },
  mascotes: {
    titulo: "Sala das Mascotes",
    texto: "Sala lúdica com totens animados, cards e quiz das mascotes. As bases dos totens bloqueiam a passagem."
  },
  taca: {
    titulo: "Sala da Taça",
    texto: "A taça gira sobre pedestal iluminado. O pedestal é bloqueado, mas é possível circular ao redor."
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
    pergunta: "Qual sala contém camisas em molduras?",
    alternativas: ["Galeria de Camisas", "Sala da Taça", "Linha do Tempo", "Praça externa"],
    correta: 0,
    explicacao: "A Galeria de Camisas apresenta peças em molduras e vitrines.",
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

function abrirModalConteudo(titulo, texto, imagem, videoSrc, poster) {
  const tituloModal = document.getElementById("modalTitulo");
  const textoModal = document.getElementById("modalTexto");
  const imagemModal = document.getElementById("modalImagem");
  const videoModal = document.getElementById("modalVideo");

  tituloModal.textContent = titulo;
  textoModal.textContent = texto || "";

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

  document.querySelectorAll("video").forEach((video) => {
    if (video !== videoModal) {
      video.pause();
    }
  });
}

function tocarVideo(idVideo, titulo = "Vídeo", descricao = "") {
  pausarVideos();
  const video = videosExperiencia[idVideo] || { src: idVideo, poster: "" };
  const videoModal = abrirModalConteudo(titulo, descricao || "Clique em reproduzir para iniciar o video.", null, video.src, video.poster);

  const mensagemBloqueio = "Se o navegador bloquear a reprodução automática ou se o arquivo ainda não existir, substitua o vídeo indicado na pasta assets/video.";

  const tratarErro = () => {
    const textoModal = document.getElementById("modalTexto");
    const imagemModal = document.getElementById("modalImagem");
    if (textoModal && !textoModal.textContent.includes("assets/video")) {
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
    elemento.setAttribute("material", { shader: "flat", src: dadosVideo.poster, color: "#ffffff" });
  }
}

function trocarImagem(painel, imagem) {
  const elemento = typeof painel === "string" ? document.getElementById(painel) : painel;

  if (!elemento) {
    return;
  }

  if (elemento.tagName?.toLowerCase().startsWith("a-")) {
    elemento.setAttribute("material", { shader: "flat", src: imagem, color: "#ffffff" });
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

function tocarElementoAudio(idAudio, tipo) {
  const elemento = document.getElementById(idAudio);
  if (!elemento || !window.estadoExperiencia.audioAtivo) {
    return;
  }

  elemento.onerror = () => tocarSintese(tipo);
  elemento.currentTime = 0;
  const tentativa = elemento.play();
  if (tentativa?.catch) {
    tentativa.catch(() => tocarSintese(tipo));
  }
}

function silenciarTudo() {
  document.querySelectorAll("audio").forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
  pararAudioSintetico();
  window.estadoExperiencia.audioAtivo = false;
  const botaoSom = document.getElementById("btnSom");
  if (botaoSom) {
    botaoSom.textContent = "Som";
  }
}

function alternarAudioAmbiente(tipo = "torcida") {
  if (tipo === "clique") {
    tocarClique();
    return;
  }

  window.estadoExperiencia.audioAtivo = false;
  const mapaAudio = {
    torcida: "audioTorcida",
    museu: "audioMuseu",
    taca: "audioTaca"
  };

  document.querySelectorAll("audio").forEach((audio) => {
    if (audio.id !== mapaAudio[tipo]) {
      audio.pause();
    }
  });

  tocarElementoAudio(mapaAudio[tipo] || "audioTorcida", tipo);

  const botaoSom = document.getElementById("btnSom");
  if (botaoSom) {
    botaoSom.textContent = "Silenciar";
  }
}

function tocarClique() {
  if (!window.estadoExperiencia.audioAtivo) {
    return;
  }

  tocarElementoAudio("audioClique", "clique");
}

function obterConteudoAmbiente(ambiente) {
  return conteudos[ambiente] || conteudosPadrao[ambiente] || {
    titulo: window.nomesAmbientes?.[ambiente] || "Ambiente",
    texto: "Conteudo editavel em data/conteudos.json."
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
  btnProxima.textContent = "Proxima";

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
window.tocarVideo = tocarVideo;
window.pausarVideos = pausarVideos;
window.trocarVideo = trocarVideo;
window.trocarImagem = trocarImagem;
window.silenciarTudo = silenciarTudo;
window.alternarAudioAmbiente = alternarAudioAmbiente;
window.tocarClique = tocarClique;
window.iniciarQuiz = iniciarQuiz;
window.reiniciarQuiz = reiniciarQuiz;
window.trocarAmbiente = trocarAmbiente;
