
const canvas  = document.getElementById("canvas");
const context = canvas.getContext("2d");
const addPersonButton = document.getElementById("addPerson");
const addInfectedButton = document.getElementById("infected");
const max     = canvas.width;
context.fillStyle = "black";

const radius = 10;

const balls = [ ] ;

add = infected => _evt => balls.push(      // anonymous object, no Ball constructor
    {x: max / 2,               y: max / 2,
     dx: Math.random()*4 - 2 , dy: Math.random()*4 - 2 ,
     infected : infected } );

addPersonButton.onclick   = add(false);
addInfectedButton.onclick = add(true);

function start() {
    setInterval(nextBoard, 1000 / 50);
}

function display(ball) {
    context.fillStyle = "gold";
    fillBox(ball, radius + 1);

    context.fillStyle = ball.infected ? "red":"black";
    ball.x = (ball.x + max + ball.dx) % max;
    ball.y = (ball.y + max + ball.dy) % max;
    fillBox(ball, radius);
}
const touching = (a,b) => (a.x - b.x)**2 + (a.y - b.y)**2 < radius**2;

function nextBoard() {
    const infected = [];
    const uninfected = [];
    balls.forEach( ball => ball.infected ? infected.push(ball) : uninfected.push(ball));
    infected.forEach(infectedPerson =>
        uninfected.forEach(uninfectedPerson => {
         if (touching(infectedPerson, uninfectedPerson)) {
             uninfectedPerson.infected = true;
         }
        }));

    balls.forEach(display);
}

function fillBox(ball, radius) {
    context.beginPath();
    context.arc(ball.x, ball.y, radius, 0, 6.3, false);
    context.fill();
}


