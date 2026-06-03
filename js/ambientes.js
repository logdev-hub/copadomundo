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
  quizFinal: { ceu: "#090f19", piso: "#182231", parede: "#d9e2ee" }
};

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

function adicionarTexto(texto, x, y, z, rotY = 0, tamanho = 0.35, largura = 5, cor = "#ffffff", alinhamento = "center") {
  return criarElemento("a-text", {
    value: texto,
    position: posicao(x, y, z),
    rotation: rotacao(0, rotY, 0),
    align: alinhamento,
    color: cor,
    width: largura,
    wrapCount: Math.max(18, Math.round(largura * 10)),
    side: "double",
    baseline: "center",
    shader: "msdf",
    font: "https://cdn.aframe.io/fonts/Roboto-msdf.json",
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
    x,
    y,
    z,
    rotY = 0,
    largura = 3.4,
    altura = 2,
    moldura = "#111827"
  } = opcoes;

  criarElemento("a-box", {
    position: posicao(x, y, z - 0.035 * Math.cos(rotY * Math.PI / 180)),
    rotation: rotacao(0, rotY, 0),
    width: largura + 0.18,
    height: altura + 0.18,
    depth: 0.08,
    material: `color: ${moldura}; roughness: 0.6`
  });

  const plano = criarElemento("a-plane", {
    position: posicao(x, y, z),
    rotation: rotacao(0, rotY, 0),
    width: largura,
    height: altura,
    class: "clicavel",
    material: { shader: "flat", src, color: "#ffffff" }
  });

  plano.addEventListener("click", () => {
    window.tocarClique?.();
    window.ampliarImagem?.(src, titulo, descricao);
  });

  adicionarTexto(titulo, x, y - altura / 2 - 0.22, z, rotY, 0.28, largura * 1.4, "#ffffff");
  return plano;
}

function adicionarTelaVideo(opcoes) {
  const {
    idVideo,
    titulo,
    descricao,
    poster,
    x,
    y,
    z,
    rotY = 0,
    largura = 4.6,
    altura = 2.55
  } = opcoes;

  criarElemento("a-box", {
    position: posicao(x, y, z - 0.04 * Math.cos(rotY * Math.PI / 180)),
    rotation: rotacao(0, rotY, 0),
    width: largura + 0.28,
    height: altura + 0.28,
    depth: 0.12,
    material: "color: #05070d; roughness: 0.5; metalness: 0.15"
  });

  const tela = criarElemento("a-plane", {
    position: posicao(x, y, z),
    rotation: rotacao(0, rotY, 0),
    width: largura,
    height: altura,
    class: "clicavel",
    material: { shader: "flat", src: poster, color: "#ffffff" }
  });

  tela.addEventListener("click", () => {
    window.tocarClique?.();
    window.tocarVideo?.(idVideo, titulo, descricao);
  });

  adicionarTexto(`▶ ${titulo}`, x, y - altura / 2 - 0.28, z, rotY, 0.3, largura * 1.25, "#ffd45a");
  return tela;
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
  const placas = [
    { x: -11.5, z: -10.5, rotY: 32, img: "assets/img/copa-arte-01.jpg", titulo: "Arte da Copa 01" },
    { x: 11.5, z: -10.5, rotY: -32, img: "assets/img/copa-arte-02.jpg", titulo: "Arte da Copa 02" },
    { x: -11.5, z: 10.5, rotY: -32, img: "assets/img/copa-arte-01.jpg", titulo: "Campanha esportiva" },
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
    titulo: "Telão externo",
    descricao: "Video de abertura da Copa. Substitua o arquivo em assets/video/abertura-copa.mp4.",
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
    descricao: "Mapa editavel da experiencia. Use o painel lateral para acessar qualquer ambiente.",
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

  adicionarTelaVideo({
    idVideo: "momentos",
    titulo: "Momentos históricos",
    descricao: "Telão interno reservado para lances historicos.",
    poster: "assets/posters/poster-abertura.jpg",
    x: 0,
    y: 4.15,
    z: -12.55,
    rotY: 0,
    largura: 4.65,
    altura: 2.35
  });

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
  adicionarPiso(32, 36, "#2b3a32", "src: none");
  adicionarGramadoRealista(29, 34, 0, 0, 1);
  adicionarLuzes("#eef8ff");
  adicionarParedesPorColisao("campo", configuracaoVisual.campo.parede, 1.2);
  adicionarArquibancadasVisiveisDoCampo();
  adicionarLinhasDoCampo();
  adicionarGol(-15.65, 0);
  adicionarGol(15.65, 180);
  adicionarPlacasPublicidade();

  const bola = criarElemento("a-sphere", {
    position: "0 0.43 0",
    radius: 0.42,
    class: "clicavel",
    material: "color: #f8fafc; roughness: 0.46"
  });
  bola.setAttribute("animation", "property: rotation; to: 0 360 0; dur: 6500; loop: true; easing: linear");
  bola.addEventListener("click", () => {
    window.abrirModalTexto?.("Bola no centro", "A partida comeca no circulo central. O campo esta bloqueado nas laterais para orientar a rota ate o tunel.");
  });

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
    titulo: "Regras do futebol",
    descricao: "Video curto para explicar regras e fundamentos.",
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
    titulo: "Video motivacional",
    descricao: "Conteudo para a parede lateral do tunel.",
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
    descricao: "Arte editavel em SVG para frases motivacionais e chamadas de jogo.",
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
    descricao: "Painel historico editavel com texto e imagem sobre a origem do torneio.",
    x: 0,
    y: 2.05,
    z: -7.35,
    rotY: 0,
    largura: 4.2,
    altura: 2.2
  });

  adicionarTelaVideo({
    idVideo: "museu",
    titulo: "Video institucional",
    descricao: "Video reservado para introducao do museu.",
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
      descricao: "Imagem historica substituivel na pasta assets/img.",
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

  adicionarBotao3D("Som do museu", 5.3, 1.55, 0, -90, () => window.alternarAudioAmbiente?.("museu"), 2.2, 0.62, "#334155");
  adicionarBotao3D("Painel de estatísticas", -5.3, 1.55, 0, 90, () => {
    window.abrirModalTexto?.("Estatísticas", "Este painel pode ser alimentado com ranking, artilharia, sedes e recordes. Edite os textos em data/conteudos.json.");
  }, 2.6, 0.62, "#7c2d12");

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
    { periodo: "Futuro das Copas", img: "assets/img/linha-tempo-copas.svg", z: -11.6, lado: -1 }
  ];

  paineis.forEach((painel) => {
    const x = painel.lado < 0 ? -4.18 : 4.18;
    const rotY = painel.lado < 0 ? 90 : -90;
    adicionarPainelImagem({
      src: painel.img,
      titulo: painel.periodo,
      descricao: `Painel editavel da linha do tempo: ${painel.periodo}.`,
      x,
      y: 2.05,
      z: painel.z,
      rotY,
      largura: 3.6,
      altura: 2
    });
  });

  adicionarTelaVideo({
    idVideo: "linhaTempo",
    titulo: "Video da linha do tempo",
    descricao: "Video opcional para contextualizar as decadas das Copas.",
    poster: "assets/posters/poster-abertura.jpg",
    x: 0,
    y: 2.15,
    z: -14.8,
    rotY: 0,
    largura: 4.2,
    altura: 2.35
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
      descricao: `${pais.nome} tem ${pais.titulos} titulo(s) mundial(is) na lista editavel desta experiencia.`,
      x: pais.x,
      y: 2.05,
      z: pais.z,
      rotY: pais.rotY,
      largura: 1.7,
      altura: 1.15,
      moldura: pais.cor
    });
    painel.addEventListener("click", () => {
      window.abrirModalTexto?.(pais.nome, `${pais.nome}: ${pais.titulos} titulo(s). Substitua bandeiras e dados em assets/img/campeoes e data/conteudos.json.`);
      window.alternarAudioAmbiente?.("clique");
    });
  });

  adicionarTelaVideo({
    idVideo: "campeoes",
    titulo: "Campeões da Copa",
    descricao: "Video para a sala dos campeoes.",
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
    titulo: "Ranking editável",
    descricao: "Imagem de ranking dos campeoes. Pode ser substituida livremente.",
    x: 6.8,
    y: 2.05,
    z: -1.6,
    rotY: -90,
    largura: 2.3,
    altura: 1.5
  });

  adicionarBotao3D("Curiosidade", -6.7, 1.45, -1.5, 90, () => {
    window.abrirModalTexto?.("Curiosidade dos campeões", "O ranking, as bandeiras e os textos sao editaveis. Esta sala usa vitrine central bloqueada para simular exposicao.");
  }, 2.1, 0.58, "#92400e");

  adicionarPortaisVisuais("campeoes");
}

