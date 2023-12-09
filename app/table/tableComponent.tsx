'use client';
import { useEffect, useState } from "react";
import { MESSAGE_TYPES, Player } from '../types/types';
import connection from "../WebSocket/connection";
import './table.css';

export default function Table(props: any) {
    const { numberOfPlayers } = props;
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        const handleSocketMessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.type == MESSAGE_TYPES.GET_USERS) {
                setPlayers(data.message);
            }
        };

        const handleOpen = () => {
            connection.onmessage = handleSocketMessage;
            connection.send(JSON.stringify({ type: MESSAGE_TYPES.GET_USERS }));
        };
    
        if (connection.readyState == WebSocket.OPEN) {
            handleOpen();
        } else {
            connection.addEventListener('open', handleOpen);
        }
    
        return () => {
            connection.removeEventListener('open', handleOpen);
            connection.onmessage = null;
        };
    }, [numberOfPlayers]);
    
    return (
        <div className="best-players-container">
            <div className="best-players-heading">Best Players</div>
            <div className="players-table-container">
                <table className="players-table">
                    <thead>
                        <tr>
                            <th>N</th>
                            <th>Username</th>
                            <th>Points</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players && players.map((player: any, index: number) => (
                            <tr key={index} style={{ textAlign: 'center' }}>
                                <td>{index + 1}</td>
                                <td>{player.username.toUpperCase()}</td>
                                <td>{player.score}</td>
                                <td className="status">{player.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}