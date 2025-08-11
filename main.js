const container = document.querySelector('.container');
let isMouseDown = false;

function checkMouseDown() {
  document.addEventListener('mousedown', () => {
      isMouseDown = true;
  })

  document.addEventListener('mouseup', () => {
      isMouseDown = false;
  })
}

function createGrid(dimension) {
  for (let i = 0; i < dimension; i++) {
    const column = createColumn(dimension)
    container.appendChild(column);

    column.offsetHeight = container.offsetHeight / dimension;
    column.offsetWidth = container.offsetWidth / dimension;
  }
}

function createColumn(dimension) {
  const column = document.createElement('div');
  column.classList.add('column');

  column.style.height = container.offsetHeight;
  column.style.width = container.offsetWidth / dimension;

  for (let i = 0; i < dimension; i++) {
    const box = document.createElement('div');
    box.classList.add('box');

    box.addEventListener('mouseover', () => {
      if (isMouseDown) {
        box.style.backgroundColor = 'black';
      }
    });

    column.appendChild(box);

    box.style.width = container.offsetWidth / (dimension ** 2);
    box.style.height = container.offsetHeight / (dimension ** 2);
  }

  return column;
}

function runSketchPad(dimension) {
  checkMouseDown();
  createGrid(dimension);
}

runSketchPad(75);