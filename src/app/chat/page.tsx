'use client';

import { useEffect } from "react";
import ChatContainer from "./ChatContainer";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "../store/store";
import { login, verifyToken } from "../store/slices/userSlice";
import { useRouter } from 'next/navigation'


export default function Page() {
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const currentUser = typeof window !== 'undefined' ? localStorage.getItem('zchatuser') : null;
  const dispatch = useDispatch<AppDispatch>();
  const { username } = useSelector((state: RootState) => state.user);


  useEffect(() => {
    if (!token || !currentUser) {
      router.push('/login')
    } else {
      dispatch(login(currentUser))
      dispatch(verifyToken({ token }))
        .then((action) => {
          if (!action.payload) {
            router.push('/login')
          }
        })
        .catch((err) => {
          console.error("Error verifying token:", err);
          router.push('/login')
        });
    }
  }, [token, dispatch]);

  return (
    <div className="flex justify-center h-screen items-center bg-gray-900 text-gray-100">
      <ChatContainer />
    </div>
  );
}
