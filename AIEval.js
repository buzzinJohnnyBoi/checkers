var AI = {
    depth: 6,
    map: [
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [0.0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0],
        [0.0, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.0],
        [0.0, 0.1, 0.2, 0.3, 0.3, 0.2, 0.1, 0.0],
        [0.0, 0.1, 0.2, 0.3, 0.3, 0.2, 0.1, 0.0],
        [0.0, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.0],
        [0.0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0],
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    ]
    
}

//-------------
function AIEval2(moves, oppPlayer, player) {
    var index = 0;
    var move1 = 0;

    var bestEval = -20000;

    var listCheckers = player.checkers.slice();
    var listCheckers2 = oppPlayer.checkers.slice();
    for (let i = 0; i < moves.length; i++) {
        for (let move = 0; move < moves[i].moves.length; move++) {

            var m = moves[i].moves[move];         
            var checker = player.checkers[moves[i].index]
            var moveMade = makeMove(m, checker, player, oppPlayer);
            
            var value = evalPositionNN(game.board, player)[0];

            if(value > bestEval) {
                bestEval = value;
                index = i;
                move1 = move;
            }
            unmakeMove(moveMade, checker, player, oppPlayer);
            player.checkers = listCheckers.slice();
            oppPlayer.checkers = listCheckers2.slice();
        }
    }
    return {index: index, indexMove: move1, value1: bestEval}
}

//---------------

function AIEval(moves, oppPlayer, player, depth) {
    if(depth <= 0) {
        return 0;
    }

    var index = 0;
    var move1 = 0;

    var bestEval = -20000;

    var listCheckers = player.checkers.slice();
    var listCheckers2 = oppPlayer.checkers.slice();
    for (let i = 0; i < moves.length; i++) {
        for (let move = 0; move < moves[i].moves.length; move++) {

            var m = moves[i].moves[move];
            var value = valueMove(m, oppPlayer);
            
            var checker = player.checkers[moves[i].index]
            var moveMade = makeMove(m, checker, player, oppPlayer);

            if(depth == 1) {

            }
            else {
                if(oppPlayer.checkers.length > 0) {
                    var oppEval = AIEval(calcAllMoves(oppPlayer), player, oppPlayer, depth - 1);
                    value -= oppEval.value1;
                }
                else {
                    value += 1000;
                }
            }
            if(value > bestEval) {
                bestEval = value;
                index = i;
                move1 = move;
            }
            unmakeMove(moveMade, checker, player, oppPlayer);
            player.checkers = listCheckers.slice();
            oppPlayer.checkers = listCheckers2.slice();
        }
    }
    return {index: index, indexMove: move1, value1: bestEval}
}

function valueMove(move, oppPlayer) {
    var value = 0;
    // value += AI.map[move.y][move.x];

    if(move.king == true) {value ++;}
    if(move.take != undefined) {
        value += move.take.length;
        for (let i = 0; i < move.take.length; i++) {
            
            for (let j = 0; j < oppPlayer.checkers.length; j++) {
                if(oppPlayer.checkers[j].isKing == false) {continue;}
                if(oppPlayer.checkers[j].row == move.take[i][0] && oppPlayer.checkers[j].col == move.take[i][1]) {
                    value++;
                    break;
                }
            }          
        }
    }
    return value;
}


//----------------

function makeMove(move, checker, player, oppPlayer) {
   
    var x = checker.row;
    var y = checker.col;
    var oppCheckers = []


    game.board[move.y][move.x] = player.num;
    game.board[checker.col][checker.row] = 0;


    if(move.take != undefined) {
        for (let i = 0; i < move.take.length; i++) {
            for (let j = 0; j < oppPlayer.checkers.length; j++) {
                if(oppPlayer.checkers[j].row == move.take[i][0] && oppPlayer.checkers[j].col == move.take[i][1]) {
                    game.board[oppPlayer.checkers[j].col][oppPlayer.checkers[j].row] = 0;
                    oppCheckers.push(oppPlayer.checkers[j]);
                    oppPlayer.checkers.splice(j, 1);
                    break;
                }
            } 
            
        }
    }

    checker.row = move.x;
    checker.col = move.y;
    return {x: x, y: y, checkers: oppCheckers}
}

function unmakeMove(moveObj, checker, player, oppCheckers) {

    game.board[checker.col][checker.row] = 0;
    game.board[moveObj.y][moveObj.x] = player.num;
    // console.log(oppCheckers)
    for (let i = 0; i < moveObj.checkers.length; i++) {
        game.board[moveObj.checkers[i].col][moveObj.checkers[i].row] = oppCheckers.num;        
        // console.log(game.board[moveObj.checkers[i].col][moveObj.checkers[i].row])
    }
    checker.row = moveObj.x;
    checker.col = moveObj.y;
}