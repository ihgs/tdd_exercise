import { List, ListItem, ListItemText, ListItemButton, Collapse, Card, CardHeader, CardContent } from "@mui/material"
import { useState } from "react";
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
                <ListItem>
                {spec.description} {spec.status}
                </ListItem>
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit sx={{paddingLeft: indent*indentSize}}>
                <Card>
                    <CardContent>
                        {spec.failedExpectations.map(datum=>{
                            return datum.message
                        })}
                        {spec.passedExpectations.map(datum=>{
                            return datum.matcherName
                        })}
                    </CardContent>

                </Card>
            </Collapse>
        </>
    )
}
function SuiteBox({ suite, indent }) {
    const [open, setOpen] = useState(true);
    const handleClick = () => {
        setOpen(!open);
    }
    return <>
        <ListItemButton onClick={handleClick} >
            {open ? <ExpandLess /> : <ExpandMore />}
            <ListItemText primary={suite.suite.description} />
        </ListItemButton>

        <Collapse in={open} timeout="auto" unmountOnExit sx={{paddingLeft: indent*indentSize}}>
            <List component="div" disablePadding>
                {suite.specs.map(spec => {
                    return <SpecCard spec={spec} indent={indent+1}></SpecCard>
                })}

            </List>
        </Collapse>
    </>
}

export function TestReport({data}) {
    
    return (
        <>
        {data?.error &&
            <div style={{color:"red"}}>
                {data.error.message}
            </div>
        }
        {data?.result &&
            <List sx={{ width: '100%', bgcolor: 'background.paper' }} >

                {Object.keys(data.result).map((key) => {
                    const result = data.result[key]
                    return <SuiteBox suite={result} indent={1} />
                })}
            </List>
        }

        </>
    )
}