document.addEventListener('DOMContentLoaded', ()=>{
    
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
        map = new Map(sizeValue,terrainValue,islandValue);
        if(map.grid.classList.contains('hide')){
            map.grid.classList.remove('hide');  
        }
        document.querySelector(".items").classList.remove("hide");

  
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
class Map{
    
    constructor(size,landType,isIsland){
        this.grid = document.querySelector(".grid");       
        this.generateMap(size,landType,isIsland);
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
        divsize = Math.sqrt(600*600/pixels);
        console.log(divsize);
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
let map;

})

