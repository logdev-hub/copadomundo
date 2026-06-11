/*
  Entrada adicional por controle fisico/VR usando Web Gamepad API.
  Esta camada nao remove teclado, mouse, touch ou cliques existentes: ela reutiliza
  window.marcarMovimento quando disponivel e dispara os mesmos eventos de clique.

  Para desligar o painel tecnico, altere para false.
*/

const DEBUG_GAMEPAD = true;

/*
  Os indices abaixo seguem o padrao comum de gamepads no navegador, mas controles
  Bluetooth simples podem variar. Abra o painel de diagnostico, pressione botoes e
  ajuste estes numeros conforme o modelo usado.
*/
const GAMEPAD_MAPPING = {
  axisHorizontal: 0,
  axisVertical: 1,
  buttonAction: 0,
  buttonBack: 1,
  buttonMenu: 2,
  buttonUp: 12,
  buttonDown: 13,
  buttonLeft: 14,
  buttonRight: 15
};

const GAMEPAD_DEFAULTS = {
  deadzone: 0.25,
  moveSpeed: 3.35,
  turnSpeed: 74,
  invertHorizontal: false,
  invertVertical: false,
  horizontalMode: "turn" // Use "turn" para girar ou "strafe" para andar lateralmente.
};

const gamepadState = {
  activeIndex: null,
  connected: false,
  seen: false,
  previousButtons: [],
  heldVirtualKeys: new Set(),
  currentTarget: null,
  currentIntersection: null,
  lastEnvironment: null,
  environmentHistory: [],
  suppressNextEnvironmentPush: false,
  settings: { ...GAMEPAD_DEFAULTS },
  panel: null,
  raycaster: null,
  rayOrigin: null,
  rayDirection: null
};

const GAMEPAD_MOVEMENTS = ["frente", "tras", "esquerda", "direita", "girarEsquerda", "girarDireita"];

const KEYBOARD_EVENT_DATA = {
  ArrowUp: { key: "ArrowUp", code: "ArrowUp", keyCode: 38 },
  ArrowDown: { key: "ArrowDown", code: "ArrowDown", keyCode: 40 },
  ArrowLeft: { key: "ArrowLeft", code: "ArrowLeft", keyCode: 37 },
  ArrowRight: { key: "ArrowRight", code: "ArrowRight", keyCode: 39 },
  KeyQ: { key: "q", code: "KeyQ", keyCode: 81 },
  KeyE: { key: "e", code: "KeyE", keyCode: 69 },
  Escape: { key: "Escape", code: "Escape", keyCode: 27 }
};

function normalizarIndices(valor) {
  if (Array.isArray(valor)) {
    return valor.filter((indice) => Number.isInteger(indice));
  }

  return Number.isInteger(valor) ? [valor] : [];
}

function limitarEixo(valor, deadzone) {
  const numero = Number.isFinite(valor) ? valor : 0;
  return Math.abs(numero) >= deadzone ? numero : 0;
}

function obterGamepads() {
  if (!navigator.getGamepads) {
    return [];
  }

  return Array.from(navigator.getGamepads()).filter(Boolean);
}

function obterGamepadAtivo() {
  const controles = obterGamepads();

  if (gamepadState.activeIndex !== null) {
    const atual = controles.find((controle) => controle.index === gamepadState.activeIndex);
    if (atual) {
      return atual;
    }
  }

  return controles[0] || null;
}

function estaBotaoPressionado(gamepad, indiceOuLista) {
  return normalizarIndices(indiceOuLista).some((indice) => {
    const botao = gamepad.buttons[indice];
    return Boolean(botao?.pressed || botao?.value > 0.5);
  });
}

function indicesBotoesPressionados(gamepad) {
  if (!gamepad) {
    return [];
  }

  return gamepad.buttons
    .map((botao, indice) => (botao?.pressed || botao?.value > 0.5 ? indice : null))
    .filter((indice) => indice !== null);
}

function criarKeyboardEvent(tipo, key) {
  const dados = KEYBOARD_EVENT_DATA[key] || { key, code: key, keyCode: 0 };
  const evento = new KeyboardEvent(tipo, {
    key: dados.key,
    code: dados.code,
    keyCode: dados.keyCode,
    which: dados.keyCode,
    bubbles: true,
    cancelable: true
  });

  Object.defineProperty(evento, "gamepadSource", {
    value: true,
    enumerable: false
  });

  return evento;
}

