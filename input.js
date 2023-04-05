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
var isSizing = false; //紀錄是否為調整大小的狀態
var isSizingDbCheck = false;
var isHorizontal = false; //紀錄為水平調整或垂直調整
var allCancel = false; //紀錄abort
var trueCancel = false; //紀錄abort，因為ablort後會有兩次的touchend

let lastClick = 0; //用來判斷是否為雙擊
let originX = null;//調整座標
let originY = null;
let deviceType = "";//判斷裝置為行動裝置或電腦
let selectedBox = null;//被選取起來的箱子

localStorage.setItem("dragID", null);


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

    function touchstartFunction(e) {
        e.preventDefault();

        if (e.touches.length == 2){ //負責abort 與 size的變化

            if (trueCancel){
                return;
            }

            if (localStorage.getItem("dragID") !== "null" || isDblclicking){ //abort 取消拖移以及sizing
                document.removeEventListener("touchmove", touchmoveFunction);
                var dragBox = document.getElementById(localStorage.getItem("dragID"));
                dragBox.style["left"] = localStorage.getItem("itemX");
                dragBox.style["top"] = localStorage.getItem("itemY");
                allCancel = true;
                return;
            }

            if (selectedBox != null){

                var touchPosition = [];
                [...e.touches].forEach(touch => {
                    touchPosition.push([touch.clientX, touch.clientY]);
                })

                isSizing = false;
                isSizingDbCheck = false;
                originX = parseInt(touchPosition[0][0]) - parseInt(touchPosition[1][0]);
                originY = parseInt(touchPosition[0][1]) - parseInt(touchPosition[1][1]);
                if (originX < 0){
                    originX = -originX;
                }
                if (originY < 0){
                    originY = -originY;
                }

                if (originY/originX <= 1){ //水平的情況
                    isHorizontal = true;
                }else{
                    isHorizontal = false;
                }

                document.addEventListener("touchmove", touchmoveFunction);
            }
        }

        if (isDblclicking){
            isMoving = false;
        }
    }

    function touchendFunction(e){
        e.preventDefault();
        e.stopPropagation();

        if(allCancel){ //abort
            //isDblclicking = false;
            isMoving = false;
            isSizing = false;
            document.removeEventListener("touchmove", touchmoveFunction);
            allCancel = false;
            trueCancel = true;
            return;
        }

        if(trueCancel){
            trueCancel = false;
            return;
        }
        
        if (isSizing){
            if (e.touches.length == 0){//結束sizing
                isSizing = false;
                document.removeEventListener("touchmove", touchmoveFunction);
                return;
            }
            if (e.touches.length == 1){
                if (isSizingDbCheck){ //還在sizing
                    return;
                } else { //abort
                    trueCancel = true;
                }
            }
        }

        if (isMoving && isDblclicking){ //還在跟隨
            return;
        }

        if (!isMoving && isDblclicking){ //跟隨狀況下的普通點擊
            isDblclicking = false;
            document.removeEventListener("touchmove", touchmoveFunction);
            return;
        }

        if (!isDblclicking && isMoving){ //drag結束
            isMoving = false;
            localStorage.setItem("dragID", null);
            localStorage.setItem("itemX", null);
            localStorage.setItem("itemY", null);
            document.removeEventListener("touchmove", touchmoveFunction);
            return;
        }

        if (this.id == "workspace" && !isMoving && !isSizing){ //取消選取
            selectedBox = null;
            document.getElementById(localStorage.getItem("selectedID")).style.backgroundColor = "red";
            return;
        }

        if (!isMoving){ //普通的點擊
            document.removeEventListener("touchmove", touchmoveFunction);
            localStorage.setItem("dragID", null);
            localStorage.setItem("itemX", null);
            localStorage.setItem("itemY", null);
        }

        var nowBoxID = localStorage.getItem("selectedID"); //開始上色
        if (document.getElementById(nowBoxID) !== null && nowBoxID !== this.id && nowBoxID !== null){
            document.getElementById(nowBoxID).style.backgroundColor = "red";
        }
        localStorage.setItem("selectedID", this.id);
        selectedBox = this;
        this.style.backgroundColor = "#00f";


        if (isDblclick()){
            isDblclicking = true;
            localStorage.setItem("dragID", this.id);
            localStorage.setItem("itemX", this.style.left);
            localStorage.setItem("itemY", this.style.top);
            originX = parseInt(e.changedTouches[0].clientX);
            originY = parseInt(e.changedTouches[0].clientY);

            document.addEventListener("touchmove", touchmoveFunction);
        }
    }
    
    function touchmoveFunction(e){
        e.preventDefault();
        e.stopPropagation();
        
        if (e.touches.length == 2 && !trueCancel){
            isSizing = true;
            isSizingDbCheck = true;

            if (isHorizontal){
                let lengthX = parseInt(e.changedTouches[0].clientX) - parseInt(e.changedTouches[1].clientX);
                if (lengthX < 0){
                    lengthX = -lengthX;
                }
                let dx = lengthX - originX;
                if ((parseInt(selectedBox.style["width"].slice(0,-2)) + dx) >= 20){
                    selectedBox.style["width"] = parseInt(selectedBox.style["width"].slice(0,-2)) + dx + "px";
                    selectedBox.style["left"] = (parseFloat(selectedBox.style["left"].slice(0,-2)) - (dx/2)) + "px";
                }
                originX = lengthX;
            } else {
                let lengthY = parseInt(e.changedTouches[0].clientY) - parseInt(e.changedTouches[1].clientY);
                if (lengthY < 0){
                    lengthY = -lengthY;
                }
                let dy = lengthY - originY;
                if ((parseInt(selectedBox.style["height"].slice(0,-2)) + dy) >= 20){
                    selectedBox.style["height"] = parseInt(selectedBox.style["height"].slice(0,-2)) + dy + "px";
                    selectedBox.style["top"] = (parseFloat(selectedBox.style["top"].slice(0,-2)) - (dy/2)) + "px";
                }
                originY = lengthY;
            }

        } else {
            if (isSizing){
                return;
            } else {
                isMoving = true;
                var dragBox = document.getElementById(localStorage.getItem("dragID"));
                if (dragBox == null){
                    return;
                }
                let mouseX = parseInt(e.changedTouches[0].clientX);
                let mouseY = parseInt(e.changedTouches[0].clientY);
            
                let dx = mouseX - originX;
                let dy = mouseY - originY;
            
                dragBox.style["left"] = parseInt(dragBox.style["left"].slice(0,-2)) + dx + "px";
                dragBox.style["top"] = parseInt(dragBox.style["top"].slice(0,-2)) + dy + "px";

                originX = mouseX;
                originY = mouseY;
            }
        }
        
    }
    
    

    /* addEventListener */
    [...document.querySelectorAll(".target")].forEach(function(item){
    
        item.addEventListener("touchend", touchendFunction);
    
        item.addEventListener("touchstart", function(e){
            e.preventDefault();

            if (!isDblclicking){
                localStorage.setItem("dragID", this.id);
                localStorage.setItem("itemX", this.style.left);
                localStorage.setItem("itemY", this.style.top);
                
                originX = parseInt(e.changedTouches[0].clientX);
                originY = parseInt(e.changedTouches[0].clientY);
            }

            isMoving = false;
            document.addEventListener("touchmove", touchmoveFunction);

            
        })
    })

    document.addEventListener("touchstart", touchstartFunction)

    workspace.addEventListener("touchend", touchendFunction);

    
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
            
            isDblclicking = true;

            originX = parseInt(e.clientX);
            originY = parseInt(e.clientY);

            document.addEventListener("mousemove", mousemoveFunction);
        })

        item.addEventListener("mousedown", function(e){
            e.preventDefault();
            
            localStorage.setItem("dragID", this.id);
            localStorage.setItem("itemX", this.style.left);
            localStorage.setItem("itemY", this.style.top);
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
