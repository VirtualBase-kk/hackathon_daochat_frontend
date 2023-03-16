import styles from "@/styles/auth.module.sass"
import {useGetSignMessage} from "@/src/functions/auth/getMessage";
import {useContext, useEffect, useState} from "react";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useGetJWT} from "@/src/functions/auth/getJWT";
import {AuthContext} from "@/src/context/authContext";
import {useRouter} from "next/router";
import {LoadingContext} from "@/src/context/loadingContext";

export default function Auth (){
    const [message,setMessage] = useState<string>("")
    const [walletAddress,setWalletAddress] = useState<string>("")
    const [id,setId] = useState<string>("")
    const [userId,setUserId] = useState<string>("")
    const [signature,setSignature] = useState<string>("")
    const [jwt,setJWT] = useState<string>("")
    const auth = useContext(AuthContext)
    const router = useRouter()
    const loading = useContext(LoadingContext)
    useGetSignMessage(walletAddress,setMessage,setId)
    useGetJWT(signature,id,setJWT,setUserId)

    useEffect(()=>{
        if (jwt.length !== 0) {
            (async()=>{
                try {
                    await auth.signup(userId)
                }catch {

                }
                await auth.signIn(userId,jwt)
                loading.setLoading(false)
                toast("ログインしました")
                router.push("/")
            })()
        }
    },[jwt])

    useEffect(()=>{
        (async()=>{
            if (message.length !== 0) {
                const from = walletAddress;
                const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
                // @ts-ignore
                const sign = await globalThis.window.ethereum.request({
                    method: 'personal_sign',
                    params: [msg, from, msg],
                });

                setSignature(sign)
            }
        })()
    },[message])

    const connectWallet = async () => {
        // @ts-ignore
        const accounts = await globalThis.window.ethereum.request({ method: 'eth_requestAccounts' });
        // @ts-ignore
        await globalThis.window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId:"0x250"}],
        })
        if (accounts.length !== 0) {
            loading.setLoading(true)
            setWalletAddress(accounts[0])
        } else {
            toast.error("連携に失敗しました")
        }
    }

    return <div className={styles.root}>
        <img className={styles.sp_logo} src={"/logo_black.svg"}/>
        <div className={styles.left}>
            <img className={styles.bg_image} src={"/auth_bg.png"}/>
            <img className={styles.logo} src={"/logo.svg"}/>
            <img className={styles.auth_text} src={"/auth_text.svg"}/>
            <p className={styles.company}>©Virtual Base inc.</p>
        </div>
        <div className={styles.right}>
            <div className={styles.content}>
            <h1>サインイン</h1>
                <p>Metamask</p>
            <button onClick={()=>{connectWallet()}}>Connect Wallet</button>
            </div>
        </div>
    </div>
}