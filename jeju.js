var hltLock={keyword:false, hundred:false};
var toggleUsed={only:false,onlyNon:false};
var initSty='';
var preText='<div style="white-space: pre-wrap;">';
var subText='</div>';



/*Text box functions 
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

function updateForms(){
        $('#keyVals').html("");
        $('#txtErr').html('');
        $('#kwdButtons').html('');
        $('#enteredTxt').html('');
        $('#srchTxt').show();
        $('#txtHeader').html('Enter text to be searched below.');
        $('#resetButton').hide();
        $('#updateButton').hide();
        $('#updateTxtButton').hide();
        $('#submitButton').show();
        $('#findHundred').hide();
        $('#theTable').html('');
        $('#inst1').show();
        $('#inst2').hide();
        $('#theSty').append('table,th, td {border: 0px}');
        $('#theSty').append('th,td {padding: 0px;}');
        $('#sortBtn').html('Order Entered');
        $('#secondCol').hide();
        document.getElementById('useOnly').checked=false;
        document.getElementById('nonUse').checked=false;
        
        
        toggleUsed.only=false;
        toggleUsed.onlyNon=false;
                
        
        hltLock.hundred=false;
        hltLock.keyword=false;
        
        
    }
     
 
/*General helper functions
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
  
    String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
    }
    
    String.prototype.indexReplace=function(toRep,i,j){
        return this.slice(0,i)+toRep+this.slice(j,);
    }
    
    function wordPlacement(kwd,str){
      var strIndex=Math.min.apply(null,searchAll(kwd,str));
      if (strIndex==Infinity){
          return strIndex;
      }
      str=str.slice(0,strIndex);
      return str.match(/[^a-zA-Z0-9'-@_]\b/g)==null ? 0: str.match(/[^a-zA-Z0-9'-@_]\b/g).length;
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
   
    
/*Main logic functions
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    
    function processForm(sortType=null,toggleType=null){
        var inpObj=document.getElementById('keywordsForm');
        var inpTxt= document.getElementById('srchTxt');
        updateForms();
    
        if(inpObj.checkValidity() == false){
            $('#keyVals').html(inpObj.validationMessage);
        } else if(inpTxt.checkValidity()==false){
            $('#txtErr').html("<span style='color:red;background-color:yellow;'>"+
                    "You have not entered any text to be searched.</span>");
        } else{
            doSearch(inpObj.value,inpTxt.value.trim(),sortType,toggleType);
        
            }  
        }
        
        
    
    function doSearch(kwds,srchTxt,sortType,toggleType){
        var safeTxt=$('<div>').text(srchTxt).html();
        $('#enteredTxt').html(preText+safeTxt+subText);
        srchTxt=srchTxt.replace(/\r?\n/g,' ');
        srchTxt=srchTxt.replace(/\t/g,' ');
        safeTxt=$('<div>').text(srchTxt).html();
        
        var kwds=kwds.replace(/\r?\n/g,',');
        kwds=kwds.split(',');
        
        
        for(i=0; i<kwds.length;i++){
            kwds[i]=kwds[i].trim();
        }
        
        
        kwds=removeAll(kwds,'');
        kwds=onceOnly(kwds);
        
                
        for(i=0; i<kwds.length; i++){
            kwds[i]=$('<div>').text(kwds[i]).html();
        }
        
        kwds=usedProcess(kwds,safeTxt,toggleType);
        kwds=sortOption(kwds,sortType,safeTxt);
        
        if (kwds.length>20){
          $('#keyVals').html('You have entered more than 20 search terms. Using only the'
          +' first 20.');
          }
          
        kwds=kwds.slice(0,20);
        
        
        $('#srchTxt').hide();
        $('#resetButton').show();
        $('#updateButton').show();
        $('#updateTxtButton').show();
        $('#submitButton').hide();
        $('#inst1').hide();
        $('#inst2').show();
        $('#txtHeader').html('Entered text.');
        $('#enteredTxt').html(preText+safeTxt+subText);
        $('#findHundred').show();
        //$('#kwdSort').show();
        $('#theSty').append('table,th, td {border: 1px solid black;}');
        $('#theSty').append('th,td {padding: 15px;}');
        //$('#theTable').show();
        $('#secondCol').show();
        
        $('#theTable').append('<tr><th> Kewyord'+
         '</th><th>Number of Occurrences </th><th> In first 100 words\? </th></tr>');
        
        for (i=0; i<kwds.length;i++){
            $('#theTable').append(prepareString(kwds[i],i,safeTxt));
        }
        $(":button").css("color","black");
        
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
    
    
    
/*Word Highlighting Functionality
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    
     function unhghlght(txt){
        var re=new RegExp('<span style="background-color: #FFFF00">',"g");
        var re2=new RegExp('</span>',"g");
        var re3=new RegExp('<span style="background-color: red">',"g");
        txt=txt.replace(re,'');
        txt=txt.replace(re2,'');
        txt=txt.replace(re3,'');
        $('#enteredTxt').html(txt);
        hltLock.keyword=false;
    }
    
    
    
    function highlight(kwd){
        var butt=document.getElementById(kwd);
        
        unhghlght($('#enteredTxt').html());
    
        if(hltLock.hundred==true){
            hltLock.hundred=false;
            hltHundred();
        }
        
        var txt=$('#enteredTxt').html();
        var indices=searchAll(kwd,txt).sort(function(a, b){return a - b});
        indices=indices.reverse();
        
        if(butt.style.color=="blue" || butt.style.color=="black"){
            
        for (i=0;i<indices.length;i++){
                    var toRep='<span style="background-color: #FFFF00">'
                       +txt.slice(indices[i],indices[i]+kwd.length)+'</span>';
                    txt=txt.indexReplace(toRep,indices[i],indices[i]+kwd.length);
                }
            $('#enteredTxt').html(txt);
            $(":button").css("color","black");
            butt.style.color="red";
            hltLock.keyword=kwd;

        } else if (butt.style.color=='red'){
            butt.style.color="black";
        }
    }
        
    function varHghlght(kwd){
        var butt=document.getElementById(kwd);
        var txt=$('#enteredTxt').html();
        var indices=searchAll(kwd,txt).sort(function(a, b){return a - b});
        indices=indices.reverse();
        
        if( butt.style.color=="black" && hltLock.keyword==false){
            for (i=0;i<indices.length;i++){
            var toRep='<span style="background-color: #FFFF00">'
                       +txt.slice(indices[i],indices[i]+kwd.length)+'</span>';
            txt=txt.indexReplace(toRep,indices[i],indices[i]+kwd.length);
            
            }
        $('#enteredTxt').html(txt);
        butt.style.color="blue";
        }
    }
        
    function var2Hghlght(kwd){
        var butt=document.getElementById(kwd);
        var txt=$('#enteredTxt').html();
        
        if (butt.style.color=="blue") {
            unhghlght(txt);
            butt.style.color="black";
            if(hltLock.hundred==true){
            hltLock.hundred=false;
            hltHundred();
            }
        }
    }
    
    
    function hltHundred(){
      if(hltLock.hundred==true){
        var tempAttr=hltLock.keyword;
        unhghlght($('#enteredTxt').html());
        hltLock.hundred=false;
        
        if (tempAttr!=false){
        document.getElementById(tempAttr).style.color="blue";
        highlight(tempAttr);
        }
    } else {
          
        var re=/[^a-zA-Z0-9'-_A@]\b/g;
        var tempAttr=hltLock.keyword;
        unhghlght($('#enteredTxt').html());
        var str=$('#enteredTxt').html();
        str=str.slice(preText.length,-subText.length);
      
        var indices=[];
        var i=0;
      
        while((match=re.exec(str))!=null && i<=100){
            indices.push(match.index);
            i++;
        }
     
      
      
        if(100<=indices.length){
            if(indices[100]){
            str=str.indexReplace('</span>',indices[100],indices[100]);
            str=str.indexReplace('<span style="background-color: red">',indices[99]+1,indices[99]+1);
            $('#enteredTxt').html(preText+str+subText);
            } else {
                str=str.append('</span>');
                str=str.indexReplace('<span style="background-color: red">',indices[99]+1,indices[99]+1);
                $('#enteredTxt').html(preText+str+subText);
            }
        
        }
        hltLock.hundred=true;
    
        if (tempAttr!=false){
            document.getElementById(tempAttr).style.color="blue";
            highlight(tempAttr);
        }
        }
    }

/*Dropdown Menu Logic
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/    
    
    
    function dropFunc(){
        document.getElementById('myDropdown').classList.toggle("show");
    }
    
    
    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {

            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
                }
            }
        }
    }   

/*Keyphrase Sorting Logic
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/    

    function sortOption(kwds,sortType,srchTxt){
        
        switch(sortType){
            case 1:
                var newKwds=[];
                newKwds.push(kwds[0]);
                
                for(i=1; i<kwds.length;i++){
                    j=0;
                    while(searchAll(kwds[i],srchTxt).length<=searchAll(newKwds[j],srchTxt).length && j<=i){
                        j++;
                    }
                    newKwds.splice(j,0,kwds[i]);
                    
                }
                $('#sortBtn').html('Number of Occurences (Descending)');
                return newKwds;
                break;
            case 2:
                var newKwds=[];
                newKwds.push(kwds[0]);
                
                for(i=1; i<kwds.length;i++){
                    j=0;
                    while(searchAll(kwds[i],srchTxt).length<=searchAll(newKwds[j],srchTxt).length && j<=i){
                        j++;
                    }
                    newKwds.splice(j,0,kwds[i]);
                    
                }
                $('#sortBtn').html('Number of Occurences (Ascending)');
                return newKwds.reverse();
                break;
            case 3:
                $('#sortBtn').html("Alphabetical Order");
                return kwds.sort(function (a, b) {
                    return a.toLowerCase().localeCompare(b.toLowerCase());
                    });
                break;
            default:
                $('#sortBtn').html('Order Entered');
                return kwds;
                
            
        }
    }
    
    function usedProcess(kwds,srchTxt,toggleType){
        
        switch(toggleType){
            case 1:
                var newKwds=[];
                for (i=0;i<kwds.length;i++){
                    if(searchAll(kwds[i],srchTxt).length!=0){
                        newKwds.push(kwds[i]);
                    }                    
                }
                document.getElementById('useOnly').checked=true;
                if(toggleUsed.onlyNon==true){
                    toggleUsed.onlyNon=false;
                }
            
                toggleUsed.only=true;
                return newKwds;
                break;
            case 2:
                var newKwds=[];
                for (i=0;i<kwds.length;i++){
                    if(searchAll(kwds[i],srchTxt).length==0){
                        newKwds.push(kwds[i]);
                    }                    
                }
                document.getElementById('nonUse').checked=true;
                if(toggleUsed.only==true){
                    toggleUsed.only=false;
                }
            
                toggleUsed.onlyNon=true;
                return newKwds;
                break;
            default:
                return kwds;
                break;
        }
    }
/*jQuery logic
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
    
$(document).ready(function(){
       
    
    $('#resetButton').click(function(){
        if ( confirm('This will reset all forms and delete all text.') ){
        $('#keyVals').html('');
        $('#txtErr').html('');
        $('#theTable').html('');
        $('#enteredTxt').html('');
        $('#findHundred').hide();
        $('#srchTxt').show();
        $('#txtHeader').html('Enter text to be searched below.');
        $('#resetButton').hide();
        $('#updateButton').hide();
        $('#updateTxtButton').hide();
        $('#submitButton').show();
        $('#keywordsForm').val('');
        $('#srchTxt').val('');
        $('#theSty').append('table,th, td {border: 0px}');
        $('#theSty').append('th,td {padding: 0px;}');
        $('#inst1').show();
        $('#inst2').hide();
        $('#secondCol').hide();
        $('#sortBtn').html('Order Entered');
        hltLock.hundred=false;
        hltLock.keyword=false;
    }
    });

    
    
/*Miscellaneous Button logic
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
        
    $('#updateButton').click(function() {
        processForm();
        $('html,body').scrollTop(0);
    });
    
    $('#submitButton').click(function() {
        processForm();
        $('html,body').scrollTop(0);
    });
    
    $('#updateTxtButton').click(function(){
        updateForms();
        $('html,body').scrollTop(0);
    });
    
    $('#findHundred').click(function() {
        hltHundred();
    });    
    
    $('#order').click(function(){
      processForm();
      $('html,body').scrollTop(0);  
        
    });
    
    $('#numberDesc').click(function(){
        processForm(1);
        $('html,body').scrollTop(0);  
    });
    
    $('#numberAsc').click(function(){
        processForm(2);
        $('html,body').scrollTop(0);  
    });
    
    $('#abc').click(function(){
        processForm(3);
        $('html,body').scrollTop(0);  
        
    });
    
    $('#useOnly').click(function(){
        
        switch($('#sortBtn').html()){
            case 'Order Entered':
                var sortType=null;
                break;
                
            case 'Number of Occurences (Descending)':
                var sortType=1;
                break;
                
            case 'Number of Occurences (Ascending)':
                var sortType=2;
                break;
                
            case 'Alphabetical Order':
                var sortType=3;
                break;
        }
        
        if (toggleUsed.only==false){
            
            processForm(sortType,1);
            
        } else{
            
            processForm(sortType,null);
            
        }
        
    });
    
    $('#nonUse').click(function(){
        
        switch($('#sortBtn').html()){
            case 'Order Entered':
                var sortType=null;
                break;
                
            case 'Number of Occurences (Descending)':
                var sortType=1;
                break;
                
            case 'Number of Occurences (Ascending)':
                var sortType=2;
                break;
                
            case 'Alphabetical Order':
                var sortType=3;
                break;
        }
        
        if (toggleUsed.onlyNon==false){
            
            processForm(sortType,2);
            
        } else{
            
            processForm(sortType,null);
            
        }
        
    });
        
    });