function criarCamisas() {
  adicionarCeu(configuracaoVisual.camisas.ceu);
  adicionarPiso(16, 16, configuracaoVisual.camisas.piso);
  adicionarLuzes("#f8fbff");
  adicionarParedesPorColisao("camisas", configuracaoVisual.camisas.parede, 3.2);

  const camisas = [
    { src: "assets/img/camisas/camisa-01.png", titulo: "Camisa clássica", x: -5.8, z: -4.2, rotY: 30 },
    { src: "assets/img/camisas/camisa-02.png", titulo: "Camisa moderna", x: -1.9, z: -5.8, rotY: 8 },
    { src: "assets/img/camisas/camisa-03.png", titulo: "Camisa comemorativa", x: 1.9, z: -5.8, rotY: -8 },
    { src: "assets/img/camisas/camisa-04.png", titulo: "Camisa reserva", x: 5.8, z: -4.2, rotY: -30 }
  ];

  camisas.forEach((camisa) => {
    adicionarPainelImagem({
      src: camisa.src,
      titulo: camisa.titulo,
      descricao: "Camisa em moldura de galeria. Troque o PNG na pasta assets/img/camisas.",
      x: camisa.x,
      y: 2.1,
      z: camisa.z,
      rotY: camisa.rotY,
      largura: 1.75,
      altura: 2.2,
      moldura: "#111827"
    });
  });

  const destaque = adicionarPainelImagem({
    src: "assets/img/camisas/camisa-01.png",
    titulo: "Destaque selecionado",
    descricao: "Painel alterado pelos botoes de modelo da galeria.",
    x: 6.95,
    y: 2.1,
    z: 4.0,
    rotY: -90,
    largura: 1.8,
    altura: 2.25,
    moldura: "#334155"
  });
  destaque.id = "camisa-destaque";

  criarElemento("a-box", {
    position: "-5.75 1 -0.2",
    width: 1.8,
    height: 2,
    depth: 5.4,
    material: "color: #c7eaff; opacity: 0.26; transparent: true"
  });
  criarElemento("a-box", {
    position: "5.75 1 -0.2",
    width: 1.8,
    height: 2,
    depth: 5.4,
    material: "color: #c7eaff; opacity: 0.26; transparent: true"
  });

  adicionarBotao3D("Clássica", -2.5, 1.45, 2.9, 180, () => {
    window.trocarImagem?.("camisa-destaque", "assets/img/camisas/camisa-01.png");
    window.ampliarImagem?.("assets/img/camisas/camisa-01.png", "Camisa clássica", "Modelo classico selecionado.");
  }, 1.8, 0.58, "#1f2937");
  adicionarBotao3D("Moderna", 0, 1.45, 2.9, 180, () => {
    window.trocarImagem?.("camisa-destaque", "assets/img/camisas/camisa-02.png");
    window.ampliarImagem?.("assets/img/camisas/camisa-02.png", "Camisa moderna", "Modelo moderno selecionado.");
  }, 1.8, 0.58, "#1d4ed8");
  adicionarBotao3D("Comemorativa", 2.8, 1.45, 2.9, 180, () => {
    window.trocarImagem?.("camisa-destaque", "assets/img/camisas/camisa-03.png");
    window.ampliarImagem?.("assets/img/camisas/camisa-03.png", "Camisa comemorativa", "Modelo comemorativo selecionado.");
  }, 2.25, 0.58, "#92400e");

  adicionarPortaisVisuais("camisas");
}

