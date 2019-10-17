const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')


gameState = 1
difficulty = 1
/*
    1 = Main menu
    2 = Ingame
    3 = Post game menu

    Start with main menu.
*/
    canvasW = canvas.getAttribute('width')
    canvasH = canvas.getAttribute('height')

canvas.addEventListener('click', onClick)
function drawMainMenu()
{
    ctx.fillRect(75,50,450,100) //title

    ctx.fillRect(175, 225, 250, 100) //play
    ctx.fillRect(93, 400, 412, 50) //difficulty

    ctx.fillRect(93, 475, 112, 50)
    ctx.fillRect(243, 475, 112, 50)
    ctx.fillRect(393, 475, 112, 50)

    ctx.save()
    ctx.fillStyle = '#333333'
    switch (difficulty){
        case(1):
            ctx.fillRect(93, 475, 112, 50)
            break
        case(2):
            ctx.fillRect(243, 475, 112, 50)
            break
        case(3):
            ctx.fillRect(393, 475, 112, 50)
            break
    }
    ctx.restore()
}

function onClick(e){
    x = e.clientX - canvas.offsetLeft
    y = e.clientY - canvas.offsetTop
    switch (gameState){
        case(1):
            onMainMenuClick(x,y)
            break
        case(2):
        {

        }
        case(3):
        {

        }
    }
}

function drawGameStart() {
    switch (difficulty){
        case (1):
            field = 
            [
                [0,0,0,2,0],
                [0,1,0,0,0],
                [0,0,2,0,0],
                [3,0,0,3,0],
                [1,0,0,0,0],
            ]
            dimension = 5
            break
        case (2):
            field =
            [
                [2,0,0,9,0,0,0,5,0],
                [1,0,0,8,0,11,0,0,5],
                [0,2,0,0,6,0,7,0,0],
                [0,0,0,0,0,11,0,10,0],
                [0,0,0,7,0,0,0,0,0],
                [0,0,0,4,0,0,0,0,0],
                [0,0,0,0,0,0,0,3,6],
                [0,9,0,4,8,0,0,0,0],
                [0,1,0,0,0,0,0,10,3],
            ]
            dimension = 9
            break
        case (3):
            field =
            [
                [1,0,0,0,3,0,5,0,2],
                [0,0,0,0,0,0,8,5,2],
                [7,4,0,6,0,0,0,0,0],
                [0,0,0,0,0,0,1,0,0],
                [0,0,0,0,0,0,0,0,2],
                [0,0,4,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,7,0,0,0,0,3,0,0],
                [0,0,0,6,0,0,0,0,8],
            ]
            dimension = 9
            break
    }

    ctx.fillStyle = "#d3d3d3"
    ctx.fillRect(0,0,600,600)

    ctx.fillStyle='white'
    ctx.strokeStyle='black'
    ctx.lineWidth= 15 / dimension
    ctx.font=(300 / dimension).toString() + 'px verdana'

    cellSize = canvasW / dimension
    for (i = 0; i < dimension; ++i)
    {
        for (j = 0; j < dimension; ++j)
        {
            if (field[i][j] > 0)
            {
                xOffset = field[i][j] > 9 ? cellSize / 5 : cellSize / 3
                ctx.fillText(field[i][j].toString(),canvasW/dimension*j + xOffset,canvasH/dimension*i + cellSize / 3 * 2)
                ctx.strokeText(field[i][j],canvasW/dimension*j + xOffset,canvasH/dimension*i + cellSize / 3 * 2)
            }
        } 
    }

    ctx.strokeStyle = 'black'
    for (i = 1; i < dimension; ++i)
    {
        ctx.beginPath()
        ctx.moveTo(0,i*canvasW/dimension)
        ctx.lineTo(600,i*canvasW/dimension)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(i*canvasH/dimension,0)
        ctx.lineTo(i*canvasH/dimension,600)
        ctx.stroke()
    }

    dimension = difficulty > 1 ? 9 : 5
    lastI = lastJ = -1
    startingValue = -2
    let moved
    function downListener(e){
        moved = false
        
        i = Math.floor((e.clientX - canvas.offsetLeft)/cellSize)
        j = Math.floor((e.clientY - canvas.offsetTop)/cellSize)
        if (field[j][i] > 0)
        {
            console.log('Good!' + field[j][i])
            lastI = i
            lastJ = j
        }
        startingValue = field[j][i]
    }
    canvas.addEventListener('mousedown', downListener)
    function moveListener(e){
        cellSize = Math.floor(canvasH / dimension)
        i = Math.floor((e.clientX - canvas.offsetLeft)/cellSize)
        j = Math.floor((e.clientY - canvas.offsetTop)/cellSize)
        console.log(i + ' ' + j)
        if (i != lastI || j != lastJ)
        {
            console.log('Felig jo')
            if ((field[j][i] == 0 || field[j][i] == startingValue) && (Math.abs(i-lastI) + Math.abs(j - lastJ)) < 2)
            {
                console.log('We are in')
                ctx.strokeStyle = 'red'
                ctx.beginPath()
                ctx.moveTo(lastI*cellSize + cellSize / 2, lastJ*cellSize + cellSize / 2)
                ctx.lineTo(i*cellSize + cellSize / 2, j * cellSize + cellSize / 2)
                ctx.stroke()
                lastI = i;
                lastJ = j;
            }
        }
        
    }
    canvas.addEventListener('mousemove', moveListener)
    let upListener = () => {
        lastI = lastJ = -2;
    }
canvas.addEventListener('mouseup', upListener)
}

function onMainMenuClick(x,y){
    if (x > 175 && x < 425 && y > 225 && y < 325)   //play button
            {
                gameState = 2 //start game
                drawGameStart()
            }
            else
            {
                newDifficulty = difficulty
                if (y > 475 && y < 525) //in difficulty area
                {
                    if (x > 93 && x < 205)  //easy
                    {
                        newDifficulty = 1
                    }
                    else if(x > 243 && x < 355) //medium
                    {
                        newDifficulty = 2
                    }
                    else if(x > 393 && x < 505) //hard
                    {
                        newDifficulty = 3
                    }
                }
                if (newDifficulty != difficulty)
                {
                    difficulty = newDifficulty
                    drawMainMenu()
                }
            }
}

drawMainMenu()