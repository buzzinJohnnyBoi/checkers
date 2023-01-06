function pickUpPiece(board, p1, p2) {
    if(isMouseOnChecker(p1, board) === false && isMouseOnChecker(p2, board) === false) {
        if(game.SelectedChecker !== undefined && game.SelectedChecker.side == game.whoseTurn) {
            var square = isMouseOnSquare(board);
            if(square !== false) {
                var whichMove = moveInMoves(square, game.SelectedCheckerPossibleMoves);
                if(whichMove !== false) {
                    game.board[square[1]][square[0]] = game.board[game.SelectedChecker.col][game.SelectedChecker.row];
                    game.board[game.SelectedChecker.col][game.SelectedChecker.row] = 0;
                    
                    game.moving = true;
                    game.moveToIncrement.x = (square[0] - game.SelectedChecker.row)/game.animationTime;
                    game.moveToIncrement.y = (square[1] - game.SelectedChecker.col)/game.animationTime;

                    setTimeout( function() {
                        game.SelectedChecker.row = square[0];
                        game.SelectedChecker.col = square[1];
                        
                        removeCheckers(game.SelectedCheckerPossibleMoves[whichMove], game.SelectedChecker.side);
                        
                        if(game.SelectedChecker.isKing == false && (square[1] == 0 || board.cols - 1 == square[1])) {
                            game.SelectedChecker.isKing = true;
                        }
                        game.moving = false;
                        if(game.SelectedCheckerPossibleMoves[whichMove].take == undefined || calcDoubleJumps(game.SelectedChecker) == false) {
                            endTurn();
                        }
                        else {
                            game.doubleJumping = true;
                        }
                    }, game.animationTime * 1000/game.FPS);
                }
                else {
                    game.SelectedChecker = undefined;
                    game.SelectedCheckerPossibleMoves = [];
                }
            }
        }
    }

    else {
        if(game.doubleJumping != true) {
            if (isMouseOnChecker(p1, board) !== false) {
                if(game.whoseTurn == p1.checkers[isMouseOnChecker(p1, board)].side) {
                    game.SelectedChecker = p1.checkers[isMouseOnChecker(p1, board)];
                    game.SelectedCheckerPossibleMoves = calc_moves(game.SelectedChecker);
                }
            }
            else {
                if(game.whoseTurn == p2.checkers[isMouseOnChecker(p2, board)].side) {
                    game.SelectedChecker = p2.checkers[isMouseOnChecker(p2, board)];
                    game.SelectedCheckerPossibleMoves = calc_moves(game.SelectedChecker);
                }
            }
        }
        else {
            var square = isMouseOnSquare(board);
            if(game.SelectedChecker != undefined && square[0] === game.SelectedChecker.row && square[1] === game.SelectedChecker.col) {

            }
            else {
                endTurn();
            }
        }
    }
}

function removeCheckers(move, playerNum) {
    var oppObj;
    if (move.take == undefined) {
        return ;
    }
    if (playerNum == 0) {
        oppObj = player2;
    }
    else {
        oppObj = player1;
    }
    for (let i = 0; i < move.take.length; i++) {
        oppObj.checkers.splice(ispieceOnSquare(move.take[i][0], move.take[i][1]), 1);
        game.board[move.take[i][1]][move.take[i][0]] = 0;
    }
}

function ispieceOnSquare(x, y) {
    for (let i = 0; i < player1.checkers.length; i++) {
        const checker = player1.checkers[i];
        if(checker.row == x && checker.col == y) {
            return i;
        } 
    }
    for (let i = 0; i < player2.checkers.length; i++) {
        const checker = player2.checkers[i];
        if(checker.row == x && checker.col == y) {
            return i;
        } 
    }
}


function putDownPiece(board, p1, p2) {
    // console.log(isMouseOnChecker(p1, board));
    // console.log(isMouseOnChecker(p2, board));
}


function isMouseOnChecker(player, board) {
    var minX = parseInt(canvas.style.left);
    var minY = parseInt(canvas.style.top);
    var size = canvas.width / board.rows;
    for (let i = 0; i < player.checkers.length; i++) {
        const centerX = minX + player.checkers[i].row * size + size/2;
        const centerY = minY + player.checkers[i].col * size+ size/2;
        if(centerX - size/2 <= mouse.x && centerX + size/2 >= mouse.x) {
            if(centerY - size/2 <= mouse.y && centerY + size/2 >= mouse.y) {
                return i;
            }
        }
    }
    return false;
}

