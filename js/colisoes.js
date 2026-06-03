/*
  Sistema simples de colisao.
  Para adicionar uma parede ou objeto solido, inclua um retangulo em `colisoes`.
  Para criar uma passagem, inclua uma area em `portas`; o movimento troca de ambiente
  quando a camera entra nesse retangulo.
*/

const nomesAmbientes = {
  praca: "Praça externa",
  arquibancada: "Arquibancada",
  campo: "Campo",
  tunel: "Túnel dos jogadores",
  museu: "Museu do Futebol",
  linhaTempo: "Linha do Tempo",
  campeoes: "Sala dos Campeões",
  camisas: "Galeria de Camisas",
  mascotes: "Sala das Mascotes",
  taca: "Sala da Taça",
  quizFinal: "Sala de Quiz Final"
};

const limitesAmbientes = {
  praca: { xMin: -14, xMax: 14, zMin: -14, zMax: 14 },
  arquibancada: { xMin: -14, xMax: 14, zMin: -14, zMax: 14 },
  campo: { xMin: -16, xMax: 16, zMin: -18, zMax: 18 },
  tunel: { xMin: -4, xMax: 4, zMin: -12, zMax: 12 },
  museu: { xMin: -16, xMax: 16, zMin: -14, zMax: 14 },
  linhaTempo: { xMin: -5, xMax: 5, zMin: -16, zMax: 16 },
  campeoes: { xMin: -8, xMax: 8, zMin: -8, zMax: 8 },
  camisas: { xMin: -8, xMax: 8, zMin: -8, zMax: 8 },
  mascotes: { xMin: -8, xMax: 8, zMin: -8, zMax: 8 },
  taca: { xMin: -9, xMax: 9, zMin: -9, zMax: 9 },
  quizFinal: { xMin: -8, xMax: 8, zMin: -8, zMax: 8 }
};

const posicoesSeguras = {
  praca: { x: 0, y: 1.6, z: 8, rotY: 0 },
  arquibancada: { x: 0, y: 1.6, z: 8.5, rotY: 0 },
  campo: { x: 0, y: 1.6, z: 10, rotY: 0 },
  tunel: { x: 0, y: 1.6, z: 7, rotY: 0 },
  museu: { x: 0, y: 1.6, z: 8, rotY: 0 },
  linhaTempo: { x: 0, y: 1.6, z: 11.5, rotY: 0 },
  campeoes: { x: 0, y: 1.6, z: 4.8, rotY: 0 },
  camisas: { x: 0, y: 1.6, z: 4.8, rotY: 0 },
  mascotes: { x: 0, y: 1.6, z: 4.8, rotY: 0 },
  taca: { x: 0, y: 1.6, z: 5.8, rotY: 0 },
  quizFinal: { x: 0, y: 1.6, z: 4.8, rotY: 0 }
};

