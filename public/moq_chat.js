console.log('moQ chat processor');
// Put the version number here.
document.getElementById('verid').innerHTML="0.01";
// History is the chat log area.
// Textinput is the box that you type in to.
// Displayname is the client username.
// Submitbutton is the submit button from the input area.
var history = document.getElementById('history'),
textinput = document.getElementById('textinput'),
displayname = document.getElementById('displayname'),
submitbutton = document.getElementById('submitbutton');
// Focus the caret to the text input box, so the user can type right away!
textinput.focus();
// Clear the history box, just incase?
history.innerHTML="";
// this gets called whenever the user presses something on their
// keyboard. 
function run(e) {
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
// This function takes the line that the user has typed in the input box
// and places it into the chat history box!
function append_line(line, system){
    if (line.length){ 
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
        }else if(system == 3){
            // This is a hidden message.
            return;
        }
    }
    // Save the chat log into storage.
    // This is done every time a line is appended.
    localStorage.log=history.innerHTML;
    // Scroll to the bottom of the history when a new message is appended.
    history.scrollTop = history.scrollHeight;
}
// This function sends text from the input box to the history box
// It is used by enter key listener and the submit button.
function send_text(){
    data = textinput.value;
    // Send the value of the text to the server.
    socket.emit('msg_send', data);
    // Place the value of the text input box to the history box.
    append_line(data, 1);
    // Run the value through the processor.
    process(data);
    // Reset the text input box to a blank state.
    textinput.value="";
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
