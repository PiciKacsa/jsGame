const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');


gameState = 1;
/*
    1 = Main menu
    2 = Ingame
    3 = Post game menu

    Start with main menu.
*/
    x = canvas.getAttribute('width');
    y = canvas.getAttribute('height');

canvas.addEventListener('click', onClick);
function drawMainMenu()
{

    ctx.fillRect(x/8,y/12,6*x/8,2*y/12); //title

    ctx.fillRect(3*x/8, 5*y/12, 2*x/8, y/12); //play
    ctx.fillRect(1.25*x/8, 8*y/12, 5.5*x/8, y/12); //difficulty

    ctx.fillRect(1.25*x/8, 9.5*y/12, 1.5*x/8, y/12);
    ctx.fillRect(3.25*x/8, 9.5*y/12, 1.5*x/8, y/12);
    ctx.fillRect(5.25*x/8, 9.5*y/12, 1.5*x/8, y/12);
}

function onClick(e){
    switch (gameState){
        case(1):
        {
           //if (e.clientX - canvas.offsetLeft > )
            console.log(e.clientX - canvas.offsetLeft);
            console.log(e.clientY - canvas.offsetTop);
        }
        case(2):
        {

        }
        case(3):
        {

        }
    }
}

drawMainMenu();