import axios from "axios";

export async function UploadContract(auth:any,id:string) {
    const token = await auth.getToken()
    const resp = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT+"room/vote/push?id="+id,{
        headers:{
            Authorization:token.token
        }
    })
    return resp.data.message
}