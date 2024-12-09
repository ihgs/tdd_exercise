export class SpecResult {

}


export class TestReporter {
    constructor(report) {
        this.report = report
        this.results = {}
    }
    jasmineStarted  (suiteInfo) {
        console.log('Running suite with ' + suiteInfo.totalSpecsDefined);
    }

    suiteStarted  (result)  {
        console.log('Suite started: ' + result.description
            + ' whose full description is: ' + result.fullName);
            this.results[result.id] = {suite: result, specs: []}
            console.log({result})
    }

    async specStarted  (result) {
        // await somethingAsync();
        // console.log('Spec started: ' + result.description
        //     + ' whose full description is: ' + result.fullName);
    }

    specDone  (result) {
        console.log('Spec: ' + result.description + ' was ' + result.status);

        for (const expectation of result.failedExpectations) {
            console.log('Failure: ' + expectation.message);
            console.log(expectation.stack);
        }

        this.results[result.parentSuiteId].specs.push(result)
        console.log(result.passedExpectations.length);
    }

    suiteDone(result) {
        console.log('Suite: ' + result.description + ' was ' + result.status);
        for (const expectation of result.failedExpectations) {
            console.log('Suite ' + expectation.message);
            console.log(expectation.stack);
        }

    }

    jasmineDone (result) {
        console.log('Finished suite: ' + result.overallStatus);
        for (const expectation of result.failedExpectations) {
            console.log('Global ' + expectation.message);
            console.log(expectation.stack);
        }
        console.log(this.results)
        this.report(this.results)
    }

}
