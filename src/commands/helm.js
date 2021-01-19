import snooplogg from "snooplogg";
import * as bin from "hasbin";

const cmd = {
    desc: "Explore and download Helm charts",
    commands: `${__dirname}/helm`,
    aliases: [ "h" ],
    name: "helm",
};

if (!bin.sync("helm")) {
    Object.assign(cmd,  {
        commands: null,
        defaultCommand: ({ console }) => {
            console.log(snooplogg.styles.alert("Helm client is not installed."));
        },
    });
}

export default cmd;
