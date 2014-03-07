/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
window.printBoard = function (board){
  for (var i =0;i < board.length; i++){
    console.log(board[i]+"\n");
  }
};

window.getSpace = function (board, row, col){
  return board[row][col];
};
window.setSpace = function (board, row, col, value){
  board[row][col] = value;
  return board;
};
window.claimRow = function(board, row){
  for (var i =0; i< board[row].length; i++){
    if (board[row][i]==="0"){
      board[row][i]="X";
    }
  }
  return board;
};
window.claimCol = function(board, col){
  for (var i = 0; i < board.length; i++) {
    if (board[i][col] === "0") {
      board[i][col] = "X";
    }
  }
  return board;
};

window.setRook=function(board, row, col){
  board[row][col] = "R";
  window.claimRow(board, row);
  window.claimCol(board,col);
  return board;
};

window.hasRowConflict = function (board, row){
  for (var i = 0; i< board.length; i++){
    if (board[row][i] === "R" || board[row][i] === "Q"){
      return true;
    }
  }
  return false;

};
window.hasColConflict = function (board, col){
  for (var i = 0; i< board.length; i++){
    if (board[i][col] === "R" || board[i][col] === "Q"){
      return true;
    }
  }
  return false;

};
window.hasRookConflict = function (board, row, col){
  if (window.hasRowConflict(board, row)===true || window.hasColConflict(board, col) === true){
    return true;
  }
  return false;
};

window.makeBoard = function(n){
  var grid = [];
  for (var i=0; i<n; i++){
    grid.push([]);
    for (var j = 0; j< n; j++){
      grid[i].push('0');
    }
  }
  return grid;
};

window.convertBoardToNumeric = function(board) {
  for (var row=0; row < board.length; row++){
    for(var col = 0; col < board.length; col ++){
      if (board[row][col] === "Q" || board[row][col] === "R") {
        board[row][col] = 1;
      }
      else {
        board[row][col] = 0;
      }
    }
  }
  return board;
};
window.findNRooksSolution = function(n) {
  var board = makeBoard(n);
  for (var row=0; row < board.length; row++){
    for(var col = 0; col < board.length; col ++){
      if (window.hasRookConflict(board, row, col) === false && board[row][col]==="0"){
        window.setRook(board, row, col);
      }
    }
  }
  return window.convertBoardToNumeric(board);
};

window.countNobles = function(board){
  var total = 0;
  for (var row = 0; row<board.length; row++){
    for (var col = 0; col < board.length; col ++){
      if (board[row][col] === "R" || board[row][col] === "Q" ){
        total++;
      }
    }
  }
  return total;
};

window.hasEmptySpace = function(board){
  for (var row = 0; row<board.length; row++){
    for (var col = 0; col < board.length; col ++){
      if (board[row][col] === "0"){
        return true;
      }
    }
  }
  return false;
};
window.findRookConfigs = function(board, count){
  for (var row = 0; row<board.length; row++){
    for (var col = 0; col < board.length; col ++){
      if (window.countNobles(board) === board.length){
        count++;
        board = window.makeMarkedBoard(board);
        console.log(printBoard(board));
        window.findRookConfigs(board, count);
      }
      if (board[row][col] === "0"){
        board = window.setRook(board, row, col);
        count = count + window.findRookConfigs(board);
      }
      else if (!window.hasEmptySpace(board)){
        board = window.makeMarkedBoard(board);
      }
    }
  }
  return count;
};

window.placeRook = function (board){
  var foundOne = false;
  for (var row=0; row < board.length; row++){
    for(var col = 0; col < board.length; col ++){
      if (foundOne === false && window.hasRookConflict(board, row, col) === false && board[row][col]==="0"){
        window.setRook(board, row, col);
        foundOne = true;
      }
    }
  }
  return board;
};

window.makeMarkedBoard = function (board){
  for (var row=0; row< board.length; row++){
    for (var col =0; col<board.length; col++){
      if (board[row][col] === "R" || board[row][col]==="Q"){
        board[row][col] = "T";
      } else if (board[row][col] === "X") {
        board[row][col] = "0";
      }
    }
  }
  return board;
};
window.findSolution = function (board){
  var numberToFind = board.length;
  for (var i = 0; i<numberToFind; i++) {
    window.placeRook(board);
  }
  return board;
};
// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var board = window.makeBoard(n);
  var doRookPlacement = function(oldBoard, row, col) {
    var newBoard = oldBoard.slice();
    window.setRook(newBoard, row, col);
    console.log(printBoard(newBoard));
    searchForViableSpace(newBoard);
  }
  var searchForViableSpace = function(board) {
    for (var row=0; row< board.length; row++){
      for (var col =0; col<board.length; col++){
        if (board[row][col] === "0") {
          doRookPlacement(board, row, col);
        }
      }
    }
  }
  for (var row=0; row< board.length; row++){
    for (var col =0; col<board.length; col++){
      var newBoard = board.slice();
      doRookPlacement(newBoard, row, col);
    }
  }
  console.log(printBoard(board));
  return 0;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

 // console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

 // console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
