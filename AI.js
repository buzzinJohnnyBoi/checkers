function calcAllMoves(player) {
    var moveArr = [];
    var dir;
    var oppNum;
    if (player.checkers[0].side == 0) { dir = 1; oppNum = 2;}
    else if (player.checkers[0].side == 1) { dir = -1; oppNum = 1;}


    var musttake = false;
    if(game.forceJump == true) {
        for (let i = 0; i < player.checkers.length; i++) {
            if(calcDoubleJumps(player.checkers[i])) {
                musttake = true;
                break;
            }
        }
    }

    for (let i = 0; i < player.checkers.length; i++) {
        var piece = player.checkers[i];
        game.board[piece.col][piece.row] = 0;
        const element = calc_moves_AI(player.checkers[i], dir, oppNum, musttake);
        if(element.length > 0) {
            moveArr.push({index: i, moves: element});
        }
        game.board[piece.col][piece.row] = player.checkers[0].side + 1;
    }
    return moveArr;
}

function calc_moves_AI(checker, dir, oppNum, takeMove) {
    var moveArr = [];
    if(!takeMove) {
        if (ismoveOnBoard(checker.row - 1, checker.col + dir) && game.board[checker.col + dir][checker.row - 1] == 0) {
            moveArr.push({x: checker.row - 1, y: checker.col + dir});        
        }
        if (ismoveOnBoard(checker.row + 1, checker.col + dir) && game.board[checker.col + dir][checker.row + 1] == 0) {
            moveArr.push({x: checker.row + 1, y: checker.col + dir});        
        }
    
        if (checker.isKing == true) {
    
            if (ismoveOnBoard(checker.row - 1, checker.col - dir) && game.board[checker.col - dir][checker.row - 1] == 0) {
                moveArr.push({x: checker.row - 1, y: checker.col - dir});        
            }
            if (ismoveOnBoard(checker.row + 1, checker.col - dir) && game.board[checker.col - dir][checker.row + 1] == 0) {
                moveArr.push({x: checker.row + 1, y: checker.col - dir});        
            }
        }
        if(checker.isKing == false) {
            for (let i = 0; i < moveArr.length; i++) {
                if (moveArr[i].y == 7 || moveArr[i].y == 0) {
                    moveArr[i].king = true;
                }
            }
        }
    }

    return calcTakeMovesAI(moveArr, checker, dir, oppNum);
}

function calcTakeMovesAI(moveArr, checker, dir, oppNum) {
    if (ismoveOnBoard(checker.row - 1, checker.col + dir) && ismoveOnBoard(checker.row - 2, checker.col + dir * 2) && game.board[checker.col + dir][checker.row - 1] == oppNum && game.board[checker.col + dir * 2][checker.row - 2] == 0) {
        moveArr.push({x: checker.row - 2, y: checker.col + dir * 2, take: [[checker.row - 1, checker.col + dir]]});  
        var TC;
        if((checker.col + dir * 2 == 0 || checker.col + dir * 2 == 7) && checker.isKing == false) {
            TC = new Tempchecker(checker.row - 2, checker.col + dir * 2, true, checker.side);
        }
        else {
            TC = new Tempchecker(checker.row - 2, checker.col + dir * 2, checker.isKing, checker.side);
        }
        calcDoubleJumpsAI(moveArr, TC, dir, oppNum, [[checker.row - 1, checker.col + dir]], []);
    }
    if (ismoveOnBoard(checker.row + 1, checker.col + dir) && ismoveOnBoard(checker.row + 2, checker.col + dir * 2) && game.board[checker.col + dir][checker.row + 1] == oppNum && game.board[checker.col + dir * 2][checker.row + 2] == 0) {
        moveArr.push({x: checker.row + 2, y: checker.col + dir * 2, take: [[checker.row + 1, checker.col + dir]]});        
        var TC;
        if((checker.col + dir * 2 == 0 || checker.col + dir * 2 == 7) && checker.isKing == false) {
            TC = new Tempchecker(checker.row + 2, checker.col + dir * 2, true, checker.side);
        }
        else {
            TC = new Tempchecker(checker.row + 2, checker.col + dir * 2, checker.isKing, checker.side);
        }
        calcDoubleJumpsAI(moveArr, TC, dir, oppNum, [[checker.row + 1, checker.col + dir]], []);
    }
    if (checker.isKing == true) {
        if (ismoveOnBoard(checker.row - 1, checker.col - dir) && game.board[checker.col - dir][checker.row - 1] == oppNum && ismoveOnBoard(checker.row - 2, checker.col - dir * 2) && game.board[checker.col - dir * 2][checker.row - 2] == 0) {
            moveArr.push({x: checker.row - 2, y: checker.col - dir * 2, take: [[checker.row - 1, checker.col - dir]]});        
            var TC = new Tempchecker(checker.row - 2, checker.col - dir * 2, checker.isKing, checker.side);
            calcDoubleJumpsAI(moveArr, TC, dir, oppNum, [[checker.row - 1, checker.col - dir]], []);
        }
        if (ismoveOnBoard(checker.row + 1, checker.col - dir) && game.board[checker.col - dir][checker.row + 1] == oppNum && ismoveOnBoard(checker.row + 2, checker.col - dir * 2) && game.board[checker.col - dir * 2][checker.row + 2] == 0) {
            moveArr.push({x: checker.row + 2, y: checker.col - dir * 2, take: [[checker.row + 1, checker.col - dir]]});        
            var TC = new Tempchecker(checker.row + 2, checker.col - dir * 2, true, checker.side);

            calcDoubleJumpsAI(moveArr, TC, dir, oppNum, [[checker.row + 1, checker.col - dir]], []);
        }
    }

    if(checker.isKing == false) {
        for (let i = 0; i < moveArr.length; i++) {
            if ((moveArr[i].y == 7 || moveArr[i].y == 0) && moveArr[i].king != true) {
                moveArr[i].king = true;
            }
        }
    }

    return moveArr;

}

