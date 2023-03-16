import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify';
import {AuthContextProvider} from "@/src/context/authContext";
import {LoadingContextProvider} from "@/src/context/loadingContext";
export default function App({ Component, pageProps }: AppProps) {
  return <><LoadingContextProvider><AuthContextProvider><Component {...pageProps} /><ToastContainer/></AuthContextProvider></LoadingContextProvider></>
}
