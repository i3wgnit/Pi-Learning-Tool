var GAME = {};

GAME.fetchPi = function( obj ) {
	GAME.pi.push( obj["pi_content"] );
};

GAME.init = function() {
	GAME.txt = document.createElement( "div" );
	document.body.appendChild( GAME.txt );

	GAME.in = document.createElement( "input" );
	GAME.in.type = "number";
	GAME.in.value = 3.14;
	document.body.appendChild( GAME.in );

	GAME.spn = document.createElement( "span" );
	document.body.appendChild( GAME.spn );

	GAME.in.onkeyup = function() {
		GAME.txt.innerHTML = GAME.in.value;
		GAME.spn.innerHTML = GAME.in.value.replace( ".", "" ).length;
	};

	GAME.in.onchange;
};

GAME.pi = [];

GAME.vald = function() {

}

GAME.init();
