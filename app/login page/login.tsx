"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import connection from "../WebSocket/connection";
import { MESSAGE_TYPES } from '../types/types';

export default function LoginForm() {
    const router = useRouter();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isReady, setIsReady] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<boolean>(false);

    useEffect(() => {
        setIsReady(username && password ? false : true);
    }, [username, password]);

    const handleOpen = () => {
        connection.send(JSON.stringify({ type: MESSAGE_TYPES.ADD_USER, username, password }));
        connection.removeEventListener('open', handleOpen);
    };

    const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();

        try {
            const response = await fetch('https://battleshipgame-backend-b26558eb5106.herokuapp.com/api/users', {
                method: 'POST',
                mode: 'cors', 
                credentials: 'omit',
                body: JSON.stringify({ username, password })
            }).then((res) => {
                if (res.status == 200) {
                    setErrorMessage(false);
                    return res.json();
                } else if (res.status == 409) {
                    setErrorMessage(true);
                } else {
                    throw new Error(`Failed to add username: ${res.statusText}`);
                }
            });
            
            if (response.data) {
                sessionStorage.setItem('username', username);
                if (connection.readyState == WebSocket.OPEN) {
                    handleOpen();
                } else {
                    connection.addEventListener('open', handleOpen);
                }
                router.push('/dashboard');
            } else {
                console.error('Failed to add user!');
            }
        } catch (error) {
            console.log(error);
        }

    } 

    return (
        <form 
        onSubmit={handleSubmit} 
        className="loginForm">

            <Box className='loginBox'>

                <FormLabel className="formLabel">
                    Please, write your name
                </FormLabel>

                <TextField  
                    className="textArea"
                    placeholder='Username' 
                    variant="outlined"
                    value={username} 
                    onChange={(e: any) => setUsername(e.target.value)}
                    />
                {errorMessage && <h4 className='errorMessage'>This name already exists!</h4>}
            </Box>

            <Box className='loginBox'>

                <FormLabel className="formLabel">
                    Please, write your password
                </FormLabel>

                <TextField  
                    className="textArea"
                    placeholder='Password' 
                    variant="outlined"
                    value={password} 
                    onChange={(e: any) => setPassword(e.target.value)} 
                    type='password' />
            </Box>

            <Button 
                type='submit' 
                disabled={isReady}
                className="loginButton" >
                Submit
            </Button>

        </form>
    );
}