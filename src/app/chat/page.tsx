'use client';

import { useEffect } from "react";
import ChatContainer from "./ChatContainer";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from "../store/store";
import { verifyToken } from "../store/slices/userSlice";


export default function Page() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    if (!token) {
      window.location.href = "/login"
    } else {
      const verified = dispatch(verifyToken({token}))
      if (!verified) {
        window.location.href = "/login"
      }
    } 
  }, [token]);

  return (
    <div className="flex justify-center h-screen items-center">
      <ChatContainer />
    </div>
  );
}
