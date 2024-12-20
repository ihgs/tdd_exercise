import { List, ListItem, ListItemText, ListItemButton, Collapse, Card, CardHeader, CardContent } from "@mui/material"
import { useState, useEffect, memo } from "react";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const indentSize = 3

function SpecCard({ spec, indent }) {
    const [open, setOpen] = useState(spec.status!="passed");
    const handleClick = () => {
        setOpen(!open);
    }
    return (
        <>
            <ListItemButton onClick={handleClick} sx={{  color: spec.status=="passed" ? "blue" : "red"}} >
                {open ? <ExpandLess /> : <ExpandMore />}
                <ListItem style={{padding:0}}>
                {spec.description} {spec.status}
                </ListItem>
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit sx={{paddingLeft: indent*indentSize}}>
                <Card>
                    <CardContent style={{padding: 5}}>
                        {spec.failedExpectations.map(datum=>{
                            return <div key={Date.now()}>{datum.message}</div>
                        })}
                        {spec.passedExpectations.map(datum=>{
                            return <div key={Date.now()}>{datum.matcherName}</div>
                        })}
                    </CardContent>

                </Card>
            </Collapse>
        </>
    )
}
const SuiteBox = memo(({ suite, indent }) =>{
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    }
    useEffect(()=>{
        setOpen(suite.failed())
    },[])
    return <>
        <ListItemButton onClick={handleClick} style={{paddingTop:0, paddingBottom:0}}>
            {open ? <ExpandLess /> : <ExpandMore />}
            <ListItemText primary={suite.value.description} />
        </ListItemButton>

        <Collapse in={open} timeout="auto" unmountOnExit sx={{paddingLeft: indent*indentSize}}>
            <List component="div" disablePadding>
                {suite.specs.map(spec => {
                    return <SpecCard key={spec.id} spec={spec} indent={indent+1}></SpecCard>
                })}
                {suite.suites.map(child => {
                    return <SuiteBox key={suite.id} suite={child} indent={indent+1}></SuiteBox>
                })}
            </List>
        </Collapse>
    </>
})

export function TestReport({data}) {
    return (
        <>
        {data?.error &&
            <div  style={{color:"red"}}>
                {data.error.message}
            </div>
        }
        {data?.result &&
            <List key={data.executedAt} sx={{ width: '100%', bgcolor: 'background.paper' }} >
                {data.result.specs.map(spec => {
                    return <SpecCard key={spec.id} spec={spec} indent={1}></SpecCard>
                })}
                {data.result.suites.map((suite) => {
                    return <SuiteBox key={suite.id} suite={suite} indent={1} />
                })}
            </List>
        }

        </>
    )
}