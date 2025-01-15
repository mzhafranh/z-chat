'use client';

import { useEffect } from "react";
import ChatContainer from "./ChatContainer";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "../store/store";
import { autoLogin, login, verifyToken } from "../store/slices/userSlice";
import { useRouter } from 'next/navigation'


export default function Page() {
  const router = useRouter()
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
  const currentUser = typeof window !== 'undefined' ? localStorage.getItem('zchatuser') : null;
  const dispatch = useDispatch<AppDispatch>();
  const { username } = useSelector((state: RootState) => state.user);


  useEffect(() => {
    if (!refreshToken || !currentUser) {
      router.push('/login')
    } else {
      dispatch(autoLogin({refreshToken}))
    }
  }, [refreshToken, dispatch]);

  return (
    <div className="flex justify-center h-screen items-center bg-gray-900 text-gray-100">
      <ChatContainer />
    </div>
  );
}
