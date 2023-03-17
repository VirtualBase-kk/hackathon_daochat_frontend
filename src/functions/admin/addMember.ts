import axios from "axios";
export function useAddMember() {
    return async function (auth:any,id:string,walletAddress:string) {
            const token = await auth.getToken()
            const resp = await axios.post(process.env.NEXT_PUBLIC_API_ENDPOINT+"admin/user",{
                id: id,
                walletAddress: walletAddress
            },{
                headers:{
                    Authorization:token.token
                }
            })
            const addRoleResp = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT+"contract/role?id="+id+"&walletAddress="+walletAddress,{
                headers:{
                    Authorization:token.token
                }
            })
            return addRoleResp.data.message
        }
}