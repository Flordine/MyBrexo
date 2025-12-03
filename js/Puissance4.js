class Puissance4 {
    constructor(elementId, statusId) {
        this.boardElement = document.getElementById(elementId);
        this.statusElement = document.getElementById(statusId);
        
        this.rows = 6; // 6 lignes
        this.cols = 7; // 7 colonnes
        this.player = 'red'; // Le rouge commence
        this.isGameOver = false;
        
        // Création de la grille en mémoire (tableau vide)
        this.grid = []; 
        
        this.init();
    }

    init() {
        this.grid = [];
        this.isGameOver = false;
        this.player = 'red';
        this.updateStatus();
        this.drawBoard();
    }

    // Dessine le plateau HTML et vide la grille mémoire
    drawBoard() {
        this.boardElement.innerHTML = ''; // Vider l'affichage
        
        for (let r = 0; r < this.rows; r++) {
            const row = [];
            for (let c = 0; c < this.cols; c++) {
                // On prépare la grille mémoire
                row.push(null); 
                
                // On crée la case HTML
                const cell = document.createElement('div');
                cell.classList.add('cell');
                
                // L'astuce : on clique sur une case, mais ça joue dans la COLONNE
                cell.dataset.col = c; 
                cell.addEventListener('click', () => this.handleMove(c));
                
                this.boardElement.appendChild(cell);
            }
            this.grid.push(row);
        }
    }

    handleMove(colIndex) {
        if (this.isGameOver) return;

        // 1. GRAVITÉ : Trouver la première case vide en partant du BAS
        for (let r = this.rows - 1; r >= 0; r--) {
            if (!this.grid[r][colIndex]) { // Si la case est vide
                this.grid[r][colIndex] = this.player; // On remplit la mémoire
                this.updateCellVisual(r, colIndex); // On met à jour l'écran
                
                if (this.checkWin(r, colIndex)) {
                    this.statusElement.innerHTML = `Victoire du joueur ${this.player.toUpperCase()} ! 🎉`;
                    this.isGameOver = true;
                } else if (this.checkDraw()) {
                    this.statusElement.innerHTML = "Match Nul ! 🤝";
                    this.isGameOver = true;
                } else {
                    // Changer de joueur
                    this.player = this.player === 'red' ? 'yellow' : 'red';
                    this.updateStatus();
                }
                return; // On arrête la boucle, le jeton est posé
            }
        }
        // Si on arrive ici, c'est que la colonne est pleine !
        alert("Colonne pleine !");
    }

    updateCellVisual(row, col) {
        // Calcul de l'index unique pour retrouver la div (Ligne * 7 + Colonne)
        const index = row * this.cols + col;
        const cell = this.boardElement.children[index];
        cell.classList.add(this.player); // Ajoute la classe .red ou .yellow
    }

    updateStatus() {
        const color = this.player === 'red' ? 'Rouge' : 'Jaune';
        const colorStyle = this.player === 'red' ? 'red' : '#e6a800';
        this.statusElement.innerHTML = `Au tour du joueur : <span style="color:${colorStyle}">${color}</span>`;
    }

    checkDraw() {
        // Si la ligne du haut est pleine partout, c'est match nul
        return this.grid[0].every(cell => cell !== null);
    }

    // --- LOGIQUE DE VICTOIRE (Un peu complexe !) ---
    checkWin(row, col) {
        const directions = [
            [0, 1],  // Horizontal
            [1, 0],  // Vertical
            [1, 1],  // Diagonale descendante (\)
            [1, -1]  // Diagonale montante (/)
        ];

        return directions.some(([dr, dc]) => {
            return this.countConsecutive(row, col, dr, dc) + 
                   this.countConsecutive(row, col, -dr, -dc) - 1 >= 4;
        });
    }

    countConsecutive(r, c, dr, dc) {
        const color = this.grid[r][c];
        let count = 0;
        
        // On avance tant qu'on est dans la grille et que c'est la même couleur
        while (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.grid[r][c] === color) {
            count++;
            r += dr;
            c += dc;
        }
        return count;
    }

    reset() {
        this.init();
    }
}