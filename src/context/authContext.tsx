import React, { useContext, useEffect } from "react";
import Amplify, { Auth } from "aws-amplify";
import { v4 as uuidv4 } from 'uuid';
import {useRouter} from "next/router";

export const AuthContext = React.createContext<{
    isLogin: boolean;
    signIn: any;
    signup: any;
    signOut: any;
    getToken: any;
    userInfo: any;
}>({
    isLogin: false,
    signIn: null,
    signup: null,
    signOut: null,
    getToken: null,
    userInfo: null,
});

export const AuthContextProvider = (props: any) => {

    const AuthConfig = {
        region: process.env.NEXT_PUBLIC_AUTH_REGION,
        userPoolId: process.env.NEXT_PUBLIC_AUTH_USER_POOL_ID,
        userPoolWebClientId: process.env.NEXT_PUBLIC_AUTH_USER_POOL_WEB_CLIENT_ID,
        storage: globalThis.window?.localStorage,
        authenticationFlowType: 'CUSTOM_AUTH',
    }

    Auth.configure({ Auth: AuthConfig });
    const [isLogin, setLogin] = React.useState(() => {
        const value =
            String(globalThis.window?.localStorage.getItem("isLogin")).toLocaleLowerCase() === "true";
        return value !== null ? value : false;
    });

    const router = useRouter()

    const signup = async (id: string) => {
        try {
            await Auth.signUp({
                username: id,
                password:uuidv4()
            });
            return {
                status: true,
                error: null,
            };
        } catch (error) {
            return {
                status: false,
                error,
            };
        }
    };

    const signOut = async () => {
        try {
            await Auth.signOut();
            setLogin(false);
            return true;
        } catch (error) {
            return false;
        }
    };

    const signIn = async (id: string,jwt:string) => {
        try {
            await signOut();
            const challenge = await Auth.signIn(id,"");
            if (challenge.challengeName === 'CUSTOM_CHALLENGE') {
                const user = await Auth.sendCustomChallengeAnswer(challenge, jwt);
                console.log(user);
                setLogin(true);
                return {
                    status: true,
                    error: null,
                    user,
                };
            }　else {
                return {
                    status: false,
                    error:null,
                    user: null,
                };
            }
        } catch (error) {
            return {
                status: false,
                error,
                user: null,
            };
        }
    };

    const getToken = async () => {
        try {
            const result = await Auth.currentSession();
            return {
                token: result.getIdToken().getJwtToken(),
                status: true,
            };
        } catch (error) {
            setLogin(false);
            return {
                token: null,
                status: false,
            };
        }
    };
    const userInfo = async () => {
        try {
            const result = await Auth.currentUserInfo();
            return {
                status: true,
                info: result,
            };
        } catch (error) {
            return {
                status: false,
                info: null,
            };
        }
    };

    useEffect(() => {
        globalThis.window?.localStorage.setItem("isLogin", String(isLogin));
    }, [isLogin]);

    return (
        <AuthContext.Provider
            value={{
                isLogin,
                signup,
                signIn,
                signOut,
                getToken,
                userInfo,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};