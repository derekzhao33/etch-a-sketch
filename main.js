const body = document.body;

let isMouseDown = false;

const slider = document.querySelector('.range-slider');

// TODO: Must create a new container each time the slider changes
function addSliderEventListener() {
  slider.onmouseup = function() {

  }
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

}

function createGrid(columns) {
  const container = document.createElement('div');
  container.className = 'container';
  body.appendChild(container);

  for (let i = 0; i < columns; i++) {
    const column = createColumn(columns)
    container.appendChild(column);

    column.offsetHeight = container.offsetHeight / columns;
    column.offsetWidth = container.offsetWidth / columns;
  }
}

function determineNumBoxesInColumn(columns) {
  const heightWidthRatio = container.offsetHeight / container.offsetWidth;
  const numBoxesRaw = columns * heightWidthRatio;
  const numBoxesRounded = Math.floor(numBoxesRaw);

  return numBoxesRounded;
}

function createColumn(columns) {
  const column = document.createElement('div');
  column.className = 'column';

  // TODO: container is not accessable from this scope, need to fix
  column.style.height = container.offsetHeight;
  column.style.width = container.offsetWidth / columns;

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
      }
    });

    column.appendChild(box.obj);

    box.obj.style.width = container.offsetWidth / (columns ** 2);
    box.obj.style.height = container.offsetHeight / (columns ** 2);
  }

  return column;
}

function main() {
  addSliderEventListener();
  createGrid(50)
  checkMouseDown();
}

main();
