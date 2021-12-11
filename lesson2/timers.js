const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");

const EventEmitter = require("events");
const emitter = new EventEmitter();

const targets = process.argv.slice(2);
if (targets.length < 1) {
    throw new Error("Type \"node timers.js mm-HH-DD-MM-YYYY\" to start timer.");
}
dayjs.extend(customParseFormat);
const dtTargets = targets.map(
    target => dayjs(target, ["mm-HH-DD-MM-YYYY", "HH-DD-MM-YYYY"])
);

const timeUnitsToString = (value, singularSuffix) => {
    if (value <= 0) return "";
    if (value === 1) return value + " " + singularSuffix + " ";
    return value + " " + singularSuffix + "s ";
};

emitter.on("time", () => {
    const now = dayjs();
    console.clear();
    dtTargets.forEach((dtTarget, index) => {
        let diff = dtTarget.diff(now, "second");
        if (diff > 0) {
            const seconds = diff % 60;
            diff = (diff - seconds) / 60;
            const minutes = diff % 60;
            diff = (diff - minutes) / 60;
            const hours = diff % 24;
            const days = (diff - hours) / 24;
            console.log(
                "Timer " + (index + 1) + ": "
                    + timeUnitsToString(days, "day")
                    + timeUnitsToString(hours, "hour")
                    + timeUnitsToString(minutes, "minute")
                    + timeUnitsToString(seconds, "second")
                    + "remaining"
            );
        } else {
            console.log("Timer " + (index + 1) + " expires");
        }
    });
});

emitter.emit("time");
setInterval(() => {emitter.emit("time");}, 1000);