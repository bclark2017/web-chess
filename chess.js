
var canvasGA = document.getElementById("gameArea");
canvasGA.addEventListener( 'click', processUserInput);
var contextGA = canvasGA.getContext("2d");

var cellSize = canvasGA.width/8;

var pieceHasBeenSelected = false;
var selectedCell = null;
var selectedPiece = null;
var selectedRow = null;
var selectedCol = null;

// % by 2, 0 is white, 1 is black
var currentPlayer = 0;

var cells = new Array(8);
for(var i = 0; i < 8; i++)
    cells[i] = new Array(8);

setupBoard();
setTimeout( drawBoard, 100);


function setupBoard() {
    for(var r = 0; r < 8; r++) {
        for(var c = 0; c < 8; c++) {
            cells[r][c] = new Cell();
            //////////////////////////Alternate colors for the squares
            if( (r + c)%2 == 0) {
                cells[r][c].backgroundColor = "#f2d9b9";
            } else {
                cells[r][c].backgroundColor = "#b78868";
            }

        }
    }

    for(var blah = 0; blah < 8; blah++) {
        cells[1][blah].piece = new Pawn("black");
        cells[6][blah].piece = new Pawn("white");
    }
//This code could be done much more elegantly, but for now, this works.
    cells[0][0].piece= new Rook("black");
    cells[0][7].piece= new Rook("black");
    cells[7][0].piece= new Rook("white");
    cells[7][7].piece= new Rook("white");

    cells[0][1].piece= new Knight("black");
    cells[0][6].piece= new Knight("black");
    cells[7][1].piece= new Knight("white");
    cells[7][6].piece= new Knight("white");

    cells[0][2].piece= new Bishop("black");
    cells[0][5].piece= new Bishop("black");
    cells[7][2].piece= new Bishop("white");
    cells[7][5].piece= new Bishop("white");

    cells[0][3].piece= new Queen("black");
    cells[7][3].piece= new Queen("white");
    cells[0][4].piece= new King("black");
    cells[7][4].piece= new King("white");

}

function drawBoard() {
    for(var r = 0; r < 8; r++) {
        for(var c = 0; c < 8; c++) {
            //draw the cell's background color and the piece (image)
            if(cells[r][c].isSelected == true)
                contextGA.fillStyle = cells[r][c].selectedColor;
            else if(cells[r][c].isPossMove == true)
                contextGA.fillStyle = cells[r][c].possMoveColor;
            else
                contextGA.fillStyle = cells[r][c].backgroundColor;
            contextGA.fillRect(c*cellSize, r*cellSize, cellSize, cellSize);
            contextGA.drawImage(cells[r][c].piece.image, c*cellSize, r*cellSize, cellSize, cellSize);
        }
    }
}



