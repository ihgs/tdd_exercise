export class SpecResult {
    constructor() {
        this.specs = []
        this.suites = []
        this.value = undefined
        this.hasFail = false
    }

    addSpec(spec) {
        console.debug({ spec })
        const suite = this.suites.find(suite => suite.value?.id == spec.parentSuiteId)
        if (suite) {
            if(spec.status=="failed"){
                suite.hasFail = true
            }
            suite.specs.push(spec)
        } else {
            if(spec.status=="failed"){
                this.hasFail = true
            }
            this.specs.push(spec)
        }
    }
    addSuite(suite) {
        const result = new SpecResult()
        result.value = suite
        const parentSuite = this.suites.find(tmp => tmp.value?.id == suite.parentSuiteId)
        if (parentSuite) {
            parentSuite.suites.push(result)
        }
        this.suites.push(result)
    }

    failed(){
        if (this.hasFail){
            return true
        }
        for (let i=0;i<this.suites.length;i++){
            if(this.suites[i].failed()){
                return true
            }
        }
        return false
    }
}


export class TestReporter {
    constructor(report) {
        this.report = report
        this.results = {}
    }
    jasmineStarted(suiteInfo) {
        // console.log('Running suite with ' + suiteInfo.totalSpecsDefined);
        this.sepcResult = new SpecResult()

    }

    suiteStarted(result) {
        // console.log('Suite started: ' + result.description
        //     + ' whose full description is: ' + result.fullName);
        this.results[result.id] = { suite: result, specs: [] }
        this.sepcResult.addSuite(result)

    }

    async specStarted(result) {
        console.log('Spec started: '+ result.fullName)
        // await somethingAsync();
        // console.log('Spec started: ' + result.description
        //     + ' whose full description is: ' + result.fullName);
    }

    specDone(result) {
        // console.log('Spec: ' + result.description + ' was ' + result.status);
        this.sepcResult.addSpec(result)
    }

    suiteDone(result) {
        // console.log('Suite: ' + result.description + ' was ' + result.status);
    }

    jasmineDone(result) {
        // console.log('Finished suite: ' + result.overallStatus);
        console.debug(this.sepcResult)
        this.report({ result: {specs: this.sepcResult.specs, suites: this.sepcResult.suites.filter(tmp => tmp.value?.parentSuiteId == null) }})
    }

    setError(error) {
        this.report({ error: error })
    }

}
