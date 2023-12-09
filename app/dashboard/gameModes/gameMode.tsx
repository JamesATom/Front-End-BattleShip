'use client';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import '../dashboard.css';

import { useRouter } from 'next/navigation';
import { PlayWithFriendButton } from '../popUpInput/popUpInputField';

export default function GameMode() {
    const router = useRouter();

    return (
        <Box className="boxStyle">
            <div className="textCenter">
                <p>Welcome to the BattleShip Game!</p>
            </div>
            <div className="textCenter">
                <p>What type of game do you choose?</p>
            </div>
            <div className="flexCenter">
                <div>
                    <Button 
                    variant='contained' 
                    disableElevation>
                        Play with Bot
                    </Button>
                </div>
                <div>
                    <PlayWithFriendButton />
                </div>
            </div>
        </Box>
    );
}