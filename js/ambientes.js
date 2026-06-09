/*
  Gerador dos ambientes 3D.
  Cada ambiente e montado sob demanda dentro de #mundo para reduzir peso na cena.
  Os paineis e objetos clicaveis usam a classe "clicavel", capturada pelo raycaster da camera.
*/

const configuracaoVisual = {
  praca: { ceu: "#101b2e", piso: "#5e6671", parede: "#253447" },
  arquibancada: { ceu: "#0c1726", piso: "#48515d", parede: "#263a4d" },
  campo: { ceu: "#111927", piso: "#226b3a", parede: "#1d2936" },
  tunel: { ceu: "#07090f", piso: "#1a1d24", parede: "#111722" },
  museu: { ceu: "#101218", piso: "#3b3e44", parede: "#d8d2c8" },
  linhaTempo: { ceu: "#11131a", piso: "#2d3138", parede: "#c8ccd2" },
  campeoes: { ceu: "#10151d", piso: "#303744", parede: "#e1dfd6" },
  camisas: { ceu: "#12151d", piso: "#2f333a", parede: "#e5e7eb" },
  mascotes: { ceu: "#101625", piso: "#273b57", parede: "#f0f6ff" },
  taca: { ceu: "#080a10", piso: "#171a22", parede: "#26212d" },
  cinema: { ceu: "#030712", piso: "#111827", parede: "#171923" },
  quizFinal: { ceu: "#090f19", piso: "#182231", parede: "#d9e2ee" }
};

const fontes3D = {
  titulo: "exo2bold",
  apoio: "exo2semibold",
  corpo: "https://cdn.aframe.io/fonts/Roboto-msdf.json"
};

const microcopyMidia = {
  video: "Vale a pena assistir com calma: tem muita história nesse quadro.",
  imagem: "Chegue mais perto e explore este momento da história da Copa.",
  curiosidade: "Antes de levantar a taça, muita história já entrou em campo.",
  destaque: "Aqui, a memória do jogo ganha imagem, voz e emoção."
};

const placasCuratoriaisPorAmbiente = {
  praca: [
    {
      titulo: "Primeiro apito",
      subtitulo: "Você sabia?",
      texto: "A primeira Copa do Mundo aconteceu em 1930, no Uruguai, com 13 seleções participantes.",
      chamada: "Comece a visita pela origem do torneio."
    }
  ],
  arquibancada: [
    {
      titulo: "Voz da torcida",
      subtitulo: "Arquibancadas",
      texto: "Em Copas, o estádio vira memória coletiva: cantos, bandeiras e mosaicos ajudam a contar a história de cada jogo.",
      chamada: "Olhe ao redor como se estivesse antes da final."
    }
  ],
  campo: [],
  tunel: [
    {
      titulo: "Antes da entrada",
      subtitulo: "Expectativa",
      texto: "O túnel separa o silêncio do vestiário do impacto da torcida. Poucos metros mudam completamente a sensação do jogo.",
      chamada: "Avance devagar e perceba a atmosfera crescer."
    }
  ],
  museu: [
    {
      titulo: "Nascimento da Copa",
      subtitulo: "1930",
      texto: "A ideia de um torneio mundial organizado pela FIFA ganhou forma no Uruguai, campeão olímpico e anfitrião da primeira edição.",
      chamada: "Cada vitrine guarda uma camada dessa história."
    }
  ],
  linhaTempo: [],
  campeoes: [],
  camisas: [
    {
      titulo: "Mantos da Copa",
      subtitulo: "Identidade",
      texto: "Cada camisa carrega cores, símbolos e escolhas de design que ajudam uma seleção a ser reconhecida no mundo todo.",
      chamada: "Dê o play e viaje pelos uniformes de 2022."
    }
  ],
  mascotes: [
    {
      titulo: "Desde 1966",
      subtitulo: "Mascotes",
      texto: "As mascotes passaram a fazer parte das Copas em 1966, com World Cup Willie, na Inglaterra.",
      chamada: "Assista e veja como cultura vira personagem."
    }
  ],
  taca: [
    {
      titulo: "Símbolo máximo",
      subtitulo: "Taça",
      texto: "A taça atual estreou em 1974, depois da posse definitiva da Jules Rimet pelo Brasil em 1970.",
      chamada: "Circule pelo pedestal e conecte conquista, símbolo e legado."
    }
  ],
  cinema: [
    {
      titulo: "Sessão especial",
      subtitulo: "Panorama histórico",
      texto: "A Sala de Cinema foi pensada como pausa de contemplação para rever momentos que construíram a Copa do Mundo.",
      chamada: "Sente-se e deixe a história ocupar a tela."
    }
  ],
  quizFinal: [
    {
      titulo: "Última jogada",
      subtitulo: "Quiz",
      texto: "O quiz final retoma ambientes, objetos e fatos históricos que apareceram durante a visita.",
      chamada: "Responda sem pressa e volte às salas quando quiser."
    }
  ]
};

const superficiesPlacasPorAmbiente = {
  praca: [
    { x: -10.6, y: 2.05, z: 6.8, rotY: 35 },
    { x: 5.1, y: 2.05, z: 6.3, rotY: -24 },
    { x: -12.6, y: 2.05, z: 0.4, rotY: 90 }
  ],
  arquibancada: [
    { x: -3.35, y: 2.35, z: 3.1, rotY: 88 },
    { x: 3.35, y: 2.35, z: 3.1, rotY: -88 },
    { x: 0, y: 2.2, z: 11.45, rotY: 180 }
  ],
  campo: [
    { x: -14.75, y: 2.05, z: 9.1, rotY: 90 },
    { x: 14.75, y: 2.05, z: 9.1, rotY: -90 },
    { x: -13.1, y: 2.05, z: -6.1, rotY: 54 }
  ],
  tunel: [
    { x: 3.18, y: 2.15, z: -7.2, rotY: -90 },
    { x: -3.18, y: 2.15, z: 6.5, rotY: 90 },
    { x: 0, y: 2.2, z: -9.2, rotY: 0 }
  ],
  museu: [
    { x: 14.7, y: 2.15, z: 4.4, rotY: -90 },
    { x: -14.7, y: 2.15, z: -5.8, rotY: 90 },
    { x: 4.9, y: 2.15, z: -12.6, rotY: 0 }
  ],
  linhaTempo: [
    { x: 4.15, y: 2.05, z: 12.3, rotY: -90 },
    { x: -4.15, y: 2.05, z: 1.3, rotY: 90 },
    { x: 0, y: 2.05, z: -10.2, rotY: 0 }
  ],
  campeoes: [
    { x: 6.75, y: 2.05, z: 4.8, rotY: -90 },
    { x: -6.75, y: 2.05, z: -0.8, rotY: 90 },
    { x: 0, y: 2.05, z: 6.25, rotY: 180 }
  ],
  camisas: [
    { x: -6.85, y: 2.05, z: 1.8, rotY: 90 },
    { x: 6.85, y: 2.05, z: 1.8, rotY: -90 },
    { x: 0, y: 2.05, z: 5.9, rotY: 180 }
  ],
  mascotes: [
    { x: -6.85, y: 2.05, z: 2.0, rotY: 90 },
    { x: 6.85, y: 2.05, z: 2.0, rotY: -90 },
    { x: 0, y: 2.05, z: 5.8, rotY: 180 }
  ],
  taca: [
    { x: -7.85, y: 2.05, z: 4.8, rotY: 90 },
    { x: 7.85, y: 2.05, z: -5.1, rotY: -90 },
    { x: 0, y: 2.05, z: 7.25, rotY: 180 }
  ],
  cinema: [
    { x: -7.85, y: 2.15, z: 7.1, rotY: 90 },
    { x: 7.85, y: 2.15, z: 7.1, rotY: -90 }
  ],
  quizFinal: [
    { x: -6.85, y: 2.05, z: 3.4, rotY: 90 },
    { x: 6.85, y: 2.05, z: 3.4, rotY: -90 }
  ]
};

const rotasCirculacaoPorAmbiente = {
  praca: [
    { xMin: -2.7, xMax: 2.7, zMin: -13.2, zMax: 9.8 },
    { xMin: 11.4, xMax: 14.2, zMin: -2.6, zMax: 2.6 }
  ],
  arquibancada: [
    { xMin: -2.8, xMax: 2.8, zMin: -14, zMax: 14 }
  ],
  campo: [
    { xMin: -2.8, xMax: 2.8, zMin: -18, zMax: 18 },
    { xMin: -15.1, xMax: 15.1, zMin: 12.8, zMax: 17.1 }
  ],
  tunel: [
    { xMin: -1.8, xMax: 1.8, zMin: -12, zMax: 12 }
  ],
  museu: [
    { xMin: -2.8, xMax: 2.8, zMin: -14, zMax: 14 },
    { xMin: -16, xMax: 16, zMin: -1.8, zMax: 1.8 }
  ],
  linhaTempo: [
    { xMin: -1.9, xMax: 1.9, zMin: -16, zMax: 16 }
  ],
  campeoes: [
    { xMin: -2.1, xMax: 2.1, zMin: 1.7, zMax: 8 }
  ],
  camisas: [
    { xMin: -2.1, xMax: 2.1, zMin: 1.5, zMax: 8 }
  ],
  mascotes: [
    { xMin: -2.1, xMax: 2.1, zMin: 1.5, zMax: 8 }
  ],
  taca: [
    { xMin: -2.1, xMax: 2.1, zMin: 1.5, zMax: 9 }
  ],
  cinema: [
    { xMin: -2.2, xMax: 2.2, zMin: 4.8, zMax: 10 },
    { xMin: -8.1, xMax: 8.1, zMin: 5.3, zMax: 7.8 }
  ],
  quizFinal: [
    { xMin: -2.1, xMax: 2.1, zMin: 1.5, zMax: 8 }
  ]
};

let layoutSeguroAtual = null;

function obterMundo() {
  return document.getElementById("mundo");
}

function criarElemento(tipo, atributos = {}, pai = obterMundo()) {
  const elemento = document.createElement(tipo);

  Object.entries(atributos).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null) {
      elemento.setAttribute(chave, valor);
    }
  });

  pai.appendChild(elemento);
  return elemento;
}

function posicao(x, y, z) {
  return `${x} ${y} ${z}`;
}

function rotacao(x, y, z) {
  return `${x} ${y} ${z}`;
}

function materialTextura(src) {
  return `shader: flat; src: url(${src}); color: #ffffff; side: double; transparent: false; opacity: 1`;
}

function posicaoPainel(x, y, z, rotY, deslocamento) {
  const radianos = rotY * Math.PI / 180;
  return posicao(
    x + Math.sin(radianos) * deslocamento,
    y,
    z + Math.cos(radianos) * deslocamento
  );
}

function retangulosColidem(a, b, margem = 0) {
  return a.xMin - margem < b.xMax &&
    a.xMax + margem > b.xMin &&
    a.zMin - margem < b.zMax &&
    a.zMax + margem > b.zMin;
}

function expandirRetangulo(retangulo, margem) {
  return {
    xMin: retangulo.xMin - margem,
    xMax: retangulo.xMax + margem,
    zMin: retangulo.zMin - margem,
    zMax: retangulo.zMax + margem,
    tipo: retangulo.tipo || "area"
  };
}

function areaSuporteExpositivo({ x, z, rotY = 0, largura = 2.8, profundidade = 0.72, margem = 0.28 }) {
  const radianos = rotY * Math.PI / 180;
  const meioLargura = largura / 2 + margem;
  const meioProfundidade = profundidade / 2 + margem;
  const cos = Math.abs(Math.cos(radianos));
  const sin = Math.abs(Math.sin(radianos));
  const meioX = cos * meioLargura + sin * meioProfundidade;
  const meioZ = sin * meioLargura + cos * meioProfundidade;

  return {
    xMin: x - meioX,
    xMax: x + meioX,
    zMin: z - meioZ,
    zMax: z + meioZ
  };
}

function areaDentroDosLimites(area, ambiente) {
  const limites = window.obterLimitesDoAmbiente?.(ambiente) || window.limitesAmbientes?.[ambiente];
  if (!limites) {
    return true;
  }

  return area.xMin >= limites.xMin &&
    area.xMax <= limites.xMax &&
    area.zMin >= limites.zMin &&
    area.zMax <= limites.zMax;
}

