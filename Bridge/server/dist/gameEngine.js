"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showHand = exports.playCard = exports.nextTurn = exports.bidding = exports.bidderName = exports.passCount = exports.currentBid = exports.highestBid = exports.showTrumpSuit = exports.setTrumpSuit = exports.startGame = exports.createTeam = exports.table = exports.game = exports.gameDeck = void 0;
const player_1 = require("./player");
const deck_1 = __importDefault(require("./deck"));
// Klasse for spillkortstokk, har metode for å gi ny kortstokk
class gameDeck {
    constructor() {
        this.deck = new deck_1.default();
    }
    restart() {
        this.deck = new deck_1.default();
    }
}
exports.gameDeck = gameDeck;
exports.game = new gameDeck();
const handSize = 13;
exports.table = [];
// Denne klassen oppretter team og tildeler 13 kort
class createTeam extends player_1.Team {
    constructor(teamName, player1, player2) {
        super(player1, player2);
        this.name = teamName;
        this.startHand();
    }
    startHand() {
        for (const player of this.players) {
            for (let i = 0; i < handSize; i++) {
                const card = exports.game.deck.drawCard();
                if (card) {
                    player.hand.push(card);
                }
            }
        }
    }
}
exports.createTeam = createTeam;
// Denne funksjonen starter spillet og plasser spillerne i lag
function startGame(player1Name, player2Name, player3Name, player4Name) {
    const player1 = new player_1.Player(player1Name || 'Player 1');
    const player2 = new player_1.Player(player2Name || 'Player 2');
    const player3 = new player_1.Player(player3Name || 'Player 3');
    const player4 = new player_1.Player(player4Name || 'Player 4');
    const team1 = new createTeam('Nord og Syd', player1, player2);
    const team2 = new createTeam('Øst og Vest', player3, player4);
    return {
        team1: { name: team1.name, players: team1.players },
        team2: { name: team2.name, players: team2.players },
        players: [player1, player3, player2, player4], // Spillerlisten 
        currentTurn: 0, // Holder styr på hvem sin tur det er, hvor 0 er første spiller og 3 er siste spiller
        trumpSuit: 'notrump' // Denne vil bli overstyrt under budrunden
    };
}
exports.startGame = startGame;
// Denne funksjonen setter hvilken farge som er trumf
// Vi har ikke implementert denne, men hadde planer om det
function setTrumpSuit(game, suit) {
    game.trumpSuit = suit;
}
exports.setTrumpSuit = setTrumpSuit;
// Denne funksjonen viser hvilken farge som er trumf
// Vi har ikke implementert denne, men hadde planer om det
function showTrumpSuit(game) {
    return `The trump suit is: ${game.trumpSuit}`;
}
exports.showTrumpSuit = showTrumpSuit;
// Høyeste bud initieres som 0 og kløver, men blir overskrevet under budrunde
exports.highestBid = { number: 0, suit: 'clubs' };
exports.currentBid = [];
exports.passCount = 0;
exports.bidderName = '';
/*
Denne funksjonen sammenligner budene og returnerer true eller false
Merk at hvis det er samme antall triks, så vil fargen avgjøre hvilket bud som er høyest
Dette avgjøres ut fra indekseringen i suits array, hvor clubs er laveste og notrump er høyeste
*/
function compareBids(bid1, bid2) {
    if (bid1.number > bid2.number) {
        return true;
    }
    if (bid1.number === bid2.number) {
        const suits = ['clubs', 'diamonds', 'hearts', 'spades', 'notrump'];
        return suits.indexOf(bid1.suit) > suits.indexOf(bid2.suit);
    }
    return false;
}
/*
Hovedfunksjonen for budrunden. Tar inn et bud og oppdaterer høyeste bud samt vinner når 3 spillere har gitt pass
OBS! Vi begynte å skrive denne funksjonen før vi skrev RESTFUL API, så deler av denne koden blir ikke implementert
slik vi opprinnelig ønsket. Derfor kan det tenkes koden bør endres senere, men for nå så fungerer den som den skal
under RESTFUL API testing. E.g. deler av koden som validerer input gjøres ved RESTFUL API og derfor kanskje unødvendig
å gjøre det her også.
*/
function bidding(game, bid) {
    if (exports.passCount >= 3) {
        exports.highestBid = exports.currentBid.reduce((highest, bid) => compareBids(bid, highest) ? bid : highest, exports.highestBid);
        exports.passCount = 0;
        if (exports.highestBid.number >= 7) {
            return `Bidding over! ${exports.bidderName} wins with ${exports.highestBid.number} tricks (${exports.highestBid.suit})`;
        }
        return `New round, ${game.players[game.currentTurn].name} starts. Winner of bid: ${exports.bidderName} with ${exports.highestBid.number} tricks`;
    }
    if (typeof bid === "string" && bid.toLowerCase() === "pass") {
        exports.passCount++;
        const passerName = game.players[game.currentTurn].name;
        nextTurn(game);
        return `${passerName} passed`;
    }
    // Bud må følge typen Bid og derfor sjekkes det om denne typen er en objekt som følger denne strukturen
    if (typeof bid === "object" && compareBids(bid, exports.highestBid)) {
        exports.currentBid.push(bid);
        exports.highestBid = bid;
        exports.bidderName = game.players[game.currentTurn].name;
        const response = `${exports.bidderName} bids ${bid.number} ${bid.suit}`;
        nextTurn(game);
        return response;
    }
    return 'Invalid bid';
}
exports.bidding = bidding;
// Funksjon for å passere tur
function nextTurn(game) {
    game.currentTurn = (game.currentTurn + 1) % game.players.length;
    return (game.players[game.currentTurn].name);
}
exports.nextTurn = nextTurn;
// Funksjon for å spille kort fra hånden, denne er ikke i bruk i oppgaven - kan dog implementeres senere
function playCard(player, index, game) {
    if (index < 0 || index >= player.hand.length) {
        throw new Error('Invalid index');
    }
    const played = player.hand.splice(index, 1)[0];
    exports.table.push(played);
    nextTurn(game);
    return played;
}
exports.playCard = playCard;
// Funksjon for å se kort på hånden, igjen ikke i bruk i oppgaven
function showHand(player) {
    return player.hand;
}
exports.showHand = showHand;
// // -----------------Ignore this, only for testing/debugging 
// const gameResult = startGame("Ada", "Bob", "Leon", "Truls")
// console.log(bidding(gameResult,{number:2, suit: 'Spades'}))
// console.log(bidding(gameResult,{number:4, suit: 'Hearts'}))
// console.log(bidding(gameResult,{number:5, suit: 'Hearts'}))
// console.log(bidding(gameResult,"pass"))
// console.log(bidding(gameResult,"pass"))
// console.log(bidding(gameResult,"pass"))
// // Bidding funker for første runde med spill, men ikke ny runde
// console.log(bidding(gameResult,{number:2, suit: 'Hearts'}))
// console.log(bidding(gameResult,{number:2, suit: 'Spades'}))
// console.log(bidding(gameResult,{number:4, suit: 'Hearts'}))
// console.log(bidding(gameResult,{number:5, suit: 'Hearts'}))
// console.log(bidding(gameResult, "pass"));
// console.log(bidding(gameResult, "PASS"));
// console.log(bidding(gameResult, "PaSs"));
// console.log(passCount);
// console.log(bidding(gameResult, 5));
// console.log(bidding(gameResult, 12));
// console.log(bidding(gameResult, 12));
// console.log(bidding(gameResult, 5));
// console.log(bidding(gameResult, 12));
// console.log(bidding(gameResult, 5));
// console.log(bidding(gameResult, 12));
// console.log(gameResult.team1.name);
// console.log(gameResult.team1.players[0].name);
// console.log(gameResult.team1.players[0].hand);
// console.log(gameResult.team1.players[1].name);
// console.log(gameResult.team1.players[1].hand);
// console.log(gameResult);
// console.log(table);
// console.log(gameResult);
// console.log(showHand(gameResult.team1.players[0]));
// console.log(playCard(gameResult.team1.players[0], 0));
// console.log(showHand(gameResult.team1.players[0]));
// console.log(table);
// console.log(passTurn(gameResult));
// ----------------- Testing showHand, playCard og currentTurn -----------------
// Første runden
// console.log(gameResult.currentTurn);
// console.log(gameResult.team1.players[0].name);
// console.log(showHand(gameResult.team1.players[0]));
// console.log(playCard(gameResult.team1.players[0],0,gameResult));
// console.log(showHand(gameResult.team1.players[0]));
// console.log(table);
// // // Andre runden
// console.log(gameResult.currentTurn);
// console.log(gameResult.team2.players[0].name);
// console.log(showHand(gameResult.team2.players[0]));
// console.log(playCard(gameResult.team1.players[0],0,gameResult));
// console.log(showHand(gameResult.team2.players[0]));
// console.log(table);
// // // Tredje runden
// console.log(gameResult.currentTurn);
// console.log(gameResult.team1.players[1].name);
// console.log(showHand(gameResult.team1.players[1]));
// console.log(playCard(gameResult.team1.players[0],0,gameResult));
// console.log(showHand(gameResult.team1.players[1]));
// console.log(table);
// // // Fjerde runden
// console.log(gameResult.currentTurn);
// console.log(gameResult.team2.players[1].name);
// console.log(showHand(gameResult.team2.players[1]));
// console.log(playCard(gameResult.team1.players[0],0,gameResult));
// console.log(showHand(gameResult.team2.players[1]));
// console.log(table);
// // Femte runden, som vil si at det er første spiller sin tur igjen (nullstill currentTurn))
// console.log(gameResult);
// ----------------- Ignore this, only for testing/debugging [OLD RESULT] -----------------
// console.log(gameResult[0]); // -> Nord og Syd
// console.log(gameResult[1][0]); // -> Player { hand: [Array], name: 'Kari' }
// console.log(gameResult[1][1]); // -> Player { hand: [Array], name: 'Per' }
// console.log(gameResult[2]); // -> Øst og Vest
// console.log(gameResult[3][0]); // -> Player { hand: [Array], name: 'Ola' }
// console.log(gameResult[3][1]); // -> Player { hand: [Array], name: 'Nils' }
// Result of console.log(gameResult)
// ['Nord og Syd',
//     [
//       Player { hand: [Array], name: 'Kari' },
//       Player { hand: [Array], name: 'Per' }
//     ],
//     'Øst og Vest',
//     [
//       Player { hand: [Array], name: 'Ola' },
//       Player { hand: [Array], name: 'Nils' }
//     ]
//   ]
