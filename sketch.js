let bolaImagem;
let jogadorImagem;
let computadorImagem;
let fundoImagem;
let quicarSom;
let golSom;

let pontosJogador = 0;
let pontosComputador = 0;

class Raquete {
    constructor(x) {
        this.x = x;
        this.y = height / 2;
        this.w = 30;
        this.h = 60;
    }
    update() {

        if (this.x < width / 2) {
            this.y = mouseY;
        } else {
            if (bola.y < this.y) {
                this.y -= 5;
            } else {
                this.y += 5;
            }
        }

        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y > height - this.h) {
            this.y = height - this.h;
        }
    }
    desenha() {
        if (this.x < width / 2) {
            image(jogadorImagem, this.x, this.y, this.w, this.h);
        } else {
            image(computadorImagem, this.x, this.y, this.w, this.h);
        }
    }
}

class Bola {
    constructor() {
        this.r = 12;
        this.reset();
    }

    reset() {
        this.x = width / 2;
        this.y = height / 2;
        //this.vx = random([-4, -3, 3, 4]);
        //this.vy = radom([-3, 3]);
        //dificultar
        const fatorAumento = 1.1;
        this.vx *= fatorAumento;
        this.vy *= fatorAumento;
        //facilitar
        const velecidadeMaxima = 5
        this.vx = Math.random() * velecidadeMaxima * 2 - velecidadeMaxima;
        this.vy = Math.random() * velecidadeMaxima * 2 - velecidadeMaxima;
        this.angulo = 0;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angulo += Math.sqrt(this.vx * this.vx + this.vy * this.vy) / 30;
        
        if (this.x < this.r || this.x > width - this.r) {
            if (this.x < this.r) {
                pontosComputador++;
            } else {
                pontosJogador++;
            }
            golSom.play();
            falaPontos();
            this.reset();
        }
        if (this.y < this.r || this.y > height - this.r) {
            this.vy *= -1;
        }

        if (colideRetanguloCirculo(this.x, this.y, this.r, jogador.x, jogador.y, jogador.w, jogador.h) ||
            colideRetanguloCirculo(this.x, this.y, this.r, computador.x, computador.y, computador.w, computador.h)) {
            quicarSom.play();
            this.vx *= -1;
            this.vx *= 1.1;
            this.vy *= 1.1;
        }

    }

    desenha() {
        push();
        translate(this.x, this.y);
        rotate(this.angulo);
        image(bolaImagem, -this.r, -this.r, this.r * 2, this.r * 2);
        pop();
    }
}

function colideRetanguloCirculo(cx, cy, raio, x, y, w, h) {
    if (cx + raio < x || cx - raio > x + w) {
        return false;
    }
    if (cy + raio < y || cy - raio > y + h) {
        return false;
    }
    return true;
}




let bola;
let jogador;
let computador;

function falaPontos() {
    if('speechSynthesis' in window) {
        const pontuacao = "Pontuação é " + pontosJogador + " a " + pontosComputador;
        console.log(pontuacao);
        const msg = new SpeechSynthesisUtterance(pontuacao);
        msg.lang = 'pt-BR';
        window.speechSynthesis.speak(msg);
    }
}

function preload() {
    bolaImagem = loadImage('img/bola.png');
    jogadorImagem = loadImage('img/raquete01.png');
    computadorImagem = loadImage('img/raquete02.png');
    fundoImagem = loadImage('img/fundo.png');
    quicarSom = loadSound('sound/pong.wav');
    golSom = loadSound('sound/win.wav');
}

function setup() {
    createCanvas(800, 400);
    bola = new Bola();
    jogador = new Raquete(30);
    computador = new Raquete(width - 30 - 10);
}

function draw() {
    
    let canvasAspectRatio = width / height;
    let fundoAspectRatio = fundoImagem.width / fundoImagem.height;
    let zoom = 1;
    if (canvasAspectRatio > fundoAspectRatio) {
        zoom = width / fundoImagem.width;
    } else {
        zoom = height / fundoImagem.height;
    }
    let scaledWidth = fundoImagem.width * zoom;
    let scaledHeight = fundoImagem.height * zoom;
    image(fundoImagem, (width - scaledWidth) / 2, (height - scaledHeight) / 2, scaledWidth, scaledHeight);
    

    bola.update();
    bola.desenha();
    jogador.update();
    jogador.desenha();
    computador.update();
    computador.desenha();
}