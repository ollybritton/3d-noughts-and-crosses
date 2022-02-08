// grids represents the current state of the board.
let grids = [
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
];

// gridHistory represents the history of the play.
let gridHistory = [
    {
        "message": `No moves yet. <a class="link blue" href="javascript:void(0)" onclick="resetGrid()">Jump to start.</a>`,
        "grid": [[...grids[0]], [...grids[1]], [...grids[2]]],
        "toPlay": "X",
    }
];

// lock controls whether the grid is locked or not. If locked, the player can not make a move.
let lock = false;

// The current player, who's turn it is right now.
let currentPlayer = "X";

// The winning player.
let winner = false;

// Per-grid indicies that make a win when one player has all of them.
const winningPositions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

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
    for (let layer = 0; layer < 3; layer++) {
        for (let i = 0; i < 9; i++) {
            let currentSquareValue = getSquareByPos(layer, i)
            let squareElem = getSquareElemByPos(layer, i)

            squareElem.innerHTML = currentSquareValue

            if (currentSquareValue != null) {
                squareElem.setAttribute("data-used", true)
            } else {
                squareElem.setAttribute("data-used", false)
            }

            squareElem.style.background = "white";
        }
    }
}

// resetGrid resets the state of the game to the start.
function resetGrid() {
    grids = [
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
    ];

    gridHistory = [
        {
            "message": `No moves yet. <a class="link blue" href="javascript:void(0)" onclick="resetGrid()">Jump to start.</a>`,
            "grid": [[...grids[0]], [...grids[1]], [...grids[2]]],
            "toPlay": "X"
        }
    ];

    currentPlayer = "X";
    winner = false;

    renderGrid();
    renderHistory();
    renderCurrentPlayer();
}


// This function updates the displayed history to represent the latest updates to the gridHistory variable.
function renderHistory() {
    let html = "";

    for (let historyItem of gridHistory) {
        html += `<li>` + historyItem.message + `</li>`
    }

    document.getElementById("history").innerHTML = html;
}

// This function resets the game to the state at a certain position in the history.
function loadHistory(index) {
    let previousGrid = gridHistory[index].grid

    grids[0] = [...previousGrid[0]]
    grids[1] = [...previousGrid[1]]
    grids[2] = [...previousGrid[2]]

    currentPlayer = gridHistory[index].toPlay
    gridHistory = gridHistory.slice(0, index + 1)
    winner = false;

    renderGrid()
    renderHistory()
    renderCurrentPlayer()
}

// undoLast undoes the last move -- the same as removing one item from the history.
function undoLast() {
    if (gridHistory.length == 1) {
        return
    } else if (gridHistory.length == 2) {
        resetGrid()
    } else {
        loadHistory(gridHistory.length - 2)
    }
}

// This functions returns the opposite player, I.e. "X" => "O" and "O" => "X".
function flipPlayer(player) {
    return player == "X" ? "O" : "X"
}

// This function handles the logic for changing the current turn.
function renderCurrentPlayer() {
    document.getElementById("info-current-player").innerHTML = currentPlayer
}

// checkWinner returns false or the positions and name of the winning player if there is one.
function checkWinner() {
    for (let gridIndex = 0; gridIndex < grids.length; gridIndex++) {
        let grid = grids[gridIndex];

        for (let positions of winningPositions) {
            let [i, j, k] = [positions[0], positions[1], positions[2]];

            if (grid[i] == grid[j] && grid[j] == grid[k] && grid[i] != null) {
                return [
                    [gridIndex, i],
                    [gridIndex, j],
                    [gridIndex, k],
                    grids[gridIndex][i],
                ];
            }
        }
    }

    for (let position of winningPositions) {
        let [i, j, k] = [position[0], position[1], position[2]];

        if (
            grids[0][i] == grids[1][j] &&
            grids[1][j] == grids[2][k] &&
            grids[0][i] != null
        ) {
            return [[0, i], [1, j], [2, k], grids[0][i]];
        }

        if (
            grids[0][k] == grids[1][j] &&
            grids[1][j] == grids[2][i] &&
            grids[0][k] != null
        ) {
            return [[0, k], [1, j], [2, i], grids[0][k]];
        }
    }

    for (var i = 0; i < 9; i++) {
        if (
            grids[0][i] == grids[1][i] &&
            grids[1][i] == grids[2][i] &&
            grids[0][i] != null
        ) {
            return [[0, i], [1, i], [2, i], grids[0][i]];
        }
    }

    return false;
}

// processWinner check if a player has won, and then handle what needs to happen if a player has won.
function processWinner() {
    winningPlayer = checkWinner();

    if (winningPlayer == false) {
        return false
    }

    for (let position of winningPlayer.slice(0, 3)) {
        getSquareElemByPos(position[0], position[1]).style.background = "pink";
    }

    winner = currentPlayer;

    return true
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
            if (square.getAttribute("data-used") == "true" || lock || winner != false) {
                return
            }

            square.classList.remove("hovering")
            square.innerHTML = currentPlayer;
            square.setAttribute("data-used", true)

            let layerNum = parseInt(square.getAttribute("data-layer"))
            let i = parseInt(square.getAttribute("data-index"))

            grids[layerNum][i] = currentPlayer;
            let wasWinner = processWinner();

            if (!wasWinner) {
                gridHistory.push({
                    "message": `Player <span class="i">${currentPlayer}</span> went in location (${layerNum}, ${i}). <a class="link blue" href="javascript:void(0)" onclick="loadHistory(${gridHistory.length})">Jump here.</a>`,
                    "grid": [[...grids[0]], [...grids[1]], [...grids[2]]],
                    "toPlay": flipPlayer(currentPlayer)
                })
                currentPlayer = flipPlayer(currentPlayer);
            } else {
                gridHistory.push({
                    "message": `Player <span class="i">${currentPlayer}</span> <i>wins</i> by going in location (${layerNum}, ${i})!`,
                    "grid": [[...grids[0]], [...grids[1]], [...grids[2]]],
                    "toPlay": flipPlayer(currentPlayer),
                    "winner": true,
                })
            }

            renderHistory();
            renderCurrentPlayer()
        })
    })
}