//Author : Magony Róbert Miklós, CTJE64
//SECTION 0: Constants and variables that will be used all around the game.
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const gameFields = [[[0,0,0,3,1],[0,1,0,0,0],[0,0,2,0,0,],[2,0,0,3,0],[0,0,0,0,0]],[[2,1,0,0,0,0,0,0,0],[0,0,2,0,0,0,0,9,1],[0,0,0,0,0,0,0,0,0],[9,8,0,0,7,4,0,4,0],[0,0,6,0,0,0,0,8,0],[0,11,0,11,0,0,0,0,0],[0,0,7,0,0,0,0,0,0],[5,0,0,10,0,0,3,0,10],[0,5,0,0,0,0,6,0,3]],[[1,0,7,0,0,0,0,0,0],[0,0,4,0,0,0,0,7,0],[0,0,0,0,0,4,0,0,0],[0,0,6,0,0,0,0,0,6],[3,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[5,8,0,1,0,0,0,3,0],[0,5,0,0,0,0,0,0,0],[2,0,0,0,2,0,0,0,8]]]
const colors = ['','#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#9a6324', '#008080']
const menuHeight = 100
gameState = 1                   //1 = main menu, 2 = ingame
difficulty = 1                  //1 = easy, 2 = medium, 3 = hard
isDrawing = false               //are we currently drawing a line?
savedGames = [[], [], []]
field = []                      //current map(== gameFields[difficulty-1]), but we use this a lot, so 
currentLine = []
finishedLines = []
canvas.addEventListener('contextmenu', event => event.preventDefault())     //we redefine right click behaviour inside the canvas

//Initialization
if (localStorage){                  //check if browser supports localStorage
    tmp = localStorage.getItem('savedGames')                        //fetch saved game data
    savedGames = tmp != null ? JSON.parse(tmp) :  [[], [], []]      //if we found saves, load them, otherwise start with empty saves
}
drawMainMenu()                      //show the main menu

//SECTION 1: Functions responsible for events, game mechanics are found here
//SECTION 1.1: Event listeners and their functions
canvas.addEventListener('click', (e) => {
    switch (gameState){
        case(1):    //clicking in the main menu
            onMainMenuClick(e.offsetX,e.offsetY)
            break
        case(2):    //processing ingame menubar clicks, other ingame mouse events are handled separately in ingameMouseDown, ingameMouseMove and ingameMouseUp
        {
            if (e.offsetY < 75 && e.offsetY > 25) //menubar click
            {
                if (e.offsetX > 25 && e.offsetX < 100)  //main menu button
                {
                    gameState = 1
                    canvas.removeEventListener('mousedown',ingameMouseDown)
                    canvas.removeEventListener('mouseup',ingameMouseUp)
                    canvas.removeEventListener('mousemove',ingameMouseMove)     //inside the main menu we won't need these.
                    finishedLines = []
                    drawMainMenu()
                }
                else if (e.offsetX > 150 && e.offsetX < 225)    //reset button
                {
                    finishedLines = []
                    renderGame()
                }
                else if (e.offsetX > 275 && e.offsetX < 350)    //save button
                {
                    if (savedGames[difficulty - 1] != 0)        //there is already a save
                    {
                        let userMessage = confirm("Are you sure you want to overwrite your last save?")
                        if (userMessage)        //Positive answer
                        {
                            savedGames[difficulty - 1] = finishedLines.slice()              //slice is needed so we copy by value
                            localStorage.setItem('savedGames',JSON.stringify(savedGames))   //save to local storage
                        }
                    }
                    else    //no save found for this difficulty
                    {
                        savedGames[difficulty - 1] = finishedLines.slice()              //slice is needed so we copy by value
                        localStorage.setItem('savedGames',JSON.stringify(savedGames))   //save to local storage
                    }
                }
                else if (e.offsetX > 400 && e.offsetX < 475)    //load button
                {
                    finishedLines = savedGames[difficulty - 1].slice()
                    renderGame()
                }
            }
        }
    }
 })

 function ingameMouseDown(e){
    cell = [Math.floor(e.offsetX / cellSize),Math.floor((e.offsetY - menuHeight) / cellSize)]   //clicked cell's indexes
    if (e.button === 0)                             //left click
    {
        if (!isInAnyLine(cell))
        {
            isDrawing = field[cell[0]] [cell[1]] > 0     //does the starting cell have a value
            currentLine = isDrawing ? [cell] : []        //if yes, we can start drawing a line
        }
    }
    else        //not left click
    {
        if (e.button === 2)                         //right click, used to delete lines
        {
            for (let i = 0; i < finishedLines.length; ++i)      //we need to find the line we clicked
            {
                let j = 0
                while (j < finishedLines[i].length && (finishedLines[i][j][0] !== cell[0] || finishedLines[i][j][1] !== cell[1]))
                {
                    ++j
                }
                if (j < finishedLines[i].length)    //if we leave the cycle early => the point is in the last checked line => delete it
                {
                    finishedLines.splice(i,1)
                }
            }
            renderGame()    //update, so we aren't showing the deleted lines anymore
        }
    }
}

function ingameMouseMove(e){
    if (isDrawing)
    {
        currentCell = [Math.floor(e.offsetX / cellSize), Math.floor((e.offsetY - menuHeight) / cellSize)]   //current cell indexes

        if (currentCell[0] > -1 && currentCell[0] < dimension && currentCell[1] > -1 && currentCell[1] < dimension)
        {
            //If it is already in a line, or (isn't empty and it's value isn't the current line's starting value)
            if (isInAnyLine(currentCell) || (field[currentCell[0]][currentCell[1]] !== 0 && field[currentCell[0]][currentCell[1]] !== field[currentLine[0][0]][currentLine[0][1]]))
            {
                //check for backward move
                lastlastCell = currentLine.length > 1 ? [currentLine[currentLine.length - 2][0], currentLine[currentLine.length - 2][1]] : [-1,-1]
                if (currentCell[0] === lastlastCell[0] && currentCell[1] === lastlastCell[1])
                {
                    currentLine.pop()
                    renderGame()
                }
            }
            else    //not in a line and (empty cell or ending cell)
            {
                lastCell = [currentLine[currentLine.length - 1][0], currentLine[currentLine.length - 1][1]]
                if ((currentCell[0] !== lastCell[0] || currentCell[1] !== lastCell[1]) && isNeighbour(currentCell, lastCell))
                {
                    currentLine.push([currentCell[0], currentCell[1]])
                    ctx.strokeStyle = colors[field[currentLine[0][0]] [currentLine[0][1]]]
                    drawLineTo([(lastCell[0] + 0.5)*cellSize, (lastCell[1] + 0.5)*cellSize + menuHeight], [(currentCell[0] + 0.5) * cellSize, (currentCell[1] + 0.5) * cellSize + menuHeight])
                }
            }
        }
    }
 }

function ingameMouseUp(e){
    if (isDrawing)
    {
        isDrawing = false
        endCell = [Math.floor(e.offsetX / cellSize), Math.floor((e.offsetY - menuHeight) / cellSize)]
        if (field[endCell[0]][endCell[1]] === field[currentLine[0][0]][currentLine[0][1]] && !(endCell[0] === currentLine[0][0] && endCell[1] === currentLine[0][1]) && isNeighbour(endCell,currentLine[currentLine.length-1]))
        {
            finishedLines.push(currentLine)           
        }   //if the starting cell's value equals the end cell's value, and we are not in the starting field, and we didn't cheat(last cell is next to the end cell): line is valid
        
    }
    currentLine = []    //already processed, empty it
    renderGame()        //update the game: show the finished line(no visual change), or make the invalid line disappear
    let sum = 0         //used for victory check
    for (let i = 0; i < finishedLines.length; ++i)
    {
        sum += finishedLines[i].length
    }
    if (sum === dimension * dimension && e.offsetY > menuHeight)    //show win notification, but only if we won, and we are clicking on the play area(not the menu)
    {
        alert('You won!')
    }
}

function onMainMenuClick(x,y)   //handling main menu click behaviour
{                      
    if (y > 475 && y < 525)     //difficulty button height
    {
        newDifficulty = (((x - 34) % 160) < 112) ? (Math.floor((x - 34) / 160)) + 1 : difficulty    //find out which difficulty is selected
        if (newDifficulty > 0)      //newDifficulty can be 0 if we click left to the Easy button, in this case we should do nothing.
        {
            difficulty = newDifficulty
            gameState = 2               //start game
            canvas.addEventListener('mousedown', ingameMouseDown)
            canvas.addEventListener('mouseup', ingameMouseUp)
            canvas.addEventListener('mousemove', ingameMouseMove)
            finishedLines = savedGames[newDifficulty - 1].slice()
            drawGameStart()
        }
    }
}

//SECTION 1.2: Helper functions
function isInAnyLine(point){    //find out if we have already drawn a line onto a point
    let unique = true
    let j = 0
    while (j < finishedLines.length && unique)
    {
        let i = 0
        while (i < finishedLines[j].length && (point[0] !== finishedLines[j][i][0] || point[1] !== finishedLines[j][i][1]))
        {
            ++i
        }
        unique = (unique && (i >= finishedLines[j].length))
        ++j
    }
    if (unique){    //the point isn't in the finished lines, but might be in the line we're currently drawing
        for (let i = 0; i < currentLine.length; ++i)
        {
            unique = unique && !(currentLine[i][0] === point[0] && currentLine[i][1] === point[1])
        }
    }
    return !unique
}

function isNeighbour(lastCell, currentCell){    //is a cell next to another(no diagonals allowed) (pretty much only used to make conditions easier to understand / shorter)
    return (Math.abs(lastCell[0] - currentCell[0]) + Math.abs(lastCell[1] - currentCell[1]) <= 1)
}

//SECTION 2: Functions responsible for graphics
function drawMainMenu()
{
    ctx.fillStyle = '#979797'           //background color
    ctx.fillRect(0, 0, 600, 700)        //background
    ctx.fillStyle = '#000000'           //black
    ctx.fillRect(75, 50, 350, 100)      //title
    ctx.fillRect(34, 400, 432, 50)      //difficulty
    ctx.fillStyle = '#333333'           //gray
    ctx.fillRect(34, 475, 112, 50)      //easy
    ctx.fillRect(194, 475, 112, 50)     //medium
    ctx.fillRect(354, 475, 112, 50)     //hard
    ctx.fillStyle = 'white'
    ctx.font = '64px verdana'           //writing text from now on
    //there was also a play button in the middle, but according to the assignment's wording we should start immediately upon difficulty selection, so it's removed and now the UI looks a bit weird
    ctx.fillText('Flow', 185, 125)
    ctx.font = '32px verdana'
    ctx.fillText('Difficulty', 185, 435)
    ctx.font = '26px verdana'
    ctx.fillText('Easy', 58, 510)
    ctx.fillText('Medium', 199, 510)
    ctx.fillText('Hard', 378, 510)
}

function renderGame(){
    ctx.fillStyle = "#d3d3d3"               //drawing play area background
    ctx.fillRect(0,menuHeight,600,600)
    ctx.lineWidth= 15 / dimension           //lines and number size is scaled depending on the cell amount
    ctx.font=(300 / dimension).toString() + 'px verdana'
    ctx.strokeStyle = 'black'
    cellSize = canvas.getAttribute('width') / dimension
    for (let i = 0; i < dimension; ++i)     //drawing the values for each cell
    {
        for (let j = 0; j < dimension; ++j)
        {
            if (field[j][i] > 0)
            {
                xOffset = field[j][i] > 9 ? cellSize / 8 : cellSize / 3             //make numbers appear in the middle of the cell
                writeOutlinedText(field[j][i].toString(), cellSize*j + xOffset, menuHeight + cellSize*i + cellSize / 3 * 2)
            }
        } 
    }
    for (let i = 1; i < dimension; ++i)     //drawing separator lines
    {
        drawLineTo([0,menuHeight + i * cellSize], [600, menuHeight + i*cellSize])
        drawLineTo([i*cellSize, menuHeight], [i*cellSize, 700])
    }
    drawFinishedLines()               //drawing the finished lines
    if (currentLine != 0)             //select line color for current line(if it exists), depending on the starting cell's value
    {
        ctx.strokeStyle = colors[field[currentLine[0][0]] [currentLine[0][1]]]
    }
    for (let i = 0; i < currentLine.length - 1; ++i)    //draw the current line
    {
        drawLineTo([(currentLine[i][0] + 0.5) * cellSize, (currentLine[i][1] + 0.5) * cellSize + menuHeight], [(currentLine[i+1][0] + 0.5) * cellSize, (currentLine[i+1][1] + 0.5) * cellSize + menuHeight])
    }
}

function drawGameStart() {
    field = gameFields[difficulty - 1]
    dimension = field.length

    ctx.fillStyle = '#333333'           //drawing menubar
    ctx.fillRect(0, 0, 600, menuHeight)
    ctx.fillStyle = "#d3d3d3"           //drawing play area background
    ctx.fillRect(0, menuHeight, 600, 600)
    ctx.fillStyle = 'black'             //drawing menubar buttons
    ctx.fillRect(25, 25, 75, 50)        //Main menu button
    ctx.fillRect(150, 25, 75, 50)       //Reset button
    ctx.fillRect(275, 25, 75, 50)       //Save button
    ctx.fillRect(400, 25, 75, 50)       //Load button
    ctx.fillStyle = 'white'             //filling menu buttons with text
    ctx.font = '16px verdana'
    ctx.fillText("Main", 43, 47)
    ctx.fillText("menu", 39, 63)
    ctx.fillText("Reset", 165, 55)
    ctx.fillText("Save", 292, 55)
    ctx.fillText("Load", 418, 55)

    renderGame()
}

function drawFinishedLines(){           //used for drawing every line in finishedLines
    ctx.lineWidth = 5
    for (let j = 0; j < finishedLines.length; ++j){
        ctx.strokeStyle = colors[ field[ finishedLines[j][0][0]] [finishedLines[j][0][1]]]
        ctx.beginPath()
        const line = finishedLines[j]
        for (let i = 0; i < line.length - 1; ++i)
        {
            ctx.moveTo((line[i][0] + 0.5) * cellSize, (line[i][1] + 0.5) * cellSize + menuHeight)
            ctx.lineTo((line[i+1][0] + 0.5) * cellSize, (line[i+1][1] + 0.5) * cellSize + menuHeight)
        }
        ctx.stroke()
    }
}

function writeOutlinedText(s, x, y){    //makes drawing text easier
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'black'
    ctx.fillText(s, x, y)
    ctx.strokeText(s, x, y)
}

function drawLineTo(from,to){           //makes drawing lines easier
    ctx.beginPath()
    ctx.moveTo(from[0],from[1])
    ctx.lineTo(to[0],to[1])
    ctx.stroke()
}