function simulateKeyDown(key) {
  window.dispatchEvent(criarKeyboardEvent("keydown", key));
}

function simulateKeyUp(key) {
  window.dispatchEvent(criarKeyboardEvent("keyup", key));
}

function tapKey(key, duration = 80) {
  simulateKeyDown(key);
  window.setTimeout(() => simulateKeyUp(key), duration);
}

function definirTeclaVirtual(key, pressionada) {
  const estavaPressionada = gamepadState.heldVirtualKeys.has(key);

  if (pressionada && !estavaPressionada) {
    gamepadState.heldVirtualKeys.add(key);
    simulateKeyDown(key);
  } else if (!pressionada && estavaPressionada) {
    gamepadState.heldVirtualKeys.delete(key);
    simulateKeyUp(key);
  }
}

function liberarTeclasVirtuais() {
  Array.from(gamepadState.heldVirtualKeys).forEach((key) => definirTeclaVirtual(key, false));
}

function definirMovimentoGamepad(nome, ativo) {
  if (typeof window.marcarMovimento === "function") {
    window.marcarMovimento(nome, ativo, `gamepad:eixo:${nome}`);
    return;
  }

  const fallbackTeclas = {
    frente: "ArrowUp",
    tras: "ArrowDown",
    esquerda: "ArrowLeft",
    direita: "ArrowRight",
    girarEsquerda: "KeyQ",
    girarDireita: "KeyE"
  };
  definirTeclaVirtual(fallbackTeclas[nome], ativo);
}

function liberarMovimentosGamepad() {
  if (typeof window.marcarMovimento === "function") {
    GAMEPAD_MOVEMENTS.forEach((nome) => window.marcarMovimento(nome, false, `gamepad:eixo:${nome}`));
  }

  liberarTeclasVirtuais();
}

function criarPainelGamepad() {
  if (gamepadState.panel) {
    return gamepadState.panel;
  }

  const painel = document.createElement("section");
  painel.id = "gamepadPanel";
  painel.className = "gamepad-panel";
  painel.hidden = true;
  painel.setAttribute("aria-live", "polite");
  painel.innerHTML = `
    <div class="gamepad-panel-topo">
      <strong id="gamepadStatusTitulo">Controle VR</strong>
      <span id="gamepadStatusEstado">desconectado</span>
    </div>
    <p id="gamepadStatusTexto" class="gamepad-status-texto">
      Pressione qualquer botao do controle para ativar no navegador.
    </p>
    <ul class="gamepad-instrucoes">
      <li>Use o direcional/joystick para se mover.</li>
      <li>Pressione OK/Gatilho para interagir.</li>
      <li>Teclado e mouse continuam funcionando normalmente.</li>
    </ul>
    <pre id="gamepadDebugInfo" class="gamepad-debug-info"></pre>
  `;

  document.body.appendChild(painel);
  gamepadState.panel = painel;
  return painel;
}

function atualizarPainelGamepad(gamepad) {
  const painel = criarPainelGamepad();
  const titulo = document.getElementById("gamepadStatusTitulo");
  const estado = document.getElementById("gamepadStatusEstado");
  const texto = document.getElementById("gamepadStatusTexto");
  const debug = document.getElementById("gamepadDebugInfo");

  painel.hidden = !gamepadState.seen;

  if (titulo) {
    titulo.textContent = gamepad ? "Controle VR detectado" : "Controle VR";
  }
  if (estado) {
    estado.textContent = gamepad ? "conectado" : "desconectado";
  }
  if (texto) {
    texto.textContent = gamepad
      ? `${gamepad.id || "Gamepad"} - indice ${gamepad.index}`
      : "Pressione qualquer botao do controle para ativar no navegador.";
  }

  if (!debug) {
    return;
  }

  if (!DEBUG_GAMEPAD) {
    debug.hidden = true;
    debug.textContent = "";
    return;
  }

  debug.hidden = false;
  if (!gamepad) {
    debug.textContent = "status: desconectado";
    return;
  }

  const botoes = indicesBotoesPressionados(gamepad);
  const eixos = gamepad.axes.map((valor, indice) => `${indice}: ${valor.toFixed(2)}`).join("\n");
  debug.textContent = [
    `status: conectado`,
    `nome: ${gamepad.id || "sem nome"}`,
    `indice: ${gamepad.index}`,
    `botoes: ${botoes.length ? botoes.join(", ") : "nenhum"}`,
    "eixos:",
    eixos || "nenhum eixo"
  ].join("\n");
}

