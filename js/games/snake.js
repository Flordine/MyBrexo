/* ==========================================
   JEU SNAKE - Version Éducative Commentée
   ========================================== */

// 1. INITIALISATION DES VARIABLES
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // On récupère le "pinceau" pour dessiner

// Taille d'une case (un carré du serpent)
const box = 20; 

// Le Serpent (c'est un tableau de coordonnées)
// Au début, il a une seule case au centre (10 * 20 = 200px)
let snake = [];
snake[0] = { x: 10 * box, y: 10 * box };

// La Pomme (position aléatoire)
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

// Le Score
let score = 0;

// La Direction (au début, il ne bouge pas)
let d;

// Vitesse du jeu (l'intervalle)
let game; 

// ==========================================
// 2. FONCTIONS DU JEU
// ==========================================

// Fonction déclenchée quand on clique sur le bouton "Jouer"
function startSnake() {
    // On cache la liste des jeux et on montre le jeu
    document.getElementById('games-list').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    
    // On écoute les touches du clavier
    document.addEventListener("keydown", direction);
    
    // On lance la boucle du jeu (draw est appelé toutes les 100ms)
    game = setInterval(draw, 150); 
}

// Fonction pour changer la direction
function direction(event) {
    let key = event.keyCode;
    // 37=Gauche, 38=Haut, 39=Droite, 40=Bas
    // On empêche de faire demi-tour direct (ex: aller à droite si on va à gauche)
    if(key == 37 && d != "RIGHT") d = "LEFT";
    else if(key == 38 && d != "DOWN") d = "UP";
    else if(key == 39 && d != "LEFT") d = "RIGHT";
    else if(key == 40 && d != "UP") d = "DOWN";
}

// Fonction pour détecter les collisions (mur ou soi-même)
function collision(head, array) {
    for(let i = 0; i < array.length; i++) {
        if(head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

// ==========================================
// 3. BOUCLE PRINCIPALE (DESSIN)
// ==========================================
function draw() {
    
    // A. On efface tout (fond noir)
    ctx.fillStyle = "#222"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // B. On dessine le serpent
    for(let i = 0; i < snake.length; i++) {
        // Couleur : Vert pour la tête, blanc pour le corps
        ctx.fillStyle = (i == 0) ? "#10B981" : "white"; 
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        
        // Bordure des cases
        ctx.strokeStyle = "#222";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // C. On dessine la pomme
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // D. On calcule la nouvelle position de la tête
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(d == "LEFT") snakeX -= box;
    if(d == "UP") snakeY -= box;
    if(d == "RIGHT") snakeX += box;
    if(d == "DOWN") snakeY += box;

    // E. Gestion Manger la pomme vs Bouger
    if(snakeX == food.x && snakeY == food.y) {
        // Si on mange : le score augmente, on ne retire pas la queue (donc il grandit)
        score++;
        document.getElementById('score').innerText = score;
        // Nouvelle pomme aléatoire
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        // Si on ne mange pas : on retire la queue (mouvement normal)
        snake.pop();
    }

    // F. Nouvelle Tête
    let newHead = { x: snakeX, y: snakeY };

    // G. Game Over (Mur ou collision soi-même)
    if(snakeX < 0 || snakeX > canvas.width - box || 
       snakeY < 0 || snakeY > canvas.height - box || 
       collision(newHead, snake)) {
        
        clearInterval(game); // Stop le jeu
        alert("Game Over ! Score : " + score);
        location.reload(); // Recharge la page
    }

    // H. Ajouter la nouvelle tête au tableau
    snake.unshift(newHead);
}