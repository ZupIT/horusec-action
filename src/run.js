const core = require('@actions/core');
const github = require('@actions/github');
const {platform, arch} = require("process");

async function run() {
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

    delete asset.uploader
    return asset
}

run()
    .then(result => core.setOutput('result', result))
    .catch(err => core.setFailed(err.message))
