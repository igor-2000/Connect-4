import Boot from '../app/scenes/Boot.js';
import Home from '../app/scenes/Home.js';
import Gameplay from '../app/scenes/Gameplay.js';
import dimensions from './dimensions.js';

export default {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: dimensions.width,
    height: dimensions.height
  },
  backgroundColor: '0x0f0f0f',
  banner: { text: 'white', background: ['#FD7400', '#FFE11A', '#BEDB39', '#1F8A70', '#004358'] },
  scene: [Boot, Home, Gameplay]
};
