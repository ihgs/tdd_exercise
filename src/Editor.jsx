import MonacoEditor from "react-monaco-editor"
import { useEffect, useState } from "react"
import { runJasmine } from "./testframework/TestManager";
import { TestReport } from "./TestReport";
import { Button, Stack } from "@mui/material";
import { useTest } from "./useTest";

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
export function Editor() {
    const [code, setCode] = useState(defaultCode);
    const [testCode, setTestCode] = useState(defaultTest);
    const {data, report}  = useTest();

    const options = {
        automaticLayout: true,
    };
    const editorDidMount = (editor, monaco) => {
        console.log('editorDidMount', editor);
        // editor.focus();
    }

    const editorWillMount = (editor, monaco) => {
        console.log('editorDidMount', editor);

    }


    const runTest = async () => {
        console.log("runTest")
        runJasmine(code + '\n' + testCode, report)
    }

    return (
        <>
            <Stack direction="row" style={{ textAlign: "left" }}>
                <Stack spacing={2}>
                <MonacoEditor
                    width="800"
                    height="300"
                    language="javascript"
                    theme="vs-dark"
                    value={code}
                    options={options}
                    onChange={setCode}
                    editorDidMount={editorDidMount}
                    editorWillMount={editorWillMount}
                />
                <MonacoEditor
                    width="800"
                    height="300"
                    language="javascript"
                    theme="vs-dark"
                    value={testCode}
                    options={options}
                    onChange={setTestCode}
                    editorDidMount={editorDidMount}
                    editorWillMount={editorWillMount}
                />
                </Stack>
                <Stack>
                    <Button onClick={runTest} sx={{marginLeft: 3}} variant="contained" >Test</Button>

                <TestReport data={data} report={report}/>
                </Stack>
            </Stack>
            
        </>

    )
}