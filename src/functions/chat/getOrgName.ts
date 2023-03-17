import {useEffect} from "react";
import axios from "axios"
export function useGetOrg(auth:any,selected:string,setOrg:any) {
    useEffect(()=>{
        if (selected.length !== 0) {
            (async ()=>{
                const token = await auth.getToken()
                const resp = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT+"organization?id="+selected,{
                    headers:{
                        Authorization:token.token
                    }
                })
                setOrg(resp.data)
            })()
        }

    }, [selected])
}