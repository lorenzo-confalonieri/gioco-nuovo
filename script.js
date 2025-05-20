// Funzione che avvia il gioco
function startGame() {
    myGamePiece.loadImages(running); // Carica le immagini di animazione del personaggio
    myGameArea.start(); // Avvia il canvas e il ciclo di gioco
}

// Funzione per caricare un'immagine e restituirla come oggetto Image
function loadImage(src) {
    const img = new Image(); // Crea un nuovo oggetto immagine
    img.src = src;           // Imposta il percorso dell'immagine
    return img;              // Restituisce l'immagine caricata
}

// Variabile che tiene il punteggio del giocatore
let score = 0;

// Costanti di gioco
const gravity = 0.7;     // Gravità applicata al personaggio
const jumpForce = -18;   // Forza del salto verso l'alto
const moveSpeed = 5;     // Velocità di movimento orizzontale
let isJumping = false;   // Indica se il personaggio sta saltando

// Oggetto che rappresenta il personaggio principale
const myGamePiece = {
    speedX: 0, // Velocità orizzontale
    speedY: 0, // Velocità verticale
    width: 60, // Larghezza sprite
    height: 60, // Altezza sprite
    x: 10, // Posizione iniziale X
    y: 210, // Posizione iniziale Y
    imageList: [], // Lista dei frame per l'animazione
    contaFrame: 0, // Contatore per cambiare frame
    actualFrame: 0, // Frame attuale
    image: null, // Immagine attuale da disegnare
    tryX: 0, // X provvisoria per collisioni
    tryY: 0, // Y provvisoria per collisioni

    // Aggiorna posizione, animazione e gestisce collisioni con piattaforme
    update: function () {
        this.speedY += gravity; // Applica la gravità
        this.tryY = this.y + this.speedY; // Calcola nuova Y
        this.tryX = this.x + this.speedX; // Calcola nuova X

        let onPlatform = false; // Indica se il personaggio è su una piattaforma
        for (let platform of platforms) { // Controlla collisioni con tutte le piattaforme
            if (this.crashWith(platform)) {
                // Se collisione dall'alto, posiziona sopra la piattaforma
                if (this.tryY + this.height > platform.y && this.y + this.height <= platform.y) {
                    this.tryY = platform.y - this.height;
                    this.speedY = 0;
                    isJumping = false;
                    onPlatform = true;
                }
            }
        }

        // Se non è su una piattaforma e non è a terra, è in salto
        if (!onPlatform && this.tryY + this.height < myGameArea.canvas.height) {
            isJumping = true;
        }

        // Limiti del canvas (bordo sinistro, destro e inferiore)
        if (this.tryX < 0) this.tryX = 0;
        if (this.tryX + this.width > myGameArea.canvas.width)
            this.tryX = myGameArea.canvas.width - this.width;
        if (this.tryY + this.height > myGameArea.canvas.height) {
            this.tryY = myGameArea.canvas.height - this.height;
            this.speedY = 0;
            isJumping = false;
        }

        // Aggiorna posizione effettiva
        this.x = this.tryX;
        this.y = this.tryY;

        // Gestione animazione: cambia frame solo se il personaggio si muove
        if (this.speedX !== 0 || this.speedY !== 0) {
            this.contaFrame++;
            if (this.contaFrame === 5) {
                this.contaFrame = 0;
                this.actualFrame = (this.actualFrame + 1) % this.imageList.length;
                this.image = this.imageList[this.actualFrame];
            }
        }
    },

    // Carica tutte le immagini di animazione nella lista imageList
    loadImages: function (running) {
        for (let imgPath of running) {
            const img = new Image();
            img.src = imgPath;
            this.imageList.push(img);
        }
        this.image = this.imageList[this.actualFrame];
    },

    // Rileva collisioni con un altro oggetto rettangolare
    crashWith: function (otherobj) {
        const myleft = this.tryX;
        const myright = this.tryX + this.width;
        const mytop = this.tryY;
        const mybottom = this.tryY + this.height;
        const otherleft = otherobj.x;
        const otherright = otherobj.x + otherobj.width;
        const othertop = otherobj.y;
        const otherbottom = otherobj.y + otherobj.height;

        // Ritorna true se c'è una sovrapposizione tra i due rettangoli
        return (
            mybottom >= othertop &&
            mytop <= otherbottom &&
            myright >= otherleft &&
            myleft <= otherright
        );
    }
};

// Oggetto che gestisce il canvas e il ciclo di gioco
const myGameArea = {
    canvas: document.createElement("canvas"), // Crea il canvas
    context: null, // Contesto grafico del canvas
    interval: null, // Intervallo per il ciclo di gioco

    // Inizializza il canvas e avvia il ciclo di aggiornamento
    start: function () {
        this.canvas.width = 1200; // Larghezza canvas
        this.canvas.height = 900; // Altezza canvas
        this.context = this.canvas.getContext("2d"); // Ottiene il contesto 2D
        document.body.insertBefore(this.canvas, document.body.childNodes[0]); // Inserisce il canvas nella pagina
        this.interval = setInterval(updateGameArea, 20); // Chiama updateGameArea ogni 20ms
    },

    // Pulisce il canvas
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    // Disegna un oggetto (sprite, piattaforma, moneta, ecc.) sul canvas
    drawGameObject: function (gameObject) {
        this.context.drawImage(
            gameObject.image,
            gameObject.x,
            gameObject.y,
            gameObject.width,
            gameObject.height
        );
    }
};