function iniciarLayoutSeguro(ambiente) {
  const colisoesFixas = (window.obterColisoesDoAmbiente?.(ambiente) || [])
    .filter((colisor) => colisor.tipo !== "parede")
    .map((colisor) => expandirRetangulo(colisor, 0.22));
  const portas = (window.obterPortasDoAmbiente?.(ambiente) || [])
    .map((porta) => expandirRetangulo(porta, 0.46));
  const rotas = (rotasCirculacaoPorAmbiente[ambiente] || [])
    .map((rota) => expandirRetangulo({ ...rota, tipo: "rota" }, 0.12));

  layoutSeguroAtual = {
    ambiente,
    ocupadas: [...colisoesFixas, ...portas, ...rotas]
  };
}

function registrarSuporteExpositivo(opcoes, tipo = "midia") {
  if (!layoutSeguroAtual) {
    return;
  }

  const area = areaSuporteExpositivo(opcoes);
  layoutSeguroAtual.ocupadas.push({ ...area, tipo });
}

function encontrarPontoSeguroParaPlaca(ambiente, indice, largura, altura) {
  const candidatos = superficiesPlacasPorAmbiente[ambiente] || [];
  if (!layoutSeguroAtual || !candidatos.length) {
    return null;
  }

  for (let deslocamento = 0; deslocamento < candidatos.length; deslocamento += 1) {
    const candidato = candidatos[(indice + deslocamento) % candidatos.length];
    const escalaSala = Math.max(0.82, Math.min(1, ((window.limitesAmbientes?.[ambiente]?.xMax || 8) - (window.limitesAmbientes?.[ambiente]?.xMin || -8)) / 18));
    const larguraAjustada = Math.min(largura, 2.9 * escalaSala);
    const area = areaSuporteExpositivo({
      ...candidato,
      largura: larguraAjustada,
      profundidade: 0.9,
      margem: 0.34
    });

    if (!areaDentroDosLimites(area, ambiente)) {
      continue;
    }

    const colide = layoutSeguroAtual.ocupadas.some((ocupada) => retangulosColidem(area, ocupada, 0));
    if (!colide) {
      layoutSeguroAtual.ocupadas.push({ ...area, tipo: "placa" });
      return {
        ...candidato,
        largura: larguraAjustada,
        altura: altura * escalaSala
      };
    }
  }

  return null;
}

function adicionarTextoLocal(pai, texto, x, y, z, tamanho, largura, cor, alinhamento = "center", fonte = fontes3D.corpo) {
  return criarElemento("a-text", {
    value: texto,
    position: posicao(x, y, z),
    align: alinhamento,
    color: cor,
    width: largura,
    wrapCount: Math.max(18, Math.round(largura * 9)),
    side: "double",
    baseline: "center",
    shader: "msdf",
    font: fonte,
    negate: "false",
    scale: `${tamanho} ${tamanho} ${tamanho}`
  }, pai);
}

function limparAmbiente() {
  const mundo = obterMundo();
  while (mundo.firstChild) {
    mundo.removeChild(mundo.firstChild);
  }
}

function adicionarLuzes(corAmbiente = "#ffffff") {
  criarElemento("a-entity", {
    light: `type: ambient; color: ${corAmbiente}; intensity: 0.62`
  });
  criarElemento("a-entity", {
    position: "0 12 8",
    light: "type: directional; color: #ffffff; intensity: 0.55; castShadow: true"
  });
  criarElemento("a-entity", {
    position: "-6 6 -6",
    light: "type: point; color: #ffd45a; intensity: 0.45; distance: 30"
  });
}

function adicionarCeu(cor) {
  criarElemento("a-sky", { color: cor });
}

function adicionarPiso(largura, profundidade, cor, materialExtra = "") {
  criarElemento("a-plane", {
    position: "0 0 0",
    rotation: "-90 0 0",
    width: largura,
    height: profundidade,
    material: `color: ${cor}; roughness: 0.86; metalness: 0.02; ${materialExtra}`
  });
}

function adicionarGramadoRealista(largura, profundidade, centroX = 0, centroZ = 0, escalaLinhas = 1) {
  criarElemento("a-plane", {
    position: posicao(centroX, 0.006, centroZ),
    rotation: "-90 0 0",
    width: largura,
    height: profundidade,
    material: "color: #1f7a3f; roughness: 0.92"
  });

  const quantidadeFaixas = 14;
  const profundidadeFaixa = profundidade / quantidadeFaixas;

  for (let i = 0; i < quantidadeFaixas; i += 1) {
    const z = centroZ - profundidade / 2 + profundidadeFaixa / 2 + i * profundidadeFaixa;
    criarElemento("a-plane", {
      position: posicao(centroX, 0.012 + i * 0.0005, z),
      rotation: "-90 0 0",
      width: largura,
      height: profundidadeFaixa + 0.02,
      material: `color: ${i % 2 === 0 ? "#2f8f4e" : "#246f3d"}; roughness: 0.96; side: double`
    });
  }

  criarElemento("a-plane", {
    position: posicao(centroX, 0.018, centroZ),
    rotation: "-90 0 0",
    width: largura - 1.2 * escalaLinhas,
    height: profundidade - 1.2 * escalaLinhas,
    material: "color: #ffffff; opacity: 0.03; transparent: true; side: double"
  });
}

function adicionarTexto(texto, x, y, z, rotY = 0, tamanho = 0.35, largura = 5, cor = "#ffffff", alinhamento = "center", opcoes = {}) {
  return criarElemento("a-text", {
    value: texto,
    position: posicao(x, y, z),
    rotation: rotacao(0, rotY, 0),
    align: alinhamento,
    color: cor,
    width: largura,
    wrapCount: opcoes.wrapCount || Math.max(18, Math.round(largura * 10)),
    side: "double",
    baseline: "center",
    shader: "msdf",
    font: opcoes.fonte || fontes3D.corpo,
    negate: "false",
    scale: `${tamanho} ${tamanho} ${tamanho}`
  });
}

function adicionarParedeVisual(colisor, cor = "#d8d2c8", altura = 3.2) {
  const largura = Math.max(0.08, colisor.xMax - colisor.xMin);
  const profundidade = Math.max(0.08, colisor.zMax - colisor.zMin);
  const x = colisor.xMin + largura / 2;
  const z = colisor.zMin + profundidade / 2;

  criarElemento("a-box", {
    position: posicao(x, altura / 2, z),
    width: largura,
    height: altura,
    depth: profundidade,
    material: `color: ${cor}; roughness: 0.74`
  });
}

function adicionarParedesPorColisao(ambiente, cor, altura = 3.2) {
  window.obterColisoesDoAmbiente(ambiente)
    .filter((colisor) => colisor.tipo === "parede")
    .forEach((colisor) => adicionarParedeVisual(colisor, cor, altura));
}

function adicionarPainelImagem(opcoes) {
  const {
    src,
    titulo,
    descricao,
    chamada,
    x,
    y,
    z,
    rotY = 0,
    largura = 3.4,
    altura = 2,
    moldura = "#111827"
  } = opcoes;
  const descricaoFinal = descricao || microcopyMidia.imagem;
  const chamadaFinal = chamada || microcopyMidia.destaque;

  criarElemento("a-box", {
    position: posicaoPainel(x, y, z, rotY, -0.1),
    rotation: rotacao(0, rotY, 0),
    width: largura + 0.36,
    height: altura + 0.52,
    depth: 0.12,
    material: `color: ${moldura}; roughness: 0.48; metalness: 0.12`
  });

  criarElemento("a-box", {
    position: posicaoPainel(x, y + altura / 2 + 0.16, z, rotY, 0.005),
    rotation: rotacao(0, rotY, 0),
    width: largura + 0.44,
    height: 0.08,
    depth: 0.06,
    material: "color: #ffd45a; emissive: #5f4506; emissiveIntensity: 0.16; roughness: 0.35; metalness: 0.35"
  });

  criarElemento("a-box", {
    position: posicaoPainel(x, y - altura / 2 - 0.16, z, rotY, 0.005),
    rotation: rotacao(0, rotY, 0),
    width: largura + 0.44,
    height: 0.08,
    depth: 0.06,
    material: "color: #2f9d58; emissive: #0f3f27; emissiveIntensity: 0.12; roughness: 0.5"
  });

  const plano = criarElemento("a-plane", {
    position: posicaoPainel(x, y, z, rotY, 0.018),
    rotation: rotacao(0, rotY, 0),
    width: largura,
    height: altura,
    class: "clicavel",
    material: materialTextura(src)
  });

  plano.addEventListener("click", () => {
    window.tocarClique?.();
    window.ampliarImagem?.(src, titulo, descricaoFinal);
  });

  adicionarTexto(titulo, x, y - altura / 2 - 0.38, z, rotY, 0.24, largura * 1.42, "#ffffff", "center", { fonte: fontes3D.apoio });
  adicionarTexto(chamadaFinal, x, y - altura / 2 - 0.66, z, rotY, 0.15, largura * 1.9, "#dbeafe");
  registrarSuporteExpositivo({ x, z, rotY, largura: largura + 0.6, profundidade: 0.75 }, "imagem");
  return plano;
}

function adicionarTelaVideo(opcoes) {
  const {
    idVideo,
    titulo,
    descricao,
    chamada,
    poster,
    x,
    y,
    z,
    rotY = 0,
    largura = 4.6,
    altura = 2.55
  } = opcoes;
  const dadosVideo = window.videosExperiencia?.[idVideo] || {};
  const tituloFinal = titulo || dadosVideo.titulo || "Vídeo";
  const descricaoFinal = descricao || `${microcopyMidia.video}\n\n${dadosVideo.titulo || "Vídeo"} — ${dadosVideo.canal || "conteúdo interativo"}`;
  const chamadaFinal = chamada || "Dê o play e explore a história com calma.";
  const posterFinal = dadosVideo.poster || poster || "assets/posters/poster-abertura.jpg";

  criarElemento("a-box", {
    position: posicaoPainel(x, y, z, rotY, -0.12),
    rotation: rotacao(0, rotY, 0),
    width: largura + 0.5,
    height: altura + 0.56,
    depth: 0.14,
    material: "color: #05070d; roughness: 0.46; metalness: 0.22"
  });

  criarElemento("a-box", {
    position: posicaoPainel(x, y + altura / 2 + 0.18, z, rotY, 0.006),
    rotation: rotacao(0, rotY, 0),
    width: largura + 0.58,
    height: 0.09,
    depth: 0.07,
    material: "color: #ffd45a; emissive: #5f4506; emissiveIntensity: 0.18; roughness: 0.32; metalness: 0.42"
  });

  criarElemento("a-box", {
    position: posicaoPainel(x, y - altura / 2 - 0.18, z, rotY, 0.006),
    rotation: rotacao(0, rotY, 0),
    width: largura + 0.58,
    height: 0.09,
    depth: 0.07,
    material: "color: #1d4ed8; emissive: #10255f; emissiveIntensity: 0.14; roughness: 0.42"
  });

  const tela = criarElemento("a-plane", {
    position: posicaoPainel(x, y, z, rotY, 0.02),
    rotation: rotacao(0, rotY, 0),
    width: largura,
    height: altura,
    class: "clicavel",
    material: materialTextura(posterFinal)
  });

  tela.addEventListener("click", () => {
    window.tocarClique?.();
    window.tocarVideo?.(idVideo, tituloFinal, descricaoFinal);
  });

  criarElemento("a-ring", {
    position: posicaoPainel(x, y, z, rotY, 0.035),
    rotation: rotacao(0, rotY, 0),
    radiusInner: 0.27,
    radiusOuter: 0.34,
    thetaLength: 360,
    class: "clicavel",
    material: "color: #dc2626; opacity: 0.82; transparent: true; side: double"
  }).addEventListener("click", () => {
    window.tocarClique?.();
    window.tocarVideo?.(idVideo, tituloFinal, descricaoFinal);
  });

  adicionarTexto(`▶ ${tituloFinal}`, x, y - altura / 2 - 0.42, z, rotY, 0.27, largura * 1.35, "#ffd45a", "center", { fonte: fontes3D.apoio });
  adicionarTexto(chamadaFinal, x, y - altura / 2 - 0.73, z, rotY, 0.16, largura * 1.8, "#dbeafe");
  registrarSuporteExpositivo({ x, z, rotY, largura: largura + 0.8, profundidade: 0.82 }, "video");
  return tela;
}

