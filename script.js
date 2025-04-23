function startGame() {
    myGamePiece.loadImages(running);
    bushObject.loadImages();
    crateObject.loadImages();
    myGameArea.start();
}

// Aggiungi una variabile per la gravità
var gravity = 0.01; // Forza della gravità
var isJumping = false; // Stato del salto

var myGamePiece = {
    speedX: 0,
    speedY: 0,
    width: 60,
    height: 60,
    x: 10,
    y: 210,
    imageList: [], // Array to store loaded images
    contaFrame: 0, // Frame counter
    actualFrame: 0, // Current frame to display
    image: null, // Current image
    tryX: 0,
    tryY: 0,

    update: function() {
        this.speedY += gravity; // Applica la gravità al movimento verticale
        this.tryY = this.y + this.speedY; // Prova nuova posizione Y
        this.tryX = this.x + this.speedX; // Prova nuova posizione X
    
        const collidesWithBush = this.crashWith(bushObject); // Controlla collisione con il cespuglio
        const collidesWithCrate = this.crashWith(crateObject); // Controlla collisione con la cassa
    
        if (collidesWithBush || collidesWithCrate) {
            // Gestisci collisione separatamente per asse X e Y
            if (this.crashWith(bushObject, "x") || this.crashWith(crateObject, "x")) {
                this.tryX = this.x; // Blocca il movimento sull'asse X
                this.speedX = 0;    // Ferma la velocità orizzontale
            }
            if (this.crashWith(bushObject, "y") || this.crashWith(crateObject, "y")) {
                this.tryY = this.y; // Blocca il movimento sull'asse Y
                this.speedY = 0;    // Ferma la velocità verticale
                isJumping = false;  // Permetti un nuovo salto
            }
        }
    
        // Controlla bordi canvas
        if (this.tryX < 0) this.tryX = 0; // Limite sinistro
        if (this.tryX + this.width > myGameArea.canvas.width) // Limite destro
            this.tryX = myGameArea.canvas.width - this.width; 
        if (this.tryY < 0) this.tryY = 0; // Limite superiore
        if (this.tryY + this.height > myGameArea.canvas.height) { // Limite inferiore
            this.tryY = myGameArea.canvas.height - this.height;
            this.speedY = 0; // Ferma il movimento verticale quando tocca il suolo
            isJumping = false; // Permette un nuovo salto
        }
    
        // Aggiorna posizione
        this.x = this.tryX;
        this.y = this.tryY;
    
        // Gestione animazione
        this.contaFrame++;
        if (this.contaFrame == 10) {
            this.contaFrame = 0;
            this.actualFrame = (this.actualFrame + 1) % this.imageList.length; // Cicla tra le immagini
            this.image = this.imageList[this.actualFrame];
        }
    },
    

    loadImages: function(running) {
        for (let imgPath of running) {
            var img = new Image();
            img.src = imgPath;
            this.imageList.push(img);
        }
        this.image = this.imageList[this.actualFrame];
    },
    crashWith: function(otherobj, axis = null) {
        var myleft = this.tryX;
        var myright = this.tryX + this.width;
        var mytop = this.tryY;
        var mybottom = this.tryY + this.height;
        var otherleft = otherobj.x;
        var otherright = otherobj.x + otherobj.width;
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + otherobj.height;
    
        if (axis === "x") {
            return (myright >= otherleft && myleft <= otherright && mytop < otherbottom && mybottom > othertop);
        }
        if (axis === "y") {
            return (mybottom >= othertop && mytop <= otherbottom && myleft < otherright && myright > otherleft);
        }
    
        return (mybottom >= othertop &&
                mytop <= otherbottom &&
                myright >= otherleft &&
                myleft <= otherright);
    }
    
};
var myGameArea = {
    canvas: document.createElement("canvas"),
    context: null,
    interval: null,

    start: function() {
        this.canvas.width = 600;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 1); // Update game every 20ms
    },

    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
   
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
var bushObject = {
    width: 100,
    height: 50,
    x: 100,
    y: 270 - 50,
    image : null,
    loadImages: function() {
        
      this.image = new Image(this.width, this.height);
      this.image.src = "https://i.ibb.co/GMgf32L/Crate.png"
    }
  };

var crateObject = {
    width: 100,
    height: 100,
    x: 200,
    y: 270 - 100,
  
    loadImages: function() {
      this.image = new Image(this.width, this.height);
      this.image.src = "https://i.ibb.co/GMgf32L/Crate.png";
    }
  };


function updateGameArea() {
    myGameArea.clear();
    myGamePiece.update();
    myGameArea.drawGameObject(myGamePiece);
    myGameArea.drawGameObject(bushObject);
    myGameArea.drawGameObject(crateObject);
}

// Control functions
function moveup() {
    if (!isJumping) { // Permetti il salto solo se non si sta già saltando
        myGamePiece.speedY = -10; // Imposta una velocità verso l'alto
        isJumping = true; // Imposta lo stato di salto
    }
}

function movedown() {
    myGamePiece.speedY += 1.0; 
}

function moveleft() {
    myGamePiece.speedX -= 1.0; 
}

function moveright() {
    myGamePiece.speedX += 1.0; 
}

function clearmove() {
    myGamePiece.speedX = 0; 
    myGamePiece.speedY = 0; 
}
var running = [
    "/spirite/Walk (1).png", 
    "/spirite/Walk (2).png",
    "/spirite/Walk (3).png",
    "/spirite/Walk (4).png",
    "/spirite/Walk (5).png",
    "/spirite/Walk (6).png",
    "/spirite/Walk (7).png",
    "/spirite/Walk (8).png",
    "/spirite/Walk (9).png",
    "/spirite/Walk (10).png",
];

// Aggiungi event listener per i tasti
document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case "ArrowUp":
            moveup();
            break;
        case "ArrowDown":
            movedown();
            break;
        case "ArrowLeft":
            moveleft();
            break;
        case "ArrowRight":
            moveright();
            break;
    }
});

document.addEventListener("keyup", function(event) {
    switch (event.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
            clearmove();
            break;
    }
});
