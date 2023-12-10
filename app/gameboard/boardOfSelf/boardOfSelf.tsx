'use client';
import * as React from 'react';
import '../generalBoard.css';

export default function BoardOfSelf(props: any) {
    const { 
        selectedImage, ships, 
        positionSetObject, 
        setPositionSetObject, 
        updateAmountOfShips, 
        setShipPositions 
    } = props;
    const [grid, setGrid] = React.useState(Array(10).fill(Array(10).fill(null)));
    
    const handleHover = (event: React.MouseEvent<HTMLDivElement>) => {
        const tempUrl = ships.find((ship: { name: string; }) => ship.name === selectedImage);
        event.currentTarget.style.backgroundImage = `url(${tempUrl.url})`;
        
        if (tempUrl.size !== 1) {
            let counter = 10;
            let counter2 = 1;
            let yOffset = 25;
            let xOffset = 0;
            
            Array.from(document.getElementsByClassName('col')).forEach((element: any) => {
                if (element.id == parseInt(event.currentTarget.id) + counter && counter2 < tempUrl.size) {
                    counter += 10;
                    counter2 += 1;
                    element.style.backgroundImage = `url(${tempUrl.url})`;
                    element.style.backgroundPosition = `${xOffset}px -${yOffset}px`;
                    yOffset += 25;
                    if (yOffset == 125) {
                        element.style.backgroundColor = 'white';
                    }
                } 
            });
        }
    };
      
    const handleLeave = (event: React.MouseEvent<HTMLDivElement>) => {
        const tempUrl = ships.find((ship: { name: string; }) => ship.name === selectedImage);
        event.currentTarget.style.backgroundImage = 'url(/bgCanvas.png)';
        
        if (tempUrl.size !== 1) {
            let counter = 10;
            let counter2 = 1;
            
            Array.from(document.getElementsByClassName('col')).forEach((element: any) => {
                if (element.id == parseInt(event.currentTarget.id) + counter && counter2 < tempUrl.size) {
                    counter += 10;
                    counter2 += 1;
                    element.style.backgroundImage = 'url(/bgCanvas.png)';
                    element.style.backgroundPosition = `${0}px -${0}px`
                } 
            });
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const tempUrl = ships.find((ship: { name: string; }) => ship.name === selectedImage);
        if (!(tempUrl.amount > 0)) {
            return;
        }
        
        const currentId = parseInt(event.currentTarget.id);
        const totalSize = tempUrl.size * 10;
        const holdOn = Array(totalSize / 10).fill(0).map((_, i) => (10 * i)  + currentId);
        
        if (holdOn.some((val) => positionSetObject.has(val))) {
            return;
        } else {
            holdOn.forEach((val) => positionSetObject.add(val));
            setPositionSetObject(new Set(positionSetObject));
        }
        
        if (tempUrl.size !== 1) {
            if (currentId + totalSize <= 100 + (currentId % 10)) {
                let counter = 10;
                let counter2 = 1;
                let yOffset = 0;
                let xOffset = 0;
                const newGrid = grid.map((row, rowIndex) => {

                    return row.map((col: any, colIndex: any) => {
                        const key = `${rowIndex}${colIndex}`;
                        if (parseInt(`${rowIndex}${colIndex}`) === currentId) {
                            return <div key={key} className='ifStatement'
                                    style={{
                                        backgroundImage: `url(${tempUrl.url})`,
                                        backgroundPosition: `${xOffset}px -${yOffset}px` }} />

                        } else if (parseInt(`${rowIndex}${colIndex}`) === currentId + counter && counter2 < tempUrl.size) {
                            counter += 10;
                            counter2 += 1;
                            yOffset += 25;
                            return <div className='ifStatement' key={key}
                                    style={{
                                        backgroundImage: `url(${tempUrl.url})`,
                                        backgroundPosition: `${xOffset}px -${yOffset}px` }} />
                        } else {
                            return col;
                        }
                    });

                });

                setGrid(newGrid);
                if (tempUrl.amount > 0) {
                    updateAmountOfShips(tempUrl.name, tempUrl.amount - 1);
                }

                const newShipPositions = {
                    name: tempUrl.name,
                    size: tempUrl.size,
                    position: currentId.toString(),
                }
                setShipPositions((prevShipPositions: any) => [
                    ...prevShipPositions, 
                    newShipPositions
                ]);
            }
        } else {
            const newGrid = grid.map((row, rowIndex) => {
                return row.map((col: any, colIndex: any) => {
                    const key = `${rowIndex}${colIndex}`;
                    if (parseInt(`${rowIndex}${colIndex}`) == currentId) {
                        return <img className='elseImage' key={key}
                                src={tempUrl.url} 
                                alt={tempUrl.name} />
                    } else {
                        return col;
                    }
                });
            });

            setGrid(newGrid);
            if (tempUrl.amount > 0) {
                updateAmountOfShips(tempUrl.name, tempUrl.amount - 1);
            }

            const newShipPositions = {
                name: tempUrl.name,
                size: tempUrl.size,
                position: currentId.toString(),
            };

            setShipPositions((prevShipPositions: any) => [
                ...prevShipPositions,
                newShipPositions,
            ]);
        }
    };
      
    return (
        <div className='ParentBoard'>
            <div className='titleOfBoard'>
                <h1>Board of Self</h1>
            </div>

            <div className="board">

                {grid.map((row, rowIndex) => (
                    <div className="row" key={`row_${rowIndex}`}>

                        {row.map((col: any, colIndex: React.Key) => (
                            <div 
                            id={`${rowIndex}${colIndex}`}
                            className="col" 
                            
                            key={`col_${rowIndex}_${colIndex}`}
                            onMouseEnter={handleHover}
                            onMouseLeave={handleLeave}
                            onClick={handleClick} >
                                {col}
                            </div>
                        ))}

                    </div>
                ))}

            </div>
        </div>
    );
}
