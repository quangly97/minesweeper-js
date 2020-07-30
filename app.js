document.addEventListener('DOMContentLoaded', () => {
    const width = 18;
    const height = 14;
    const area = width*height;
    const bombs = 40;
    let flags = 0;
    const squares = [];
    const grid = document.querySelector('.grid');
    let gameOver = false
    const flagsRemaining = document.querySelector('#flags-remaining');
    const result = document.querySelector('#result');
    let time = 0;
    const clock = document.querySelector('#time');

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

    createGrid();

    function click(square){
        if(gameOver){
            return;
        }
        if(square.classList.contains('flag') || square.classList.contains('clicked')){
            return;
        }
        if (square.classList.contains('bomb')) {
            explode();
        }else{
            total = square.getAttribute('total')
            if(total != 0){
                square.classList.add('clicked')
                square.innerHTML = total;
                removeColor(square);
                if(total == 1){
                    square.classList.add('one')
                }else if (total == 2) {
                    square.classList.add('two')
                }else if (total == 3) {
                    square.classList.add('three')
                }else if (total == 4) {
                    square.classList.add('four')
                }else if (total == 5) {
                    square.classList.add('five')
                }else{
                    square.classList.add('large')
                }
                return
            }
            expandArea(square.id);
        }
        removeColor(square);
        square.classList.add('clicked');
    }

    function expandArea(currentId){
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width - 1);

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const nextId = squares[parseInt(currentId) - 1].id;
                const nextSquare = document.getElementById(nextId);
                click(nextSquare);
            }
            if (currentId > width - 1 && !isRightEdge) {
                const nextId = squares[parseInt(currentId) + 1 - width].id;
                const nextSquare = document.getElementById(nextId);
                click(nextSquare);
            }
            if (currentId > width) {
                const nextId = squares[parseInt(currentId) - width].id;
                const nextSquare = document.getElementById(nextId);
                click(nextSquare);
            }
            if (currentId > width + 1 && !isLeftEdge) {
                const nextId = squares[parseInt(currentId) - 1 - width].id;
                const nextSquare = document.getElementById(nextId);
                click(nextSquare);
            }
            if (currentId < area - 2 && !isRightEdge) {
                const nextId = squares[parseInt(currentId) + 1].id;
                const nextSquare = document.getElementById(nextId);
                click(nextSquare);
            }
            if (currentId < area - width && !isLeftEdge) {
                const nextId = squares[parseInt(currentId) - 1 + width].id;
                const nextSquare = document.getElementById(nextId);
                click(nextSquare);
            }
            if (currentId < area - 2 - width && !isRightEdge) {
                const nextId = squares[parseInt(currentId) + 1 + width].id;
                const nextSquare = document.getElementById(nextId);
                click(nextSquare);
            }
            if (currentId < area - width) {
                const nextId = squares[parseInt(currentId) + width].id;
                const nextSquare = document.getElementById(nextId);
                click(nextSquare);
            }
        }, 10)
    }

    function removeColor(square){
        if(square.classList.contains('green')){
            square.classList.remove('green');
            square.classList.add('darktan');
        }else if(square.classList.contains('chartreuse')){
            square.classList.remove('chartreuse');
            square.classList.add('tan');
        }
    }

    function addColor(square, color){
        if (square.id % width === 0) {
            color = !color;
        }
        if (color) {
            square.classList.add('green');
        } else {
            square.classList.add('chartreuse');
        }
        return !color;
    }

    function addFlag(square){
        if(!gameOver){
            if (!square.classList.contains('flag') && !square.classList.contains('clicked') && flags < bombs) {
                square.classList.add('flag');
                square.innerHTML = '🚩';
                flags++;
                flagsRemaining.innerHTML = bombs - flags;
                checkForWin();
            } else if(square.classList.contains('flag')){
                square.classList.remove('flag');
                square.innerHTML = '';
                flags--;
                flagsRemaining.innerHTML = bombs - flags;
            }
        }
    }

    function explode(){
        gameOver = true;
        for(let i = 0; i < area; i++){
            if(squares[i].classList.contains('bomb')){
                squares[i].innerHTML = '💣';
            }
        }
    }

    function checkForWin(){
        let found = 0;
        for(let i = 0; i < area; i++){
            if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')){
                found++;
            }
        }
        if (found === bombs) {
            result.innerHTML = 'You Win';
            gameOver = true;
        }
    }
})