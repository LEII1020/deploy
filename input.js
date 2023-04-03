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

let originX;
let originY;

/* Function */
function clickFunction(e){
    e.stopPropagation();
    
    if (isMoving == true){
        isMoving = false;
        return;
    }

    if (isDblclicking == true){
        isDblclicking = false;
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
}

function mousemoveFunction(e){
    e.stopPropagation();
    isMoving = true;
    var dragBox = document.getElementById(localStorage.getItem("dragID"));
    let mouseX = parseInt(e.clientX);
    let mouseY = parseInt(e.clientY);
    let dx = mouseX - originX;
    let dy = mouseY - originY;

    dragBox.style["left"] = parseInt(dragBox.style["left"].slice(0,-2)) + dx + "px";
    dragBox.style["top"] = parseInt(dragBox.style["top"].slice(0,-2)) + dy + "px";

    originX = mouseX;
    originY = mouseY;

}


/* addEventListener */
[...document.querySelectorAll(".target")].forEach(function(item){

    item.addEventListener("click", clickFunction);

    item.addEventListener("dblclick", function(e){
        e.preventDefault();
        
        localStorage.setItem("dragID", this.id);
        localStorage.setItem("itemX", this.style.left);
        localStorage.setItem("itemY", this.style.top);
        console.log(`in dblclick: ${localStorage.getItem("dragID")} left: ${localStorage.getItem("itemX")} top: ${localStorage.getItem("itemY")}`);
        isDblclicking = true;

        originX = parseInt(e.clientX);
        originY = parseInt(e.clientY);

        document.addEventListener("mousemove", mousemoveFunction);
    })

    item.addEventListener("mousedown", function(e){
        e.preventDefault();
        console.log(this.style.left);
        localStorage.setItem("dragID", this.id);
        localStorage.setItem("itemX", this.style.left);
        localStorage.setItem("itemY", this.style.top);
        console.log(`in dblclick: ${localStorage.getItem("dragID")} left: ${localStorage.getItem("itemX")} top: ${localStorage.getItem("itemY")}`);
        isMoving = false;

        originX = parseInt(e.clientX);
        originY = parseInt(e.clientY);

        document.addEventListener("mousemove", mousemoveFunction);
    })

    document.addEventListener("mouseup", function(e){
        document.removeEventListener("mousemove", mousemoveFunction);
    })

    document.addEventListener("keydown", function(e){
        if (e.code == "Escape" && (isMoving || isDblclicking)){
            document.removeEventListener("mousemove", mousemoveFunction);
            
            var dragBox = document.getElementById(localStorage.getItem("dragID"));
            dragBox.style["left"] = localStorage.getItem("itemX");
            dragBox.style["top"] = localStorage.getItem("itemY");
        }
    })
    
})

workspace.addEventListener("click", clickFunction);
