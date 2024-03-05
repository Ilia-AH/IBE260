// Importere shuffle fra biblioteket shuffle-array, basert på Fisher-Yates algoritme
// Referanse: https://www.npmjs.com/package/shuffle-array
import shuffle from 'shuffle-array';

// Definisjon for kort
export interface Card {
    suit: string,
    rank: string
}

// Oppretter klassen Deck, hvor den har metoder for å shuffle kortstokken, trekke kort og sjekke antall kort igjen
export default class Deck {
    public deck: Card[] = [];

    constructor() {
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
        shuffle(this.deck);
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

// -----------------Debugging purpose-----------------
// console.log(new Deck().deck);