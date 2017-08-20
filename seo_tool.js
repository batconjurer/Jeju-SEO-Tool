var hltLock=false;
var initSty='textarea {margin: 0; border-radius: 0; }\
    .backdrop{overflow: auto;}\
    .highlights{white-space:pre-wrap; word-wrap: break-word;}\
     textarea{#444; background-color:transparent;}\
     .highlights{color:transparent;}\
     mark {color:transparent; background-color:#FFFF00}\
     .backdrop{background-color:#fff}';


function updateForms(){
        $('#keyVals').html("");
        $('#txtErr').html('');
        $('#theTable').html('');
        $('#enteredTxt').html('');
        $('#srchTxt').show();
        $('#txtHeader').html('Enter text to be searched below.');
        $('#resetButton').hide();
        $('#updateButton').hide();
        $('#updateTxtButton').hide();
        $('#submitButton').show();
        $('#theSty').html(initSty);
        
    }
    
    function searchAll(kwd,str){
        var i=0;
        var strIndices=[];
        var re=new RegExp(kwd,"i");
        while (i<str.length && str.regexIndexOf(re,i)!=-1){
            strIndices.push(str.regexIndexOf(re,i));
            i=str.regexIndexOf(re,i)+1;
        }
        
        return strIndices;
    }
    
    
    function processForm(txt){
        var inpObj=document.getElementById('keywordsForm');
        var inpTxt= document.getElementById('srchTxt');
        updateForms();
    
        if(inpObj.checkValidity() == false){
            $('#keyVals').html(inpObj.validationMessage);
        } else if(inpTxt.checkValidity()==false){
            $('#txtErr').html("<span style='color:red;background-color:yellow;'>You have not entered any text to be searched.</span>");
        } else{
            doSearch(inpObj.value,inpTxt.value);
        
            }   
        } 
    
    function doSearch(kwds,srchTxt){
        var kwds=kwds.split(/\r?\n/);
         if (kwds.length>20){
          $('#keyVals').html('You have entered more than 20 search terms. Using only the'
          +'first 20.');
        }
        
        kwds=kwds.slice(0,20);
        
        for(i=0; i<kwds.length; i++){
            kwds[i]=$('<div>').text(kwds[i]).html();
        }
        
        var safeTxt=$('<div>').text(srchTxt).html();
        
        $('#srchTxt').hide();
        $('#resetButton').show();
        $('#updateButton').show();
        $('#updateTxtButton').show();
        $('#submitButton').hide();
        $('#txtHeader').html('Entered text.');
        $('#enteredTxt').html('<div style="white-space: pre-wrap;">'+safeTxt+'</div>');
        
        $('#theSty').append('table,th, td {border: 1px solid black;}');
        $('#theSty').append('th,td {padding: 15px;}');
        $('#theTable').append('<tr><th> Kewyord'+
         '</th><th>Number of Occurrences </th><th> In first 100 words\? </th></tr>');
        for (i=0; i<kwds.length;i++){
            $('#theTable').append(prepareString(kwds[i],i,srchTxt));
                    document.getElementById(kwds[i]).style.color="black";
        }
         
        
        
        
    }
    
    String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
    }
    
    
    
    
    
    function prepareString(kwd,i,str){
        var strIndices=searchAll(kwd,str);
        var otpt='<tr><td><button id="'+kwd+'" onclick="highlight(\''+kwd+'\')"'
                +'onmouseover="varHghlght(\''+kwd+
                '\')" onmouseout="var2Hghlght(\''+kwd+'\')">'
                +kwd+'</button></td><td>'+searchAll(kwd,str).length+'</td><td>'
               +'&#10005'+'</td></tr>';
        for (i=0;i<strIndices.length;i++){
            if(strIndices[i]<100){
                otpt='<tr><td><button id="'+kwd+'" onclick="highlight(\''+kwd+'\')"'
                +'onmouseover="varHghlght(\''+kwd
                +'\')" onmouseout="var2Hghlght(\''+kwd+'\')">'
                +kwd+'</button></td><td>'+searchAll(kwd,str).length+'</td><td>'
               +'&#10003'+'</td></tr>';
            }
            }
        return otpt;
    }
    
    String.prototype.indexReplace=function(toRep,i,j){
        return this.slice(0,i)+toRep+this.slice(j,);
    }
    
    
     function unhghlght(txt){
        var re=new RegExp('<span style="background-color: #FFFF00">',"g");
        var re2=new RegExp('<span style="background-color: #FFFF00">',"g");
        txt=txt.replace(re,'');
        txt=txt.replace(re2,'');
        $('#enteredTxt').html(txt);
        hltLock=false;
    }
    
    function highlight(kwd){
        var butt=document.getElementById(kwd);
        var txt=$('#enteredTxt').html();
        var indices=searchAll(kwd,txt).sort(function(a, b){return a - b});
        indices=indices.reverse();
        
        
        if(butt.style.color=="blue"){
            if (hltLock==true){
                unhghlght(txt);
                for (i=0;i<indices.length;i++){
                var toRep='<span style="background-color: #FFFF00">'
                       +txt.slice(indices[i],indices[i]+kwd.length)+'</span>';
                txt=txt.indexReplace(toRep,indices[i],indices[i]+kwd.length);
                $('#enteredTxt').html(txt);
                
            }
        }
            butt.style.color="red";
            hltLock=true;
        
        } else if (butt.style.color=="red") {
            unhghlght(txt);
            butt.style.color="black";
        }
    }

    function varHghlght(kwd){
        var butt=document.getElementById(kwd);
        var txt=$('#enteredTxt').html();
        var indices=searchAll(kwd,txt).sort(function(a, b){return a - b});
        indices=indices.reverse();
        
        if( butt.style.color=="black" && hltLock==false){
            for (i=0;i<indices.length;i++){
            var toRep='<span style="background-color: #FFFF00">'
                       +txt.slice(indices[i],indices[i]+kwd.length)+'</span>';
            txt=txt.indexReplace(toRep,indices[i],indices[i]+kwd.length);
            $('#enteredTxt').html(txt);
            butt.style.color="blue";
        }
        }
    }
        
    function var2Hghlght(kwd){
        var butt=document.getElementById(kwd);
        var txt=$('#enteredTxt').html();
        
        if (butt.style.color=="blue") {
            unhghlght(txt);
            butt.style.color="black";
        }
    }
    
