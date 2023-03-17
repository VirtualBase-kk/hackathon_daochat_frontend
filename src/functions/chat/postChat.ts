import axios from "axios";

export async function PostChat(auth:any,roomId:string,text:string){
    const token = await auth.getToken()
    const resp = await axios.post(process.env.NEXT_PUBLIC_API_ENDPOINT+"room/chat",{
        id: roomId,
        text:text
    },{
        headers:{
            Authorization:token.token
        }
    })
    return resp.data
}