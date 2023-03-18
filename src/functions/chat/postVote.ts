import axios from "axios";

export async function PostVote(auth:any,voteId:string,choiceId:string) {
    const token = await auth.getToken()
    const resp = await axios.post(process.env.NEXT_PUBLIC_API_ENDPOINT+"room/vote",{
        id: voteId,
        choiceId: choiceId
    },{
        headers:{
            Authorization:token.token
        }
    })
    return resp.data
}