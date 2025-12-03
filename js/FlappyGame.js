class FlappyGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // --- PARAMÈTRES DU JEU ---
        this.gravity = 0.6;     // Force qui tire l'oiseau vers le bas
        this.lift = -10;        // Force du saut (vers le haut)
        this.speed = 3;         // Vitesse de défilement des tuyaux
        
        // --- ÉTAT DU JEU ---
        this.bird = {
            x: 50,
            y: 150,
            velocity: 0,        // Vitesse actuelle de chute
            radius: 12
        };
        
        this.pipes = [];        // Tableau pour stocker les obstacles
        this.score = 0;
        this.isGameOver = false;
        this.frameCount = 0;    // Compteur pour savoir quand créer un tuyau

        // Démarrage
        this.addControls();
        this.loop = setInterval(() => this.update(), 20); // 50 images par seconde
    }

    addControls() {
        // Sauter avec la barre d'espace
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') this.jump();
        });
        // Sauter avec le clic souris
        this.canvas.addEventListener('mousedown', () => this.jump());
    }

    jump() {
        if (this.isGameOver) {
            this.reset();
        } else {
            this.bird.velocity = this.lift; // On donne une vitesse négative (vers le haut)
        }
    }

    update() {
        if (this.isGameOver) return;

        // 1. PHYSIQUE DE L'OISEAU (GRAVITÉ)
        this.bird.velocity += this.gravity; // La vitesse augmente (chute accélérée)
        this.bird.y += this.bird.velocity;  // On change la position

        // 2. GESTION DES TUYAUX
        this.frameCount++;
        if (this.frameCount % 90 === 0) { // Tous les 90 cycles, on ajoute un tuyau
            this.addPipe();
        }

        // Bouger les tuyaux vers la gauche
        this.pipes.forEach(pipe => {
            pipe.x -= this.speed;
        });

        // Supprimer les tuyaux sortis de l'écran
        this.pipes = this.pipes.filter(pipe => pipe.x + pipe.w > 0);

        // 3. COLLISIONS (Mort)
        // Toucher le sol ou le plafond
        if (this.bird.y + this.bird.radius > this.canvas.height || this.bird.y - this.bird.radius < 0) {
            this.gameOver();
        }

        // Toucher un tuyau
        this.pipes.forEach(pipe => {
            // Logique de collision rectangle vs cercle (simplifiée)
            if (
                this.bird.x + this.bird.radius > pipe.x && 
                this.bird.x - this.bird.radius < pipe.x + pipe.w &&
                (this.bird.y - this.bird.radius < pipe.top || this.bird.y + this.bird.radius > pipe.bottom)
            ) {
                this.gameOver();
            }
            
            // Score : si l'oiseau passe pile au milieu du tuyau
            if (pipe.x === 50) {
                this.score++;
                document.getElementById('score-display').innerText = "Score: " + this.score;
            }
        });

        // 4. DESSINER TOUT
        this.draw();
    }

    addPipe() {
        let gap = 120; // Espace pour passer
        let topHeight = Math.floor(Math.random() * (this.canvas.height / 2));
        
        this.pipes.push({
            x: this.canvas.width,
            w: 40,              // Largeur du tuyau
            top: topHeight,     // Hauteur du tuyau du haut
            bottom: topHeight + gap // Position de départ du tuyau du bas
        });
    }

    draw() {
        // Effacer l'écran (Ciel)
        this.ctx.fillStyle = "#70c5ce";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner l'Oiseau (Jaune)
        this.ctx.fillStyle = "yellow";
        this.ctx.beginPath();
        this.ctx.arc(this.bird.x, this.bird.y, this.bird.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Dessiner les Tuyaux (Verts)
        this.ctx.fillStyle = "#228b22";
        this.pipes.forEach(pipe => {
            // Tuyau du haut
            this.ctx.fillRect(pipe.x, 0, pipe.w, pipe.top);
            // Tuyau du bas
            this.ctx.fillRect(pipe.x, pipe.bottom, pipe.w, this.canvas.height - pipe.bottom);
            
            // Bordures noires pour le style
            this.ctx.strokeRect(pipe.x, 0, pipe.w, pipe.top);
            this.ctx.strokeRect(pipe.x, pipe.bottom, pipe.w, this.canvas.height - pipe.bottom);
        });
    }

    gameOver() {
        this.isGameOver = true;
        this.ctx.fillStyle = "white";
        this.ctx.font = "30px Arial";
        this.ctx.fillText("Perdu !", 110, 200);
        this.ctx.font = "20px Arial";
        this.ctx.fillText("Appuie pour rejouer", 80, 240);
    }

    reset() {
        this.bird.y = 150;
        this.bird.velocity = 0;
        this.pipes = [];
        this.score = 0;
        this.frameCount = 0;
        this.isGameOver = false;
        document.getElementById('score-display').innerText = "Score: 0";
    }   
}
