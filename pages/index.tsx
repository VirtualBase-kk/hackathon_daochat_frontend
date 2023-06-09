import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from "@/styles/index.module.sass"
import { toSvg } from "jdenticon";
import {AiOutlineSetting,AiOutlineBell,AiOutlineClose} from "react-icons/ai"
const inter = Inter({ subsets: ['latin'] })
import Web3 from "web3"
import {BsFileEarmark,BsChat,BsSend} from "react-icons/bs"
import {RiArrowDownSLine} from "react-icons/ri"
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/src/context/authContext";
import {useRouter} from "next/router";
import {useGetOrganisation} from "@/src/functions/user/getOrganisation";
import {LoadingContext} from "@/src/context/loadingContext";
import {useCreateOrg} from "@/src/functions/admin/createOrganisation";
import {toast} from "react-toastify";
import {GetUserById, useGetUser} from "@/src/functions/user/getUser";
import {useGetPoint} from "@/src/functions/user/getPoint";
import {useChangeUserName} from "@/src/functions/user/changeUserName";
import 'react-toastify/dist/ReactToastify.css';
import {useGetOrg} from "@/src/functions/chat/getOrgName";
import {useAddMember} from "@/src/functions/admin/addMember";
import {useGetTodo} from "@/src/functions/chat/getTodo";
import {useAddTodo} from "@/src/functions/chat/addTodo";
import {useGetRoom} from "@/src/functions/chat/getRoomList";
import {useCreateRoom} from "@/src/functions/chat/createRoom";
import { v4 as uuidv4 } from 'uuid';
import {useCreateDiscussion} from "@/src/functions/chat/addDiscussion";
import {useGetVotes} from "@/src/functions/chat/getVote";
import {useChangeTodo} from "@/src/functions/chat/changeTodo";
import {GetChat} from "@/src/functions/chat/getChat";
import {PostChat} from "@/src/functions/chat/postChat";
import {PostVote} from "@/src/functions/chat/postVote";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;
import {UploadContract} from "@/src/functions/chat/uploadContract.t";
export default function Home() {
    const auth = useContext(AuthContext)
    const loading = useContext(LoadingContext)
    const router = useRouter()

    const [UserOrganisation,setUserOrganisation] = useState<string[]>()

    const [selectedOrg,setSelectedOrg] = useState<string>("")

    useGetOrganisation(auth,setUserOrganisation)

    const [user,setUser] = useState<{walletAddress:string,name:string}>()

    useGetUser(auth,setUser)

    const [point,setPoint] = useState<number>(0)

    useGetPoint(auth,setPoint,selectedOrg)

    const [createOrgName,setCreateOrgName] = useState<string>("")

    const [showCreateOrgModal,setShowCreateOrgModal] = useState<boolean>(false)

    const createOrgFunc = useCreateOrg()

    const [showUserModal,setShowUserModal] = useState<boolean>(false)

    const [showChangeUserName,setShowChangeUserName] = useState<boolean>(false)

    const [showOrgSetting,setShowOrgSetting] = useState<boolean>(false)

    const [userNameTmp,setUserNameTmp] = useState<string>("")

    const changeUserNameFunc = useChangeUserName()

    const [org,setOrg] = useState<{contractAddress:string,name:string}>()

    const [addMemberWalletAddress,setAddMemberWalletAddress] = useState<string>("")

    const addMemberFunc = useAddMember()

    useGetOrg(auth,selectedOrg,setOrg)

    const [todo,setTodo] = useState<{id: string, title: string, status: number,description:string,point:number,userId:string}[]>()

    const [showAddTodo,setShowAddTodo] = useState<boolean>(false)

    const [todoTitle,setTodoTitle] = useState<string>("")
    const [todoDescription,setTodoDescription] = useState<string>("")
    const [todoPoint,setTodoPoint] = useState<number>(0)

    const addTodoFunc = useAddTodo()

    useGetTodo(auth,selectedOrg,setTodo)

    const [showAddRoom,setShowAddRoom] = useState<boolean>(false)

    const [selectedRoom,setSelectedRoom] = useState<string>("")

    const [room,setRoom] = useState<{id:string,name:string,isDiscussion:boolean}[]>()

    const [roomTitle,setRoomTitle] = useState<string>("")

    const [showDiscussionForm,setShowDiscussionForm] = useState<boolean>(false)

    const [choice,setChoice] = useState<string[]>(["",""])

    const addRoomFunc = useCreateRoom()

    const [end,setEnd] = useState<string>("")

    const [description,setDescription] = useState<string>("")

    const createDiscussionFunc = useCreateDiscussion()

    useGetRoom(auth,selectedOrg,setRoom)

    useEffect(()=>{
        if (!auth.isLogin) {
            router.push("/auth")
        } else {
            loading.setLoading(true)
        }
    },[auth.isLogin])

    useEffect(()=>{
        if (UserOrganisation !== undefined) {
            loading.setLoading(false)
        }
    },[UserOrganisation])

    useEffect(()=>{
        if (UserOrganisation !== undefined) {
            loading.setLoading(false)
            setSelectedOrg(UserOrganisation.length !== 0?UserOrganisation[0]:"")
        }
    },[UserOrganisation])

    useEffect(()=>{
        if (user !== undefined) {
            setUserNameTmp(user?.name?user.name:user?.walletAddress)
        }
    },[user])

    useEffect(()=>{
        room!==undefined && room.length !== 0 && setSelectedRoom(room[0].id)
    },[room])


    const createOrg = async () => {
        if (createOrgName.length !== 0) {
            loading.setLoading(true)
            try {
                const resp = await createOrgFunc.getBin(auth,createOrgName)
                // @ts-ignore
                const accounts = await globalThis.window?.ethereum.request({ method: 'eth_requestAccounts' });
                //@ts-ignore
                const web3 = new Web3(globalThis.window?.ethereum)
                const r = await web3.eth.sendTransaction({
                    from: accounts[0],
                    data: resp.bin
                })
                r.contractAddress
                await createOrgFunc.setContractAddress(auth,resp.id,String(r.contractAddress))
            } catch {
                toast.error("失敗しました")
            }
            loading.setLoading(false)
            globalThis.window.location.reload()
        }
    }

    const addMember = async () => {
        if (addMemberWalletAddress.length !== 0) {
            loading.setLoading(true)
            try {
                const message = await addMemberFunc(auth,selectedOrg,addMemberWalletAddress)
                // @ts-ignore
                const accounts = await globalThis.window?.ethereum.request({ method: 'eth_requestAccounts' });
                //@ts-ignore
                const web3 = new Web3(globalThis.window?.ethereum)
                const r = await web3.eth.sendTransaction({
                    from: accounts[0],
                    data: message,
                    to: org?.contractAddress
                })
                toast("追加しました")
                setShowOrgSetting(false)
                console.log(message)
            } catch {
                toast.error("失敗しました")
            }
            loading.setLoading(false)
        }
    }

    const addTodo = async () => {
        if (todoTitle.length !== 0&& todoDescription.length !==0) {
            loading.setLoading(true)
            try {
                const resp = await addTodoFunc(auth,selectedOrg,todoTitle,todoDescription,todoPoint)
                toast("追加しました")
                const todoList = todo
                todoList?.push({
                    id: resp.id,
                    title:todoTitle,
                    status: 0,
                    description:todoDescription,
                    point: todoPoint,
                    userId: ""
                })
                setTodo(todoList)
                setShowAddTodo(false)
            } catch {
                toast.error("失敗しました")
            }
            loading.setLoading(false)
        }
    }

    const addRoom = async() => {
        if (roomTitle.length !== 0) {
            loading.setLoading(true)
            try {
                const resp = await addRoomFunc(auth,selectedOrg,roomTitle)
                toast("作成しました")
                setShowAddRoom(false)
                const currentRooms = room
                currentRooms?.push({
                    id: resp.id,
                    name: roomTitle,
                    isDiscussion: false
                })
                setRoom(currentRooms)
            } catch {
                toast.error("失敗しました")
            }
            loading.setLoading(false)
        }
    }

    const addChoice = () => {
        const currentChoice = choice.concat()
        currentChoice.push("")
        setChoice(currentChoice)
    }

    const deleteChoice = () => {
        const currentChoice = choice.concat()
        currentChoice.splice(-1,1)
        setChoice(currentChoice)
    }

    const editChoice = (index:number,text:string) => {
        const currentChoice = choice.concat()
        currentChoice[index] = text
        setChoice(currentChoice)
    }

    const addDiscussion = async () => {
        if (roomTitle.length !== 0 && end.length !== 0 && choice.length !== 0) {
            loading.setLoading(true)
            try {
                const endTs = (new Date(end)).getTime()
                const choiceReq:{id:string,title:string}[] = []
                choice.forEach(item=>{
                    choiceReq.push({
                        id: uuidv4(),
                        title: item
                    })
                })
                const resp = await createDiscussionFunc(auth,selectedOrg,roomTitle,description,choiceReq,endTs)
                const currentRooms = room
                currentRooms?.push({
                    id: resp.id,
                    name: roomTitle,
                    isDiscussion: true
                })
                // @ts-ignore
                const accounts = await globalThis.window?.ethereum.request({ method: 'eth_requestAccounts' });
                //@ts-ignore
                const web3 = new Web3(globalThis.window?.ethereum)
                console.log({
                    from: accounts[0],
                    data: resp.message,
                    to: org?.contractAddress
                })
                const r = await web3.eth.sendTransaction({
                    from: accounts[0],
                    data: resp.message,
                    to: org?.contractAddress
                })
                toast("追加しました")
                setShowDiscussionForm(false)
                setRoom(currentRooms)
            } catch {
                toast.error("失敗しました")
            }
            loading.setLoading(false)
        }
    }

    const [vote,setVote] = useState<{
        id: string,
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
        endTs: number,
        roomId: string,
        votedId: string
    }[]>([])

    useGetVotes(auth,setVote,room)

    const [selectedRoomIndex,setSelectedRoomIndex] = useState<number>(0)

    useEffect(()=>{
        console.log(vote)
    },[vote])

    const [selectedTodoIndex,setSelectedTodoIndex] = useState<number>(0)
    const [isTodo,setIsTodo] = useState<boolean>(false)

    const [todoUser,setTodoUser] = useState<{name:string,walletAddress:string}>({name:"-",walletAddress:""})

    const changeTodoFunc = useChangeTodo()

    useEffect(()=>{
        if(isTodo && todo !== undefined && todo[selectedTodoIndex].userId !== undefined) {
            (async()=>{
                const resp = await GetUserById(auth,todo[selectedTodoIndex].userId)
                setTodoUser({
                    name:resp.name,
                    walletAddress:resp.walletAddress
                })
            })()
        } else {
            setTodoUser(
                {
                    name: "-",
                    walletAddress: ""
                }
            )
        }
    },[selectedTodoIndex])

    const [chat,setChat] = useState<{
        text:string,
        createdTs: number,
        userId: string,
        userName: string,
        walletAddress: string,
    }[]>()

    const [inputChatText,setInputChatText] = useState<string>("")

    const sendChat = async () => {
        if (inputChatText.length !== 0) {
            loading.setLoading(true)
            try {
                await PostChat(auth,selectedRoom,inputChatText);
                setInputChatText("")
                await (async()=>{
                    const resp:{
                        text:string,
                        createdTs: number,
                        userId: string,
                        userName: string,
                        walletAddress: string,
                    }[] = await GetChat(auth,selectedRoom)
                    resp.sort((a,b)=>a.createdTs-b.createdTs)
                    setChat(resp)
                })()
            } catch {
                toast.error("失敗しました")
            }
            loading.setLoading(false)
        }
    }

    const [iId,setIId] = useState<any>()

    const [showVoteModal,setShowVoteModal] = useState<boolean>(false)

    useEffect(()=>{
        clearInterval(iId);
        if (!isTodo && selectedRoom.length !== 0) {
            (async()=>{
                const resp:{
                    text:string,
                    createdTs: number,
                    userId: string,
                    userName: string,
                    walletAddress: string,
                }[] = await GetChat(auth,selectedRoom)
                resp.sort((a,b)=>a.createdTs-b.createdTs)
                setChat(resp)
            })()
            const intervalId = setInterval(async() => {
                if (isTodo) {
                    clearInterval(intervalId)
                }
                const resp:{
                    text:string,
                    createdTs: number,
                    userId: string,
                    userName: string,
                    walletAddress: string,
                }[] = await GetChat(auth,selectedRoom)
                resp.sort((a,b)=>a.createdTs-b.createdTs)
                setChat(resp)
            }, 5000);
            setIId(intervalId)
        }
        return clearInterval(iId);
    },[isTodo,selectedRoom,selectedTodoIndex])

    const doVote = async (voteId:string,choiceId:string,voteIndex:number) => {
        if (!vote[voteIndex].voted) {
            loading.setLoading(true)
            try {
                const confrim = globalThis.window.confirm("投票しますか？")
                if (confrim) {
                    await PostVote(auth,voteId,choiceId)
                    toast("投票しました")
                    setShowVoteModal(false)
                }
            } catch {
                toast.error("失敗しました")
            }
            loading.setLoading(false)
        } else {
            toast.error("投票済みです")
        }

    }

    const uploadContract = async (voteId:string) => {
        loading.setLoading(true)
        try {

            const message = await UploadContract(auth,voteId)
            // @ts-ignore
            const accounts = await globalThis.window?.ethereum.request({ method: 'eth_requestAccounts' });
            //@ts-ignore
            const web3 = new Web3(globalThis.window?.ethereum)
            const r = await web3.eth.sendTransaction({
                from: accounts[0],
                data: message,
                to: org?.contractAddress
            })
            toast("コントラクトにアップロードしました")
        } catch {
            toast.error("失敗しました")
        }
        loading.setLoading(false)
    }

    return (
    <>
      <Head>
        <title>DAOCHAT</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className={styles.root}>
            <div className={styles.tab}>
                {
                    UserOrganisation?.map((item)=>{
                        return <div className={styles.iconWrapper} key={item} onClick={()=>{setSelectedOrg(item)}}>
                            <div className={selectedOrg === item ? styles.selected:""}></div>
                            <div className={styles.icon} dangerouslySetInnerHTML={{ __html: toSvg(item, 40) }} />
                        </div>
                    })
                }
                <div className={styles.iconWrapper} onClick={()=>{setShowCreateOrgModal(true)}}>
                    <div className={styles.space}/>
                    <div className={styles.iconPlus}>＋</div>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.chatHeader}>
                    <div className={styles.chatHeaderLeft}>
                        <h1>{org?.name}</h1>
                    </div>
                    <div className={styles.chatHeaderRight}>
                        <div className={styles.chatHeaderRightLeft}>
                            <div className={styles.iconWrapper} onClick={()=>{setShowOrgSetting(true)}}>
                                <AiOutlineSetting />
                            </div>
                        </div>
                        <div className={styles.chatHeaderRightRight} onClick={()=>{setShowUserModal(!showUserModal)}}>
                            <div className={styles.iconWrapper}><div className={styles.icon} dangerouslySetInnerHTML={{ __html: toSvg(user?.walletAddress, 50) }} /></div>
                            <div className={styles.metadata}>
                                <p>{user?.name?user.name:user?.walletAddress.slice(0,10)+"..."}</p>
                                <span>スコア：<span className={styles.score}>{point}pt</span></span>
                            </div>
                        </div>
                        {
                            showOrgSetting&&(<>
                                <div className={styles.changeUserNameBg}>
                                    <div className={styles.changeUserNameWrapper}>
                                        <div className={styles.closeButtonWrapper}　onClick={()=>{setShowOrgSetting(false)}}>
                                            <div className={styles.closeButton}>
                                                <AiOutlineClose onClick={()=>{setShowOrgSetting(false)}}></AiOutlineClose>
                                            </div>
                                        </div>
                                        <div className={styles.changeUserNameModal}>
                                            <div className={styles.changeUserNameHeader}>
                                                <span>組織設定</span>

                                            </div>
                                            <div className={styles.body}>
                                                <p className={styles.label}>ユーザーを招待</p>
                                                <input placeholder={"ウォレットアドレスを入力してください"}  onChange={(e)=>{setAddMemberWalletAddress(e.target.value)}}/>
                                                <div className={styles.buttonWrapper}>
                                                    <button className={styles.cancelButton} onClick={()=>{setShowOrgSetting(false)}}>キャンセル</button>
                                                    <button className={styles.nextButton} onClick={()=>{addMember()}}>招待</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div></div>
                            </>)
                        }
                        {
                            showUserModal&&(<><div className={styles.userModal}>
                                <ul>
                                    <li className={styles.borderB} onClick={()=>{setShowChangeUserName(true)}}>名前を変更</li>
                                    <li onClick={()=>{auth.signOut()}}>サインアウト</li>
                                </ul></div></>)
                        }
                        {
                            showChangeUserName&&(
                                <>
                                    <div className={styles.changeUserNameBg}>
                                        <div className={styles.changeUserNameWrapper}>
                                            <div className={styles.closeButtonWrapper}　onClick={()=>{setShowChangeUserName(false)}}>
                                                <div className={styles.closeButton}>
                                                    <AiOutlineClose onClick={()=>{setShowChangeUserName(false)}}></AiOutlineClose>
                                                </div>
                                            </div>
                                            <div className={styles.changeUserNameModal}>
                                                <div className={styles.changeUserNameHeader}>
                                                    <span>ユーザー名を変更</span>

                                                </div>
                                                <div className={styles.body}>
                                                    <p className={styles.label}>ユーザー名</p>
                                                    <input placeholder={"ユーザー名を入力してください"} value={userNameTmp}  onChange={(e)=>{setUserNameTmp(e.target.value)}}/>
                                                    <div className={styles.buttonWrapper}>
                                                        <button className={styles.cancelButton} onClick={()=>{setShowChangeUserName(false)}}>キャンセル</button>
                                                        <button className={styles.nextButton} onClick={()=>{userNameTmp.length !== 0?(async ()=>{const resp = await changeUserNameFunc(auth,userNameTmp,setUser,user);resp&&setShowChangeUserName(false)})():toast.error("入力してください")}}>変更</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div></div>
                                </>
                            )
                        }
                    </div>
                </div>
                {
                    selectedOrg.length !== 0 && (<div className={styles.chatBody}>
                        <div className={styles.chatBodyLeft}>
                            <div className={styles.chatBodyLeftItem}>
                                <span className={styles.itemTitle} onClick={()=>{setShowAddTodo(true)}}><RiArrowDownSLine></RiArrowDownSLine><span>タスク</span><span>+</span></span>
                                <ul>
                                    {
                                        todo?.map((item,index)=>{
                                            return <li key={item.id} className={index === selectedTodoIndex?styles.isSelected:""} onClick={()=>{setSelectedTodoIndex(index);setIsTodo(true)}}><BsFileEarmark></BsFileEarmark><span>{item.title}</span></li>
                                        })

                                    }
                                    {
                                        showAddTodo&&<><div className={styles.changeUserNameBg}>
                                            <div className={styles.changeUserNameWrapper}>
                                                <div className={styles.closeButtonWrapper}　onClick={()=>{setShowAddTodo(false)}}>
                                                    <div className={styles.closeButton}>
                                                        <AiOutlineClose onClick={()=>{setShowAddTodo(false)}}></AiOutlineClose>
                                                    </div>
                                                </div>
                                                <div className={styles.changeUserNameModal}>
                                                    <div className={styles.changeUserNameHeader}>
                                                        <span>タスク追加</span>

                                                    </div>
                                                    <div className={styles.body}>
                                                        <p className={styles.label}>タスク</p>
                                                        <input placeholder={"タスクタイトルを入力してください"}  onChange={(e)=>{setTodoTitle(e.target.value)}}/>
                                                        <p className={styles.label}>詳細</p>
                                                        <textarea onChange={(e)=>{setTodoDescription(e.target.value)}}></textarea>
                                                        <p className={styles.label}>ポイント</p>
                                                        <input placeholder={"ポイント数を入力してください"}  onChange={(e)=>{setTodoPoint(Number(e.target.value))}}/>
                                                        <div className={styles.buttonWrapper}>
                                                            <button className={styles.cancelButton} onClick={()=>{setShowAddTodo(false)}}>キャンセル</button>
                                                            <button className={styles.nextButton} onClick={()=>{addTodo()}}>追加</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div></div></>
                                    }
                                </ul>
                            </div>
                            <div className={styles.chatBodyLeftItem}>
                                <span className={styles.itemTitle} onClick={()=>{setShowAddRoom(true)}}><RiArrowDownSLine></RiArrowDownSLine><span>チャットチャンネル</span><span>+</span></span>
                                <ul>
                                    {
                                        room?.map((item,index)=> !item.isDiscussion&& <li className={item.id===selectedRoom && !isTodo ? styles.isSelected:""} key={item.id} onClick={()=>{setSelectedRoom(item.id);setSelectedRoomIndex(index);setIsTodo(false)}}>＃<span>{item.name}</span></li>)
                                    }
                                    {
                                        showAddRoom&&<><div className={styles.changeUserNameBg}>
                                            <div className={styles.changeUserNameWrapper}>
                                                <div className={styles.closeButtonWrapper}　onClick={()=>{setShowAddRoom(false)}}>
                                                    <div className={styles.closeButton}>
                                                        <AiOutlineClose onClick={()=>{setShowAddRoom(false)}}></AiOutlineClose>
                                                    </div>
                                                </div>
                                                <div className={styles.changeUserNameModal} style={{height:"260px"}}>
                                                    <div className={styles.changeUserNameHeader}>
                                                        <span>ルームを追加</span>
                                                    </div>
                                                    <div className={styles.body}>
                                                        <p className={styles.label}>タイトル</p>
                                                        <input placeholder={"タイトルを入力してください"}  onChange={(e)=>{setRoomTitle(e.target.value)}}/>
                                                        <div className={styles.buttonWrapper}>
                                                            <button className={styles.cancelButton} onClick={()=>{setShowAddRoom(false)}}>キャンセル</button>
                                                            <button className={styles.nextButton} onClick={()=>{addRoom()}}>追加</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div></div></>
                                    }
                                </ul>
                            </div>
                            <div className={styles.chatBodyLeftItemDiscussion}>
                                <span className={styles.itemTitle} onClick={()=>{setShowDiscussionForm(true)}}><RiArrowDownSLine></RiArrowDownSLine><span>進行中のディスカッション</span><span>+</span></span>
                                <ul>
                                    {
                                        vote.map((item,index)=>Date.now() < item.endTs&&<li className={item.roomId===selectedRoom && !isTodo ? styles.isSelected:""} key={item.roomId} onClick={()=>{setSelectedRoom(item.roomId);setSelectedRoomIndex(Number(room?.findIndex((i) => i.id === item.roomId)));setIsTodo(false)}}><span className={styles.text}>{item.title}</span><span className={!item.voted?styles.tagActive:styles.tagPending}>{!item.voted?"未投票":"投票済"}</span></li>)
                                    }
                                </ul>
                                {
                                    showDiscussionForm&&<><div className={styles.changeUserNameBg}>
                                        <div className={styles.changeUserNameWrapper}>
                                            <div className={styles.closeButtonWrapper}　onClick={()=>{setShowDiscussionForm(false)}}>
                                                <div className={styles.closeButton}>
                                                    <AiOutlineClose onClick={()=>{setShowDiscussionForm(false)}}></AiOutlineClose>
                                                </div>
                                            </div>
                                            <div className={styles.changeUserNameModal} style={{height:"520px",overflow:"scroll"}}>
                                                <div className={styles.changeUserNameHeader}>
                                                    <span>ディスカッションを追加</span>
                                                </div>
                                                <div className={styles.body}>
                                                    <p className={styles.label}>タイトル</p>
                                                    <input placeholder={"タイトルを入力してください"}  onChange={(e)=>{setRoomTitle(e.target.value)}}/>
                                                    <p className={styles.label}>期限</p>
                                                    <input type={"datetime-local"} onChange={(e)=>{setEnd(e.target.value)}}/>
                                                    <p>説明</p>
                                                    <textarea onChange={(e)=>{setDescription(e.target.value)}}></textarea>
                                                    {
                                                        choice.map((item,index)=>{
                                                            return <><p className={styles.label}>選択肢</p>
                                                            <input placeholder={"選択肢を入力してください"} value={item} onChange={(e)=>{editChoice(index,e.target.value)}}/> </>
                                                        })
                                                    }

                                                    <div className={styles.buttonWrapper}>
                                                        <button className={styles.cancelButton} onClick={()=>{deleteChoice()}}>選択肢を削除</button>
                                                        <button className={styles.cancelButton} onClick={()=>{addChoice()}}>選択肢を追加</button>
                                                    </div>
                                                    <div className={styles.buttonWrapper}>
                                                        <button className={styles.cancelButton} onClick={()=>{setShowDiscussionForm(false)}}>キャンセル</button>
                                                        <button className={styles.nextButton} onClick={()=>{addDiscussion()}}>追加</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div></div></>
                                }
                            </div>
                            <div className={styles.chatBodyLeftItemDiscussion}>
                                <span className={styles.itemTitle}><RiArrowDownSLine></RiArrowDownSLine><span>終了済みのディスカッション</span></span>
                                <ul>
                                    {
                                        vote.map((item,index)=>Date.now() > item.endTs&&<li className={item.roomId===selectedRoom && !isTodo ? styles.isSelected:""} key={item.roomId} onClick={()=>{setSelectedRoom(item.roomId);setSelectedRoomIndex(Number(room?.findIndex((i) => i.id === item.roomId)));setIsTodo(false)}}><span className={styles.text}>{item.title}</span><span>{!item.voted?"未投票":"投票済"}</span></li>)
                                    }
                                </ul>
                            </div>
                        </div>
                        {!isTodo?(
                            <div className={styles.chatBodyRight}>
                                <div className={styles.chatBodyRightHeader}>
                                    <BsChat></BsChat>
                                    <span>{room!==undefined&&room[selectedRoomIndex]?.name}</span>
                                </div>
                                <div className={styles.chatBodyRightChatSpace}>
                                    <div className={styles.chatBody}>
                                        {
                                            chat?.map((item,index)=>{
                                                return <div className={styles.chatItem} key={index}>
                                                    <div className={styles.chatItemHeader}>
                                                        <div className={styles.iconWrapper}><div className={styles.icon} dangerouslySetInnerHTML={{ __html: toSvg(item.walletAddress, 50) }} /></div>
                                                        <p>{item.userName}</p>
                                                        <span>{(new Date(item.createdTs)).toLocaleDateString()+' ' + (new Date(item.createdTs)).toLocaleTimeString()}</span>
                                                    </div>
                                                    <div className={styles.chatItemBody}>
                                                        <p>{item.text}</p>
                                                    </div>
                                                </div>
                                            })
                                        }

                                    </div>
                                    <div className={styles.chatInput}>
                                        <input className={styles.chatInputInput} value={inputChatText} placeholder={"ここにテキストを入力"} onChange={(e)=>{setInputChatText(e.target.value)}}/>
                                        <button onClick={()=>{sendChat()}}><BsSend></BsSend></button>
                                    </div>
                                    {
                                        room!==undefined&&room[selectedRoomIndex]?.isDiscussion&&<div className={styles.vote}>
                                            <div className={styles.voteHeader}>
                                                <h1>進行中の投票</h1>
                                                <span onClick={()=>{setShowVoteModal(true)}}>詳細を表示</span>
                                            </div>
                                            <div className={styles.voteItem}>
                                                {
                                                    vote[selectedRoomIndex]?.choice.map((item,index)=>{
                                                        return <div className={styles.voteChoice} key={item.id}><span>{index+1}.{item.title}</span></div>
                                                    })
                                                }
                                            </div>
                                        </div>
                                    }
                                </div>
                                {
                                    showVoteModal&&(<><div className={styles.changeUserNameBg} >
                                        <div className={styles.changeUserNameWrapper}>
                                            <div className={styles.closeButtonWrapper}　onClick={()=>{setShowVoteModal(false)}}>
                                                <div className={styles.closeButton}>
                                                    <AiOutlineClose onClick={()=>{setShowVoteModal(false)}}></AiOutlineClose>
                                                </div>
                                            </div>
                                            <div className={styles.changeUserNameModal} style={{height:"300px",overflow:"scroll"}}>
                                                <div className={styles.changeUserNameHeader}>
                                                    <span>{room!==undefined&&room[selectedRoomIndex]?.name}</span>
                                                    <span>{(new Date(vote[selectedRoomIndex]?.endTs)).toLocaleDateString() + " " + new Date(vote[selectedRoomIndex]?.endTs).toLocaleTimeString()}</span>
                                                </div>
                                                <div className={styles.body}>
                                                    <p>{vote[selectedRoomIndex]?.text}</p>
                                                    {
                                                        vote[selectedRoomIndex]?.choice.map((item,index)=>{
                                                            return <div className={vote[selectedRoomIndex].votedId === item.id ? styles.voteChoice+ " " +styles.VoteSelected:styles.voteChoice} key={item.id} onClick={()=>{doVote(vote[selectedRoomIndex].id,item.id,selectedRoomIndex)}}><span>{index+1}.{item.title}{vote[selectedRoomIndex]?.endTs < Date.now()&&"："+vote[selectedRoomIndex].result[item.id]}</span></div>
                                                        })
                                                    }
                                                    {
                                                        vote[selectedRoomIndex]?.endTs < Date.now()  &&  <div className={styles.buttonWrapper}>
                                                            <button className={styles.cancelButton} style={{width:"250px"}} onClick={()=>{uploadContract(vote[selectedRoomIndex].id)}}>結果をコントラクトへアップロード</button>
                                                        </div>
                                                    }


                                                </div>
                                            </div>
                                        </div></div></>)
                                }
                            </div>
                        ):(
                            <div className={styles.chatBodyRight}>
                                <div className={styles.chatBodyRightHeader}>
                                    <BsFileEarmark></BsFileEarmark>
                                    <span>{todo!==undefined&&todo[selectedTodoIndex].title}</span>
                                </div>
                                <div className={styles.chatBodyRightChatSpace}>
                                    <div className={styles.todoBody}>
                                        <div>
                                            <span>タイトル</span>
                                            <p>{todo!==undefined&&todo[selectedTodoIndex].title}</p>
                                            <span>説明</span>
                                            <p className={styles.description}>{todo!==undefined&&todo[selectedTodoIndex].description}</p>
                                            <div className={styles.flex}>
                                                <div>
                                                    <span>付与スコア</span>
                                                    <p className={styles.point}>{todo!==undefined&&todo[selectedTodoIndex].point}pt</p>
                                                </div>
                                                <div>
                                                    <span>作業者</span>
                                                    <p>{todoUser.name}</p>
                                                </div>

                                            </div>
                                        </div>
                                        {todo!==undefined&&!todo[selectedTodoIndex].status&&<button className={styles.doneButton} onClick={()=>{changeTodoFunc(auth,todo[selectedTodoIndex].id)}}>完了報告</button>}
                                    </div>
                                </div>
                            </div>
                        )}


                    </div>)
                }

            </div>
            {
                showCreateOrgModal&&<div className={styles.createOrgModalBg}>
                    <div className={styles.createOrgModalWrapper}>
                    <div className={styles.closeButtonWrapper}　onClick={()=>{setShowCreateOrgModal(false)}}>
                        <div className={styles.closeButton}>
                        <AiOutlineClose onClick={()=>{setShowCreateOrgModal(false)}}></AiOutlineClose>
                        </div>
                    </div>
                    <div className={styles.createOrgModal}>
                    <div className={styles.createOrgModalHeader}>
                        <span>組織を作成</span>

                    </div>
                    <div className={styles.body}>
                        <p className={styles.label}>名前</p>
                        <input placeholder={"組織の名前を入力してください"} onChange={(e)=>{setCreateOrgName(e.target.value)}}/>
                        <div className={styles.buttonWrapper}>
                            <button className={styles.cancelButton} onClick={()=>{setShowCreateOrgModal(false)}}>キャンセル</button>
                            <button className={styles.nextButton} onClick={()=>{createOrg()}}>作成</button>
                        </div>
                    </div>
                </div>
                    </div></div>
            }

        </div>
    </>
  )
}
