var display, input, frames, PlayerSprite, player, playerimg, bullets, lasersound, speed, bulletspeed, ufoimg, astroids, astrmidimg, astrimg, collided,
score, lifes, heart, shoot,ammunition, dlevel;
collided = false;
shoot = false;
function main() {
    $('#start').hide();
    $('#highscore').hide();
    display = new initcanvas(1050, 450);
    input = new Handler();
    //load images
    heart = new Image();
    heart.src = "./img/heart.png";
    astrmidimg = new Image();
    astrmidimg.src = "./img/astroidmid.png";
    astrimg = new Image();
    astrimg.src = "./img/astroid.png";
    ufoimg = new Image();
    ufoimg.src = "./img/ufo.png";
    playerimg = new Image();
    playerimg.src = "./img/ship.png";
    speedimg = new Image();
    speedimg.src = "./img/speed.png";
    ammuimg = new Image();
    ammuimg.src = "./img/ammu.png";
    //load sounds
    lasersound = new Audio("./audio/laser1.wav");
    gosound = new Audio("./audio/go.wav");
    gosound.play();
    init();
    run();

}

function init() {
    // set start settings
    frames  = 0;
    speed = 2;
    dlevel = 0.5;
    bulletspeed = 8;
    score = 0;
    lifes = 3;
    ammunition = 150;
    powerupsize = 32;
    playerimg.height = 45;
    playerimg.width = 31;
    astrmidimg.width = 50;
    astrmidimg.height = 55;
    astrimg.width = 30;
    astrimg.height = 32;
    ufoimg.width = 112;
    ufoimg.height=76;
    // create the player
    player = {
        sprite: playerimg,
        x: 0,
        y: display.height/2 - playerimg.height/2
    };
    // initiate arrays
    bullets = [];
    astroids = [];
    ufos = [];
    enemybullets = [];
    powerups = [];

};

function run() {
    var timer = setInterval(function(){ update(); }, 15);
    var loop = function() {
        render();
        if (lifes<1){
            update();
            clearInterval(timer);
            display.clear;
        }
        else{
        window.requestAnimationFrame(loop, display.canvas);}
    };
    window.requestAnimationFrame(loop, display.canvas);
};

