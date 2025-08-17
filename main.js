const body = document.body;
const slider = document.querySelector('.range-slider');
const brushTooltip = document.getElementById('brush-tooltip');
const eraserButton = document.querySelector('.eraser');
const eraserIcon = document.getElementById('eraser-icon')
const clearButton = document.querySelector('.clear');
const clearIcon = document.getElementById('clear-icon');

const padHeight = window.innerHeight;
const padWidth = window.innerWidth - 75;

const buttonHoverColor = '#D1D1D6';
const buttonClickColor = '#D7D7DC'
const sliderThumbInputDimension = '20px';

let brushColor = 'black';
let isMouseDown = false;
let gridList = new Array();

// TODO: Must create a new container each time the slider changes
function addEventListeners() {
  changeBrushThickness();
  handleToolTip(slider, brushTooltip);
  handleButtonHover(eraserButton, eraserIcon);
  handleButtonHover(clearButton, clearIcon);
  handleButtonPress(clearButton, clearGrid);
  handleButtonPress(eraserButton, () => {brushColor = 'white'});
}

function handleButtonPress(button, func) {
  button.addEventListener('click', () => {
    func();
  })
}

function handleToolTip(element, tooltip) {
  let tooltipTimeout;

  element.addEventListener('mouseover', () => {
    tooltipTimeout = setTimeout(() => {
      tooltip.style.visibility = 'visible';
    }, 1000);
  });

  element.addEventListener('input', () => {
    tooltip.style.visibility = 'hidden';
    clearTimeout(tooltipTimeout);
  });

  element.addEventListener('mouseleave', () => {
    tooltip.style.visibility = 'hidden';
    clearTimeout(tooltipTimeout);
  });
}

function handleButtonHover(button, icon) {
  const originalColor = button.style.backgroundColor;
  let prevColor = '';

  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = buttonHoverColor;
    icon.style.backgroundColor = buttonHoverColor;
    prevColor = button.style.backgroundColor;
  })

  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = originalColor;
    icon.style.backgroundColor = originalColor;
    prevColor = button.style.backgroundColor;
  })

  button.addEventListener('mousedown', () => {
    button.style.backgroundColor = buttonClickColor;
    icon.style.backgroundColor = buttonClickColor;
  })

  button.addEventListener('mouseup', () => {
    button.style.backgroundColor = prevColor;
    icon.style.backgroundColor = prevColor;
  })
}

function changeBrushThickness() {
  slider.addEventListener('mouseup', () => {
    console.log(slider.value);
    createGrid(slider.value);
    
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
      console.log(isMouseDown);
  })

  document.addEventListener('mouseup', () => {
      isMouseDown = false;
      console.log(isMouseDown);
  })
}

function clearGrid() {
  let index = 0;

  if (gridList.length > 1) {
    let toRemove = gridList.splice(1);

    for (const grid of toRemove) {
      grid.remove();
    }
  } 

  let boxes = Array.from(document.querySelectorAll('.box'));

  for (const box of boxes) {
    box.style.backgroundColor = 'white';
  }
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

  // TODO: container is not accessable from this scope, need to fix
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
        box.obj.style.backgroundColor = brushColor;
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
  createGrid(slider.value);
  checkMouseDown();
  addEventListeners();
}

main();
