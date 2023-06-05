const piano = document.getElementsByClassName("piano_roll"); // Get all piano_roll elements
const everything = document.getElementsByTagName("div"); // Get all div elements

console.log(everything.length);
console.log(piano.length);
console.log(piano[0]);

//piano[0].classList.add("note");
// Add a note to the piano (eventually we want this to be triggered when a user clicks
// on the piano roll)
piano[0].insertAdjacentHTML('beforeend','<div id="note1" class="note"></div>')

// Create variable that stores the note element we just created
let qqq = document.getElementById("note1")
console.log(qqq)

qqq.style.backgroundColor="green";

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

qqq.addEventListener('mousedown', mousedown);
qqq.addEventListener('mouseup', mouseup);

function mousedown(e){
    qqq.held = true
    console.log("held = ",qqq.held)
}

function mouseup(e){
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
}