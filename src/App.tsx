import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import './App.css';
import Game from './Game';
import NewGame from './NewGame';
import GameOver from './GameOver';
import { Card, Player, Square, createDeck, getSearchStartPosition, boardMatrix, movePlayerOnScreen, hasJumpTo, shuffle } from './constants_funcs';

const App: React.FC = () => {
  // local properties
  const gameCards: Array<Card> = createDeck();

  // state of this control
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string>('');
  const [deck, setDeck] = useState<Array<Card>>(shuffle(gameCards.concat([])));
  const [playerCount, setPlayerCount] = useState(4);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [players, _setPlayers] = useState<Array<Player>>([
    { name: 'Player 1', position: -1, selectedCard: null },
    { name: 'Player 2', position: -1, selectedCard: null },
    { name: 'Player 3', position: -1, selectedCard: null },
    { name: 'Player 4', position: -1, selectedCard: null },
  ]);

  function movePlayer(_players: Array<Player>) {
    // find the next position for current player
    const currentPlayersCard = _players[currentPlayer].selectedCard;
    // we will start at the next square
    let position = _players[currentPlayer].position + 1;
    // if it's a double card, just get the color 
    let cardType = currentPlayersCard!.type.startsWith('double') ? currentPlayersCard!.type.split('double-')[1] : currentPlayersCard!.type;
    // most moves are 1, doubles are 2
    let numberOfMoves = currentPlayersCard!.type.startsWith('double') ? 2 : 1;

    // candy cards are a special situation, we could
    // possibly go backwards, so we need to adjust our starting position back/forward
    let startSearchPosition = getSearchStartPosition(currentPlayersCard!.type, position);
    let newSquare: Square;

    while (numberOfMoves > 0) {
      let i = startSearchPosition;

      // walk the board starting at our starting position 
      for (; i < boardMatrix.length; i++) {
        newSquare = boardMatrix[i];

        // if they match or they hit the end
        if (newSquare.type === cardType
            || newSquare.type === 'end') {
          // this is our new position
          position = i;
          // make sure to also advance our start by 1 in case of double
          startSearchPosition = position + 1;
          // we have our square, no need to continue looking at the board
          break;
        }
      }

      // we've processed a move
      numberOfMoves--;
    }

    // the index is the length of our board
    // then the game is over
    if (position >= boardMatrix.length -1) {
      // move the player on screen
      movePlayerOnScreen(currentPlayer, newSquare!.top, newSquare!.left);
      setWinner(players[currentPlayer].name);
      setTimeout(() => setGameOver(true), 4000);
      return;
    }

    // do we need to jump to another square from here?
    const jumpTo = (hasJumpTo(newSquare!))
      ? newSquare!.jumpTo!
      : -1;

    // set the player's internal position
    _players[currentPlayer].position = (jumpTo > -1)
      ? jumpTo
      : position;

    movePlayerOnScreen(currentPlayer, newSquare!.top, newSquare!.left);

    if (jumpTo > -1) {
      // they're jumping change the square
      newSquare = boardMatrix[jumpTo];

      // then jump to where they end up
      // after the animation has finished in 2 sec
      setTimeout(() => {
        movePlayerOnScreen(currentPlayer, newSquare!.top, newSquare!.left);
      }, 2000);
    }
  }

  function setPlayerCard(card: Card) {
    // set the players card
    const _players = players.concat([]);
    _players[currentPlayer].selectedCard = card;

    // move player
    movePlayer(_players);
    _setPlayers(_players);

    if (gameOver) { return; }

    let nextPlayer = currentPlayer + 1;
    if (nextPlayer >= playerCount) { nextPlayer = 0; }
    setCurrentPlayer(nextPlayer);
  }

  // when the user clicks the draw card button
  function drawCard() {
    // pick a random index in the deck of cards remaining
    const randomIndex = Math.floor(Math.random() * deck.length);
    console.log(`Selected card index ${randomIndex}`);

    // construct a copy of the deck
    const tmpDeck = deck.concat([]);
    // remove the card drawn
    tmpDeck.splice(randomIndex, 1);

    console.log(deck[randomIndex]);
    console.log(`${tmpDeck.length} cards remaining`);

    // set he current players drawn card
    setPlayerCard(deck[randomIndex]);

    // if we're out of cards (this is the last card)
    if (deck.length === 1) {
      console.log('Deck exhausted, shufffling');
      setDeck(shuffle(gameCards.concat([])));
    } else {
      // otherwise set our active deck to our temp deck (where we removed the drawn card)
      setDeck(tmpDeck);
    }
  }

  // When the user updates the player names
  function setPlayers(names: string[]) {
    _setPlayers([
      { name: names[0], position: -1, selectedCard: null },
      { name: names[1], position: -1, selectedCard: null },
      { name: names[2], position: -1, selectedCard: null },
      { name: names[3], position: -1, selectedCard: null },
    ]);
    // since they only update players on the main page
    // we reset the winner in case they came from the game over page
    setWinner('');
  }

  return (
    <div className="App">
      <h1>
        🍬🍬 TES Candyland!! 🍭🍭
        <small>
          <a href="https://shop.hasbro.com/en-us/product/candy-land-game:C4E461C2-5056-9047-F5F7-F005920A3999">Candyland</a> is published by Hasbro. This is an educational parody/tool.
        </small>
      </h1>
      <Router>
        <Switch>
          <Route exact path="/">
            <NewGame players={players} setPlayers={setPlayers} setPlayerCount={setPlayerCount} playerCount={playerCount}></NewGame>
          </Route>
          <Route path="/game">
            <Game winner={winner} currentPlayer={currentPlayer} gameOver={gameOver} drawCard={drawCard} players={players} playerCount={playerCount}></Game>
          </Route>
          <Route path="/gameover">
            <GameOver winner={winner} setGameOver={setGameOver}></GameOver>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;