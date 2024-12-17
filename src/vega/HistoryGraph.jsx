import React from 'react'
import {VegaLite} from 'react-vega'

const spec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "Stock prices of 5 Tech Companies over Time.",
  "data": {
    "name": "table"
  },
  "mark": {"type": "circle", "point": true, "size": 300, "yOffset": 20},
  "encoding": {

      "y": {
        "timeUnit": "hoursminutesseconds", "field": "time", "title": null, "axis":{
          "labelAlign":"center",
          "labelOpacity": 0.5,
          "offset": -35,
          "labelBaseline": "line-bottom",
          "domainOpacity": 0
        },
      } ,
      "color": {"condition": {"test": "datum['status'] == 'passed'", "value": "green"}, "value": "red"}
  },
  "config": {
    "legend": {"disable": true}

  },
  "params": [
    {
      "name": "param1",
      "select": {"type": "interval", "encodings": ["y"]},
      "bind": "scales"
    }
  ]
}


  export function HistoryGraph({data, width, height}){
    return <VegaLite  data={{"table": data}} spec={spec} actions={false} width={width} height={height}/>
  }