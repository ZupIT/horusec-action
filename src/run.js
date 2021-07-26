const core = require('@actions/core');
const {promisify} = require('util');

const subprocesses = require('child_process');
const exec = promisify(subprocesses.exec)

const download = require('./download');

async function run() {
    const executable = await download()
    await exec(`${executable} start -p="./" --ignore="**/.vscode/**, **/*.env, **/.mypy_cache/**, **/tests/**"`)
}

run()
    .then(result => core.setOutput('result', result))
    .catch(err => core.setFailed(err.message))
