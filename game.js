class Game{
    constructor(player1, player2){
        this.player1 = player1 ?? null;
        this.player2 = player2 ?? null;
        this.activePlayer = 1;
        this.gameGrid = [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
        ];
        this.correctCells = undefined;
        this.gameOver = false;
    }
    playMove(playerNum, location){
		if(this.gameOver){
            return null;
        }
		if(playerNum !== this.activePlayer){
            return null;
        }
		if(!Array.isArray(location) || !location.length === 2){
            return null;
        }
		if(this.gameGrid[location[0]][location[1]] !== " "){
            return null;
        }
		this.gameGrid[location[0]][location[1]] = playerNum === 1 ? "X" : "O";
		this.checkGame();
		if(!this.gameOver){
            this.activePlayer = this.activePlayer === 1 ? 2 : 1;
        }
		return this.currentState;
	}
    get currentState(){
		return {
			playerOne: this.player1?.playerName,
			playerTwo: this.player2?.playerName,
			activePlayer: this.activePlayer,
			gameGrid: this.gameGrid,
            correctCells: this.correctCells,
			gameOver: this.gameOver,
		};
	}
    checkGame(){
		const grid = this.gameGrid;

		for(let s = 0; s < 2; s++){
			const symbol = s === 0 ? "X" : "O";
			for(let i = 0; i < 3; i++){
				if(grid[i][0] === symbol && grid[i][1] === symbol && grid[i][2] === symbol){
					this.correctCells = [
						[i, 0],
						[i, 1],
						[i, 2],
					];
					this.gameOver = true;
					return;
				}
				if(grid[0][i] === symbol && grid[1][i] === symbol && grid[2][i] === symbol){
					this.correctCells = [
						[0, i],
						[1, i],
						[2, i],
					];
					this.gameOver = true;
					return;
				}
			}
			if(grid[0][0] === symbol && grid[1][1] === symbol && grid[2][2] === symbol){
				this.correctCells = [
					[0, 0],
					[1, 1],
					[2, 2],
				];
				this.gameOver = true;
				return;
			}
			if(grid[0][2] === symbol && grid[1][1] === symbol && grid[2][0] === symbol){
				this.correctCells = [
					[0, 2],
					[1, 1],
					[2, 0],
				];
				this.gameOver = true;
				return;
			}
		}
		let count = 0;
		for(let i = 0; i < 3; i++){
			for(let j = 0; j < 3; j++){
                if(grid[i][j] !== " "){
                    count++;
                }
            }
        }
		if(count === 9){
			this.correctCells = null;
			this.gameOver = true;
		}
	}
}

class Player{
    constructor(playerId, playerName, playerNum){
        this.playerId = playerId;
        this.playerName = playerName;
        this.playerNum = playerNum;
    }
}

export { Game, Player };