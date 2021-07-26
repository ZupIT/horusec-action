const core = require('@actions/core');
const {promisify} = require('util');

const subprocesses = require('child_process');
const exec = promisify(subprocesses.exec)

const download = require('./download');

async function run() {
    const executable = await download()
    const flags = [`-p="${core.getInput('project-path')}"`]

    const ignore = core.getInput('ignore');
    if (ignore) flags.push(`-i="${ignore}"`)

    await exec(`${executable} start ${flags.join(' ')} -json-output-file="./output.json" --output-format="json"`)
}

run()
    .then(result => core.setOutput('result', result))
    .catch(err => core.setFailed(err.message))
