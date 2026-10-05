const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];
    const getBoard = () => {
        return board;
    };

    const placeMark = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return {
        getBoard,
        placeMark,
        resetBoard
    };
})();

const createPlayer = (name, mark) => {
    return {
        name,
        mark
    };
};

const GameController = (() => {
    let player1;
    let player2;
    let currentPlayer;
    let gameOver = false;

    const startGame = (name1, name2) => {
        player1 = createPlayer(name1, "X");
        player2 = createPlayer(name2, "O");
        currentPlayer = player1;
        gameOver = false;
        Gameboard.resetBoard();
    };

    const restartGame = () => {
        Gameboard.resetBoard();
        currentPlayer = player1;
        gameOver = false;
    };

    const switchPlayer = () => {
        if (currentPlayer === player1) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1;
        }
    };

    const playRound = (index) => {
        if (gameOver) {
            return;
        }

        const moveSuccessful =
            Gameboard.placeMark(
                index,
                currentPlayer.mark
            );

        if (!moveSuccessful) {
            return;
        }

        if (checkWinner()) {
            gameOver = true;
            return currentPlayer.name + " wins!";
        }
        if (checkTie()) {
            gameOver = true;
            return "It's a tie!";
        }
        switchPlayer();
        return "continue";
    };

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let combination of winningCombinations) {
            const a = combination[0];
            const b = combination[1];
            const c = combination[2];

            if (
                board[a] !== "" &&
                board[a] === board[b] &&
                board[b] === board[c]
            ) {
                return true;
            }
        }
        return false;
    };
    const checkTie = () => {
        const board = Gameboard.getBoard();
        return board.every(
            cell => cell !== ""
        );
    };

    const getCurrentPlayer = () => {
        return currentPlayer;

    };
    return {
        startGame,
        restartGame,
        playRound,
        getCurrentPlayer
    };
})();

const DisplayController = (() => {
    const cells =
        document.querySelectorAll(".cell");

    const message =
        document.querySelector("#message");

    const startButton =
        document.querySelector("#startButton");

    const restartButton =
        document.querySelector("#restartButton");

    const renderBoard = () => {
        const board =
            Gameboard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent =
                board[index];
        });
    };

    const displayTurn = () => {
        const player =
            GameController.getCurrentPlayer();
        if (player) {
            message.textContent =
                player.name +
                "'s turn (" +
                player.mark +
                ")";
        }
    };

    startButton.addEventListener(
        "click",
        () => {
            const player1Name =
                document.querySelector("#player1").value;

            const player2Name =
                document.querySelector("#player2").value;

            if (
                player1Name === "" ||
                player2Name === ""
            ) {
                message.textContent =
                    "Please enter both player names.";
                return;
            }
            GameController.startGame(
                player1Name,
                player2Name
            );
            renderBoard();
            displayTurn();
        }
    );

    cells.forEach(cell => {
        cell.addEventListener(
            "click",
            () => {
                const index =
                    cell.dataset.index;
                const result =
                    GameController.playRound(index);
                renderBoard();

                if (
                    result &&
                    result !== "continue"
                ) {
                    message.textContent =
                        result;
                } else {
                    displayTurn();
                }
            }
        );
    });

    restartButton.addEventListener(
        "click",
        () => {
            GameController.restartGame();
            renderBoard();
            displayTurn();
        }
    );
})();