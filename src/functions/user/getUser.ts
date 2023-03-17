import {useEffect} from "react";
import axios from "axios"
export function useGetUser(auth:any,setUser:any) {
    useEffect(()=>{
        (async ()=>{
            const userData = await auth.userInfo()
            const token = await auth.getToken()
            const resp = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT+"user/meta?id="+userData.info.username,{
                headers:{
                    Authorization:token.token
                }
            })
            setUser(resp.data)
        })()
    }, [])
}