// Array per memorizzare gli oggetti della riga (non usato nel gameplay)
const rowObjects = [];

// Funzione per creare una riga di oggetti (esempio, non usata nel gioco)
function createRow(imageSrc, count, startX, y, width, height) {
    for (let i = 0; i < count; i++) {
        rowObjects.push({
            x: startX + i * width,
            y: y,
            width: width,
            height: height,
            image: loadImage(imageSrc)
        });
    }
}

// Crea una riga di oggetti di esempio
createRow("https://i.ibb.co/GMgf32L/Crate.png", 10, 100, 220, 100, 50);

// Array delle piattaforme su cui il personaggio può saltare
const platforms = [];

// Array delle monete da raccogliere
const coins = [];

// Funzione per creare una piattaforma e aggiungerla all'array
function createPlatform(x, y, width, height, speedX = 0) {
    platforms.push({
        x: x,
        y: y,
        width: width,
        height: height,
        speedX: speedX,
        image: loadImage("https://i.ibb.co/GMgf32L/Crate.png")
    });
}

// Funzione per creare una moneta e aggiungerla all'array
function createCoin(x, y) {
    coins.push({
        x: x,
        y: y,
        width: 30,
        height: 30,
        image: loadImage("immagini/moneta.png")
    });
}

// Svuota l'array delle piattaforme e delle monete
platforms.length = 0;
coins.length = 0;

// Crea tutte le piattaforme (fisse e mobili)
createPlatform(100, 800, 120, 20);             // fissa
createPlatform(350, 650, 120, 20, 4);          // mobile veloce destra-sinistra
createPlatform(600, 500, 120, 20);             // fissa
createPlatform(200, 350, 120, 20, -4);         // mobile veloce sinistra-destra
createPlatform(700, 200, 120, 20);             // fissa
createPlatform(950, 750, 120, 20);             // fissa
createPlatform(540, 80, 120, 20);              // piattaforma traguardo in alto
createPlatform(800, 600, 120, 20, 3);          // mobile veloce
createPlatform(400, 300, 120, 20);             // fissa
createPlatform(1000, 400, 120, 20, -3);        // mobile veloce
createPlatform(300, 150, 120, 20);             // fissa
createPlatform(1100, 200, 120, 20);            // fissa
createPlatform(400, 700, 120, 20);             // nuova piattaforma bassa
createPlatform(600, 870, 120, 20);             // nuova piattaforma bassa

// Crea le monete sopra ogni piattaforma (esclusa quella del traguardo)
createCoin(100 + 45, 800 - 35);
createCoin(350 + 45, 650 - 35);
createCoin(600 + 45, 500 - 35);
createCoin(200 + 45, 350 - 35);
createCoin(700 + 45, 200 - 35);
createCoin(950 + 45, 750 - 35);
// createCoin(540 + 45, 80 - 35); // Rimossa la moneta dalla piattaforma traguardo
createCoin(800 + 45, 600 - 35);
createCoin(400 + 45, 300 - 35);
createCoin(1000 + 45, 400 - 35);
createCoin(300 + 45, 150 - 35);
createCoin(1100 + 45, 200 - 35);
createCoin(400 + 45, 870 - 35);
createCoin(600 + 45, 870 - 35);

// Oggetto traguardo (bandiera da raggiungere)
const goal = {
    x: 590, // centrato sulla piattaforma traguardo
    y: 10,
    width: 40,
    height: 70,
    image: loadImage("immagini/bandiera.png")
};

// Nemico principale (cannone che spara ostacoli)
const enemy = {
    x: 320, // posizione orizzontale del nemico
    y: 10,  // posizione verticale del nemico
    width: 70,
    height: 70,
    image: loadImage("immagini/cannone.png"),
    shootInterval: 100, // ogni quanti frame spara
    shootCounter: 0
};

// Array degli ostacoli lanciati dai cannoni
const obstacles = [];

// Funzione per creare un ostacolo (proiettile) da un cannone
function shootObstacle(cannon) {
    obstacles.push({
        x: cannon.x + cannon.width / 2 - 15,
        y: cannon.y + cannon.height,
        width: 30,
        height: 30,
        speedY: 5,
        image: loadImage("immagini/proiettile.png")
    });
}

// Array di cannoni aggiuntivi (oltre al nemico principale)
const cannons = [
    { x: 100, y: 10, width: 70, height: 70, shootInterval: 120, shootCounter: 0 },
    { x: 900, y: 10, width: 70, height: 70, shootInterval: 80, shootCounter: 0 }
];

