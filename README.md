# Minesweeper Webpage

## Brief
A webpage to play minesweeper

## Functions
* createGrid()
* click(square)
* expandArea(id)
* removeColor(square)
* addColor(square, color)
* addFlag(square)
* explode()
* checkForWin()

## Technologies Used
* HTML5
* CSS3
* Javascript
* Git
* Github

## Sample Code
```
function createGrid(){
    flagsRemaining.innerHTML = bombs;

    setInterval(() => {
        if(!gameOver){
            time++;
            clock.innerHTML = time;
        }
    }, 1000)

    bombsArray = Array(bombs).fill('bomb');
    validArray = Array(area - bombs).fill('valid');
    combinedArray = bombsArray.concat(validArray);
    shuffledArray = combinedArray.sort(() => Math.random() - 0.5)
    color = true;

    for(let i = 0; i < area; i++){
        const square = document.createElement('div');
        square.setAttribute('id', i);
        square.classList.add(shuffledArray[i]);
        color = addColor(square, color)
        grid.appendChild(square);
        squares.push(square);

        square.addEventListener("click", () => {
            click(square);
        })

        square.oncontextmenu = e => {
            event.preventDefault();
            addFlag(square);
        }
    }

    for(let i = 0; i < squares.length; i++){
        let total = 0;
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width - 1);
        
        if(squares[i].classList.contains('valid')){
            if (squares[i].id > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) {
                total++;
            }
            if (squares[i].id > width - 1 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) {
                total++;
            }
            if (squares[i].id > width && squares[i - width].classList.contains('bomb')) {
                total++;
            }
            if (squares[i].id > width + 1 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) {
                total++;
            }
            if (squares[i].id < area - 2 && !isRightEdge && squares[i + 1].classList.contains('bomb')) {
                total++;
            }
            if (squares[i].id < area - width && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) {
                total++;
            }
            if (squares[i].id < area - width - 2 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) {
                total++;
            }
            if (squares[i].id < area - width && squares[i + width].classList.contains('bomb')) {
                total++;
            }
        }
        squares[i].setAttribute('total', total);
    }
}
```
