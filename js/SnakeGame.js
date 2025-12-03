class SnakeGame {
    constructor(canvasId, scoreId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d'); // Le pinceau pour dessiner
        this.scoreElement = document.getElementById(scoreId);
        
        // Configuration du jeu
        this.gridSize = 20; // Taille d'un carré (serpent ou pomme)
        this.tileCount = this.canvas.width / this.gridSize; // Nombre de cases (20x20)
        
        // Vitesse du jeu (plus le chiffre est bas, plus c'est rapide)
        this.speed = 100; 
        
        this.init();
    }

    init() {
        // Position de départ du serpent (au milieu)
        this.positionX = 10;
        this.positionY = 10;
        
        // Vitesse de déplacement (X=0, Y=0 signifie qu'il ne bouge pas encore)
        this.velocityX = 0;
        this.velocityY = 0;
        
        // Le corps du serpent (tableau de positions)
        this.trail = [];
        this.tailLength = 5; // Taille de départ
        
        // Position de la pomme
        this.appleX = 15;
        this.appleY = 15;
        
        this.score = 0;

        // Écouter les touches du clavier
        document.addEventListener('keydown', this.keyPush.bind(this));

        // Lancer la boucle du jeu (répéter la fonction 'gameLoop' en continu)
        this.interval = setInterval(() => this.gameLoop(), this.speed);
    }

    gameLoop() {
        // 1. Calculer la nouvelle position
        this.positionX += this.velocityX;
        this.positionY += this.velocityY;

        // 2. Gestion des murs (si on sort, on réapparaît de l'autre côté)
        if (this.positionX < 0) this.positionX = this.tileCount - 1;
        if (this.positionX > this.tileCount - 1) this.positionX = 0;
        if (this.positionY < 0) this.positionY = this.tileCount - 1;
        if (this.positionY > this.tileCount - 1) this.positionY = 0;

        // 3. Dessiner le fond noir (pour effacer l'image précédente)
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 4. Dessiner le serpent
        this.ctx.fillStyle = 'lime'; // Vert
        for (let i = 0; i < this.trail.length; i++) {
            // Dessine chaque segment du serpent
            this.ctx.fillRect(
                this.trail[i].x * this.gridSize, 
                this.trail[i].y * this.gridSize, 
                this.gridSize - 2, // -2 pour laisser un petit espace entre les carrés
                this.gridSize - 2
            );

            // Vérifier si le serpent se mord la queue (Game Over)
            if (this.trail[i].x === this.positionX && this.trail[i].y === this.positionY) {
                // Si on bouge et qu'on touche sa queue -> Reset
                if(this.velocityX !== 0 || this.velocityY !== 0) {
                    this.reset();
                }
            }
        }

        // Ajouter la nouvelle position de la tête au tableau
        this.trail.push({ x: this.positionX, y: this.positionY });

        // Si le serpent est trop long (il a avancé mais n'a pas mangé), on coupe la queue
        while (this.trail.length > this.tailLength) {
            this.trail.shift(); // Enlève le premier élément du tableau (la fin de la queue)
        }

        // 5. Dessiner la pomme
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(
            this.appleX * this.gridSize, 
            this.appleY * this.gridSize, 
            this.gridSize - 2, 
            this.gridSize - 2
        );

        // 6. Manger la pomme
        if (this.positionX === this.appleX && this.positionY === this.appleY) {
            this.tailLength++; // On grandit
            this.score += 10;  // On gagne des points
            this.scoreElement.innerHTML = this.score;
            
            // Nouvelle position aléatoire pour la pomme
            this.appleX = Math.floor(Math.random() * this.tileCount);
            this.appleY = Math.floor(Math.random() * this.tileCount);
        }
    }

    keyPush(evt) {
        // Gestion des flèches directionnelles
        switch (evt.keyCode) {
            case 37: // Gauche
                if(this.velocityX !== 1) { this.velocityX = -1; this.velocityY = 0; }
                break;
            case 38: // Haut
                if(this.velocityY !== 1) { this.velocityX = 0; this.velocityY = -1; }
                break;
            case 39: // Droite
                if(this.velocityX !== -1) { this.velocityX = 1; this.velocityY = 0; }
                break;
            case 40: // Bas
                if(this.velocityY !== -1) { this.velocityX = 0; this.velocityY = 1; }
                break;
        }
    }

    reset() {
        this.tailLength = 5;
        this.score = 0;
        this.scoreElement.innerHTML = "0";
        this.positionX = 10;
        this.positionY = 10;
        this.velocityX = 0;
        this.velocityY = 0;
        alert("Perdu ! Recommence.");
    }
}