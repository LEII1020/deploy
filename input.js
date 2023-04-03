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

var isMoving = false; //紀錄是否正在移動(通常用於drag)
var isDblclicking = false; //紀錄是否為跟隨的狀態

let lastClick = 0;
let originX = null;
let originY = null;
let deviceType = "";

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

function isDblclick(){
    if (lastClick == 0){
        lastClick = new Date().getTime();
        return false;
    } else {
        if (((new Date().getTime()) - lastClick) < 400){
            lastClick = 0;
            return true;
        } else {
            lastClick = new Date().getTime();
            return false;
        }
    }
}

if (isMoble()){

    /* Function */
    function clickFunction(e){
        e.preventDefault();
        e.stopPropagation();
        console.log(`${e.type} in ${this.id} ${isMoving} ${isDblclicking}`);

        if (isMoving && isDblclicking){
            return;
        }

        if (!isMoving && isDblclicking){ //跟隨狀況下的普通的點擊
            isDblclicking = false;
            document.removeEventListener("touchmove", mousemoveFunction);
            return;
        }

        if (!isMoving){ //普通的點擊
            document.removeEventListener("touchmove", mousemoveFunction);
        }

        if (!isDblclicking && isMoving){ //drag結束
            isMoving = false;
            document.removeEventListener("touchmove", mousemoveFunction);
            return;
        }

        if (this.id == "workspace" && !isMoving){ //取消選取
            document.getElementById(localStorage.getItem("selectedID")).style.backgroundColor = "red";
            return;
        }

        var nowBoxID = localStorage.getItem("selectedID"); //開始上色
        if (document.getElementById(nowBoxID) !== null && nowBoxID !== this.id && nowBoxID !== null){
            document.getElementById(nowBoxID).style.backgroundColor = "red";
        }
        localStorage.setItem("selectedID", this.id);
        this.style.backgroundColor = "#00f";


        if (isDblclick()){
            isDblclicking = true;

            localStorage.setItem("dragID", this.id);
            localStorage.setItem("itemX", this.style.left);
            localStorage.setItem("itemY", this.style.top);

            originX = parseInt(e.changedTouches[0].clientX);
            originY = parseInt(e.changedTouches[0].clientY);

            document.addEventListener("touchmove", mousemoveFunction);
        }
    }
    
    function mousemoveFunction(e){
        console.log(`${e.type} in mousemove`);
        e.stopPropagation();
        isMoving = true;
    
        var dragBox = document.getElementById(localStorage.getItem("dragID"));
        let mouseX = parseInt(e.changedTouches[0].clientX);
        let mouseY = parseInt(e.changedTouches[0].clientY);
    
        let dx = mouseX - originX;
        let dy = mouseY - originY;
    
        dragBox.style["left"] = parseInt(dragBox.style["left"].slice(0,-2)) + dx + "px";
        dragBox.style["top"] = parseInt(dragBox.style["top"].slice(0,-2)) + dy + "px";
    
        originX = mouseX;
        originY = mouseY;
    }
    
    

    /* addEventListener */
    [...document.querySelectorAll(".target")].forEach(function(item){
    
        item.addEventListener("touchend", clickFunction);
    
        item.addEventListener("touchstart", function(e){
            console.log(`${e.type} in down`);
            e.preventDefault();

            localStorage.setItem("dragID", this.id);
            localStorage.setItem("itemX", this.style.left);
            localStorage.setItem("itemY", this.style.top);
            isMoving = false;
    
            originX = parseInt(e.changedTouches[0].clientX);
            originY = parseInt(e.changedTouches[0].clientY);
    
            document.addEventListener("touchmove", mousemoveFunction);
        })
    
        document.addEventListener("keydown", function(e){
            console.log(e.type);
            if (e.code == "Escape" && (isMoving || isDblclicking)){
                document.removeEventListener(events[deviceType].move, mousemoveFunction);
                
                var dragBox = document.getElementById(localStorage.getItem("dragID"));
                dragBox.style["left"] = localStorage.getItem("itemX");
                dragBox.style["top"] = localStorage.getItem("itemY");
            }
        })
        
    })
    workspace.addEventListener("touchstart", function(e){
        e.preventDefault();
        if (isDblclicking){
            isMoving = false;
        }
    })
    workspace.addEventListener("touchmove", function(e){
        e.preventDefault();
        isMoving = true;
    })
    workspace.addEventListener("touchend", clickFunction);



} else {

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
}