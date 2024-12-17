import MonacoEditor from "react-monaco-editor"
import { useEffect, useLayoutEffect, useState } from "react"
import { runJasmine } from "./testframework/TestManager";
import { TestReport } from "./TestReport";
import { Box, Button, Paper, Stack } from "@mui/material";
import { useTest } from "./useTest";
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { TestHistory } from "./testframework/TestHistory";
import { HistoryGraph } from "./vega/HistoryGraph";

const defaultCode = `
function fizzbuzz(num) {
    return 0;
}
`

const defaultTest = `
describe("Test", function(){
    it('test', function (){
        expect(1).toBe(1);
    })
})

describe("FizzBuzz", function(){
    it('test', function (){
        const input = 1;
        const result = fizzbuzz(input);
        expect(result).toBe(1);
    })
})
`

const defaultTodo = `- TODO
`

const HISTORY_SIZE = 9

export function Editor() {
    const [code, setCode] = useState(defaultCode);
    const [testCode, setTestCode] = useState(defaultTest);
    const [todo, setTodo] = useState(defaultTodo)
    const [editorStatus, setEditorStatus] = useState("half")
    const [size, setSize] = useState([0, 0]);
    const { data, report } = useTest();
    const [history, setHistory] = useState([])
    const [allHistory, setAllHistory] = useState([])
    const [leftWidth, setLeftWidth] = useState(0)

    const options = {
        automaticLayout: true,
        inlineSuggest: { enabled: true }
    };

    useLayoutEffect(() => {
        const updateSize = () => {
            switch (editorStatus) {
                case "half":
                    setSize([(window.innerHeight - 40) / 2, (window.innerHeight - 40) / 2])
                    break;
                case "fullCode":
                    setSize([(window.innerHeight - 80), 20])
                    break;
                case "hiddenCode":
                    setSize([20, (window.innerHeight - 80)])
                    break;
            }

            setLeftWidth(window.innerWidth - 860)
        }
        window.addEventListener('resize', updateSize)
        updateSize()

        return () => window.removeEventListener('resize', updateSize)
    }, [editorStatus])


    const runTest = async () => {
        const result = await runJasmine(code + '\n' + testCode, report)
        const datum = {
            status: result.overallStatus,
            time: Date.now()
        }
        setAllHistory([datum, ...allHistory])
        setHistory([datum, ...history.slice(0,HISTORY_SIZE)])
        // setHistory([...history, datum])
    }

    return (
        <>
            <Stack direction="row" style={{ textAlign: "left" }}>

                <Stack>
                    <HistoryGraph data={allHistory} height={window.innerHeight - 30} ></HistoryGraph>
                </Stack>


                <Stack sx={{ marginLeft: 2}} width={leftWidth - 70} height={window.innerHeight} style={{ overflowX: "auto"}}>
                    
                    <MonacoEditor
                            width={`${leftWidth - 90}`} 
                            height={window.innerHeight/2}
                            language="markdown"
                            theme="vs-dark"
                            value={todo}
                            options={{minimap: {enabled: false}, wordWrap: {enabled: true} }}
                            onChange={setTodo}
                        />

                    <TestHistory history={history} />
                    <div>
                        <Button onClick={runTest} variant="contained" >Run & Test</Button>

                    </div>
                    <div style={{overflowY:"auto", overflowX: "auto"}}>
                    <TestReport data={data} report={report} />
                    </div>
                    
                

                </Stack>
                <Stack spacing={1}>
                    <Stack  direction={'row'} alignContent={'bottom'} alignItems={'bottom'} justifyItems={'bottom'}>
                        <div  style={{alignContent:"flex-end", width: 35}}>
                        {editorStatus == "half" &&
                            <ExpandLessRoundedIcon fontSize={'large'} onClick={() => { setEditorStatus("hiddenCode") }}></ExpandLessRoundedIcon>
                        }
                        {editorStatus == "hiddenCode" &&
                            <ExpandMoreRoundedIcon fontSize={'large'} onClick={() => { setEditorStatus("half") }}>half</ExpandMoreRoundedIcon>
                        }

                        </div>
                        <MonacoEditor
                            width="800"
                            height={size[0]}
                            language="javascript"
                            theme="vs-dark"
                            value={code}
                            options={options}
                            onChange={setCode}
                        />

                    </Stack>
                    <Stack direction={'row'} >
                        <div style={{width: 35}}>
                        {editorStatus == "fullCode" &&
                            <ExpandLessRoundedIcon fontSize={'large'} onClick={() => { setEditorStatus("half") }}>half</ExpandLessRoundedIcon>
                        }
                        {editorStatus == "half" &&
                            <ExpandMoreRoundedIcon fontSize={'large'} onClick={() => { setEditorStatus("fullCode") }}>Full</ExpandMoreRoundedIcon>
                        }

                        </div>
                        <MonacoEditor
                            width="800"
                            height={size[1]}
                            language="javascript"
                            theme="vs-dark"
                            value={testCode}
                            options={options}
                            onChange={setTestCode}
                        />
                        
                    </Stack>
                </Stack>
                
            </Stack>

        </>

    )
}