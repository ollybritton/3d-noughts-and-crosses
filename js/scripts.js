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
        "ai": false,
    }
];

// lock controls whether the grid is locked or not. If locked, the player can not make a move.
let lock = false;

// The current player, who's turn it is right now.
let currentPlayer = "X";

// The winning player.
let winner = false;

// The depth limit.
let options = {
    depthLimit: 6,
    automaticallyRespond: true,
    alphaBetaPruning: true,
    optimiseLength: false,
    heatmap: false,
}

// Stores the latest amount of nodes searched.
let nodesSearched = 0;

// Stores the latest amount of nodes pruned.
let nodesPruned = 0;

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

            if (options.heatmap && squareElem.getAttribute("data-score") != null) {
                let score = parseInt(squareElem.getAttribute("data-score"))

                if (score == 0 || currentSquareValue != null) {
                    squareElem.style.background = "#efefef";
                } else if (score > 0) {
                    // Green
                    squareElem.style.background = `rgba(25, 169, 116, ${(score - 100) / 10})`;
                } else {
                    // Pink
                    squareElem.style.background = `rgba(255, 163, 215, ${(score + 110) / 10})`;
                }

            } else {
                squareElem.style.background = "white";
            }

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
            "toPlay": "X",
            "ai": false,
        }
    ];

    currentPlayer = "X";
    winner = false;

    for (var gridIndex = 0; gridIndex < 3; gridIndex++) {
        for (var position = 0; position < 9; position++) {
            getSquareElemByPos(gridIndex, position).setAttribute("data-score", 0)
        }
    }

    document.getElementById('info-evaluation-time').innerHTML = "N/A"
    document.getElementById('info-nodes-searched').innerHTML = "N/A"
    document.getElementById('info-nodes-pruned').innerHTML = "N/A"

    renderHistory();
    renderCurrentPlayer();
    renderGrid();
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

    if (gridHistory[index].ai) {
        document.getElementById('info-evaluation-time').innerHTML = gridHistory[index].evaluationTime
        document.getElementById('info-nodes-searched').innerHTML = gridHistory[index].nodesSearched
        document.getElementById('info-nodes-pruned').innerHTML = gridHistory[index].nodesPruned
    } else {
        document.getElementById('info-evaluation-time').innerHTML = "N/A"
        document.getElementById('info-nodes-searched').innerHTML = "N/A"
        document.getElementById('info-nodes-pruned').innerHTML = "N/A"
    }

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


