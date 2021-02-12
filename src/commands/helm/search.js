import { EOL } from "os";
import { createTable } from "@axway/amplify-cli-utils";
import HelmService from "../../services/helm";
import { resolve } from "../../environments";
import { strTruncate } from "../../utils";

const config = resolve();

export default {
    desc: "Search the Axway Repository for charts",
    args: [
        {
            name: "term",
            hint: "TERM",
            desc: "The Helm Chart name",
            required: true,
        },
    ],
    options: {
        "--full-names": "Show image full names",
        "--offset": "Retrieving search results with offset pagination",
        "--limit": "Max number of search results",
    },
    async action({ argv, console }) {
        const service = new HelmService(console, config);
        return service.search(argv.term)
            .then(({ body }) => {
                if (body && body.entries?.length > 0) {
                    console.log(`Available entries: ${body.entries.length}${EOL}`);
                    const helmUrl = new URL(config.helm.repo);
                    const table = createTable([
                        "NAME",
                        "PRODUCT",
                        "TITLE",
                        "DESCRIPTION",
                        // "DIGEST",
                    ]);

                    body.entries.forEach(async (result) => {
                        table.push([
                            (argv.fullNames ? `${helmUrl.host}/` : "")
								+ `${result.artifactory.package.name}`,
                            `${result.webliv.sfdc.mainProduct.name}`,
                            `${result.webliv.title}`,
                            `${strTruncate(result.webliv.description, 35)}`,
                            // `${result.artifactory.digests.sha256}`,
                        ]);
                    });

                    console.log(table.toString());
                } else {
                    console.log("No entries found.");
                }
                return true;
            });
    },
};
