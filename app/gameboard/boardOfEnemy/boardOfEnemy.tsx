'use client';
import * as React from 'react';
import '../generalBoard.css';

export default function BoardOfEnemy() {
    const [grid, setGrid] = React.useState(Array(10).fill(Array(10).fill(null)));
    
    return (
        <div className='ParentBoard'>
            <div className='titleOfBoard'>
                <h1>Enemy Board</h1>
            </div>

            <div className="board">
                {grid.map((row, rowIndex) => (
                    <div className="row" key={rowIndex}>

                    {row.map((col: any, colIndex: React.Key) => (
                        <div
                        className="col"
                        key={colIndex} >


                        </div>
                    ))}

                    </div>
                ))}
            </div>
        </div>
    );
}