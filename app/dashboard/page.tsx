'use client';
import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import connection from "../WebSocket/connection";
import { MESSAGE_TYPES } from '../types/types';
import Table from '../table/tableComponent';
import GameMode from './gameModes/gameMode';

export default function Dashboard() {
    const [numberOfPlayers, setNumberOfPlayers] = useState<number>(0);
    const scrollPositionRef = useRef(0);
    const connectionEstablished = useRef(false);
    const router = useRouter();

    if (typeof window !== 'undefined') {
        if (!sessionStorage.getItem('username')) router.push('/');
    }
    useEffect(() => {
        function handleMessage1(event: MessageEvent) {
            setNumberOfPlayers(JSON.parse(event.data).message);
        }

        function handleOpenInside1() {
            if (!connectionEstablished.current) {
                connection.onmessage = handleMessage1;
                connection.send(JSON.stringify({ type: MESSAGE_TYPES.GET_NUMBER_OF_USERS }));
                connectionEstablished.current = true;
            }
        }
        
        if (connection.readyState == WebSocket.OPEN) {
            handleOpenInside1();
        } else {
            connection.addEventListener('open', handleOpenInside1);
        }
        
        return () => {
            connection.removeEventListener('open', handleOpenInside1);
            connection.onmessage = null;
        };
    }, []);

    useEffect(() => {
        const handleBeforeunload = (e: { preventDefault: () => void; returnValue: string; }) => {
            e.preventDefault();
            if (connection.readyState == WebSocket.OPEN) {
                connection.send(JSON.stringify({ 
                    type: MESSAGE_TYPES.DELETE_USER_AND_ROOM, 
                    username: sessionStorage.getItem('username'),
                    roomID: -1
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

    const handleOpenInside2 = () => {
        connection.send(JSON.stringify({ 
            type: MESSAGE_TYPES.REMOVE_USER, 
            username: sessionStorage.getItem('username') 
        }));
        connection.removeEventListener('open', handleOpenInside2);
    };

    const onBackButtonEvent = async (e: any) => {
        e.preventDefault();
        const username = sessionStorage.getItem('username');
        // https://battleshipgame-backend-b26558eb5106.herokuapp.com/api/users 
        const response = await fetch('https://battleshipgame-backend-b26558eb5106.herokuapp.com/api/users', {
                method: 'DELETE',
                mode: 'cors', 
                credentials: 'omit',
                body: JSON.stringify({ username })
            }).then((res) => {
                if (res.status == 200) {
                    return res.json();
                } else {
                    throw new Error(`Failed to remove username: ${res.statusText}`);
                }
            }).catch((error) => {
                console.log(error);
            });
        
        if (response.data) {
            if (connection.readyState == WebSocket.OPEN) {
                handleOpenInside2();
            } else {
                connection.addEventListener('open', handleOpenInside2);
            }
        }
        
        sessionStorage.removeItem('username');
        router.push('/');
    };

    return (
        <div>
            <GameMode />
            <Table numberOfPlayers={numberOfPlayers} />
        </div>
    );
}