function processUserInput(event) {
    var relX = event.clientX - canvasGA.offsetLeft;
    var relY = event.clientY - canvasGA.offsetTop;
    console.log("event.y: "+event.y);
    console.log("canvasGA.offsetTop: "+canvasGA.offsetTop)

    var row = Math.trunc(relY/cellSize);
    var col = Math.trunc(relX/cellSize);
    // console.log("row: "+row);
    // console.log("relY: "+relY);
    // console.log("cellSize: "+cellSize);

    //what the user just clicked on
    var currPiece = cells[row][col].piece;
    var currCell = cells[row][col];

//if "white"
    if(currentPlayer%2 == 0 ) {
        if(  pieceHasBeenSelected == false && currPiece.playerColor == "white") {
            selectPiece(currCell, row , col);
        } else if(pieceHasBeenSelected == true) {

                //if clicked on another white piece, then change selection
                if(currCell.piece.playerColor == "white") {
                    var same = (selectedCell == currCell);
                    deselectPiece();
                    resetPossibleMoveLocations();
                    if(same == false) {
                        selectPiece(currCell, row, col);
                    }
                } else {

                    //else, if not a white piece, then check to see if it's a legal move
                    var isItAllGood = selectedPiece.isLegalMove(selectedRow, selectedCol, row, col);

                    if(isItAllGood == false) {
                        return;
                    }

                    //if castleing
                    if(selectedPiece instanceof King){
                    if(selectedRow == 0 || selectedRow == 7){
                    if(selectedCol == 4){
                    if(row == 7){
                    if(col == 2){
                      cells[row][3].piece = cells[row][0].piece;
                      cells[row][0].piece = new EmptyPiece();
                    }
                    if(col == 6){
                      cells[row][5].piece = cells[row][0].piece;
                      cells[row][7].piece = new EmptyPiece();
                    }}}}}
                    
                    selectedPiece.hasMoved = true;
                    cells[row][col].piece = selectedPiece;
                    selectedCell.piece = new EmptyPiece();
                    currentPlayer++;
                    pieceHasBeenSelected = false;
                    selectedCell.isSelected = false;
                    selectedPiece = null;
                    selectedCell = null;
                    resetPossibleMoveLocations();
                }
        }
    }
    //if black
    else{
        if(  pieceHasBeenSelected == false && currPiece.playerColor == "black") {
            selectPiece(currCell, row, col);
        } else if(pieceHasBeenSelected == true) {

                //if clicked on another black piece, then change selection
                if(currCell.piece.playerColor == "black") {
                    var same = (selectedCell == currCell);
                    selectedCell.isSelected = false;
                    resetPossibleMoveLocations();
                    deselectPiece();
                    if(same == false) {
                        selectPiece(currCell, row, col);
                    }
                } else {

                    //else, if not a black piece, then check to see if it's a legal move
                    var isItAllGood = selectedPiece.isLegalMove(selectedRow, selectedCol, row, col);

                    if(isItAllGood == false) {
                        return;
                    }

                    //if castleing
                    if(selectedPiece instanceof King){
                    if(selectedRow == 0 || selectedRow == 7){
                    if(selectedCol == 4){
                    if(row == 0){
                    if(col == 2){
                      cells[row][3].piece = cells[row][0].piece;
                      cells[row][0].piece = new EmptyPiece();
                    }
                    if(col == 6){
                      cells[row][5].piece = cells[row][0].piece;
                      cells[row][7].piece = new EmptyPiece();
                    }}}}}
                    
                    selectedPiece.hasMoved = true;
                    cells[row][col].piece = selectedPiece;
                    selectedCell.piece = new EmptyPiece();
                    currentPlayer++;
                    pieceHasBeenSelected = false;
                    selectedCell.isSelected = false;
                    selectedPiece = null;
                    selectedCell = null;
                    resetPossibleMoveLocations();
                }
        }

    }


    drawBoard();
    // console.log("row: col is " + row + ":" + col);

}

function deselectPiece() {
    selectedCell.isSelected = false;
    pieceHasBeenSelected = false;
    selectedRow = -1;
    selectedCol = -1;
    selectedCell = undefined;
}

function selectPiece(cell, row, col) {
    cell.isSelected = true;
    pieceHasBeenSelected = true;
    selectedCell = cell;
    selectedPiece = cell.piece;
    selectedRow = row;
    selectedCol = col;
    highlightPossibleMoveLocations();
}

function highlightPossibleMoveLocations() {
    for(var r = 0; r < 8; r++) {
        for(var c = 0; c < 8; c++) {
            if(selectedPiece.isLegalMove(selectedRow, selectedCol, r, c) == true &&
                (selectedRow != r || selectedCol != c)
                && selectedPiece.playerColor != cells[r][c].piece.playerColor )
                cells[r][c].isPossMove = true;
        }
    }
}

function resetPossibleMoveLocations() {
    for(var r = 0; r < 8; r++) {
        for(var c = 0; c < 8; c++) {
            cells[r][c].isPossMove = false;
        }
    }
}

function Cell() {
    this.backgroundColor = "white";
    this.piece = new EmptyPiece();
    this.isSelected = false;
    this.selectedColor = "#FFFF00";
    this.isPossMove = false;
    this.possMoveColor = "#000055";
}

function EmptyPiece() {
    this.image = new Image();
    this.image.src = "piece-images/emptyPiece.png";
    this.playerColor = "none";
}

