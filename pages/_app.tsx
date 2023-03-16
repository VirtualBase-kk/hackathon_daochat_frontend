import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify';
import {AuthContextProvider} from "@/src/context/authContext";
export default function App({ Component, pageProps }: AppProps) {
  return <><AuthContextProvider><Component {...pageProps} /><ToastContainer/></AuthContextProvider></>
}
