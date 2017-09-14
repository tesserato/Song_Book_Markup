var startchar = '|';
var titlechar = '!';
var activesong = null;
var sourceel = null; //source of the drag event
var prettymode = false;

var input = document.createElement('span');
input.setAttribute('class' , 'lyrics');
input.setAttribute('contenteditable' , 'true');
input.setAttribute('onfocus' , 'enter(this)');
input.setAttribute('onblur' , 'exit(this)');

input.setAttribute('onkeyup' , 'realtime(this , event)');
input.setAttribute('onkeydown' , 'realtime(this , event)');

input.setAttribute('plaintext' , '');
input.textContent = 'placeholder';
input.setAttribute('draggable' , 'true');
input.setAttribute('ondrop' , 'drop(this , event)');
input.setAttribute('ondragover' , 'allowDrop(this , event)');
input.setAttribute('ondragstart' , 'drag(this , event)');


var song = document.createElement('div');
song.setAttribute('class' , 'song');
song.setAttribute('onmouseover' , 'select(this)');
// song.setAttribute('tabindex' , '0');
song.setAttribute('draggable' , 'true'); //drag
song.setAttribute('ondrop' , 'drop(this , event)');
song.setAttribute('ondragover' , 'allowDrop(this , event)');
song.setAttribute('ondragstart' , 'drag(this , event)');


//  |Bm      |D        |F#m           |G(9)

function realtime (el , ev) { 
    // console.log(ev.key)
    // var lastchild = activesong.lastElementChild
    var text = el.textContent; 
    var lstcrb = activesong.lastElementChild.offsetLeft + activesong.lastElementChild.offsetWidth
    var songrb = activesong.offsetLeft + activesong.offsetWidth
    var allowedkeys = ['Delete' , 'Backspace' , 'ArrowRight' , 'ArrowLeft' , 'Tab' ,'ArrowDown','ArrowUp' ]

    if (lstcrb >= songrb && !allowedkeys.includes(ev.key)) {
        ev.preventDefault()
        return
    }     
       
    if (text.includes(titlechar)){
        el.setAttribute('class', 'title');
        // createnewsong() olhar isso depois
    }
    else if (text.includes(startchar)){
        el.setAttribute('class', 'chords');
        if (ev.type == 'keydown' && ev.ctrlKey && (ev.key == 'ArrowLeft' || ev.key == 'ArrowRight')) {
            ev.preventDefault();
            watchchords(el , ev);
        }
    }
    else {
        el.setAttribute('class', 'lyrics');
    }
}   

