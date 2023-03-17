import axios from "axios";

export async function GetChat(auth:any,roomId:string) {
        const token = await auth.getToken()
        const resp = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT+"room/chat?id="+roomId,{
            headers:{
                Authorization:token.token
            }
        })
        return resp.data
}