import {useEffect} from "react";
import axios from "axios";
import {toast} from "react-toastify";

export function useGetSignMessage(walletAddress:string,setMessage:any,setId:any){
    useEffect(()=>{
        if (walletAddress.length !== 0) {
            (async () => {
                try {
                    const resp = await axios.post(process.env.NEXT_PUBLIC_API_ENDPOINT + "user/message",{
                        walletAddress:walletAddress
                    })
                    setMessage(resp.data.message)
                    setId(resp.data.id)
                } catch (e) {
                    console.log(e)
                    toast.error("エラーが発生しました")
                }
            })()
        }
    },[walletAddress])
}