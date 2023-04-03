// NOTE: The variable "shirts" is defined in the shirts.js file as the full list of shirt offerings
//       You can access this variable here, and should use this variable here to build your webpages

let initProducts = () => {
    // To see the shirts object, run:
    // console.log(shirts);
    // Your Code Here

    //document.body.classList.add('Trying');

    for (let i = 0; i < shirts.length; i++){
        var productSquare = document.createElement("div"); //設定大外框
        productSquare.classList.add("productSquare")
        productSquare.id = "productSquare";
        document.getElementById('products').append(productSquare);

        var a = document.createElement("a")//圖片連結
        a.classList.add("picUrl");
        a.setAttribute("href", "details.html");
        a.setAttribute("class", "toDetail picUrl");
        productSquare.append(a);
        a.id = i.toString();

        var pic = document.createElement("img"); //圖片
        pic.classList.add("pic");
        pic.setAttribute("src", whichPicToChoose(shirts[i], Object.keys(shirts[i].colors)[0], "front"));
        pic.setAttribute("onerror", "javascript:this.src='shirt_images/not-found.png'")
        a.append(pic);


        var title = document.createElement("div"); //服飾名稱
        title.innerText = shirts[i].name;
        title.classList.add("titleInClothBox");        
        productSquare.append(title);

        var availableColor = document.createElement("div");//可選顏色數量
        if (Object.keys(shirts[i].colors).length > 1){
            availableColor.innerText = "Available in " + Object.keys(shirts[i].colors).length.toString() + " colors";
        }else{
            availableColor.innerText = "Available in " + Object.keys(shirts[i].colors).length.toString() + " color";
        }
        availableColor.classList.add("availableColor");
        productSquare.append(availableColor);

        var buttomSquare = document.createElement("div"); //設定小外框
        buttomSquare.classList.add("buttomSquare");
        buttomSquare.id = "productSquare";
        productSquare.append(buttomSquare);

        var url = document.createElement("a");//Quick View
        url.classList.add("quickViewUrl")
        url.setAttribute("href", "not_implemented.html");
        buttomSquare.append(url);

        var quickView = document.createElement("div");
        quickView.classList.add("quickView");
        quickView.innerText = "Quick View";
        quickView.addEventListener("mouseover", function (){
            this.style.opacity = 1;
        })
        quickView.addEventListener("mouseout", function (){
            this.style.opacity = 0.8;
        })
        url.append(quickView);

        var url2 = document.createElement("a");//See Page
        url2.classList.add("url2");
        url2.setAttribute("href", "details.html");
        url2.setAttribute("id", i.toString());
        url2.setAttribute("class", "toDetail url2");
        buttomSquare.append(url2);

        var seePage = document.createElement("div");
        seePage.classList.add("seePage")
        seePage.innerText = "See page";
        seePage.addEventListener("mouseover", function (){
            this.style.opacity = 1;
        })
        seePage.addEventListener("mouseout", function (){
            this.style.opacity = 0.8;
        })
        url2.append(seePage);
    }

    [...document.querySelectorAll('.toDetail')].forEach(function(item){
        item.addEventListener('click', function(){
            localStorage.setItem('num', item.id);
            localStorage.setItem('side', "front");
            localStorage.setItem('color', Object.keys(shirts[parseInt(item.id, 10)].colors)[0]);
        })
    })
};

function whichPicToChoose(shirt, choosenColor, frontBack){
    var colorName = Object.keys(shirt.colors);
    var colorValue = Object.values(shirt.colors);
    for (let i = 0; i < colorName.length; i++){
            if (choosenColor != colorName[i]){
                continue;
            }
            var picName = Object.keys(colorValue[i]);
            var picValue = Object.values(colorValue[i]);
            for (let ii = 0; ii < picName.length; ii++){
                if (frontBack != picName[ii]){
                    continue;
                }
                return picValue[ii]; 
            }
        }
    return "site_images/not-found.png";
}

