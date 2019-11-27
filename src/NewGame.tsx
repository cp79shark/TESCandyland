import React, { ReactChild, useState } from 'react';
import { Redirect } from 'react-router';
import { Player } from './constants_funcs';

interface NewGameProps {
    players: Array<Player>,
    playerCount: number,
    playersReady: boolean,
    setPlayerCount: (count: number) => void,
    setPlayers: (names: string[]) => void,
    newGameReset: () => void,
    children?: ReactChild,
}

const NewGame: React.FC<NewGameProps> = (props) => {
    const [playersReady, setPlayersReady] = useState(props.playersReady);
    const [playerCount, _setPlayerCount] = useState(props.playerCount);
    const [players, setPlayers] = useState(props.players);

    function resetPlayers() {
        const [player1, player2, player3, player4] = players;

        player1.position = 0;
        player2.position = 0;
        player3.position = 0;
        player4.position = 0;

        setPlayers([player1, player2, player3, player4]);
    }

    function startGame(): void {
        resetPlayers();
        setPlayersReady(true);
    }

    if (playersReady) {
        props.newGameReset();
        return (<Redirect to="/game"></Redirect>);
    }

    function updatePlayers(e: any) {
        const _players = props.players.concat([]);
        _players[e.currentTarget.id].name = e.currentTarget.value;
        setPlayers(_players);
    }

    function setPlayerCount(e: any) {
        const value = parseInt(e.target.value, 10);
        props.setPlayerCount(value);
        _setPlayerCount(value);
    }

    return (
        <div>
            <div className="form-field">
                <label>Number of Players</label>
                <select value={props.playerCount || playerCount} onChange={setPlayerCount}>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                </select>
            </div>

            <div className="form-field">
                <label>Player 1 Name:</label>
                <input type="text" name="player1name" id="0" value={players[0].name} onChange={updatePlayers}></input>
            </div>
            <div className="form-field">
                <label>Player 2 Name:</label>
                <input type="text" name="player2name" id="1" value={players[1].name} onChange={updatePlayers}></input>
            </div>
            <div className="form-field">
                <label>Player 3 Name:</label>
                <input type="text" disabled={playerCount < 3} id="2" name="player3name" value={players[2].name} onChange={updatePlayers}></input>
            </div>
            <div className="form-field">
                <label>Player 4 Name:</label>
                <input type="text" disabled={playerCount < 4} id="3" name="player4name" value={players[3].name} onChange={updatePlayers}></input>
            </div>

            <br />

            <button type="button" className="start" onClick={startGame}>Start</button>
        </div>
    );
};

export default NewGame;