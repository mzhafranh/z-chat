'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/userSlice';
import { RootState } from '../store/store';
import type { AppDispatch } from '../store/store';
import { useRouter } from 'next/navigation';
import { getSocket } from "../components/SocketProvider";



export default function LoginBox() {
    const [usernameInput, setUsernameInput] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { username } = useSelector((state: RootState) => state.user);
    const router = useRouter();
    const socket = getSocket();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (usernameInput.trim()) {
            const contactData = await dispatch(loginUser({username: usernameInput}));
            if (contactData.payload.newUser){
                const emittedContact = {id: contactData.payload.user.id, username: contactData.payload.user.username}
                socket.emit(`contactList`, emittedContact)
            }
            router.push('/chat');
        }
    };

    return (
        <div className="container w-96 m-3 p-3 rounded-lg shadow-centered shadow-slate-500 flex flex-col">
            <div className="">
                <h1 className="text-emerald-500 font-bold text-center">LOGIN</h1>
            </div>
            <hr className="mt-2"/>
            <div className="">
                <form action="" onSubmit={handleLogin} className="w-full">
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="mt-4 block w-full p-2 rounded border border-solid border-gray-300 shadow-md"
                        placeholder="Username"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-1/2 mt-4 block mx-auto bg-sky-500 text-white text-sm py-2 px-4 rounded hover:bg-sky-600 focus:outline-none focus:ring focus:ring-sky-200 focus:ring-opacity-50">
                        LOG IN
                    </button>
                </form>
            </div>
        </div>
    )
}