/**
 * @typedef {import("jquery")} $
 * @typedef {import("gsap")} gsap
 * @typedef {import("gsap/Draggable")} Draggable
 * @typedef {import("./PieceLocation")} PieceLocation
 */

gsap.registerPlugin(Draggable);

const body = document.body;
const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);

// Modify rowCount and colCount to adjust game difficulty
var puzzleImage = {
  ref: null,
  rowCount: 4,
  colCount: 4,
};
var draggableCollection = Array(puzzleImage.rowCount * puzzleImage.colCount);
var overlappedCell = null;
var correctlyPlacedPieces = 0;

initScripts();

function initScripts() {
  splitPieces();
  createBoard();
}

function splitPieces() {
  $(function () {
    puzzleImage.ref = $("#puzzle-image");
    const { colCount, rowCount } = puzzleImage;

    const pieceWidth = puzzleImage.ref.outerWidth() / colCount;
    const pieceHeight = puzzleImage.ref.outerHeight() / rowCount;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pieceWidth;
    canvas.height = pieceHeight;

    const randomSequence = Array.from(
      { length: colCount * rowCount },
      (_, i) => i + 1
    );
    for (let i = randomSequence.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomSequence[i], randomSequence[j]] = [
        randomSequence[j],
        randomSequence[i],
      ];
    }

    for (let row = 0; row < puzzleImage.rowCount; ++row) {
      for (let col = 0; col < puzzleImage.colCount; ++col) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
          puzzleImage.ref.get(0),

          col * pieceWidth, // Source coordinates
          row * pieceHeight,
          pieceWidth,
          pieceHeight,

          0, // Destination coordinates
          0,
          pieceWidth,
          pieceHeight
        );

        const piece = $(new Image())
          .attr({ src: canvas.toDataURL(), row: row, col: col })
          .appendTo($(".pieces-container"))
          .css({
            cursor: "pointer",
            width: `calc(min(65vw, 40vh) / ${puzzleImage.colCount})`,
            height: `calc(min(65vw, 40vh) / ${puzzleImage.colCount})`,
            order: `${randomSequence[row * rowCount + col]}`,
          });

        draggableCollection[row * rowCount + col] = Draggable.create(piece, {
          bounds: "body",
          onDrag: function () {
            if ($(this.target).hasClass("down")) {
              const id = $(this.target).attr("cell");
              $(this.target).attr("cell", "").removeClass("down");
              $(`#${id}`).removeClass("occupied");

              if (
                $(this.target).attr("col") === $(`#${id}`).attr("col") &&
                $(this.target).attr("row") === $(`#${id}`).attr("row")
              ) {
                correctlyPlacedPieces -= 1;
                console.log("Correct pieces:", correctlyPlacedPieces);
              }
            }
            movePiece(this.target);
          },
          onDragEnd: function () {
            pieceDown(this.target, row, col);
          },
        });
      }
    }
  });
}

function createBoard() {
  $(function () {
    $(".grid").css(
      "grid-template-columns",
      `repeat(${puzzleImage.colCount}, 1fr)`
    );

    for (let row = 0; row < puzzleImage.rowCount; ++row)
      for (let col = 0; col < puzzleImage.colCount; ++col)
        $("<div>", { class: "cell" })
          .appendTo($(".grid"))
          .attr({
            row: row,
            col: col,
            id: `cell${row * puzzleImage.rowCount + col}`,
          });
  });
}

function movePiece(piece) {
  checkOverlap(piece);
}

function pieceDown(piece, row, col) {
  if (!overlappedCell) return;

  $(overlappedCell).removeClass("overlap").addClass("occupied");

  $(piece)
    .offset({
      top: $(overlappedCell).offset().top,
      left: $(overlappedCell).offset().left,
    })
    .addClass("down")
    .attr("cell", $(overlappedCell).attr("id"));

  if (
    $(piece).attr("col") === $(overlappedCell).attr("col") &&
    $(piece).attr("row") === $(overlappedCell).attr("row")
  ) {
    correctlyPlacedPieces += 1;
    console.log("Correct pieces:", correctlyPlacedPieces);
  }

  if (correctlyPlacedPieces === puzzleImage.colCount * puzzleImage.rowCount) {
    draggableCollection.forEach(([draggable]) => draggable.kill());
    gsap.set(".win", { display: "flex" });
    gsap.to([".win h2", ".win a"], { y: 0, opacity: 1 });
  }
}

function checkOverlap(piece) {
  let overlapped = null;
  const trunc = (n) => n << 0; // remove the decimals from n

  $(".cell").each(function () {
    if ($(this).hasClass("occupied")) return true;

    const cellWidth = trunc($(this).outerWidth()),
      cellHeight = trunc($(this).outerHeight()),
      cellX1 = trunc($(this).offset().left),
      cellX2 = trunc(cellX1 + cellWidth),
      cellY1 = trunc($(this).offset().top),
      cellY2 = trunc(cellY1 + cellHeight);

    const floatingWidth = trunc($(piece).outerWidth()),
      floatingHeight = trunc($(piece).outerHeight()),
      floatingX1 = trunc($(piece).offset().left),
      floatingX2 = trunc(floatingX1 + floatingWidth),
      floatingY1 = trunc($(piece).offset().top),
      floatingY2 = trunc(floatingY1 + floatingHeight);

    const minOverlap = 0.6; // range (0, 1)

    if (
      // top-left overlap
      (floatingX2 >= cellX2 - cellWidth * (1 - minOverlap) &&
        floatingX2 <= cellX2 &&
        floatingY2 >= cellY2 - cellHeight * (1 - minOverlap) &&
        floatingY2 <= cellY2) ||
      // top-right overlap
      (floatingX1 <= cellX1 + cellWidth * (1 - minOverlap) &&
        floatingX1 >= cellX1 &&
        floatingY2 >= cellY2 - cellHeight * (1 - minOverlap) &&
        floatingY2 <= cellY2) ||
      // bottom-left overlap
      (floatingX2 >= cellX2 - cellWidth * (1 - minOverlap) &&
        floatingX2 <= cellX2 &&
        floatingY1 <= cellY1 + cellHeight * (1 - minOverlap) &&
        floatingY1 >= cellY1) ||
      // bottom-right overlap
      (floatingX1 <= cellX1 + cellWidth * (1 - minOverlap) &&
        floatingX1 >= cellX1 &&
        floatingY1 <= cellY1 + cellHeight * (1 - minOverlap) &&
        floatingY1 >= cellY1)
    )
      overlapped = this;

    if (overlapped !== null) {
      $(overlappedCell).removeClass("overlap");
      $(overlapped).addClass("overlap");
      overlappedCell = overlapped;
      return false;
    }
  });

  if (overlapped === null) {
    $(overlappedCell).removeClass("overlap");
    overlappedCell = null;
  }
}