function registrarGamepad(gamepad) {
  gamepadState.activeIndex = gamepad.index;
  gamepadState.connected = true;
  gamepadState.seen = true;
  console.info(`[Gamepad] Controle conectado: ${gamepad.id} (indice ${gamepad.index})`);
  atualizarPainelGamepad(gamepad);
}

function removerGamepad(gamepad) {
  console.info(`[Gamepad] Controle desconectado: ${gamepad.id} (indice ${gamepad.index})`);
  if (gamepadState.activeIndex === gamepad.index) {
    gamepadState.activeIndex = null;
    gamepadState.connected = false;
    gamepadState.previousButtons = [];
    gamepadState.currentTarget = null;
    gamepadState.currentIntersection = null;
    liberarMovimentosGamepad();
  }
  gamepadState.seen = true;
  atualizarPainelGamepad(null);
}

function aplicarConfiguracaoMovimento() {
  if (!window.estadoMovimento) {
    return;
  }

  if (Number.isFinite(gamepadState.settings.moveSpeed) && gamepadState.settings.moveSpeed > 0) {
    window.estadoMovimento.velocidade = gamepadState.settings.moveSpeed;
  }
  if (Number.isFinite(gamepadState.settings.turnSpeed) && gamepadState.settings.turnSpeed > 0) {
    window.estadoMovimento.velocidadeGiro = gamepadState.settings.turnSpeed;
  }
}

function atualizarConfiguracaoGamepad(novaConfiguracao = {}) {
  gamepadState.settings = {
    ...gamepadState.settings,
    ...novaConfiguracao
  };

  aplicarConfiguracaoMovimento();
}

function obterElementoClicavel(objeto3D) {
  let atual = objeto3D;

  while (atual) {
    const elemento = atual.el;
    if (elemento?.classList?.contains("clicavel")) {
      return elemento;
    }

    const ancestral = elemento?.closest?.(".clicavel");
    if (ancestral) {
      return ancestral;
    }

    atual = atual.parent;
  }

  return null;
}

function obterRaycastCamera() {
  if (!window.THREE) {
    return null;
  }

  const camera = document.getElementById("cameraUsuario");
  if (!camera?.object3D) {
    return null;
  }

  if (!gamepadState.raycaster) {
    gamepadState.raycaster = new THREE.Raycaster();
    gamepadState.rayOrigin = new THREE.Vector3();
    gamepadState.rayDirection = new THREE.Vector3();
  }

  camera.object3D.getWorldPosition(gamepadState.rayOrigin);
  camera.object3D.getWorldDirection(gamepadState.rayDirection);
  gamepadState.raycaster.set(gamepadState.rayOrigin, gamepadState.rayDirection);

  const objetos = Array.from(document.querySelectorAll(".clicavel"))
    .filter((elemento) => elemento.object3D?.visible !== false)
    .map((elemento) => elemento.object3D);

  const intersecoes = gamepadState.raycaster.intersectObjects(objetos, true);
  for (const intersecao of intersecoes) {
    const elemento = obterElementoClicavel(intersecao.object);
    if (elemento) {
      return { elemento, intersecao };
    }
  }

  return null;
}

function emitirEventoInteracao(elemento, tipo, intersecao) {
  const detalhe = {
    source: "gamepad",
    cursorEl: document.getElementById("cameraUsuario"),
    intersection: intersecao || null
  };

  if (typeof elemento.emit === "function") {
    elemento.emit(tipo, detalhe, true);
    return;
  }

  elemento.dispatchEvent(new CustomEvent(tipo, {
    detail: detalhe,
    bubbles: true,
    cancelable: true
  }));
}

function atualizarAlvoInteracao() {
  const acerto = obterRaycastCamera();
  const proximoAlvo = acerto?.elemento || null;

  if (proximoAlvo === gamepadState.currentTarget) {
    gamepadState.currentIntersection = acerto?.intersecao || null;
    return;
  }

  if (gamepadState.currentTarget) {
    emitirEventoInteracao(gamepadState.currentTarget, "mouseleave", gamepadState.currentIntersection);
  }

  gamepadState.currentTarget = proximoAlvo;
  gamepadState.currentIntersection = acerto?.intersecao || null;

  if (gamepadState.currentTarget) {
    emitirEventoInteracao(gamepadState.currentTarget, "mouseenter", gamepadState.currentIntersection);
  }
}

