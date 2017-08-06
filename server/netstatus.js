const fetch = require('node-fetch');

const address = "http://192.168.178.1/css/rd/images/fritzLogo.svg";
const interval = 500; // ms

const milli = 1000;
const nano = milli * milli * milli;

function time() {
    const start = process.hrtime();
    return () => {
        const hr = process.hrtime(start);
        const duration = (hr[0] + hr[1] / nano) * milli;
        return duration;
    }
}

function assess(duration) {
    if (duration < 100) {
        return "good";
    }
    if (duration < 200) {
        return "acceptable";
    }
    return "bad";
}

async function timeRequest(statusObserver) {
    let stopwatch = time();
    try {
        let response = await fetch(address);
        let duration = stopwatch();
        let quality = assess(duration);
        let result = {
            status: quality,
            duration: duration
        };
        console.log(result);
        statusObserver.value(result);
    } catch(ex) {
        statusObserver.value({
            status: "offline",
            duration: -1
        });
    }
}

async function monitor(statusObserver) {
    const handle = setInterval(() => {
        timeRequest(statusObserver);
        if (statusObserver.isCanceled) {
            console.log("stop network monitor");
            clearInterval(handle);
        }
    }, interval);
}

exports.status = monitor;
