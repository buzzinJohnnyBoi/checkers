// var total = 0;
// var count = 0;
// var Ncards = [1, 2, 3, 4, 5, 6, 7, 8, 9]
// var Acards = [1, 2, 3, 4, 5, 6, 7, 8, 9]

// for (let n = 1; n <= 9; n++) {
//     for (let a = 1; a <= 9; a++) {
//         ++total;
//         if(Math.abs(addUp(Ncards, n) - addUp(Acards, a)) % 4 == 0) {
//             count++;
//         }        
//     }
// }

// function addUp(arr, num) {
//     var value = 0;
//     for (let i = 0; i < arr.length; i++) {
//         value += arr[i];
//     }
//     return value - num;
// }

// var temp = true;
// while(temp == true) {
//     temp = false;
//     for (let i = 2; i < count; i++) {
//         if(count % i == 0 && total % i == 0)  {
//             temp = true;
//             count /= i;
//             total /= i;
//             break;
//         }
        
//     }
// }
// console.log(count);
// console.log(total);

var a = calcAllMoves(player1)[0].moves;
var temp = [[0, 1], [4, 1], [2, 3], [6, 3], [0, 5], [4, 5], [2, 7], [6, 7]];
var tempnums = [
    [0, 1],
    [4, 1],
    [2, 3],
    [6, 3],
    [0, 5],
    [4, 5],
    [2, 7],
    [6, 7],
];

for (let i = 0; i < a.length; i++) {
    const el = a[i];
    for (let i = 0; i < tempnums.length; i++) {
        if(el.x == tempnums[i][0] && el.y == tempnums[i][1]) {
            temp[i].push(a[i]);
        }
    }
}