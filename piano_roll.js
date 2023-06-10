const piano = document.getElementsByClassName("piano_roll"); // Get all piano_roll elements
const notes = document.getElementsByClassName("note")
const everything = document.getElementsByTagName("div"); // Get all div elements

const top_arr = genTopLeftArray(15, 15, 1, 108, 256, "top")
const left_arr = genTopLeftArray(15, 15, 1, 108, 256, "left")

piano_elements = piano[0].children
const note_elements = document.getElementsByClassName("note");
console.log(note_elements.length)
console.log(Math.floor(5/2))

/*
for (let i = 0; i < piano_elements.length; i++) { 
    console.log(piano_elements[i].className != "g107_256")
    console.log(piano_elements[i].className != "g107_255")
}

/*console.log(everything.length);
console.log(piano.length);
console.log(piano[0]);*/

piano[0].addEventListener('mousedown', pr_mousedown)

function pr_mousedown(e){
    var rect = piano[0].getBoundingClientRect();
    var mouseX = e.clientX-rect.left
    var mouseY = e.clientY-rect.top
    var note_height = 15;
    var note_width = 15;

    // Check if the piano has any notes
    //if (piano[0].querySelector('.note') != null)

    console.log("Mouse location: (",mouseX,", ",mouseY,")")
    console.log("Note height: ", parseInt(getComputedStyle(notes[0]).height))


    /* Formula: row_num*height + row_num*grid_gap + 1  # Rows start at index 0 */
    //top: calc(var(--row_num)*var(--height) + calc(var(--row_num)*var(--gg)) + 1px);
    /* Formula: 35 + col_num*width + col_num*grid_gap + 2 # Have to add 2 b/c the label column also
    has grid gaps/spacing. 35 is width of label column */
    //left: calc(35px + var(--col_num)*var(--width) + var(--col_num)*var(--gg) + 2px);
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
console.log("TOP = ",parseInt(getComputedStyle(qqq).top))

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
}