function adicionarPlacaCuriosidade(dados, opcoes) {
  const {
    x,
    y,
    z,
    rotY = 0,
    largura = 2.65,
    altura = 1.55,
    abrirModal = true
  } = opcoes;
  const grupo = criarElemento("a-entity", {
    position: posicao(x, y, z),
    rotation: rotacao(0, rotY, 0),
    class: "clicavel"
  });

  criarElemento("a-box", {
    position: "0 0 -0.07",
    width: largura + 0.18,
    height: altura + 0.18,
    depth: 0.12,
    class: "clicavel",
    material: "color: #070b14; roughness: 0.42; metalness: 0.24"
  }, grupo);

  criarElemento("a-plane", {
    position: "0 0 0.012",
    width: largura,
    height: altura,
    class: "clicavel",
    material: "color: #0b1628; opacity: 0.96; transparent: true; side: double"
  }, grupo);

  criarElemento("a-plane", {
    position: `0 ${altura / 2 - 0.1} 0.026`,
    width: largura - 0.1,
    height: 0.13,
    material: "color: #2f9d58; opacity: 0.9; transparent: true; side: double"
  }, grupo);

  criarElemento("a-box", {
    position: `${-largura / 2 + 0.08} 0 0.04`,
    width: 0.08,
    height: altura - 0.08,
    depth: 0.035,
    material: "color: #ffd45a; emissive: #6d4d05; emissiveIntensity: 0.22; roughness: 0.32; metalness: 0.4"
  }, grupo);

  for (let i = 0; i < 3; i += 1) {
    criarElemento("a-plane", {
      position: `${-0.45 + i * 0.45} ${altura / 2 - 0.25 - i * 0.17} 0.03`,
      rotation: `0 0 ${i % 2 === 0 ? 18 : -18}`,
      width: 0.72,
      height: 0.018,
      material: "color: #ffffff; opacity: 0.12; transparent: true; side: double"
    }, grupo);
  }

  criarElemento("a-ring", {
    position: `${largura / 2 - 0.45} ${altura / 2 - 0.43} 0.032`,
    radiusInner: 0.2,
    radiusOuter: 0.215,
    thetaLength: 320,
    material: "color: #ffd45a; opacity: 0.28; transparent: true; side: double"
  }, grupo);

  adicionarTextoLocal(grupo, dados.subtitulo || "Curiosidade", -largura / 2 + 0.26, altura / 2 - 0.31, 0.06, 0.16, largura * 2.2, "#9fe7b5", "left", fontes3D.apoio);
  adicionarTextoLocal(grupo, dados.titulo, -largura / 2 + 0.26, altura / 2 - 0.53, 0.06, 0.27, largura * 2.05, "#ffffff", "left", fontes3D.titulo);
  adicionarTextoLocal(grupo, dados.texto, -largura / 2 + 0.26, 0.02, 0.06, 0.18, largura * 2.22, "#e5eefc", "left", fontes3D.corpo);
  adicionarTextoLocal(grupo, dados.chamada, -largura / 2 + 0.26, -altura / 2 + 0.23, 0.06, 0.14, largura * 2.22, "#ffd45a", "left", fontes3D.apoio);

  if (abrirModal) {
    grupo.addEventListener("click", () => {
      window.tocarClique?.();
      window.abrirModalTexto?.(
        dados.titulo,
        `${dados.subtitulo ? `${dados.subtitulo}\n\n` : ""}${dados.texto}\n\n${dados.chamada || microcopyMidia.curiosidade}`
      );
    });
  }

  return grupo;
}

function adicionarSuportePaginadoPlacas(ambiente, itens) {
  if (!itens.length) {
    return null;
  }

  const candidato = (superficiesPlacasPorAmbiente[ambiente] || [])[0];
  if (!candidato) {
    return null;
  }

  const largura = 2.75;
  const altura = 1.62;
  let indiceAtual = 0;
  const grupo = adicionarPlacaCuriosidade({
    ...itens[indiceAtual],
    chamada: `${itens[indiceAtual].chamada} Toque para ver a próxima.`
  }, { ...candidato, largura, altura, abrirModal: false });

  const textos = Array.from(grupo.querySelectorAll("a-text"));
  const atualizar = () => {
    const item = itens[indiceAtual];
    if (textos[0]) textos[0].setAttribute("value", item.subtitulo || "Curiosidade");
    if (textos[1]) textos[1].setAttribute("value", item.titulo);
    if (textos[2]) textos[2].setAttribute("value", item.texto);
    if (textos[3]) textos[3].setAttribute("value", `${item.chamada} ${indiceAtual + 1}/${itens.length}`);
  };

  grupo.addEventListener("click", () => {
    indiceAtual = (indiceAtual + 1) % itens.length;
    atualizar();
  });
  atualizar();
  registrarSuporteExpositivo({ ...candidato, largura, profundidade: 0.9 }, "placa-paginada");
  return grupo;
}

function adicionarPlacasCuratoriais(ambiente) {
  const placas = placasCuratoriaisPorAmbiente[ambiente] || [];
  const pendentes = [];

  placas.forEach((placa, indice) => {
    const posicaoPlaca = encontrarPontoSeguroParaPlaca(ambiente, indice, 2.75, 1.58);
    if (posicaoPlaca) {
      adicionarPlacaCuriosidade(placa, posicaoPlaca);
    } else {
      pendentes.push(placa);
    }
  });

  adicionarSuportePaginadoPlacas(ambiente, pendentes);
}

function adicionarBotao3D(texto, x, y, z, rotY, aoClicar, largura = 2.4, altura = 0.62, cor = "#0f172a") {
  const grupo = criarElemento("a-entity", {
    position: posicao(x, y, z),
    rotation: rotacao(0, rotY, 0),
    class: "clicavel"
  });

  criarElemento("a-plane", {
    position: "0 0 0",
    width: largura,
    height: altura,
    material: `color: ${cor}; opacity: 0.92; transparent: true`,
    class: "clicavel"
  }, grupo);

  criarElemento("a-text", {
    value: texto,
    position: "0 0 0.03",
    align: "center",
    color: "#ffffff",
    width: largura * 2.1,
    wrapCount: 28,
    scale: "0.34 0.34 0.34",
    baseline: "center",
    class: "clicavel"
  }, grupo);

  grupo.addEventListener("click", () => {
    window.tocarClique?.();
    aoClicar?.();
  });

  return grupo;
}

function adicionarPortaisVisuais(ambiente) {
  window.obterPortasDoAmbiente(ambiente).forEach((porta) => {
    const largura = Math.max(0.4, porta.xMax - porta.xMin);
    const profundidade = Math.max(0.4, porta.zMax - porta.zMin);
    const x = porta.xMin + largura / 2;
    const z = porta.zMin + profundidade / 2;
    const nomeDestino = window.nomesAmbientes?.[porta.destino] || porta.destino;

    criarElemento("a-plane", {
      position: posicao(x, 0.045, z),
      rotation: "-90 0 0",
      width: largura,
      height: profundidade,
      material: "color: #ffd45a; opacity: 0.36; transparent: true; side: double"
    });

    adicionarTexto(`Porta: ${nomeDestino}`, x, 0.48, z, 0, 0.23, 4, "#ffd45a");
  });
}

function adicionarObjetoColisor(tipo, x, y, z, largura, altura, profundidade, cor, opacidade = 1) {
  return criarElemento(tipo, {
    position: posicao(x, y, z),
    width: largura,
    height: altura,
    depth: profundidade,
    material: `color: ${cor}; opacity: ${opacidade}; transparent: ${opacidade < 1}; roughness: 0.45`
  });
}

function adicionarBandeira(x, y, z, cor1, cor2, rotY = 0, titulo = "") {
  criarElemento("a-cylinder", {
    position: posicao(x - 0.56, y - 0.32, z),
    radius: 0.04,
    height: 1.7,
    material: "color: #d9dde4; metalness: 0.3"
  });

  criarElemento("a-plane", {
    position: posicao(x, y, z),
    rotation: rotacao(0, rotY, 0),
    width: 1.05,
    height: 0.68,
    material: `color: ${cor1}; side: double`
  });

  criarElemento("a-plane", {
    position: posicao(x + 0.23, y, z + 0.01),
    rotation: rotacao(0, rotY, 0),
    width: 0.34,
    height: 0.68,
    material: `color: ${cor2}; side: double`
  });

  if (titulo) {
    adicionarTexto(titulo, x, y - 0.56, z, rotY, 0.18, 2.2, "#ffffff");
  }
}

function adicionarAssentos(lado) {
  const direcao = lado === "esquerda" ? -1 : 1;
  const xBase = direcao * 6.15;
  const coresCadeiras = ["#1d4ed8", "#dc2626", "#f8fafc", "#0f766e"];

  for (let fileira = 0; fileira < 9; fileira += 1) {
    const z = 8.1 - fileira * 1.15;
    const y = 0.48 + fileira * 0.19;

    criarElemento("a-box", {
      position: posicao(xBase, y - 0.24, z + 0.16),
      width: 7.65,
      height: 0.18,
      depth: 0.94,
      material: "color: #596270; roughness: 0.82"
    });

    criarElemento("a-box", {
      position: posicao(xBase, y - 0.02, z + 0.42),
      width: 7.65,
      height: 0.42,
      depth: 0.16,
      material: "color: #3b4350; roughness: 0.82"
    });

    for (let coluna = 0; coluna < 8; coluna += 1) {
      const x = xBase + direcao * (-3.05 + coluna * 0.86);
      const corCadeira = coresCadeiras[(fileira + coluna) % coresCadeiras.length];

      criarElemento("a-box", {
        position: posicao(x, y, z - 0.08),
        width: 0.58,
        height: 0.24,
        depth: 0.48,
        material: `color: ${corCadeira}; roughness: 0.68`
      });

      criarElemento("a-box", {
        position: posicao(x, y + 0.28, z + 0.24),
        width: 0.58,
        height: 0.62,
        depth: 0.16,
        material: `color: ${corCadeira}; roughness: 0.72`
      });

      if (coluna % 3 === 0 && fileira % 2 === 0) {
        criarElemento("a-sphere", {
          position: posicao(x, y + 0.74, z - 0.10),
          radius: 0.15,
          material: "color: #f4c99b"
        });

        criarElemento("a-cylinder", {
          position: posicao(x, y + 0.42, z - 0.09),
          radius: 0.15,
          height: 0.42,
          material: `color: ${coresCadeiras[(coluna + 1) % coresCadeiras.length]}`
        });

        criarElemento("a-plane", {
          position: posicao(x, y + 0.76, z - 0.255),
          rotation: "0 0 0",
          width: 0.16,
          height: 0.08,
          material: "color: #111827; side: double"
        });
      }
    }
  }
}

function adicionarLinhaCampo(x, z, largura, profundidade, y = 0.035) {
  criarElemento("a-plane", {
    position: posicao(x, y, z),
    rotation: "-90 0 0",
    width: largura,
    height: profundidade,
    material: "color: #f8fafc; side: double; roughness: 0.55"
  });
}

