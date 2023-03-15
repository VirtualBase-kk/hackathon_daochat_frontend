import styles from "@/styles/auth.module.sass"

export default function Auth (){
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
            <button>Connect Wallet</button>
            </div>
        </div>
    </div>
}