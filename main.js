// TODO: add colors (color picker or set amount of colors)
// TODO: figure out how to deal with window resizing
// TODO: implement ability to save stuff
// TODO: fix pickr not opening
// TODO: undo button maybe
// TODO: fix second grid's size

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
const colorButton = document.getElementById('color-button');
const colorTooltip = document.getElementById('color-tooltip');
const displayColor = document.getElementById('colors');

const pickr = Pickr.create({
    el: '.color-picker',
    theme: 'nano', // or 'monolith',or 'nano'

    swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 0.95)',
        'rgba(156, 39, 176, 0.9)',
        'rgba(103, 58, 183, 0.85)',
        'rgba(63, 81, 181, 0.8)',
        'rgba(33, 150, 243, 0.75)',
        'rgba(3, 169, 244, 0.7)',
        'rgba(0, 188, 212, 0.7)',
        'rgba(0, 150, 136, 0.75)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(139, 195, 74, 0.85)',
        'rgba(205, 220, 57, 0.9)',
        'rgba(255, 235, 59, 0.95)',
        'rgba(255, 193, 7, 1)'
    ],

    position: 'right-end',

    useAsButton: true,

    components: {

        // Main components
        preview: true,
        opacity: true,
        hue: true,

        // Input / output Options
        interaction: {
            hex: false,
            rgba: false,
            hsla: false,
            hsva: false,
            cmyk: false,
            input: false,
            clear: false,
            save: false
        }
    }
});

const padHeight = window.innerHeight;
const padWidth = window.innerWidth - 75;

let isEraserOn = false;
let isPickrOn = false;
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
  handleTooltip(colorButton, colorTooltip, 'mousedown');

  configureButtons();

  handleColorChange();
}

function handleColorChange() {
  pickr.on('change', (color) => {
    const hexColor = color.toHEXA().toString();
    currBrushColor = hexColor;
    displayColor.style.setProperty('--color', currBrushColor);
  })
}

document.querySelector('.test').addEventListener('click', () => {
  pickr.hide();
})

function configureButtons() {
  colorButton.addEventListener('click', () => {
    handleColorPicker();
  })

  eraserButton.addEventListener('click', () => {
    handleButtonToggle(eraserButton, eraserIcon);
    handleEraser();
  })

  clearButton.addEventListener('click', () => {
    clearGrid();
  })
}

function handleButtonToggle(button, icon = null) {
  button.classList.toggle('toggled');

  if (icon !== null) {
    icon.classList.toggle('toggled');
  }
}

function handleColorPicker() {
  pickr.on('hide', () => {
    console.log('2')
    colorButton.classList.toggle('toggled');
  }).on('init', () => {
    console.log('1')
    colorButton.classList.toggle('toggled');
  })
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
    addNewGrid();
  
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

function addNewGrid() {
  const newGrid = createGrid(currGridDimension);
  body.appendChild(newGrid);
  gridList.push(newGrid);
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

  addNewGrid();
}

function handleDrawingLogic(container, color, target) {
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

function createGrid(columns) {
  const container = document.createElement('div');
  container.className = 'container';

  for (let i = 0; i < columns; i++) {
    const column = createColumn(columns, padHeight, padWidth);
    container.appendChild(column);
  }

  handleDrawingLogic(container, currBrushColor, 'box');

  return container;
}

function determineNumBoxesInColumn(columns, totalHeight, totalWidth) {
  const heightWidthRatio = totalHeight / totalWidth;
  const numBoxesRaw = columns * heightWidthRatio;
  const numBoxesRounded = Math.floor(numBoxesRaw);

  return numBoxesRounded;
}

function createColumn(columns, totalHeight, totalWidth) {
  const column = document.createElement('div');
  column.className = 'column';
  
  column.style.height = totalHeight;
  column.style.width = totalWidth / columns;

  const boxes = determineNumBoxesInColumn(columns, totalHeight, totalWidth);

  for (let i = 0; i < boxes; i++) {
    const box = createBox(columns, totalHeight, totalWidth);
    column.appendChild(box);
  }

  return column;
}

function createBox(numContainers, totalHeight, totalWidth) {
  const box = document.createElement('div')

  box.classList.add('box');

  box.style.height = totalHeight / (numContainers ** 2);
  box.style.width = totalWidth / (numContainers ** 2);

  return box
}

function main() {
  addNewGrid();

  checkMouseDown();
  addEventListeners();
}

main();