// Carica l'immagine per tutti i cannoni aggiuntivi
for (const cannon of cannons) {
    cannon.image = loadImage("immagini/cannone.png");
}

// Funzione per riavviare il gioco (ricarica la pagina)
function restartGame() {
    location.reload();
}

// Funzione principale di aggiornamento del gioco, chiamata ogni frame
function updateGameArea() {
    myGameArea.clear(); // Pulisce il canvas

    // Sfondo bianco
    myGameArea.context.fillStyle = "white";
    myGameArea.context.fillRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);

    // Aggiorna posizione delle piattaforme mobili
    for (let platform of platforms) {
        if (platform.speedX !== 0) {
            platform.x += platform.speedX;
            // Inverte la direzione se raggiunge i bordi del canvas
            if (platform.x <= 0 || platform.x + platform.width >= myGameArea.canvas.width) {
                platform.speedX *= -1;
            }
        }
    }

    myGamePiece.update(); // Aggiorna il personaggio

    // Disegna tutte le piattaforme
    for (let platform of platforms) {
        myGameArea.drawGameObject(platform);
    }

    // Disegna il traguardo (bandiera)
    myGameArea.drawGameObject(goal);

    // Controlla se il personaggio raggiunge il traguardo
    if (myGamePiece.crashWith(goal)) {
        clearInterval(myGameArea.interval);
        alert("Complimenti! Hai raggiunto il traguardo!");
        setTimeout(restartGame, 2000);
        return;
    }

    // Disegna e gestisce le monete
    for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        myGameArea.drawGameObject(coin);
        if (myGamePiece.crashWith(coin)) {
            coins.splice(i, 1);
            score += 10;
        }
    }

    // Se tutte le monete sono raccolte, il giocatore vince
    if (coins.length === 0) {
        clearInterval(myGameArea.interval);
        alert("Hai vinto! Punteggio finale: " + score);
        setTimeout(restartGame, 2000);
        return;
    }

    // Gestione nemico principale (cannone) e ostacoli
    myGameArea.drawGameObject(enemy);
    enemy.shootCounter++;
    if (enemy.shootCounter >= enemy.shootInterval) {
        shootObstacle(enemy);
        enemy.shootCounter = 0;
    }

    // Gestione cannoni aggiuntivi
    for (const cannon of cannons) {
        myGameArea.drawGameObject(cannon);
        cannon.shootCounter++;
        if (cannon.shootCounter >= cannon.shootInterval) {
            shootObstacle(cannon);
            cannon.shootCounter = 0;
        }
    }

    // Aggiorna e disegna tutti gli ostacoli (proiettili)
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.y += obs.speedY;
        myGameArea.drawGameObject(obs);

        // Se il personaggio viene colpito da un ostacolo: game over
        if (myGamePiece.crashWith(obs)) {
            clearInterval(myGameArea.interval);
            alert("Game Over! Punteggio: " + score);
            setTimeout(restartGame, 2000);
            return;
        }

        // Rimuovi ostacolo se esce dal canvas
        if (obs.y > myGameArea.canvas.height) {
            obstacles.splice(i, 1);
        }
    }

    // Disegna il personaggio
    myGameArea.drawGameObject(myGamePiece);

    // Mostra il punteggio in alto a sinistra
    myGameArea.context.fillStyle = "white";
    myGameArea.context.font = "24px Arial";
    myGameArea.context.fillText("Punteggio: " + score, 20, 30);
}

// Funzione per far saltare il personaggio
function moveup() {
    if (!isJumping) {
        myGamePiece.speedY = jumpForce;
        isJumping = true;
    }
}

// Funzione per muovere il personaggio a sinistra
function moveleft() {
    myGamePiece.speedX = -moveSpeed;
}

// Funzione per muovere il personaggio a destra
function moveright() {
    myGamePiece.speedX = moveSpeed;
}

// Ferma il movimento orizzontale del personaggio
function clearmove() {
    myGamePiece.speedX = 0;
}

// Array dei percorsi delle immagini per l'animazione del personaggio
const running = [
    "immagini/spirite/Walk (1).png",
    "immagini/spirite/Walk (2).png",
    "immagini/spirite/Walk (3).png",
    "immagini/spirite/Walk (4).png",
    "immagini/spirite/Walk (5).png",
    "immagini/spirite/Walk (6).png",
    "immagini/spirite/Walk (7).png",
    "immagini/spirite/Walk (8).png",
    "immagini/spirite/Walk (9).png",
    "immagini/spirite/Walk (10).png"
];

// Eventi per il controllo della tastiera: movimento e salto
document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "ArrowUp":
            moveup();
            break;
        case "ArrowLeft":
            moveleft();
            break;
        case "ArrowRight":
            moveright();
            break;
    }
});

document.addEventListener("keyup", function (event) {
    switch (event.key) {
        case "ArrowUp":
        case "ArrowLeft":
        case "ArrowRight":
            clearmove();
            break;
    }
});
