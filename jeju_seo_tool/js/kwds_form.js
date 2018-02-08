jQuery(function($) {

(function() {
    tinymce.PluginManager.add( 'toggle_jeju_button',
    function( editor, url ) {
        editor.addButton ( 'toggle_jeju_button', {
            text: 'Show Jeju Tools',
            icon: false,
            onclick: function(){
                $('#keywords-form').hide()
            }
        });
    });
 })(); 

(function() {
    tinymce.PluginManager.add( 'keyword_button', 
    function( editor, url ) {
        editor.addButton( 'keyword_button', {
            text: 'Jeju: Insert Keyword',
            icon: false,
            onclick: function() {
                processForm( editor.getContent().slice( 3, -4).trim());
			}
    	});
	});
})();

	function updateForms() {
        	$('#error-message').html('');
			for ( i = 0; 2 > i ; i++ ) {
        		document.getElementById( 'the-table-'+i ).innerHTML='';
			}
    }

/*Main logic functions
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    function processForm( srchTxt, sortType=null, toggleType=null ) {
        updateForms();
        var kwds = $('#keywords-form').val();

        kwds = doEncode( kwds );

        kwds = kwds.split(',');


        for ( i = 0; i < kwds.length; i++ ) {
            kwds[i] = kwds[i].trim();
        }


        kwds = removeAll( kwds, '' );
        kwds = onceOnly( kwds );


	if ( '' === kwds ) {
            $('#error-message').html(
                "<span style='color:red;background-color:yellow;'>" +
                "You have not entered any keywords to be searched.</span>");
            } else if ( '' === srchTxt ) {
            $('#error-message').html(
                "<span style='color:red;background-color:yellow;'>" +
                "You have not entered any text to be searched.</span>");
            } else {
                doSearch( kwds, srchTxt, sortType, toggleType );
            }
    }

    function doSearch( kwds, srchTxt, sortType, toggleType ) {

	var safeTxt = srchTxt.replace( /<\/?p>/g, ' ' );
	safeTxt = $('<div>').text(srchTxt).html();


	for ( i = 0; i < kwds.length; i++ ) {
            kwds[i] = $('<div>').text( kwds[i] ).html();
        }

        //kwds=usedProcess(kwds,srchTxt,toggleType);
        //kwds=sortOption(kwds,sortType,srchTxt);

        if ( 20 < kwds.length ) {
            $('#key-vals').html('You have entered more than 20 search terms.' +
            'Using only the first 20.');
        }

        kwds = kwds.slice( 0, 20 );



        //$('#resetButton').show();
        //$('#updateButton').show();
        //$('#updateTxtButton').show();
        //$('#kwds-submit-button').hide();
        //$('#inst1').hide();
        //$('#inst2').show();
        //$('#findHundred').show();
        //$('#kwdSort').show();
        //$('#theSty').append('table,th, td {border: 1px solid black;}');
        //$('#theSty').append('th,td {padding: 15px;}');
        //$('#theTable').show();
        //$('#secondCol').show();

        var tableNewColumn = '<tr><th style=' +
                '"border: 1px solid black; padding: 15px;"> Keyword' +
                '</th><th style="border: 1px solid black; padding: 15px;">' +
                'Number of Occurrences </th><th style=' +
                '"border: 1px solid black; padding: 15px;">' + 
                'In first 100 words\? </th></tr>';

        for ( i = 0; i < kwds.length; i++ ) {
			var whichTable = 'the-table-' + Math.floor( i / 10 );
			if ( 0 === ( i % 10 ) ) {
				document.getElementById( whichTable ).innerHTML += tableNewColumn;
			}
            document.getElementById( whichTable ).innerHTML += prepareString( kwds[i], i, safeTxt );
        }

    }

    function prepareString( kwd, i, str ) {
        i++;

        if ( 100 > wordPlacement( kwd, str ) ) {
            var otpt = '<tr><td style="border: 1px solid black; padding: 15px;">' +
                i + '&nbsp' + ' <button type="button" id="'+kwd+'"onclick=' +
                '"clickHighlight(\''+kwd+'\')"'+'onmouseover="onMouseHighlight(\'' +
                kwd + '\')" onmouseout="outMouseHighlight(\'' + kwd + '\')">' +
                kwd + '</button></td><td style=' +
                '"border: 1px solid black; padding: 15px;">' +
                searchAll(kwd,str).length + '</td><td style=' +
                '"border: 1px solid black;padding: 15px;">&#10003' + '</td></tr>';
        } else {
            var otpt = '<tr><td style="border: 1px solid black; padding: 15px;">' +
                i + '&nbsp' + ' <button type="button" id="'+kwd+'"onclick=' +
                '"clickHighlight(\''+kwd+'\')"'+'onmouseover="onMouseHighlight(\'' +
                kwd + '\')" onmouseout="outMouseHighlight(\'' + kwd + '\')">' +
                kwd + '</button></td><td style=' +
                '"border: 1px solid black; padding: 15px;">' +
                searchAll(kwd,str).length + '</td><td style=' +
                '"border: 1px solid black;padding: 15px;">&#10005' + '</td></tr>';
        }

        return otpt;
    }
});
