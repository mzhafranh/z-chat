'use client';

import { useDispatch } from "react-redux";
import { AppDispatch } from "./store/store";
import { useEffect } from "react";
import { verifyToken } from "./store/slices/userSlice";


export default function Home() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!token) {
        window.location.href = "/login";
    } else {
        dispatch(verifyToken({ token }))
            .then((action) => {
                // Access the payload returned by the thunk
                console.log("Verified:", action.payload);
                if (!action.payload) {
                    window.location.href = "/login";
                }
            })
            .catch((err) => {
                console.error("Error verifying token:", err);
                window.location.href = "/login";
            });
    }
}, [token, dispatch]);

  return (
    <div></div>
  );
}
