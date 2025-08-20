// TODO: make eraser a toggle instead of click
// TODO: refactor event listeners to implement event delegation
// TODO: add colors (color picker or set amount of colors)
// TODO: refactor for loops to have filter, map, foreach, etc.
// TODO: add the 'filled' class to toggle when dragging mouse

const body = document.body;
const bar = document.querySelector('.bar');
const slider = document.querySelector('.range-slider');
const brushTooltip = document.getElementById('brush-tooltip');
const eraserButton = document.querySelector('.eraser');
const eraserIcon = document.getElementById('eraser-icon')
const eraserTooltip = document.getElementById('eraser-tooltip');
const clearButton = document.querySelector('.clear');
const clearIcon = document.getElementById('clear-icon');
const clearTooltip = document.getElementById('clear-tooltip')

const padHeight = window.innerHeight;
const padWidth = window.innerWidth - 75;

const buttonHoverColor = '#D1D1D6';
const buttonClickColor = '#D7D7DC'
const sliderThumbInputDimension = '20px';

let currBrushColor = 'black';
let currGridDimension = slider.value;
let isMouseDown = false;
let gridList = new Array();

function addEventListeners() {
  changeBrushThickness();
  handleTooltip(slider, '#brush-tooltip', 'input');
  handleTooltip(eraserButton, '#eraser-tooltip', 'mousedown');
  handleTooltip(clearButton, '#clear-tooltip', 'mousedown');
  handleButtonHover('#eraser-button', '#eraser-icon');
  handleButtonHover('#clear-button', '#clear-icon');
  addGlobalEventListener('click', bar, '#clear-button', clearGrid);
  addGlobalEventListener('click', bar, '#eraser-button', () => {currBrushColor = 'white'})
}

function addGlobalEventListener(type, container, selector, func) {
  container.addEventListener(type, (e) => {
    if (e.target.closest(selector)) {
      func();
    }
  })
}

function handleTooltip(element, tooltipSelector, inputType) {
  let tooltipTimeout;
  const tooltip = document.querySelector(tooltipSelector);

  element.addEventListener('mouseover', () => {
    tooltipTimeout = setTimeout(() => {
      tooltip.style.visibility = 'visible';
    }, 1000);
  });

  addGlobalEventListener(inputType, bar, tooltipSelector, () => {
    clearTimeout(tooltipTimeout);
    tooltip.style.visibility = 'hidden';
  })

  element.addEventListener('mouseout', () => {
    clearTimeout(tooltipTimeout);
    tooltip.style.visibility = 'hidden';
  });
}

function handleButtonHover(buttonSelector, iconSelector) {
  const button = document.querySelector(buttonSelector);
  const icon = document.querySelector(iconSelector);

  const originalColor = button.style.backgroundColor;
  let prevColor = '';

  button.addEventListener('mouseenter', () => {
    button.style.backgroundColor = buttonHoverColor;
    icon.style.backgroundColor = buttonHoverColor;
    prevColor = button.style.backgroundColor;
  })

  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = originalColor;
    icon.style.backgroundColor = originalColor;
    prevColor = button.style.backgroundColor;
  })

  // button.addEventListener('mousedown', () => {
  //   button.style.backgroundColor = buttonClickColor;
  //   icon.style.backgroundColor = buttonClickColor;
  // })

  // button.addEventListener('mouseup', () => {
  //   button.style.backgroundColor = prevColor;
  //   icon.style.backgroundColor = prevColor;
  // })
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
  document.addEventListener('mousedown', () => {
      isMouseDown = true;
  })

  document.addEventListener('mouseup', () => {
      isMouseDown = false;
  })
}

function clearGrid() {
  console.log(currGridDimension);

  for (const grid of gridList) {
    grid.remove();
  } 

  createGrid(currGridDimension);
}

function createGrid(columns) {
  const container = document.createElement('div');
  container.className = 'container';

  body.appendChild(container);

  for (let i = 0; i < columns; i++) {
    const column = createColumn(columns)
    container.appendChild(column);

    column.offsetHeight = padHeight / columns;
    column.offsetWidth = padWidth / columns;
  }

  gridList.push(container);
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
    const box = {
      obj: document.createElement('div'),
      isFilled: false
    };

    box.obj.classList.add('box');

    box.obj.addEventListener('mouseover', () => {
      if (isMouseDown && !box.isFilled) {
        box.obj.style.backgroundColor = currBrushColor;
        box.obj.style.opacity = '1';
      }
    });

    column.appendChild(box.obj);

    box.obj.style.height = padHeight / (columns ** 2);
    box.obj.style.width = padWidth / (columns ** 2);
  }

  return column;
}

function main() {
  createGrid(currGridDimension);
  checkMouseDown();
  addEventListeners();
}

main();
