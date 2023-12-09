export const realShips = [{
    id: 1,
    name: 'Carrier',
    size: 5,
    url: '/ships/huge.png',
    amount: 2
}, {
    id: 2,
    name: 'Battleship',
    size: 3,
    url: '/ships/large.png',
    amount: 2
}, {
    id: 3,
    name: 'Cruiser',
    size: 2,
    url: '/ships/medium.png',
    amount: 3
}, {
    id: 4,
    name: 'Destroyer',
    size: 1,
    url: '/ships/small.png',
    amount: 3
}];

export type ShipsType = {
    id: number;
    name: string;
    size: number;
    url: string;
    amount: number;
};

export interface ShipPosition {
    name: string;
    size: number;
    position: string;
}