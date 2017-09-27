var hltLock = { keyword:false, hundred:false };
var toggleUsed = { only:false, onlyNon:false };

/*General helper functions
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    String.prototype.regexIndexOf = function( regex, startpos) {
    var indexOf = this.substring( startpos || 0).search( regex );
    return ( 0 <= indexOf ) ? ( indexOf + ( startpos || 0 ) ) : indexOf;
    }

    String.prototype.indexReplace=function( toRep, i, j ) {
        return this.slice( 0, i ) + toRep + this.slice( j, );
    }

    function wordPlacement(kwd,str) {
      var strIndex = Math.min.apply( null, searchAll( kwd, str ) );

      if ( Infinity === strIndex ) {
          return strIndex;
      }
      str = str.slice( 0, strIndex );
      return str.match( /[^a-zA-Z0-9'-@_]\b/g ) ===
              null ? 0 : str.match( /[^a-zA-Z0-9'-@_]\b/g ).length;
    }

    function searchAll( kwd, str ) {
        var i = 0;
        var strIndices = [];
        var re = new RegExp( "\\b"+kwd+"\\b","i" );
        while ( i < str.length && str.regexIndexOf( re, i ) >= 0 ) {
            strIndices.push( str.regexIndexOf( re, i ) );
            i = str.regexIndexOf( re, i ) + 1;
        }

        return strIndices;
    }

    function removeAll( array, item ) {
        var newArray = [];
        for ( i = 0; i < array.length; i++ ) {
            if ( array[i] !== item ) {
                newArray.push( array[i] );
            }
        }
        return newArray;
    }

    function onceOnly( array ) {
        var newArray = [];
        for ( i = 0; i < array.length; i++ ) {
            if ( ! newArray.includes( array[i] ) ) {
                newArray.push( array[i] );
            }
        }
        return newArray;
    }

    function doEncode( kwds ) {
        kwds = kwds.replace( /\r?\n/g, ',' );
        kwds = kwds.replace( '<', '&gt;' );
        kwds = kwds.replace( '>', '&lt;' );
        kwds = kwds.replace( '&', '&amp;' );
        return kwds;
    }

/*Highlighting Functions
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    function unHighlight( txt ) {
        var re = new RegExp( '<span style="background-color: #ffff00;"' +
                'data-mce-style="background-color: #ffff00;">', 'g' );
        var re2 = new RegExp( '</span>', 'g' );
        var re3 = new RegExp( '<span style="background-color: red">', 'g' );
        txt = txt.replace( re, '' );
        txt = txt.replace( re2, '' );
        txt = txt.replace( re3, '' );
        tinymce.activeEditor.setContent( txt );
    }

    function clickHighlight( kwd ) {
        var butt = document.getElementById( kwd );


        if ( true === hltLock.hundred ) {
            hltLock.hundred = false;
            //hltHundred();
        }

        
        if( 'blue' === butt.style.color ) {
        	butt.style.color = 'red';
			hltLock.keyword = kwd;


        } else if ( 'red' === butt.style.color ) {
            butt.style.color = 'blue';
			hltLock.keyword = false;


        } else {
			var txt = tinymce.activeEditor.getBody().innerHTML;
			unHighlight( txt );
			txt = tinymce.activeEditor.getBody().innerHTML;
			var indices = searchAll( kwd, txt ).sort( function( a, b ){ return a - b} );
        	indices = indices.reverse();

			for ( i = 0; i < indices.length; i++) {
                    var toRep = '<span style="background-color: #FFFF00">' +
                       txt.slice( indices[i], indices[i] + kwd.length ) + 
                       '</span>';
                    txt = txt.indexReplace( toRep, indices[i], indices[i] + 
                            kwd.length );
                }

            tinymce.activeEditor.setContent( txt );
			if ( false !== hltLock.keyword ) {
            	document.getElementById(hltLock.keyword).style.color = 'black';
			}
            butt.style.color = 'red';
            hltLock.keyword = kwd;
		}

    }


    function onMouseHighlight( kwd ) {
        var butt = document.getElementById( kwd );
        var txt = tinymce.activeEditor.getBody().innerHTML;
        var indices = searchAll( kwd, txt).sort( function( a, b ){ return a - b } );
        indices = indices.reverse();

        if ( false === hltLock.keyword ){
            for ( i = 0; i < indices.length; i++ ) {
            var toRep = '<span style="background-color: #FFFF00">' +
                       txt.slice( indices[i], indices[i] + kwd.length ) +
                       '</span>';
            txt = txt.indexReplace( toRep, indices[i], indices[i] + kwd.length );

            }
        	tinymce.activeEditor.setContent( txt );
        	butt.style.color = 'blue';
        }
    }

    function outMouseHighlight( kwd ) {
        var butt = document.getElementById( kwd );
        var txt = tinymce.activeEditor.getBody().innerHTML;
        
        if ( 'blue' === butt.style.color ) {
            unHighlight( txt );
            butt.style.color = 'black';
            if (true === hltLock.hundred ) {
            	hltLock.hundred = false;
            	//hltHundred();
            }
        }
    }