function isMouseOnSquare(board) {
    var minX = parseInt(canvas.style.left);
    var minY = parseInt(canvas.style.top);
    var size = canvas.width / board.rows;
    for (let y = 0; y < board.rows; y++) {
        for (let x = 0; x < board.rows; x++) {
            const centerX = minX + x * size + size/2;
            const centerY = minY + y * size + size/2;
            if(centerX - size/2 <= mouse.x && centerX + size/2 >= mouse.x) {
                if(centerY - size/2 <= mouse.y && centerY + size/2 >= mouse.y) {
                    return [x, y];
                }
            }
        }
    }
    return false;
}

function moveInMoves(move, arrayMoves) {
    var row = move[0];
    var col = move[1];
    for (let i = 0; i < arrayMoves.length; i++) {
        if(arrayMoves[i].x == row && arrayMoves[i].y == col) {
            return i;
        }        
    }
    return false;
}

function calc_moves(checker) {
    var dir;
    var moveArr = [];
    var playerObj;
    var oppObj;

    var cantake = false;


    if (checker.side == 0) { dir = 1; playerObj = player1; oppObj = player2;}
    else if (checker.side == 1) { dir = -1; playerObj = player2; oppObj = player1;}
    
    if(game.forceJump == true) {
        for (let i = 0; i < playerObj.checkers.length; i++) {
            if(calcDoubleJumps(playerObj.checkers[i])) {
                cantake = true;
                break;
            }
        }
    }

    
    if(cantake == false) {
        if (ismoveOnBoard(checker.row - 1, checker.col + dir) && game.board[checker.col + dir][checker.row - 1] == 0) {
            moveArr.push({x: checker.row - 1, y: checker.col + dir});        
        }
        if (ismoveOnBoard(checker.row + 1, checker.col + dir) && game.board[checker.col + dir][checker.row + 1] == 0) {
            moveArr.push({x: checker.row + 1, y: checker.col + dir});        
        }
        // console.log(game.board[checker.col + dir][checker.row + 1])
        // console.log(game.board[checker.col + dir][checker.row + -1])
    
        if (checker.isKing == true) {
    
            if (ismoveOnBoard(checker.row - 1, checker.col - dir) && game.board[checker.col - dir][checker.row - 1] == 0) {
                moveArr.push({x: checker.row - 1, y: checker.col - dir});        
            }
            if (ismoveOnBoard(checker.row + 1, checker.col - dir) && game.board[checker.col - dir][checker.row + 1] == 0) {
                moveArr.push({x: checker.row + 1, y: checker.col - dir});        
            }
        }
    }
    return calcTakeMoves(moveArr, checker, oppObj.num, dir);
}
//-----------------
function calcTakeMoves(moveArr, checker, oppNum, dir) {
    if (ismoveOnBoard(checker.row - 1, checker.col + dir) && ismoveOnBoard(checker.row - 2, checker.col + dir * 2) && game.board[checker.col + dir][checker.row - 1] == oppNum && game.board[checker.col + dir * 2][checker.row - 2] == 0) {
        moveArr.push({x: checker.row - 2, y: checker.col + dir * 2, take: [[checker.row - 1, checker.col + dir]]});  
    }
    if (ismoveOnBoard(checker.row + 1, checker.col + dir) && ismoveOnBoard(checker.row + 2, checker.col + dir * 2) && game.board[checker.col + dir][checker.row + 1] == oppNum && game.board[checker.col + dir * 2][checker.row + 2] == 0) {
        moveArr.push({x: checker.row + 2, y: checker.col + dir * 2, take: [[checker.row + 1, checker.col + dir]]});        
    }
    if (checker.isKing == true) {
        if (ismoveOnBoard(checker.row - 1, checker.col - dir) && game.board[checker.col - dir][checker.row - 1] == oppNum && ismoveOnBoard(checker.row - 2, checker.col - dir * 2) && game.board[checker.col - dir * 2][checker.row - 2] == 0) {
            moveArr.push({x: checker.row - 2, y: checker.col - dir * 2, take: [[checker.row - 1, checker.col - dir]]});        
        }
        if (ismoveOnBoard(checker.row + 1, checker.col - dir) && game.board[checker.col - dir][checker.row + 1] == oppNum && ismoveOnBoard(checker.row + 2, checker.col - dir * 2) && game.board[checker.col - dir * 2][checker.row + 2] == 0) {
            moveArr.push({x: checker.row + 2, y: checker.col - dir * 2, take: [[checker.row + 1, checker.col - dir]]});        
        }
    }
    return moveArr;

}



