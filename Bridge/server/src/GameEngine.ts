export interface Card {
    suit: string,
    rank: string
}

export interface Deck extends Array<Card> {}

export interface Player {
    hand: Deck,
    name: string
}

export interface Team {
    name: string,
    players: Player[],
    score: number
}

// Remember to implement Trick logic
export interface Trick extends Array<Card> {}

function shuffleDeck(deck: Deck): Deck {
    return deck.sort(() => Math.random() - 0.5);
}


export class GameEngine {
  private deck: Deck;
  private players: Player[];
  private teams: Team[];
  private currentTrick: Trick;
  private currentTrickWinner: Player;
  private currentDealer: Player;
  private currentTurn: Player;
  private currentRound: number;
  private currentTrickNumber: number;

 constructor(players: Player[]) {
    this.deck = this.createDeck();
    this.players = players;
    this.teams = this.createTeams();
    this.currentTrick = [];
    this.currentTrickWinner = this.players[0]; // Assign an initial value of type Player
    this.currentDealer = this.players[0];
    this.currentTurn = this.players[0];
    this.currentRound = 1;
    this.currentTrickNumber = 1;
}
  startGame(): {
    players: Player[];
    teams: Team[];
    currentDealer: Player;
    currentTurn: Player;
    currentRound: number;
    currentTrickNumber: number;
  } {
    this.dealHands();
    return {
      players: this.players,
      teams: this.teams,
      currentDealer: this.currentDealer,
      currentTurn: this.currentTurn,
      currentRound: this.currentRound,
      currentTrickNumber: this.currentTrickNumber,
    };
  }
  playCard(player: Player, card: Card): Trick {
    player.hand = player.hand.filter((c) => c !== card);
    this.currentTrick.push(card);
    this.currentTurn = this.nextTurn(player); // Use the nextTurn function
    if (this.currentTrick.length === 4) {
      this.endTrick();
    }
    return this.currentTrick;
  }
  endTrick(): Trick {
    this.currentTrickWinner = this.currentTurn;
    this.currentTrickNumber += 1;
    this.currentTrick = [];
    return this.currentTrick;
  }
  nextTurn(player: Player): Player {
    const index = this.players.indexOf(player);
    return this.players[(index + 1) % 4];
  }
  

  endTurn(): Player {
    return this.currentTurn;
  }
  nextDealer(): Player {
    const index = this.players.indexOf(this.currentDealer);
    return this.players[(index + 1) % 4];
  }
  calulateScore(): Team[] {
    for (const team of this.teams) {
      for (const player of team.players) {
        team.score += player.hand.length;
      }
    }
    return this.teams;
  }
  endRound(): {
    teams: Team[];
    currentDealer: Player;
    currentRound: number;
  } {
    this.calulateScore();
    this.currentRound += 1;
    this.currentDealer = this.nextDealer();
    this.currentTrickNumber = 1;
    return {
      teams: this.teams,
      currentDealer: this.currentDealer,
      currentRound: this.currentRound,
    };
  }
  isGameOver(): boolean {
    return this.currentRound === 13;
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
    return deck;
  }

  private createTeams(): Team[] {
    return [
      { players: [this.players[0], this.players[2]], name: 'Nord og Syd', score: 0 },
      { players: [this.players[1], this.players[3]], name: 'Vest og Øst', score: 0},
    ];
  }

  private dealHands(): void {
    this.deck = shuffleDeck(this.deck);
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].hand = this.deck.slice(i * 13, (i + 1) * 13);
    }
  }
  private compareCards(card1: Card, card2: Card): number {
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
    if (card1.suit === card2.suit) {
      return ranks.indexOf(card1.rank) - ranks.indexOf(card2.rank);
    }
    return -1;
  }
  
private getWinnerOfTrick(trick: Trick): Card | undefined {
    const leadSuit = trick[0].suit;
    let winningCard = trick[0];
    for (const card of trick) {
        if (
            card.suit === leadSuit &&
            this.compareCards(card, winningCard) === 1
        ) {
            winningCard = card;
        }
    }
    return trick.find((card) => card === winningCard);
}}