const colisoes = [
  // Praça externa: fachada com vao central, bilheteria, telao e paineis.
  { ambiente: "praca", tipo: "parede", xMin: -14, xMax: -2.3, zMin: -12, zMax: -11.2 },
  { ambiente: "praca", tipo: "parede", xMin: 2.3, xMax: 14, zMin: -12, zMax: -11.2 },
  { ambiente: "praca", tipo: "parede", xMin: -14, xMax: -13.2, zMin: -14, zMax: 14 },
  { ambiente: "praca", tipo: "parede", xMin: 13.2, xMax: 14, zMin: -14, zMax: -1.8 },
  { ambiente: "praca", tipo: "parede", xMin: 13.2, xMax: 14, zMin: 1.8, zMax: 14 },
  { ambiente: "praca", tipo: "parede", xMin: -14, xMax: 14, zMin: 13.2, zMax: 14 },
  { ambiente: "praca", tipo: "bilheteria", xMin: -12, xMax: -8, zMin: -5.3, zMax: -2.2 },
  { ambiente: "praca", tipo: "telao", xMin: 4.2, xMax: 8.8, zMin: -10.3, zMax: -9.4 },
  { ambiente: "praca", tipo: "painel", xMin: -6.4, xMax: -2.2, zMin: -8.6, zMax: -7.8 },

  // Arquibancada: corredores centrais e laterais bloqueadas por fileiras.
  { ambiente: "arquibancada", tipo: "parede", xMin: -14, xMax: 14, zMin: 13.2, zMax: 14 },
  { ambiente: "arquibancada", tipo: "parede", xMin: -14, xMax: -2.3, zMin: -14, zMax: -13.2 },
  { ambiente: "arquibancada", tipo: "parede", xMin: 2.3, xMax: 14, zMin: -14, zMax: -13.2 },
  { ambiente: "arquibancada", tipo: "parede", xMin: -14, xMax: -13.2, zMin: -14, zMax: 14 },
  { ambiente: "arquibancada", tipo: "parede", xMin: 13.2, xMax: 14, zMin: -14, zMax: 14 },
  { ambiente: "arquibancada", tipo: "arquibancada", xMin: -13, xMax: -4, zMin: -8.5, zMax: 7.8 },
  { ambiente: "arquibancada", tipo: "arquibancada", xMin: 4, xMax: 13, zMin: -8.5, zMax: 7.8 },
  { ambiente: "arquibancada", tipo: "painel-led", xMin: -12.8, xMax: -10.7, zMin: -10.8, zMax: -9.4 },

  // Campo: laterais, gols, bancos e placas publicitarias.
  { ambiente: "campo", tipo: "parede", xMin: -16, xMax: 16, zMin: 17.2, zMax: 18 },
  { ambiente: "campo", tipo: "parede", xMin: -16, xMax: -2.3, zMin: -18, zMax: -17.2 },
  { ambiente: "campo", tipo: "parede", xMin: 2.3, xMax: 16, zMin: -18, zMax: -17.2 },
  { ambiente: "campo", tipo: "parede", xMin: -16, xMax: -15.2, zMin: -18, zMax: 18 },
  { ambiente: "campo", tipo: "parede", xMin: 15.2, xMax: 16, zMin: -18, zMax: 18 },
  { ambiente: "campo", tipo: "gol", xMin: -2.4, xMax: 2.4, zMin: -16.1, zMax: -15.2 },
  { ambiente: "campo", tipo: "gol", xMin: -2.4, xMax: 2.4, zMin: 15.2, zMax: 16.1 },
  { ambiente: "campo", tipo: "banco", xMin: -14.5, xMax: -10.2, zMin: 2.2, zMax: 6.2 },
  { ambiente: "campo", tipo: "banco", xMin: 10.2, xMax: 14.5, zMin: 2.2, zMax: 6.2 },
  { ambiente: "campo", tipo: "painel", xMin: 10.7, xMax: 15, zMin: -9.8, zMax: -8.8 },

  // Tunel: corredor estreito com painéis nas paredes.
  { ambiente: "tunel", tipo: "parede", xMin: -4, xMax: -3.35, zMin: -12, zMax: 12 },
  { ambiente: "tunel", tipo: "parede", xMin: 3.35, xMax: 4, zMin: -12, zMax: 12 },
  { ambiente: "tunel", tipo: "painel", xMin: -3.2, xMax: -2.7, zMin: -5.5, zMax: -1.4 },
  { ambiente: "tunel", tipo: "painel", xMin: 2.7, xMax: 3.2, zMin: 1.4, zMax: 5.5 },

  // Museu: paredes externas com portas e vitrines internas.
  { ambiente: "museu", tipo: "parede", xMin: -16, xMax: -15.2, zMin: -14, zMax: -2.3 },
  { ambiente: "museu", tipo: "parede", xMin: -16, xMax: -15.2, zMin: 2.3, zMax: 7.5 },
  { ambiente: "museu", tipo: "parede", xMin: -16, xMax: -15.2, zMin: 11.5, zMax: 14 },
  { ambiente: "museu", tipo: "parede", xMin: 15.2, xMax: 16, zMin: -14, zMax: 7.5 },
  { ambiente: "museu", tipo: "parede", xMin: 15.2, xMax: 16, zMin: 11.5, zMax: 14 },
  { ambiente: "museu", tipo: "parede", xMin: -16, xMax: -2.3, zMin: -14, zMax: -13.2 },
  { ambiente: "museu", tipo: "parede", xMin: 2.3, xMax: 16, zMin: -14, zMax: -13.2 },
  { ambiente: "museu", tipo: "parede", xMin: -16, xMax: -2.3, zMin: 13.2, zMax: 14 },
  { ambiente: "museu", tipo: "parede", xMin: 2.3, xMax: 16, zMin: 13.2, zMax: 14 },
  { ambiente: "museu", tipo: "vitrine", xMin: -10.8, xMax: -7.4, zMin: -5.5, zMax: -2.1 },
  { ambiente: "museu", tipo: "vitrine", xMin: 7.4, xMax: 10.8, zMin: -5.5, zMax: -2.1 },
  { ambiente: "museu", tipo: "vitrine", xMin: -10.8, xMax: -7.4, zMin: 3.2, zMax: 6.6 },
  { ambiente: "museu", tipo: "vitrine", xMin: 7.4, xMax: 10.8, zMin: 3.2, zMax: 6.6 },
  { ambiente: "museu", tipo: "painel", xMin: -2.1, xMax: 2.1, zMin: -8.4, zMax: -7.5 },

  // Linha do tempo: corredor com paineis laterais.
  { ambiente: "linhaTempo", tipo: "parede", xMin: -5, xMax: -4.3, zMin: -16, zMax: 16 },
  { ambiente: "linhaTempo", tipo: "parede", xMin: 4.3, xMax: 5, zMin: -16, zMax: -4.5 },
  { ambiente: "linhaTempo", tipo: "parede", xMin: 4.3, xMax: 5, zMin: -0.3, zMax: 16 },
  { ambiente: "linhaTempo", tipo: "parede", xMin: -5, xMax: -1.9, zMin: 15.2, zMax: 16 },
  { ambiente: "linhaTempo", tipo: "parede", xMin: 1.9, xMax: 5, zMin: 15.2, zMax: 16 },
  { ambiente: "linhaTempo", tipo: "parede", xMin: -5, xMax: -1.9, zMin: -16, zMax: -15.2 },
  { ambiente: "linhaTempo", tipo: "parede", xMin: 1.9, xMax: 5, zMin: -16, zMax: -15.2 },

  // Salas internas: paredes e objetos centrais.
  { ambiente: "campeoes", tipo: "parede", xMin: -8, xMax: 8, zMin: 7.2, zMax: 8 },
  { ambiente: "campeoes", tipo: "parede", xMin: -8, xMax: 8, zMin: -8, zMax: -7.2 },
  { ambiente: "campeoes", tipo: "parede", xMin: -8, xMax: -7.2, zMin: -8, zMax: 8 },
  { ambiente: "campeoes", tipo: "parede", xMin: 7.2, xMax: 8, zMin: -8, zMax: 8 },
  { ambiente: "campeoes", tipo: "pedestal", xMin: -1.6, xMax: 1.6, zMin: -1.6, zMax: 1.6 },

  { ambiente: "camisas", tipo: "parede", xMin: -8, xMax: -1.8, zMin: 7.2, zMax: 8 },
  { ambiente: "camisas", tipo: "parede", xMin: 1.8, xMax: 8, zMin: 7.2, zMax: 8 },
  { ambiente: "camisas", tipo: "parede", xMin: -8, xMax: 8, zMin: -8, zMax: -7.2 },
  { ambiente: "camisas", tipo: "parede", xMin: -8, xMax: -7.2, zMin: -8, zMax: 8 },
  { ambiente: "camisas", tipo: "parede", xMin: 7.2, xMax: 8, zMin: -8, zMax: 8 },
  { ambiente: "camisas", tipo: "vitrine", xMin: -6.7, xMax: -4.8, zMin: -2.8, zMax: 2.8 },
  { ambiente: "camisas", tipo: "vitrine", xMin: 4.8, xMax: 6.7, zMin: -2.8, zMax: 2.8 },

  { ambiente: "mascotes", tipo: "parede", xMin: -8, xMax: -1.8, zMin: 7.2, zMax: 8 },
  { ambiente: "mascotes", tipo: "parede", xMin: 1.8, xMax: 8, zMin: 7.2, zMax: 8 },
  { ambiente: "mascotes", tipo: "parede", xMin: -8, xMax: 8, zMin: -8, zMax: -7.2 },
  { ambiente: "mascotes", tipo: "parede", xMin: -8, xMax: -7.2, zMin: -8, zMax: 8 },
  { ambiente: "mascotes", tipo: "parede", xMin: 7.2, xMax: 8, zMin: -8, zMax: 8 },
  { ambiente: "mascotes", tipo: "totem", xMin: -5.5, xMax: -3.8, zMin: -1.3, zMax: 1.3 },
  { ambiente: "mascotes", tipo: "totem", xMin: 3.8, xMax: 5.5, zMin: -1.3, zMax: 1.3 },

  { ambiente: "taca", tipo: "parede", xMin: -9, xMax: -1.9, zMin: 8.2, zMax: 9 },
  { ambiente: "taca", tipo: "parede", xMin: 1.9, xMax: 9, zMin: 8.2, zMax: 9 },
  { ambiente: "taca", tipo: "parede", xMin: -9, xMax: 9, zMin: -9, zMax: -8.2 },
  { ambiente: "taca", tipo: "parede", xMin: -9, xMax: -8.2, zMin: -9, zMax: 9 },
  { ambiente: "taca", tipo: "parede", xMin: 8.2, xMax: 9, zMin: -9, zMax: 9 },
  { ambiente: "taca", tipo: "pedestal", xMin: -1.5, xMax: 1.5, zMin: -1.5, zMax: 1.5 },

  { ambiente: "quizFinal", tipo: "parede", xMin: -8, xMax: -1.8, zMin: 7.2, zMax: 8 },
  { ambiente: "quizFinal", tipo: "parede", xMin: 1.8, xMax: 8, zMin: 7.2, zMax: 8 },
  { ambiente: "quizFinal", tipo: "parede", xMin: -8, xMax: 8, zMin: -8, zMax: -7.2 },
  { ambiente: "quizFinal", tipo: "parede", xMin: -8, xMax: -7.2, zMin: -8, zMax: 8 },
  { ambiente: "quizFinal", tipo: "parede", xMin: 7.2, xMax: 8, zMin: -8, zMax: 8 },
  { ambiente: "quizFinal", tipo: "painel", xMin: -4.4, xMax: 4.4, zMin: -6.9, zMax: -6.2 }
];

