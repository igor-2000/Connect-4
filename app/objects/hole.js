import Coin from "./coin.js";
import HOLE_STATES from "../data/hole-states.js";

export default class Hole {
    constructor(scene, row, col) {
        this.scene = scene;

        this.state = HOLE_STATES.EMPTY;
        this.coin = null;
        this.row = row;
        this.col = col;
    }

    addCoin(x, y, crntTurn) {
        if (crntTurn === 1) {
            this.state = HOLE_STATES.BLUE;
            this.coin = new Coin(this.scene, x, y, 'blue-coin', this);
        }
        else {
            this.state = HOLE_STATES.RED;
            this.coin = new Coin(this.scene, x, y, 'red-coin', this);
        }

        this.coin.addTween();
    }

    isEmpty() {
        return this.state === HOLE_STATES.EMPTY;
    }

    isNotEmpty() {
        return this.state !== HOLE_STATES.EMPTY;
    }
}