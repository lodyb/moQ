// Connect socket
var socket = io.connect();
var data = "";
// When a new message is received...
socket.on('msg_new', function(data){
    // Make sure the data is not empty.
    if(data.length){
        // Append the data to the chat history.
        append_line(data, 1);
        // Process the data.
        process(data);
        // Check to make sure this is getting called correctly
        console.log("received data: "+data);
    }
});
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
