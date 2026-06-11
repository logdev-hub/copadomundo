/*
  Movimento livre com setas visuais, teclado e colisao.
  O rig da camera e movido no plano X/Z; a altura fica fixa em 1.6m.
*/

if (!window.estadoExperiencia) {
  window.estadoExperiencia = {
    ambienteAtual: "praca",
    experienciaIniciada: false,
    debugColisoes: false,
    audioAtivo: false
  };
}

const estadoMovimento = {
  frente: false,
  tras: false,
  esquerda: false,
  direita: false,
  girarEsquerda: false,
  girarDireita: false,
  velocidade: 3.35,
  velocidadeGiro: 74,
  ultimoBloqueio: 0,
  ultimoPortal: 0
};

const nomesMovimento = ["frente", "tras", "esquerda", "direita", "girarEsquerda", "girarDireita"];
const fontesMovimentoAtivas = Object.fromEntries(nomesMovimento.map((nome) => [nome, new Set()]));
const vetorFrenteMovimento = new THREE.Vector3();
const vetorDireitaMovimento = new THREE.Vector3();
const vetorCimaMovimento = new THREE.Vector3(0, 1, 0);
const quaternionMovimento = new THREE.Quaternion();

function marcarMovimento(nome, ativo, origem = "geral") {
  if (!Object.prototype.hasOwnProperty.call(fontesMovimentoAtivas, nome)) {
    return;
  }

  const fontes = fontesMovimentoAtivas[nome];
  if (ativo) {
    fontes.add(origem);
  } else {
    fontes.delete(origem);
  }

  estadoMovimento[nome] = fontes.size > 0;
}

function limparMovimentos() {
  nomesMovimento.forEach((nome) => {
    fontesMovimentoAtivas[nome].clear();
    estadoMovimento[nome] = false;
  });

  document.querySelectorAll(".controle.pressionado").forEach((botao) => {
    botao.classList.remove("pressionado");
  });
}

function mostrarMensagemBloqueio() {
  const agora = performance.now();
  if (agora - estadoMovimento.ultimoBloqueio < 900) {
    return;
  }

  estadoMovimento.ultimoBloqueio = agora;
  const mensagem = document.getElementById("mensagemBloqueio");
  if (!mensagem) {
    return;
  }

  mensagem.classList.add("visivel");
  window.clearTimeout(mensagem._temporizador);
  mensagem._temporizador = window.setTimeout(() => mensagem.classList.remove("visivel"), 1200);
}

function aplicarPosicaoCamera(posicao, rotY) {
  const rig = document.getElementById("rigCamera");
  const camera = document.getElementById("cameraUsuario");
  if (!rig) {
    return;
  }

  rig.object3D.position.set(posicao.x, posicao.y ?? 1.6, posicao.z);
  if (camera) {
    camera.object3D.rotation.set(0, 0, 0);
    camera.setAttribute("rotation", "0 0 0");

    // O look-controls guarda yaw/pitch internamente; zerar evita entrar olhando para tras.
    const controlesOlhar = camera.components?.["look-controls"];
    if (controlesOlhar?.yawObject) {
      controlesOlhar.yawObject.rotation.y = 0;
    }
    if (controlesOlhar?.pitchObject) {
      controlesOlhar.pitchObject.rotation.x = 0;
    }
  }

  if (typeof rotY === "number") {
    rig.object3D.rotation.set(0, THREE.MathUtils.degToRad(rotY), 0);
  }
}

function obterPosicaoCamera() {
  const rig = document.getElementById("rigCamera");
  if (!rig) {
    return { x: 0, y: 1.6, z: 0 };
  }

  return {
    x: rig.object3D.position.x,
    y: rig.object3D.position.y,
    z: rig.object3D.position.z
  };
}

function obterRotacaoYCameraGraus() {
  const rig = document.getElementById("rigCamera");
  if (!rig) {
    return 0;
  }

  return THREE.MathUtils.radToDeg(rig.object3D.rotation.y);
}

