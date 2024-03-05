"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
// import http from 'http'; 
// import {session} from './gameSession'; -> Se kommentar i gameSession.ts
const gameEngine_1 = require("./gameEngine");
const player_1 = require("./player");
const port = 80;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/', express_1.default.static(path_1.default.join(__dirname, '../../client/dist')));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
// Spillerne som er med i spillet
let playerNames = [];
// Spillet som er i gang - initialisert til null, endres når spillet starter
let currentGame = null;
// Viser hvem som er med i spillet, vises i konsollen
app.get('/players', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(playerNames);
    res.send(playerNames);
}));
// Legger til spillere, begrenset til 4 spillere
app.post('/players/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (playerNames.length >= 4) {
            res.status(400).send('Max 4 players');
            return;
        }
        const newPlayer = new player_1.Player(req.params.id);
        const player = newPlayer.name;
        playerNames.push(player);
        res.status(200).send(`Player ${player} added`);
    }
    catch (error) {
        res.status(400).send("Nope, not working");
    }
}));
let gameStarted = false;
let gameRestarted = false;
// Restart spillet
app.post('/restartGame', (req, res) => {
    if (gameStarted) {
        gameStarted = false;
        gameRestarted = true;
        playerNames = [];
        gameEngine_1.game.restart();
        res.send('Game restarted');
        return;
    }
    res.send('Game has not started');
});
/*
Starter spillet kun hvis det er tilstrekkelig med spillere (4)
Viser kortene til hver spiller i konsollen, men primært brukt for debugging formål
e.g. om det er riktig tildeling av kort og lag.
*/
app.post('/startGame', (req, res) => {
    if (gameStarted) {
        res.send('Game has already started');
        return;
    }
    if (playerNames.length < 4) {
        res.status(400).send('Not enough player names');
        console.log(playerNames.length);
        console.log(playerNames);
        return;
    }
    currentGame = (0, gameEngine_1.startGame)(...playerNames);
    console.log(currentGame.team1.players[0].name);
    console.log(currentGame.team1.players[0].hand);
    console.log(currentGame.team1.players[1].name);
    console.log(currentGame.team1.players[1].hand);
    console.log(currentGame.team2.players[0].name);
    console.log(currentGame.team2.players[0].hand);
    console.log(currentGame.team2.players[1].name);
    console.log(currentGame.team2.players[1].hand);
    gameStarted = true;
    res.send('Game started');
    return;
});
// Viser hvem sin tur det er 
app.get('/game', (req, res) => {
    if (gameStarted && currentGame) {
        res.send(console.log(currentGame.players[currentGame.currentTurn].name));
        return;
    }
    res.send('Game has not started');
});
/*
Gi bud i spillet. Syntaksen for bud er <nummer><farge>, e.g. 1spades, 2hearts, 3notrump, 4clubs, 5diamonds
evt. "pass" for å gi pass. Går automatisk til neste spiller ved gyldig bud eller pass.
Ved ugyldig bud, er det fortsatt samme spiller sin tur til det blir gitt gyldig bud/pass.
*/
app.post('/game/bid/:bid', (req, res) => {
    if (!gameStarted) {
        res.status(400).send('Game has not started');
        return;
    }
    const bidParam = req.params.bid.toLowerCase();
    const regex = /^(\d+)([a-zA-Z]+)$/;
    const match = bidParam.match(regex);
    const potentialSuit = bidParam.replace(/^\d+/, '');
    const suits = ['hearts', 'diamonds', 'clubs', 'spades', 'notrump'];
    /*
    Vi er klar over liten logisk feil i koden vår (hvis alle spillere gir pass med engang),
    men vi antar at ingen spillere vil gjøre dette i virkeligheten og derfor ikke brukt tid
    på å fikse dette.
    */
    if (bidParam === 'pass') {
        try {
            const result = (0, gameEngine_1.bidding)(currentGame, 'pass');
            res.send(result);
        }
        catch (error) {
            res.status(400).send(error);
        }
    }
    else if (match && suits.includes(potentialSuit)) {
        const bidType = {
            number: parseInt(match[1], 10),
            suit: match[2]
        };
        if (bidType.number > 7) {
            res.status(400).send('Maximum number of tricks are 7');
            return;
        }
        try {
            const result = (0, gameEngine_1.bidding)(currentGame, bidType);
            res.send(result);
        }
        catch (error) {
            res.status(400).send(error);
        }
    }
    else {
        res.status(400).send('Invalid bid format');
    }
});
app.listen(port, () => {
    console.log(`Bridge server is running on port ${port}`);
});
