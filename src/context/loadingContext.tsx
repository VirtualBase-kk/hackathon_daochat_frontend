import React from "react";
import Loading from "../components/loading";
export const LoadingContext = React.createContext<{
    isLoading: boolean;
    setLoading: any;
}>({
    isLoading: false,
    setLoading: null,
});

const getStyle = (type: boolean, isLoading: boolean) => {
    let respStyle:any = {
        width:"100vw",
        position:"absolute",
        top:"0",
        left:"0",
        bottom:"0",
        zIndex:"10",
        backgroundColor:"rgba(255,255,255,0.5)"
    }
    if (type && isLoading) {
        respStyle["display"] = "none"
        return respStyle
    } else if (!type && !isLoading) {
        respStyle["display"] = "none"
        return respStyle
    } else {
        return respStyle
    }
};

export const LoadingContextProvider = (props: any) => {
    const [isLoading, setLoading] = React.useState<boolean>(false);

    return (
        <LoadingContext.Provider
            value={{
                isLoading,
                setLoading,
            }}
        >
            <div>
                <div>{props.children}</div>
                <div style={getStyle(false, isLoading)} >
                    <Loading />
                </div>
            </div>
        </LoadingContext.Provider>
    );
};