//multiple keys being pressed array
let keys, characterVar, score, keyGenerator, powerUpDict, platDict, nextPowerUpDict, speedMod, platDictKeys, needDeleted;


nextPowerUpDict = {'point' : 5000, 'speed': 8000, 'createPlatform': 6000, 'deletePlatform': 12000};

function setup() {
    createCanvas(windowWidth, windowHeight)

    //reset these variables when program is run and after restart screen
    //nextPowerUpDict is not restored because millis cannot get restored
    powerUpDict = {};
    //where the objects of the platforms are stored
    platDict = {}
    platDictKeys = []
    keyGenerator = 0;
    keys = [];
    score = 0;
    speedMod = 1;
    needDeleted = 0;


    //creates platform under character
    for(i = 0; i < 5; i++){
        platDict[keyGenerator] = new BoxPlatform(keyGenerator, 300*2*i, random(windowHeight/2, windowHeight));
        keyGenerator++;
    }
    //create character
    characterVar = new Character();
}

function draw() {
    //draws background every frame
    background("#FFE0B5")
    //score in the top left
    fill("#6B0F1A")  
    textSize(25)
    text("score: " + score, 50, 50)

    //powerUp is a locla variable to that loop
    // for every power up in the dictionary
    for(let pu of Object.values(powerUpDict)) {
        pu.display();
    }

    //does the same thing for the platforms
    for(let plat of Object.values(platDict)) {
        plat.display();
        plat.moveLeft();
    }
    
    //timer that creates powerups
    for (let powerUpType of Object.keys(nextPowerUpDict)){
        if(millis() > nextPowerUpDict[powerUpType]){
            nextPowerUpDict[powerUpType] += 5000 + random(0, 3000);

            if(powerUpType == "speed"){
                powerUpDict[keyGenerator] = new SpeedBoost(keyGenerator);
                //makes the key generator variable a new number
                keyGenerator++;
            }
            if(powerUpType == "point"){
                powerUpDict[keyGenerator] = new Point(keyGenerator, "red");
                //makes the key generator variable a new number
                keyGenerator++;
            }
            if(powerUpType == "createPlatform"){
                powerUpDict[keyGenerator] = new createPlatform(keyGenerator, "#29335C", 4);
                //makes the key generator variable a new number
                platDictKeys.push(keyGenerator);
                keyGenerator++;
                //add more to the cooldown because I dont want too many platforms
                nextPowerUpDict[powerUpType] += 10000;
            }
            if(powerUpType == "deletePlatform"){
                //.log("need deleted")
                needDeleted+=1;
                nextPowerUpDict[powerUpType] += 1200;
            }

        }
    }

    //displays the character
    characterVar.displayCharacter();

}

class Character {
    constructor(charX = 500, charY = 100, size = 50, color = "#43AA8B", velY = 1, direction = 1, speed = 5, speedCooldown = 0){
        this.size = size;
        this.charX = charX;
        this.charY = charY;
        this.velY = velY;
        this.velX = 0;
        this.direction = direction;
        this.speed = speed;
        this.speedCooldown = speedCooldown;
    }
    displayCharacter(){
        fill("black");
        rect(this.charX, this.charY, this.size, this.size);
        //gravity
        this.charY += this.velY;
        this.velY += 0.3;

        

        if(this.velY > 15){
            this.velY = 15;
        }
        //controls
        if(keys[65] || keys[37]){
            this.velX-=this.speed*speedMod/5;
            this.direction = -1;

        }
        if(keys[68]|| keys[39]){
            this.velX+=this.speed*speedMod/5;
            //this.direction = 1;
        }

        this.charX += this.velX;
        this.velX *= 0.95;

        //if its less than 10, return this.velX
        this.velX = min(this.velX, 20)
        this.velX = max(this.velX, -20)
        //if character falls off, end game
        if(this.charY > windowHeight){
            background("#2E2532")
            fill("#9E4770")
            textSize(100);
            text("Game Over", windowWidth/2-260, windowHeight/2-200);

            //restart button 
            fill("#CE2D4F")
            rect(windowWidth/2 - 250, windowHeight/2-100, 500, 150)
            //text on restart button 
            fill("#91C499")
            textSize(50);
            text("Press Space to restart", windowWidth/2-250, windowHeight/2);
            
            if(keys[32]){
                setup();
            }
        }
        
    }
}
class PowerUp{
    constructor(key = 0, color = "#657153", powerUpSpeed = 7, size = 30, x = windowWidth, y = random(0, windowHeight)){
        this.color = color;
        this.size = size;
        this.x = x;
        this.y = y;
        this.key = key;
        this.powerUpSpeed = powerUpSpeed;
    }
    display(){
        fill(this.color);
        rect(this.x, this.y, this.size, this.size)
        this.x -= this.powerUpSpeed*speedMod;
        //collision between character and powerUp
        if(this.x < characterVar.charX + characterVar.size && this.x + this.size > characterVar.charX && this.y  + this.size > characterVar.charY && this.y < characterVar.charY + characterVar.size){
            delete powerUpDict[this.key]; 
            this.afterCollision();
        }
    }
    afterCollision() {
        // This can be overridden by the children
    }
}

class SpeedBoost extends PowerUp{
    afterCollision() {
        //character should move faster for the next 3 hits on the platform
        characterVar.speed = 20*speedMod;
        characterVar.speedCooldown = 3;
    }
}
class Point extends PowerUp{
    afterCollision(){
        score+=10;
    }
}
class createPlatform extends PowerUp{
    afterCollision() {      
        platDict[keyGenerator] = new BoxPlatform(keyGenerator, characterVar.charX);
        keyGenerator++;
    }
}
class Platform{
    constructor(platKey, color = "#B07156", speed = 1){
        this.color = color;
        this.platKey = platKey;
        this.speed = speed;
    }

}
class BoxPlatform extends Platform {
    constructor(platKey, x = 100, y = 700, size = 200, sizeHeight = 20){
        super(platKey)
        //super(blue)
        this.x = x;
        this.y = y;
        this.size = size;
        this.sizeHeight = sizeHeight;
    }
    display(){
        fill(this.color)
        rect(this.x, this.y, this.size, this.sizeHeight)
        if(this.x < 0-this.size) {
            this.x = windowWidth+ random(0, 300);
            this.y = random(windowHeight/2, windowHeight-100)
            if(needDeleted > 1){
                delete platDict[this.platKey]
                console.log("platorm deleted ")
                needDeleted = 0;
            }
        }
        //making sure platforms are not on top of each other
        //character and rect collision
        if(characterVar.charX+characterVar.size > this.x && characterVar.charX < this.x + this.size && characterVar.charY + characterVar.size > this.y && characterVar.charY < this.y && characterVar.velY > 0){
            //hitting left side of platform
            if(characterVar.charX + characterVar.size > this.x && characterVar.charX + characterVar.size < this.x + 10 && characterVar.charY + characterVar.size > this.y && characterVar.charY < this.y){
                //making it so the character  cant move into the rectangle
                characterVar.charX -=15;
            }
            else{
                characterVar.velY = characterVar.velY *=-1;
                score++;  
            }
            //making the speed cool down less - counting the number of bounces until 3 bounces with speed
            characterVar.speedCooldown-=1;
            if(characterVar.speedCooldown < 1){
                characterVar.speed = 5;
            }

            
        }
        
    }
    moveLeft(){
        this.x-=5*speedMod;
    }
}



function restartGame(){
    setup();
}

function keyPressed() {
    keys[keyCode] = true;
}
function keyReleased() {
	keys[keyCode] = false;
}
