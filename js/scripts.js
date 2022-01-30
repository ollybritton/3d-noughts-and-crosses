// grids represents the current state of the board.
let grids = [
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
];

// The current player, who's turn it is right now.
let currentPlayer = "X";

// This function returns the square at a certain position in the grid.
function getSquareByPos(layerNum, i) {
    return grids[layerNum][i]
}

// This function returns the DOM element corresponding to a certain grid square, rather than the value in the "grids" variable.
function getSquareElemByPos(layerNum, i) {
    return document.getElementById(`square-${layerNum}-${i}`)
}

// This function updates the displayed grid to represent the latest updates to the grid variable.
function renderGrid() {
    for(let layer = 0; layer < 3; layer++) {
        for(let i = 0; i < 9; i++) {
            let currentSquareValue = getSquareByPos(layer, i)

            if (currentSquareValue != null) {
                getSquareElemByPos(layer, i).innerHTML = currentSquareValue
            }
        }
    }
}

// This functions returns the opposite player, I.e. "X" => "O" and "O" => "X".
function flipPlayer(player) {
    return player == "X" ? "O" : "X"
}

window.onload = function setup() {
    [...document.getElementsByClassName("square")].map(square => {
        square.addEventListener("mouseenter", e => {
            if (square.innerHTML != "") {
                return
            }

            square.classList.add("hovering")
            square.innerHTML = currentPlayer
        })
        
        square.addEventListener("mouseleave", e => {
            if (!square.classList.contains("hovering")) {
                return 
            }

            square.classList.remove("hovering")
            square.innerHTML = ""
        })
        
        square.addEventListener("click", e => {
            // TODO: Add logic to prevent updating the board if the AI is currently making a decision
            // TODO: Update grids variable
            square.classList.remove("hovering")
            square.innerHTML = currentPlayer;
            currentPlayer = flipPlayer(currentPlayer);
        })
    })
}