let grids = [
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
];

let currentPlayer = "X";
let winner = "";

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

function flipPlayer(player) {
    return player == "X" ? "O" : "X";
}

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

function handleClick(elem) {
    if (winner != "") {
        return false;
    }

    let grid = elem.getAttribute("data-grid");
    let index = elem.getAttribute("data-index");

    if (grids[grid][index] == null) {
        grids[grid][index] = currentPlayer;
        elem.innerHTML = currentPlayer;

        let winnerPositions = checkWinner();

        if (winnerPositions != false) {
            for (let position of winnerPositions.slice(0, 3)) {
                document.getElementById(
                    `box-${position[0]}-${position[1]}`
                ).style.background = "pink";
            }

            winner = currentPlayer;
        }

        currentPlayer = currentPlayer == "X" ? "O" : "X";
    }
}

document.querySelectorAll(".box").forEach((elem) => {
    elem.addEventListener("click", () => {
        handleClick(elem);
    });
});

function minimax(player, max, depth = 4) {
    if (depth == 0) {
        // We've run out time to evaluate options, so this state is indeterminate.
        return 0;
    }

    // Check for winnings. If this player wins, then return +100. If they lose, return -100.
    let winner = checkWinner();
    if (winner != false) {
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

                // Simulate putting a player's mark in this location.
                grids[gridIndex][position] = player;

                bestValue = Math.max(
                    bestValue,
                    minimax(player, false, depth - 1)
                );

                // Undo simulating putting a player's mark in this location.
                grids[gridIndex][position] = null;
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

                // Simulate putting a player's mark in this location.
                grids[gridIndex][position] = flipPlayer(player);

                bestValue = Math.min(
                    bestValue,
                    minimax(player, true, depth - 1)
                );

                // Undo simulating putting a player's mark in this location.
                grids[gridIndex][position] = null;
            }
        }

        return bestValue;
    } else {
        console.error("got a player that wasn't the");
    }
}

function bestMoveForPlayer(player, depth = 4) {
    let bestValue = -Infinity;
    let bestMove = [];
    
    for (let gridIndex = 0; gridIndex < 3; gridIndex++) {
        for (let position = 0; position < 9; position++) {
            // We can't put squares in locations that already exist.
            if (grids[gridIndex][position] != null) {
                continue;
            }

            // Simulate putting a player's mark in this location.
            grids[gridIndex][position] = player;

            // console.log('here')
            let score = minimax(player, player == "O", depth - 1)
            console.log([gridIndex, position], score)
            if (bestValue < score) {
                bestValue = score
                bestMove = [gridIndex, position]
            }

            // Undo simulating putting a player's mark in this location.
            grids[gridIndex][position] = null;
        }
    }

    return bestMove;
}

function playNextMove() {
    let bestMove = bestMoveForPlayer(currentPlayer);

    if (winner != "") {
        return;
    }

    if (bestMove != []) {
        let gridIndex = bestMove[0];
        let position = bestMove[1];

        document.getElementById(`box-${gridIndex}-${position}`).innerHTML =
            currentPlayer;

        grids[gridIndex][position] = currentPlayer;

        let winnerPositions = checkWinner();

        if (winnerPositions != false) {
            for (let position of winnerPositions.slice(0, 3)) {
                document.getElementById(
                    `box-${position[0]}-${position[1]}`
                ).style.background = "pink";
            }

            winner = currentPlayer;
        }

        currentPlayer = flipPlayer(currentPlayer);
    } else {
        alert("No best move found!");
    }
}
