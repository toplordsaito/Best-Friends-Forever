var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

// load images

var bg = new Image();
bg.src = "bg.png";

var move = [];
move[0] = {
    x: 6,
    y: 0
}

function draw(){
    
    for (var i=0; i<move.length; i++) {
        ctx.drawImage(bg, move[i].x, move[i].y);
        move[i].x -= 2;

        if (move[i].x == 0) {
            move.push({
                x: 800,
                y: 0
            })
        }
    }

    requestAnimationFrame(draw);
}

draw();
