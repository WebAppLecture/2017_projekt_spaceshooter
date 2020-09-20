//init Canvas, append it and play sound
var audio;

function initcanvas(width, height) {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "maincanvas";
    this.canvas.width = this.width = width;
    this.canvas.height = this.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font ="60px space-schrift";
    document.body.appendChild(this.canvas);
    audio = new Audio("./audio/space.mp3")
    audio.loop = true;
    audio.play();
};
// give super clear function
initcanvas.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
};
//bullet fuction because not an img
initcanvas.prototype.drawBullet = function(bullet) {
    this.ctx.fillStyle = bullet.color;
    this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
};

//astroids
initcanvas.prototype.drawAstroid = function(astroid) {
    this.ctx.drawImage(astroid.img,astroid.x, astroid.y, astroid.width, astroid.height);
};

//ufos
initcanvas.prototype.drawUfo = function(ufo) {
    this.ctx.drawImage(ufo.img,ufo.x, ufo.y, ufo.width, ufo.height);
};

initcanvas.prototype.drawPowerup = function(powerup) {
    this.ctx.drawImage(powerup.img,powerup.x, powerup.y, powerup.width, powerup.height);
};


//Inputs
function Handler() {
    this.down = {};  //create objects for pressed and down key
    this.pressed = {};

    var _this = this;
    document.addEventListener("keydown", function (event) { //if keydown true
        _this.down[event.keyCode] = true;
    });
    document.addEventListener("keyup", function (event) {  //if keyup delete down and pressed
        delete _this.down[event.keyCode];
        delete _this.pressed[event.keyCode];
    })
};
Handler.prototype.isDown = function (code) {    //return if key is down
    return this.down[code];
};

Handler.prototype.isPressed = function (code) {
    if(this.pressed[code]){
        return false;
    } else if (this.down[code]){
        return this.pressed[code] = true;
    }
    return false;
};

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function iscoll(ax, ay, aw, ah, bx, by, bw, bh) {  //params for checking if collision
    return ax < bx+bw && bx < ax+aw && ay < by+bh && by < ay+ah;
};

function Bullet(x, y, velx, w, h, color) {
    this.x = x;
    this.y = y;
    this.velx = velx;
    this.width = w;
    this.height = h;
    this.color = color;
};


// Update bullet position

Bullet.prototype.update = function() {
    this.x += this.velx;
};

function Astroid(img, x, y, velx, vely, w, h) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.velx = velx;
    this.vely = vely;
    this.width = w;
    this.height = h;
};


// Update bullet position

Astroid.prototype.update = function() {
    this.x += this.velx;
    this.y += this.vely;
    //this.img == this.img.rotate(6deg);
};

Astroid.prototype.changedir = function () {
    this.velx = -(this.velx);
    this.vely = -(this.vely);

}

function resetcoll(){
    setTimeout(coll,1000);
    function coll() {
        collided = false;
    }
}


function gameover(score) {
    var score = score.toString()
    gover = new Audio("./audio/gover.mp3") //https://www.youtube.com/watch?v=vJaAy3jmEx8
    gover.play();
    $('#maincanvas').remove();
    $('#highscore').show();
    var scoreele = document.getElementById("score2");
    scoreele.innerHTML = score;
    $('#highscoreinput').show();


}

function setHighscore() {
    if(document.getElementById("name").value.length!=0){
    var name = document.getElementById("name").value;
    var score = document.getElementById("score2").innerHTML;
    $('#highscoreinput').hide();
    localStorage.setItem(name,score);
    showHighscores();
    $('#start').show();}
    else{alert("Bitte Namen eingeben !")}
}

function showHighscores() {
    var hst = document.getElementById("highscoretable");
    hst.innerHTML="<tr><td>Name</td><td>Score</td></tr>"
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        hst.innerHTML += "<tr><td>"+localStorage.key(i)+"</td><td>"+localStorage.getItem(key)+"</td></tr>"

    }
}

//ufos
function Ufo(img, x, y, velx, vely, w, h, incanvas) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.velx = velx;
    this.vely = vely;
    this.width = w;
    this.height = h;
    this.incanvas = incanvas;
};


// Update bullet position

Ufo.prototype.update = function() {
    this.x += this.velx;
    this.y += this.vely;
};

//powerups
function Powerup(img, x, y, velx, vely, w, h, type) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.velx = velx;
    this.vely = vely;
    this.width = w;
    this.height = h;
    this.type = type;
};

function createpup(x,y,velx) {
    var decpopup = getRandomArbitrary(1,4);
    switch (decpopup){
        case 1: powerups.push(new Powerup(speedimg,x,y,velx,0,32,32,"speed"));
                break;
        case 2: powerups.push(new Powerup(ammuimg,x,y,velx,0,32,32,"ammu"));
                break;
        case 3: powerups.push(new Powerup(heart,x,y,velx,0,32,32,"extralife"));
            break;
    }


}


// Update bullet position

Powerup.prototype.update = function() {
    this.x += this.velx;
    this.y += this.vely;
};



