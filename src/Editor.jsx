import MonacoEditor from "react-monaco-editor"
import { useEffect, useLayoutEffect, useState } from "react"
import { runJasmine } from "./testframework/TestManager";
import { TestReport } from "./TestReport";
import { Button, Stack } from "@mui/material";
import { useTest } from "./useTest";
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { TestHistory } from "./testframework/TestHistory";

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

const HISTORY_SIZE = 9

export function Editor() {
    const [code, setCode] = useState(defaultCode);
    const [testCode, setTestCode] = useState(defaultTest);
    const [editorStatus, setEditorStatus] = useState("half")
    const [size, setSize] = useState([0, 0]);
    const { data, report } = useTest();
    const [history, setHistory] = useState([])

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
        setHistory([datum, ...history.slice(0,HISTORY_SIZE)])
        // setHistory([...history, datum])
    }

    return (
        <>
            <Stack direction="row" style={{ textAlign: "left" }}>
                <Stack spacing={1}>
                    <Stack  direction={'row'} alignContent={'bottom'} alignItems={'bottom'} justifyItems={'bottom'}>
                        <MonacoEditor
                            width="800"
                            height={size[0]}
                            language="javascript"
                            theme="vs-dark"
                            value={code}
                            options={options}
                            onChange={setCode}
                        />
                        <div  style={{alignContent:"flex-end"}}>
                        {editorStatus == "half" &&
                            <ExpandLessRoundedIcon fontSize={'large'} onClick={() => { setEditorStatus("hiddenCode") }}></ExpandLessRoundedIcon>
                        }
                        {editorStatus == "hiddenCode" &&
                            <ExpandMoreRoundedIcon fontSize={'large'} onClick={() => { setEditorStatus("half") }}>half</ExpandMoreRoundedIcon>
                        }

                        </div>
                    </Stack>
                    <Stack direction={'row'} >
                        <MonacoEditor
                            width="800"
                            height={size[1]}
                            language="javascript"
                            theme="vs-dark"
                            value={testCode}
                            options={options}
                            onChange={setTestCode}
                        />
                        <div >
                        {editorStatus == "fullCode" &&
                            <ExpandLessRoundedIcon fontSize={'large'} onClick={() => { setEditorStatus("half") }}>half</ExpandLessRoundedIcon>
                        }
                        {editorStatus == "half" &&
                            <ExpandMoreRoundedIcon fontSize={'large'} onClick={() => { setEditorStatus("fullCode") }}>Full</ExpandMoreRoundedIcon>
                        }

                        </div>
                    </Stack>
                </Stack>
                <Stack sx={{ marginLeft: 2}}>
                    <TestHistory history={history} />
                    <div>
                        <Button onClick={runTest} variant="contained" >Run & Test</Button>

                    </div>

                    <TestReport data={data} report={report} />
                </Stack>
            </Stack>

        </>

    )
}