function resetarCamera() {
  const ambiente = window.estadoExperiencia?.ambienteAtual || "praca";
  const posicao = window.posicoesSeguras?.[ambiente] || window.posicoesSeguras?.praca || { x: 0, y: 1.6, z: 8, rotY: 0 };
  aplicarPosicaoCamera(posicao, posicao.rotY);
}

function alternarControlesVisuais() {
  const controles = document.getElementById("controlesMovimento");
  const botao = document.getElementById("btnAlternarControles");
  if (!controles) {
    return false;
  }

  const oculto = controles.classList.toggle("oculto");
  if (botao) {
    botao.textContent = oculto ? "Mostrar setas" : "Ocultar setas";
  }

  return oculto;
}

function inicializarBotoesMovimento() {
  const botoes = document.querySelectorAll("[data-movimento]");

  botoes.forEach((botao) => {
    const nome = botao.dataset.movimento;

    const ativar = (evento) => {
      evento.preventDefault();
      botao.setPointerCapture?.(evento.pointerId);
      marcarMovimento(nome, true, `visual:${nome}`);
      botao.classList.add("pressionado");
    };

    const desativar = (evento) => {
      evento?.preventDefault?.();
      if (evento?.pointerId !== undefined && botao.hasPointerCapture?.(evento.pointerId)) {
        botao.releasePointerCapture(evento.pointerId);
      }
      marcarMovimento(nome, false, `visual:${nome}`);
      botao.classList.remove("pressionado");
    };

    botao.addEventListener("pointerdown", ativar);
    botao.addEventListener("pointerup", desativar);
    botao.addEventListener("pointercancel", desativar);
    botao.addEventListener("lostpointercapture", desativar);
    botao.addEventListener("contextmenu", (evento) => evento.preventDefault());
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      limparMovimentos();
    }
  });
}

function inicializarTeclado() {
  const mapaTeclas = {
    KeyW: "frente",
    ArrowUp: "frente",
    KeyS: "tras",
    ArrowDown: "tras",
    KeyA: "esquerda",
    ArrowLeft: "esquerda",
    KeyD: "direita",
    ArrowRight: "direita",
    KeyQ: "girarEsquerda",
    KeyE: "girarDireita"
  };

  window.addEventListener("keydown", (evento) => {
    const nome = mapaTeclas[evento.code];
    if (!nome) {
      return;
    }

    evento.preventDefault();
    const origem = evento.gamepadSource ? `gamepad-tecla:${evento.code}` : `teclado:${evento.code}`;
    marcarMovimento(nome, true, origem);
  });

  window.addEventListener("keyup", (evento) => {
    const nome = mapaTeclas[evento.code];
    if (!nome) {
      return;
    }

    evento.preventDefault();
    const origem = evento.gamepadSource ? `gamepad-tecla:${evento.code}` : `teclado:${evento.code}`;
    marcarMovimento(nome, false, origem);
  });
}

function tentarTrocarPorPorta(posicaoAtual) {
  const agora = performance.now();
  if (agora - estadoMovimento.ultimoPortal < 850) {
    return;
  }

  const ambiente = window.estadoExperiencia?.ambienteAtual || "praca";
  const porta = window.verificarPorta?.(posicaoAtual, ambiente);

  if (!porta) {
    return;
  }

  estadoMovimento.ultimoPortal = agora;
  window.trocarAmbiente?.(porta.destino, porta.novaPosicao);
}

