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
- `js/colisoes.js`: limites, colisores e portas entre ambientes.
- `js/ambientes.js`: geração dos ambientes 3D.
- `data/conteudos.json`: textos editáveis.
- `data/quiz.json`: perguntas do quiz.
- `assets/img`, `assets/posters`, `assets/audio`, `assets/video`: mídias locais.

## Trocar vídeos

Coloque os arquivos MP4 na pasta `assets/video` usando estes nomes:

- `abertura-copa.mp4`
- `momentos-historicos.mp4`
- `regras-futebol.mp4`
- `tunel-jogadores.mp4`
- `museu-futebol.mp4`
- `linha-tempo.mp4`
- `campeoes-copa.mp4`
- `mascotes-copa.mp4`
- `taca-copa.mp4`

Os pôsteres já existem em `assets/posters`. Se um vídeo ainda não existir, o modal mostra aviso e mantém o pôster.

## Trocar imagens

Substitua os arquivos em `assets/img` mantendo o mesmo nome. Exemplos:

- `assets/img/estadio-copa.jpg`
- `assets/img/mapa-estadio.png`
- `assets/img/campo-tatico.png`
- `assets/img/camisas/camisa-01.png`
- `assets/img/mascotes/mascote-01.png`

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
- Os placeholders podem ser substituídos por imagens, vídeos e áudios reais a qualquer momento.
