import axios from "axios";
export function useCreateRoom() {
    return async function (auth:any,id:string,title:string) {
        const token = await auth.getToken()
        const resp = await axios.post(process.env.NEXT_PUBLIC_API_ENDPOINT+"room/create",{
            name: title,
            organization:id,
            discussionFlag: false
        },{
            headers:{
                Authorization:token.token
            }
        })
        return resp.data
    }
}