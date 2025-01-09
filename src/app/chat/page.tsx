'use client';

import { useEffect } from "react";
import ChatContainer from "./ChatContainer";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "../store/store";
import { login, verifyToken } from "../store/slices/userSlice";


export default function Page() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const currentUser = typeof window !== 'undefined' ? localStorage.getItem('zchatuser') : null;
  const dispatch = useDispatch<AppDispatch>();
  const { username } = useSelector((state: RootState) => state.user);


  useEffect(() => {
    if (!token || !currentUser) {
      window.location.href = "/login";
    } else {
      dispatch(login(currentUser))
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
    <div className="flex justify-center h-screen items-center bg-gray-900 text-gray-100">
      <ChatContainer />
    </div>
  );
}