$(document).ready(function(){
        
    
        
    /*    $("#srchTxt").on({
        'input':handleInput,
        'scroll':handleScroll
        });
    
    
    function handleInput(){
        var text=document.getElementById('srchTxt').value;
        var highlightedText = applyHighlights(text);
        $highlights.html(highlightedText);
    }
    
    function applyHighlights(text){
        return text
                .replace(/\n$/g,'\n\n')
                .replace(/[A-Z].*?\b/g,'<mark>$&</mark>');
    }
    
    function handleScroll(){
        var scrollTop= document.getElementById('srchTxt').scrollTop;
        $(backdrop).scrollTop(scrollTop);
    }*/
    
    $('#resetButton').click(function(){
        if ( confirm('This will reset all forms and delete all text.') ){
        $('#keyVals').html('');
        $('#txtErr').html('');
        $('#theTable').html('');
        $('#enteredTxt').html('');
        $('#srchTxt').style.visibility='visible';
        $('#txtHeader').html('Enter text to be searched below.');
        $('#resetButton').hide();
        $('#updateButton').hide();
        $('#updateTxtButton').hide();
        $('#submitButton').show();
        $('#keywordsForm').value='';
        $('#srchTxt').val('');
        $('#theSty').html(initSty);
    }
    });
    
   
    
    //Miscellaneous Button logic
    
    $('#updateButton').click(function() {
        processForm();
    });
    
    $('#submitButton').click(function() {
        processForm();
    });
    
    $('#updateTxtButton').click(function(){
        updateForms();
    });
    
    });