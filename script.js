const dialog = document.querySelector("dialog");
const startGame = document.querySelector(".startGameBtn");
startGame.addEventListener("click", (e) => {dialog.showModal();});
const submitInputBtn = document.querySelector("#submitInput");
submitInputBtn.addEventListener("click", (e) => {
    startGame.classList.add("disabled");
    let playerName1 = document.querySelector("#player-1").value;
    let playerName2 = document.querySelector("#player-2").value;

    const player1 = createUser(playerName1, 1);
    const player2 = createUser(playerName2, 2);
    const turn = currentPlayer(player1, player2);
    gameBoard.createBoard(turn);

    const mainSection = document.querySelector(".outer-box");
    const playerDisplay = document.createElement("p");
    playerDisplay.classList.add("player-display");
    playerDisplay.innerText = `${player1.name}: ${player1.playerSymbol} vs ${player2.name}: ${player2.playerSymbol}`;
    mainSection.appendChild(playerDisplay);
    
    const playersTurn = document.createElement("p");
    playersTurn.innerText = `It's your turn, ${turn.getCurrentPlayer().name}`;
    playersTurn.classList.add("players-turn");
    mainSection.prepend(playersTurn);
    dialog.close();
});

function createUser (name, playerNumber){
    switch (playerNumber) {
        case 1:
            var playerSymbol = "X";
            break;
        case 2:
            var playerSymbol = "O";
            break;
    };
    return {name, playerSymbol, playerNumber}
}

function currentPlayer(player1, player2){
    let currentPlayer = 1;
    const getCurrentPlayer = () => {
        return currentPlayer%2===player1.playerNumber?player1:player2; 
    };
    const updatePlayer = () => {
        return currentPlayer++;
    };
    return {currentPlayer, updatePlayer, getCurrentPlayer};
}

const gameBoard = (function (){
    let boardValues = ["", "", "", "", "", "", "", "", ""];
    const getBoardValues = () => {return boardValues};
    const getEmptyBoard = () => {
        boardValues = ["", "", "", "", "", "", "", "", ""];
        document.querySelectorAll(".field").forEach((el) => el.remove());
        document.querySelectorAll(".players-turn").forEach((el) => el.remove());
        document.querySelectorAll(".player-display").forEach((el) => el.remove());
        document.querySelectorAll(".clearBtn").forEach((el) => el.remove());
        startGame.classList.remove("disabled");
        return boardValues;
    };

    function evalWinner () {
        const allEqual = arr => arr.every( v => v === arr[0]);
        var results = [];
        var diag1 = [];
        var diag2 = [];
        // Check columns for equality
        for (let col=0;col<3;col++){
            var cols = [];
            var rows = [];
            for (let row=0;row<3; row++) {
                rows.push(boardValues[col*3+row]);
                cols.push(boardValues[col+row*3]);
                if ((row+col+2)%2==0 && (row===col)){
                    if (row===1){
                        diag2.push(boardValues[col*3+row]);
                    }
                    diag1.push(boardValues[col*3+row]);
                } else if ((row+col+2)%2==0){
                    diag2.push(boardValues[col*3+row]);
                };
            };
            for (let check of [cols, rows]){
                if (check.includes("")){
                    results.push(false);
                } else  {
                    results.push(allEqual(check));
                }
            };
        }
        for (let check of [diag1, diag2]){
            if (check.includes("")){
                results.push(false);
            } else {
                results.push(allEqual(check));
            }
        }
        if (results.includes(true)){
            return true;
        } else {
            return false;
        }
    }   

    const createBoard = (turn) => {
        for (let i=0; i < 3; i++){
            for (let j=0; j<3; j++){
                const container = document.querySelector(".gameboard-container");
                const newField = document.createElement("div");
                newField.classList.add(`field`);
                newField.classList.add(`row_${j}`);
                newField.classList.add(`col_${i}`);
                const fieldBackground = (i+j)%2===0 ? "dark":"bright";
                newField.classList.add(fieldBackground);
                newField.innerText = boardValues.slice(i*3+j, i*3+j);
                newField.addEventListener("click", (e) => {
                    player = turn.getCurrentPlayer();
                    newField.innerText = player.playerSymbol;
                    turn.updatePlayer();
                    boardValues.splice(i*3+j, 1, player.playerSymbol);
                    winner = evalWinner();
                    const playersTurn = document.querySelector(".players-turn");
                    playersTurn.innerText = `It's your turn, ${turn.getCurrentPlayer().name}`;
                    newField.classList.add("disabled");  

                    if (winner===true){
                        alert(`Congratulations: ${player.name} won!`);
                        getEmptyBoard();
                        console.log(boardValues);
                    };
                })

                container.appendChild(newField);
            }
        }
        const initBtns = document.querySelector(".init-btns");
        const clearBtn = document.createElement("button");
        clearBtn.classList.add("clearBtn");
        clearBtn.innerText = "Clear Board";
        clearBtn.addEventListener("click", (e) => {gameBoard.getEmptyBoard();});
        initBtns.append(clearBtn);
    }
    return {boardValues, getBoardValues, getEmptyBoard, createBoard};
})();

boardValues = gameBoard.getBoardValues();
