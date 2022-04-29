let canvas = document.getElementById('canvas')
canvas.width = innerWidth;
canvas.height = innerHeight;
let c = canvas.getContext('2d')
let x = canvas.width / 2
let y = canvas.height / 2
let player = new Player(x, y, 30, 'white')


let projectiles = []
let enemies = []
let particles = []
let scorePoint =0;
let startGame=document.getElementById("startBtn")
function spawnEnemies() {
    setInterval(() => {
        let radius = Math.random() * (30 - 5) + 5
        let x
        let y
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        let randomColor = Math.random() * 360
        let color = `hsl(${randomColor},50%,50%)`
        let angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
        let velocity = {
            x: Math.cos(angle), y: Math.sin(angle)
        }

        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000)
}

let animationId

function animate() {
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0,0,0,0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.slice(index, 1)
        } else {
            particle.update()
        }
    })
    projectiles.forEach((projectile, projectileIndex) => {
        projectile.update()
        if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(projectileIndex, 1)
            }, 0)
        }
    })
    enemies.forEach((enemy, index) => {
        enemy.update()
        //EndGame
        let dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if (dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
            document.getElementById('startTable').style.display='flex'
            document.getElementById('score2').innerHTML=scorePoint
        }
        //object touch
        projectiles.forEach((projectile, projectileIndex) => {
            let dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            if (dist - enemy.radius - projectile.radius < 1) {
                //create explosions
                for (let i = 0; i < enemy.radius*2; i++) {
                    particles.push(new Particle(projectile.x, projectile.y, Math.random()*2, enemy.color, {
                        x: (Math.random() - 0.5)*(Math.random()*6), y: (Math.random() - 0.5)*(Math.random()*6)
                    }))
                }
                if (enemy.radius - 10 > 5) {
                    enemy.radius -= 10
                    scorePoint+=20;
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                } else {
                    setTimeout(() => {
                        scorePoint+=80;
                        document.getElementById('score').innerHTML=scorePoint;
                        enemies.splice(index, 1)
                        projectiles.splice(projectileIndex, 1)
                    }, 0)

                }


            }
        })
    })
}

window.addEventListener('click', (even) => {
    let angle = Math.atan2(even.clientY - canvas.height / 2, even.clientX - canvas.width / 2)
    let velocity = {
        x: Math.cos(angle) * 4, y: Math.sin(angle) * 4
    }
    projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity))

})
animate()
startGame.addEventListener('click',()=>{
    scorePoint=0;
    animate()
    spawnEnemies()
    document.getElementById('startTable').style.display='none '
})
