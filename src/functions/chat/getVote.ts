import {useEffect} from "react";
import axios from "axios"
export function useGetVotes(auth:any,room?:{id:string,name:string,isDiscussion:boolean}[],setVote:any) {
    useEffect(()=>{
        if (room !== undefined) {
            (async ()=>{
                const token = await auth.getToken()
                const respVote:{
                    title:string,
                    text:string,
                    choice: [
                        {
                            id: string
                            title: string
                        }
                    ],
                    result:{
                        [id:string]:number
                    },
                    voted:boolean,
                    endTs: number
                }[] = []
                await Promise.any(room?.map(async (item,index)=>{
                    if (item.isDiscussion) {
                        const resp = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT+"room/vote/?id="+item.id,{
                            headers:{
                                Authorization:token.token
                            }
                        })
                        respVote.push(resp.data)
                    }
                }))
                setVote(respVote)
            })()
        }

    }, [room])
}

