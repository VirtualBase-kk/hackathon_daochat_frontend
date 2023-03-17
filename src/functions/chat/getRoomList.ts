import {useEffect} from "react";
import axios from "axios"
export function useGetRoom(auth:any,selected:string,setRoom:any) {
    useEffect(()=>{
        if (selected.length !== 0) {
            (async ()=>{
                const token = await auth.getToken()
                const resp = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT+"room/list?id="+selected,{
                    headers:{
                        Authorization:token.token
                    }
                })
                setRoom(resp.data)
            })()
        }

    }, [selected])
}