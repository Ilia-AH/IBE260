import { Card } from './deck';

// Definisjon for spiller
export interface isPlayer {
    name: string;
    hand: Card[];
}

// Oppretter klasse som følger definisjonen for spiller
export class Player implements isPlayer {
    public name: string;
    public hand: Card[] = [];

    constructor(name: string) {
        this.name = name;
        this.hand = []
    } 
}

// Definisjon for lag
export interface isTeam {
    name: string,
    players: Player[]
}

// Oppretter klasse som følger definisjonen for lag
export class Team implements isTeam {
    public name =  '';
    public players: Player[] = [];

    constructor(player1: Player, player2: Player) {
        this.players = [player1, player2];
    }
}