const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

// load images
var bg = new Image();
bg.src = "background.png";

//Draw images
function draw() {
    ctx.drawImage(bg, 0, 0)
}

draw();