function minimax(player, max, alpha, beta, depth = 4) {
    if (depth == 0) {
        // We've run out time to evaluate options, so this state is indeterminate.
        return 0;
    }

    // Check for winnings. If this player wins, then return +100. If they lose, return -100.
    let winner = checkWinner();
    if (winner != false) {
        if (options.optimiseLength) {
            return -100 - depth;
        }

        if (winner[3] == player) {
            return 100 + depth;
        } else {
            return -100 - depth;
        }
    }

    if (max) {
        // This is the player we're optimising for. We want to give as high of a score as possible.
        let bestValue = -Infinity;

        for (let gridIndex = 0; gridIndex < 3; gridIndex++) {
            for (let position = 0; position < 9; position++) {
                // We can't put squares in locations that already exist.
                if (grids[gridIndex][position] != null) {
                    continue;
                }

                nodesSearched += 1

                // Simulate putting a player's mark in this location.
                grids[gridIndex][position] = player;

                bestValue = Math.max(
                    bestValue,
                    minimax(player, false, alpha, beta, depth - 1)
                );

                alpha = Math.max(alpha, bestValue);

                // Undo simulating putting a player's mark in this location.
                grids[gridIndex][position] = null;

                if (bestValue >= beta && options.alphaBetaPruning) {
                    nodesPruned += 1;
                    return bestValue;
                }
            }
        }

        return bestValue;
    } else if (!max) {
        // This is the player we're competing against. We need to consider what they can do to harm our chances the most.
        let bestValue = +Infinity;

        for (let gridIndex = 0; gridIndex < 3; gridIndex++) {
            for (let position = 0; position < 9; position++) {
                // We can't put squares in locations that already exist.
                if (grids[gridIndex][position] != null) {
                    continue;
                }

                // Simulate putting a the other player's mark in this location.
                grids[gridIndex][position] = flipPlayer(player);

                bestValue = Math.min(
                    bestValue,
                    minimax(player, true, alpha, beta, depth - 1)
                );

                beta = Math.min(beta, bestValue);

                // Undo simulating putting a player's mark in this location.
                grids[gridIndex][position] = null;

                if (bestValue <= alpha && options.alphaBetaPruning) {
                    nodesPruned += 1
                    return bestValue;
                }
            }
        }

        return bestValue;
    } else {
        console.error("got a player that wasn't the");
    }
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function bestMoveForPlayer(player, depth) {
    let bestValue = -Infinity;
    let bestMoves = [];

    nodesSearched = 0;
    nodesPruned = 0;
    let evaluationStartTime = new Date()

    // Try the moves in a random order as this may speed up alpha-beta pruning.
    let moves = [
        [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
        [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8],
        [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8],
    ]

    shuffle(moves)

    for (let [gridIndex, position] of moves) {
        // We can't put squares in locations that already exist.
        if (grids[gridIndex][position] != null) {
            getSquareElemByPos(gridIndex, position).setAttribute("data-score", 0)
            continue;
        }

        // Simulate putting a player's mark in this location.
        grids[gridIndex][position] = player;

        let score = minimax(player, false, -Infinity, Infinity, depth - 1);
        getSquareElemByPos(gridIndex, position).setAttribute("data-score", score)

        console.log("Move", [gridIndex, position], "had score", score);
        if (bestValue < score) {
            bestValue = score;
            bestMoves = [[gridIndex, position]];
        } else if (bestValue == score) {
            bestMoves.push([gridIndex, position]);
        }

        // Undo simulating putting a player's mark in this location.
        grids[gridIndex][position] = null;
    }

    document.getElementById("info-evaluation-time").innerHTML = `${Math.floor((new Date() - evaluationStartTime)) / 1000}s`
    document.getElementById("info-nodes-searched").innerHTML = `${nodesSearched}`
    document.getElementById("info-nodes-pruned").innerHTML = `${nodesPruned}`

    return bestMoves[0];
}

function analyse() {
    let player = "X";
    let bestValue = -Infinity;
    let bestMoves = [];

    nodesSearched = 0;
    let evaluationStartTime = new Date()

    // Try the moves in a random order as this may speed up alpha-beta pruning.
    let moves = [
        [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
        [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8],
        [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8],
    ]

    shuffle(moves)


    for (let [gridIndex, position] of moves) {
        // We can't put squares in locations that already exist.
        if (grids[gridIndex][position] != null) {
            getSquareElemByPos(gridIndex, position).setAttribute("data-score", 0)
            continue;
        }

        // Simulate putting a player's mark in this location.
        grids[gridIndex][position] = player;

        let score = minimax(player, false, -Infinity, Infinity, options.depthLimit - 1);
        getSquareElemByPos(gridIndex, position).setAttribute("data-score", score)

        console.log("Move", [gridIndex, position], "had score", score);
        if (bestValue < score) {
            bestValue = score;
            bestMoves = [[gridIndex, position]];
        } else if (bestValue == score) {
            bestMoves.push([gridIndex, position]);
        }

        // Undo simulating putting a player's mark in this location.
        grids[gridIndex][position] = null;

    }

    document.getElementById("info-evaluation-time").innerHTML = `${Math.floor((new Date() - evaluationStartTime)) / 1000}s`
    document.getElementById("info-nodes-searched").innerHTML = `${nodesSearched}`
    document.getElementById("info-nodes-pruned").innerHTML = `${nodesPruned}`
}

// processWinner check if a player has won, and then handle what needs to happen if a player has won.
function processWinner() {
    winningPlayer = checkWinner();

    if (winningPlayer == false) {
        return false
    }

    for (var gridIndex = 0; gridIndex < 3; gridIndex++) {
        for (var position = 0; position < 9; position++) {
            getSquareElemByPos(gridIndex, position).style.background = "white";
        }
    }

    for (let position of winningPlayer.slice(0, 3)) {
        let color = winningPlayer[3] == "X" ? "#96CCFF" : "#FF725C"
        getSquareElemByPos(position[0], position[1]).style.background = color;
    }

    winner = currentPlayer;

    return true
}

function makeMove(layerNum, i, ai = false) {
    grids[layerNum][i] = currentPlayer;
    renderGrid();
    let wasWinner = processWinner();

    if (!wasWinner) {
        gridHistory.push({
            "message": `${ai ? "Player (AI)" : "Player"} <span class="i">${currentPlayer}</span> went in location (${layerNum}, ${i}). <a class="link blue" href="javascript:void(0)" onclick="loadHistory(${gridHistory.length})">Jump here.</a>`,
            "grid": [[...grids[0]], [...grids[1]], [...grids[2]]],
            "toPlay": flipPlayer(currentPlayer),
            "ai": ai,
            "nodesSearched": nodesSearched,
            "nodesPruned": nodesPruned,
            "evaluationTime": document.getElementById("info-evaluation-time").innerHTML
        })
        currentPlayer = flipPlayer(currentPlayer);
    } else {
        gridHistory.push({
            "message": `${ai ? "Player (AI)" : "Player"} <span class="i">${currentPlayer}</span> <i>wins</i> by going in location (${layerNum}, ${i})!`,
            "grid": [[...grids[0]], [...grids[1]], [...grids[2]]],
            "toPlay": flipPlayer(currentPlayer),
            "winner": true,
            "ai": ai,
            "nodesSearched": nodesSearched,
            "nodesPruned": nodesPruned,
            "evaluationTime": document.getElementById("info-evaluation-time").innerHTML
        })
    }

    renderHistory();
    renderCurrentPlayer()
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
            makeMove(layerNum, i)


            if (!options.automaticallyRespond || lock || winner != false) {
                return
            }

            document.getElementById("info-evaluation-time").innerHTML = `Thinking...`

            setTimeout(() => {
                [layerNum, i] = bestMoveForPlayer(currentPlayer, options.depthLimit)
                makeMove(layerNum, i, ai = true)
            }, 20)

        })
    })

    let sliderDepth = document.getElementById("slider-depth")
    sliderDepth.value = 6

    sliderDepth.oninput = e => {
        options.depthLimit = parseInt(sliderDepth.value)
        document.getElementById("val-current-depth").innerHTML = options.depthLimit
        document.getElementById("info-depth-limit").innerHTML = options.depthLimit
    }

    document.getElementById("option-automatically-respond").checked = true;
    document.getElementById("option-automatically-respond").oninput = e => {
        options.automaticallyRespond = document.getElementById("option-automatically-respond").checked
    }

    document.getElementById("option-alpha-beta-pruning").checked = true;
    document.getElementById("option-alpha-beta-pruning").oninput = e => {
        options.alphaBetaPruning = document.getElementById("option-alpha-beta-pruning").checked
    }

    document.getElementById("option-heatmap").checked = false;
    document.getElementById("option-heatmap").oninput = e => {
        options.heatmap = document.getElementById("option-heatmap").checked
        renderGrid()
    }

    document.getElementById("option-game-length").checked = false;
    document.getElementById("option-game-length").oninput = e => {
        options.optimiseLength = document.getElementById("option-game-length").checked
    }

    document.getElementById("button-play-next").onclick = e => {
        if (lock || winner != false) {
            return
        }

        document.getElementById("info-evaluation-time").innerHTML = `Thinking...`

        setTimeout(() => {
            let [layerNum, i] = bestMoveForPlayer(currentPlayer, options.depthLimit)
            makeMove(layerNum, i, ai = true)
        }, 20)
    }

}