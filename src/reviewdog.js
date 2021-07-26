function convert({analysisVulnerabilities: analysis}) {
    const diagnostics = analysis
        .map(({vulnerabilities}) => vulnerabilities)
        .flat()
        .filter(({file}) => file)
        .map(({details, file, line, column}) => {
            return {
                message: details,
                location: {
                    path: file,
                    range: {start: {line: parseInt(line), column: parseInt(column)}}
                },
            };
        })
    return {source: {name: 'Horusec', url: 'https://horusec.io/'}, diagnostics}
}

module.exports = {convert}