import axios from "axios";
export function useCreateOrg() {
    return async function (auth:any,orgName:string) {
        const token = await auth.getToken()
        const resp = await axios.post(process.env.NEXT_PUBLIC_API_ENDPOINT+"admin/create",{
            name: orgName
        },{
            headers:{
                Authorization:token.token
            }
        })
        return {
            id: resp.data.id,
            bin: resp.data.bin
        }
    }
}