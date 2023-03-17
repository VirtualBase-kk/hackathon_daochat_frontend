import {useEffect} from "react";
import axios from "axios"
export function useGetOrganisation(auth:any,setOrganisation:any) {
    useEffect(()=>{
        (async ()=>{
            const token = await auth.getToken()
           const resp = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT+"user/organization",{
               headers:{
                   Authorization:token.token
               }
           })
            setOrganisation(resp.data)
        })()
    }, [])
}