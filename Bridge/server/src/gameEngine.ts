import { Team, Player } from './player';
import Deck, { Card } from './deck';

// Klasse for spillkortstokk, har metode for å gi ny kortstokk
export class gameDeck {
    public deck: Deck;
    constructor() {
        this.deck = new Deck();
    }
    restart() {
        this.deck = new Deck();
    }
}
export const game = new gameDeck();
const handSize = 13;
export const table: Card[] = [];


// Denne klassen oppretter team og tildeler 13 kort
export class createTeam extends Team {
    constructor(teamName: string, player1: Player, player2: Player) {
        super(player1, player2);
        this.name = teamName;
        this.startHand();
    }

    public startHand() {
        for (const player of this.players) {
            for (let i = 0; i < handSize; i++) {
                const card = game.deck.drawCard();
                if (card) {
                    player.hand.push(card);
                }
            } 
        } 
    }
}

// Denne funksjonen starter spillet og plasser spillerne i lag
export function startGame(player1Name: string, player2Name: string, player3Name: string, player4Name: string) {
    const player1 = new Player(player1Name || 'Player 1');
    const player2 = new Player(player2Name || 'Player 2');
    const player3 = new Player(player3Name || 'Player 3');
    const player4 = new Player(player4Name || 'Player 4');
    
    const team1 = new createTeam('Nord og Syd', player1, player2);
    const team2 = new createTeam('Øst og Vest', player3, player4);
    
    return {
        team1: { name: team1.name, players: team1.players },
        team2: { name: team2.name, players: team2.players },
        players: [player1, player3, player2, player4], // Spillerlisten 
        currentTurn: 0, // Holder styr på hvem sin tur det er, hvor 0 er første spiller og 3 er siste spiller
        trumpSuit: 'notrump' as Suit // Denne vil bli overstyrt under budrunden
    };
}

// Type for suit (fargene)
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades' | 'notrump';

// Type for spilling, brukes blant annet i bidding funksjonen
export type Game = {
    team1: Team;
    team2: Team;
    players: Player[];
    currentTurn: number;
    trumpSuit: Suit;
};

// Denne funksjonen setter hvilken farge som er trumf
// Vi har ikke implementert denne, men hadde planer om det
export function setTrumpSuit(game: Game, suit: Suit) {
    game.trumpSuit = suit;
}

// Denne funksjonen viser hvilken farge som er trumf
// Vi har ikke implementert denne, men hadde planer om det
export function showTrumpSuit(game: Game) {
    return `The trump suit is: ${game.trumpSuit}`;
}

// Type for bud, bruker tall (antall triks) og må være en av fargene (type suit)
export type Bid = {
    number: number;
    suit: Suit;
};

// Høyeste bud initieres som 0 og kløver, men blir overskrevet under budrunde
export let highestBid: Bid = { number: 0, suit: 'clubs' };
export const currentBid: Bid[] = [];
export let passCount = 0;
export let bidderName = '';

/* 
Denne funksjonen sammenligner budene og returnerer true eller false
Merk at hvis det er samme antall triks, så vil fargen avgjøre hvilket bud som er høyest
Dette avgjøres ut fra indekseringen i suits array, hvor clubs er laveste og notrump er høyeste
*/
function compareBids(bid1: Bid, bid2: Bid) {
    if (bid1.number > bid2.number) {
        return true;
    }if (bid1.number === bid2.number) {
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
export function bidding(game: Game, bid: Bid | string) {
    if (passCount >= 3) {
        highestBid = currentBid.reduce((highest, bid) => compareBids(bid, highest) ? bid : highest, highestBid);
        passCount = 0;
        if (highestBid.number >= 7) {
            return `Bidding over! ${bidderName} wins with ${highestBid.number} tricks (${highestBid.suit})`;
        }
        return `New round, ${game.players[game.currentTurn].name} starts. Winner of bid: ${bidderName} with ${highestBid.number} tricks`;
    }
    if (typeof bid === "string" && bid.toLowerCase() === "pass") {
        passCount++;
        const passerName = game.players[game.currentTurn].name;
        nextTurn(game);
        return `${passerName} passed`;
    }
    // Bud må følge typen Bid og derfor sjekkes det om denne typen er en objekt som følger denne strukturen
    if (typeof bid === "object" && compareBids(bid, highestBid)) {
        currentBid.push(bid);
        highestBid = bid;
        bidderName = game.players[game.currentTurn].name;
        const response = `${bidderName} bids ${bid.number} ${bid.suit}`;
        nextTurn(game);
        return response;
    }
    return 'Invalid bid';
}

// Funksjon for å passere tur
export function nextTurn(game: Game) {
    game.currentTurn = (game.currentTurn + 1) % game.players.length;
    return (game.players[game.currentTurn].name);
}

// Funksjon for å spille kort fra hånden, denne er ikke i bruk i oppgaven - kan dog implementeres senere
export function playCard(player: Player, index: number, game: Game) {
    if (index < 0 || index >= player.hand.length) {
        throw new Error('Invalid index');
    }
    const played = player.hand.splice(index, 1)[0];
    table.push(played);
    nextTurn(game);
    return played;
}

// Funksjon for å se kort på hånden, igjen ikke i bruk i oppgaven
export function showHand(player: Player) {
    return player.hand;
}



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