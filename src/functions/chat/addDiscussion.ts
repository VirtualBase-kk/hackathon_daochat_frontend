import axios from "axios";
export function useCreateDiscussion() {
    return async function (auth:any,id:string,title:string,description:string,choice:{id:string,title:string}[],end:number) {
        const token = await auth.getToken()
        const resp = await axios.post(process.env.NEXT_PUBLIC_API_ENDPOINT+"room/create",{
            name: title,
            organization:id,
            discussionFlag: true
        },{
            headers:{
                Authorization:token.token
            }
        })
        const dResp = await axios.post(process.env.NEXT_PUBLIC_API_ENDPOINT+"room/vote/create",{
            id: resp.data.id,
            title:title,
            text:description,
            choice: choice,
            end:end
        },{
            headers:{
                Authorization:token.token
            }
        })
        return {
            id:resp.data.id,
            message:dResp.data.message
        }
    }
}