function update() {
    frames++;
    if (score>1000){dlevel=1}
    if(score>2000){dlevel=2}
    if(score>4000){dlevel=3}
    // update ship position depending on keys pressed
    if (input.isDown(37)) { // Left
        player.x -= speed;
    }
    if (input.isDown(39)) { // Right
        player.x += speed;
    }
    if (input.isDown(38)) { // Up
        player.y -= speed;
    }
    if (input.isDown(40)) { // Down
        player.y += speed;
    }
    //ensure player isnt moving out of canvas
    if(player.x<0) player.x = 0;
    if(player.x+playerimg.width>display.width) player.x = display.width-playerimg.width
    if(player.y<0) player.y = 0;
    if(player.y+playerimg.height>display.height) player.y = display.height-playerimg.height

    //bullets
    if (input.isPressed(32)&&ammunition>0) { // Space
        lasersound.play()
        ammunition--;
        bullets.push(new Bullet(player.x + playerimg.width, player.y+(playerimg.height/2), bulletspeed, 15, 4, "#f00"));
    }

    // update all bullets position
    for (var i = 0, len = bullets.length; i < len; i++) {
        var b = bullets[i];
        b.update();
        // remove bullets outside of the canvas
        if (b.x > display.width) {
            bullets.splice(i, 1);
            i--;
            len--;
            continue;
        }}
    // enemy bullets
    for (var i = 0, len = enemybullets.length; i < len; i++) {
        var b = enemybullets[i];
        b.update();
        // remove bullets outside of the canvas
        if (b.x > display.width) {
            enemybullets.splice(i, 1);
            i--;
            len--;
            continue;
        }}

    // powerups
    for (var i = 0, len = powerups.length; i < len; i++) {
        var b = powerups[i];
        b.update();
        // remove bullets outside of the canvas
        if (b.x < 0 || b.x > display.width) {
            powerups.splice(i, 1);
            i--;
            len--;
            continue;
        }}

    //astroids
    if(frames%(100)==0){
        //create randomnumber
        var posy;
        var velx = getRandomArbitrary(-3,0) ;
        var vely = getRandomArbitrary(-2,2);
        var posx  = getRandomArbitrary(800,1050);
        var decy = getRandomArbitrary(1,3);
        if(decy==1) posy= getRandomArbitrary(-200,0);
        else{posy=getRandomArbitrary(450,650)}
        //astroidsize
        var decsize = getRandomArbitrary(1,3);
        switch (decsize){
            case 1: astroids.push(new Astroid(astrmidimg,posx,posy,velx,vely,astrmidimg.width,astrmidimg.height));
                    break;
            case 2: astroids.push(new Astroid(astrimg,posx,posy,velx,vely,astrimg.width,astrimg.height));

        }}

    if(frames%(50)==0){

        // ufos
        var posuy;
        var velux = getRandomArbitrary(-3,0) ;
        var veluy = getRandomArbitrary(-2,2);
        var posux  = getRandomArbitrary(800,1050);
        var decuy = getRandomArbitrary(1,3);
        if(decuy==1) posuy = getRandomArbitrary(-200,0);
        else{posuy = getRandomArbitrary(450,650)}
        ufos.push(new Ufo(ufoimg,posux,posuy,velux,veluy,ufoimg.width,ufoimg.height,false));


    }

    if(frames%20==0){shoot=false;}

    for (var i = 0, len = astroids.length; i < len; i++) {
        var a = astroids[i];
        a.update();
        if (a.x > display.width+400 || a.x < -400 || a.y >display.height+400|| a.y < -400) {
            astroids.splice(i, 1);
            i--;
            len--;
            continue;
        }}

    for (var ui = 0, len = ufos.length; ui < len; ui++) {
        var u = ufos[ui];
        if(u.y==display.height/2) u.incanvas=true;
        if(u.y<0&&u.incanvas) u.vely*=(-1);
        if(u.y+ufoimg.height>display.height&&u.incanvas) u.vely*=(-1);
        if(player.y+(playerimg.height/2)>u.y+ufoimg.height/3 && player.y+(playerimg.height/2)<u.y+(ufoimg.height*0.6) && player.x<u.x){
            if(!shoot){
            enemybullets.push(new Bullet(u.x-20, u.y+(ufoimg.height/2), -(bulletspeed*0.66*dlevel), 15, 4, "#0f0"));
            lasersound.play();
            shoot=true;

            }
        }
        u.update();
        if (u.x < -ufoimg.width) {
            ufos.splice(ui, 1);
            ui--;
            len--;
            continue;
        }
        }



    //collisions
    //bullets astroids
    for( var k = 0, len = bullets.length; k < len; k++){
         b = bullets[k];
         for( var j = 0, len1 = astroids.length; j < len1; j++){
             a = astroids[j];
            if(b.x+15 > a.x && b.x < a.x + a.img.width && b.y > a.y && b.y < a.y + a.img.height) {
                astroids.splice(j,1);
                bullets.splice(k,1);
                score += 20;
                k--;
                i--;
                len--;
                len1--;
                var spawnpup = getRandomArbitrary(1,5);
                if(spawnpup==1){createpup(a.x,a.y,a.velx);}
                continue;
            }
        }

    }

    //enemybullets astroids
    for( var k = 0, len = enemybullets.length; k < len; k++){
        b = enemybullets[k];
        for( var j = 0, len1 = astroids.length; j < len1; j++){
            a = astroids[j];
            if(b.x+15 > a.x && b.x < a.x + a.img.width && b.y > a.y && b.y < a.y + a.img.height) {
                astroids.splice(j,1);
                enemybullets.splice(k,1);
                k--;
                i--;
                len--;
                len1--;
                continue;
            }
        }

    }

    //bullets ufo
    for( var k = 0, len = bullets.length; k < len; k++){
        b = bullets[k];
        for( var j = 0, len1 = ufos.length; j < len1; j++){
            u = ufos[j];
            if(b.x+15 > u.x && b.x < u.x + u.img.width && b.y > u.y && b.y < u.y + u.img.height) {
                ufos.splice(j,1);
                bullets.splice(k,1);
                score += 50;
                k--;
                i--;
                len--;
                len1--;
                var spawnpup = getRandomArbitrary(1,5);
                if(spawnpup==1){createpup(u.x,u.y,u.velx);}
                continue;
            }
        }

    }

    //astroids player
    for( var ki = 0,len = astroids.length; ki < len; ki++){
        a = astroids[ki];
        if(a.x < player.x+playerimg.width && player.x < a.x+a.img.width && a.y < player.y+playerimg.height && player.y < a.y+a.img.height){
            astroids.splice(ki,1);
            lifes--;
            ki--;
            len--;
            continue;
        }
    }

    //ufos player
    for( var ki = 0,len = ufos.length; ki < len; ki++){
        u = ufos[ki];
        if(u.x < player.x+playerimg.width && player.x < u.x+ufoimg.width && u.y < player.y+playerimg.height && player.y < u.y+ufoimg.height){
            ufos.splice(ki,1);
            lifes--;
            ki--;
            len--;
            continue;
        }
    }

    //bullets player
    for( var ki = 0,len = enemybullets.length; ki < len; ki++){
        b = enemybullets[ki];
        if(b.x > player.x && b.x < player.x + playerimg.width && b.y > player.y && b.y < player.y + playerimg.height){
            enemybullets.splice(ki,1);
            lifes--;
            ki--;
            len--;
            continue;
        }
    }

    //astroids astroids
    for(var astr = 0, len = astroids.length; astr < len; astr++) {
        ast = astroids[astr];
        for (var astr1 = 0, len1 = astroids.length; astr1 < len1; astr1++) {
            ast1 = astroids[astr1];
            if (astr!=astr1 && ast.x < ast1.x + ast1.img.width && ast1.x < ast.x + ast.img.width && ast.y < ast1.y + ast1.img.height && ast1.y < ast.y + ast.img.height) {
                if(!collided){
                ast.velx *= (-1);
                ast.vely *= (-1);
                ast1.velx *= (-1);
                ast1.vely *= (-1);
                ast.update();
                ast1.update();
                collided = true;
                resetcoll();
                break;
                }}
            }
        }
    //powerups player
    for( var ki = 0,len = powerups.length; ki < len; ki++){
        b = powerups[ki];
        if(b.x < player.x+playerimg.width && player.x < b.x+powerupsize && b.y < player.y+playerimg.height && player.y < b.y+powerupsize){
            if(b.type=="speed"&&speed<9){speed++};
            if(b.type=="extralife"){lifes++};
            if(b.type=="ammu"){ammunition+=50};
            powerups.splice(ki,1);
            ki--;
            len--;
            continue;
        }
    }



    };



