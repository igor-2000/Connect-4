export default class Coin extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, hole) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        this.depth = 1;
        this.hole = hole;
    }

    addTween() {
        this.addTween = this.scene.tweens.add({
            targets: this,
            y: { from: 0, to: this.y },
            ease: 'Bounce',
            duration: 100,
            onComplete: this.scene.onCoinAddition,
            onCompleteScope: this.scene,
        });

        this.scene.time.delayedCall(250, () => {
            this.scene.dropSFX.play();
        });
    }

    changeToWinCoin(winState) {
        if (winState === 1)
            this.setTexture('filled-blue-coin')
        else
            this.setTexture('filled-red-coin')
    }
}