const portas = [
  { origem: "praca", destino: "arquibancada", xMin: -2.1, xMax: 2.1, zMin: -12.5, zMax: -10.8, novaPosicao: { x: 0, y: 1.6, z: 11, rotY: 0 } },
  { origem: "praca", destino: "museu", xMin: 12.9, xMax: 14.5, zMin: -1.7, zMax: 1.7, novaPosicao: { x: -13.6, y: 1.6, z: 0, rotY: -90 } },
  { origem: "arquibancada", destino: "praca", xMin: -2.1, xMax: 2.1, zMin: 13.0, zMax: 14.5, novaPosicao: { x: 0, y: 1.6, z: -9.7, rotY: 180 } },
  { origem: "arquibancada", destino: "campo", xMin: -2.1, xMax: 2.1, zMin: -14.5, zMax: -13.0, novaPosicao: { x: 0, y: 1.6, z: 15.2, rotY: 0 } },
  { origem: "campo", destino: "arquibancada", xMin: -2.1, xMax: 2.1, zMin: 17.0, zMax: 18.5, novaPosicao: { x: 0, y: 1.6, z: -11.3, rotY: 180 } },
  { origem: "campo", destino: "tunel", xMin: -2.1, xMax: 2.1, zMin: -18.5, zMax: -17.0, novaPosicao: { x: 0, y: 1.6, z: 9.8, rotY: 0 } },
  { origem: "tunel", destino: "campo", xMin: -1.9, xMax: 1.9, zMin: 10.5, zMax: 12.5, novaPosicao: { x: 0, y: 1.6, z: -14.2, rotY: 180 } },
  { origem: "tunel", destino: "museu", xMin: -1.9, xMax: 1.9, zMin: -12.5, zMax: -10.5, novaPosicao: { x: 0, y: 1.6, z: 11.6, rotY: 0 } },
  { origem: "museu", destino: "praca", xMin: -16.5, xMax: -15.0, zMin: -2.1, zMax: 2.1, novaPosicao: { x: 12.2, y: 1.6, z: 0, rotY: 90 } },
  { origem: "museu", destino: "tunel", xMin: -2.1, xMax: 2.1, zMin: 13.0, zMax: 14.5, novaPosicao: { x: 0, y: 1.6, z: -9.6, rotY: 180 } },
  { origem: "museu", destino: "linhaTempo", xMin: -2.1, xMax: 2.1, zMin: -14.5, zMax: -13.0, novaPosicao: { x: 0, y: 1.6, z: 13.4, rotY: 0 } },
  { origem: "museu", destino: "campeoes", xMin: -16.5, xMax: -15.0, zMin: -11.4, zMax: -7.6, novaPosicao: { x: 0, y: 1.6, z: 5.5, rotY: 0 } },
  { origem: "museu", destino: "camisas", xMin: 15.0, xMax: 16.5, zMin: -11.4, zMax: -7.6, novaPosicao: { x: 0, y: 1.6, z: 5.5, rotY: 0 } },
  { origem: "museu", destino: "mascotes", xMin: -16.5, xMax: -15.0, zMin: 7.6, zMax: 11.4, novaPosicao: { x: 0, y: 1.6, z: 5.5, rotY: 0 } },
  { origem: "museu", destino: "taca", xMin: 15.0, xMax: 16.5, zMin: 7.6, zMax: 11.4, novaPosicao: { x: 0, y: 1.6, z: 6.2, rotY: 0 } },
  { origem: "linhaTempo", destino: "museu", xMin: -1.8, xMax: 1.8, zMin: 15.0, zMax: 16.5, novaPosicao: { x: 0, y: 1.6, z: -11.5, rotY: 180 } },
  { origem: "linhaTempo", destino: "campeoes", xMin: 4.0, xMax: 5.5, zMin: -4.4, zMax: -0.4, novaPosicao: { x: -5.8, y: 1.6, z: 0, rotY: -90 } },
  { origem: "linhaTempo", destino: "quizFinal", xMin: -1.8, xMax: 1.8, zMin: -16.5, zMax: -15.0, novaPosicao: { x: 0, y: 1.6, z: 5.4, rotY: 0 } },
  { origem: "campeoes", destino: "museu", xMin: -1.7, xMax: 1.7, zMin: 7.0, zMax: 8.5, novaPosicao: { x: -13.2, y: 1.6, z: -9.5, rotY: -90 } },
  { origem: "campeoes", destino: "linhaTempo", xMin: -8.5, xMax: -7.0, zMin: -1.7, zMax: 1.7, novaPosicao: { x: 3.4, y: 1.6, z: -2.3, rotY: 0 } },
  { origem: "camisas", destino: "museu", xMin: -1.7, xMax: 1.7, zMin: 7.0, zMax: 8.5, novaPosicao: { x: 13.2, y: 1.6, z: -9.5, rotY: 90 } },
  { origem: "mascotes", destino: "museu", xMin: -1.7, xMax: 1.7, zMin: 7.0, zMax: 8.5, novaPosicao: { x: -13.2, y: 1.6, z: 9.5, rotY: -90 } },
  { origem: "taca", destino: "museu", xMin: -1.7, xMax: 1.7, zMin: 8.0, zMax: 9.5, novaPosicao: { x: 13.2, y: 1.6, z: 9.5, rotY: 90 } },
  { origem: "taca", destino: "quizFinal", xMin: -1.7, xMax: 1.7, zMin: -9.5, zMax: -8.0, novaPosicao: { x: 0, y: 1.6, z: 5.4, rotY: 0 } },
  { origem: "quizFinal", destino: "linhaTempo", xMin: -1.7, xMax: 1.7, zMin: 7.0, zMax: 8.5, novaPosicao: { x: 0, y: 1.6, z: -13.4, rotY: 180 } },
  { origem: "quizFinal", destino: "taca", xMin: -8.5, xMax: -7.0, zMin: -1.7, zMax: 1.7, novaPosicao: { x: 3.4, y: 1.6, z: -6.4, rotY: 150 } }
];

