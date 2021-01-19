import snooplogg from "snooplogg";
import * as bin from "hasbin";

const cmd = {
    desc: "Explore and download Docker images",
    commands: `${__dirname}/docker`,
    aliases: [ "d" ],
    name: "docker",
};

if (!bin.sync("docker")) {
    Object.assign(cmd,  {
        commands: null,
        defaultCommand: ({ console }) => {
            console.log(snooplogg.styles.alert("Docker is not installed."));
        },
    });
}

export default cmd;
