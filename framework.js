const fs = require('fs')

const args = process.argv.slice(2);
if (args[0] === 'create' && args[1] === 'page' && args[2]) {
	const path = `./pages/${args[2].toLowerCase()}/`;
	if (!fs.existsSync(path)) fs.mkdirSync(path);
	[`${args[2].toLowerCase()}.js`, `${args[2].toLowerCase()}.scss`].forEach(file => {
		fs.writeFileSync(`${path}${file}`, '');
	});

	fs.writeFileSync(`${path}config.json`, `{
	"name": "${args[2]}",
	"menu": [],
	"transitionIn": "",
	"transitionInDuration": "",
	"transitionOut": "",
	"transitionOutDuration": ""
}`);

	fs.writeFileSync(`${path}${args[2].toLowerCase()}.html`, `<p>This is ${args[2]}</p>`);
}


