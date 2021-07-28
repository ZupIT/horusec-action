const core = require('@actions/core');
const {promisify} = require('util');

const fs = require('fs');
const subprocesses = require('child_process');
const exec = promisify(subprocesses.exec)
const exists = promisify(fs.exists)
const read = promisify(fs.readFile)

const download = require('./download');
const reviewdog = require('./reviewdog');

async function run() {
    const executable = await download()
    const flags = [`-p="${core.getInput('project-path')}"`]

    const analysisTimeout = core.getInput('analysis-timeout');
    if (analysisTimeout) flags.push(`-t="${analysisTimeout}"`)

    const authorization = core.getInput('authorization');
    if (authorization) flags.push(`-a="${authorization}"`)

    const certificatePath = core.getInput('certificate-path');
    if (certificatePath) flags.push(`-C="${certificatePath}"`)

    const containerBindProjectPath = core.getInput('container-bind-project-path');
    if (containerBindProjectPath) flags.push(`-P="${containerBindProjectPath}"`)

    const customRulesPath = core.getInput('custom-rules-path');
    if (customRulesPath) flags.push(`-c="${customRulesPath}"`)

    const disableDocker = core.getInput('disable-docker');
    if (disableDocker) flags.push(`-D="${disableDocker}"`)

    const enableCommitAuthor = core.getInput('enable-commit-author');
    if (enableCommitAuthor) flags.push(`-G="${enableCommitAuthor}"`)

    const enableGitHistory = core.getInput('enable-git-history');
    if (enableGitHistory) flags.push(`--enable-git-history="${enableGitHistory}"`)

    const falsePositive = core.getInput('false-positive');
    if (falsePositive) flags.push(`-F="${falsePositive}"`)

    const filterPath = core.getInput('filter-path');
    if (filterPath) flags.push(`-f="${filterPath}"`)

    const headers = core.getInput('headers');
    if (headers) flags.push(`-headers="${headers}"`)

    const horusecUrl = core.getInput('horusec-url');
    if (horusecUrl) flags.push(`-u="${horusecUrl}"`)

    const ignore = core.getInput('ignore');
    if (ignore) flags.push(`-i="${ignore}"`)

    const ignoreSeverity = core.getInput('ignore-severity');
    if (ignoreSeverity) flags.push(`-s="${ignoreSeverity}"`)

    const informationSeverity = core.getInput('information-severity');
    if (informationSeverity) flags.push(`-I="${informationSeverity}"`)

    const insecureSkipVerify = core.getInput('insecure-skip-verify');
    if (insecureSkipVerify) flags.push(`-S="${insecureSkipVerify}"`)

    const monitorRetryCount = core.getInput('monitor-retry-count');
    if (monitorRetryCount) flags.push(`-m="${monitorRetryCount}"`)

    const repositoryName = core.getInput('repository-name');
    if (repositoryName) flags.push(`-n="${repositoryName}"`)

    const requestTimeout = core.getInput('request-timeout');
    if (requestTimeout) flags.push(`-r="${requestTimeout}"`)

    const returnError = core.getInput('return-error');
    if (returnError) flags.push(`-e="${returnError}"`)

    const riskAccept = core.getInput('risk-accept');
    if (riskAccept) flags.push(`-R="${riskAccept}"`)

    const toolsIgnore = core.getInput('tools-ignore');
    if (toolsIgnore) flags.push(`-T="${toolsIgnore}"`)

    const configFilePath = core.getInput('config-file-path');
    if (configFilePath) flags.push(`--config-file-path="${configFilePath}"`)

    const logLevel = core.getInput('log-level');
    if (logLevel) flags.push(`--log-level="${logLevel}"`)

    const output = './result.json'
    try {
        await exec(`${executable} start ${flags.join(' ')} --json-output-file="${output}" --output-format="json"`)
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
