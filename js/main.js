var GAME = {};

GAME.fetchPi = function( obj ) {
	GAME.pi.push( obj["pi_content"] );
};

GAME.fetch = function() {
	docs = document.createElement( "script" );
	docs.src = "http://assets.piday.org/apps/million/fetch.php?callback=GAME.fetchPi&page=" +
		GAME.page++;
	document.body.appendChild( docs );
}

GAME.init = function() {
	GAME.page = 1;
	GAME.fetch();
	GAME.digits = 0;

	GAME.spn1 = document.createElement( "span" );
	document.body.appendChild( GAME.spn1 );

	GAME.spn2 = document.createElement( "span" );
	document.body.appendChild( GAME.spn2 );

	GAME.div = document.createElement( "div" );
	document.body.appendChild( GAME.div );

	GAME.in = document.createElement( "input" );
	document.body.appendChild( GAME.in );

	GAME.btn = document.createElement( "button" );
	document.body.appendChild( GAME.btn );

	GAME.txt = "3.1";
	GAME.chgTxt( 4 );

	GAME.in.type = "text";
	GAME.in.size = "2";

	GAME.btn.innerHTML = "Validate";

	GAME.in.oninput = function() {
		GAME.chgTxt( GAME.in.value );
	};

	GAME.btn.onclick = function() {
		var test = GAME.txt.split( "" )
		.map( function( elem, indx ) {
			var w = parseInt( indx / 1000 ),
				r = indx % 1000,
				diff = ( "" + elem ).charCodeAt( 0 ) - GAME.pi[w].charCodeAt( r );
			return diff;
		} ).map( Math.abs );

		GAME.digits = Number( GAME.spn1.innerHTML );
		for ( var i = 0; i < test.length; i++ ) {
			if ( test[i] != 0 ) {
				GAME.digits = GAME.txt.slice( 0, i ).replace( /[.]/g, "" ).length;
				break;
			}
		}

		GAME.vald();
	};
};

GAME.chgTxt = function( num ) {
	var str = ( num || "" ).toString();
	if ( str.length > 0 ) {
		GAME.txt += str.replace( /[^0-9.]/g, "" );
	} else {
		GAME.txt = GAME.txt.slice( 0, -1 );
	}

	var len = GAME.txt.replace( /[.]/g, "" ).length;

	if ( GAME.digits ) {
		if ( len > GAME.digits ) {
			GAME.txt = GAME.txt.slice( 0, GAME.digits - len );
		}
	}
	len = GAME.txt.replace( /[.]/g, "" ).length
	GAME.div.innerHTML = GAME.txt.substring( max( len - 10, 0 ) );
	GAME.spn1.innerHTML = len;
	GAME.in.value = " ";
};

GAME.pi = [];

GAME.getPi = function( indx ) {
	var w = parseInt( indx / 1000 ),
		r = indx % 1000;
	return GAME.pi[w][r]
}

GAME.vald = function() {
	GAME.in.style.display = "none";
	GAME.btn.innerHTML = "Continue";
	GAME.btn.onclick = function() {
		GAME.spn2.innerHTML = " ~ " + GAME.digits;
		GAME.btn.innerHTML = "Validate";
		GAME.in.style.display = "inline-block";

		GAME.txt = "3";
		GAME.chgTxt();

		GAME.btn.onclick = GAME.vald;
	};

	var test = GAME.txt.split( "" )
	.map( function( elem, indx ) {
		var diff = ( "" + elem ).charCodeAt( 0 ) - GAME.getPi( indx ).charCodeAt( 0 );
		return diff;
	} ).map( Math.abs ),
		errors = [];

	GAME.div.innerHTML = "";
	for ( var i = 0; i < test.length; i++ ) {
		var color = "lightgreen";
		if ( test[i] != 0 ) {
			color = "red";
			errors.push( i );
		}

		GAME.div.innerHTML += "<a style='color:" +
			color + "'>" + GAME.txt[i] + "</a>";
	}

	if ( errors.length > 0 ) {
		errors = errors.map( function( elem ) {
			return [ GAME.txt[elem], GAME.getPi( elem ) ];
		} );
		GAME.div.innerHTML += "<br>" + JSON.stringify( errors );

		GAME.btn.innerHTML = "Reset";
	} else {
		GAME.div.innerHTML += "<br>Next digit: " + GAME.getPi( ++GAME.digits );
	}
};

GAME.init();
