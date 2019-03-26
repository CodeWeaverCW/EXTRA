/*
EXTRA -- Extended macro preprocessor for EXA code
by CodeWeaver
*/

/* Init */
var $R;	// @REP counter variable
// Preprocessor namespace to hide variables from EXA code
const __EXTRA = {
	fs: require('fs'),
	USE: {},
	/* Recursively evaluate @USE macros in this EXA code snippet */
	load: __exa_snippet__ => {
		while (__EXTRA.captures = __EXTRA.regexp.exec(__exa_snippet__)) {

		}
	},
	/* Evaluate all @JSC macros in this EXA code snippet */
	init: __exa_snippet__ => __exa_snippet__.replace(/^\s*@JSC\s*(?:^([^]*?)^\s*@END|(.+)$)/gm, (__$$__, __$1__) => { eval(__$1__); return "" }),
	/* Evaluate @{} macros in this EXA code snippet */
	interpolate: __exa_snippet__ => __exa_snippet__.replace(/(?<!^NOTE\s.*|;.*)@\{(.*)\}/gm, (__$$__, __$1__) => eval(__$1__))
};


/* Process */
// One file at a time (each file more or less represents an EXA)
for (__EXTRA.f=2; __EXTRA.f<process.argv.length; __EXTRA.f++) {
	// Read file
	__EXTRA.exa_code = __EXTRA.fs.readFileSync(process.argv[__EXTRA.f], 'utf8');

	/* Scan entire file for each macro directive, in given order */
	// @INC
	__EXTRA.regexp = /^\s*@INC\s*(?:\{(.+)\}|(\S.*))/m;	// No global flag `g` because we want to start from the top each time
	while (true) {
		// Replace the first occurrence of @INC; the replacement may contain its own @INC directives
		__EXTRA.exa_code_processed = __EXTRA.exa_code.replace(__EXTRA.regexp, (__$$__, __$1__) => __EXTRA.fs.readFileSync(eval(__$1__), 'utf8'));
		
		// If the replacement is the same as the code we started with, we've run out of @INCs; break and proceed
		if (__EXTRA.exa_code_processed == __EXTRA.exa_code)
			break;

		// Go again from the top
		__EXTRA.exa_code = __EXTRA.exa_code_processed;
	};


	// @USE
	__EXTRA.regexp = /^\s@USE\s*(?:\{(.+)\}|(\S.*))/m;	// No global flag `g` because we want to start from the top each time
	__EXTRA.load(__EXTRA.exa_code);


	// @JSC (JavaScript Code)
	__EXTRA.init(__EXTRA.exa_code);


	// @REP (repetitions)
	__EXTRA.regexp = /^\s*@REP\s*(?:\{(.+)\}|(\S+))\s*(?:^([^]*?)^\s*@END|(.+)$)/gm;
	while (__EXTRA.captures = __EXTRA.regexp.exec(__EXTRA.exa_code)) {
		__EXTRA.exa_replace = "";	// The running EXA code body that will replace this macro area
		__EXTRA.count = __EXTRA.captures[0];
		__EXTRA.exa_snippet = __EXTRA.captures[1];

		// Convert Axiom @{N,M} to JavaScript
		__EXTRA.regexp_axiom = /@\{(\d+),(\d+)\}/gm;
		__EXTRA.exa_snippet = __EXTRA.exa_snippet.replace(__EXTRA.regexp_axiom, "@{$R*$2+$1}");

		// Evaluate the code snippet in this @REP block
		for ($R=0; $R<__EXTRA.count; $R++)
			// Aggregate processed code
			__EXTRA.exa_replace += __EXTRA.interpolate(__EXTRA.exa_snippet);

		// Replace this macro segment with the resulting processed code
		__EXTRA.exa_code = __EXTRA.exa_code.replace(__EXTRA.exa_snippet, __EXTRA.exa_replace);
	}
	$R = null;	// Ensure this counter is meaningless garbage outside of @REP loops


	// @{} (interpolations)
	// Interpolations inside @REP blocks are handled separately above
	__EXTRA.exa_code = __EXTRA.interpolate(__EXTRA.exa_code);


	// @TAB (convert tabs to spaces)
	__EXTRA.regexp = /^\s*@TAB\s*(?:\{(.+)\}|(\S+))/gm;
	__EXTRA.exa_code = __EXTRA.exa_code.replace(__EXTRA.regexp, (__$$__, __$1__) => {
		__EXTRA.tab = eval(__$1__);
		return "";
	});
	__EXTRA.regexp = /\t/gm;
	__EXTRA.exa_code = __EXTRA.exa_code.replace(__EXTRA.regexp, " ".repeat(__EXTRA.tab));
}
