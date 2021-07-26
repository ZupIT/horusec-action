const core = require('@actions/core');
const {promisify} = require('util');

const fs = require('fs');
const subprocesses = require('child_process');
const exec = promisify(subprocesses.exec)

const download = require('./download');

async function run() {
    const executable = await download()
    const flags = [`-p="${core.getInput('project-path')}"`]

    const ignore = core.getInput('ignore');
    if (ignore) flags.push(`-i="${ignore}"`)

    const output = './result.json'
    await exec(`${executable} start ${flags.join(' ')} -json-output-file="${output}" --output-format="json"`)
    return fs.readFileSync(output);
}

run()
    .then(result => core.setOutput('result', result))
    .catch(err => core.setFailed(err.message))
