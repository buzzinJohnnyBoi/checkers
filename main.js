var canvas = document.querySelector("#board");
var ctx = canvas.getContext("2d");

var setUp1 = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
]

var setUp2 = [
    [0, 0, 0, 2, 0, 2, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0],
]

var setUp3 = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0],
]


var setUp4 = [
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
]



var game = {
    SelectedChecker: undefined,
    SelectedCheckerPossibleMoves: [],
    whoseTurn: 1,
    board: setUp1,
    doubleJumping: false,
    highlightColor: "rgba(100, 100, 100, 0.5)",
    moving: false,
    moveToIncrement: {x: undefined, y: undefined},
    numDoubleJumps: 0,
    visits: [],
    movIngTo: {x: 0, y: 0},
    DJindex: 0,
    FPS: 60,
    adding: false,
    playerAdd: undefined,
    animationTime: 10,
    numplayers: 1,
    gameOver: false,
    forceJump: true
}

var board1 = {
    Color1: "tan",
    Color2: "rgb(128, 64, 0)",
    rows: 8,
    cols: 8,
    
}

var player1 = {
    color: "black",
    checkers: [],
    kingColor: "pink",
    num: 1
}
var player2 = {
    color: "rgb(255, 51, 51)",
    checkers: [],
    kingColor: "lightblue",
    num: 2
}

function AddCheckers(playerObj, topPlayer, board) {
    if (topPlayer) {
        for (let i = 0; i < game.board.length; i++) {
            for (let j = 0; j < game.board[i].length; j++) {
                if(game.board[i][j] == 1) {
                    playerObj.checkers.push(new checker(j, i, false, 0));
                }
            }
        }
    }
    else {
        for (let i = 0; i < game.board.length; i++) {
            for (let j = 0; j < game.board[i].length; j++) {
                if(game.board[i][j] == 2) {
                    playerObj.checkers.push(new checker(j, i, false, 1));
                }
            }
        }
    }
}

class checker {
    constructor(row, col, isKing, side) {
        this.row = row;
        this.col = col;
        this.isKing = isKing;
        this.side = side;
    }
}

function update() {
    if (game.moving == true) {
        game.SelectedChecker.row += game.moveToIncrement.x;
        game.SelectedChecker.col += game.moveToIncrement.y;
        if(game.numDoubleJumps > 0) {
            if(game.DJindex > game.visits.length - 1) {
                game.moveToIncrement.x = (game.movIngTo.x - game.SelectedChecker.row)/game.animationTime;
                game.moveToIncrement.y = (game.movIngTo.y - game.SelectedChecker.col)/game.animationTime;
            }
            else if(Math.abs(game.SelectedChecker.row - game.visits[game.DJindex][0]) < 0.0001 && Math.abs(game.SelectedChecker.col - game.visits[game.DJindex][1]) < 0.0001) {
                game.DJindex++;
                if(game.DJindex > game.visits.length - 1) {
                    game.moveToIncrement.x = (game.movIngTo.x - game.SelectedChecker.row)/game.animationTime;
                    game.moveToIncrement.y = (game.movIngTo.y - game.SelectedChecker.col)/game.animationTime;
                }
                else {
                    game.moveToIncrement.x = (game.visits[game.DJindex][0] - game.SelectedChecker.row)/game.animationTime;
                    game.moveToIncrement.y = (game.visits[game.DJindex][1] - game.SelectedChecker.col)/game.animationTime;
                }
            }
        }
    }
    updateBoard(board1, player1, player2);
}

function updateBoard(board, p1, p2) {    
    var size;
    if(window.innerHeight < window.innerWidth) {
        size = window.innerHeight;
        canvas.style.left = (window.innerWidth - size)/2 + "px";
        canvas.style.top = "0px";
    }
    else {
        size = window.innerWidth;
        canvas.style.top = (window.innerHeight - size)/2 + "px";
        canvas.style.left = "0px";
    }
    // canvas.style.top = board.y + "px";
    canvas.width = size;
    canvas.height = size;


    var color; 
    var squareSize = size / board.rows;
    for (let y = 0; y < board.rows; y++) {
        for (let x = 0; x < board.rows; x++) {
            if(y % 2 == 0) {
                if(x % 2 == 0) {
                    color = board.Color1;
                }
                else {
                    color = board.Color2;
                }
            }
            else {
                if(x % 2 == 0) {
                    color = board.Color2;
                }
                else {
                    color = board.Color1;
                }
            }
            ctx.fillStyle = color;
            if(game.SelectedChecker !== undefined && x == game.SelectedChecker.row && y == game.SelectedChecker.col) {
                ctx.fillStyle = "green";
            }
            ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
        }  
    }
    game.SelectedCheckerPossibleMoves.forEach(move => {
        DrawPossibleMove(move.x, move.y, squareSize, game.highlightColor);
    });
    p1.checkers.forEach(checker => {
        drawChecker(checker.row, checker.col, squareSize, p1.color, checker.isKing, p1.kingColor);
    });
    p2.checkers.forEach(checker => {
        drawChecker(checker.row, checker.col, squareSize, p2.color, checker.isKing, p2.kingColor);
    });
}

function addPiece() {
    var square = isMouseOnSquare(board1);
    console.log(square)
    if(square != false) {
        if(player1 == game.playerAdd) {
            game.playerAdd.checkers.push(new checker(square[0], square[1], false, 0));
            game.board[square[1]][square[0]] = 1;
        }
        if(player2 == game.playerAdd) {
            game.playerAdd.checkers.push(new checker(square[0], square[1], false, 1));
            game.board[square[1]][square[0]] = 2;
        }
    }
}


function change(num) {
    if(num == 1) {
        game.playerAdd = player1;
    }
    if(num == 2) {
        game.playerAdd = player2;
    }
}

function changeAdd() {
    if(game.adding) {
        game.adding = false;
    }
    else {
        game.adding = true;
    }
}


AddCheckers(player1, true, board1);
AddCheckers(player2, false, board1);




setInterval(update, 1000/game.FPS);
