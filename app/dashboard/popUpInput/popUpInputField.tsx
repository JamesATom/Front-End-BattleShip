'use client';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import connection from '../../WebSocket/connection';
import { MESSAGE_TYPES, WARNINGS } from '../../types/types';
import { useRouter } from 'next/navigation';
import './dialog.css';

export const PlayWithFriendButton = () => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    const [roomNumber, setRoomNumber] = React.useState<number>(0);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    
    const handleRoomNumberChange = (event: 
        { target: 
            { value: React.SetStateAction<string>; }; 
        }) => {
        setRoomNumber(Number(event.target.value));
    };

    const handleSocketMessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
       
        if (data.type == WARNINGS.FULL_ROOM) {
            setRoomNumber(0);
            alert(data.message);
            router.push('/dashboard');
        } 
    };

    const handleOpen = () => {
        connection.onmessage = handleSocketMessage;
        connection.send(JSON.stringify({ 
            type: MESSAGE_TYPES.JOIN_ROOM, 
            username: sessionStorage.getItem('username'),
            roomID: roomNumber
        }));

        setTimeout(() => {
            sessionStorage.setItem('roomID', String(roomNumber));
            connection.removeEventListener('open', handleOpen);
            connection.onmessage = null;
        }, 1000);
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (connection.readyState == WebSocket.OPEN) {
            handleOpen();
        } else {
            connection.addEventListener('open', handleOpen);
        }
        handleCloseModal();
        router.push('/gameboard');
    };
  
    return (
        <>
            <Button 
            variant='contained' 
            disableElevation
            onClick={handleOpenModal}>
                Play with Friend
            </Button>

            <Dialog
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="join-room-title"
                aria-describedby="join-room-description">

                <DialogTitle id="join-room-title">Join a Room</DialogTitle>

                <DialogContent>
                    <Typography id="join-room-description">
                        Enter a room number to join a game with a friend.
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Input
                            id="room-number"
                            name="room-number"
                            autoComplete="off"
                            value={roomNumber}
                            onChange={handleRoomNumberChange} />
                        <Box display="flex" justifyContent="space-between" margin='10px 0px 0px 0px'>
                            <Button onClick={handleCloseModal} color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary">
                                Join Room
                            </Button>
                        </Box>
                    </form>
                </DialogContent>
               
            </Dialog>
        </>
    );
};
