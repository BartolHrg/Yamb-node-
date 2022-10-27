# Yamb

This is backend support for the game Yamb.

# usage

To use it, modifiy the source code to your need.  
Currently, it is setup so that 2 pairs of RandomAI are playing, history of which is saved to `./history/history_<timestamp>.json`.  

# Modifications

## Rows & Columns
In folder `src/rows_and_columns/`  
You can add or remove rows and columns by modifying existing files  
or by creating new ones and adding them to `index.ts`.  

At your disposal are also modules from `./src/rows_and_columns/common/`  
which define most common templates for rows and columns  
(like function `find(pattern: number[], dices: ScoreNumber[])` which searches for a pattern of repeating same numbers  
e.g. to find "full", it uses `find([3, 2], dices)`)  

## AI
Custom AI behaviour can be defined by extending `AI` class and using `AICommunicationObject(ai_instance)`  
In derived class, override `decide(msg: CommunicationObject)` method.  
In it, handle cases for when `msg.type === "player start", "dices", or "write question"`  
in other cases, call `return <await> super.decide(msg)` (`await` here if you are using `async`)  

## Communication (modification)
Communication is used to communicate between `GameManager` and user, `GameManager` and AI, and to save history.  
If you have other use cases, override `Communication` or `StringCommunication` (or any other derived class).  

You can also add types to `CommunicationObject`.  
Each type should "extend" from the `BaseCommunicationObject`.  

## Dices
By default, each player shares the same dices, which roll uniform number form 1 to 6.  
You can define randomness by making custom `DiceRoller`.  
You can give different dices to each player by making `TeamDiceRollerFactory`.  

# Communication
Communicaton is done using `CommunicationObject`  
Each kind has unique `type` property  
* `"pre game"`  
  currently, this step is skipped, and defaults are used  
  further differentiated by `.data.main`:
  * `"teams, players"` sent by user, array of (team names and their array of player names)  
  * `"number of dices"` sent by user  
  * `"new game"` sent by user, after all game configuration is done  
  * `"start"` asked by backend (once), each player must individually respond with the same message with his name included  
  * `"order"` send by backend to inform players of the order in which teams will be playing  
* `"player start"` asked by backend, player responds with 0-th "player decision" (that can announce or be empty)  
* `"dices"` asked by backend, informs player of rolled dices, player responds with "player decision"  
* `"player decision"` sent by player, id of the question, indices of dices he wants rerolled, and optional announcement (see "player start" for one exception)  
* `"write question"` asked by backend, team (some player on the team) responds with "write decision"  
* `"write decision"` id of the question, player whose result should be written, and location where to write
* `"success"` sent by backend, can be true or false in response to "decisions", does not expect answer, in case of false, failed question will be resent
* `"final result"` array of teams and their final scores  