function Pawn(color) {
    this.playerColor = color;
    this.hasMoved = false;
    this.image = new Image();
    this.image.src = "piece-images/pawn-" + this.playerColor + ".png";

    this.isLegalMove = function(originRow, originCol, destRow, destCol) {
            if(this.playerColor == "white") {
                if (this.hasMoved == true) {
                    if(cells[destRow][destCol].piece instanceof EmptyPiece) {
                        if(originCol == destCol && originRow == destRow + 1)
                            return true;
                        else
                            return false;
                    } else if ((destRow == originRow-1) &&
                               (destCol == originCol-1 || destCol == originCol+1) &&
                               (cells[destRow][destCol].piece.playerColor == "black")) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if ((destRow == originRow - 2 || destRow == originRow - 1) &&
                        (destCol == originCol)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            //else if black
            else {
                if (this.hasMoved == true) {
                    if(cells[destRow][destCol].piece instanceof EmptyPiece) {
                        if(originCol == destCol && originRow == destRow - 1)
                            return true;
                        else
                            return false;
                    } else if ((destRow == originRow+1) &&
                               (destCol == originCol-1 || destCol == originCol+1) &&
                               (cells[destRow][destCol].piece.playerColor == "white")) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if ((destRow == originRow + 2 || destRow == originRow + 1) &&
                        (destCol == originCol)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
    };
}

function Rook(color) {
    this.playerColor = color;
    this.image = new Image();
    this.hasMoved = false;
    this.image.src = "piece-images/rook-" + this.playerColor + ".png";

    this.isLegalMove = function(originRow, originCol, destRow, destCol){
      if(originCol == destCol || originRow == destRow){
        //if right
        if(destCol > originCol && destRow == originRow){
          for(i=originCol+1; i<destCol; i++)
          {
            if(!(cells[originRow][i].piece instanceof EmptyPiece))
              return false;
          }

          if(this.playerColor == cells[destRow][destCol].piece.playerColor)
          return false;
          else {
            return true;
          }
        }
        //if left
        else if(destCol < originCol && destRow == originRow){
          for(i=originCol-1; i>destCol; i--)
          {
            if(!(cells[originRow][i].piece instanceof EmptyPiece))
              return false;
          }

          if(this.playerColor == cells[destRow][destCol].piece.playerColor)
          return false;
          else {
            return true;
          }
        }
        //if up
        else if(destRow < originRow && destCol == originCol){
          for(i=originRow-1; i>destRow; i--)
          {
            if(!(cells[i][originCol].piece instanceof EmptyPiece))
              return false;
          }

          if(this.playerColor == cells[destRow][destCol].piece.playerColor)
          return false;
          else {
            return true;
          }
        }
        //if down
        else if(destRow > originRow && destCol == originCol){
          for(i=originRow+1; i<destRow; i++)
          {
            if(!(cells[i][originCol].piece instanceof EmptyPiece))
              return false;
          }

          if(this.playerColor == cells[destRow][destCol].piece.playerColor)
          return false;
          else {
            return true;
          }
        }
      }
      else
        return false;
  }
}

function Knight(color){
  this.playerColor = color;
  this.image = new Image();
  this.image.src = "piece-images/knight-" + this.playerColor + ".png";

  this.isLegalMove = function(originRow, originCol, destRow, destCol){
    if(destRow - originRow == 1 || destRow - originRow == -1){
      if(destCol - originCol == 2 || destCol - originCol == -2){
        return true;
      }else {
        return false;
      }
    }
    else if(destRow - originRow == 2 || destRow - originRow == -2){
      if(destCol - originCol == 1 || destCol - originCol == -1){
        return true;
      }else {
        return false;
      }
    }else {
      return false;
    }
  };
}

function Bishop(color){
  this.playerColor = color;
  this.image = new Image();
  this.image.src = "piece-images/bishop-" + this.playerColor + ".png";
  
  this.isLegalMove = function(originRow, originCol, destRow, destCol){
    var dx = destCol > originCol ? 1 : -1;
    var dy = destRow > originRow ? 1 : -1;
    console.log("params: " + originRow + ":" + originCol + ":" + destRow +":" + destCol);
    if(Math.abs( destRow - originRow)  != Math.abs( destCol - originCol )){
      return false;
    }else if(destRow == originRow && destCol == originCol){
      return false;
    }else{
      var c = originCol + dx;
      for (var r = originRow + dy; r != destRow; r += dy){
        console.log("row: " + r + " and col: " + c + " and cell: " +cells[r][c]);
        if( !(cells[r][c].piece instanceof EmptyPiece) )
        return false;
        c += dx;
      }
      return true;
    }
  };
}

function Queen(color) {
    this.playerColor = color;
    this.image = new Image();
    this.image.src = "piece-images/queen-" + this.playerColor + ".png";

    this.isLegalMove = function(originRow, originCol, destRow, destCol) {
            // if(this.playerColor == "white") {
            //     if(originCol == destCol && originRow == destRow + 1)
            //         return true;
            //     else
            //         return false;
            // }
            // //else if black
            // else {
            //     if(originCol == destCol && originRow == destRow - 1)
            //         return true;
            //     else
            //         return false;
            // }
    };
}

function King(color) {
    this.playerColor = color;
    this.hasMoved = false;
    this.image = new Image();
    this.image.src = "piece-images/king-" + this.playerColor + ".png";

    this.isLegalMove = function(originRow, originCol, destRow, destCol) {
                if(originCol == destCol && originRow == destRow + 1){
                   if(!(cells[destRow][destCol].piece.playerColor == this.playerColor))
                     return true;
                   }
                else if(originCol == destCol + 1 && originRow == destRow){
                   if(!(cells[destRow][destCol].piece.playerColor == this.playerColor))
                     return true;
                   }
                else if(originCol == destCol && originRow == destRow - 1){
                   if(!(cells[destRow][destCol].piece.playerColor == this.playerColor))
                     return true;
                   }
                else if(originCol == destCol - 1 && originRow == destRow){
                   if(!(cells[destRow][destCol].piece.playerColor == this.playerColor))
                     return true;
                   }
                else if(originCol == destCol + 1 && originRow == destRow + 1){
                   if(!(cells[destRow][destCol].piece.playerColor == this.playerColor))
                     return true;
                   }
                else if(originCol == destCol + 1 && originRow == destRow - 1){
                   if(!(cells[destRow][destCol].piece.playerColor == this.playerColor))
                     return true;
                   }
                else if(originCol == destCol - 1 && originRow == destRow + 1){
                   if(!(cells[destRow][destCol].piece.playerColor == this.playerColor))
                     return true;
                   }
                else if(originCol == destCol - 1 && originRow == destRow - 1){
                   if(!(cells[destRow][destCol].piece.playerColor == this.playerColor))
                     return true;
                   }
                //castle white
                else if(this.playerColor == "white"){
                  if(destCol == 2 && destRow == 7){
                    if(
                      this.hasMoved == 0 &&
                      cells[7][0].piece.hasMoved == 0 &&
                      cells[7][1].piece instanceof EmptyPiece &&
                      cells[7][2].piece instanceof EmptyPiece &&
                      cells[7][3].piece instanceof EmptyPiece)
                    return true;
                    }
                  if(destCol == 6 && destRow == 7){
                    if(
                      this.hasMoved == 0 &&
                      cells[7][7].piece.hasMoved == 0 &&
                      cells[7][6].piece instanceof EmptyPiece &&
                      cells[7][5].piece instanceof EmptyPiece)
                    return true;
                    }
                  }
                //castle black
                else if(this.playerColor == "black"){
                  if(destCol == 2 && destRow == 0){
                    if(
                      this.hasMoved == 0 &&
                      cells[0][0].piece.hasMoved == 0 &&
                      cells[0][1].piece instanceof EmptyPiece &&
                      cells[0][2].piece instanceof EmptyPiece &&
                      cells[0][3].piece instanceof EmptyPiece)
                    return true;
                    }
                  if(destCol == 6 && destRow == 0){
                    if(
                      this.hasMoved == 0 &&
                      cells[0][7].piece.hasMoved == 0 &&
                      cells[0][6].piece instanceof EmptyPiece &&
                      cells[0][5].piece instanceof EmptyPiece)
                    return true;
                  }
                  }
            return false;
    };
}
