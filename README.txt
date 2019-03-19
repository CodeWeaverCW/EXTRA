EXTRA -- Extended macro preprocessor for EXA development

It's been 8 years since Axiom brought us the first EXA spec, and computers are only
getting more complicated. No longer are EXAs simply for sysadmins; they run everything,
from games to simulations. Very complicated programs.

Of course, for backwards-compatibility, the spec won't be seeing any updates for a
long time. So, I've taken it upon myself to write a quick preprocessor that gives
EXAs some more macro support. Want to turn magic into science? Define variables in place
of numbers. Need to insert some encoded data? Put raw data into the codebase, and let
macros do the converting for you. Want to include code other people have written?
Save it and import it as a library.

To be most familiar with developers, I've included a syntax that resembles Axiom's.
Macro directives follow the @___ pattern, while interpolations look like @{___}.
For the most complicated preprocessing, you actually write routines in a higher-level
language: JavaScript, the same language used in Axiom's VirtualNetwork+.

--CodeWeaver


Quick Reference --
	R	register
	N	number value
	L	label/keyword
	S	string (text)
	...	EXA code
	//	JavaScript code

COMMANDS:
=========
@JSC
//
@END
	This macro is EXTRA's keystone. Inspired by recent web technologies, your
	JavaScript code goes between these directives and other macros can reference
	it. Variables, functions -- everything gets defined here in pure JavaScript,
	just like the `<script>` tags in hypertext.
	
	You can have mulitple of these blocks in a single file. It may be pertinent
	to define relevant variables etc. next to where they are used.


@{//}
	This macro is essentially a JavaScript `eval()`. You can directly reference
	JavaScript symbols (variables, functions, etc) and their values will be
	interpolated into your EXA code. You can also use more complicated expressions,
	such as arithmetic and conditionals.


@REP N//
...
@END
	Inherited from Axiom's VM. Repeats the wrapped EXA code N times. Good way to
	keep a register open, or to save cycles. And yes, you can still do @{N,M}
	inside your block of code to insert a number N, increasing by M each iteration.
	
	In fact, you can use the new @{//} expression too, and they will be evaluated
	for each repetition. To enable looping over arrays, the local variable `_R`
	counts each repetition, starting from zero.
	
	N -- in @REP N -- can even be a JavaScript expression. It just must return
	a number. (If your expression contains spaces, wrap it in `{}`.)
	
	Example:
		@JSC
		var password = [8,9,3,2,7,1,9,4,9,5,1,2,5,2,6];
		@END
		@REP {password.length}
		COPY @{password[_R]} #AUTH
		@END


NOTE:	For macros with corresponding @END tokens (i.e. @JSC and @REP), you can also
	fit them on a single line, instead, and drop the @END.
	
	Example:
		@JSC var cycles = 10;
		@REP {cycles} NOOP
		; WAITS 10 CYCLES


@USE S
	Use preprocessor instructions from file S (i.e. include only macros). To import
	raw JavaScript modules, you should still use JavaScript's `require()`, but to
	include JavaScript from other EXTRA code, use this directive.


@INC S
	Include all of file S into this file (macros and EXA code). Good way to treat
	other EXA code like libraries.


@TAB N
	For this file's EXA code, convert all tabs to N spaces when preprocessing. A
	warning will be produced if any line exceeds Axiom's length limit (24).
	A value of 0 will remove all indentation.
