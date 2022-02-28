//multiple keys being pressed array
let keys = [];

let platformLst = [0];
let charX = 50;
let charY = 200;
let characterVar = 0;
let score = 0;

let keyGenerator = 0;

let platformRandom = 0;

let powerUpDict = {};
let platDict = {}

function setup() {
    createCanvas(windowWidth, windowHeight)
    //creates platform under character
    for(i = 0; i < 5; i++){
        //platformLst[i] = new BoxPlatform(x = 300*2*i, size = random(windowHeight/2, windowHeight));
        platDict[keyGenerator] = new BoxPlatform(x = 300*2*i, size = random(windowHeight/2, windowHeight));
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
    text(score, 50, 50)

    //displays the character
    characterVar.displayCharacter();

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
}

class Character {
    constructor(charX = 500, charY = 100, size = 50, color = "#43AA8B", velY = 1, direction = 1, speed = 5, speedCooldown = 0){
        this.size = size;
        this.charX = charX;
        this.charY = charY;
        this.velY = velY;
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
        if(keys[65]){
            this.charX-=this.speed;
            this.direction = -1;

        }
        if(keys[68]){
            this.charX+=this.speed;
            //this.direction = 1;
        }
        
    }
}
class PowerUp{
    constructor(key = 0, color = "#657153", size = 30, x = windowWidth, y = random(0, windowHeight), powerUpSpeed = 7){
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
        this.x -= this.powerUpSpeed;
        //collision between character and powerUp
        if(characterVar.charX+characterVar.size > this.x && characterVar.charX < this.x + this.size && characterVar.charY + characterVar.size > this.y && characterVar.charY < this.y){
            console.log("deleted")
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
        characterVar.speed = 20;
        characterVar.speedCooldown = 3;

        console.log("moving faster")
    }
}
class Point extends PowerUp{
    afterCollision(){
        score++;
    }
}
class Platform{
    constructor(color = "#B07156", speed = 1){
        this.color = color;
        this.speed = speed;
    }

}
class BoxPlatform extends Platform {
    constructor(x = 100, y = 700, size = 200, sizeHeight = 20){
        super()
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
            this.x = windowWidth+ random (0, 300);
            this.y = random(windowHeight/2, windowHeight-100)
        }
        //making sure platforms are not on top of each other
        //character and rect collision
        if(characterVar.charX+characterVar.size > this.x && characterVar.charX < this.x + this.size && characterVar.charY + characterVar.size > this.y && characterVar.charY < this.y){
            //hitting left side of platform
            if(characterVar.charX + characterVar.size > this.x && characterVar.charX + characterVar.size < this.x + 10 && characterVar.charY + characterVar.size > this.y && characterVar.charY < this.y){
                //making it so the character  cant move into the rectangle
                characterVar.charX -=15;
            }
            else{
                characterVar.velY = characterVar.velY *=-1;
            }
            //making the speed cool down less - counting the number of bounces until 3 bounces with speed
            //console.log("speed reduced by 1", characterVar.speedCoolDown)
            characterVar.speedCooldown-=1;
            if(characterVar.speedCooldown < 1){
                characterVar.speed = 5;
                console.log("speed normalized")
            }

            //I'm doing this in the collision so I dont have to check it every frame
            //setting the variable that randomnly spawns powerups
            platformRandom = Math.floor(random(0, 5));

            //if platform random variable is 2, then create a powerup
            if(platformRandom == 2){
                powerUpDict[keyGenerator] = new SpeedBoost(keyGenerator);
                //makes the key generator variable a new number
                keyGenerator++;
            }
            if(platformRandom ==3){
                console.log("created score powerup")
                powerUpDict[keyGenerator] = new Point(keyGenerator, "red");
                //makes the key generator variable a new number
                keyGenerator++;
            }
            
        }
        
    }
    moveLeft(){
        this.x-=5;
    }
}



function keyPressed() {
    keys[keyCode] = true;
}
function keyReleased() {
	keys[keyCode] = false;
}


