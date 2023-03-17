import axios from "axios";
export function useAddTodo() {
    return async function (auth:any,id:string,title:string,description:string,point:number) {
        const token = await auth.getToken()
        const resp = await axios.post(process.env.NEXT_PUBLIC_API_ENDPOINT+"todo/create",{
            name: title,
            organization: id,
            description:description,
            point:point
        },{
            headers:{
                Authorization:token.token
            }
        })
        return resp.data
    }
}