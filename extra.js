/*
EXTRA -- Extended macro preprocessor for EXA code
by CodeWeaver
*/

/* Imports */
const fs = require('fs');


/* Process */
function interpolate_snippet(exa_code) {

}

// One file at a time (each file more or less represents an EXA)
for (let f=2; f<process.argv.length; f++) {
	let exa_code = fs.readFileSync(process.argv[f], 'utf8');
	let regexp;
	let captures;

	/* Scan entire file for each macro directive, in given order */
	// JSC (JavaScript Code)
	regexp = /^@JSC\s*(?:^([^]*?)^@END|(.+)$)/gm;
	while (captures = regexp.exec(exa_code))
		eval(captures[0]);

	// REP (repetitions)
	regexp = /^@REP\s*(?:\{(.+)\}|(\S+))\s*(?:^([^]*?)^@END|(.+)$)/gm;
	while (captures = regexp.exec(exa_code)) {
		//
	}
}
