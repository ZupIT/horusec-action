const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const http = require('https');
const {platform, arch} = require("process");

function download(url, path) {
    const file = fs.createWriteStream(path)
    return new Promise(resolve => {
        function get(url, file) {
            http.get(url, (response) => {
                if (response.statusCode === 302) get(response.headers.location, file)
                else response.pipe(file).on("finish", resolve)
            })
        }

        get(url, file)
    })
}

module.exports = async function () {
    const token = core.getInput(`github-token`, {required: true});
    const {rest: {repos}} = github.getOctokit(token)

    const owner = "ZupIT"
    const repo = "horusec"

    const {data: {name, assets, created_at}} = await repos.getLatestRelease({owner, repo});
    core.info(`Using ${name} released at ${created_at}`)

    const asset = assets.find(({name}) => name.includes(`${platform}_${arch}`))
    if (!asset) {
        throw new Error(`No binary for ${platform}_${arch}`)
    }
    core.info(`Found binary '${asset.name}' for current platform`)

    const executable = `./${asset.name}`;
    const start = new Date();
    await download(asset.browser_download_url, executable)
    fs.chmodSync(executable, 0o755);
    core.info(`Downloaded in ${(new Date() - start) / 1000}s`)

    return executable
}