function retanguloContemPonto(retangulo, ponto) {
  return ponto.x >= retangulo.xMin &&
    ponto.x <= retangulo.xMax &&
    ponto.z >= retangulo.zMin &&
    ponto.z <= retangulo.zMax;
}

function retanguloColideComUsuario(retangulo, ponto, raioUsuario) {
  return ponto.x + raioUsuario > retangulo.xMin &&
    ponto.x - raioUsuario < retangulo.xMax &&
    ponto.z + raioUsuario > retangulo.zMin &&
    ponto.z - raioUsuario < retangulo.zMax;
}

function obterLimitesDoAmbiente(ambiente) {
  return limitesAmbientes[ambiente] || limitesAmbientes.praca;
}

function estaDentroDosLimites(ambiente, ponto, raioUsuario = 0.45) {
  const limites = obterLimitesDoAmbiente(ambiente);
  return ponto.x - raioUsuario >= limites.xMin &&
    ponto.x + raioUsuario <= limites.xMax &&
    ponto.z - raioUsuario >= limites.zMin &&
    ponto.z + raioUsuario <= limites.zMax;
}

function obterColisoesDoAmbiente(ambiente) {
  return colisoes.filter((colisor) => colisor.ambiente === ambiente);
}

function obterPortasDoAmbiente(ambiente) {
  return portas.filter((porta) => porta.origem === ambiente);
}

