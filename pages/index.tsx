import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from "@/styles/index.module.sass"
import { toSvg } from "jdenticon";
import {AiOutlineSetting,AiOutlineBell} from "react-icons/ai"
const inter = Inter({ subsets: ['latin'] })
import {BsFileEarmark,BsChat,BsSend} from "react-icons/bs"
import {RiArrowDownSLine} from "react-icons/ri"
export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className={styles.root}>
            <div className={styles.tab}>
                <div className={styles.iconWrapper}>
                    <div className={styles.selected}></div>
                    <div className={styles.icon} dangerouslySetInnerHTML={{ __html: toSvg("value", 40) }} />
                </div>
                <div className={styles.iconWrapper}>
                    <div className={styles.space}></div>
                    <div className={styles.icon} dangerouslySetInnerHTML={{ __html: toSvg("value1", 40) }} />
                </div>
                <div className={styles.iconWrapper}>
                    <div className={styles.space}/>
                    <div className={styles.iconPlus}>＋</div>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.chatHeader}>
                    <div className={styles.chatHeaderLeft}>
                        <h1>VirtualBase inc.</h1>
                    </div>
                    <div className={styles.chatHeaderRight}>
                        <div className={styles.chatHeaderRightLeft}>
                            <div className={styles.iconWrapper}>
                                <AiOutlineSetting />
                            </div>
                            <div className={styles.iconWrapper}>
                                <AiOutlineBell />
                            </div>

                        </div>
                        <div className={styles.chatHeaderRightRight}>
                            <div className={styles.iconWrapper}><div className={styles.icon} dangerouslySetInnerHTML={{ __html: toSvg("user1", 50) }} /></div>
                            <div className={styles.metadata}>
                                <p>Issui ikeda</p>
                                <span>UI/UX Designer</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.chatBody}>
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
                                <input className={styles.chatInputInput}/>
                                <button><BsSend></BsSend></button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </>
  )
}
