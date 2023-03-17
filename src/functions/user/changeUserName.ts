import axios from "axios";
import {toast} from "react-toastify";
export function useChangeUserName() {
    return async function (auth:any,userName:string,setUser:any,user?:{walletAddress:string,name:string}) {
            const token = await auth.getToken()
        try {
            await axios.post(process.env.NEXT_PUBLIC_API_ENDPOINT+"user/name",{
                name: userName
            },{
                headers:{
                    Authorization:token.token
                }
            })
            toast("変更しました")
            const newUser = user || {walletAddress:"",name:""}
            newUser["name"] = userName
            setUser(newUser)
            return true
        } catch {
            toast.error("変更に失敗しました")
            return false
        }

        }

}