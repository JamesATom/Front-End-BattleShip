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

    if (!window.sessionStorage.getItem('username')) router.push('/');

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
            <div className="ship-container">
                <Ships
                    positionSetObject={positionSetObject}
                    ships={ships} 
                    selectedImage={selectedImage} 
                    shipPositions={shipPositions} 
                    setSelectedImage={setSelectedImage} />
            </div>
            
            <div className="board-of-self-container">
                <BoardOfSelf 
                    selectedImage={selectedImage} 
                    ships={ships} 
                    positionSetObject={positionSetObject}
                    setPositionSetObject={setPositionSetObject}
                    updateAmountOfShips={updateAmountOfShips} 
                    setShipPositions={setShipPositions} />
            </div>

            <div className="board-of-enemy-container">
                <BoardOfEnemy />
            </div>
        </>
    );
}