function verificarPorta(posicao, ambienteAtual = window.estadoExperiencia?.ambienteAtual || "praca") {
  return obterPortasDoAmbiente(ambienteAtual).find((porta) => retanguloContemPonto(porta, posicao)) || null;
}

function podeMoverPara(novaPosicao, ambienteAtual = window.estadoExperiencia?.ambienteAtual || "praca") {
  const raioUsuario = 0.45;

  // A porta e verificada antes da colisao para permitir atravessar apenas areas liberadas.
  if (verificarPorta(novaPosicao, ambienteAtual)) {
    return true;
  }

  if (!estaDentroDosLimites(ambienteAtual, novaPosicao, raioUsuario)) {
    return false;
  }

  return !obterColisoesDoAmbiente(ambienteAtual).some((colisor) => {
    return retanguloColideComUsuario(colisor, novaPosicao, raioUsuario);
  });
}

function criarDebugColisores(ambiente, destino) {
  if (!destino) {
    return;
  }

  obterColisoesDoAmbiente(ambiente).forEach((colisor) => {
    const largura = colisor.xMax - colisor.xMin;
    const profundidade = colisor.zMax - colisor.zMin;
    const x = colisor.xMin + largura / 2;
    const z = colisor.zMin + profundidade / 2;
    const bloco = document.createElement("a-box");
    bloco.setAttribute("position", `${x} 0.05 ${z}`);
    bloco.setAttribute("width", largura);
    bloco.setAttribute("depth", profundidade);
    bloco.setAttribute("height", 0.1);
    bloco.setAttribute("material", "color: #ff3355; opacity: 0.28; transparent: true");
    bloco.setAttribute("class", "debug-colisor");
    destino.appendChild(bloco);
  });

  obterPortasDoAmbiente(ambiente).forEach((porta) => {
    const largura = porta.xMax - porta.xMin;
    const profundidade = porta.zMax - porta.zMin;
    const x = porta.xMin + largura / 2;
    const z = porta.zMin + profundidade / 2;
    const area = document.createElement("a-plane");
    area.setAttribute("position", `${x} 0.08 ${z}`);
    area.setAttribute("rotation", "-90 0 0");
    area.setAttribute("width", largura);
    area.setAttribute("height", profundidade);
    area.setAttribute("material", "color: #32d76b; opacity: 0.38; transparent: true");
    area.setAttribute("class", "debug-porta");
    destino.appendChild(area);
  });
}

window.nomesAmbientes = nomesAmbientes;
window.limitesAmbientes = limitesAmbientes;
window.posicoesSeguras = posicoesSeguras;
window.colisoes = colisoes;
window.portas = portas;
window.obterColisoesDoAmbiente = obterColisoesDoAmbiente;
window.obterPortasDoAmbiente = obterPortasDoAmbiente;
window.verificarPorta = verificarPorta;
window.podeMoverPara = podeMoverPara;
window.criarDebugColisores = criarDebugColisores;
