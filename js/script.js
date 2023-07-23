// Obter o elemento canvas e o botão de adicionar bloco
var canvas = document.getElementById("myCanvas");
var addBlockBtn = document.getElementById("addBlockBtn");

// Definir o contexto 2D
var ctx = canvas.getContext("2d");

// Definir as dimensões do canvas
canvas.width = 1100;
canvas.height = 700;

// Definir as propriedades de estilo
ctx.strokeStyle = "black";
ctx.lineWidth = 2;
ctx.font = "16px Arial";

// Lista de blocos
var blocks = [];

// Lista de conexões
var connections = [];

// Bloco selecionado
var selectedBlock = null;

// Bloco em movimento
var movingBlock = null;

// Variável para controlar o temporizador do duplo clique
var clickTimer = null;

// Função para desenhar os blocos na tela
function drawBlocks() {
  // Limpar o canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenhar cada bloco
  blocks.forEach(function(block) {
    // Definir a cor do bloco
    ctx.strokeStyle = block.color;
    ctx.fillStyle = block.color;

    // Desenhar o retângulo
    ctx.strokeRect(block.x, block.y, block.width, block.height);

    // Desenhar o título do bloco
    ctx.fillText(block.title, block.x + 10, block.y + 20);
  });

  // Desenhar as conexões
  connections.forEach(function(connection) {
    // Desenhar a flecha
    drawArrow(
      connection.from.x + connection.from.width / 2,
      connection.from.y + connection.from.height / 2,
      connection.to.x + connection.to.width / 2,
      connection.to.y + connection.to.height / 2
    );
  });
}

// Adicionar um novo bloco à lista
function addBlock() {
  var title = prompt("Digite o título do bloco:");
  if (title) {
    var color = document.getElementById("colorPicker").value; // Obter a cor selecionada

    // Criar um novo bloco com as dimensões, título e cor
    var block = {
      x: Math.random() * (canvas.width - 200),
      y: Math.random() * (canvas.height - 100),
      width: 200,
      height: 100,
      title: title,
      color: color // Adicionar a cor ao bloco
    };

    // Adicionar o bloco à lista
    blocks.push(block);

    // Desenhar os blocos atualizados
    drawBlocks();
  }
}

// Adicionar o evento de clique no botão de adicionar bloco
addBlockBtn.addEventListener("click", addBlock);

// Adicionar os eventos de movimentação do mouse
canvas.addEventListener("mousedown", function(event) {
  // Verificar se o mouse está sobre algum bloco
  blocks.forEach(function(block) {
    if (
      event.offsetX >= block.x &&
      event.offsetX <= block.x + block.width &&
      event.offsetY >= block.y &&
      event.offsetY <= block.y + block.height
    ) {
      // Cancelar o temporizador do duplo clique se houver um
      clearTimeout(clickTimer);

      // Iniciar um novo temporizador do duplo clique
      clickTimer = setTimeout(function() {
        // Verificar se é um duplo clique
        if (block.isDragging) {
          block.isDragging = false;
          selectedBlock = null;
        } else {
          // Selecionar o bloco
          selectedBlock = block;
          selectedBlock.isDragging = true;

          // Definir a posição do mouse em relação ao bloco
          selectedBlock.mouseOffsetX = event.offsetX - block.x;
          selectedBlock.mouseOffsetY = event.offsetY - block.y;
        }

        // Desenhar os blocos atualizados
        drawBlocks();
      }, 300); // Intervalo de 300 milissegundos para considerar como duplo clique
    }
  });
});

canvas.addEventListener("mousemove", function(event) {
  // Verificar se há algum bloco selecionado
  if (selectedBlock) {
    if (selectedBlock.isDragging) {
      // Mover o bloco para a nova posição do mouse
      selectedBlock.x = event.offsetX - selectedBlock.mouseOffsetX;
      selectedBlock.y = event.offsetY - selectedBlock.mouseOffsetY;

      // Desenhar os blocos atualizados
      drawBlocks();
    }
  } else if (movingBlock) {
    // Mover o bloco em movimento para a nova posição do mouse
    movingBlock.x = event.offsetX - movingBlock.mouseOffsetX;
    movingBlock.y = event.offsetY - movingBlock.mouseOffsetY;

    // Desenhar os blocos atualizados
    drawBlocks();
  }
});

canvas.addEventListener("mouseup", function(event) {
  // Verificar se há algum bloco selecionado
  if (selectedBlock) {
    // Limpar a seleção de bloco selecionado
    selectedBlock.isDragging = false;
    selectedBlock = null;

    // Desenhar os blocos atualizados
    drawBlocks();
  } else if (movingBlock) {
    // Verificar se o bloco em movimento está sobre algum outro bloco
    blocks.forEach(function(block) {
      if (
        movingBlock !== block &&
        movingBlock.x + movingBlock.width >= block.x &&
        movingBlock.x <= block.x + block.width &&
        movingBlock.y + movingBlock.height >= block.y &&
        movingBlock.y <= block.y + block.height
      ) {
        // Adicionar uma nova conexão entre os blocos
        connections.push({
          from: movingBlock,
          to: block
        });
      }
    });

    // Limpar o bloco em movimento
    movingBlock = null;

    // Desenhar os blocos atualizados
    drawBlocks();
  }
});

// Adicionar o evento de clique nos blocos
canvas.addEventListener("click", function(event) {
  // Verificar se o mouse está sobre algum bloco
  blocks.forEach(function(block) {
    if (
      event.offsetX >= block.x &&
      event.offsetX <= block.x + block.width &&
      event.offsetY >= block.y &&
      event.offsetY <= block.y + block.height
    ) {
      // Iniciar o movimento do bloco
      movingBlock = block;

      // Definir a posição do mouse em relação ao bloco
      movingBlock.mouseOffsetX = event.offsetX - block.x;
      movingBlock.mouseOffsetY = event.offsetY - block.y;
    }
  });
});

// Função para desenhar uma flecha entre dois pontos
function drawArrow(fromX, fromY, toX, toY) {
  // Definir as propriedades de estilo
  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";
  ctx.lineWidth = 2;

  // Desenhar a linha
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Calcular os ângulos da flecha
  var angle = Math.atan2(toY - fromY, toX - fromX);
  var angle1 = angle - Math.PI / 8;
  var angle2 = angle + Math.PI / 8;

  // Desenhar a flecha
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - 15 * Math.cos(angle1), toY - 15 * Math.sin(angle1));
  ctx.lineTo(toX - 15 * Math.cos(angle2), toY - 15 * Math.sin(angle2));
  ctx.closePath();
  ctx.fill();
}
