import CircleIcon from '@mui/icons-material/Circle';
import { Stack, Tooltip } from '@mui/material';

const hhmmss = (time)=>{
    const d = new Date(time)
    return [ d.getHours(), d.getMinutes(), d.getSeconds()].map(item=>{
        return ('00' + item ).slice(-2)
    }).join(":")
}

const colorMap = {
    "passed": "green",
    "failed": "red",
    "error": "#FFC800"
}
export function TestHistory({history}){
    return <>
        <Stack direction={"row"} sx={{height:30}}>
            {   
                history.map((data)=>{
                    const color = colorMap[data.status]
                    return (
                        <Tooltip title={hhmmss(data.time)}>
                            <CircleIcon key={data.time} sx={{color: color}} />
                        </Tooltip>
                        )
                    ;
                })
            }
        </Stack>

        
    </>
}