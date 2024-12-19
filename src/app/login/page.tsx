'use client';

import { useEffect } from "react";
import LoginBox from "./LoginBox"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { autoLogin } from "../store/slices/userSlice";
import { useRouter } from "next/navigation";

export default function Page() {

  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();


  useEffect(() => {
    dispatch(autoLogin({refreshToken}))
    .then((action) => {
      if (action.payload){
        router.push('/chat');
      }
    }).catch((err) => {
      console.error("Error verifying token:", err);
      window.location.href = "/login";
  });
    
  }, []);

  return (
    <div className="flex justify-center h-screen items-center">
      <LoginBox />
    </div>
  );
}
