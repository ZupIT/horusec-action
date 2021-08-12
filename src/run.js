const core = require('@actions/core');
const {promisify} = require('util');

const fs = require('fs');
const subprocesses = require('child_process');
const exec = promisify(subprocesses.exec)
const exists = promisify(fs.exists)
const read = promisify(fs.readFile)

const download = require('./download');
const reviewdog = require('./reviewdog');
const Flags = require('./flags');

async function run() {
    const executable = await download()
    const flags = new Flags()
    const output = './result.json'
    try {
        await exec(`${executable} start ${flags} --json-output-file="${output}" --output-format="json"`)
    } catch (err) {
        core.setFailed(err.message)
    }

    if (await exists(output)) {
        const raw = await read(output);
        const result = JSON.parse(raw);
        if (core.getInput('output-format') === 'reviewdog') return reviewdog.convert(result)
        return result;
    }
}

run()
    .then(result => core.setOutput('result', result))
    .catch(err => core.setFailed(err.message))
