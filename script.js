function startGame() {
  console.log("ciao")
  myGameArea.start();
  myGameArea.draw(redSquare);
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  }

}
var redSquare = {
  width: 20,
  height: 20,
  x: 10,
  y: 120,
  color: "red"
};




