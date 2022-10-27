// var readline = require('readline');

// import * as readline from "readline";

// var rl = readline.createInterface({
// 	input: process.stdin,
// 	output: process.stdout
// });

// rl.question("Name: ", answer => { console.log(`Pozdrav ${answer}`); rl.close() });

import {    rows_data } from "./src/rows_and_columns/Rows1";
import { columns_data } from "./src/rows_and_columns/Columns1";

import { Board } from "./src/Board";
import { TeamOfN } from "./src/teams/TeamOfN";
import { GameManager } from "./src/GameManager";
import { ConsoleCommunication } from "./src/communication/ConsoleCommunication";
import { json_stringer } from "./src/communication/StringCommunication";
import { sharedRollerFactory, uniformRoller1ToN } from "./src/DiceRoller";
import { Player } from "./src/players/Player";
import { CompositeCommunication } from "./src/communication/CompositeCommunication";
import { SaveHistoryCommunication } from "./src/communication/SaveHistoryCommunication";
import { RandomAI } from "./src/players/RandomAI";
import { AICommunication } from "./src/communication/AICommunication";
import { AI } from "./src/players/AI";




/*
"pre game": "new game"
"pre game": "teams, players"
		"pre game": "teams, players", [{"A", ["a", "b"]}, {"X", ["x", "y"]}, ]
		"pre game": "number of dices"
		"pre game": "number of dices", 5
		"pre game": "start"
		"pre game": "start" "a"
		"pre game": "start" "y"
		"pre game": "start" "x"
		"pre game": "start" "b"
		"pre game": "order", [1, 0]
"player start": "X", "x"
		"player start": [] // no announce
		"success": true
		"dices": "X", "x", [1, 2, 2, 4, 2]
		"player decision", [0, 3], ["announce", "2"]
"success": true
"dices": "X", "x", [4, 2, 2, 6, 2]
"player decision", [0, 3]
"success": true
"dices": "X", "x", [2, 2, 2, 3, 2]
"player start": "X", "y"
		"player start": [] // no announce
"success": true
"dices": "X", "y", ...
		"player decision", ...
"success": true
"dices": "X", "y", ...
"player decision", ...
"success": true
"dices": "X", "y", ...
"write question": "X"
"write decision": "x", ["announce", "2"]
"success": true
...
"final result" [{"A", 998}, {"X", 1011}]
*/


const boardFactory = () => new Board(columns_data, rows_data);

const roller = sharedRollerFactory([5, uniformRoller1ToN(6)]);

const teams = [
	new TeamOfN("A", [
		new RandomAI(),
		new RandomAI(),
	]),
	new TeamOfN("X", [
		new RandomAI(),
		new RandomAI(),
	]),
];

const communication = new SaveHistoryCommunication(
	new CompositeCommunication([
		new AICommunication(teams[0].players[0] as AI),
		new AICommunication(teams[0].players[1] as AI),
		new AICommunication(teams[1].players[0] as AI),
		new AICommunication(teams[1].players[1] as AI),
	])
	// new ConsoleCommunication(json_stringer),
);

const game_manager = new GameManager(teams, boardFactory, roller, communication);
game_manager.play();

// console.log("hello my friend")