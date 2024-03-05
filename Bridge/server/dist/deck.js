"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importere shuffle fra biblioteket shuffle-array, basert på Fisher-Yates algoritme
// Referanse: https://www.npmjs.com/package/shuffle-array
const shuffle_array_1 = __importDefault(require("shuffle-array"));
// Oppretter klassen Deck, hvor den har metoder for å shuffle kortstokken, trekke kort og sjekke antall kort igjen
class Deck {
    constructor() {
        this.deck = [];
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        for (const suit of suits) {
            for (const rank of ranks) {
                this.deck.push({ suit, rank });
            }
        }
        this.shuffleDeck();
    }
    shuffleDeck() {
        (0, shuffle_array_1.default)(this.deck);
    }
    drawCard() {
        if (this.deck.length === 0) {
            throw new Error('No cards left in the deck');
        }
        return this.deck.pop();
    }
    remainingCards() {
        return this.deck.length;
    }
}
exports.default = Deck;
// -----------------Debugging purpose-----------------
// console.log(new Deck().deck);
