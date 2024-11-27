/**
 * @typedef {import("jquery")} $
 * @typedef {import("gsap")} gsap
 * @typedef {import("gsap/Draggable")} Draggable
 */

gsap.registerPlugin(Draggable);

const body = document.body;
const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);

var puzzleImage = {
  ref: null,
  rowCount: 4,
  colCount: 4,
};

initScripts();

function initScripts() {
  splitPieces();
  createBoard();
}

function splitPieces() {
  $(function () {
    puzzleImage.ref = $("#puzzle-image");

    const pieceWidth = puzzleImage.ref.width() / puzzleImage.colCount;
    const pieceHeight = puzzleImage.ref.height() / puzzleImage.rowCount;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pieceWidth;
    canvas.height = pieceHeight;

    console.log(pieceHeight, pieceWidth);

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
          .attr("src", canvas.toDataURL())
          .appendTo($(".pieces-container"))
          .css({
            cursor: "pointer",
          });

        // Draggable.create(piece);
      }
    }
  });
}

function createBoard() {}
