'use strict';

/*exported buildBlockQuotes */

function buildBlockQuotes(text){
    var newOutput = text.replace('<p>', '<p><blockquote>').replace('</p>', '</blockquote></p>');
    var newPBQ = document.createElement('div');
    newPBQ.className='dom-cnt-edtbl';
    if(newOutput.length === 0){
        newPBQ.innerHTML = text;
    }else{
        newPBQ.innerHTML = newOutput;
    }
    return newPBQ;
}
