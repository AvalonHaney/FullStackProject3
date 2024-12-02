const cells = document.querySelectorAll(".cell");
const form = document.getElementById("form");
const playerName = document.getElementById("name");
const room = document.getElementById("room");
const header = document.getElementById("status");
const socket = io();
let currentGame = null;
let gameCode = null;
let player = null;
socket.on("updateGame", (newState) => updateGame(newState));

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const user = playerName.value;
    const roomCode = room.value;
    socket.emit("join", user, roomCode, (success, joinNumber) => {
        if(success){
            console.log("Successfully Connected, you are Player " + joinNumber);
            player = joinNumber;
            gameCode = roomCode;
            currentGame = "game";
            updateHeader();
        }
        else{
            console.log("Failed to Connect");
        }
    });
})

for (let cell of cells) {
	cell.addEventListener("click", () => {
		if(!currentGame || currentGame.gameOver){
            return;
        }
		const code = room.value;
		const cellId = Number(cell.id);
		socket.emit("playMove", code, [Math.floor(cellId / 3), cellId % 3], (success) => {
			if (!success) console.log("Move Failed");
			else console.log("Move played successfully!");
		});
	});
}

socket.on("update", updateGame);
socket.on("terminated", updateGame(null));

function updateGame(newState){
    for(let cell of cells){
        cell.style.backgroundColor = "red";
    }
    for(let marker of document.querySelectorAll(".marker")){
        marker.remove();
    }
    if(!newState){
        currentGame = null;
        player = null;
        gameCode = null;
        return;
    }
    currentGame = newState;
    for(let i = 0; i < 3; i++){
		for(let j = 0; j < 3; j++){
			const val = currentGame.gameGrid[i][j];
			if(val === " "){
                continue;
            }
			const parentId = i * 3 + j;
			let newMarker = document.createElement("img");
			newMarker.classList.add("marker");
			if(val === "X"){
                newMarker.src = "x.png";
                console.log(val)
            }
            else if(val === "O"){
                newMarker.src = "o.png";
                console.log(val)
            }
			document.getElementById(parentId).appendChild(newMarker);
		}
		if(currentGame.gameOver && currentGame.correctCells){
			for(let pair of currentGame.correctCells){
				const squareId = pair[0] * 3 + pair[1];
				document.getElementById(squareId).style.backgroundColor = "green";
			}
		}
	}
    updateHeader();
}

function updateHeader(){
    if(currentGame == null){
        header.innerText = "No Game is Currently Live.";
    }
    else if(currentGame.gameOver){
        header.innerText = "Game Over!";
    }
    else if(!currentGame.playerTwo){
        header.innerText = "Waiting For Opponent";
    }
    else{
        header.innerText = "Playing against '" + (player === 1 ? currentGame.playerTwo ?? "Unknown" : currentGame.playerOne ?? "Unknown") + "' - " + (player === currentGame.activePlayer ? "Your Move!" : "Waiting On Opponent");   
    }
}

updateHeader();