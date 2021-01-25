import loadConfig from "@axway/amplify-config";

export const environments = {
    dev: {
        url: "http://127.0.0.1:8070",
        docker: {
            repo: "http://127.0.0.1:5000",
        },
        helm: {
            repo: "http://127.0.0.1:5000"
        }
    },
    preprod: {
        url: "https://repository-lab-dev.axwaytest.net:8071",
        docker: {
            repo: "http://docker-repository.axwaytest.net",
        },
        helm: {
            repo: "http://helm-repository.axwaytest.net:9080",
        }
    },
    prod: {
        url: "https://repository.axway.com",
        docker: {
            repo: "https://docker.repository.axway.com",
        },
        helm: {
            repo: "https://helm.repository.axway.com",
        }
    },
};

const mapping = {
    development: "dev",
    preproduction: "preprod",
    "pre-production": "preprod",
    production: "prod",
    staging: "preprod",
    test: "preprod"
};

export function resolve() {
    let env = loadConfig().get("env") || "prod";
    env = env.toLowerCase();
    env = mapping[env] || env;
    return {
        name: env,
        ...environments[env]
    };
}