function adicionarLinhasDoCampo(centroX = 0, centroZ = 0, escala = 1) {
  const largura = 28 * escala;
  const profundidade = 32.4 * escala;
  const xLinha = largura / 2;
  const zLinha = profundidade / 2;
  const espessura = 0.08 * escala;
  const larguraArea = 11.5 * escala;
  const profundidadeArea = 4.8 * escala;
  const larguraPequenaArea = 5.9 * escala;
  const profundidadePequenaArea = 1.95 * escala;

  adicionarLinhaCampo(centroX, centroZ - zLinha, largura, espessura);
  adicionarLinhaCampo(centroX, centroZ + zLinha, largura, espessura);
  adicionarLinhaCampo(centroX - xLinha, centroZ, espessura, profundidade);
  adicionarLinhaCampo(centroX + xLinha, centroZ, espessura, profundidade);
  adicionarLinhaCampo(centroX, centroZ, largura, espessura);

  [-1, 1].forEach((sentido) => {
    const zGol = centroZ + sentido * zLinha;
    const zArea = zGol - sentido * profundidadeArea;
    const zMeioArea = zGol - sentido * profundidadeArea / 2;
    const zPequenaArea = zGol - sentido * profundidadePequenaArea;
    const zMeioPequenaArea = zGol - sentido * profundidadePequenaArea / 2;
    const zPenalti = zGol - sentido * 5.6 * escala;

    adicionarLinhaCampo(centroX, zArea, larguraArea, espessura);
    adicionarLinhaCampo(centroX - larguraArea / 2, zMeioArea, espessura, profundidadeArea);
    adicionarLinhaCampo(centroX + larguraArea / 2, zMeioArea, espessura, profundidadeArea);
    adicionarLinhaCampo(centroX, zPequenaArea, larguraPequenaArea, espessura);
    adicionarLinhaCampo(centroX - larguraPequenaArea / 2, zMeioPequenaArea, espessura, profundidadePequenaArea);
    adicionarLinhaCampo(centroX + larguraPequenaArea / 2, zMeioPequenaArea, espessura, profundidadePequenaArea);

    criarElemento("a-circle", {
      position: posicao(centroX, 0.04, zPenalti),
      rotation: "-90 0 0",
      radius: 0.12 * escala,
      material: "color: #f8fafc; side: double"
    });
  });

  criarElemento("a-ring", {
    position: posicao(centroX, 0.042, centroZ),
    rotation: "-90 0 0",
    radiusInner: 2.05 * escala,
    radiusOuter: 2.14 * escala,
    material: "color: #f8fafc; side: double"
  });

  criarElemento("a-circle", {
    position: posicao(centroX, 0.045, centroZ),
    rotation: "-90 0 0",
    radius: 0.11 * escala,
    material: "color: #f8fafc; side: double"
  });
}

function adicionarGol(z, rotY = 0) {
  const grupo = criarElemento("a-entity", {
    position: posicao(0, 0, z),
    rotation: rotacao(0, rotY, 0),
    class: "clicavel"
  });

  criarElemento("a-box", { position: "0 1.1 0", width: 3.6, height: 0.12, depth: 0.12, material: "color: #ffffff" }, grupo);
  criarElemento("a-box", { position: "-1.8 0.6 0", width: 0.12, height: 1.2, depth: 0.12, material: "color: #ffffff" }, grupo);
  criarElemento("a-box", { position: "1.8 0.6 0", width: 0.12, height: 1.2, depth: 0.12, material: "color: #ffffff" }, grupo);
  criarElemento("a-plane", { position: "0 0.6 0.26", width: 3.6, height: 1.2, material: "color: #ffffff; opacity: 0.18; transparent: true; side: double" }, grupo);

  grupo.addEventListener("click", () => {
    window.abrirModalTexto?.("Desafio do gol", "O gol e protegido como objeto solido. Para chegar ao tunel, use apenas a entrada central sinalizada ao fundo do campo.");
  });
}

function adicionarVistaCampoArquibancada() {
  criarElemento("a-plane", {
    position: "0 -0.18 -8.2",
    rotation: "-90 0 0",
    width: 13.2,
    height: 11.8,
    material: "color: #12301d; roughness: 0.95"
  });

  adicionarGramadoRealista(12.3, 10.6, 0, -8.2, 0.42);
  adicionarLinhasDoCampo(0, -8.2, 0.42);

  criarElemento("a-box", {
    position: "0 0.48 -5.25",
    width: 8.6,
    height: 0.18,
    depth: 0.14,
    material: "color: #e5e7eb; opacity: 0.55; transparent: true; roughness: 0.2"
  });
  criarElemento("a-box", {
    position: "-4.32 0.78 -5.25",
    width: 0.12,
    height: 0.88,
    depth: 0.12,
    material: "color: #e5e7eb; opacity: 0.58; transparent: true"
  });
  criarElemento("a-box", {
    position: "4.32 0.78 -5.25",
    width: 0.12,
    height: 0.88,
    depth: 0.12,
    material: "color: #e5e7eb; opacity: 0.58; transparent: true"
  });

  criarElemento("a-box", {
    position: "0 0.44 -11.85",
    width: 4.1,
    height: 0.08,
    depth: 0.08,
    material: "color: #ffffff"
  });
  criarElemento("a-box", {
    position: "-2.05 0.25 -11.85",
    width: 0.08,
    height: 0.5,
    depth: 0.08,
    material: "color: #ffffff"
  });
  criarElemento("a-box", {
    position: "2.05 0.25 -11.85",
    width: 0.08,
    height: 0.5,
    depth: 0.08,
    material: "color: #ffffff"
  });

  [-5.8, -2.9, 2.9, 5.8].forEach((x) => {
    criarElemento("a-box", {
      position: posicao(x, 0.42, -12.8),
      width: 2.2,
      height: 0.42,
      depth: 0.12,
      material: "color: #111827; roughness: 0.48"
    });
  });
}

function adicionarModuloArquibancadaCampo(x, z, rotY, largura = 10, fileiras = 7) {
  const grupo = criarElemento("a-entity", {
    position: posicao(x, 0, z),
    rotation: rotacao(0, rotY, 0)
  });
  const coresCadeiras = ["#1d4ed8", "#dc2626", "#f8fafc", "#0f766e"];
  const colunas = Math.max(6, Math.floor(largura / 0.82));
  const inicioX = -((colunas - 1) * 0.82) / 2;

  for (let fileira = 0; fileira < fileiras; fileira += 1) {
    const y = 0.42 + fileira * 0.22;
    const zLocal = -fileira * 0.78;

    criarElemento("a-box", {
      position: posicao(0, y - 0.23, zLocal + 0.14),
      width: largura,
      height: 0.18,
      depth: 0.72,
      material: "color: #667085; roughness: 0.84"
    }, grupo);

    criarElemento("a-box", {
      position: posicao(0, y - 0.02, zLocal - 0.24),
      width: largura,
      height: 0.36,
      depth: 0.14,
      material: "color: #404854; roughness: 0.82"
    }, grupo);

    for (let coluna = 0; coluna < colunas; coluna += 1) {
      const xLocal = inicioX + coluna * 0.82;
      const cor = coresCadeiras[(fileira + coluna) % coresCadeiras.length];

      criarElemento("a-box", {
        position: posicao(xLocal, y, zLocal + 0.03),
        width: 0.54,
        height: 0.22,
        depth: 0.42,
        material: `color: ${cor}; roughness: 0.7`
      }, grupo);

      criarElemento("a-box", {
        position: posicao(xLocal, y + 0.25, zLocal - 0.19),
        width: 0.54,
        height: 0.52,
        depth: 0.13,
        material: `color: ${cor}; roughness: 0.74`
      }, grupo);

      if ((coluna + fileira) % 5 === 0) {
        criarElemento("a-sphere", {
          position: posicao(xLocal, y + 0.66, zLocal + 0.01),
          radius: 0.13,
          material: "color: #f4c99b"
        }, grupo);
      }
    }
  }

  criarElemento("a-box", {
    position: posicao(0, 2.35, -2.3),
    width: largura + 0.6,
    height: 0.22,
    depth: 2.2,
    material: "color: #111827; opacity: 0.72; transparent: true; roughness: 0.46"
  }, grupo);
}

function adicionarArquibancadasVisiveisDoCampo() {
  // Modulos fora do campo, deixando o vao central do tunel livre.
  adicionarModuloArquibancadaCampo(-7.2, -17.9, 0, 8.5, 7);
  adicionarModuloArquibancadaCampo(7.2, -17.9, 0, 8.5, 7);
  adicionarModuloArquibancadaCampo(-16.9, 0, 90, 22, 6);
  adicionarModuloArquibancadaCampo(16.9, 0, -90, 22, 6);
  adicionarModuloArquibancadaCampo(-7.2, 17.9, 180, 8.5, 6);
  adicionarModuloArquibancadaCampo(7.2, 17.9, 180, 8.5, 6);

  adicionarTexto("Arquibancadas", -10.4, 3.25, -16.8, 25, 0.28, 4, "#ffffff");
  adicionarTexto("Arquibancadas", 10.4, 3.25, -16.8, -25, 0.28, 4, "#ffffff");
}

function adicionarPlacasPublicidade() {
  adicionarTelaVideo({
    idVideo: "estadiosCampo",
    titulo: "Estádios da Copa",
    descricao: "Chegue mais perto e dê o play para conhecer os estádios da Copa, suas cidades, estruturas e o caminho dos jogos. Este painel conecta o gramado ao palco onde cada partida ganha escala.",
    chamada: "Dê o play e explore os palcos que recebem a Copa.",
    x: -3.4,
    y: 1.55,
    z: 6.8,
    rotY: 0,
    largura: 3.25,
    altura: 1.82
  });

  const placas = [
    { x: 14.35, z: -3.8, rotY: -90, img: "assets/img/copa-arte-02.jpg", titulo: "Arte da Copa 02" },
    { x: 11.5, z: 10.5, rotY: 32, img: "assets/img/copa-arte-02.jpg", titulo: "Patrocinio ficticio" }
  ];

  placas.forEach((placa) => {
    adicionarPainelImagem({
      src: placa.img,
      titulo: placa.titulo,
      descricao: "Espaco reservado para imagens publicitarias ou artes tematicas.",
      x: placa.x,
      y: 1.2,
      z: placa.z,
      rotY: placa.rotY,
      largura: 2.8,
      altura: 1.1,
      moldura: "#0f172a"
    });
  });
}

function adicionarBolaTriondaCentro() {
  const grupo = criarElemento("a-entity", {
    position: "0 0.43 0"
  });
  grupo.setAttribute("animation", "property: rotation; to: 0 360 0; dur: 6500; loop: true; easing: linear");

  const abrirModelo = () => {
    window.tocarClique?.();
    window.abrirSketchfabBola?.();
  };

  const registrarClique = (elemento) => {
    elemento.addEventListener("click", abrirModelo);
    return elemento;
  };

  registrarClique(criarElemento("a-sphere", {
    radius: 0.42,
    class: "clicavel",
    material: "color: #f8fafc; roughness: 0.38; metalness: 0.03"
  }, grupo));

  [
    { rot: "0 0 0" },
    { rot: "0 90 0" },
    { rot: "90 0 0" }
  ].forEach((costura) => {
    criarElemento("a-entity", {
      rotation: costura.rot,
      geometry: "primitive: ring; radiusInner: 0.407; radiusOuter: 0.417; thetaLength: 360",
      material: "color: #d1d5db; opacity: 0.72; transparent: true; side: double"
    }, grupo);
  });

  [
    { cor: "#00843d", pos: "0.01 0.07 0.424", rot: "0 0 -26", inicio: 18, arco: 124, interno: 0.13, externo: 0.27 },
    { cor: "#e31b23", pos: "0.295 0.01 0.304", rot: "0 44 22", inicio: 204, arco: 118, interno: 0.12, externo: 0.25 },
    { cor: "#0057b8", pos: "-0.294 -0.02 0.306", rot: "0 -43 -18", inicio: 76, arco: 118, interno: 0.12, externo: 0.25 },
    { cor: "#fbbf24", pos: "0.02 0.306 0.294", rot: "-47 0 70", inicio: 226, arco: 96, interno: 0.08, externo: 0.19 },
    { cor: "#00a3e0", pos: "-0.02 -0.318 0.274", rot: "50 0 -74", inicio: 42, arco: 96, interno: 0.08, externo: 0.19 }
  ].forEach((faixa) => {
    registrarClique(criarElemento("a-entity", {
      position: faixa.pos,
      rotation: faixa.rot,
      class: "clicavel",
      geometry: `primitive: ring; radiusInner: ${faixa.interno}; radiusOuter: ${faixa.externo}; thetaStart: ${faixa.inicio}; thetaLength: ${faixa.arco}`,
      material: `color: ${faixa.cor}; shader: flat; roughness: 0.32; side: double`
    }, grupo));
  });

  [
    { cor: "#00843d", pos: "0.18 -0.21 0.336", rot: "30 24 0" },
    { cor: "#e31b23", pos: "-0.17 0.22 0.324", rot: "-34 -25 0" },
    { cor: "#0057b8", pos: "0.01 -0.02 0.435", rot: "0 0 0" }
  ].forEach((detalhe) => {
    registrarClique(criarElemento("a-circle", {
      position: detalhe.pos,
      rotation: detalhe.rot,
      radius: 0.045,
      class: "clicavel",
      material: `color: ${detalhe.cor}; shader: flat; side: double`
    }, grupo));
  });

  criarElemento("a-circle", {
    position: "0 -0.416 0",
    rotation: "-90 0 0",
    radius: 0.44,
    material: "color: #020617; opacity: 0.25; transparent: true; side: double"
  }, grupo);

  return grupo;
}