function calcDoubleJumps(checker) {
    var dir;
    var moveArr = [];
    var playerObj;
    var oppObj;
    if (checker.side == 0) { dir = 1; playerObj = player1; oppObj = player2; oppNum = 2;}
    else if (checker.side == 1) { dir = -1; playerObj = player2; oppObj = player1; oppNum = 1;}

    if (ismoveOnBoard(checker.row - 1, checker.col + dir) && ismoveOnBoard(checker.row - 2, checker.col + dir * 2) && game.board[checker.col + dir][checker.row - 1] == oppNum && game.board[checker.col + dir * 2][checker.row - 2] == 0) {
        moveArr.push({x: checker.row - 2, y: checker.col + dir * 2, take: [[checker.row - 1, checker.col + dir]]});  
    }
    if (ismoveOnBoard(checker.row + 1, checker.col + dir) && ismoveOnBoard(checker.row + 2, checker.col + dir * 2) && game.board[checker.col + dir][checker.row + 1] == oppNum && game.board[checker.col + dir * 2][checker.row + 2] == 0) {
        moveArr.push({x: checker.row + 2, y: checker.col + dir * 2, take: [[checker.row + 1, checker.col + dir]]});        
    }
    if (checker.isKing == true) {
        if (ismoveOnBoard(checker.row - 1, checker.col - dir) && game.board[checker.col - dir][checker.row - 1] == oppNum && ismoveOnBoard(checker.row - 2, checker.col - dir * 2) && game.board[checker.col - dir * 2][checker.row - 2] == 0) {
            moveArr.push({x: checker.row - 2, y: checker.col - dir * 2, take: [[checker.row - 1, checker.col - dir]]});        
        }
        if (ismoveOnBoard(checker.row + 1, checker.col - dir) && game.board[checker.col - dir][checker.row + 1] == oppNum && ismoveOnBoard(checker.row + 2, checker.col - dir * 2) && game.board[checker.col - dir * 2][checker.row + 2] == 0) {
            moveArr.push({x: checker.row + 2, y: checker.col - dir * 2, take: [[checker.row + 1, checker.col - dir]]});        
        }
    }
    if(moveArr.length == 0) {
        return false;
    }
    game.SelectedCheckerPossibleMoves = [];
    game.SelectedCheckerPossibleMoves = moveArr;
    return true;
}

function endTurn() {
    game.moving = false;
    game.numDoubleJumps = 0;
    game.SelectedChecker = undefined;
    game.doubleJumping = false;
    game.SelectedCheckerPossibleMoves = [];


    //----------------start
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
    // canvas.style.top = board1.y + "px";
    canvas.width = size;
    canvas.height = size;


    var color; 
    var squareSize = size / board1.rows;
    for (let y = 0; y < board1.rows; y++) {
        for (let x = 0; x < board1.rows; x++) {
            if(y % 2 == 0) {
                if(x % 2 == 0) {
                    color = board1.Color1;
                }
                else {
                    color = board1.Color2;
                }
            }
            else {
                if(x % 2 == 0) {
                    color = board1.Color2;
                }
                else {
                    color = board1.Color1;
                }
            }
            ctx.fillStyle = color;
            ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
        }  
    }
    player1.checkers.forEach(checker => {
        drawChecker(checker.row, checker.col, squareSize, player1.color, checker.isKing, player1.kingColor);
    });
    player2.checkers.forEach(checker => {
        drawChecker(checker.row, checker.col, squareSize, player2.color, checker.isKing, player2.kingColor);
    });


    //---------


    if(game.numplayers == 2) {
        if(game.whoseTurn == 0) {game.whoseTurn = 1;}
        else if(game.whoseTurn == 1) {game.whoseTurn = 0;}
    }
    if(game.numplayers == 1) {
        if(game.whoseTurn == 0) {game.whoseTurn = 1;}
        else if(game.whoseTurn == 1) {game.whoseTurn = 0; playrandomMove(player1);}
    }
    if(game.numplayers == 0) {
        if(game.whoseTurn == 0) {game.whoseTurn = 1; playrandomMove(player2);}
        else if(game.whoseTurn == 1) {game.whoseTurn = 0; playrandomMove(player1);}
    }

    if(player1.checkers.length == 0) {
        gameOver(player2);
    }
    else if(player2.checkers.length == 0) {
        gameOver(player1)
    }

    else if(calcAllMoves(player1) == []) {
        gameOver(player2);
    }
    else if(calcAllMoves(player2) == []) {
        gameOver(player1)
    }
}