function calcDoubleJumpsAI(moveArr, checker, dir, oppNum, takeArr, visitArr) {
    var TC1 = undefined;
    var TC2 = undefined;
    if (ismoveOnBoard(checker.row - 1, checker.col + dir) && ismoveOnBoard(checker.row - 2, checker.col + dir * 2) && game.board[checker.col + dir][checker.row - 1] == oppNum && game.board[checker.col + dir * 2][checker.row - 2] == 0) {
        var temp = false;
        for (let i = 0; i < takeArr.length; i++) {
            if(takeArr[i][0] == checker.row - 1 && takeArr[i][1] == checker.col + dir) {
                temp = true;
            }
        }
        if(!temp) {
            var take = takeArr.slice();
            var visit = visitArr.slice();
            take.push([checker.row - 1, checker.col + dir]);
            visit.push([checker.row, checker.col]);
            var changeBack = false;
            if(checker.isKing == false && (checker.col + dir * 2 == 7 || checker.col + dir * 2 == 0)) {
                changeBack = true;
                checker.isKing = true;
                moveArr.push({x: checker.row - 2, y: checker.col + dir * 2, take: take, visit: visit, king: true});
            }  
            else if(checker.isKing == true) {
                moveArr.push({x: checker.row - 2, y: checker.col + dir * 2, take: take, visit: visit, king: true});
            }
            else { 
                moveArr.push({x: checker.row - 2, y: checker.col + dir * 2, take: take, visit: visit});
            }
            TC1 = new Tempchecker(checker.row - 2, checker.col + dir * 2, checker.isKing, checker.side);
            calcDoubleJumpsAI(moveArr, TC1, dir, oppNum, take.slice(), visit.slice());
            if(changeBack == true) {
                checker.isKing = false;
            }
        }
    }
    if (ismoveOnBoard(checker.row + 1, checker.col + dir) && ismoveOnBoard(checker.row + 2, checker.col + dir * 2) && game.board[checker.col + dir][checker.row + 1] == oppNum && game.board[checker.col + dir * 2][checker.row + 2] == 0) {
        var temp = false;
        for (let i = 0; i < takeArr.length; i++) {
            if(takeArr[i][0] == checker.row + 1 && takeArr[i][1] == checker.col + dir) {
                temp = true;
            }
        }
        if(!temp) {
            var take = takeArr.slice();
            var visit = visitArr.slice();
            take.push([checker.row + 1, checker.col + dir]);
            visit.push([checker.row, checker.col]);

            var changeBack = false;
            if(checker.isKing == false && (checker.col + dir * 2 == 7 || checker.col + dir * 2 == 0)) {
                changeBack = true;
                checker.isKing = true;
                moveArr.push({x: checker.row + 2, y: checker.col + dir * 2, take: take, visit: visit, king: true});
            }  
            else if(checker.isKing == true) {
                moveArr.push({x: checker.row + 2, y: checker.col + dir * 2, take: take, visit: visit, king: true});
            }
            else { 
                moveArr.push({x: checker.row + 2, y: checker.col + dir * 2, take: take, visit: visit});
            }     
            TC2 = new Tempchecker(checker.row + 2, checker.col + dir * 2, checker.isKing, checker.side);
            calcDoubleJumpsAI(moveArr, TC2, dir, oppNum, take.slice(), visit.slice());
            if(changeBack == true) {
                checker.isKing = false;
            }
        }
    }
    if (checker.isKing == true && ismoveOnBoard(checker.row - 1, checker.col - dir) && ismoveOnBoard(checker.row - 2, checker.col - dir * 2) && game.board[checker.col - dir][checker.row - 1] == oppNum && game.board[checker.col - dir * 2][checker.row - 2] == 0) {
        var temp = false;
        for (let i = 0; i < takeArr.length; i++) {
            if(takeArr[i][0] == checker.row - 1 && takeArr[i][1] == checker.col - dir) {
                temp = true;
            }
        }
        if(!temp) {
            var take = takeArr.slice();
            var visit = visitArr.slice();
            take.push([checker.row - 1, checker.col - dir]);
            visit.push([checker.row, checker.col]);

            var changeBack = false;
            if(checker.isKing == false && (checker.col - dir * 2 == 7 || checker.col - dir * 2 == 0)) {
                changeBack = true;
                checker.isKing = true;
                moveArr.push({x: checker.row - 2, y: checker.col - dir * 2, take: take, visit: visit, king: true});
            }  
            else if(checker.isKing == true) {
                moveArr.push({x: checker.row - 2, y: checker.col - dir * 2, take: take, visit: visit, king: true});
            }
            else { 
                moveArr.push({x: checker.row - 2, y: checker.col - dir * 2, take: take, visit: visit});
            }
 
            TC1 = new Tempchecker(checker.row - 2, checker.col - dir * 2, checker.isKing, checker.side);
            calcDoubleJumpsAI(moveArr, TC1, dir, oppNum, take.slice(), visit.slice());
            if(changeBack == true) {
                checker.isKing = false;
            }
        }
    }
    
    if (checker.isKing == true && ismoveOnBoard(checker.row + 1, checker.col - dir) && ismoveOnBoard(checker.row + 2, checker.col - dir * 2) && game.board[checker.col - dir][checker.row + 1] == oppNum && game.board[checker.col - dir * 2][checker.row + 2] == 0) {
        var temp = false;
        for (let i = 0; i < takeArr.length; i++) {
            if(takeArr[i][0] == checker.row + 1 && takeArr[i][1] == checker.col - dir) {
                temp = true;
            }
        }
        if(!temp) {
            var take = takeArr.slice();
            var visit = visitArr.slice();
            take.push([checker.row + 1, checker.col - dir]);
            visit.push([checker.row, checker.col]);

            var changeBack = false;
            if(checker.isKing == false && (checker.col - dir * 2 == 7 || checker.col - dir * 2 == 0)) {
                changeBack = true;
                checker.isKing = true;
                moveArr.push({x: checker.row + 2, y: checker.col - dir * 2, take: take, visit: visit, king: true});
            }  
            else if(checker.isKing == true) {
                moveArr.push({x: checker.row + 2, y: checker.col - dir * 2, take: take, visit: visit, king: true});
            }
            else { 
                moveArr.push({x: checker.row + 2, y: checker.col - dir * 2, take: take, visit: visit});
            }      
            TC2 = new Tempchecker(checker.row + 2, checker.col - dir * 2, checker.isKing, checker.side);
            calcDoubleJumpsAI(moveArr, TC2, dir, oppNum, take.slice(), visit.slice());
            if(changeBack == true) {
                checker.isKing = false;
            }
        }
    }
    return false;
}


class Tempchecker {
    constructor(row, col, isKing, side) {
        this.row = row;
        this.col = col;
        this.isKing = isKing;
        this.side = side;
    }
}






function go() {
    var moves = calcAllMoves(player1);
    game.SelectedChecker = player1.checkers[0];
    game.SelectedCheckerPossibleMoves = moves[0].moves;
}

go();