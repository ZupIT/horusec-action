'use strict';

const core = require('@actions/core');
const flags = [
    "analysis-timeout",
    "authorization",
    "certificate-path",
    "config-file-path",
    "container-bind-project-path",
    "custom-rules-path",
    "disable-docker",
    "enable-commit-author",
    "enable-git-history",
    "false-positive",
    "filter-path",
    "headers",
    "horusec-url",
    "ignore",
    "ignore-severity",
    "information-severity",
    "insecure-skip-verify",
    "log-level",
    "monitor-retry-count",
    "project-path",
    "repository-name",
    "request-timeout",
    "return-error",
    "risk-accept",
    "tools-ignore",
]

module.exports = class Flags {
    constructor() {
        this.flags = []
        for (let flag of flags) {
            const value = core.getInput(flag);
            if (value) this.flags.push(`--${flag}="${value}"`)
        }
    }

    toString() {
        return this.flags.join(' ');
    }
}