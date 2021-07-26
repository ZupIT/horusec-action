function convert({analysisVulnerabilities: analysis}) {
    const diagnostics = analysis
        .map(({vulnerabilities}) => vulnerabilities)
        .flat()
        .map(({details, file, line, column, severity}) => {
            const vulnerability = {message: details, severity: severity};
            if (file) vulnerability.location = {
                path: file,
                range: {start: {line: parseInt(line), column: parseInt(column)}}
            }
            return vulnerability
        })
    return {source: {name: 'Horusec', url: 'https://horusec.io/'}, diagnostics}
}

module.exports = {convert}