import axios from "axios";
export function useChangeTodo() {
    return async function (auth:any,id:string) {
        const token = await auth.getToken()
        const resp = await axios.post(process.env.NEXT_PUBLIC_API_ENDPOINT+"todo/change",{
            id: id,
            state:true
        },{
            headers:{
                Authorization:token.token
            }
        })
        return resp.data
    }
}