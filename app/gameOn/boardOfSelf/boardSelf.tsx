'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import '../generalBoard.css';

const audioHit = new Audio('/mp3/shot.mp3');
const audioMiss = new Audio('/mp3/miss.mp3');

export default function BoardOfSelf(props: any) {
    const { myTurn, isShip, positionId, opponentName } = props;
    const [grid, setGrid] = useState(Array(10).fill(Array(10).fill(null)));
    
    useEffect(() => {
        const newGrid = grid.map((row: any, rowIndex: number) => {
            return row.map((col: any, colIndex: number) => {
                const key = `${rowIndex}${colIndex}`;
                if (isShip && positionId == `${rowIndex}${colIndex}` && 
                    opponentName != sessionStorage.getItem('username') && myTurn) {
                        audioHit.play();
                    return <Image
                        key={key}
                        src="/ships/fair.png"
                        style={{ height: '28px', width: '28px' }} alt={'fair'} />
                } else if (!(isShip) && positionId == `${rowIndex}${colIndex}` && 
                    opponentName != sessionStorage.getItem('username') && myTurn) {
                        audioMiss.play();
                    return <Image
                        key={key}
                        src="/waterMissed.jpg"
                        style={{ height: '28px', width: '28px' }} alt={'water missed'} />
                } else if (positionId == '-1') {
                    return <div 
                    key={key}  
                    style={{
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
                    key={`row_${rowIndex}`}
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
                        key={`col_${rowIndex}_${colIndex}`} >
                            {col}
                        </div>

                    ))}
                    </div>
                ))}

            </div>
            
        </div>
    );
}