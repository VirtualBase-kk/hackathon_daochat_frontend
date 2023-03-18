import {useEffect} from "react";
import axios from "axios"
export function useGetVotes(auth:any,setVote:any,room?:{id:string,name:string,isDiscussion:boolean}[]) {
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
                    roomId: string
                }[] = []
               room?.map(async (item,index)=>{
                    if (item.isDiscussion) {
                        const resp = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT+"room/vote/?id="+item.id,{
                            headers:{
                                Authorization:token.token
                            }
                        })
                        const votePutItem:{
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
                            roomId: string
                        } = resp.data
                        votePutItem.roomId = item.id
                        respVote[index] = votePutItem
                    }
                })
                setVote(respVote)
            })()
        }

    }, [room])
}

