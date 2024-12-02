import { Server } from "socket.io";
import { Game, Player } from "./game.js";

export default function startSocketServer(server){
    const io = new Server(server);
    const activeGames = new Map();
    io.on("connection", (socket) => {
        socket.on("disconnecting", () => {
			console.log("Disconnecting Socket " + socket.id);
			activeGames.forEach((game, code) => {
				if(game.player1?.playerId === socket.id || game.player2?.playerId === socket.id){
					io.to(code).emit("terminated");
					io.socketsLeave(code);
					activeGames.delete(code);
				}
			});
		});
        socket.on("join", (user, roomCode, callback) => {
            let playerNum = -1
            if(activeGames.has(roomCode)){
                const game = activeGames.get(roomCode);
                if(game.player2){
                    callback(false, playerNum);
                    return;
                }
                game.player2 = new Player(socket.id, user, 2);
                playerNum = 2;
                socket.join(roomCode);
                io.to(roomCode).emit("update", game.currentState);
            }
            else{
                const newGame = new Game(new Player(socket.id, user, 1), null);
                activeGames.set(roomCode, newGame);
                playerNum = 1;
                socket.join(roomCode);
                io.to(roomCode).emit("update", newGame.currentState);
            }
            callback(true, playerNum);
        });
        socket.on("playMove", (roomCode, location, callback) => {
			console.log("playMove", roomCode, location);
			let game = activeGames.get(roomCode);
			if(!game || !game.player1 || !game.player2){
				callback(false);
				return;
			}
			if(game.player1.playerId !== socket.id && game.player2.playerId !== socket.id){
				callback(false)
				return;
			}
			const player = game.player1.playerId === socket.id ? 1 : 2;
			const newState = game.playMove(player, location);
			if(!newState){
				callback(false);
			} 
            else{
				io.to(roomCode).emit("update", newState);
				if(newState.gameOver){
					io.socketsLeave(roomCode);
					activeGames.delete(roomCode);
				}
				callback(true);
			}
		});
    });
}