function triggerCurrentInteraction() {
  atualizarAlvoInteracao();

  if (!gamepadState.currentTarget) {
    return false;
  }

  emitirEventoInteracao(gamepadState.currentTarget, "click", gamepadState.currentIntersection);
  return true;
}

function fecharModalAberto() {
  const modal = document.querySelector(".modal.show");
  if (!modal) {
    return false;
  }

  if (window.bootstrap?.Modal) {
    bootstrap.Modal.getOrCreateInstance(modal).hide();
  } else {
    modal.classList.remove("show");
    modal.hidden = true;
  }

  return true;
}

function alternarMenuGamepad() {
  const modalMapa = document.getElementById("modalMapa");
  if (modalMapa?.classList.contains("show")) {
    return fecharModalAberto();
  }

  const botaoMapa = document.getElementById("btnMapa");
  if (window.estadoExperiencia?.experienciaIniciada && botaoMapa) {
    botaoMapa.click();
    return true;
  }

  const botaoComoUsar = document.getElementById("btnComoUsar");
  if (botaoComoUsar) {
    botaoComoUsar.click();
    return true;
  }

  return false;
}

function registrarHistoricoAmbiente() {
  const ambienteAtual = window.estadoExperiencia?.ambienteAtual;
  if (!ambienteAtual) {
    return;
  }

  if (!gamepadState.lastEnvironment) {
    gamepadState.lastEnvironment = ambienteAtual;
    return;
  }

  if (ambienteAtual === gamepadState.lastEnvironment) {
    return;
  }

  if (gamepadState.suppressNextEnvironmentPush) {
    gamepadState.suppressNextEnvironmentPush = false;
  } else {
    gamepadState.environmentHistory.push(gamepadState.lastEnvironment);
    gamepadState.environmentHistory = gamepadState.environmentHistory.slice(-12);
  }

  gamepadState.lastEnvironment = ambienteAtual;
}

function voltarAmbienteAnterior() {
  const ambienteAtual = window.estadoExperiencia?.ambienteAtual;
  while (gamepadState.environmentHistory.length) {
    const anterior = gamepadState.environmentHistory.pop();
    if (anterior && anterior !== ambienteAtual && typeof window.trocarAmbiente === "function") {
      gamepadState.suppressNextEnvironmentPush = true;
      window.trocarAmbiente(anterior);
      return true;
    }
  }

  return false;
}

function acionarVoltarGamepad() {
  if (fecharModalAberto()) {
    return true;
  }

  if (voltarAmbienteAnterior()) {
    return true;
  }

  tapKey("Escape", 80);
  return false;
}

function acionarPrincipalGamepad() {
  if (!window.estadoExperiencia?.experienciaIniciada) {
    const botaoEntrar = document.getElementById("btnEntrar");
    if (botaoEntrar) {
      botaoEntrar.click();
      return true;
    }
  }

  return triggerCurrentInteraction();
}

function processarBotaoBorda(gamepad, chaveMapeamento, aoPressionar, aoSoltar) {
  const indices = normalizarIndices(GAMEPAD_MAPPING[chaveMapeamento]);
  indices.forEach((indice) => {
    const pressionado = estaBotaoPressionado(gamepad, indice);
    const anterior = Boolean(gamepadState.previousButtons[indice]);

    if (pressionado && !anterior) {
      aoPressionar?.(indice);
    } else if (!pressionado && anterior) {
      aoSoltar?.(indice);
    }

    gamepadState.previousButtons[indice] = pressionado;
  });
}

function processarEixos(gamepad) {
  if (!window.estadoExperiencia?.experienciaIniciada) {
    liberarMovimentosGamepad();
    return;
  }

  const deadzone = gamepadState.settings.deadzone;
  const brutoHorizontal = gamepad.axes[GAMEPAD_MAPPING.axisHorizontal] || 0;
  const brutoVertical = gamepad.axes[GAMEPAD_MAPPING.axisVertical] || 0;
  const horizontal = limitarEixo(
    gamepadState.settings.invertHorizontal ? -brutoHorizontal : brutoHorizontal,
    deadzone
  );
  const vertical = limitarEixo(
    gamepadState.settings.invertVertical ? -brutoVertical : brutoVertical,
    deadzone
  );

  definirMovimentoGamepad("frente", vertical < 0);
  definirMovimentoGamepad("tras", vertical > 0);

  if (gamepadState.settings.horizontalMode === "strafe") {
    definirMovimentoGamepad("esquerda", horizontal < 0);
    definirMovimentoGamepad("direita", horizontal > 0);
    definirMovimentoGamepad("girarEsquerda", false);
    definirMovimentoGamepad("girarDireita", false);
  } else {
    definirMovimentoGamepad("girarEsquerda", horizontal < 0);
    definirMovimentoGamepad("girarDireita", horizontal > 0);
    definirMovimentoGamepad("esquerda", false);
    definirMovimentoGamepad("direita", false);
  }
}

