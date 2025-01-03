// Utils

const requireFilesFromUpload = (element, requiredFiles) => new Promise((resolve, reject) => {
    element.addEventListener("change", () => {
        const uploads = Array.from(input.files);

        const promises = requiredFiles.map(name => {
            const file = uploads.find(f => f.name === name);

            if (!file) alert('Could not find file ' + name)

            return file.text().then(text =>
                [name.match(/^[^.]*/), text]
            );
        });

        Promise.all(promises).then(values => resolve(
            Object.fromEntries(values)
        ));
    });
});

const downloadFile = (fileName, content) => {
    const blob = new Blob([content], { type: 'text/plain' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const parseCsv = (text, asObj) => {
    const rows = text.split('\n')
        .filter(row => !!row)
        .map(row => row.split(',').map(col => col.trim()));

    if (asObj) {
        const [header, ...values] = rows;

        return values.map(row => Object.fromEntries(header.map((key, i) => [key, row[i]])));
    }

    return rows;
};

const replaceTemplateStrings = (input, obj, prefix = '') => Object.entries(obj).reduce(
    (acc, [key, value]) => acc.replaceAll(`{ ${prefix}${key} }`, value),
    input,
);

//

const requiredFiles = ['config.csv', 'entries.csv', 'templateBase.xml', 'templateContent.xml'];
const input = document.getElementById("input");

const files = await requireFilesFromUpload(input, requiredFiles);

//

const config = Object.fromEntries( parseCsv(files.config, false) );
const entriesRaw = parseCsv(files.entries, true);

const entriesSummed = entriesRaw.reduce(
  (acc, { pin, amount }) => ({ ...acc, [pin]: parseInt(amount) + (acc[pin] ?? 0)}),
  {},
);

const entries = Object.entries(entriesSummed).map(([pin, amount]) => ({ pin, amount }));

const baseWithConfig = replaceTemplateStrings(files.templateBase, config, 'config.');
const contentWithConfig = replaceTemplateStrings(files.templateContent, config, 'config.');

//

const createdAt = new Date().toISOString();

const output = replaceTemplateStrings(baseWithConfig, {
    createdAt,
    content: entries.map((el, index) => replaceTemplateStrings(
        contentWithConfig,
        { ...el, index: index + 1 },
    )).join('\n'),
}, '');

downloadFile(createdAt.replace(/[:.]/g, '-') + '.xml', output);
