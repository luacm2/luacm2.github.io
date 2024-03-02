var def = ["loop ", 'Block.new("', "color", "pulse(", "toggle(", "wait(", "sleep(", "delay(", "local", "data", "NOR","AND","OR","XOR","BUTTON","FLIP-FLOP","LED","SOUND","CONDUCTOR","OR","NAND","XNOR","RANDOM","CHAR","TILE","NODE","DELAY","ANTENNA","nor","and","or","xor","button","flip-flop","led","sound","conductor","or","nand","xnor","random","char","tile","node","delay","antenna"];
var autocompleteOptions = def;
var Cvariables = [];
editor.on("keyup", function (cm, event) {
    var cursor = cm.getCursor();
    var token = cm.getTokenAt(cursor);
    var currentWord = token.string.trim();
    if (event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode === 190) {
        var matches = autocompleteOptions.filter(function (option) {
            console.log(option)
            return option.startsWith(currentWord);
        });
        if (matches.length > 0) {
            showAutocompleteDropdown(matches);
        } else {
            hideAutocompleteDropdown();
        }
    }
});
function manualCHK() {
    var cm = editor
    var cursor = cm.getCursor();
    var token = cm.getTokenAt(cursor);
    var currentWord = token.string.trim();
    var matches = autocompleteOptions.filter(function (option) {
        console.log(option)
        return option.startsWith(currentWord);
    });
    if (matches.length > 0) {
        showAutocompleteDropdown(matches);
    } else {
        hideAutocompleteDropdown();
    }
}
function showAutocompleteDropdown(suggestions) {
    var dropdown = document.getElementById('autocomplete');
    dropdown.innerHTML = '';
    var cursorCoords = editor.cursorCoords();
    dropdown.style.left = cursorCoords.left + 'px';
    dropdown.style.top = (cursorCoords.bottom + 2) + 'px';
    for (var i = 0; i < suggestions.length; i++) {
        var item = document.createElement('div');
        item.textContent = suggestions[i];
        item.className = 'autocomplete-item';
        item.addEventListener('click', function (event) {
            handleAutocompleteSelection(event.target.textContent);
        });
        dropdown.appendChild(item);
    }
    dropdown.style.display = 'block';
}
function hideAutocompleteDropdown() {
    var dropdown = document.getElementById('autocomplete');
    dropdown.style.display = 'none';
}
function handleAutocompleteSelection(selectedOption) {
    var cursor = editor.getCursor();
    var token = editor.getTokenAt(cursor);
    editor.replaceRange(selectedOption, { line: cursor.line, ch: cursor.ch - token.string.length }, cursor);
    hideAutocompleteDropdown();
}
editor.on("keydown", function (cm, event) {
    var dropdown = document.getElementById('autocomplete');
    if (dropdown.style.display === 'block') {
        if (event.key === 'Tab' || event.key === 'Enter') {
            event.preventDefault();
            var topItem = dropdown.querySelector('.autocomplete-item');
            if (topItem) {
                handleAutocompleteSelection(topItem.textContent);
            }
        } else if (event.key === "Backspace") {
            hideAutocompleteDropdown();
        }
    }
});
function generateValues(code) {
    const lines = code.split(";")
    Cvariables = []
    lines.forEach((line, index) => {
        if (line.startsWith("local ")) {
            var ldata = line.replace("local ", "")
            ldata = ldata.replace(" ", "")
            const variable = ldata.split("=")[0]
            Cvariables[Cvariables.length] = variable
        }
    })
    autocompleteOptions = def
    Cvariables.forEach((addition, index) => {
        autocompleteOptions[autocompleteOptions.length] = addition
    })
    let chk = autocompleteOptions.filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
    autocompleteOptions = chk
}
var last = 0;
const onCursorActivity = (instance) => {
    const cursor = editor.getCursor();
    if(cursor.line != last) {
        hideAutocompleteDropdown()
    }
    last = cursor.line
}
editor.on("cursorActivity", onCursorActivity);
generateValues(editor.getValue(";"))
setInterval(function () {
    generateValues(editor.getValue(";"))
}, 5000)