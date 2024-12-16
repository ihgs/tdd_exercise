
import { TestReporter } from "./TestReporter";


export async function runJasmine(data, report) {
    window.jasmine = jasmineRequire.core(jasmineRequire)


    const jasmineEnv = jasmine.getEnv();

    window.describe = jasmineEnv.describe
    window.it = jasmineEnv.it
    window.expect = jasmineEnv.expect
    window.afterAll = jasmineEnv.afterAll
    window.afterEach = jasmineEnv.afterEach
    window.beforeAll = jasmineEnv.beforeAll
    window.beforeEach = jasmineEnv.beforeEach
    window.expectAsync = jasmineEnv.expectAsync
    

    const reporter = new TestReporter(report);
    jasmineEnv.updateInterval = 250;
    jasmineEnv.configure({random:false})
    jasmineEnv.addReporter(reporter);
    try{
        eval(data)
        return await jasmineEnv.execute();
    }catch(e){
        reporter.setError(e)
    }
}
