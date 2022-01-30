// SETTINGS contains options that change the behaviour of the program.
const SETTINGS = {
  unselectedAlpha: 20,
  colorX: {r: 114, g: 158, b: 161},
  colorY: {r: 219, g: 83, b: 117},
};

// grids represents the current state of the board.
// The arrays are indexed so that the inner-most array is the x-coordinate, the middle the y-coordinate and the outer-most array the z-coordinate.
let grids = [
  [
    ["X", "X", "O"],
    ["X", "O", "O"],
    ["O", "X", "X"],
  ],
  [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
  [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
];

// valueAt looks up a certain position in the grid.
function valueAt(x, y, z) {
  return grids[z][y][x]
}

function setup() {
  let canvas = createCanvas(windowWidth, windowWidth, WEBGL);
  // canvas.drawingContext.disable(canvas.drawingContext.DEPTH_TEST);

  let cam = createEasyCam();
  cam.setDistanceMin(550);
  cam.setDistanceMax(900);
}

function draw() {
  background(0);
  stroke(0, 0, 0, 50);

  translate(-100, -100, -100);

  stroke(40, 40, 40)
  strokeWeight(1)
  
  let highlightZ = document.getElementById("range").value;

  for (let z = 0; z < 3; z++) {
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        let mark = valueAt(x, y, z)
        if (mark != null) {
          let colors = (mark == "X") ? SETTINGS.colorX : SETTINGS.colorY
          
          
          if (z == highlightZ) {
            strokeWeight(4)
            fill(colors.r, colors.g, colors.b)
          } else {
            strokeWeight(6)
            stroke(colors.r, colors.g, colors.b, 20)
          }

        } else {
          noFill();
          stroke(40, 40, 40)
          strokeWeight(1)
          // noStroke();
        }

        box(100);
        translate(100, 0, 0);
      }
      translate(-300, 0, 0);
      translate(0, 100, 0);
    }

    translate(0, -300, 0);
    translate(0, 0, 120);
  }

  translate(0, 0, -200);
}
