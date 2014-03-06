// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      //console.dir(rowIndex)
      var rowsCopy = this.rows()[rowIndex].slice();
      //console.log(rowsCopy);
      //compare each bit the simple way
      var counter = 0;
      for (var i=0; i< rowsCopy.length; i++){
        counter = counter + rowsCopy[i];
      }
      if (counter<=1){
        return false;
      } else {
        return true;
      }

    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var rowsCopy = this.rows()
      var hasConflict = false;
      for (var i = 0; i<rowsCopy.length; i++){
        if (!hasConflict){
          hasConflict = this.hasRowConflictAt(i);
        }
      }
      return hasConflict;

    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    // collumns: function(){
    //   var colArr = [];
    //   var rowsCopy = this.rows();
    //   var collumizer = function(){
    //     //takes a row,
    //     for (var i =0; i< rowsCopy.length; i++){
    //       var tempCol = [];
    //       for (var j = 0;
    //       tempCol.push(rowsCopy[i+rows.length-1][i])
    //     }

    //   }


    // }


    hasColConflictAt: function(colIndex) {
      var rowsCopy = this.rows()
      var collumns = [];
      for (var i =0; i<rowsCopy.length; i++){
        collumns.push(rowsCopy[i][colIndex])
      }

      var counter = 0;
      for (var i=0; i< collumns.length; i++){
        counter = counter + collumns[i];
      }
      if (counter<=1){
        return false;
      } else {
        return true;
      }



    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var rowsCopy = this.rows()
      var hasConflict = false;
      for (var i = 0; i<rowsCopy.length; i++){
        if (!hasConflict){
          hasConflict = this.hasColConflictAt(i);
        }
      }
      return hasConflict;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var rowsCopy = this.rows();
      var diag = [];
      for (var i =0; i<rowsCopy.length; i++){
          console.log('diagonal', rowsCopy[i][majorDiagonalColumnIndexAtFirstRow+i]);
        if ((i+majorDiagonalColumnIndexAtFirstRow)<(rowsCopy.length)){
          diag.push(rowsCopy[i][majorDiagonalColumnIndexAtFirstRow+i]);
        }
      }
      console.log(diag);
      var counter = 0;
      for (var i=0; i< diag.length; i++){
        counter = counter + diag[i];
      }
      if (counter<=1){
        return false;
      } else {
        return true;
      }
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var rowsCopy = this.rows();
      for (var i=0; i<rowsCopy[0].length; i++){
        if (this.hasMajorDiagonalConflictAt(rowsCopy[0][i])){
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var rowsCopy = this.rows();
      var diag = [];

      for (var i=0; i<rowsCopy.length; i++) {
        if (rowsCopy[i][minorDiagonalColumnIndexAtFirstRow - i] !== undefined){
          diag.push(rowsCopy[i][minorDiagonalColumnIndexAtFirstRow - i]);
        }
      }

      console.log('DIAG!!!  ',diag);
      var counter = 0;
      for (var i=0; i< diag.length; i++){
        counter = counter + diag[i];
      }
      if (counter<=1){
        return false;
      } else {
        return true;
      }
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var rowsCopy = this.rows().slice();
      for (var i = (rowsCopy.length-1); i >= 0; i--){
        //iterate through all rows
        for (var j = (rowsCopy.length-1); j>=0; j--){
          if (this.hasMinorDiagonalConflictAt(i+j)){
            return true;
          }
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