function criarMascotes() {
  adicionarCeu(configuracaoVisual.mascotes.ceu);
  adicionarPiso(16, 16, configuracaoVisual.mascotes.piso);
  adicionarLuzes("#f9fdff");
  adicionarParedesPorColisao("mascotes", configuracaoVisual.mascotes.parede, 3.2);

  const mascotes = [
    { src: "assets/img/mascotes/mascote-01.png", titulo: "Mascote Energia", x: -4.7, z: -1.3, cor: "#f97316" },
    { src: "assets/img/mascotes/mascote-02.png", titulo: "Mascote Drible", x: 0, z: -4.8, cor: "#22c55e" },
    { src: "assets/img/mascotes/mascote-03.png", titulo: "Mascote Gol", x: 4.7, z: -1.3, cor: "#38bdf8" }
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
    criarElemento("a-plane", {
      position: "0 1.45 0.64",
      width: 1.2,
      height: 1.2,
      material: { shader: "flat", src: mascote.src, color: "#ffffff" }
    }, grupo);

    grupo.addEventListener("click", () => {
      window.ampliarImagem?.(mascote.src, mascote.titulo, "Mascote placeholder com audio e quiz. Substitua a imagem em assets/img/mascotes.");
      window.alternarAudioAmbiente?.("clique");
    });

    adicionarTexto(mascote.titulo, mascote.x, 2.3, mascote.z, 0, 0.22, 3, "#ffffff");
  });

  adicionarTelaVideo({
    idVideo: "mascotes",
    titulo: "Mascotes da Copa",
    descricao: "Video sobre mascotes e identidade visual.",
    poster: "assets/posters/poster-abertura.jpg",
    x: 0,
    y: 2.1,
    z: -7.05,
    rotY: 0,
    largura: 3.8,
    altura: 2.1
  });

  adicionarBotao3D("Quiz das mascotes", -2.0, 1.45, 4.2, 180, () => window.iniciarQuiz?.("mascotes"), 2.45, 0.62, "#be123c");
  adicionarBotao3D("Audio mascote", 2.0, 1.45, 4.2, 180, () => window.alternarAudioAmbiente?.("torcida"), 2.1, 0.62, "#0f766e");

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

  const taca = criarElemento("a-entity", {
    position: "0 0.95 0",
    class: "clicavel"
  });
  taca.setAttribute("animation", "property: rotation; to: 0 360 0; dur: 11000; loop: true; easing: linear");
  criarElemento("a-cylinder", { position: "0 0.25 0", radius: 0.42, height: 0.5, material: "color: #d4a62a; metalness: 0.75; roughness: 0.18" }, taca);
  criarElemento("a-cone", { position: "0 0.85 0", radiusBottom: 0.5, radiusTop: 0.95, height: 1.05, material: "color: #ffd45a; metalness: 0.85; roughness: 0.16" }, taca);
  criarElemento("a-sphere", { position: "0 1.48 0", radius: 0.55, scale: "1 0.7 1", material: "color: #ffe083; metalness: 0.85; roughness: 0.15" }, taca);
  criarElemento("a-torus", { position: "-0.72 1.08 0", rotation: "0 90 0", radius: 0.35, radiusTubular: 0.06, material: "color: #ffd45a; metalness: 0.85" }, taca);
  criarElemento("a-torus", { position: "0.72 1.08 0", rotation: "0 90 0", radius: 0.35, radiusTubular: 0.06, material: "color: #ffd45a; metalness: 0.85" }, taca);
  taca.addEventListener("click", () => {
    window.abrirModalTexto?.("Sala da Taça", "A taça gira sobre um pedestal bloqueado. Circule ao redor para observar sem atravessar a area central.");
    window.alternarAudioAmbiente?.("taca");
  });

  adicionarPainelImagem({
    src: "assets/img/taca-copa.png",
    titulo: "Imagem da taça",
    descricao: "Imagem substituivel da taca ou de um trofeu oficial/licenciado conforme necessidade do projeto.",
    x: -7.8,
    y: 2.1,
    z: -2.2,
    rotY: 90,
    largura: 2.5,
    altura: 2.5
  });

  adicionarTelaVideo({
    idVideo: "taca",
    titulo: "Vídeo comemorativo",
    descricao: "Video da sala especial da taca.",
    poster: "assets/posters/poster-taca.jpg",
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
  adicionarTexto("Abra o painel Quiz no canto esquerdo e responda 12 perguntas sobre a experiencia.", 0, 2.25, -5.94, 0, 0.28, 6, "#ffffff");

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
    quizFinal: criarQuizFinal
  };

  const criar = criadores[nomeAmbiente] || criadores.praca;
  criar();

  if (window.estadoExperiencia?.debugColisoes) {
    window.criarDebugColisores?.(nomeAmbiente, obterMundo());
  }
}

window.criarAmbiente = criarAmbiente;
window.limparAmbiente = limparAmbiente;
window.adicionarPainelImagem = adicionarPainelImagem;
window.adicionarTelaVideo = adicionarTelaVideo;