function adicionarJogadorBrasilCampo() {
  const grupo = criarElemento("a-entity", {
    position: "1.35 0 0.72",
    rotation: "0 -28 0"
  });
  grupo.setAttribute("animation", "property: rotation; dir: alternate; dur: 2600; to: 0 -18 0; loop: true; easing: easeInOutSine");

  const abrirModelo = () => {
    window.tocarClique?.();
    window.abrirSketchfabJogador?.();
  };

  const hitbox = criarElemento("a-box", {
    position: "0 0.95 0",
    width: 0.92,
    height: 1.9,
    depth: 0.7,
    class: "clicavel",
    material: "color: #ffffff; opacity: 0.01; transparent: true"
  }, grupo);
  hitbox.addEventListener("click", abrirModelo);

  criarElemento("a-circle", {
    position: "0 0.025 0",
    rotation: "-90 0 0",
    radius: 0.44,
    material: "color: #020617; opacity: 0.22; transparent: true; side: double"
  }, grupo);

  criarElemento("a-cylinder", {
    position: "0 1.06 0",
    radius: 0.22,
    height: 0.68,
    class: "clicavel",
    material: "color: #facc15; roughness: 0.55"
  }, grupo).addEventListener("click", abrirModelo);

  criarElemento("a-cylinder", {
    position: "0 0.64 0",
    radius: 0.23,
    height: 0.26,
    material: "color: #1d4ed8; roughness: 0.58"
  }, grupo);

  criarElemento("a-sphere", {
    position: "0 1.56 0",
    radius: 0.17,
    class: "clicavel",
    material: "color: #c98f5b; roughness: 0.52"
  }, grupo).addEventListener("click", abrirModelo);

  criarElemento("a-sphere", {
    position: "0 1.69 -0.02",
    radius: 0.13,
    material: "color: #111827; roughness: 0.7"
  }, grupo);

  [
    ["-0.12 0.33 0", -4],
    ["0.12 0.33 0", 4]
  ].forEach(([pos, rotZ]) => {
    criarElemento("a-cylinder", {
      position: pos,
      rotation: `0 0 ${rotZ}`,
      radius: 0.055,
      height: 0.55,
      material: "color: #f8fafc; roughness: 0.58"
    }, grupo);
  });

  [
    ["-0.16 0.08 0.08", "#16a34a"],
    ["0.16 0.08 0.08", "#16a34a"]
  ].forEach(([pos, cor]) => {
    criarElemento("a-box", {
      position: pos,
      width: 0.22,
      height: 0.08,
      depth: 0.34,
      material: `color: ${cor}; roughness: 0.62`
    }, grupo);
  });

  [
    ["-0.32 1.08 0", "0 0 -20"],
    ["0.32 1.08 0", "0 0 20"]
  ].forEach(([pos, rot]) => {
    criarElemento("a-box", {
      position: pos,
      rotation: rot,
      width: 0.09,
      height: 0.56,
      depth: 0.1,
      material: "color: #facc15; roughness: 0.55"
    }, grupo);
  });

  criarElemento("a-plane", {
    position: "0 1.12 0.225",
    width: 0.28,
    height: 0.4,
    material: "color: #16a34a; opacity: 0.95; transparent: true; side: double"
  }, grupo);

  adicionarTexto("Jogador Brasil", 1.35, 2.1, 0.72, -28, 0.22, 2.8, "#ffffff");
  adicionarTexto("Sketchfab", 1.35, 1.86, 0.72, -28, 0.17, 2.2, "#ffd45a");
}

function adicionarTacaSketchfabCentro() {
  const grupo = criarElemento("a-entity", {
    position: "0 0.92 0",
    class: "clicavel"
  });
  grupo.setAttribute("animation", "property: rotation; to: 0 360 0; dur: 14000; loop: true; easing: linear");

  const abrirModelo = () => {
    window.tocarClique?.();
    window.abrirSketchfabTaca?.();
  };

  criarElemento("a-box", {
    position: "0 0.95 0",
    width: 1.55,
    height: 2.35,
    depth: 1.55,
    class: "clicavel",
    material: "color: #ffffff; opacity: 0.01; transparent: true"
  }, grupo).addEventListener("click", abrirModelo);

  criarElemento("a-cylinder", {
    position: "0 0.2 0",
    radius: 0.36,
    height: 0.38,
    material: "color: #111827; metalness: 0.35; roughness: 0.28"
  }, grupo);
  criarElemento("a-cylinder", {
    position: "0 0.48 0",
    radius: 0.26,
    height: 0.26,
    material: "color: #d4a62a; metalness: 0.85; roughness: 0.16"
  }, grupo);
  criarElemento("a-cylinder", {
    position: "0 0.82 0",
    radius: 0.16,
    height: 0.48,
    material: "color: #f4c542; metalness: 0.9; roughness: 0.14"
  }, grupo);
  criarElemento("a-cone", {
    position: "0 1.22 0",
    radiusBottom: 0.36,
    radiusTop: 0.58,
    height: 0.74,
    class: "clicavel",
    material: "color: #ffd45a; metalness: 0.92; roughness: 0.12"
  }, grupo).addEventListener("click", abrirModelo);
  criarElemento("a-sphere", {
    position: "0 1.67 0",
    radius: 0.48,
    scale: "0.86 0.72 0.86",
    class: "clicavel",
    material: "color: #ffe083; metalness: 0.95; roughness: 0.1"
  }, grupo).addEventListener("click", abrirModelo);

  [
    ["-0.48 1.22 0", "0 80 0"],
    ["0.48 1.22 0", "0 80 0"]
  ].forEach(([pos, rot]) => {
    criarElemento("a-torus", {
      position: pos,
      rotation: rot,
      radius: 0.28,
      radiusTubular: 0.045,
      arc: 210,
      class: "clicavel",
      material: "color: #ffd45a; metalness: 0.9; roughness: 0.12"
    }, grupo).addEventListener("click", abrirModelo);
  });

  [
    ["-0.22 1.68 0.42", "#16a34a"],
    ["0.18 1.73 0.4", "#22c55e"]
  ].forEach(([pos, cor]) => {
    criarElemento("a-sphere", {
      position: pos,
      radius: 0.09,
      material: `color: ${cor}; roughness: 0.4`
    }, grupo);
  });

  adicionarTexto("FIFA Trophy", 0, 2.95, 0, 0, 0.26, 3, "#ffd45a");
  adicionarTexto("Clique para abrir no Sketchfab", 0, 2.65, 0, 0, 0.18, 3.6, "#ffffff");
}

function criarPraca() {
  adicionarCeu(configuracaoVisual.praca.ceu);
  adicionarPiso(28, 28, configuracaoVisual.praca.piso);
  adicionarLuzes("#cfe6ff");
  adicionarParedesPorColisao("praca", configuracaoVisual.praca.parede, 3.4);

  criarElemento("a-box", {
    position: "0 2.1 -11.8",
    width: 12,
    height: 4.2,
    depth: 0.35,
    material: "color: #24364c; roughness: 0.6"
  });
  adicionarTexto("ESTADIO DA COPA", 0, 3.65, -11.55, 0, 0.42, 8, "#ffd45a");

  for (let i = 0; i < 9; i += 1) {
    const x = -5.3 + i * 1.32;
    criarElemento("a-cylinder", {
      position: posicao(x, 1.35, -11.25),
      radius: 0.18,
      height: 2.7,
      material: "color: #d5dbe4; roughness: 0.42"
    });
  }

  criarElemento("a-box", {
    position: "-10 1.45 -3.65",
    width: 4,
    height: 2.7,
    depth: 3.1,
    material: "color: #e5e7eb; roughness: 0.5"
  });
  adicionarTexto("Bilheteria", -10, 2.95, -1.95, 180, 0.34, 3, "#111827");

  adicionarTelaVideo({
    idVideo: "abertura",
    titulo: "Curiosidades das Copas",
    descricao: "Vídeo do Museu do Futebol com curiosidades das Copas do Mundo.",
    poster: "assets/posters/poster-abertura.jpg",
    x: 6.5,
    y: 2.2,
    z: -9.35,
    rotY: 0,
    largura: 4.4,
    altura: 2.35
  });

  adicionarPainelImagem({
    src: "assets/img/estadio-copa.jpg",
    titulo: "Estadio da Copa",
    descricao: "Painel externo para imagem do estadio, fachada ou arena escolhida.",
    x: -4.2,
    y: 2,
    z: -7.75,
    rotY: 0,
    largura: 3.4,
    altura: 2
  });

  adicionarPainelImagem({
    src: "assets/img/mapa-estadio.png",
    titulo: "Mapa do estadio",
    descricao: "Mapa esquemático da experiência com setores, campo e rotas de circulação.",
    x: 10.8,
    y: 1.85,
    z: 4,
    rotY: -70,
    largura: 2.7,
    altura: 1.75
  });

  [["A", -7, "#16a34a"], ["B", -3.5, "#facc15"], ["C", 3.5, "#2563eb"], ["D", 7, "#dc2626"]].forEach(([titulo, x, cor]) => {
    adicionarBandeira(x, 3.4, 2.5, cor, "#ffffff", 0, `Bandeira ${titulo}`);
  });

  adicionarBotao3D("Dica das placas", -1.9, 1.6, 4.8, 20, () => {
    window.abrirModalTexto?.("Placas de orientação", "As portas amarelas no piso indicam transições. Fora delas, paredes e objetos bloqueiam a passagem.");
  }, 2.5, 0.62, "#164e63");

  adicionarPortaisVisuais("praca");
}

function criarArquibancada() {
  adicionarCeu(configuracaoVisual.arquibancada.ceu);
  adicionarPiso(28, 28, configuracaoVisual.arquibancada.piso);
  adicionarLuzes("#dff3ff");
  window.obterColisoesDoAmbiente("arquibancada")
    .filter((colisor) => colisor.tipo === "parede" && colisor.zMax > -13)
    .forEach((colisor) => adicionarParedeVisual(colisor, configuracaoVisual.arquibancada.parede, 3.3));

  adicionarVistaCampoArquibancada();
  adicionarAssentos("esquerda");
  adicionarAssentos("direita");

  criarElemento("a-box", {
    position: "0 0.08 1.1",
    width: 3.2,
    height: 0.08,
    depth: 12.5,
    material: "color: #737d8c; roughness: 0.78"
  });
  adicionarTexto("Vista para o campo", 0, 0.72, -4.8, 0, 0.25, 4, "#ffffff");

  adicionarPainelImagem({
    src: "assets/img/bandeiras-copa.png",
    titulo: "Bandeiras",
    descricao: "Banners laterais com selecoes, cores e identidades da Copa.",
    x: -8.4,
    y: 2.4,
    z: 9.8,
    rotY: 35,
    largura: 3.4,
    altura: 1.7
  });

  adicionarPainelImagem({
    src: "assets/img/curiosidades-estadios.png",
    titulo: "Curiosidades dos estádios",
    descricao: "Os estadios modernos combinam seguranca, visibilidade, rotas de acesso e tecnologia de transmissao.",
    x: 8.4,
    y: 2.4,
    z: 9.8,
    rotY: -35,
    largura: 3.4,
    altura: 1.7
  });

  for (let i = 0; i < 6; i += 1) {
    const x = -10 + i * 4;
    criarElemento("a-cylinder", {
      position: posicao(x, 4.7, -11.8),
      radius: 0.16,
      height: 3.4,
      material: "color: #cfd8e3; metalness: 0.2"
    });
    criarElemento("a-cone", {
      position: posicao(x, 6.55, -11.2),
      radiusBottom: 0.4,
      radiusTop: 0.12,
      height: 0.8,
      rotation: "65 0 0",
      material: "color: #fff5c2; emissive: #fff0a6; emissiveIntensity: 0.55"
    });
  }

  adicionarBotao3D("Som da torcida", -2.2, 1.65, 3.1, 0, () => window.alternarAudioAmbiente?.("torcida"), 2.2, 0.62, "#7f1d1d");
  adicionarBotao3D("Curiosidade", 2.2, 1.65, 3.1, 0, () => {
    window.abrirModalTexto?.("Arquibancadas", "A organizacao das fileiras e corredores controla fluxo de publico e acesso de emergencia. Na experiencia, as fileiras sao areas bloqueadas.");
  }, 2.2, 0.62, "#1d4ed8");

  adicionarPortaisVisuais("arquibancada");
}

