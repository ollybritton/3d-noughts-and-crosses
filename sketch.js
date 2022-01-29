function setup() {
  createCanvas(400, 400, WEBGL);
  createEasyCam();

  document.oncontextmenu = function () {
    return false;
  };
}

function draw() {
  background(220);
  stroke(0, 0, 0, 50);
  fill(255, 255, 255, 20);

  translate(-width / 2, -height / 4);

  box(100);
  translate(100, 0, 0);
  box(100);
  translate(100, 0, 0);
  box(100);
  translate(-200, 0, 0);
  translate(0, 100, 0);

  box(100);
  translate(100, 0, 0);
  box(100);
  translate(100, 0, 0);
  box(100);
  translate(-200, 0, 0);
  translate(0, 100, 0);

  box(100);
  translate(100, 0, 0);
  box(100);
  translate(100, 0, 0);
  box(100);
  translate(-200, 0, 0);
  translate(0, 100, 0);

  translate(0, -300, 0);
  translate(0, 0, 100);

  fill(255, 0, 0);

  box(100);
  translate(100, 0, 0);
  box(100);
  translate(100, 0, 0);
  box(100);
  translate(-200, 0, 0);
  translate(0, 100, 0);

  box(100);
  translate(100, 0, 0);
  box(100);
  translate(100, 0, 0);
  box(100);
  translate(-200, 0, 0);
  translate(0, 100, 0);

  box(100);
  translate(100, 0, 0);
  box(100);
  translate(100, 0, 0);
  box(100);
  translate(-200, 0, 0);
  translate(0, 100, 0);

  translate(0, -300, 0);
  translate(0, 0, 100);

  box(100);
  translate(100, 0, 0);
  box(100);
  translate(100, 0, 0);
  box(100);
  translate(-200, 0, 0);
  translate(0, 100, 0);

  box(100);
  translate(100, 0, 0);
  box(100);
  translate(100, 0, 0);
  box(100);
  translate(-200, 0, 0);
  translate(0, 100, 0);

  box(100);
  translate(100, 0, 0);
  box(100);
  translate(100, 0, 0);
  box(100);
  translate(-200, 0, 0);
  translate(0, 100, 0);

  translate(0, -300, 0);
  translate(0, 0, 100);

  fill(255, 255, 255, 20);
}
