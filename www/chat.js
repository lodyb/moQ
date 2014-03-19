console.log('moQ chat processor');
// History is the chat log area.
// Textinput is the box that you type in to.
var history = document.getElementById('history');
var textinput = document.getElementById('textinput');
// Focus the caret to the text input box, so the user can type right away!
textinput.focus();
// Clear the history box, just incase?
history.innerHTML="";

// This function takes the line that the user has typed in the input box
// and places it into the chat history box!
function append_line(line, system){
    if (textinput.innerHTML.length){
        // At the moment I have a placeholder 'max message size'
        // I want to change this to detect the chat width so that
        // messages do not overflow out of the chat box
        // and get split into lines. (TODO)
        if (line.length > 255){
            var parts = [];
            for (var i = 0, charsLength = line.length; i < charsLength; i += 255) {
                parts.push(line.substring(i, i + 255));
            }
            for (var i=0; i<parts.length; i++){
                append_line(parts[i]);
            }
        }else{
            // There are user messages and system messages, which can be styled
            // and differentiated in the css.
            if(system){
                history.innerHTML=history.innerHTML+"<span class=\"user\">"+line+"</span>";
            }else{
                history.innerHTML=history.innerHTML+"<span class=\"system\">"+line+"</span>";
            }
        }
    }
    // Save the chat log into storage.
    // This is done every time a line is appended.
    localStorage.log=history.innerHTML;
}

// this gets called whenever the user presses something on their
// keyboard. 
function run(e) {
    // This code might be useful for responsive design or mobile layout
    // when I get around to doing that... (TODO)
    if (window.innerHeight <= 900){
        // history.fontSize="100%";
        // textinput.fontSize="100%";
    }else{
    }
    switch(e.keyCode)
    {
        // When enter button is pressed, append and process the line
        // and reset the input box to empty.
        case 13:
        e.preventDefault();
        append_line(textinput.innerHTML, 1);
        process(textinput.innerHTML);
        textinput.innerHTML="";
        break;
        // Disable up arrow key (interferes with input box).
        case 38:
        e.preventDefault();
        break;
        // Disable down arrow key (interferes with input box).
        case 40:
        e.preventDefault();
        break;
        default:
        // If text message greater than X characters, disable input.
        // ctrl f 'max message size' for explanation.
        if (textinput.innerHTML.length >= 255){
            e.preventDefault();
        }
        break;
    }
}

// This function processes each line as it is appended,
// which is used for the system messages and most likely
// for embedding content (when that functionality is added).
// (TODO)
function process(line){
    // Split the lines by the spaces
    var fw = line.split(" ");
    // This switch case selects the first word of the split
    // and uses it to see if any system messages were entered.
    switch(fw[0])
    {
        // Return the current time.
        case 'thetime':
        var date = new Date();
        var date_string = date.toString();
        append_line(date_string, 0);
        break;
        // Echo some text.
        case 'echo':
        var echo_text = line.substring(5)
        if (echo_text){
            append_line(echo_text, 0);
        }else{
            // For ducks with an empty echo.
            append_line("error: quack quack", 0);
        }
        break;
        // Help menu, not finished (TODO).
        case 'help':
        var help_text = "haha no help for u"
        append_line(help_text, 0);
        break;
        // This simply displays the current directory for now;
        // it's useless and will probably get removed. (TODO)
        case 'cd':
        var loc = window.location.pathname;
        var dir = loc.substring(0, loc.lastIndexOf('/'));
        append_line(dir, 0);
        break;
        // Count the (alphanumeric) letters used in the chat
        // This could get removed or expanded as it might
        // or might not be useful for something. (TODO)
        case 'letters':
        var content = history.innerHTML;
        var letters = null;
        letters = content.replace(/<(?!br\s*\/?)[^>]+>/g, '');
        letters = letters.length;
        append_line(letters, 0);
        break;
        // Display your ip to the guy on the other side...
        // This could be useful for proving who you are to your friend
        // although it is probably quite dumb and needs something better
        // to replace it! (TODO)
        case 'ip':
        append_line(myip, 0);
        break;
        default:
        break;
    }
}

// This function stores the chat in localStorage, so that
// the chat history is retained when the page is refreshed.
// It needs to separate the chat logs by what rooms they are in
// and probably needs some server request to make sure that
// the data was not lost - this still has a lot of work to be done.
// (TODO)
function text_log()
{
    // Make sure there is storage
    if(typeof(Storage)!=="undefined"){
        if (localStorage.log){
            // Put history contents back in its' DIV.
            history.innerHTML=localStorage.log;
        }
        else
        {
            // If it is a brand new chat - this message is displayed.
            localStorage.log="<span class=\"system\">New chat with %user%</span>";
        }
    }else{
        // Browser does not support localStorage. A server request would
        // be done here, possibly. Server could store the logs in a 
        // database, if this things turns out that way. (TODO)
        history.innerHTML="Logs could not be loaded with this browser.";
    }
}
// Execute the text log function on page load.
text_log()

// This function captures any clicks made and redirects focus to
// the text input box. Users can still select text and click links
// and stuff, this just makes it less hassle to type stuff.
document.addEventListener('click', function(e) {
    textinput.focus();
}, false);