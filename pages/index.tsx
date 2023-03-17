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
import {useGetUser} from "@/src/functions/user/getUser";
import {useGetPoint} from "@/src/functions/user/getPoint";
import {useChangeUserName} from "@/src/functions/user/changeUserName";
import 'react-toastify/dist/ReactToastify.css';
import {useGetOrg} from "@/src/functions/chat/getOrgName";
import {useAddMember} from "@/src/functions/admin/addMember";

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

        }
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
                                <span className={styles.itemTitle}><RiArrowDownSLine></RiArrowDownSLine><span>タスク</span></span>
                                <ul>
                                    <li className={styles.isSelected}><BsFileEarmark></BsFileEarmark><span>トイレの掃除</span></li>
                                    <li><BsFileEarmark></BsFileEarmark><span>コーヒーメーカーの設置をああああああ</span></li>
                                    <li><BsFileEarmark></BsFileEarmark><span>今度の飲み会の幹事をあああああああああ</span></li>
                                </ul>
                            </div>
                            <div className={styles.chatBodyLeftItem}>
                                <span className={styles.itemTitle}><RiArrowDownSLine></RiArrowDownSLine><span>チャットチャンネル</span></span>
                                <ul>
                                    <li className={styles.isSelected}>＃<span>トイレの掃除</span></li>
                                    <li>＃<span>コーヒーメーカーの設置をああああああ</span></li>
                                    <li>＃<span>今度の飲み会の幹事をあああああああああ</span></li>
                                </ul>
                            </div>
                            <div className={styles.chatBodyLeftItemDiscussion}>
                                <span className={styles.itemTitle}><RiArrowDownSLine></RiArrowDownSLine><span>進行中のディスカッション</span></span>
                                <ul>
                                    <li className={styles.isSelected}><span className={styles.text}>トイレの掃除</span><span className={styles.tagActive}>未投票</span></li>
                                    <li><span className={styles.text}>コーヒーメーカーの設置をああああああ</span><span className={styles.tagPending}>未投票</span></li>
                                    <li><span className={styles.text}>今度の飲み会の幹事をあああああああああ</span><span className={styles.tagPending}>検討中</span></li>
                                </ul>
                            </div>
                            <div className={styles.chatBodyLeftItemDiscussion}>
                                <span className={styles.itemTitle}><RiArrowDownSLine></RiArrowDownSLine><span>進行中のディスカッション</span></span>
                                <ul>
                                    <li className={styles.isSelected}><span className={styles.text}>トイレの掃除</span><span className={styles.tagActive}>未投票</span></li>
                                    <li><span className={styles.text}>コーヒーメーカーの設置をああああああ</span><span className={styles.tagPending}>未投票</span></li>
                                    <li><span className={styles.text}>今度の飲み会の幹事をあああああああああ</span><span className={styles.tagPending}>検討中</span></li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.chatBodyRight}>
                            <div className={styles.chatBodyRightHeader}>
                                <BsChat></BsChat>
                                <span>社内部活の予算の上限についての決定</span>
                            </div>
                            <div className={styles.chatBodyRightChatSpace}>
                                <div className={styles.chatBody}>
                                    <div className={styles.chatItem}>
                                        <div className={styles.chatItemHeader}>
                                            <div className={styles.iconWrapper}><div className={styles.icon} dangerouslySetInnerHTML={{ __html: toSvg("user1", 50) }} /></div>
                                            <p>issui ikeda</p>
                                            <span>12:42 PM</span>
                                        </div>
                                        <div className={styles.chatItemBody}>
                                            <p>なるほど。なら予算分配は基本的に活動回数・時間ベースで算出する方がいいかもですね。</p>
                                        </div>
                                    </div>
                                    <div className={styles.chatItem}>
                                        <div className={styles.chatItemHeader}>
                                            <div className={styles.iconWrapper}><div className={styles.icon} dangerouslySetInnerHTML={{ __html: toSvg("user1", 50) }} /></div>
                                            <p>issui ikeda</p>
                                            <span>12:42 PM</span>
                                        </div>
                                        <div className={styles.chatItemBody}>
                                            <p>なるほど。なら予算分配は基本的に活動回数・時間ベースで算出する方がいいかもですね。</p>
                                        </div>
                                    </div>
                                    <div className={styles.chatItem}>
                                        <div className={styles.chatItemHeader}>
                                            <div className={styles.iconWrapper}><div className={styles.icon} dangerouslySetInnerHTML={{ __html: toSvg("user1", 50) }} /></div>
                                            <p>issui ikeda</p>
                                            <span>12:42 PM</span>
                                        </div>
                                        <div className={styles.chatItemBody}>
                                            <p>なるほど。なら予算分配は基本的に活動回数・時間ベースで算出する方がいいかもですね。</p>
                                        </div>
                                    </div>
                                    <div className={styles.chatItem}>
                                        <div className={styles.chatItemHeader}>
                                            <div className={styles.iconWrapper}><div className={styles.icon} dangerouslySetInnerHTML={{ __html: toSvg("user1", 50) }} /></div>
                                            <p>issui ikeda</p>
                                            <span>12:42 PM</span>
                                        </div>
                                        <div className={styles.chatItemBody}>
                                            <p>なるほど。なら予算分配は基本的に活動回数・時間ベースで算出する方がいいかもですね。</p>
                                        </div>
                                    </div>
                                    <div className={styles.chatItem}>
                                        <div className={styles.chatItemHeader}>
                                            <div className={styles.iconWrapper}><div className={styles.icon} dangerouslySetInnerHTML={{ __html: toSvg("user1", 50) }} /></div>
                                            <p>issui ikeda</p>
                                            <span>12:42 PM</span>
                                        </div>
                                        <div className={styles.chatItemBody}>
                                            <p>なるほど。なら予算分配は基本的に活動回数・時間ベースで算出する方がいいかもですね。あああああああああああああああああああああああああああああああああああああああああああああああああああああああ</p>
                                        </div>
                                    </div>
                                    <div className={styles.chatItem}>
                                        <div className={styles.chatItemHeader}>
                                            <div className={styles.iconWrapper}><div className={styles.icon} dangerouslySetInnerHTML={{ __html: toSvg("user1", 50) }} /></div>
                                            <p>issui ikeda</p>
                                            <span>12:42 PM</span>
                                        </div>
                                        <div className={styles.chatItemBody}>
                                            <p>メアド認証ができるパターンメアド入力 → Cognito認証 → ログイン<br/>
                                                メアド入力 → Cognito認証 → カスタム認証 → ログイン<br/>
                                                メタマスク認証ができるパターンメタマスクログイン → カスタム認証 → ログイン<br/></p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.chatInput}>
                                    <input className={styles.chatInputInput} placeholder={"ここにテキストを入力"}/>
                                    <button><BsSend></BsSend></button>
                                </div>
                                <div className={styles.vote}>
                                    <div className={styles.voteHeader}>
                                        <h1>進行中の投票</h1>
                                        <span>詳細を表示</span>
                                    </div>
                                    <div className={styles.voteItem}>
                                        <div className={styles.voteChoice}><span>1.ほげほげほげほげ<div>+</div></span><div className={styles.voteChoiceAgree} style={{width:"20%"}}></div><div className={styles.voteChoiceNotAgree} style={{width:"80%"}}></div></div>
                                        <div className={styles.voteChoice}><span>2.ああああああああ<div>+</div></span><div className={styles.voteChoiceAgree} style={{width:"40%"}}></div><div className={styles.voteChoiceNotAgree} style={{width:"60%"}}></div></div>
                                        <div className={styles.voteChoice}><span>3.いいいいいいいい<div>+</div></span><div className={styles.voteChoiceAgree} style={{width:"30%"}}></div><div className={styles.voteChoiceNotAgree} style={{width:"80%"}}></div></div>
                                    </div>
                                </div>

                            </div>
                        </div>

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
