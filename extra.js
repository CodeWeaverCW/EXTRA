/*
EXTRA -- Extended macro preprocessor for EXA code
by CodeWeaver
*/

/* Imports */
const fs = require('fs');


/* Process */
// One file at a time (each file more or less represents an EXA)
for (let f=2; f<process.argv.length; f++) {
	let exa_code = fs.readFileSync(process.argv[f], 'utf8');
	let regexp;

	// Scan entire file for each macro directive
	regexp = /@NOP\s+(\d+)/gi;
	exa_code.replace(matches=regexp, "");
}
