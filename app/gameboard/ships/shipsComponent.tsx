'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import { MESSAGE_TYPES, WARNINGS, ALERTS } from '@/app/types/types';
import connection from '../../WebSocket/connection';
import './ships.css';

export default function Ships(props: any) {
    const { positionSetObject, ships, selectedImage, shipPositions, setSelectedImage } = props;
    const router = useRouter();
    const [isReady, setIsReady] = React.useState(true);

    React.useEffect(() => {
        if (shipPositions.length === 10) {
            setIsReady(false);
        }
    }, [shipPositions.length]);
    
    function handleMessage(event: MessageEvent) {
        const data = JSON.parse(event.data);

        if (data.type == WARNINGS.WAITING_FOR_OPPONENT) {
            alert(ALERTS.WAITING_FOR_OPPONENT);
        } else if (data.type == WARNINGS.START_GAME) {
            alert(ALERTS.GAME_IS_ON);
            connection.removeEventListener('message', handleMessage);
            router.replace('/gameOn');
        }
    }

    const handleOpen = () => {
        const positionsArray = Array.from(positionSetObject);
        connection.send(JSON.stringify({ 
            type: MESSAGE_TYPES.START_GAME, 
            username: sessionStorage.getItem('username'),
            roomID: sessionStorage.getItem('roomID'),
            positionsArray
        }));
        connection.removeEventListener('open', handleOpen);
    };

    const handleClick = (event: any) => {
        event.preventDefault();
        if (connection.readyState == WebSocket.OPEN) {
            handleOpen();
        } else {
            connection.addEventListener('open', handleOpen);
        }
        connection.addEventListener('message', handleMessage);
    }

    return (
        <div className='centered-column'>
            <div className='ship-card'>

                {ships.map((ship: any, index: number) => (
                    <div key={index} className='ship-card-inner'>
                        <div>
                            <img 
                                id={ship.id} 
                                src={ship.url} 
                                alt={ship.name} />
                        </div>
                        <div className='ship-card-inner2'>
                            <label key={ship.name}>
                                <input
                                    type="radio"
                                    name="image"
                                    value={ship.name}
                                    checked={selectedImage == ship.name}
                                    onChange={() => setSelectedImage(ship.name)} />
                            </label>
                            <h4>Name: {ship.name}</h4>
                            <h4>Size: {ship.size}</h4>
                            <h4>Amount: {ship.amount}</h4>
                        </div>
                    </div>
                ))}

            </div>
            <div>
                <Button 
                variant="contained" 
                color='primary' 
                onClick={handleClick} 
                disabled={isReady}>
                    Ready to Fight!
                </Button>
            </div>
        </div>
    );
}


