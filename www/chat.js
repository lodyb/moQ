console.log('moQ chat processor');

// Put the version number here.
document.getElementById('verid').innerHTML="0.01";

// History is the chat log area.
// Textinput is the box that you type in to.
// Displayname is the client username.
// Submitbutton is the submit button from the input area.
var history = document.getElementById('history');
var textinput = document.getElementById('textinput');
var displayname = document.getElementById('displayname');
var submitbutton = document.getElementById('submitbutton');

// Focus the caret to the text input box, so the user can type right away!
textinput.focus();

// Clear the history box, just incase?
history.innerHTML="";

// Run through vars and update default values to stored ones
document.getElementById('displayname').innerHTML=localStorage.displayname;

// This function takes the line that the user has typed in the input box
// and places it into the chat history box!
function append_line(line, system){
    if (textinput.value.length){ 
        // There are user messages and system messages, which can be styled
        // and differentiated in the css.
        if(system == 1){
            // New content is added using appendChild, as content does not
            // have to be deleted and reloaded this way.
            var new_content = document.createElement('span');
            new_content.innerHTML = "<span class=\"displayname\">"+localStorage.displayname+"</span><span class=\"user\">"+line+"</span>";
            history.appendChild(new_content);
        }else if(system == 0){
            var new_content = document.createElement('span');
            new_content.innerHTML = "<span class=\"system\">"+line+"</span>";
            history.appendChild(new_content);
        }else if(system == 2){
            // This is for appending multiple lines for the user message.
            var new_content = document.createElement('span');
            new_content.innerHTML = "<span class=\"user\">"+line+"</span>";
            history.appendChild(new_content);    
        }
    }

    // Save the chat log into storage.
    // This is done every time a line is appended.
    localStorage.log=history.innerHTML;

    // Scroll to the bottom of the history when a new message is appended.
    history.scrollTop = history.scrollHeight;
}

// this gets called whenever the user presses something on their
// keyboard. 
function run(e) {
    // This code might be useful for responsive design or mobile layout
    // when I get around to doing that... (TODO)
    //if (window.innerHeight <= 900){
        // history.fontSize="100%";
        // textinput.fontSize="100%";
    //}else{
    //}
    switch(e.keyCode)
    {
        // When enter button is pressed, append and process the line
        // and reset the input box to empty.
        case 13:
        e.preventDefault();
        send_text();
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
        if (textinput.value.length >= 255){
            e.preventDefault();
        }
        break;
    }

}

// This function sends text from the input box to the history box
// It is used by enter key listener and the submit button.
function send_text(){
    console.log(textinput.value);
    // Place the value of the text input box to the history box.
    append_line(textinput.value, 1);
    // Run the value through the processor.
    process(textinput.value);
    // Reset the text input box to a blank state.
    textinput.value="";
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

    // split the possible filetype at the end of the URL.
    var filetype = line.split('.').pop();
    // Take out unnecessary text from the URL.
    var website = line.replace("http://", "").replace("https://", "").replace("www.", "");
    // Split website into an array by the period.
    website = website.split('.');
    // Select first array index (e.g. [youtube].[com]).
    console.log(website[0]);
    console.log(filetype);

    // Embed certain image types into the line
    if (line){
        switch(filetype){
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'bmp':
            append_line("<img src=\""+line+"\">", 0);
            console.log('attempting to parse image: '+line);
            break;
            default:
            break;
        }
        // This section parses YouTube videos into chat.
        // if [youtube]
        if (website[0] == "youtube"){
            var youtube_url = line.split("=").pop();
            append_line("<iframe width=\"420\" height=\"315\" src=\"http://www.youtube.com/embed/"+youtube_url+"\" frameborder=\"0\" allowfullscreen></iframe>", 0);
            console.log('attempting to parse YouTube video: '+line);
        }
        // if [youtu] (for youtu.be URL)
        if (website[0] == "youtu"){
            var youtube_url = line.split("be/").pop();
            append_line("<iframe width=\"420\" height=\"315\" src=\"http://www.youtube.com/embed/"+youtube_url+"\" frameborder=\"0\" allowfullscreen></iframe>", 0);
            console.log('attempting to parse YouTube video: '+line);
        }
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
        // Do we have a display name stored?
        if(localStorage.displayname){
            // Set the display name to the one in storage.
            displayname.innerHTML=localStorage.displayname;
        }else{
            // They don't have a name.
            localStorage.displayname="Unnamed";
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

// This function stores the settings when the user updates them
// and also updates setting specific things in moQ.
function update_settings(){
    // Set the username to the one we have in storage (if it exists).
    if(typeof(Storage)!=="undefined"){
        if (localStorage.displayname){
            localStorage.displayname=displayname.innerHTML;

        // Also set the display name to chat history.
        document.getElementById('displayname').innerHTML=localStorage.displayname;
    }
}

    // Every time settings is updated, go through these colours and update them.
    document.getElementById('dncolour').style.color=document.getElementById('dncolour').innerHTML;
    document.getElementById('displayname').style.color=document.getElementById('dncolour').innerHTML;
    document.getElementById('textcolour').style.color=document.getElementById('textcolour').innerHTML;

    // Select every element with user class.
    var user_colour = document.getElementsByClassName('user');

    // Go through every element with the class and set the text colour to the one in settings.
    for (var i=user_colour.length; i--;) {
        user_colour[i].style.color=document.getElementById('textcolour').innerHTML;
    }

    // Select every element with displayname class.
    var displayname_color = document.getElementsByClassName('displayname');

    // Go through every element with the class and set the text colour to the one in settings.
    for (var i=displayname_color.length; i--;) {
        displayname_color[i].style.color=document.getElementById('dncolour').innerHTML;
    }
}

// When the settings button is pressed, this function toggles the
// settings menu from the top.
function settings_toggle(){
    if(document.getElementById('settings').style.top != "50%"){
        document.getElementById('settings').style.top="50%";
    }else{
        document.getElementById('settings').style.top="-100%";
    }
}

// This function captures any clicks made and redirects focus to
// the text input box. Users can still select text and click links
// and stuff, this just makes it less hassle to type stuff.
document.addEventListener('click', function(e) {
    // At the moment, it takes focus when it should not, for
    // example when the user is entering things in the settings
    // page. This needs to be fixed. (TODO)
    //textinput.focus();
}, false);

// Start with the history scrolled to the bottom.
setTimeout(function(){history.scrollTop = history.scrollHeight;},200);