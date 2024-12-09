
import { TestReporter } from "./TestReporter";


export async function runJasmine(data, report) {
    window.jasmine = jasmineRequire.core(jasmineRequire)


    const jasmineEnv = jasmine.getEnv();

    window.describe = jasmineEnv.describe
    window.it = jasmineEnv.it
    window.expect = jasmineEnv.expect

    const reporter = new TestReporter(report);
    jasmineEnv.updateInterval = 250;
    // jasmineEnv.randomizeTests(false);
    jasmineEnv.addReporter(reporter);
    eval(data)
    const result = await jasmineEnv.execute();
    // console.log(result)
}
