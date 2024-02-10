import { Player as PlayerInterface, Deck } from "./GameEngine.js";

class Player implements PlayerInterface {
    public name: string;
    private score: number;
    public hand: Deck; // Change the access modifier of 'hand' property to public

    constructor(name: string) {
        this.name = name;
        this.score = 0;
        this.hand = this.createDeck().slice(0, 5); // Assign a portion of the shuffled deck to 'hand'
    }

    private shuffleDeck(deck: Deck): Deck {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    private createDeck(): Deck {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const ranks = [
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            'J',
            'Q',
            'K',
            'A',
        ];
        const deck: Deck = [];
        for (const suit of suits) {
            for (const rank of ranks) {
                deck.push({ suit, rank });
            }
        }
        return this.shuffleDeck(deck); // Shuffle the deck before returning
    }

    getName(): string {
        return this.name;
    }

    getScore(): number {
        return this.score;
    }

    updateScore(points: number): void {
        this.score += points;
    }
}

// Usage example:
const player1 = new Player("Alice");
console.log(player1.getName()); // Output: "Alice"
console.log(player1.getScore()); // Output: 0
console.log(player1.hand); // Output: Random hand of 5 cards

player1.updateScore(10);
console.log(player1.getScore()); // Output: 10