import gameConfig from './config/game-conf.js';

function newGame() {
  if (game) return;
  game = new Phaser.Game(gameConfig);
}

let game;

newGame();