function tentarMoverRig(rig, novaPosicao) {
  const ambiente = window.estadoExperiencia?.ambienteAtual || "praca";

  if (window.podeMoverPara?.(novaPosicao, ambiente)) {
    rig.object3D.position.set(novaPosicao.x, 1.6, novaPosicao.z);
    tentarTrocarPorPorta(novaPosicao);
    return;
  }

  // Tenta deslizar em X ou Z para evitar que pequenas diagonais parem totalmente.
  const atual = rig.object3D.position;
  const tentativaX = { x: novaPosicao.x, y: 1.6, z: atual.z };
  const tentativaZ = { x: atual.x, y: 1.6, z: novaPosicao.z };

  if (window.podeMoverPara?.(tentativaX, ambiente)) {
    rig.object3D.position.set(tentativaX.x, 1.6, tentativaX.z);
    tentarTrocarPorPorta(tentativaX);
    return;
  }

  if (window.podeMoverPara?.(tentativaZ, ambiente)) {
    rig.object3D.position.set(tentativaZ.x, 1.6, tentativaZ.z);
    tentarTrocarPorPorta(tentativaZ);
    return;
  }

  mostrarMensagemBloqueio();
}

function obterVetoresMovimento() {
  const camera = document.getElementById("cameraUsuario");

  if (camera?.object3D) {
    camera.object3D.getWorldQuaternion(quaternionMovimento);
    vetorFrenteMovimento.set(0, 0, -1).applyQuaternion(quaternionMovimento);
  } else {
    vetorFrenteMovimento.set(0, 0, -1);
  }

  vetorFrenteMovimento.y = 0;
  if (vetorFrenteMovimento.lengthSq() < 0.0001) {
    vetorFrenteMovimento.set(0, 0, -1);
  }
  vetorFrenteMovimento.normalize();
  vetorDireitaMovimento.crossVectors(vetorFrenteMovimento, vetorCimaMovimento).normalize();

  return {
    frente: vetorFrenteMovimento,
    direita: vetorDireitaMovimento
  };
}

AFRAME.registerComponent("controle-movimento", {
  tick: function tickControleMovimento(tempo, delta) {
    if (!window.estadoExperiencia?.experienciaIniciada) {
      return;
    }

    const segundos = Math.min(delta / 1000, 0.05);
    const rig = this.el;

    if (estadoMovimento.girarEsquerda || estadoMovimento.girarDireita) {
      const sentido = (estadoMovimento.girarDireita ? -1 : 0) + (estadoMovimento.girarEsquerda ? 1 : 0);
      rig.object3D.rotation.y += THREE.MathUtils.degToRad(sentido * estadoMovimento.velocidadeGiro * segundos);
    }

    let eixoFrente = 0;
    let eixoLateral = 0;

    if (estadoMovimento.frente) eixoFrente += 1;
    if (estadoMovimento.tras) eixoFrente -= 1;
    if (estadoMovimento.direita) eixoLateral += 1;
    if (estadoMovimento.esquerda) eixoLateral -= 1;

    if (eixoFrente === 0 && eixoLateral === 0) {
      return;
    }

    const magnitude = Math.hypot(eixoFrente, eixoLateral) || 1;
    eixoFrente /= magnitude;
    eixoLateral /= magnitude;

    const passo = estadoMovimento.velocidade * segundos;
    const vetores = obterVetoresMovimento();
    const dxFrente = vetores.frente.x * eixoFrente * passo;
    const dzFrente = vetores.frente.z * eixoFrente * passo;
    const dxLateral = vetores.direita.x * eixoLateral * passo;
    const dzLateral = vetores.direita.z * eixoLateral * passo;
    const atual = rig.object3D.position;

    const novaPosicao = {
      x: atual.x + dxFrente + dxLateral,
      y: 1.6,
      z: atual.z + dzFrente + dzLateral
    };

    tentarMoverRig(rig, novaPosicao);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  inicializarBotoesMovimento();
  inicializarTeclado();
});

window.estadoMovimento = estadoMovimento;
window.marcarMovimento = marcarMovimento;
window.limparMovimentos = limparMovimentos;
window.resetarCamera = resetarCamera;
window.aplicarPosicaoCamera = aplicarPosicaoCamera;
window.obterPosicaoCamera = obterPosicaoCamera;
window.obterRotacaoYCameraGraus = obterRotacaoYCameraGraus;
window.alternarControlesVisuais = alternarControlesVisuais;