function playMove(playerObj, move, index) {
    game.numDoubleJumps = 0;

    var SelectedChecker = playerObj.checkers[move.index];
    var x = move.moves[index].x;
    var y = move.moves[index].y;
    var oldX = SelectedChecker.row;
    var oldY = SelectedChecker.col;

    game.SelectedChecker = SelectedChecker;
    var animationTime = game.animationTime * 1000/game.FPS;
    if(move.moves[index].visit != undefined) {
        animationTime *= (move.moves[index].visit.length + 1); 
        x = move.moves[index].visit[0][0];
        y = move.moves[index].visit[0][1];
        game.numDoubleJumps = move.moves[index].visit.length;
        game.visits = move.moves[index].visit;
        game.movIngTo.x = move.moves[index].x;
        game.movIngTo.y = move.moves[index].y;
        game.DJindex = 0;
    }
    else {
        game.numDoubleJumps = 0;
        game.visits = [];
        game.movIngTo.x = -1;
        game.movIngTo.y = -1;
        game.DJindex = 0;
    }

    game.moving = true;
    game.moveToIncrement.x = (x - SelectedChecker.row)/game.animationTime;
    game.moveToIncrement.y = (y - SelectedChecker.col)/game.animationTime;

    setTimeout( function() {
        game.moving = false;

        // console.log(game.board[SelectedChecker.col][SelectedChecker.row]);

        SelectedChecker.row = move.moves[index].x;
        SelectedChecker.col = move.moves[index].y;

        game.board[SelectedChecker.col][SelectedChecker.row] = playerObj.num;
        game.board[oldY][oldX] = 0;

        // console.log(SelectedChecker.row);
        // console.log(SelectedChecker.col);
        // console.log(SelectedChecker.side);

        
    
        removeCheckers(move.moves[index], SelectedChecker.side);
        if (move.moves[index].king !== undefined) {
            SelectedChecker.isKing = true;
        }
        endTurn();
    }, animationTime);

}

var onehundoarr1 = []
var onehundoarr2 = []

function playrandomMove(player) {
    if(player.checkers.length <= 0) {
        game.gameOver = true;
        return ;
    }
    
    var moveArr = calcAllMoves(player);
    
    
    if(moveArr.length <= 0) {
        game.gameOver = true;
        return ;
    }

    // if(player == player1) {AI.depth = Math.floor(-0.5 * player2.checkers.length + 9);}
    // if(player == player2) {AI.depth = Math.round(-0.5 * player1.checkers.length + 9);}


    var move1;
    if(player == player1) { move1 = AIEval(moveArr, player2, player1, AI.depth);  }
    if(player == player2) { move1 = AIEval(moveArr, player1, player2, AI.depth);  }

    // if(player == player1) { move1 = AIEval2(moveArr, player2, player1);  }
    // if(player == player2) { move1 = AIEval2(moveArr, player1, player2);  }

    // console.log(move1.value1)
    // console.log(game.board)
    // console.log(move1)
    // console.log(moveArr)
    playMove(player, moveArr[move1.index], move1.indexMove);

    // if(player == player1) { onehundoarr1.push({input: parseArray(game.board, player1), output: [move1.value1]})  }
    // if(player == player2) { onehundoarr2.push({input: parseArray(game.board, player2), output: [move1.value1]})  }
    
    // var maxLength = 0;
    // for (let i = 0; i < moveArr.length; i++) {
    //     for (let j = 0; j < moveArr[i].moves.length; j++) {
    //         if(moveArr[i].moves[j].take != undefined) {
    //             if(moveArr[i].moves[j].take.length > maxLength) {
    //                 randNum1 = i;
    //                 randNum2 = j;
    //                 maxLength = moveArr[i].moves[j].take.length;
    //             }
    //         }
    //     }
    // }
    // console.log(moveArr[randNum1])
    // console.log(randNum2)
    // var currentNum = localStorage.getItem("num");
    // if(currentNum == null) {
    //     localStorage.setItem("num", 0);
    // }
//     currentNum++;
//     localStorage.setItem("num", currentNum);
// console.log(currentNum)

}

function randNum(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function ismoveOnBoard(row, col) {
    if (row < 0 || row > 7) {
        return false;
    }
    if(col < 0 || col > 7) {
        return false;
    }
    return true;
}





//-----------------

function gameOver(winner) {
    if(game.numplayers == 0) {
        if(winner == player1) {
            checkerAI2.train(onehundoarr1);
            for (let i = 0; i < onehundoarr1.length; i++) {
                data.push(onehundoarr1[i]);       
            }
        }
        else {
            checkerAI2.train(onehundoarr2);
            for (let i = 0; i < onehundoarr2.length; i++) {
                data.push(onehundoarr2[i]);       
            }
        }
        onehundoarr1 = []
        onehundoarr2 = []
    }
    player1.checkers = [];
    player2.checkers = [];
    game.board = [
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
    ]
    AddCheckers(player1, true, board1);
    AddCheckers(player2, false, board1);
}

function forceJump(bool) {
    game.forceJump = bool;
    document.querySelector(".screen").style.display = "none";
}