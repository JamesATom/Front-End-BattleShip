'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { MESSAGE_TYPES } from '../types/types';
import { realShips, ShipPosition } from '../shipsArray/shipsArray';
import BoardOfSelf from './boardOfSelf/boardOfSelf';
import BoardOfEnemy from './boardOfEnemy/boardOfEnemy';
import Ships from './ships/shipsComponent';
import connection from "../WebSocket/connection";
import './generalBoard.css';

export default function GameBoard() {
    const [selectedImage, setSelectedImage] = React.useState(realShips[3].name);
    const [ships, setShips] = React.useState(realShips);
    const [shipPositions, setShipPositions] = React.useState<Array<ShipPosition>>([]);
    const [positionSetObject, setPositionSetObject] = React.useState(new Set());
    const router = useRouter();
    const scrollPositionRef = useRef(0);

    if (typeof window !== 'undefined') {
        if (!sessionStorage.getItem('username')) router.push('/');
    }
    
    useEffect(() => {
        scrollPositionRef.current = window.pageYOffset;

        window.addEventListener('load', () => {
            window.scrollTo(0, scrollPositionRef.current);
        });

        return () => {
            window.removeEventListener('load', () => {
                window.scrollTo(0, scrollPositionRef.current);
            });
        };
    }, []);

    useEffect(() => {
        const handleBeforeunload = async (e: { preventDefault: () => void; returnValue: string; }) => {
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
        window.history.pushState(null, '', window.location.pathname);
        window.addEventListener('popstate', onBackButtonEvent);
        
        return () => {
            window.removeEventListener('popstate', onBackButtonEvent);
        }
    }, []);
    
    const updateAmountOfShips = (name: string, amount: number) => {
        const tempShips = ships.map((ship) => {
            if (ship.name === name) {
                return {
                    ...ship,
                    amount: amount,
                };
            }
            return ship;
        });
        setShips(tempShips);
    }

    const handleOpenInside2 = () => {
        connection.send(JSON.stringify({ 
            type: MESSAGE_TYPES.LEAVE_ROOM, 
            username: sessionStorage.getItem('username') 
        }));
        connection.removeEventListener('open', handleOpenInside2);
    };
 
    const onBackButtonEvent = async (e: any) => {
        e.preventDefault();
        if (connection.readyState == WebSocket.OPEN) {
            handleOpenInside2();
        } else {
            connection.addEventListener('open', handleOpenInside2);
        }
        router.push('/dashboard');
    };

    return (
        <>
            <div style={{
                top: 120,
                left: 150,
                position: 'absolute',
            }}>
                <Ships
                    positionSetObject={positionSetObject}
                    ships={ships} 
                    selectedImage={selectedImage} 
                    shipPositions={shipPositions} 
                    setSelectedImage={setSelectedImage} />
            </div>
            
            <div style={{
                position: 'absolute',
                top: 100,
                right: 600
            }}>
                <BoardOfSelf 
                    selectedImage={selectedImage} 
                    ships={ships} 
                    positionSetObject={positionSetObject}
                    setPositionSetObject={setPositionSetObject}
                    updateAmountOfShips={updateAmountOfShips} 
                    setShipPositions={setShipPositions} />
            </div>

            <div style={{
                position: 'absolute',
                top: 100,
                right: 200,
            }}>
                <BoardOfEnemy />
            </div>
        </>
    );
}