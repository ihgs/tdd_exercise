import { useState } from "react";

export function useTest(){
    const [data, setData] = useState({});

    const report = ({result, error}) => {
        
        setData({result, error});
        
    }

    return {data, report};
}