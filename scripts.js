document.addEventListener('DOMContentLoaded', ()=>{
    
    ruleCloseHandler();
    const mapGenerateButton = document.querySelector(".mapGeneratorButton");
    //This event generates the map
    mapGenerateButton.addEventListener('click',()=>{
        let terrain = document.getElementById('terrain');
        let terrainValue = terrain.options[terrain.selectedIndex].value;
        let size = document.getElementById('size');
        let sizeValue = size.options[size.selectedIndex].value;
        let island = document.getElementById('island');
        let islandValue = (island.options[island.selectedIndex].value == "true");
        if(map !== undefined ){
            const mapHTML =document.querySelector(".grid");
            mapHTML.innerHTML="";
        }
        map = new Map(sizeValue,terrainValue,islandValue,".grid");
        if(map.grid.classList.contains('hide')){
            map.grid.classList.remove('hide');  
        }
        document.querySelector(".items").classList.remove("hide");
        Keymovements();
        const rules = document.querySelector('.rules');
        rules.classList.add("hide");
  
    })

    //Adding event listeners to the draggable items

    let currentItem;
    addEventsToDraggableItems();
    

    function addEventsToDraggableItems(){
        const itemContiner = document.querySelector(".items");
        const allItems = itemContiner.children;
        for(const item of allItems){
            item.addEventListener('dragstart',dragStart);
            item.addEventListener('drop',dragDrop);
        }
        const battleItems = document.querySelector(".battleItems")
        const allBattleItems = battleItems.children;
        for(const item of allBattleItems){
            item.addEventListener('dragstart',dragStart);
            item.addEventListener('drop',dragDrop);
        }
    }

    function dragStart(){
        console.log(this.getAttribute('src'))
        console.log(this.children)
        if(this.children.length>0){
            currentItem = this.children[0].getAttribute('src');  
        }else{
            currentItem = "color " +this.style.backgroundColor;
        }
        console.log(currentItem);
          
    }
    function dragDrop(){
        
        console.log(this);
        console.log(currentItem);
        if(currentItem.includes("color")){
            this.style.backgroundColor = currentItem.split(' ')[1];
        }else{
            this.style.backgroundImage = `url("${currentItem}")`;
        }
    }
    function dragOver(e){
        e.preventDefault();
    }

    //Battle map handler
    const battleMapButton = document.querySelector(".battleMapGeneratorButton");
    battleMapButton.addEventListener('click',generateBattleMap)
    function generateBattleMap(){
        if(map === undefined){
            const alertBox = document.querySelector(".alertbox");
            alertBox.classList.remove("hide");
            console.log(alertBox.classList)
            setTimeout(()=>alertBox.classList.add("hide"), 3000);           
            return;
        }
        const battlemap = document.querySelector(".battlemap");
        const battleIcons = document.querySelector(".battleContainer");
        battleIcons.classList.remove('hide');
        let terrain = document.getElementById('terrain');
        let terrainValue = terrain.options[terrain.selectedIndex].value;
        if(fightmap !== undefined){
            battlemap.innerHTML="";
        }
        fightmap = new Map("S",terrainValue,false,".battlemap");
        for(let i = 0; i < 225;i++){
            const div = document.querySelector(`.battlemap> div:nth-child(${i+1})`)
            div.style.width="40px";
            div.style.height="40px";
        }
        //battlemap.lastChild.remove();
        const container =document.querySelector('.container');
        container.classList.add("grayish")
        const battlecontainer = document.querySelector('.battleContainer');
        const body = document.querySelector("body");
        currentView=".battlemap"
        Keymovements();
        
    }
    //battlemap closing
    const closeButton = document.querySelector(".close");
    closeButton.addEventListener('click',()=>{
        const battleIcons = document.querySelector(".battleContainer");
        battleIcons.classList.add('hide');
        const container =document.querySelector('.container');
        container.classList.remove("grayish")
        currentView =".grid";
    })

    //Adding the key movement for icons

    function Keymovements(){    
        const itemcontainer = document.querySelector(currentView);
        const allDiv = itemcontainer.children;
        for(const item of allDiv){
            item.addEventListener('click', highlightItem.bind(item,allDiv))
        }
    }
    //removes the last highlight and adds it to the clicked div
    function highlightItem(allDiv){
        for(let i = 0; i<allDiv.length;i++){
            if(allDiv[i].classList.contains('giveBorder')){
                allDiv[i].classList.remove('giveBorder')
            }
        }
        this.classList.toggle('giveBorder')
    }
    document.addEventListener('keydown',function keyPressed(event){
        //checking for highlighted item
        const itemcontainer = document.querySelector(currentView);
        const allDiv = itemcontainer.children;
        let highlightedItem;
        let index;
        for(let i = 0; i<allDiv.length;i++){
            if(allDiv[i].classList.contains('giveBorder')){
                highlightedItem = allDiv[i];
                index=i;
            }
        }
        console.log(index)
        if(highlightedItem){
            //Checking which key was pressed and moving highlight that direction with icon url
            let iconURL;
            let size;
            console.log(currentView)
            if(currentView==".grid"){
                size = map.pixNum;
            }else{
                size = fightmap.pixNum;
            }
            if(event.keyCode==39){
                highlightedItem.classList.remove('giveBorder');
                iconURL = getURL(highlightedItem);        
                allDiv[index+1].classList.add('giveBorder');
                if(iconURL !== null){
                    allDiv[index+1].style.backgroundImage=iconURL;
                }             
            }else if(event.keyCode==37){
                highlightedItem.classList.remove('giveBorder');
                iconURL = getURL(highlightedItem); 
                allDiv[index-1].classList.add('giveBorder');
                if(iconURL !== null){
                    allDiv[index-1].style.backgroundImage=iconURL;
                }    
            }else if(event.keyCode==40){               
                highlightedItem.classList.remove('giveBorder');
                iconURL = getURL(highlightedItem);
                if(index >= Math.floor(size-Math.sqrt(size))){
                    index -= Math.floor(size);                   
                    index++;
                }
                allDiv[index+Math.floor(Math.sqrt(size))].classList.add('giveBorder');
                if(iconURL !== null){
                    allDiv[index+Math.floor(Math.sqrt(size))].style.backgroundImage=iconURL;
                }    
            }else if(event.keyCode == 38){
                highlightedItem.classList.remove('giveBorder');
                iconURL = getURL(highlightedItem);
                if(index < Math.floor(Math.sqrt(size))){
                    index += Math.floor(size);                   
                    index--;
                }            
                allDiv[index-Math.floor(Math.sqrt(size))].classList.add('giveBorder');
                if(iconURL !== null){
                    allDiv[index-Math.floor(Math.sqrt(size))].style.backgroundImage=iconURL;
                } 
            }
        

        }
    })

    //removing and getting URL from highlighted div
    function getURL(containerDiv){
        let url;
        if(containerDiv.style.backgroundImage){
            url = containerDiv.style.backgroundImage;
            containerDiv.style.backgroundImage = null;
        return url;
        }else{
            return null;
        }    
    }
    function ruleCloseHandler(){
    const closeRulesButton = document.querySelector(".closeRules");
    closeRulesButton.addEventListener('click',()=>{
        const rules = document.querySelector('.rules');
        rules.classList.add("hide");
    })
    }
    

class Map{
    
    pixNum;
    constructor(size,landType,isIsland,containerClass){
        this.grid = document.querySelector(containerClass);     
        this.generateMap(size,landType,isIsland);
        currentView =".grid";
    }

    generateMap(size,landType,isIsland){
        const allPixels = [];
        let pixels;
        let divsize;
        if(size === "S"){
            pixels = 225;        
        }else if(size ==="M"){
            pixels = 400;
        }else{
            pixels = 900;
        }
        this.pixNum = pixels;
        divsize = Math.sqrt(600*600/pixels);
        for(let i = 0; i < pixels;i++){
            const div = document.createElement("div");
            const colour =  this.getRandomColor(landType,i,pixels,allPixels);
            div.style.backgroundColor = colour;
            div.style.height= `${divsize}px`;
            div.style.width= `${divsize}px`;
            div.addEventListener('drop',dragDrop);
            div.addEventListener('dragover',dragOver);
            div.classList.add('backgroundImage');
            this.grid.append(div);        
            allPixels.push(colour);
        }
        if(isIsland){
            
        for(let i = 0; i < pixels;i++){
            if(i<Math.sqrt(pixels)){
                allPixels[i] = 'Blue';
                //body > div > div:nth-child(1) > div > div:nth-child(${i+1})
                const div = document.querySelector(`.grid > div:nth-child(${i+1})`)
                div.style.backgroundColor = 'Blue';
            }else if(i >= pixels-Math.sqrt(pixels)){
                allPixels[i] = 'Blue';
                const div = document.querySelector(`.grid > div:nth-child(${i+1})`)
                
                div.style.backgroundColor = 'Blue';
            }else if(i%Math.sqrt(pixels)===0 || i%Math.sqrt(pixels)===Math.sqrt(pixels)-1){
                allPixels[i] = 'Blue';
                const div = document.querySelector(`.grid > div:nth-child(${i+1})`)
                div.style.backgroundColor = 'Blue';
            }else if(i>0 && allPixels[i-1] === 'Blue'){
                const waterRNG = Math.random();
                if(waterRNG<0.4){
                allPixels[i] = 'Blue';
                const div = document.querySelector(`.grid > div:nth-child(${i+1})`)
                div.style.backgroundColor = 'Blue';
                }
            }else if(i>Math.sqrt(pixels) && allPixels[i-Math.sqrt(pixels)]==='Blue'){
                const waterRNG = Math.random();
                if(waterRNG<0.4){
                allPixels[i] = 'Blue';
                const div = document.querySelector(`.grid > div:nth-child(${i+1})`)
                div.style.backgroundColor = 'Blue';
                }
            }            
        }
        for(let i = pixels-1; i >= 0;i--){               
            
            if(i>0 && allPixels[i+1] === 'Blue'){
                const waterRNG = Math.random();
                if(waterRNG<0.4){
                allPixels[i] = 'Blue';
                const div = document.querySelector(`.grid > div:nth-child(${i+1})`)
                div.style.backgroundColor = 'Blue';
                }
            }else if(i<pixels-Math.sqrt(pixels) && allPixels[i+Math.sqrt(pixels)]==='Blue'){
                const waterRNG = Math.random();
                if(waterRNG<0.4){
                allPixels[i] = 'Blue';
                const div = document.querySelector(`.grid > div:nth-child(${i+1})`)
                div.style.backgroundColor = 'Blue';
                }
            }            
        }
        }
        
    }
    getRandomColor(landType,pixelCount,pixels,allPixels){
        const RNG = Math.floor(Math.random()*10);

            if(landType === "desert"){
                const desertGreenRNG = Math.random();
                if(desertGreenRNG<0.02){
                    return 'SeaGreen';
                }else if(pixelCount>1 && allPixels[pixelCount-1]=='SeaGreen' && desertGreenRNG<0.45){
                    const greenOrWater = Math.random();
                    return greenOrWater<0.75? 'SeaGreen' : 'LightSkyBlue'
                    
                }else if((pixelCount>Math.sqrt(pixels) && allPixels[pixelCount-Math.sqrt(pixels)]==='SeaGreen') && desertGreenRNG<0.45){
                    const greenOrWater = Math.random();
                    return greenOrWater<0.75? 'SeaGreen' : 'LightSkyBlue'
                }
                const randomItems = Math.random();
                const differentColors = ['Bisque','Bisque','Bisque','Bisque','BlanchedAlmond','BlanchedAlmond','BurlyWood','BurlyWood','BurlyWood','GoldenRod']
                return differentColors[RNG];
            }else if(landType === "snowy"){
                const mountainRNG = Math.random();
                if(mountainRNG<0.04){
                    return 'Gainsboro';
                }else if(pixelCount>1 && allPixels[pixelCount-1]=='Gainsboro' && mountainRNG<0.6){
                    const highOrNot = Math.random();
                    return highOrNot<0.90? 'Gainsboro' : 'DarkGray'
                    
                }else if((pixelCount>Math.sqrt(pixels) && allPixels[pixelCount-Math.sqrt(pixels)]==='Gainsboro') && mountainRNG<0.6){
                    const highOrNot = Math.random();
                    return highOrNot<0.90? 'Gainsboro' : 'DarkGray'
                }
                const glacierRNG = Math.random();
                if(glacierRNG<0.02){
                    return 'PaleTurquoise';
                }else if(pixelCount>1 && allPixels[pixelCount-1]=='PaleTurquoise' && glacierRNG<0.6){
                    return 'PaleTurquoise'
                    
                }else if((pixelCount>Math.sqrt(pixels) && allPixels[pixelCount-Math.sqrt(pixels)]==='PaleTurquoise') && glacierRNG<0.6){
                    return 'PaleTurquoise'
                }
                const snowyGreenRNG = Math.random();
                if(snowyGreenRNG<0.01){
                    return 'SeaGreen';
                }else if(pixelCount>1 && allPixels[pixelCount-1]=='SeaGreen' && snowyGreenRNG<0.6){
                    return 'SeaGreen'
                    
                }else if((pixelCount>Math.sqrt(pixels) && allPixels[pixelCount-Math.sqrt(pixels)]==='SeaGreen') && snowyGreenRNG<0.6){
                    return 'SeaGreen'
                }

                const differentColors = ['GhostWhite','GhostWhite','White','GhostWhite','Snow','Snow','White','White','White','Snow']
                return differentColors[RNG]
            }else{
                return "White"
            }
        
    }

    
}
let currentView;
let map;
let fightmap;
})

