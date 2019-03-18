EXTRA -- Extended macro preprocessor for EXA development

It's been 8 years since Axiom brought us the first EXA spec, and computers are only
getting more complicated. No longer are EXAs simply for "distributed computing";
they run everything, from games to simulations. Very complicated programs.

Of course, for backwards-compatibility, the spec won't be seeing any updates for a
long time. So, I've taken it upon myself to write a quick preprocessor that gives
EXAs some more macro support. Want to turn magic into science? Define labels in place
of numbers. Need to insert some encoded data? Put raw data into the codebase, and let
macros do the converting for you. Want to include code other people have written?
Save it and import it as a library.

To be most familiar with developers, I've included a syntax that follows Axiom's lead.
Macro instructions follow the @___ pattern, while references look like @{___}.
For the most complicated preprocessing, you actually write routines in a higher-level
language: JavaScript, the same language used in Axiom's VirtualNetwork+.


Quick Reference --
	R	register
	N	number value
	L	label/keyword
	T	text ("string")
	...	EXA code
	//	JavaScript code

COMMANDS:
=========
@REP N
...
@END
	Inherited from Axiom's VM. Repeats the wrapped code N times. Good way to keep
	a register open, or to save cycles. And yes, you can still do @{N,M} inside
	your block of code to insert a number N, increasing by M each iteration.


@NOP N
	Special form of the @REP command, specifically for the NOOP instruction. Inserts
	N NOOPs. Less verbose way of getting those EXA timings just right.


@SLP N
	Special form of the @REP command, specifically for the WAIT instruction. Inserts
	enough WAITs to wait for N IRL seconds.


@DEF L R/N
@{L}
	Assign a value to an arbitrary label (like, a variable name). Every reference
	to @{L} thereafter will be replaced with the corresponding value.


@FNC L
//
@END
@{L,N/T}
	Attach a preprocessing function to an arbitrary label. JavaScript code goes in
	between @FNC L and @END. This function can be called anywhere in the EXA code,
	or other JavaScript code, with @{L}. Number/string arguments may optionally be
	passed, each delimited with a comma. These arguments can be accessed via the
	`arguments[]` pseudoarray in JavaScript. The return value of the function will
	replace the @{L} reference.

	Example:
		@FNC WRITE;(text, repl_label)
		let text = arguments[0];
		let repl = arguments[1];
		let exa_code = "";

		let A = 'A'.charCodeAt(0);
		let zero = '0'.charCodeAt(0);
		for (let i=0; i<text.length; i++) {
			let redshift_chr;
			let chr = text[i];
			let ascii = chr.charCodeAt(0);

			if (/ /.test(chr))
				redshift_chr = 300;
			else if (/[A-Z]/.test(chr))
				redshift_chr = ascii - A + 301;
			else if (/[0-9]/.test(chr))
				redshift_chr = ascii - zero + 327;
			else if (/\./.test(chr))
				redshift_chr = 337;
			else if (/\?/.test(chr))
				redshift_chr = 338;
			else if (/\!/.test(chr))
				redshift_chr = 339;

			exa_code += "COPY " + redshift_chr + " GP\nCOPY " + (i*10) + " GX\nREPL " + repl + "\n";
		}

		return exa_code;
		@END
		
		MARK TEXT_DISPLAY
		  JUMP TEXT_DISPLAY
		@{WRITE,HELLO WORLD!,TEXT_DISPLAY}


@USE T
	Use preprocessor instructions from file T (i.e. include only macros).


@INC T
	Include all of file T into this file (macros and EXA code).