let initDetails = () => {
    // To see the shirts object, run:
    // console.log(shirts);
    // Your Code Here

    var shirt = shirts[parseInt(localStorage.getItem("num"), 10)];

    var title = document.createElement("div"); //標題
    title.classList.add("titleInDetails")
    title.innerText = shirt.name;
    document.getElementById('detailMain').append(title);

    var frame = document.createElement("div"); //圖片及詳細資訊的大框框
    frame.classList.add("detailFrame");
    document.getElementById('detailMain').append(frame);

    var clothPNG = document.createElement("img"); //圖片
    clothPNG.classList.add("clothPNG");
    clothPNG.setAttribute("src", whichPicToChoose(shirt, localStorage.getItem("color"), localStorage.getItem("side")));
    clothPNG.setAttribute("onerror", "javascript:this.src='shirt_images/not-found.png'")
    frame.append(clothPNG);

    var infoFrame = document.createElement("div"); //詳細資訊的大框框
    frame.append(infoFrame);

    var price = document.createElement("div"); //價錢
    if (shirt.price != null && shirt.price.length != 0){
        price.innerText = shirt.price;
    }else{
        price.innerText = "$??? (Might be free...?)";
    }
    price.classList.add("price");
    infoFrame.append(price);

    var description = document.createElement("div"); //敘述
    description.innerText = shirt.description;
    description.classList.add("description");
    infoFrame.append(description);

    var sideFrame = document.createElement("div"); //side的框框
    sideFrame.classList.add("sideFrame");
    infoFrame.append(sideFrame);

    var side = document.createElement("div"); //side選項
    side.innerText = "Side:"
    side.classList.add("side");
    sideFrame.append(side);

    var frontFrame = document.createElement("a"); //front的框框
    frontFrame.setAttribute("href", "details.html")
    frontFrame.classList.add("frontFrame");
    frontFrame.id = "front";
    frontFrame.addEventListener('click', function(){
        localStorage.setItem('side', 'front');
    })
    sideFrame.append(frontFrame);
    
    var front = document.createElement("div") //front
    front.innerText = "Front";
    front.classList.add("front");
    front.addEventListener("mouseover", function (){
        this.style.opacity = 1;
    })
    front.addEventListener("mouseout", function (){
        this.style.opacity = 0.8;
    })
    frontFrame.append(front);

    var backFrame = document.createElement("a"); //back的框框
    backFrame.setAttribute("href", "details.html");
    backFrame.classList.add("backFrame");
    backFrame.addEventListener('click', function(){
        localStorage.setItem('side', 'back');
    })
    sideFrame.append(backFrame);
    
    var back = document.createElement("div") //back
    back.innerText = "Back";
    back.classList.add("back");
    back.addEventListener("mouseover", function (){
        this.style.opacity = 1;
    })
    back.addEventListener("mouseout", function (){
        this.style.opacity = 0.8;
    })
    backFrame.append(back);

    var colorFrame = document.createElement("div"); //color
    colorFrame.classList.add("colorFrame");
    infoFrame.append(colorFrame);

    var color = document.createElement("div"); //color選項
    color.innerText = "Color:"
    color.classList.add("color");
    colorFrame.append(color);

    var colorName = Object.keys(shirt.colors);
    var colorValue = Object.values(shirt.colors);

    for (let i = 0; i < colorName.length; i++){
        var colordFrame = document.createElement("a"); //colord的框框
        colordFrame.setAttribute("href", "details.html");
        colordFrame.setAttribute("class", "choosenColor");
        colordFrame.id = colorName[i];
        colordFrame.style.backgroundColor = colorName[i];
        colordFrame.classList.add("colordFrame");
        colorFrame.append(colordFrame);
        
        var colorFont = document.createElement("div") //colord
        colorFont.innerText = colorName[i].charAt(0).toUpperCase() + colorName[i].slice(1);
        colorFont.classList.add("colorFont");
        colorFont.addEventListener("mouseover", function (){
            this.style.color = 'white';
        })
        colorFont.addEventListener("mouseout", function (){
            this.style.color = 'black';
        })
        colordFrame.append(colorFont);
    }

    [...document.querySelectorAll('.choosenColor')].forEach(function(item){
        item.addEventListener('click', function(){
            localStorage.setItem('color', item.id);
        })
    })

    
    
};
