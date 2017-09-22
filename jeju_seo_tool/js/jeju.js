jQuery(function($){
    
(function() {
    tinymce.PluginManager.add( 'keyword_class', 
    function( editor, url ) {
        editor.addButton('keyword_class',{
            title: 'Submit',
            cmd: 'keyword_class',
    });
})();



/*
$(document).ready(function(){
    
	$('#kwds-submit-button').click(process_form());

	
});
*/
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
      if (searchAll(kwd,str)==[]){
          return strIndex;
      }
      str=str.slice(0,strIndex);
      return str.match(/[^a-zA-Z0-9'-@_]\b/g)==
              null ? 0: str.match(/[^a-zA-Z0-9'-@_]\b/g).length;
    }
    
    function searchAll(kwd,str){
        var i=0;
        var strIndices=[];
        var re=new RegExp(kwd,"i");
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
   
    
/*Main logic functions
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    function process_form(sortType=null,toggleType=null){
        var kwds=$('#keywords-form').val();
        //var inp-txt= document.getElementById('srchTxt');
        //updateForms();
        
        var kwds=kwds.replace(/\r?\n/g,',');
        //var safeTxt=$('<div>').text(srchTxt).html();
        kwds=kwds.split(',');
        
        
        for(i=0; i<kwds.length;i++){
            kwds[i]=kwds[i].trim();
        }
        
        
        kwds=removeAll(kwds,'');
        kwds=onceOnly(kwds);
        
                
        for(i=0; i<kwds.length; i++){
            kwds[i]=$('<div>').text(kwds[i]).html();
        }
        
        //kwds=usedProcess(kwds,safeTxt,toggleType);
        //kwds=sortOption(kwds,sortType,safeTxt);
        
        if (kwds.length>20){
            $('#key-vals').html('You have entered more than 20 search terms. '+
            'Using only the first 20.');
        }
          
        kwds=kwds.slice(0,20);
        
        
        //$('#srchTxt').hide();
        //$('#resetButton').show();
        //$('#updateButton').show();
        //$('#updateTxtButton').show();
        //$('#kwds-submit-button').hide();
        //$('#inst1').hide();
        //$('#inst2').show();
        //$('#txtHeader').html('Entered text.');
        //$('#enteredTxt').html(preText+safeTxt+subText);
        //$('#findHundred').show();
        //$('#kwdSort').show();
        //$('#theSty').append('table,th, td {border: 1px solid black;}');
        //$('#theSty').append('th,td {padding: 15px;}');
        //$('#theTable').show();
        //$('#secondCol').show();
        
        $('#the-table').append('<tr><th> Kewyord'+
         '</th></tr>');
        
        for (i=0; i<kwds.length;i++){
            $('#the-table').append(prepareString(kwds[i],i));
        }
        //$(":button").css("color","black");  
    }
    
    function prepareString(kwd,i,str=null){
        i++;
        //var strIndices=searchAll(kwd,str);
        var otpt='<tr><td>'+i+'&nbsp <button type="button" id="'+kwd+'">'
                +kwd+'</button></td>';
        
            /*if(wordPlacement(kwd,str)<100){
                otpt='<tr><td>'+i+'&nbsp <button type="button" id="'+kwd+'" onclick="highlight(\''+kwd+'\')"'
                +'onmouseover="varHghlght(\''+kwd
                +'\')" onmouseout="var2Hghlght(\''+kwd+'\')">'
                +kwd+'</button></td><td>'+searchAll(kwd,str).length+'</td><td>'
               +'&#10003'+'</td></tr>';
            }*/
        
        return otpt;
    }
});