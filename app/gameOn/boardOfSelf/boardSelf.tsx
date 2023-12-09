'use client';
import { useEffect, useState } from 'react';
import { audioHit, audioMiss } from '../audio/audio';
import '../generalBoard.css';

export default function BoardOfSelf(props: any) {
    const { myTurn, isShip, positionId, opponentName } = props;
    const [grid, setGrid] = useState(Array(10).fill(Array(10).fill(null)));
    
    useEffect(() => {
        const newGrid = grid.map((row: any, rowIndex: number) => {
            return row.map((col: any, colIndex: number) => {
                if (isShip && positionId == `${rowIndex}${colIndex}` && 
                    opponentName != sessionStorage.getItem('username') && myTurn) {
                        audioHit.play();
                    return <img
                        src="/ships/fair.png"
                        style={{ height: '28px', width: '28px' }} />
                } else if (!(isShip) && positionId == `${rowIndex}${colIndex}` && 
                    opponentName != sessionStorage.getItem('username') && myTurn) {
                        audioMiss.play();
                    return <img
                        src="/waterMissed.jpg"
                        style={{ height: '28px', width: '28px' }} />
                } else if (positionId == '-1') {
                    return <div style={{
                        backgroundImage: 'url("/bgCanvas.png")'
                    }}/>
                } else {
                    return col;
                }
            });
        });
        setGrid(newGrid);

    }, [positionId, isShip, myTurn, opponentName]);

    return (
        <div className='ParentBoard'>
            <div className='titleOfBoard'>
                <h1>Board of Self</h1>
            </div>

            <div className="board">

                {grid.map((row, rowIndex) => (
                    <div 
                    key={rowIndex}
                    style={{ display: 'flex' }}>

                    {row.map((col: any, colIndex: React.Key) => (

                        <div
                        className='col'
                        style={{
                            border: '0.5px solid black',
                            backgroundImage: 'url("/bgCanvas.png")',
                            height: '30px',
                            width: '30px',
                            position: 'relative',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat'
                        }}
                        key={colIndex} >
                            {col}
                        </div>

                    ))}
                    </div>
                ))}

            </div>

        </div>
    );
}