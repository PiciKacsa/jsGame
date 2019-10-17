const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
gameState = 1;
/*
    1 = Main menu
    2 = Difficulty selection menu
    3 = Ingame
    4 = Post game menu

    Start with main menu.
*/
canvas.addEventListener('click', onClick);
function drawMainMenu()
{
    x = canvas.getAttribute('width');
    y = canvas.getAttribute('height');
    ctx.fillRect(x/8,y/12,6*x/8,2*y/12); //title

    ctx.fillRect(3*x/8, 5*y/12, 2*x/8, y/12); //play
    ctx.fillRect(3*x/8, 8*y/12, 2*x/8, y/12); //about
}

function onClick(e){
    switch (gameState){
        case(1):
        {
            console.log(e.clientX);
        }
    }
}

drawMainMenu();