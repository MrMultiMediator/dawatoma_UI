const piano = document.getElementsByClassName("piano_roll"); // Get all piano_roll elements
const everything = document.getElementsByTagName("div"); // Get all div elements

const top_arr = genTopLeftArray(15, 15, 1, 108, 256, "top")
const left_arr = genTopLeftArray(15, 15, 1, 108, 256, "left")

piano_elements = piano[0].children

/*
for (let i = 0; i < piano_elements.length; i++) { 
    console.log(piano_elements[i].className != "g107_256")
    console.log(piano_elements[i].className != "g107_255")
}

// Check if the piano has any notes
if (piano[0].querySelector('.note') != null) */

piano[0].addEventListener('mousedown', pr_mousedown)
piano[0].available = true; // Piano is available for mouseclicks/addition of new notes

function pr_mousedown(e){
    /** Add a new note in the specified location when you click on the piano roll */
    var rect = piano[0].getBoundingClientRect();
    var mouseX = e.clientX-rect.left; // Mouse X relative to piano roll
    var mouseY = e.clientY-rect.top;  // Mouse Y relative to piano roll
    var note_height = 15;
    var note_width = 15;

    if (piano[0].available == false) return; // Exit if there is already a note in this location on the piano roll

    row_num = computeRowColNum(top_arr, mouseY);
    col_num = computeRowColNum(left_arr, mouseX);

    // User has selected the (invalid) note labels section of the piano roll
    if (typeof col_num === 'string' || col_num instanceof String) return;

    createNewNote(row_num, col_num);

    console.log(piano[0].querySelectorAll('.note'))
    console.log("Mouse location: (",mouseX,", ",mouseY,")")
    console.log("Row, column: (", row_num, ", ", col_num, ")");
    console.log("Notes: ", piano[0].querySelectorAll('.note').length)
}

function note_mousedown(){
    piano[0].available = false
}

function note_mouseup(){
    piano[0].available = true
}

//piano[0].classList.add("note");
// Add a note to the piano (eventually we want this to be triggered when a user clicks
// on the piano roll)
piano[0].insertAdjacentHTML('beforeend','<div id="note'+'1'+'" class="note"></div>')

// Create variable that stores the note element we just created
let qqq = document.getElementById("note1")
console.log(qqq)
qqq.note_num = 1

console.log("TOP = ",parseInt(getComputedStyle(qqq).top))

// One way to change the location of a note
if (false) {qqq.style.top = (qqq.offsetTop + 16) + "px";}

// Another way to change the top location of a note
if (false) {qqq.style.top = (parseInt(getComputedStyle(qqq).top, 10) + 16) + "px";}

// Another way to change the location of a note
//qqq.style.top = "33px";

//piano[0].removeChild(qqq)

qqq.held = false // If the note is being held

/*
qqq.addEventListener('mousedown', mousedown);
qqq.addEventListener('mouseup', mouseup);

function mousedown(e){
    qqq.held = true
    console.log("held = ",qqq.held)
    qqq.style.backgroundColor="#00FFFF";
}

function mouseup(e){
    qqq.style.backgroundColor="green";
    qqq.held = false
    console.log("held = ",qqq.held)
    qqq.style.qq = 10 + "px";
    console.log("top = ",getComputedStyle(qqq).getPropertyValue('top'))
    console.log("left = ",getComputedStyle(qqq).getPropertyValue('left'))
    console.log("height = ",getComputedStyle(qqq).height)
    console.log("gg = ",getComputedStyle(qqq).getPropertyValue('--row_num'))
    qqq.style.setProperty('--row_num', parseInt(getComputedStyle(qqq).getPropertyValue('--row_num'))+1);
    qqq.style.setProperty('--col_num', parseInt(getComputedStyle(qqq).getPropertyValue('--col_num'))+1);
    console.log("gg = ",getComputedStyle(qqq).getPropertyValue('--row_num'))
} */

function genTopLeftArray(height, width, grid_gap, n_rows, n_cols, directive){
    /** Generate an array of values that corresponds to all possible "top" or "left" values for a note
     * on the piano roll */
    if (directive != "left" && directive != "top"){
        throw new Error('directive must be "left" or "top"');
        return
    }

    array = []

    if (directive == "top"){
        for (let row = 0; row < n_rows; row++){
            array.push(row*height + row*grid_gap + 1)
        }
    }

    if (directive == "left"){
        for (let col = 0; col < n_cols; col++) {
            array.push(37 + col*width + col*grid_gap)
        }
    }

    console.log("Created the array ",array)

    return array;
}

function computeRowColNum(arr, mouseLoc){
    /** Compute row/column number on the piano roll that the mouse is in given the location
        of the mouse on the piano roll and the array showing where all the "top"/"left"
        locations of each row/column in the piano roll are. */

    // Compute difference between mouse location and all top or left locations in piano roll
    var proximity = arr.map(function(x) {return mouseLoc - x;});

    // Convert all negative values in proximity_t to 1000, so they get excluded in the min
    // calculation. The row corresponds to the smallest positive value in proximity_t
    var prox_noneg = proximity.map(function(x) {
        if (x < 0) return 1000;
        return x;})

    var val = Math.min(...prox_noneg);

    // Return if the user has selected the note labels section of the piano roll
    if (val > 999) return "Invalid piano roll location"

    var index = prox_noneg.indexOf(val)

    return index;
}

function createNewNote(row_num, col_num){
    note_num = piano[0].querySelectorAll('.note').length + 1;
    piano[0].insertAdjacentHTML('beforeend','<div id="note'+note_num.toString()+'" class="note"></div>')
    let note = document.getElementById("note"+note_num.toString())
    note.note_num = note_num
    note.held = false;
    note.style.setProperty('--row_num', row_num);
    note.style.setProperty('--col_num', col_num);
    note.addEventListener('mousedown', note_mousedown);
    note.addEventListener('mouseup', note_mouseup);
    note.addEventListener('mouseout', note_mouseup); // TODO: remove this when moving notes is implemented
}