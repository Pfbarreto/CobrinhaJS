const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const audio = new Audio('../assets/audio.mp3')

const size = 30

const snake = [
    {x:0 , y:0},
    {x:30, y:0}
]


function random_number(min, max){
    return Math.round(Math.random()*(max-min)+min)
}

function random_position(){
    const number = random_number(0,canvas.width - size)
    return Math.round(number/30)*30
}

function random_color(){
    const red = random_number(0, 255)
    const green = random_number(0, 255)
    const blue = random_number(0, 255)
    return `rgb(${red},${green},${blue})`
}

const food = {
    x: random_position(),
    y:random_position(),
    color: random_color()
}


let direcao
let loopid


function draw_snake () {
    ctx.fillStyle = "#ddd"
    snake.forEach((posicao, index) => {
        if (index == snake.length - 1){
            ctx.fillStyle = "white"
        }
        ctx.fillRect(posicao.x, posicao.y, size, size)

    })
}

function draw_food(){
    const {x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 10
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}


function move_snake(){
    if (!direcao) return


    const cabeca = snake[snake.length - 1]
    
    
     
    if (direcao == "right"){
        snake.push({x: cabeca.x + size, y: cabeca.y})
    }

    if (direcao == "left"){
        snake.push({x: cabeca.x - size, y: cabeca.y})
    }
    
    if (direcao == "up"){
        snake.push({x:cabeca.x, y:cabeca.y - size})
    }

    if (direcao == "down"){
        snake.push({x:cabeca.x, y:cabeca.y + size})
    }


    snake.shift()

}

function draw_grid(){
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i=30; i < canvas.width ; i+=30){
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, canvas.width)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
    }

}

function comeu(){
    const cabeca = snake[snake.length-1]
    if(cabeca.x == food.x && cabeca.y == food.y){
        snake.push(cabeca)
        audio.play()

        let x = random_position()
        let y = random_position()

        while(snake.find((posicao)=> posicao.x == x && posicao.y == y)){
            x = random_position()
            y = random_position()

        }
        food.x = x
        food.y = y
        food.color = random_color()


    }
}

function colisao(){
    const cabeca = snake[snake.length-1]
    const corpo = snake.length - 2

    const borda_canvas = cabeca.x < 0 || cabeca.x > canvas.width-size || cabeca.y<0 || cabeca.y > canvas.height - size

    const colisao_corpo = snake.find((position, index)=>{
        return index < corpo && position.x == cabeca.x && position.y == cabeca.y
    })

    if (borda_canvas || colisao_corpo){
        alert('vc perdeu huehue')
    }
}

function game_over(){
    direcao = undefined
}


function gameloop(){
    clearInterval(loopid)
    ctx.clearRect(0, 0, 600, 600)
    draw_grid()
    draw_food()
    move_snake()
    draw_snake()
    comeu()
    colisao()

    loopid = setTimeout(()=>{
        gameloop()
    }, 200)

}
gameloop()



document.addEventListener("keydown",({key})=> {
    if (key == "ArrowRight" && direcao != "left"){
        direcao = "right"
    }
    if (key == "ArrowLeft" && direcao != "right"){
        direcao = "left"
    }
    if (key == "ArrowDown" && direcao != "up"){
        direcao = "down"
    }
    if (key == "ArrowUp" && direcao != "down"){
        direcao = "up"
    }
})

