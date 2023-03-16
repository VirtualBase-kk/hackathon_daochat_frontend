import React from "react";
import { Oval } from "react-loader-spinner";
function Loading() {
    return (
        <div style={{width:"100vw",height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
            <Oval
                height={80}
                width={80}
                color="#411CA7"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#EDE9FB"
                strokeWidth={2}
                strokeWidthSecondary={2}
            />
        </div>
    );
}

export default Loading;