import { useState } from "react";

export function useTest(){
    const [data, setData] = useState({});

    const report = (newData) => {
        setData(newData);
    }

    return {data, report};
}