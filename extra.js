/*
EXTRA -- Extended macro preprocessor for EXA code
by CodeWeaver
*/

/* Init */
var $R;	// @REP counter variable
// Preprocessor namespace to hide variables from EXA code
const __EXTRA = {
	fs: require('fs'),
	interpolate: () => {
	/* Evaluate @{} macros in this EXA code snippet */
		// Local namespace (this is really ugly, I know)
		const __SNIP = {
			exa_code: __EXTRA.exa_snippet
		};

		// Find and evaluate each uncommented interpolation macro @{}
		__SNIP.regexp = /(?<!^NOTE\s.*|;.*)@\{(.*)\}/gm;
		__SNIP.exa_code.replace(__SNIP.regexp, (__$$__, __$1__) => eval(__$1__));

		// Return processed code
		return __SNIP.exa_code;
	}
};


/* Process */
// One file at a time (each file more or less represents an EXA)
for (__EXTRA.f=2; __EXTRA.f<process.argv.length; __EXTRA.f++) {
	// Read file
	__EXTRA.exa_code = __EXTRA.fs.readFileSync(process.argv[__EXTRA.f], 'utf8');

	/* Scan entire file for each macro directive, in given order */
	// INC


	// USE


	// @JSC (JavaScript Code)
	__EXTRA.regexp = /^\s*@JSC\s*(?:^([^]*?)^\s*@END|(.+)$)/gm;
	__EXTRA.exa_code.replace(__EXTRA.regexp, (__$$__, __$1__) => {
		eval(__$1__);
		return "";
	});

	// @REP (repetitions)
	__EXTRA.regexp = /^\s*@REP\s*(?:\{(.+)\}|(\S+))\s*(?:^([^]*?)^\s*@END|(.+)$)/gm;
	while (__EXTRA.captures = __EXTRA.regexp.exec(__EXTRA.exa_code)) {
		__EXTRA.exa_replace = "";	// The running EXA code body that will replace this macro area
		__EXTRA.count = __EXTRA.captures[0];
		__EXTRA.exa_snippet = __EXTRA.captures[1];

		// Convert Axiom @{N,M} to JavaScript
		__EXTRA.regexp_axiom = /@\{(\d+),(\d+)\}/gm;
		__EXTRA.exa_snippet.replace(__EXTRA.regexp_axiom, "@{$R*$2+$1}");

		// Evaluate the code snippet in this @REP block
		for ($R=0; $R<__EXTRA.count; $R++)
			// Aggregate processed code
			__EXTRA.exa_replace += __EXTRA.interpolate();

		// Replace this macro segment with the resulting processed code
		__EXTRA.exa_code.replace(__EXTRA.exa_snippet, __EXTRA.exa_replace);
	}
	$R = null;	// Ensure this counter is meaningless garbage outside of @REP loops

	// @{} (interpolations)
	// Interpolations inside @REP blocks are handled separately above
	__EXTRA.exa_snippet = __EXTRA.exa_code;
	__EXTRA.exa_code = __EXTRA.interpolate();

	// @TAB (convert tabs to spaces)
	__EXTRA.regexp = /^\s*@TAB\s*(?:\{(.+)\}|(\S+))/gm;
	__EXTRA.exa_code.replace(__EXTRA.regexp, (__$$__, __$1__) => {
		__EXTRA.tab = eval(__$1__);
		return "";
	});
	__EXTRA.regexp = /\t/gm;
	__EXTRA.exa_code.replace(__EXTRA.regexp, " ".repeat(__EXTRA.tab));
}
