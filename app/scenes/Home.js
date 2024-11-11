import dimensions from "../../config/dimensions.js";

export default class Home extends Phaser.Scene {
    constructor() {
        super({ key: 'Home' });
    }

    create() {
        this.btnSFX = this.sound.add('btn');

        this.titleTxt = this.add.text(dimensions.width / 2, dimensions.height / 2 - 120, 'CONNECT 4', {
            fontFamily: 'Courier',
            fontSize: '104px',
            color: '#FFD735',
            fontStyle: 'bold'
        });
        this.titleTxt.setOrigin(0.5);

        this.startBtn = this.add.sprite(dimensions.width / 2, dimensions.height / 2 + 60, 'btn');
        this.startBtn.setScale(1, 0.82);
        this.startTxt = this.add.text(this.startBtn.x, this.startBtn.y, 'PLAY', {
            fontFamily: 'Courier',
            fontSize: '69px',
            color: '#0f0f0f',
            fontStyle: 'bold',
        });
        this.startTxt.setOrigin(0.5);
        this.startBtn.setInteractive().on('pointerdown', this.onPlayBtn, this);

        // this.onPlayBtn(); // For testing
    }

    onPlayBtn() {
        this.btnSFX.volume = 0.85;
        this.btnSFX.play();
        this.scene.start('Gameplay');
    }
}