function render() {
    display.clear();
    display.ctx.restore();
    display.ctx.save();

    if (lifes<1){
        display.clear;
        display.ctx.fillText("GAME OVER",display.width/4,display.height/3);
        display.ctx.fillText( "your score was "+score,display.width/8,display.height/3+100);
        gameover(score)



    }else{

    for (var i = 0, len = bullets.length; i < len; i++) {
        display.drawBullet(bullets[i]);
    }
    for (var i = 0, len = enemybullets.length; i < len; i++) {
            display.drawBullet(enemybullets[i]);
    }

    for (var i = 0, len = astroids.length; i < len; i++) {
            display.drawAstroid(astroids[i]);
    }

    for (var i = 0, len = ufos.length; i < len; i++) {
            display.drawUfo(ufos[i]);
    }
    for (var i = 0, len = powerups.length; i < len; i++) {
            display.drawPowerup(powerups[i]);
    }

    display.ctx.drawImage(player.sprite,player.x,player.y);
    display.ctx.fillText(""+score,display.width-250,50);
    display.ctx.drawImage(ammuimg,0,0);
    display.ctx.fillText(""+ammunition,35,35);

    var lwidth = 20;
    var lheight = display.height-40;
    for (var l = 0; l<lifes;l++){
        display.ctx.drawImage(heart,lwidth,lheight);
        lwidth +=40;
    }}



};