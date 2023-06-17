const piano = document.getElementsByClassName("piano_roll"); // Get all piano_roll elements
const everything = document.getElementsByTagName("div"); // Get all div elements

const top_arr = genTopLeftArray(15, 15, 1, 108, 256, "top")
const left_arr = genTopLeftArray(15, 15, 1, 108, 256, "left")

var default_width = 15*3; // Default width of new notes (in px). Will be automatically set to
                        // the width of the most recently touched note (via mousedown)

piano[0].addEventListener('mousedown', pr_mousedown)
piano[0].available = true; // Piano is available for mouseclicks/addition of new notes

function pr_mousedown(e){
    /** Add a new note in the specified location when you left click on the piano roll */
    if (piano[0].available == false) return; // Exit if there is already a note in this location on the piano roll

    // Exit if right or middle click
    if (!leftClickFilter(e)) return;

    var rect = piano[0].getBoundingClientRect();
    var mouseX = e.clientX-rect.left; // Mouse X relative to piano roll
    var mouseY = e.clientY-rect.top;  // Mouse Y relative to piano roll

    row_num = computeRowColNum(top_arr, mouseY);
    col_num = computeRowColNum(left_arr, mouseX);

    // User has selected the (invalid) note labels section of the piano roll
    if (typeof col_num === 'string' || col_num instanceof String) return;

    createNewNote(row_num, col_num, mouseX, mouseY);
}

function note_mousedown(e, note = null, mouseX = null, mouseY = null){
    /** This happens when a note is left clicked. */

    // Exit if right or middle click
    if (!leftClickFilter(e)) return;

    var rect = piano[0].getBoundingClientRect();

    if (mouseX == null) var mouseX = e.clientX-rect.left; // Mouse X relative to piano roll
    if (mouseY == null) var mouseY = e.clientY-rect.top; // Mouse X relative to piano roll

    if (note == null) note = e.target;

    qb_width = parseInt(getComputedStyle(note).getPropertyValue('--qb_width')) // quarter beat width
    note.style.setProperty('z-index', 6); // Increase the z-index for notes being actively being held down.
    note.style.backgroundColor="#0F52BA";
    piano[0].available = false
    note.held = true

    // Initial relative position of the cursor row/column to the note row/column upon note mousehold
    var cursor_col_rel = computeRowColNum(left_arr, mouseX) - getComputedStyle(note).getPropertyValue('--col_num');
    var cursor_row_rel = computeRowColNum(top_arr, mouseY) - getComputedStyle(note).getPropertyValue('--row_num');

    console.log("Cursor relative column = ",cursor_col_rel);

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);

    function mousemove(e){
        /** If the position of the cursor's row or column relative to the note changes, modify the note's row 
         *  or column to restore the original relative position (i.e. move the note along with the cursor) */
        x = e.clientX-rect.left;
        y = e.clientY-rect.top;
        new_ccr = computeRowColNum(left_arr, x) - getComputedStyle(note).getPropertyValue('--col_num');
        new_crr = computeRowColNum(top_arr, y) - getComputedStyle(note).getPropertyValue('--row_num');

        d_row = new_crr - cursor_row_rel;
        d_col = new_ccr - cursor_col_rel;

        if (d_row != 0 || d_col != 0) moveNote(note, d_row, d_col);
    }

    function mouseup(e){
        window.removeEventListener('mousemove', mousemove)
        window.removeEventListener('mouseup', mouseup)
    }

}

function note_mouseup(e, note = null){
    if (!leftClickFilter(e)) return;
    if (note == null) note = e.target;

    piano[0].available = true
    note.held = false
    note.style.setProperty('z-index', 5); // Set z-index back to 5
    note.style.backgroundColor="green";
}

function note_rightclick(e){
    console.log(document.getElementsByClassName("note"))

    note = e.target;

    e.preventDefault();
    note.parentNode.removeChild(note);
    piano[0].available = true;
    console.log("Right mouse button has been clicked, and element deleted.");
}

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

function createNewNote(row_num, col_num, mouseX, mouseY){
    note_num = piano[0].querySelectorAll('.note').length + 1;
    piano[0].insertAdjacentHTML('beforeend','<div id="note'+note_num.toString()+'" class="note"></div>')
    let note = document.getElementById("note"+note_num.toString())
    note.note_num = note_num
    note.held = false;
    note.style.setProperty('--width', default_width + "px")
    note.style.setProperty('--row_num', row_num);
    note.style.setProperty('--col_num', col_num);
    note.addEventListener('mousedown', note_mousedown);
    note.addEventListener('mouseup', note_mouseup);
    note.addEventListener('contextmenu', note_rightclick);

    // Since the note is created upon mousedown, I want the program to know establish that the note is being
    // held at the moment it is created, in case the user wants to move the note around without lifting their
    // finger.
    note_mousedown(null, note, mouseX, mouseY)

    console.log("Row, col: ",getComputedStyle(note).getPropertyValue('--row_num'),", ",getComputedStyle(note).getPropertyValue('--col_num'))
}

function moveNote(note, d_row, d_col){
    conditions = []
    conditions.push(!(parseInt(getComputedStyle(note).getPropertyValue('--row_num')) == 0 && d_row < 0));
    conditions.push(!(parseInt(getComputedStyle(note).getPropertyValue('--col_num')) == 0 && d_col < 0));

    if (d_row != 0){
        if (allConditions(conditions)) note.style.setProperty('--row_num', parseInt(getComputedStyle(note).getPropertyValue('--row_num'))+d_row);
    }
    if (d_col != 0){
        if (allConditions(conditions)) note.style.setProperty('--col_num', parseInt(getComputedStyle(note).getPropertyValue('--col_num'))+d_col);
    }
}

function allConditions(conditions){
    for (let i = 0; i < conditions.length; i++) {
        if (conditions[i] == false) return false;
    }
    return true;
}

function leftClickFilter(e){
    /** Only return true if the mouse button being clicked is the left mouse button. */
    if (e != null){
        if (e.which == 3 || e.which == 2) return false;
    }
    return true;
}