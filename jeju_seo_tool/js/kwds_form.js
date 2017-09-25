jQuery(function($){

(function() {
    tinymce.PluginManager.add( 'keyword_button', 
    function( editor, url ) {
        editor.addButton('keyword_button',{
            text: 'Jeju: Insert Keyword',
            icon: false,
            onclick: function() {
				//alert(editor.getContent({format:'numeric'}).slice(3,-4).trim());
                processForm(editor.getContent().slice(3,-4).trim());
			}
    	});
	});
})();

	function updateForms(){
        	$('#error-message').html('');
        	$('#the-table').html('')
    }

/*General helper functions
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
  
    String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
    }
    
    String.prototype.indexReplace=function(toRep,i,j){
        return this.slice(0,i)+toRep+this.slice(j,);
    }
    
    function wordPlacement(kwd,str){
      var strIndex=Math.min.apply(null,searchAll(kwd,str));

      if (strIndex == Infinity){
          return strIndex;
      }
      str=str.slice(0,strIndex);
      return str.match(/[^a-zA-Z0-9'-@_]\b/g)==
              null ? 0: str.match(/[^a-zA-Z0-9'-@_]\b/g).length;
    }
    
    function searchAll(kwd,str){
        var i=0;
        var strIndices=[];
        var re=new RegExp("\\b"+kwd+"\\b","i");
        while (i<str.length && str.regexIndexOf(re,i)>=0){
            strIndices.push(str.regexIndexOf(re,i));
            i=str.regexIndexOf(re,i)+1;
        }
        
        return strIndices;
    }
    
    function removeAll(array,item){
        var newArray=[];
        for(i=0;i<array.length;i++){
            if(array[i]!=item){
                newArray.push(array[i]);
            }
        }
        return newArray;
    }
    
    function onceOnly(array){
        var newArray=[];
        for(i=0; i<array.length;i++){
            if(!newArray.includes(array[i])){
                newArray.push(array[i]);
            }
        }
        return newArray;
    }

    function doEncode(kwds){
	kwds=kwds.replace(/\r?\n/g,',');
	kwds=kwds.replace('<','&gt;');
	kwds=kwds.replace('>','&lt;');
	kwds=kwds.replace('&','&amp;');
        return kwds;
    }
   
    
/*Main logic functions
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
	
    function processForm(srchTxt,sortType=null,toggleType=null){
        updateForms();
        var kwds=$('#keywords-form').val();
		
		
        kwds=doEncode(kwds);
        
        kwds=kwds.split(',');
        
        
        for(i=0; i<kwds.length;i++){
            kwds[i]=kwds[i].trim();
        }
        
        
        kwds=removeAll(kwds,'');
        kwds=onceOnly(kwds);
        

	if (kwds=='') {
            $('#error-message').html("<span style='color:red;background-color:yellow;'>"+
            "You have not entered any keywords to be searched.</span>");
            } else if (srchTxt=='') {
            $('#error-message').html("<span style='color:red;background-color:yellow;'>"+
            "You have not entered any text to be searched.</span>");
            } else {
                doSearch(kwds,srchTxt,sortType, toggleType);
            }
    }

    function doSearch(kwds,srchTxt,sortType,toggleType){
		
	var safeTxt=srchTxt.replace(/<\/?p>/g,' ');
	safeTxt=$('<div>').text(srchTxt).html();
	

	for(i=0; i<kwds.length; i++){
            kwds[i]=$('<div>').text(kwds[i]).html();
        }

        //kwds=usedProcess(kwds,srchTxt,toggleType);
        //kwds=sortOption(kwds,sortType,srchTxt);
        
        if (kwds.length>20){
            $('#key-vals').html('You have entered more than 20 search terms. '+
            'Using only the first 20.');
        }
          
        kwds=kwds.slice(0,20);
		
        
        
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
        
        $('#the-table').append('<tr><th style="border: 1px solid black; padding: 15px;"> Keyword'+
		'</th><th style="border: 1px solid black; padding: 15px;">Number of Occurrences </th>'
		+'<th style="border: 1px solid black; padding: 15px;"> In first 100 words\? </th></tr>');
        
        for (i=0; i<kwds.length;i++){
            $('#the-table').append(prepareString(kwds[i],i,safeTxt));
        }
        //$(":button").css("color","black");  
    }
    
    function prepareString(kwd,i,str){
        i++;
        
        if(wordPlacement(kwd,str)<100){
            var otpt='<tr><td style="border: 1px solid black; padding: 15px;">'+i+'&nbsp'+
                ' <button type="button" id="'+kwd+'">'+kwd+'</button></td><td style='
                +'"border: 1px solid black; padding: 15px;">'+searchAll(kwd,str).length+'</td>'
                +'<td style="border: 1px solid black; padding: 15px;">&#10003'+'</td></tr>';
        } else {
            var otpt='<tr><td style="border: 1px solid black; padding: 15px;">'+i+'&nbsp' 
            +'<button type="button" id="'+kwd+'">'+kwd+'</button></td><td style='
            +'"border: 1px solid black; padding: 15px;">'+ searchAll(kwd,str).length+'</td>'
            +'<td style="border: 1px solid black; padding: 15px;"> &#10005 </td></tr>';
	}
        
        return otpt;
    }
    
    
});