const body = document.body;
const slider = document.querySelector('.range-slider');
const brushTooltip = document.getElementById('brush-tooltip');
const padHeight = window.innerHeight;
const padWidth = window.innerWidth - 75;

let isMouseDown = false;

// TODO: Must create a new container each time the slider changes
function addEventListeners() {
  changeBrushThickness();
  handleToolTip(slider, brushTooltip);
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

function handleButtonHover(button) {

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
        box.obj.style.backgroundColor = 'black';
        box.obj.style.opacity = '100%';
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
