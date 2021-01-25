import cli from "./cli";

cli
    .exec()
    .catch((err) => {
        console.error(`${process.platform === "win32" ? "x" : "✖"} ${err}`);
        process.exit(err.exitCode || 1);
    });

