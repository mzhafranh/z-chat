'use client';

import { useDispatch } from "react-redux";
import { AppDispatch } from "./store/store";
import { useEffect } from "react";
import { verifyToken } from "./store/slices/userSlice";
import { useRouter } from 'next/navigation'


export default function Home() {
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!token) {
        router.push("/login")
    } else {
        dispatch(verifyToken({ token }))
            .then((action) => {
                if (!action.payload) {
                  router.push("/login")
                } else {
                  router.push("/chat")
                }
            })
            .catch((err) => {
                console.error("Error verifying token:", err);
                router.push("/login")
              });
      
    }
}, [token, dispatch]);

  return (
    <div></div>
  );
}
