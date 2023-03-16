import {useEffect} from "react";
import axios from "axios";
import {toast} from "react-toastify";

export function useGetJWT(signature:string,id:string,setJWT:any,setUserId:any){
    useEffect(()=>{
        if (signature.length !== 0) {
            (async () => {
                try {
                    const resp = await axios.post(process.env.NEXT_PUBLIC_API_ENDPOINT + "user/wallet/signin",{
                        messageId:id,
                        signature:signature
                    })
                    setJWT(resp.data.jwt)
                    setUserId(resp.data.userId)
                } catch (e) {
                    console.log(e)
                    toast.error("エラーが発生しました")
                }
            })()
        }
    },[signature])
}