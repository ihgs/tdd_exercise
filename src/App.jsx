import React, { useLayoutEffect } from "react";
import "./testframework/TestManager";

import { useEffect } from "react";
import { Editor } from "./Editor";



export function App(){

    useLayoutEffect(()=>{
        // window.addEventListener('beforeunload', (e) => {
        //     const message = '入力内容が保存されない可能性があります。ページを離れますか？'
        //     e.preventDefault()
        //   return  message
        //   })
          
    },[])
    return (
        <>
            <Editor />
        </>
    )
}