function criarCampo() {
  adicionarCeu(configuracaoVisual.campo.ceu);
  adicionarPiso(32, 36, "#2b3a32");
  adicionarGramadoRealista(29, 34, 0, 0, 1);
  adicionarLuzes("#eef8ff");
  adicionarParedesPorColisao("campo", configuracaoVisual.campo.parede, 1.2);
  adicionarArquibancadasVisiveisDoCampo();
  adicionarLinhasDoCampo();
  adicionarGol(-15.65, 0);
  adicionarGol(15.65, 180);
  adicionarPlacasPublicidade();

  adicionarBolaTriondaCentro();

  adicionarJogadorBrasilCampo();

  criarElemento("a-box", {
    position: "-12.3 0.55 4.2",
    width: 4.2,
    height: 1,
    depth: 1.2,
    material: "color: #0f172a"
  });
  criarElemento("a-box", {
    position: "12.3 0.55 4.2",
    width: 4.2,
    height: 1,
    depth: 1.2,
    material: "color: #0f172a"
  });
  adicionarTexto("Banco de reservas", -12.3, 1.28, 4.2, 0, 0.24, 4, "#ffffff");
  adicionarTexto("Banco de reservas", 12.3, 1.28, 4.2, 0, 0.24, 4, "#ffffff");

  adicionarTelaVideo({
    idVideo: "artilhariaCampo",
    titulo: "Gols das Copas",
    descricao: "Pare um instante no gramado e dê o play: este vídeo reúne gols que viraram memória de Copa. Repare nos lances, nos estádios e na reação da torcida em cada jogada.",
    chamada: "Dê o play e entre no clima dos grandes gols.",
    x: -14.75,
    y: 2.05,
    z: 9.1,
    rotY: 90,
    largura: 3.2,
    altura: 1.8
  });

  adicionarPainelImagem({
    src: "assets/img/campo-tatico.png",
    titulo: "Painel tático",
    descricao: "Exemplo de painel para mostrar esquemas taticos, linhas de defesa e posicionamento.",
    x: -10.8,
    y: 2.1,
    z: -9.2,
    rotY: 34,
    largura: 3.1,
    altura: 1.8
  });

  adicionarTelaVideo({
    idVideo: "regras",
    titulo: "80 fatos da Copa",
    descricao: "Vídeo com fatos surpreendentes sobre Copas do Mundo.",
    poster: "assets/posters/poster-abertura.jpg",
    x: 12.9,
    y: 2.1,
    z: -9.1,
    rotY: -55,
    largura: 3.6,
    altura: 2
  });

  adicionarBotao3D("Quiz de regras", 0, 1.55, 5.4, 180, () => window.iniciarQuiz?.("campo"), 2.2, 0.62, "#166534");

  adicionarPortaisVisuais("campo");
}

function criarTunel() {
  adicionarCeu(configuracaoVisual.tunel.ceu);
  adicionarPiso(8, 24, configuracaoVisual.tunel.piso);
  adicionarLuzes("#c4d7ff");
  adicionarParedesPorColisao("tunel", configuracaoVisual.tunel.parede, 3.5);

  criarElemento("a-box", {
    position: "0 3.55 0",
    width: 8,
    height: 0.35,
    depth: 24,
    material: "color: #0a0f19"
  });

  for (let i = 0; i < 9; i += 1) {
    const z = -9.5 + i * 2.4;
    criarElemento("a-box", {
      position: posicao(0, 3.28, z),
      width: 5.3,
      height: 0.08,
      depth: 0.28,
      material: "color: #38bdf8; emissive: #38bdf8; emissiveIntensity: 0.65"
    });
  }

  for (let i = 0; i < 5; i += 1) {
    criarElemento("a-plane", {
      position: posicao(0, 0.45 + i * 0.22, -4 + i * 1.8),
      rotation: "-90 0 0",
      width: 6.6,
      height: 1.2,
      material: "color: #cbd5e1; opacity: 0.09; transparent: true; side: double"
    });
  }

  adicionarTexto("Respire. Escute a torcida. Entre no jogo.", 0, 2.1, -2.6, 0, 0.34, 6.2, "#ffffff");
  adicionarTexto("O tunel tem colisao nas laterais e passagem apenas pelas extremidades.", 0, 1.25, 2.6, 0, 0.22, 6.2, "#93c5fd");

  adicionarTelaVideo({
    idVideo: "tunel",
    titulo: "Curiosidades malucas",
    descricao: "Vídeo com curiosidades incomuns das Copas do Mundo.",
    poster: "assets/posters/poster-tunel.jpg",
    x: -3.22,
    y: 1.9,
    z: -3.4,
    rotY: 90,
    largura: 3.3,
    altura: 1.9
  });

  adicionarPainelImagem({
    src: "assets/img/frases-copa.svg",
    titulo: "Frases da Copa",
    descricao: "Arte em SVG com chamada motivacional para o túnel dos jogadores.",
    x: 3.22,
    y: 1.9,
    z: 3.4,
    rotY: -90,
    largura: 3.1,
    altura: 1.7
  });

  adicionarBotao3D("Entrar em campo", 0, 1.45, 7.4, 180, () => window.trocarAmbiente?.("campo", { x: 0, y: 1.6, z: -14.2, rotY: 180 }), 2.6, 0.62, "#166534");
  adicionarBotao3D("Curiosidade", 0, 1.45, -7.4, 0, () => {
    window.abrirModalTexto?.("Túnel dos jogadores", "O tunel concentra som, luz e expectativa antes da entrada. Aqui ele funciona como corredor de transicao entre campo e museu.");
  }, 2.4, 0.62, "#334155");

  adicionarPortaisVisuais("tunel");
}

function criarMuseu() {
  adicionarCeu(configuracaoVisual.museu.ceu);
  adicionarPiso(32, 28, configuracaoVisual.museu.piso);
  adicionarLuzes("#fff8e8");
  adicionarParedesPorColisao("museu", configuracaoVisual.museu.parede, 3.4);

  adicionarTexto("Museu do Futebol", 0, 3.1, -12.5, 0, 0.45, 6, "#111827");

  const vitrines = [
    { x: -9.1, z: -3.8, titulo: "1930" },
    { x: 9.1, z: -3.8, titulo: "1970" },
    { x: -9.1, z: 4.9, titulo: "1994" },
    { x: 9.1, z: 4.9, titulo: "2002" }
  ];

  vitrines.forEach((vitrine) => {
    criarElemento("a-box", {
      position: posicao(vitrine.x, 0.9, vitrine.z),
      width: 3.3,
      height: 1.8,
      depth: 3.3,
      material: "color: #c7eaff; opacity: 0.32; transparent: true; roughness: 0.08; metalness: 0.05"
    });
    adicionarTexto(`Vitrine ${vitrine.titulo}`, vitrine.x, 1.95, vitrine.z, 0, 0.26, 3, "#ffffff");
  });

  adicionarPainelImagem({
    src: "assets/img/historia-copas.jpg",
    titulo: "História das Copas",
    descricao: "Painel histórico com foto do Estádio Centenário e linha de evolução do torneio.",
    x: 0,
    y: 2.05,
    z: -7.35,
    rotY: 0,
    largura: 4.2,
    altura: 2.2
  });

  adicionarTelaVideo({
    idVideo: "museu",
    titulo: "História em 18 min",
    descricao: "Vídeo com uma síntese da história de todas as Copas.",
    poster: "assets/posters/poster-abertura.jpg",
    x: 0,
    y: 2.1,
    z: 7.3,
    rotY: 180,
    largura: 4.1,
    altura: 2.25
  });

  [
    ["assets/img/copa-1930.jpg", "Copa de 1930", -12.4, -9.8, 35],
    ["assets/img/copa-1970.jpg", "Copa de 1970", 12.4, -9.8, -35],
    ["assets/img/copa-1994.jpg", "Copa de 1994", -12.4, 9.2, -35],
    ["assets/img/copa-2002.jpg", "Copa de 2002", 12.4, 9.2, 35]
  ].forEach(([src, titulo, x, z, rotY]) => {
    adicionarPainelImagem({
      src,
      titulo,
      descricao: "Imagem histórica com foto real, sede, campeão e fatos da edição.",
      x,
      y: 2.15,
      z,
      rotY,
      largura: 2.6,
      altura: 1.65
    });
  });

  adicionarPainelImagem({
    src: "assets/img/linha-tempo-copas.svg",
    titulo: "Linha do tempo",
    descricao: "Use a porta ao fundo do museu para entrar no corredor da linha do tempo.",
    x: -5.2,
    y: 2.15,
    z: -12.6,
    rotY: 0,
    largura: 3,
    altura: 1.65
  });

  [
    ["copa1930", "Copa de 1930", -11.4],
    ["copa1950", "Copa de 1950", -3.8],
    ["origem2018", "Origem até 2018", 3.8],
    ["historiaEducativo", "História educativa", 11.4]
  ].forEach(([idVideo, titulo, x]) => {
    adicionarTelaVideo({
      idVideo,
      titulo,
      descricao: "Vídeo complementar da videoteca histórica do museu.",
      x,
      y: 2.35,
      z: 12.55,
      rotY: 180,
      largura: 2.55,
      altura: 1.43
    });
  });

  adicionarBotao3D("Som do museu", 5.3, 1.55, 0, -90, () => window.alternarAudioAmbiente?.("museu"), 2.2, 0.62, "#334155");
  adicionarBotao3D("Painel de estatísticas", -5.3, 1.55, 0, 90, () => {
    window.abrirModalTexto?.("Estatísticas", "Este painel pode ser alimentado com ranking, artilharia, sedes e recordes. Edite os textos em data/conteudos.json.");
  }, 2.6, 0.62, "#7c2d12");

  criarElemento("a-box", {
    position: "14.82 2.18 0",
    rotation: "0 -90 0",
    width: 3.1,
    height: 0.72,
    depth: 0.08,
    material: "color: #05070d; roughness: 0.4; metalness: 0.2"
  });
  criarElemento("a-box", {
    position: "14.78 2.55 0",
    rotation: "0 -90 0",
    width: 3.22,
    height: 0.07,
    depth: 0.06,
    material: "color: #ffd45a; emissive: #6d4d05; emissiveIntensity: 0.22"
  });
  adicionarTexto("Sala de Cinema", 14.72, 2.22, 0, -90, 0.24, 3.4, "#ffd45a", "center", { fonte: fontes3D.titulo });
  adicionarTexto("Sessão especial da história das Copas", 14.72, 1.95, 0, -90, 0.15, 3.6, "#ffffff");

  adicionarPortaisVisuais("museu");
}