function processarBotoes(gamepad) {
  processarBotaoBorda(gamepad, "buttonAction", () => acionarPrincipalGamepad());
  processarBotaoBorda(gamepad, "buttonBack", () => acionarVoltarGamepad());
  processarBotaoBorda(gamepad, "buttonMenu", () => alternarMenuGamepad());

  const experienciaIniciada = Boolean(window.estadoExperiencia?.experienciaIniciada);
  definirTeclaVirtual("ArrowUp", experienciaIniciada && estaBotaoPressionado(gamepad, GAMEPAD_MAPPING.buttonUp));
  definirTeclaVirtual("ArrowDown", experienciaIniciada && estaBotaoPressionado(gamepad, GAMEPAD_MAPPING.buttonDown));
  definirTeclaVirtual("ArrowLeft", experienciaIniciada && estaBotaoPressionado(gamepad, GAMEPAD_MAPPING.buttonLeft));
  definirTeclaVirtual("ArrowRight", experienciaIniciada && estaBotaoPressionado(gamepad, GAMEPAD_MAPPING.buttonRight));
}

function loopGamepad() {
  const gamepad = obterGamepadAtivo();

  if (gamepad && !gamepadState.connected) {
    registrarGamepad(gamepad);
  }

  if (gamepad) {
    processarEixos(gamepad);
    processarBotoes(gamepad);
    atualizarAlvoInteracao();
    atualizarPainelGamepad(gamepad);
  } else if (gamepadState.connected) {
    gamepadState.connected = false;
    liberarMovimentosGamepad();
    atualizarPainelGamepad(null);
  }

  registrarHistoricoAmbiente();
  window.requestAnimationFrame(loopGamepad);
}

function registrarComponenteAFrame() {
  if (!window.AFRAME || AFRAME.components["gamepad-controls"]) {
    return;
  }

  AFRAME.registerComponent("gamepad-controls", {
    schema: {
      moveSpeed: { type: "number", default: GAMEPAD_DEFAULTS.moveSpeed },
      turnSpeed: { type: "number", default: GAMEPAD_DEFAULTS.turnSpeed },
      deadzone: { type: "number", default: GAMEPAD_DEFAULTS.deadzone },
      invertHorizontal: { type: "boolean", default: GAMEPAD_DEFAULTS.invertHorizontal },
      invertVertical: { type: "boolean", default: GAMEPAD_DEFAULTS.invertVertical },
      horizontalMode: { type: "string", default: GAMEPAD_DEFAULTS.horizontalMode }
    },

    init: function initGamepadControls() {
      atualizarConfiguracaoGamepad(this.data);
    },

    update: function updateGamepadControls() {
      liberarMovimentosGamepad();
      atualizarConfiguracaoGamepad(this.data);
    },

    remove: function removeGamepadControls() {
      liberarMovimentosGamepad();
    }
  });
}

function inicializarGamepadInput() {
  criarPainelGamepad();
  registrarComponenteAFrame();
  aplicarConfiguracaoMovimento();

  if (!navigator.getGamepads) {
    console.warn("[Gamepad] Web Gamepad API indisponivel neste navegador.");
    return;
  }

  window.addEventListener("gamepadconnected", (evento) => registrarGamepad(evento.gamepad));
  window.addEventListener("gamepaddisconnected", (evento) => removerGamepad(evento.gamepad));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      liberarMovimentosGamepad();
    }
  });

  window.requestAnimationFrame(loopGamepad);
}

document.addEventListener("DOMContentLoaded", inicializarGamepadInput);
registrarComponenteAFrame();

window.GAMEPAD_MAPPING = GAMEPAD_MAPPING;
window.simulateKeyDown = simulateKeyDown;
window.simulateKeyUp = simulateKeyUp;
window.tapKey = tapKey;
window.triggerCurrentInteraction = triggerCurrentInteraction;
window.atualizarConfiguracaoGamepad = atualizarConfiguracaoGamepad;