function watchchords(el , ev) {
    var arraytext = Array.from(el.textContent);
    var caret = document.getSelection().anchorOffset
    var [chords , starts , ends] = chordsandpositions(el.textContent);        
//    console.log(':',caret , starts , ends)
    
    if (ev.key == 'ArrowRight') {
        // ev.preventDefault()
//        console.log('>:',caret , starts , ends)
        for (i = 0 ; i <= chords.length ; i++) {
            if (starts[i] -1 <= caret && caret <= ends[i] + 1) {
                if (ends[i] < starts[i + 1] - 3  || ends[i] == ends[chords.length - 1] ) {  
                    caret++  
                    arraytext.splice(ends[i] + 1 , 1 , '');
                    arraytext.splice(starts[i] - 1 , 0 , ' ');
                }             
            }
        }
    }
    if (ev.key == 'ArrowLeft') {
//        console.log('<:',caret , starts , ends)
        // ev.preventDefault()
        for (i = 0 ; i <= chords.length ; i++) {
            if (starts[i] -1 <= caret  && caret <= ends[i]+1 ) {
                if ((starts[i] > ends[i - 1] + 3 || starts[i] == starts[0]) && starts[i] > 1 ) { 
                    caret--
                    arraytext.splice(starts[i] - 2 , 1 , '');
                    arraytext.splice(ends[i] + 1 , 0 , ' ');
                }               
            }
        }
    }   
    el.textContent = arraytext.join('').trimRight();   
    
    el.focus();
    var range = document.createRange();
    range.setStart(el.firstChild, caret);
    range.setEnd(el.firstChild, caret);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

function select(el) {
    // console.log('hover')
    activesong = el;
    // el.focus();
}

function globalkeypresses(ev) {

    if (ev.key == 'Escape') {
//        console.log('p')
        document.activeElement.blur()
//        ev.preventDefault();
        
        
        if(!prettymode) {

            prettymode = true
            var bar = document.getElementById('bar')
            bar.style.visibility = 'hidden'   
             

            pretty = document.createElement('div')
            pretty.setAttribute('id' , 'pretty')
            var images = []
            var imagesouterHTML = []
                        
            for (var sng of document.getElementsByClassName('song')) {                                   
                var d = sng.cloneNode(true)
                sng.style.visibility = 'hidden'
                var potentialimages = []
                potentialimages = sng.getElementsByTagName('IMG')

                for (var im of potentialimages) {
                    if (!imagesouterHTML.includes(im.outerHTML)){
                        images.push(im.cloneNode(true))
                        imagesouterHTML.push(im.outerHTML)
                    }
                }                
                // console.log(imagesouterHTML)
                d.removeAttribute('onmouseover')
                d.removeAttribute('draggable')
                d.removeAttribute('ondrop')
                d.removeAttribute('ondragover')
                d.removeAttribute('ondragstart')
                pretty.appendChild(d)

                for (var ipt of d.childNodes) {
                    ipt.removeAttribute('contenteditable')
                    ipt.removeAttribute('draggable')
                    ipt.removeAttribute('ondrop')
                    ipt.removeAttribute('ondragover')
                    ipt.removeAttribute('ondragstart')
                    ipt.removeAttribute('onkeyup')
                    ipt.removeAttribute('onkeydown')
                    ipt.removeAttribute('onmouseup')
                    ipt.removeAttribute('onblur')
                    ipt.removeAttribute('plaintext')
                } 
                imdiv = document.createElement('div')
                imdiv.setAttribute('class' , 'imdiv')
                for(var im of images){
                    im.setAttribute('class' , 'prettyimage')
                    imdiv.appendChild(im)
                }
                d.appendChild(imdiv)
            }
            document.body.appendChild(pretty)
        }
        else {
            prettymode = false
            document.getElementById('bar').style.visibility = 'visible'
            pretty = document.getElementById('pretty');
            pretty.parentNode.removeChild(pretty)

            for (var sng of document.getElementsByClassName('song')) {  
                sng.style.visibility = 'visible'
            }
        }
        
    }
    
    if (ev.key == 'Enter') {
        ev.preventDefault();

        if (ev.ctrlKey) {
            activesong = createnewsong(activesong.nextElementSibling)
            activesong.firstChild.focus()
            return
        }

        newinput = document.importNode(input , true)        

        if (ev.target.tagName == 'SPAN') {
            
            if (ev.shiftKey){
                ev.target.parentNode.insertBefore(newinput , ev.target);
            }
            else if (ev.altKey){
                ev.target.parentNode.insertBefore(ev.target.cloneNode(true) , ev.target);
            }
            else {
                ev.target.parentNode.insertBefore(newinput , ev.target.nextSibling);
            }
            
        }
        else {
            activesong.appendChild(newinput);
            // newinput.focus()    
        }
        newinput.focus()
        var eleRborder = activesong.lastChild.offsetLeft + activesong.lastChild.offsetWidth;
        var parRborder = activesong.offsetLeft + activesong.offsetWidth;

        // console.log(eleRborder)
        // console.log(parRborder)

        if (eleRborder >= parRborder) {
            ns = createnewsong(activesong.nextElementSibling);
            activesong.removeChild(activesong.lastChild);
            activesong = ns;
            return;
        }
    }  
    
    if (ev.key == 'Delete') {
        if (ev.target.tagName == 'SPAN' && ev.ctrlKey) {
            var prevsp = ev.target.previousElementSibling;
            var nextsp =  ev.target.nextElementSibling;
            ev.preventDefault();
            ev.target.removeAttribute('onblur');
            ev.target.parentNode.removeChild(ev.target);
            if(prevsp != null){
                prevsp.focus()
            }
            else if (nextsp != null) {
                nextsp.focus()
            }
            else{
                var prevsg = activesong.previousElementSibling;
                var nextsg = activesong.nextElementSibling;
                
                if(prevsg != null) {
                    activesong.parentNode.removeChild(activesong)
                    activesong = prevsg
                }
                else if (nextsg != null) {
                    activesong.parentNode.removeChild(activesong)
                    activesong = nextsg
                }
            }
        }
        if (ev.target.tagName != 'SPAN') {
            if (ev.ctrlKey && document.getElementsByClassName('song').length > 1) {
                var prev = activesong.previousElementSibling
                activesong.parentNode.removeChild(activesong)
                activesong = prev;
                activesong.lastElementChild.focus()
                return
            }
            activesong.removeChild(activesong.lastChild);
            if (!activesong.hasChildNodes() && document.getElementsByClassName('song').length > 1) {
                // console.log(document.getElementsByClassName('song'))
                var prev = activesong.previousElementSibling
                activesong.parentNode.removeChild(activesong)
                activesong = prev;
                activesong.lastElementChild.focus()
            }
        }
    }
}

function chordsandpositions (text) {
    var starts = [];
    var potentialends = [];
    var ends = [];
    var chords = []; 
    for (var i=0 ; i <= text.length ; i++){
        if (text.charAt(i) == startchar && text.charAt(i + 1) != ' ') {
            starts.push(i + 1);
        }  
        
        if (text.charAt(i) == ' ' || text.charAt(i) == startchar){
            potentialends.push(i - 1);
        }
    }
    potentialends.push(text.length);
    for (let s of starts){
        for (let p of potentialends){
            if (s <= p){
                ends.push(p);
                break;
            }
        }
    } 
    for (var i=0 ; i < starts.length ; i++){
        var chordname = [];
        for (var j = starts[i]  ; j <= ends[i] ; j++) {
            chordname.push(text.charAt(j))
        }
        chords.push(chordname.join('').trimRight());
    }
//    console.log(starts , ends)
    return [chords , starts , ends];
}

function parsechords (text) {
    var arraytext = Array.from(text);
    ischord = false;
    for (i = 0 ; i < arraytext.length ; i++) {        
        if (arraytext[i] == startchar) { ischord = true ; arraytext[i] = ' ' }
        else if (arraytext[i] == ' ') { ischord = false }
        if (!ischord) {arraytext[i] = ' '} 
    }
    return arraytext;
}

function tagchords (text) {  
    var ctr = 0;  
    var arraytext = parsechords(text);
    var [chords , starts , ends] = chordsandpositions(text);
    for (i = 0 ; i < chords.length ; i++) {
        arraytext.splice(starts[i] + ctr, 0 , '<img class = "hoverable" src = "' + chords[i] + '.png"><span class="crd">');
        arraytext.splice(ends[i] + 2 + ctr, 0 , '</span>');  
        ctr += 2;
    }
    return arraytext.join('');
}

function parsetitle (text) {
    text = text.split(titlechar).join('')
    return text
}

function exit(el) {
//    console.log('s')
    if (el.className == 'chords') {
       el.setAttribute('plaintext' , el.textContent);
       el.innerHTML = tagchords(el.textContent); 
    }
    else if (el.className == 'title') {
        el.setAttribute('plaintext' , el.textContent);
        el.innerHTML = parsetitle(el.textContent);
    }
    else {
        el.setAttribute('plaintext' , el.textContent);
    }
}

function enter(el) {
//    console.log('e')
    el.textContent = el.getAttribute('plaintext');
}

function createnewsong(before = document.body.lastElementChild) {
    var newsong = document.importNode(song , true);
    var newinput = document.importNode(input , true);
    newsong.appendChild(newinput);
    document.body.insertBefore(newsong , before);
    return newsong;
}

createnewsong();



var reader = new FileReader();

reader.onload = function(e) {
    var text = reader.result;
    // console.log(reader)
    text = text.split('\n')
    text = text.filter(ln =>  !['',' ', '\n' , '\r'].includes(ln))
    newsong = createnewsong()

    for(var line of text) {
        var newinput = document.importNode(input , true);
        newinput.textContent = line;
        newinput.setAttribute('plaintext' , line);
        newsong.appendChild(newinput);

        var eleRborder = newsong.lastChild.offsetLeft + newsong.lastChild.offsetWidth;
        var parRborder = newsong.offsetLeft + newsong.offsetWidth;

        // console.log(eleRborder)
        // console.log(parRborder)

        if (eleRborder >= parRborder) {
            ns = createnewsong();
            ns.removeChild(ns.firstChild)
            newsong.removeChild(newsong.lastChild);
            
            ns.appendChild(newinput);
            newsong = ns;
        }
    }
    
    
}

function readfile(el){   
    file = el.files[0]
    reader.readAsText(file)
    el.value = null 
    showdropzone = false
}

function download(filename = 'Song Book.sg') {
    var text = []
    spans = document.getElementsByTagName('span')
    for (var sp of spans) {
        text.push(sp.getAttribute('plaintext') + '\n')        
    }    
    text = text.join('')
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function allowDrop(el , ev) {
    ev.stopPropagation()
    if (sourceel.tagName == el.tagName) {
        ev.preventDefault();
    }    
}

function drag(el , ev) {
    // console.log(el);
    ev.stopPropagation();
    sourceel = el;
    
    // ev.dataTransfer.setData("text", ev.target.id);
}

function drop(el , ev) {
    if (sourceel.tagName == el.tagName) {
        ev.stopPropagation();
    }
    
    // console.log(el);
    if (ev.ctrlKey) {
        el.parentNode.insertBefore(sourceel , el);
    }
    else {
        el.parentNode.insertBefore(sourceel , el.nextSibling);
    }
    
    // ev.preventDefault();
    // var data = ev.dataTransfer.getData("text");
    // document.body.insertBefore(document.getElementById(data) , document.getElementById(data).nextSibling);
    // ev.target.appendChild(document.getElementById(data));
}

var showdropzone = false
function imp(ev) {    
    ev.stopPropagation()
    console.log(ev)
    if (ev.path[0].tagName == 'BODY' || showdropzone == true) {
        showdropzone = true
        document.getElementById('input').setAttribute('class' , 'dropzone') 
        document.getElementById('label').setAttribute('class' , 'dropzonelabel')
        setTimeout(endimp, 2000)
    }   
}

function endimp() {
    console.log('end')
    showdropzone = false
    document.getElementById('input').setAttribute('class' , 'input')
    document.getElementById('label').setAttribute('class' , 'label')    
}









