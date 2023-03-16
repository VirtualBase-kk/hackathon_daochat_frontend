import axios from "axios";
export function useCreateOrg() {
    return {
        getBin:async function (auth:any,orgName:string) {
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
        },
        setContractAddress:async function (auth:any,id:string,contractAddress:string) {
            const token = await auth.getToken()
            const resp = await axios.post(process.env.NEXT_PUBLIC_API_ENDPOINT+"admin/setContract",{
                id: id,
                contractAddress:contractAddress
            },{
                headers:{
                    Authorization:token.token
                }
            })
            return resp
        },
    }
}