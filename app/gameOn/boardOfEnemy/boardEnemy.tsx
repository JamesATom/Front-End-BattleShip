'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import '../generalBoard.css';

const audioHit = new Audio('/mp3/shot.mp3');
const audioMiss = new Audio('/mp3/miss.mp3');

export default function BoardOfEnemy(props: any) {
    const { myTurn, isShip, positionId, opponentName, checkIfThereIsShip } = props;
    const [grid, setGrid] = useState(Array(10).fill(Array(10).fill(null)));
    const [allPositions, setAllPositions] = useState(new Set());

    useEffect(() => {
        const newGrid = grid.map((row: any, rowIndex: number) => {
            return row.map((col: any, colIndex: number) => {
                const key = `${rowIndex}${colIndex}`;
                if (isShip && positionId == key && 
                    opponentName == sessionStorage.getItem('username') && !(myTurn)) {
                        audioHit.play();
                    return <Image
                        key={key}
                        src="/ships/fair.png"
                        style={{ height: '28px', width: '28px' }} alt={'fair'} />
                } else if (!(isShip) && positionId == key && 
                    opponentName == sessionStorage.getItem('username') && !(myTurn)) {
                        audioMiss.play();
                    return <Image
                        key={key}
                        src="/waterMissed.jpg"
                        style={{ height: '28px', width: '28px' }} alt={'water missed'} />
                } else if (positionId == '-1') {
                    return <div key={key} style={{
                        backgroundImage: 'url("/bgCanvas.png")'
                    }}/>
                } else {
                    return col;
                }
            });
        });
        setGrid(newGrid);
    
    }, [positionId, isShip, myTurn, opponentName]);
    

    const handleHover = (event: React.MouseEvent<HTMLDivElement>) => {
        event.currentTarget.style.backgroundImage = 'url(/siman.jpg)';
    };
      
    const handleLeave = (event: React.MouseEvent<HTMLDivElement>) => {
        event.currentTarget.style.backgroundImage = 'url(/bgCanvas.png)';
    };

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const currentId = parseInt(event.currentTarget.id);

        if (allPositions.has(currentId)) {
            return;
        } else {
            checkIfThereIsShip(currentId);
            setAllPositions(prevPositions => new Set(prevPositions).add(currentId));
            event.currentTarget.style.backgroundImage = 'url(/bgCanvas.png)';
        }
    };
      
    return (
        <div className='ParentBoard'>
            <div className='titleOfBoard'>
                <h1>Board of Enemy</h1>
            </div>

            <div className="board">

                {grid.map((row, rowIndex) => (
                    <div style={{ display: 'flex' }} key={`row_${rowIndex}`}>

                        {row.map((col: any, colIndex: React.Key) => (
                            <div 
                            id={`cell_${rowIndex}_${colIndex}`}
                            className="col" 
                            key={`col_${rowIndex}_${colIndex}`}
                            onMouseEnter={myTurn ? handleHover : undefined}
                            onMouseLeave={myTurn ? handleLeave : undefined}
                            onClick={myTurn ? handleClick : undefined}
                            style={{
                                border: '0.5px solid black',
                                backgroundImage: 'url("/bgCanvas.png")',
                                height: '30px',
                                width: '30px',
                                position: 'relative',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat'
                            }} >
                                {col}
                            </div>
                        ))}

                    </div>
                ))}

            </div>
        </div>
    );
}


