var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;
var object = {
    height: 40,
    width: 40,
    x: 10,
    y: 10, 
    color: "#ff7373"        
}

document.addEventListener('keydown', function(event) {
    //left
    if(event.keyCode == 37) {
        object.x -= 10;
    }
    //top
    else if(event.keyCode == 38) {
        object.y -= 10;
    }
    //right
    else if(event.keyCode == 39) {
        object.x += 10;
    }
    //bottom
    else if(event.keyCode == 40) {
        object.y += 10;
    }
});

function renderCanvas(){
    ctx.fillStyle = "#ff7373";
    ctx.fillRect(0, 0, 600, 600);
} 
function renderObject(){
    // ctx.fillStyle = "#FF0000";
    // ctx.fillRect(object.x, object.y, object.width, object.height);
    const image = document.getElementById('source');
    ctx.drawImage(image, object.x, object.y, 60, 44);
}
function maxminplayer(){
    object.x = Math.max(Math.min(400, object.x), 0); 
    object.y = Math.max(Math.min(560, object.y), 0);
}


function run(){
    maxminplayer();
    renderCanvas();
    renderObject();
}

setInterval(run, 10);




























