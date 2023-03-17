import {useEffect} from "react";
import axios from "axios"
export function useGetTodo(auth:any,selected:string,setTood:any) {
    useEffect(()=>{
        if (selected.length !== 0) {
            (async ()=>{
                const token = await auth.getToken()
                const resp = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT+"todo/list?id="+selected,{
                    headers:{
                        Authorization:token.token
                    }
                })
                setTood(resp.data)
            })()
        }

    }, [selected])
}