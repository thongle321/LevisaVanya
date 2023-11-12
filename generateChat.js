
// The dictionary holding chat details
const chatDetails = {
    'drusilla': {
        'characters': ['Drusilla', 'Paul'],
        'stylesheet': 'log_styles/drusilla_style.css',
        'log': 'logs/drusilla.txt'
    },
    'shoujorei': {
        'characters': ['ShoujoRei', 'Ana'],
        'stylesheet': 'log_styles/shoujorei_style.css',
        'log': 'logs/shoujorei.txt'
    }
};

// Extract the 'name' parameter from the URL
let urlParams = new URLSearchParams(window.location.search);
let chatName = urlParams.get('name');

// If the chat name exists in the dictionary, generate the dialogue
if (chatName in chatDetails) {
    let details = chatDetails[chatName];
    generateDialogue(details.log, details.characters, details.stylesheet);
}
else {
    let content = document.getElementById('content');

    let errorMsg = document.createElement('p');
    errorMsg.innerText = 'Woah, what are you doing here? Looking for nonexistent logs? I feel ya. Nothing here, though!';

    content.appendChild(errorMsg);

    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'log_styles/shoujorei_style.css'; //default to shoujorei because it's techy heh
    document.head.appendChild(link);
}

function generateDialogue(textFile, characters, stylesheet) {
    fetch(textFile)
        .then(response => response.text())
        .then(data => {
            let lines = data.split('\n');

            let dialogue = "";
            let character = "";

            const characterPattern = new RegExp(`^(${characters.join('|')}):`);

            for (let i = 0; i < lines.length; i++) {
                if (characterPattern.test(lines[i])) {
                    if (i !== 0) {
                        addDialogue(character, dialogue);
                    }
                    character = lines[i].split(':')[0];
                    dialogue = lines[i].split(': ').slice(1).join(': ') + '';
                } else {
                    dialogue += lines[i] + '';
                }
            }

            addDialogue(character, dialogue);
        });

    function addDialogue(character, dialogue) {
        let div = document.createElement('div');
        div.className = 'box';

        let dialogueDiv = document.createElement('div');

        let img = document.createElement('img');
        img.className = 'character-img';
        img.src = '../images/' + character + '.png';
        div.appendChild(img);

        let name = document.createElement('p');
        name.className = 'name';
        name.innerText = character;
        dialogueDiv.appendChild(name);

        let para = document.createElement('p');

        dialogue = dialogue.replace(/"(.*?)"/g, '"$1"');  // Quotes
        dialogue = dialogue.replace(/\*(.*?)\*/g, '$1');  // Asterisks
        dialogue = dialogue.replace(/```([^`]*?)```/gs, '$1');  // Triple backticks

        para.innerHTML = dialogue;
        dialogueDiv.appendChild(para);

        div.appendChild(dialogueDiv);

        let content = document.getElementById('content');
        content.appendChild(div);
    }

    // Update the stylesheet
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = stylesheet;
    document.head.appendChild(link);
}

