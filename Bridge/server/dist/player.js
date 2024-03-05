"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = exports.Player = void 0;
// Oppretter klasse som følger definisjonen for spiller
class Player {
    constructor(name) {
        this.hand = [];
        this.name = name;
        this.hand = [];
    }
}
exports.Player = Player;
// Oppretter klasse som følger definisjonen for lag
class Team {
    constructor(player1, player2) {
        this.name = '';
        this.players = [];
        this.players = [player1, player2];
    }
}
exports.Team = Team;
