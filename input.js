/*
* all the code for homework 2 goes into this file.
You will attach event handlers to the document, workspace, and targets defined in the html file
to handle mouse, touch and possible other events.

You will certainly need a large number of global variables to keep track of the current modes and states
of the interaction.
*/

/* declaration */
var workspace = document.getElementById("workspace");
var boxes = document.querySelectorAll(".target");  
for (var i = 0; i < boxes.length; i++){
    boxes[i].id = i;
}

var isMoving = false;
var isDblclicking = false;
var throughMove = false;

let lastClick = 0;
let originX = null;
let originY = null;
let deviceType = "";

let events = {
    mouse: {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup",
    },
    touch: {
        down: "touchstart",
        move: "touchmove",
        up: "touchend",
    },
}

/* Function */
function isMoble(){
    try{
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    } catch(e) {
        deviceType = "mouse";
        return false;
    }
}
isMoble();

function clickFunction(e){
    e.preventDefault();
    e.stopPropagation();

    if (isMoving){
        if (!isDblclicking){
            document.removeEventListener(events[deviceType].move, mousemoveFunction);
            isMoving = false;
            return;
        }
        if (throughMove){
            throughMove = false;
        } else {
            isDblclicking = false;
            document.removeEventListener(events[deviceType].move, mousemoveFunction);
        }
        return;
    }

    if (this.id == "workspace"){
        document.getElementById(localStorage.getItem("selectedID")).style.backgroundColor = "red";
        return;
    }

    var nowBoxID = localStorage.getItem("selectedID");
    if (nowBoxID !== this.id && nowBoxID !== null && document.getElementById(nowBoxID) !== null){
        document.getElementById(nowBoxID).style.backgroundColor = "red";
    }
    localStorage.setItem("selectedID", this.id);
    this.style.backgroundColor = "#00f";

    if(deviceType == "touch"){ 
        if (lastClick == 0){
            lastClick = new Date().getTime();
        } else {
            if (((new Date().getTime()) - lastClick) < 400){
                isDblclicking = true;
                localStorage.setItem("dragID", this.id);
                localStorage.setItem("itemX", this.style.left);
                localStorage.setItem("itemY", this.style.top);

                originX = !isMoble() ? parseInt(e.clientX) : parseInt(e.touches[0].clientX);
                originY = !isMoble() ? parseInt(e.clientY) : parseInt(e.touches[0].clientY);

                document.addEventListener(events[deviceType].move, mousemoveFunction);
                lastClick = 0;

            } else {
                lastClick = new Date().getTime();
            }
        }
    }
}

function mousemoveFunction(e){
    e.stopPropagation();
    isMoving = true;
    throughMove = true; 

    var dragBox = document.getElementById(localStorage.getItem("dragID"));
    let mouseX = !isMoble() ? parseInt(e.clientX) : parseInt(e.touches[0].clientX);
    let mouseY = !isMoble() ? parseInt(e.clientY) : parseInt(e.touches[0].clientY);

    let dx = mouseX - originX;
    let dy = mouseY - originY;

    dragBox.style["left"] = parseInt(dragBox.style["left"].slice(0,-2)) + dx + "px";
    dragBox.style["top"] = parseInt(dragBox.style["top"].slice(0,-2)) + dy + "px";

    originX = mouseX;
    originY = mouseY;
}


/* addEventListener */
[...document.querySelectorAll(".target")].forEach(function(item){

    item.addEventListener(events[deviceType].up, clickFunction);

    item.addEventListener("dblclick", function(e){
        e.preventDefault();
        
        localStorage.setItem("dragID", this.id);
        localStorage.setItem("itemX", this.style.left);
        localStorage.setItem("itemY", this.style.top);
        isDblclicking = true;

        originX = !isMoble() ? parseInt(e.clientX) : parseInt(e.touches[0].clientX);
        originY = !isMoble() ? parseInt(e.clientY) : parseInt(e.touches[0].clientY);

        document.addEventListener(events[deviceType].move, mousemoveFunction);
    })

    item.addEventListener(events[deviceType].down, function(e){
        e.preventDefault();
        localStorage.setItem("dragID", this.id);
        localStorage.setItem("itemX", this.style.left);
        localStorage.setItem("itemY", this.style.top);
        isMoving = false;

        originX = !isMoble() ? parseInt(e.clientX) : parseInt(e.touches[0].clientX);
        originY = !isMoble() ? parseInt(e.clientY) : parseInt(e.touches[0].clientY);

        document.addEventListener(events[deviceType].move, mousemoveFunction);
    })


    document.addEventListener(events[deviceType].up, function(e){
        if (!isDblclicking){
            document.removeEventListener(events[deviceType].move, mousemoveFunction);
        }
    })

    document.addEventListener("keydown", function(e){
        if (e.code == "Escape" && (isMoving || isDblclicking)){
            document.removeEventListener(events[deviceType].move, mousemoveFunction);
            
            var dragBox = document.getElementById(localStorage.getItem("dragID"));
            dragBox.style["left"] = localStorage.getItem("itemX");
            dragBox.style["top"] = localStorage.getItem("itemY");
            isDblclicking = false;
            isMoving = false;
        }
    })
    
})

workspace.addEventListener("click", clickFunction);