function criarLinhaTempo() {
  adicionarCeu(configuracaoVisual.linhaTempo.ceu);
  adicionarPiso(10, 32, configuracaoVisual.linhaTempo.piso);
  adicionarLuzes("#f8fbff");
  adicionarParedesPorColisao("linhaTempo", configuracaoVisual.linhaTempo.parede, 3.2);

  const paineis = [
    { periodo: "1930-1950", img: "assets/img/linha-1930-1950.jpg", z: 9.2, lado: -1 },
    { periodo: "1960-1980", img: "assets/img/linha-1960-1980.jpg", z: 4.0, lado: 1 },
    { periodo: "1990-2010", img: "assets/img/linha-1990-2010.jpg", z: -1.2, lado: -1 },
    { periodo: "2014-2022", img: "assets/img/linha-2014-2022.jpg", z: -6.4, lado: 1 },
    { periodo: "Futuro das Copas", img: "assets/img/linha-tempo-copas.svg", z: -9.7, lado: -1 }
  ];

  paineis.forEach((painel) => {
    const x = painel.lado < 0 ? -4.18 : 4.18;
    const rotY = painel.lado < 0 ? 90 : -90;
    adicionarPainelImagem({
      src: painel.img,
      titulo: painel.periodo,
      descricao: `Painel da linha do tempo: ${painel.periodo}.`,
      x,
      y: 2.05,
      z: painel.z,
      rotY,
      largura: 3.6,
      altura: 2
    });
  });

  adicionarTelaVideo({
    idVideo: "bolasCopa",
    titulo: "Bolas da Copa",
    descricao: "Faça uma pausa neste ponto da linha do tempo e dê o play: as bolas também contam a história das Copas. Observe como design, tecnologia, transmissão de TV e identidade visual mudaram junto com o torneio.",
    chamada: "Dê o play e repare como cada bola ajuda a contar sua década.",
    x: 4.18,
    y: 2.05,
    z: 12.3,
    rotY: -90,
    largura: 3.35,
    altura: 1.88
  });

  adicionarTelaVideo({
    idVideo: "linhaTempo",
    titulo: "Copas 1930-2022",
    descricao: "Vídeo questionando e contextualizando todas as Copas de 1930 a 2022.",
    poster: "assets/posters/poster-abertura.jpg",
    x: 0,
    y: 2.15,
    z: -14.8,
    rotY: 0,
    largura: 4.2,
    altura: 2.35
  });

  adicionarTelaVideo({
    idVideo: "historiaAtualizada",
    titulo: "História atualizada",
    descricao: "Vídeo com uma visão atualizada da história da Copa do Mundo.",
    x: -4.18,
    y: 1.55,
    z: -13.4,
    rotY: 90,
    largura: 2.4,
    altura: 1.35
  });

  adicionarTelaVideo({
    idVideo: "copa2018",
    titulo: "Copa de 2018",
    descricao: "Vídeo sobre a história completa da Copa do Mundo de 2018.",
    x: 4.18,
    y: 1.55,
    z: -13.4,
    rotY: -90,
    largura: 2.4,
    altura: 1.35
  });

  adicionarTexto("Corredor da Linha do Tempo", 0, 3.1, 13.6, 180, 0.35, 5.5, "#ffffff");
  adicionarPortaisVisuais("linhaTempo");
}

function criarCampeoes() {
  adicionarCeu(configuracaoVisual.campeoes.ceu);
  adicionarPiso(16, 16, configuracaoVisual.campeoes.piso);
  adicionarLuzes("#fff2ce");
  adicionarParedesPorColisao("campeoes", configuracaoVisual.campeoes.parede, 3.2);

  criarElemento("a-cylinder", {
    position: "0 0.6 0",
    radius: 1.45,
    height: 1.2,
    material: "color: #1f2937; roughness: 0.38"
  });
  adicionarTexto("Ranking", 0, 1.35, 0, 0, 0.3, 3, "#ffd45a");

  const paises = [
    { nome: "Brasil", titulos: 5, img: "assets/img/campeoes/brasil.png", cor: "#16a34a", x: -5.8, z: -4.8, rotY: 35 },
    { nome: "Alemanha", titulos: 4, img: "assets/img/campeoes/alemanha.png", cor: "#111827", x: -2.0, z: -5.8, rotY: 12 },
    { nome: "Argentina", titulos: 3, img: "assets/img/campeoes/argentina.png", cor: "#38bdf8", x: 2.0, z: -5.8, rotY: -12 },
    { nome: "França", titulos: 2, img: "assets/img/campeoes/franca.png", cor: "#2563eb", x: 5.8, z: -4.8, rotY: -35 },
    { nome: "Itália", titulos: 4, img: "assets/img/campeoes/italia.png", cor: "#22c55e", x: -5.8, z: 1.8, rotY: 90 },
    { nome: "Uruguai", titulos: 2, img: "assets/img/campeoes/uruguai.png", cor: "#60a5fa", x: 5.8, z: 1.8, rotY: -90 },
    { nome: "Espanha", titulos: 1, img: "assets/img/campeoes/espanha.png", cor: "#dc2626", x: -2.4, z: 4.7, rotY: 180 },
    { nome: "Inglaterra", titulos: 1, img: "assets/img/campeoes/inglaterra.png", cor: "#f8fafc", x: 2.4, z: 4.7, rotY: 180 }
  ];

  paises.forEach((pais) => {
    const painel = adicionarPainelImagem({
      src: pais.img,
      titulo: pais.nome,
      descricao: `${pais.nome} tem ${pais.titulos} título(s) mundial(is) no ranking histórico da experiência.`,
      x: pais.x,
      y: 2.05,
      z: pais.z,
      rotY: pais.rotY,
      largura: 1.7,
      altura: 1.15,
      moldura: pais.cor
    });
    painel.addEventListener("click", () => {
      window.abrirModalTexto?.(pais.nome, `${pais.nome}: ${pais.titulos} título(s) mundial(is). Dados consolidados até a Copa de 2022.`);
      window.alternarAudioAmbiente?.("clique");
    });
  });

  adicionarTelaVideo({
    idVideo: "rankingCampeoes",
    titulo: "Maiores campeões",
    descricao: "Entre no clima da sala dos campeões e dê o play para comparar conquistas, rankings e seleções que marcaram a história da Copa do Mundo.",
    chamada: "Dê o play e veja como cada título muda o peso desta galeria.",
    x: -6.75,
    y: 2.05,
    z: -0.8,
    rotY: 90,
    largura: 2.65,
    altura: 1.5
  });

  adicionarTelaVideo({
    idVideo: "campeoes",
    titulo: "Seleção Brasileira",
    descricao: "Vídeo com histórias marcantes e absurdas da Seleção Brasileira.",
    poster: "assets/posters/poster-abertura.jpg",
    x: 0,
    y: 2.45,
    z: -7.05,
    rotY: 0,
    largura: 4,
    altura: 2.2
  });

  adicionarPainelImagem({
    src: "assets/img/ranking-campeoes.png",
    titulo: "Ranking de Campeões",
    descricao: "Ranking histórico dos campeões da Copa do Mundo até 2022, com bandeiras e anos de conquista.",
    x: 6.8,
    y: 2.05,
    z: -1.6,
    rotY: -90,
    largura: 2.3,
    altura: 1.5
  });

  adicionarBotao3D("Curiosidade", -6.7, 1.45, -1.5, 90, () => {
    window.abrirModalTexto?.("Curiosidade dos campeões", "O ranking combina bandeiras reais, anos de conquista e títulos consolidados até a Copa de 2022.");
  }, 2.1, 0.58, "#92400e");

  adicionarPortaisVisuais("campeoes");
}

function criarCamisas() {
  adicionarCeu(configuracaoVisual.camisas.ceu);
  adicionarPiso(16, 16, configuracaoVisual.camisas.piso);
  adicionarLuzes("#f8fbff");
  adicionarParedesPorColisao("camisas", configuracaoVisual.camisas.parede, 3.2);

  adicionarTexto("Galeria de Camisas", 0, 3.2, -6.95, 0, 0.4, 6.4, "#111827", "center", { fonte: fontes3D.titulo });

  adicionarTelaVideo({
    idVideo: "camisas2022",
    titulo: "Camisas da Copa 2022",
    descricao: "Aqui, cada uniforme conta uma história dentro e fora de campo.\n\nDê o play e viaje pelos mantos que marcaram a Copa do Mundo de 2022.",
    chamada: "Cada uniforme carrega cultura, identidade e memória de torcida.",
    x: 0,
    y: 2.15,
    z: -7.05,
    rotY: 0,
    largura: 5.35,
    altura: 3
  });

  [
    { x: -5.6, cor: "#16a34a", nome: "Verde" },
    { x: -4.7, cor: "#facc15", nome: "Amarelo" },
    { x: -3.8, cor: "#2563eb", nome: "Azul" },
    { x: 3.8, cor: "#dc2626", nome: "Vermelho" },
    { x: 4.7, cor: "#f8fafc", nome: "Branco" },
    { x: 5.6, cor: "#111827", nome: "Preto" }
  ].forEach((amostra, indice) => {
    criarElemento("a-box", {
      position: posicao(amostra.x, 1.28, -2.2 + (indice % 2) * 0.34),
      width: 0.54,
      height: 1.9,
      depth: 0.18,
      material: `color: ${amostra.cor}; roughness: 0.5; metalness: 0.04`
    });
    adicionarTexto(amostra.nome, amostra.x, 2.38, -2.2 + (indice % 2) * 0.34, 0, 0.14, 1.5, "#ffffff");
  });

  criarElemento("a-box", {
    position: "-5.75 1 -0.2",
    width: 1.45,
    height: 2,
    depth: 5.4,
    material: "color: #c7eaff; opacity: 0.16; transparent: true"
  });
  criarElemento("a-box", {
    position: "5.75 1 -0.2",
    width: 1.45,
    height: 2,
    depth: 5.4,
    material: "color: #c7eaff; opacity: 0.16; transparent: true"
  });

  adicionarBotao3D("Assistir vídeo", 0, 1.35, 4.0, 180, () => window.tocarVideo?.("camisas2022", "Camisas da Copa 2022", "Aqui, cada uniforme conta uma história dentro e fora de campo."), 2.6, 0.62, "#1d4ed8");

  adicionarPortaisVisuais("camisas");
}

function criarMascotes() {
  adicionarCeu(configuracaoVisual.mascotes.ceu);
  adicionarPiso(16, 16, configuracaoVisual.mascotes.piso);
  adicionarLuzes("#f9fdff");
  adicionarParedesPorColisao("mascotes", configuracaoVisual.mascotes.parede, 3.2);

  const mascotes = [
    { titulo: "Cultura", x: -4.8, z: -0.8, cor: "#f97316", detalhe: "#fde68a" },
    { titulo: "Alegria", x: 0, z: -3.15, cor: "#22c55e", detalhe: "#dbeafe" },
    { titulo: "Torcida", x: 4.8, z: -0.8, cor: "#38bdf8", detalhe: "#fecdd3" }
  ];

  mascotes.forEach((mascote, indice) => {
    const grupo = criarElemento("a-entity", {
      position: posicao(mascote.x, 0, mascote.z),
      class: "clicavel"
    });
    grupo.setAttribute("animation", `property: position; dir: alternate; dur: ${2200 + indice * 300}; to: ${mascote.x} 0.18 ${mascote.z}; loop: true; easing: easeInOutSine`);

    criarElemento("a-cylinder", {
      position: "0 0.55 0",
      radius: 0.82,
      height: 1.1,
      material: `color: ${mascote.cor}`
    }, grupo);
    criarElemento("a-sphere", {
      position: "0 1.35 0",
      radius: 0.62,
      material: "color: #fef3c7"
    }, grupo);
    criarElemento("a-cone", {
      position: "0 1.95 0",
      radiusBottom: 0.34,
      radiusTop: 0.08,
      height: 0.62,
      material: `color: ${mascote.detalhe}; roughness: 0.5`
    }, grupo);
    criarElemento("a-torus", {
      position: "0 1.38 0.44",
      rotation: "90 0 0",
      radius: 0.26,
      radiusTubular: 0.025,
      arc: 320,
      material: "color: #111827; roughness: 0.55"
    }, grupo);
    criarElemento("a-sphere", {
      position: "-0.18 1.45 0.54",
      radius: 0.045,
      material: "color: #111827"
    }, grupo);
    criarElemento("a-sphere", {
      position: "0.18 1.45 0.54",
      radius: 0.045,
      material: "color: #111827"
    }, grupo);

    grupo.addEventListener("click", () => {
      window.abrirModalTexto?.(mascote.titulo, "Os mascotes são a face mais divertida de cada edição da Copa. Eles aproximam o torneio da cultura local e do público mais jovem.");
      window.tocarClique?.();
    });

    adicionarTexto(mascote.titulo, mascote.x, 2.3, mascote.z, 0, 0.22, 3, "#ffffff");
  });

  adicionarTelaVideo({
    idVideo: "mascotesCopas",
    titulo: "Mascotes das Copas",
    descricao: "Os mascotes são a face mais divertida de cada edição da Copa.\n\nAssista e descubra como cada país transformou cultura em personagem.",
    chamada: "Personagens, cores e cultura entram em campo nesta instalação.",
    x: 0,
    y: 2.1,
    z: -7.05,
    rotY: 0,
    largura: 4.8,
    altura: 2.7
  });

  adicionarBotao3D("Quiz das mascotes", -2.0, 1.45, 4.2, 180, () => window.iniciarQuiz?.("mascotes"), 2.45, 0.62, "#be123c");
  adicionarBotao3D("Assistir vídeo", 2.0, 1.45, 4.2, 180, () => window.tocarVideo?.("mascotesCopas", "Mascotes das Copas", "Assista e descubra como cada país transformou cultura em personagem."), 2.25, 0.62, "#0f766e");

  adicionarPortaisVisuais("mascotes");
}

