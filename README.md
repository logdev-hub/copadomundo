# Copa do Mundo Imersiva 3D

Aplicação web local, responsiva e interativa feita com HTML5, CSS3, JavaScript puro, Bootstrap 5, A-Frame e WebXR quando disponível.

## Como abrir

Recomendado usar um servidor local para carregar `data/*.json` e assets sem restrições do navegador:

```bash
python -m http.server 5500
```

Depois acesse:

```text
http://localhost:5500
```

No VS Code, também funciona com a extensão Live Server.

## Estrutura

- `index.html`: tela inicial, cena A-Frame, controles, painel lateral e modais.
- `css/style.css`: layout responsivo, tela inicial, setas e painéis.
- `js/script.js`: inicialização, mapa, modais, vídeos, áudio e quiz.
- `js/movimento.js`: WASD, setas, botões de toque e movimento contínuo.
- `js/input-gamepad.js`: camada adicional para controles VR/Bluetooth via Web Gamepad API.
- `js/colisoes.js`: limites, colisores e portas entre ambientes.
- `js/ambientes.js`: geração dos ambientes 3D.
- `data/conteudos.json`: textos editáveis.
- `data/quiz.json`: perguntas do quiz.
- `assets/img`, `assets/posters`, `assets/audio`, `assets/video`: mídias locais.

## Controle VR/Bluetooth

A aplicação aceita teclado, mouse, touch e também controles reconhecidos pela Web Gamepad API. Conecte o controle ao computador/celular, abra a experiência no navegador e pressione qualquer botão do controle para que o navegador o ative.

Mapeamento inicial em `js/input-gamepad.js`:

- Joystick vertical: frente e trás.
- Joystick horizontal: girar para esquerda e direita.
- Botão `0`: OK/Gatilho, interage com o objeto apontado pela câmera.
- Botão `1`: voltar, fecha modal aberto ou retorna ao ambiente anterior quando houver histórico.
- Botão `2`: menu, abre/fecha o mapa quando a experiência estiver iniciada.
- Botões `12`, `13`, `14`, `15`: simulam ArrowUp, ArrowDown, ArrowLeft e ArrowRight.

Se o modelo do controle usar outros índices, ative o painel de diagnóstico em `js/input-gamepad.js` com `const DEBUG_GAMEPAD = true;`, pressione os botões e ajuste o objeto `GAMEPAD_MAPPING`.

## Vídeos interativos

Os pontos de vídeo da cena usam links do YouTube cadastrados em `js/script.js`, dentro de `videosExperiencia`. Ao clicar em uma tela 3D, o modal abre o player com controles de reproduzir, pausar, parar, retroceder 10 segundos e avançar 10 segundos.

As miniaturas exibidas nas telas 3D ficam em `assets/posters/youtube`. Para recriá-las a partir dos thumbnails do YouTube:

```bash
python scripts/build_youtube_posters.py
```

Também é possível usar vídeos MP4 locais. Coloque os arquivos na pasta `assets/video` e ajuste `videosExperiencia` para apontar para eles:

- `abertura-copa.mp4`
- `momentos-historicos.mp4`
- `regras-futebol.mp4`
- `tunel-jogadores.mp4`
- `museu-futebol.mp4`
- `linha-tempo.mp4`
- `campeoes-copa.mp4`
- `mascotes-copa.mp4`
- `taca-copa.mp4`

Os pôsteres já existem em `assets/posters`. Se um vídeo local ainda não existir, o modal mostra aviso e mantém o pôster temático.

## Imagens e fontes

As imagens genéricas foram trocadas por assets locais com fotos históricas, bandeiras reais, painéis de dados e composições autorais. As fontes e licenças usadas ficam em `assets/asset-sources.json`.

Para regenerar o conjunto de imagens:

```bash
python scripts/build_real_assets.py
```

Principais arquivos gerados:

- `assets/img/estadio-copa.jpg`
- `assets/img/mapa-estadio.png`
- `assets/img/campo-tatico.png`
- `assets/img/camisas/camisa-01.png`
- `assets/img/mascotes/mascote-01.png`
- `assets/posters/poster-abertura.jpg`

As imagens são usadas por painéis 3D, galerias, vitrines, bandeiras e pôsteres.

## Editar textos

Abra `data/conteudos.json` e altere os campos `titulo`, `texto` e a lista `curiosidades`.

## Editar quiz

Abra `data/quiz.json`. Cada pergunta usa:

```json
{
  "pergunta": "Texto da pergunta",
  "alternativas": ["A", "B", "C", "D"],
  "correta": 0,
  "explicacao": "Feedback exibido após resposta",
  "ambiente": "campo"
}
```

O índice `correta` começa em `0`.

## Adicionar novo ambiente

1. Em `js/colisoes.js`, adicione o nome em `nomesAmbientes`.
2. Adicione limites em `limitesAmbientes`.
3. Adicione uma posição segura em `posicoesSeguras`.
4. Em `js/ambientes.js`, crie uma função `criarMeuAmbiente()`.
5. Registre a função no objeto `criadores` dentro de `criarAmbiente`.
6. Crie pelo menos uma porta em `portas` para conectar o ambiente.

## Adicionar parede ou objeto sólido

Edite `js/colisoes.js` e inclua um retângulo no array `colisoes`:

```js
{
  ambiente: "museu",
  tipo: "vitrine",
  xMin: -2,
  xMax: 2,
  zMin: -5,
  zMax: -4
}
```

A função `podeMoverPara(novaPosicao)` bloqueia o movimento quando a posição entra nesse retângulo.

## Criar porta entre ambientes

Edite o array `portas` em `js/colisoes.js`:

```js
{
  origem: "museu",
  destino: "taca",
  xMin: 15,
  xMax: 16.5,
  zMin: 7.6,
  zMax: 11.4,
  novaPosicao: { x: 0, y: 1.6, z: 6.2, rotY: 180 }
}
```

A passagem acontece somente quando a câmera entra na área da porta.

## Publicar em servidor

Envie a pasta inteira para qualquer hospedagem estática. Não há backend nem banco de dados. Mantenha a mesma estrutura de arquivos.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todos os arquivos do projeto.
3. Abra `Settings > Pages`.
4. Em `Build and deployment`, selecione `Deploy from a branch`.
5. Escolha a branch principal e a pasta `/root`.
6. Salve e aguarde a URL pública.

## Observações

- A experiência usa CDNs para Bootstrap 5 e A-Frame.
- WebXR aparece quando o navegador e o dispositivo oferecem suporte.
- O sistema de colisão é retangular e simples, pensado para desempenho e fácil edição.
- Os assets principais ficam versionados localmente; os vídeos podem ser adicionados depois em `assets/video`.
