var Kingimg;
window.onload = function() {
    Kingimg = document.getElementById("king");
  };

function drawChecker(row, col, w, color, King, kingColor) {
    var x = row * w;
    var y = col * w;
    if(King) {
        drawFillCircle(x + w/2, y + w/2, w/2, color);
        ctx.drawImage(Kingimg, x + w/13, y + w/8, w/1.5 * 1.308, w/1.5);

    }
    else {
        drawFillCircle(x + w/2, y + w/2, w/2, color);
    }
}

function DrawPossibleMove(row, col, w, color) {
    var x = row * w;
    var y = col * w;
    drawFillRect(x, y, w, w, color);
}

function drawFillRect(x, y, w, h, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.stroke();
}

function drawFillCircle(x, y, r, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
}

var mouse = {
    pressed: false,
    lastPressed: false,
    lastPos: {
        x: 0,
        y: 0
    },
    x: 0,
    y: 0
}

function MouseUp(e) {
    if(mouse.pressed == true) {
        mouse.pressed = false;
    }
}
function MouseDown(e) {
    if(mouse.pressed == false) {
        mouse.pressed = true;
        if(game.adding == true) {
            addPiece();
        }
        else if (game.moving == false) {
            pickUpPiece(board1, player1, player2);
        }
    }
}

function MouseMove(e) {
    mouse.x = e.x;
    mouse.y = e.y;
}

document.addEventListener("mouseup", MouseUp);
document.addEventListener("mousedown", MouseDown);
document.addEventListener("mousemove", MouseMove);