function criarTaca() {
  adicionarCeu(configuracaoVisual.taca.ceu);
  adicionarPiso(18, 18, configuracaoVisual.taca.piso);
  adicionarLuzes("#ffe9a8");
  adicionarParedesPorColisao("taca", configuracaoVisual.taca.parede, 3.4);

  for (let i = 0; i < 38; i += 1) {
    const angulo = (i / 38) * Math.PI * 2;
    const raio = 2.4 + (i % 5) * 0.33;
    criarElemento("a-sphere", {
      position: posicao(Math.cos(angulo) * raio, 1.1 + (i % 7) * 0.35, Math.sin(angulo) * raio),
      radius: 0.035 + (i % 3) * 0.012,
      material: "color: #ffd45a; emissive: #ffd45a; emissiveIntensity: 0.5"
    }).setAttribute("animation", `property: position; dir: alternate; dur: ${1600 + i * 38}; to: ${Math.cos(angulo) * (raio + 0.28)} ${1.35 + (i % 7) * 0.35} ${Math.sin(angulo) * (raio + 0.28)}; loop: true`);
  }

  criarElemento("a-cylinder", {
    position: "0 0.45 0",
    radius: 1.35,
    height: 0.9,
    material: "color: #111827; metalness: 0.2; roughness: 0.36"
  });

  adicionarTacaSketchfabCentro();

  adicionarPainelImagem({
    src: "assets/img/taca-copa.png",
    titulo: "Imagem da taça",
    descricao: "Imagem histórica de uma réplica do Troféu Jules Rimet em exposição.",
    x: -7.8,
    y: 2.1,
    z: -2.2,
    rotY: 90,
    largura: 2.5,
    altura: 2.5
  });

  adicionarPainelImagem({
    src: "assets/img/taca-fifa-dourada.jpg",
    titulo: "Taça FIFA",
    descricao: "Imagem dourada da taça atual da Copa do Mundo em painel oposto ao troféu histórico.",
    x: 7.8,
    y: 2.1,
    z: 2.2,
    rotY: -90,
    largura: 2.5,
    altura: 2.5
  });

  adicionarTelaVideo({
    idVideo: "taca",
    titulo: "História das Copas",
    descricao: "Mais do que um troféu, esta taça representa o sonho máximo do futebol.\n\nO vídeo apresenta um panorama histórico da competição em português e ajuda a conectar conquista, símbolo e legado.",
    chamada: "Antes de chegar aos campeões, a taça atravessa décadas de história.",
    x: 7.8,
    y: 2.2,
    z: -2.2,
    rotY: -90,
    largura: 3.2,
    altura: 1.8
  });

  adicionarBotao3D("Quiz final", 0, 1.45, -6.6, 0, () => window.trocarAmbiente?.("quizFinal"), 2.2, 0.62, "#92400e");
  adicionarBotao3D("Som especial", 0, 1.45, 5.2, 180, () => window.alternarAudioAmbiente?.("taca"), 2.2, 0.62, "#713f12");

  adicionarPortaisVisuais("taca");
}

function adicionarPoltronasCinema() {
  const cores = ["#7f1d1d", "#991b1b", "#111827"];

  for (let fileira = 0; fileira < 4; fileira += 1) {
    const z = 4.3 - fileira * 1.35;
    const y = 0.52 + fileira * 0.08;

    [-1, 1].forEach((lado) => {
      for (let coluna = 0; coluna < 5; coluna += 1) {
        const x = lado * (1.75 + coluna * 0.92);
        const cor = cores[(fileira + coluna) % cores.length];

        criarElemento("a-box", {
          position: posicao(x, y, z),
          width: 0.62,
          height: 0.28,
          depth: 0.62,
          material: `color: ${cor}; roughness: 0.66`
        });
        criarElemento("a-box", {
          position: posicao(x, y + 0.42, z + 0.28),
          width: 0.62,
          height: 0.74,
          depth: 0.16,
          material: `color: ${cor}; roughness: 0.7`
        });
        criarElemento("a-box", {
          position: posicao(x - lado * 0.37, y + 0.22, z),
          width: 0.08,
          height: 0.42,
          depth: 0.56,
          material: "color: #05070d; roughness: 0.5"
        });
      }
    });

    criarElemento("a-box", {
      position: posicao(0, 0.06, z + 0.02),
      width: 1.32,
      height: 0.08,
      depth: 0.9,
      material: "color: #1f2937; roughness: 0.76"
    });
  }
}

function adicionarBalizamentoCinema() {
  for (let i = 0; i < 8; i += 1) {
    const z = 7.1 - i * 1.2;
    [-0.82, 0.82, -7.65, 7.65].forEach((x, indice) => {
      criarElemento("a-box", {
        position: posicao(x, 0.12, z),
        width: indice < 2 ? 0.16 : 0.12,
        height: 0.1,
        depth: 0.34,
        material: "color: #ffd45a; emissive: #ffd45a; emissiveIntensity: 0.48; roughness: 0.4"
      });
    });
  }
}

function criarCinema() {
  adicionarCeu(configuracaoVisual.cinema.ceu);
  adicionarPiso(18, 20, configuracaoVisual.cinema.piso);
  criarElemento("a-entity", {
    light: "type: ambient; color: #7d8eaa; intensity: 0.34"
  });
  criarElemento("a-entity", {
    position: "0 4.4 -6.8",
    light: "type: point; color: #dbeafe; intensity: 1.65; distance: 15"
  });
  criarElemento("a-entity", {
    position: "0 3.4 5.2",
    light: "type: spot; color: #dbeafe; intensity: 0.78; angle: 38; penumbra: 0.62; target: #telaCinema"
  });
  adicionarParedesPorColisao("cinema", configuracaoVisual.cinema.parede, 3.6);

  criarElemento("a-box", {
    position: "0 3.65 0",
    width: 18,
    height: 0.28,
    depth: 20,
    material: "color: #030712; roughness: 0.8"
  });

  for (let i = 0; i < 6; i += 1) {
    const z = -6.8 + i * 2.25;
    criarElemento("a-box", {
      position: posicao(-8.05, 1.95, z),
      width: 0.12,
      height: 2.3,
      depth: 1.35,
      material: "color: #263044; roughness: 0.9"
    });
    criarElemento("a-box", {
      position: posicao(8.05, 1.95, z),
      width: 0.12,
      height: 2.3,
      depth: 1.35,
      material: "color: #263044; roughness: 0.9"
    });
  }

  criarElemento("a-plane", {
    position: "0 2.35 -9.04",
    rotation: "0 0 0",
    width: 8.1,
    height: 4.58,
    material: "color: #e0f2fe; opacity: 0.08; transparent: true; side: double"
  });

  adicionarTelaVideo({
    idVideo: "cinema",
    titulo: "História das Copas",
    descricao: "Sente-se e reviva momentos que ajudaram a construir a história da Copa do Mundo.\n\nEste documentário em português funciona como uma sessão especial dentro da visita.",
    chamada: "Sessão principal: uma viagem pela história da Copa.",
    x: 0,
    y: 2.35,
    z: -8.95,
    rotY: 0,
    largura: 8.0,
    altura: 4.5
  }).id = "telaCinema";

  criarElemento("a-box", {
    position: "0 2.95 5.4",
    width: 1.2,
    height: 0.34,
    depth: 0.48,
    material: "color: #05070d; roughness: 0.42; metalness: 0.18"
  });
  criarElemento("a-cone", {
    position: "0 2.72 3.25",
    rotation: "90 0 0",
    radiusBottom: 3.9,
    radiusTop: 0.24,
    height: 4.2,
    material: "color: #dbeafe; opacity: 0.09; transparent: true; side: double"
  });

  adicionarPoltronasCinema();
  adicionarBalizamentoCinema();

  adicionarTexto("Sala de Cinema", 0, 3.15, 8.85, 180, 0.42, 6, "#ffd45a", "center", { fonte: fontes3D.titulo });
  adicionarTexto("Sente-se e reviva momentos que ajudaram a construir a história da Copa do Mundo.", 0, 2.48, 8.82, 180, 0.22, 6.4, "#ffffff");

  adicionarBotao3D("Iniciar sessão", 0, 1.38, 6.7, 180, () => window.tocarVideo?.("cinema", "História das Copas", "Sente-se e reviva momentos que ajudaram a construir a história da Copa do Mundo."), 2.5, 0.62, "#7f1d1d");
  adicionarPortaisVisuais("cinema");
}

function criarQuizFinal() {
  adicionarCeu(configuracaoVisual.quizFinal.ceu);
  adicionarPiso(16, 16, configuracaoVisual.quizFinal.piso);
  adicionarLuzes("#e8f2ff");
  adicionarParedesPorColisao("quizFinal", configuracaoVisual.quizFinal.parede, 3.2);

  criarElemento("a-box", {
    position: "0 2.2 -6.15",
    width: 7.8,
    height: 3.2,
    depth: 0.32,
    material: "color: #0f172a; roughness: 0.4"
  });
  adicionarTexto("Quiz Final", 0, 3.1, -5.96, 0, 0.52, 6, "#ffd45a");
  adicionarTexto("Abra o painel Quiz no canto esquerdo e responda perguntas sobre a experiência.", 0, 2.25, -5.94, 0, 0.28, 6, "#ffffff");

  adicionarBotao3D("Iniciar quiz", -1.45, 1.28, -5.86, 0, () => window.iniciarQuiz?.("todos"), 2.3, 0.62, "#166534");
  adicionarBotao3D("Reiniciar", 1.45, 1.28, -5.86, 0, () => window.reiniciarQuiz?.(), 2.0, 0.62, "#7f1d1d");

  criarElemento("a-cylinder", {
    position: "-5.5 0.55 -2.2",
    radius: 0.72,
    height: 1.1,
    material: "color: #334155"
  });
  adicionarTexto("Pontuação", -5.5, 1.45, -2.2, 35, 0.24, 2.4, "#ffffff");

  criarElemento("a-cylinder", {
    position: "5.5 0.55 -2.2",
    radius: 0.72,
    height: 1.1,
    material: "color: #334155"
  });
  adicionarTexto("Feedback", 5.5, 1.45, -2.2, -35, 0.24, 2.4, "#ffffff");

  adicionarPortaisVisuais("quizFinal");
}

function criarAmbiente(nomeAmbiente) {
  limparAmbiente();
  iniciarLayoutSeguro(nomeAmbiente);

  const criadores = {
    praca: criarPraca,
    arquibancada: criarArquibancada,
    campo: criarCampo,
    tunel: criarTunel,
    museu: criarMuseu,
    linhaTempo: criarLinhaTempo,
    campeoes: criarCampeoes,
    camisas: criarCamisas,
    mascotes: criarMascotes,
    taca: criarTaca,
    cinema: criarCinema,
    quizFinal: criarQuizFinal
  };

  const criar = criadores[nomeAmbiente] || criadores.praca;
  criar();
  adicionarPlacasCuratoriais(nomeAmbiente);

  if (window.estadoExperiencia?.debugColisoes) {
    window.criarDebugColisores?.(nomeAmbiente, obterMundo());
  }
}

window.criarAmbiente = criarAmbiente;
window.limparAmbiente = limparAmbiente;
window.adicionarPainelImagem = adicionarPainelImagem;
window.adicionarTelaVideo = adicionarTelaVideo;
window.adicionarPlacaCuriosidade = adicionarPlacaCuriosidade;
window.materialTextura = materialTextura;
