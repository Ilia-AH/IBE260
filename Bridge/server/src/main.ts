// Main entry point for the server which initiates the game of bridge
import path from 'path';
import express, { Express } from 'express';
import { GameEngine } from './GameEngine';

const app: Express = express();
const port: number = 3000;

// WIP
// start game of bridge with 4 players
app.get("/", (req, res) => {
    try {
        res.send("Starting game");
        const startGame = async () => {
            const game = new GameEngine([
                { name: "player1", hand: [] },
                { name: "player2", hand: [] },
                { name: "player3", hand: [] },
                { name: "player4", hand: [] },
            ]);
            console.log(await game.startGame()); 
            
            while (!game.isGameOver()) {
                console.log(game.endRound());
            }
            console.log("Game Over");
        };
        startGame();
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Testing only for nodemon - remove later
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../client/dist")));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
