import {useEffect} from "react";
import axios from "axios"
export function useGetPoint(auth:any,setPoint:any,selected:string) {
    useEffect(()=>{
        if (selected.length !== 0) {
            (async ()=>{
                const userData = await auth.userInfo()
                const token = await auth.getToken()
                const resp = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT+"user/point?id="+selected,{
                    headers:{
                        Authorization:token.token
                    }
                })
                setPoint(resp.data)
            })()
        }

    }, [selected])
}