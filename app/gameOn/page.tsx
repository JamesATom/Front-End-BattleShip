'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MESSAGE_TYPES, WARNINGS, ALERTS } from '../types/types';
import connection from '../WebSocket/connection';
import BoardOfSelf from './boardOfSelf/boardSelf';
import BoardOfEnemy from './boardOfEnemy/boardEnemy';

export default function GameOn() {
    const [myTurn, setMyTurn] = useState(false);
    const [isShip, setIsShip] = useState(false);
    const [positionId, setPositionId] = useState<string>('-1');
    const [opponentName, setOpponentName] = useState('');
    const [winner, setWinner] = useState<boolean>(false);
    const router = useRouter();
    const connectionEstablished = useRef(false);
    const scrollPositionRef = useRef(0);

    if (typeof window !== 'undefined') { 
        if (!sessionStorage.getItem('username') || !sessionStorage.getItem('roomID')) {
            router.push('/');
        }
    }

    useEffect(() => {
        function handleMessage(event: MessageEvent) {
            const data = JSON.parse(event.data);
            if (data.type == MESSAGE_TYPES.WHOSE_TURN) {
                setMyTurn(data.turn);
            } 
        }

        function handleOpen() {
            if (!connectionEstablished.current) { 
                connection.send(JSON.stringify({ 
                    type: MESSAGE_TYPES.WHOSE_TURN, 
                    username: sessionStorage.getItem('username'),
                    roomID: sessionStorage.getItem('roomID')
                }));
                connectionEstablished.current = true;
            }
            connection.removeEventListener('open', handleOpen);
        }

        if (connection.readyState == WebSocket.OPEN) {
            handleOpen();
        } else {
            connection.addEventListener('open', handleOpen);
        }

        connection.addEventListener('message', handleMessage);

        return () => {
            connection.removeEventListener('message', handleMessage);
            connection.removeEventListener('open', handleOpen);
        }
    }, []);

    useEffect(() => {
        const handleBeforeunload = (e: { preventDefault: () => void; returnValue: string; }) => {
            e.preventDefault();
            if (connection.readyState == WebSocket.OPEN) {
                connection.send(JSON.stringify({ 
                    type: MESSAGE_TYPES.DELETE_USER_AND_ROOM, 
                    username: sessionStorage.getItem('username'),
                    roomID: sessionStorage.getItem('roomID')
                }));
            }
            e.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeunload);
    
        return () => {
            window.removeEventListener('beforeunload', handleBeforeunload);
        };
      }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') { 
            scrollPositionRef.current = window.pageYOffset;

            window.addEventListener('load', () => {
                window.scrollTo(0, scrollPositionRef.current);
            });

            return () => {
                window.removeEventListener('load', () => {
                    window.scrollTo(0, scrollPositionRef.current);
                });
            };
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') { 
            window.history.pushState(null, '', window.location.pathname);
            window.addEventListener('popstate', onBackButtonEvent);
            
            return () => {
                window.removeEventListener('popstate', onBackButtonEvent);
            }
        }
    }, []);
      
    useEffect(() => {
        function handleMessage(event: MessageEvent) {
            const data = JSON.parse(event.data);
            if (data.type == WARNINGS.OPPONENT_LEFT) {
                alert(ALERTS.OPPONENT_LEFT);
                router.replace('/dashboard');
            } else if (data.type == WARNINGS.CHECK_IF_THERE_IS_SHIP) {
                setIsShip(data.isShip);
                setPositionId(data.currentId);
                setMyTurn((prev) => !prev);
                setOpponentName(data.opponentName);
                setWinner(data.winner);
            } 
        }

        connection.addEventListener('message', handleMessage);

        return () => {
            connection.removeEventListener('message', handleMessage);
        }
    });
    
    useEffect(() => {
        if (winner) {
            alert('Winner is ' + opponentName + '!');
            router.replace('/dashboard');
        }
    }, [winner]);

    const checkIfThereIsShip = (currentId: number) => {
        if (connection.readyState == WebSocket.OPEN) {
            handleOpenIsShip(currentId);
        } else {
            connection.addEventListener('open', () => handleOpenIsShip(currentId));
        }
    }

    const handleOpenIsShip = (currentId: number) => {
        connection.send(JSON.stringify({ 
            type: MESSAGE_TYPES.CHECK_IF_THERE_IS_SHIP, 
            username: sessionStorage.getItem('username'),
            roomID: sessionStorage.getItem('roomID'),
            currentId
        }));
        connection.removeEventListener('open', () => handleOpenIsShip(currentId));
    }

    const handleOpen = () => {
        connection.send(JSON.stringify({ 
            type: MESSAGE_TYPES.LEAVE_ROOM_DURING_GAME, 
            username: sessionStorage.getItem('username'),
            roomID: sessionStorage.getItem('roomID')
        }));
        connection.removeEventListener('open', handleOpen);
    };

    const onBackButtonEvent = (event: any) => {
        event.preventDefault();
        if (connection.readyState == WebSocket.OPEN) {
            handleOpen();
        } else {
            connection.addEventListener('open', handleOpen);
        }
    };

    return (
        <>
            <div className='betweenBoards'>
                <h2>{myTurn ? 'Your Turn...' : 'Waiting for the opponent to make a move...'}</h2>
            </div>

            <div style={{
                position: 'absolute',
                top: '100px',
                left: '500px'
            }}>
                <BoardOfEnemy 
                myTurn={myTurn} 
                isShip={isShip} 
                positionId={positionId}
                opponentName={opponentName}
                checkIfThereIsShip={checkIfThereIsShip} />
            </div>

            <div style={{
                position: 'absolute',
                top: '100px',
                right: '500px'
            }}>
                <BoardOfSelf 
                myTurn={myTurn}
                isShip={isShip}
                positionId={positionId}
                opponentName={opponentName} />
            </div>
        </>
    );
};
