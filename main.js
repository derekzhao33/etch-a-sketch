// TODO: add colors (color picker or set amount of colors)
// TODO: figure out how to deal with window resizing

const body = document.body;
const bar = document.querySelector('.bar');
const slider = document.querySelector('.range-slider');
const brushTooltip = document.getElementById('brush-tooltip');
const eraserButton = document.getElementById('eraser-button')
const eraserIcon = document.getElementById('eraser-icon')
const eraserTooltip = document.getElementById('eraser-tooltip');
const clearButton = document.getElementById('clear-button');
const clearIcon = document.getElementById('clear-icon');
const clearTooltip = document.getElementById('clear-tooltip') 

const padHeight = window.innerHeight;
const padWidth = window.innerWidth - 75;

const buttonHoverColor = '#D1D1D6';
const buttonClickColor = '#D7D7DC'
const sliderThumbInputDimension = '20px';

let isEraserOn = false;
let prevColor = null;
let currBrushColor = 'black';
let currGridDimension = slider.value;
let isMouseDown = false;
let gridList = new Array();

function addEventListeners() {
  changeBrushThickness();

  handleTooltip(slider, brushTooltip, 'input');
  handleTooltip(eraserButton, eraserTooltip, 'mousedown');
  handleTooltip(clearButton, clearTooltip, 'mousedown');

  eraserButton.addEventListener('click', () => {
    handleButtonToggle(eraserButton, eraserIcon);
    handleEraser();
  })

  clearButton.addEventListener('click', () => {
    clearGrid();
  })
}

function handleButtonToggle(button, icon) {
  button.classList.toggle('toggled');
  icon.classList.toggle('toggled');
}

function handleEraser() {
  if (!isEraserOn) {
    prevColor = currBrushColor;
    currBrushColor = 'white';
    isEraserOn = true;
  } else {
    currBrushColor = prevColor;
    isEraserOn = false;
  }
}

function handleTooltip(element, tooltip, inputType) {
  let tooltipTimeout;

  element.addEventListener('mouseover', () => {
    tooltipTimeout = setTimeout(() => {
      tooltip.style.visibility = 'visible';
    }, 1000);
  });

  element.addEventListener(inputType, () => {
    clearTimeout(tooltipTimeout);
    tooltip.style.visibility = 'hidden';
  })

  element.addEventListener('mouseout', () => {
    clearTimeout(tooltipTimeout);
    tooltip.style.visibility = 'hidden';
  });
}

function changeBrushThickness() {
  slider.addEventListener('mouseup', () => {
    currGridDimension = slider.value;
    createGrid(currGridDimension);
    
    const firstContainer = document.querySelector('.container:first-of-type');
    const lastContainer = document.querySelector('.container:last-of-type');

    lastContainer.style.position = 'absolute';
    lastContainer.style.left = '0';
    lastContainer.style.right = '0';
    lastContainer.style.top = '0';
    lastContainer.style.bottom = '0';

    lastContainer.style.height = padHeight;
    lastContainer.style.width = padWidth;
  })
}


function checkMouseDown() {
  document.addEventListener('pointerdown', () => {
      isMouseDown = true;
  })

  document.addEventListener('pointerup', () => {
      isMouseDown = false;
  })
}

function clearGrid() {
  gridList.forEach((grid) => {grid.remove()});

  createGrid(currGridDimension);
}

function createGrid(columns) {
  const container = document.createElement('div');
  container.className = 'container';
  body.appendChild(container);

  for (let i = 0; i < columns; i++) {
    const column = createColumn(columns);
    container.appendChild(column);
  }

  gridList.push(container);

  container.addEventListener('mouseover', (e) => {
    if (isMouseDown && e.target.classList.contains('box')) {
      e.target.style.backgroundColor = currBrushColor;
      e.target.style.opacity = '1';
    }
  });

  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('box')) {
      e.target.style.backgroundColor = currBrushColor;
      e.target.style.opacity = '1';
    }
  });
}

function determineNumBoxesInColumn(columns) {
  const heightWidthRatio = padHeight / padWidth;
  const numBoxesRaw = columns * heightWidthRatio;
  const numBoxesRounded = Math.floor(numBoxesRaw);

  return numBoxesRounded;
}

function createColumn(columns) {
  const column = document.createElement('div');
  column.className = 'column';
  
  column.style.height = padHeight;
  column.style.width = padWidth / columns;

  const boxes = determineNumBoxesInColumn(columns);

  for (let i = 0; i < boxes; i++) {
    const box = document.createElement('div')

    box.classList.add('box');
    column.appendChild(box);

    box.style.height = padHeight / (columns ** 2);
    box.style.width = padWidth / (columns ** 2);
  }

  return column;
}

function main() {
  createGrid(currGridDimension);
  checkMouseDown();
  addEventListeners();
}

main();
