// This function processes each line as it is appended,
// which is used for the system messages and most likely
// for embedding content (when that functionality is added).
// (TODO)
// I also want to be able to have the commands only locally
// displayed, for example if someone types clear, it should
// not be sent to everyone as a text message.
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
        // Clear the chat history box.
        case 'clear':
        history.innerHTML="";
        process('thetime');
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
