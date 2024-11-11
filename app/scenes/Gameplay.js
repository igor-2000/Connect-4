import dimensions from "../../config/dimensions.js";
import Hole from "../objects/hole.js";

export default class Gameplay extends Phaser.Scene {
  constructor() {
    super({ key: 'Gameplay' });
  }

  init() {
    this.totalRows = 6; // 0-5
    this.totalCols = 7; // 0-6

    this.coinWidth = 81;

    this.crntTurn = 1;

    this.canClick = false;
  }

  create() {
    this.dropSFX = this.sound.add('drop');
    this.btnSFX = this.sound.add('btn');
    this.winSFX = this.sound.add('win');
    this.failSFX = this.sound.add('fail');

    this.board = this.add.sprite(dimensions.width / 2, dimensions.height / 2, 'board');
    // this.board.setOrigin(0, 0);
    this.board.y = dimensions.height - this.board.height / 2;
    this.board.depth = 2;

    this.offsetX = this.board.x - this.board.width / 2 + 67;
    this.offsetY = this.board.y - this.board.height / 2 + 67;
    this.distanceX = 106.6;
    this.distanceY = 106.6;

    this.addUI();
    this.initBoardArr();

    this.marker = this.add.sprite(dimensions.width / 2, 55, 'blue-marker');
    this.marker.visible = false;

    // this.input.on('pointerdown', this.updatePos, this);
    this.input.on('pointerdown', this.addCoin, this);

    this.enableClick();
  }

  addUI() {
    this.turnTxt = this.add.text(120, dimensions.height / 2, 'Turn', {
      fontFamily: 'Courier',
      fontSize: '56px',
      color: '#fff',
    });
    this.turnTxt.setOrigin(0.5);

    this.resultTxt = this.add.text(dimensions.width / 2, 54, 'Player Won.', {
      fontFamily: 'Courier',
      fontSize: '56px',
      color: '#fff',
    });
    this.resultTxt.setOrigin(0.5);
    this.resultTxt.visible = false;

    this.turnCoin = this.add.sprite(120, dimensions.height / 2 + 90, 'blue-coin');

    this.restartBtn = this.add.sprite(dimensions.width - 90, 90 + 0, 'restart-btn');
    this.restartBtn.setInteractive().on('pointerdown', this.onRestart, this);

    this.soundBtn = this.add.sprite(dimensions.width - 90, 90 + 130, 'sound-on');
    this.soundBtn.setInteractive().on('pointerdown', this.onSoundBtn, this);

    if (this.sound.mute) {
      this.soundBtn.setTexture('sound-off');
    }
    else {
      this.soundBtn.setTexture('sound-on');
    }
  }

  onSoundBtn() {
    if (this.sound.mute) {
      this.sound.mute = false;
      this.soundBtn.setTexture('sound-on');
    }
    else {
      this.sound.mute = true;
      this.soundBtn.setTexture('sound-off');
    }
  }

  onRestart() {
    this.btnSFX.volume = 0.85;
    this.btnSFX.play();
    this.scene.start('Gameplay');
    // console.log('restarting');
    this.scene.restart();
  }

  initBoardArr() {
    this.board = [];
    for (let i = 0; i < this.totalRows; i++) {
      this.board.push([]);
      for (let j = 0; j < this.totalCols; j++) {
        this.board[i].push(new Hole(this, i, j));
      }
    }

    // console.table(this.board);
  }

  findBottomMostEmptyRow(col) {
    for (let i = this.totalRows - 1; i >= 0; i--) {
      // console.log(i, col);
      const hole = this.board[i][col];
      if (hole.isEmpty()) {
        return {
          bottomMostRow: i,
          hole: hole,
        };
      }
    }

    // console.log('bottom most not found');
    return {
      bottomMostRow: null,
      hole: null,
    };
  }

  addCoin() {
    if (!this.canClick) return;

    const pointer = this.input.activePointer;
    const coordinate = this.getRowColFromPointerPos(pointer);

    if (coordinate.row < 0 || coordinate.col < 0 || coordinate.row >= this.totalRows || coordinate.col >= this.totalCols) return;

    const { bottomMostRow, hole } = this.findBottomMostEmptyRow(coordinate.col);
    if (bottomMostRow === null) return;

    this.canClick = false;
    this.marker.visible = false;

    const coordinateXYPos = this.getXYOfCoin(bottomMostRow, coordinate.col);
    hole.addCoin(coordinateXYPos.x, coordinateXYPos.y, this.crntTurn);

    this.changeTurn();
  }

  onCoinAddition() {
    const hasWon = this.checkForWin();

    if (hasWon) {
      this.onWin();
    }
    else {
      const hasEmptyHoles = this.checkForEmptyHoles();
      if (hasEmptyHoles)
        this.enableClick();
      else
        this.onTie();
    }
  }

  onWin() {
    this.winSFX.play();

    let winPlayer = 'Blue';
    if (this.winState === 2)
      winPlayer = 'Red';

    this.resultTxt.setText(winPlayer + ' Player Won!');
    this.resultTxt.visible = true;
  }

  onTie() {
    this.failSFX.play();

    this.resultTxt.setText('It\'s a Tie!');
    this.resultTxt.visible = true;
  }

  checkForEmptyHoles() {
    for (let i = 0; i < this.totalRows; i++) {
      for (let j = 0; j < this.totalCols; j++) {
        if (this.board[i][j].isEmpty())
          return true;
      }
    }
  }

  checkForWin() {
    let winState = 0;
    let winHoles = [];

    // this.printStatesTable(); // For Testing states

    for (let i = 0; i < this.totalRows; i++) {
      for (let j = 0; j < this.totalCols; j++) {
        const hole = this.board[i][j];
        if (hole.isEmpty()) continue;

        // Horizontal
        if (
          j < this.totalCols - 3 &&
          hole.state === this.board[i][j + 1].state &&
          hole.state === this.board[i][j + 2].state &&
          hole.state === this.board[i][j + 3].state
        ) {
          winState = hole.state;
          winHoles.push(
            hole,
            this.board[i][j + 1],
            this.board[i][j + 2],
            this.board[i][j + 3],
          );
          break;
        }

        // Vertical
        if (
          i < this.totalRows - 3 &&
          hole.state === this.board[i + 1][j].state &&
          hole.state === this.board[i + 2][j].state &&
          hole.state === this.board[i + 3][j].state
        ) {
          winState = hole.state;
          winHoles.push(
            hole,
            this.board[i + 1][j],
            this.board[i + 2][j],
            this.board[i + 3][j],
          );
          break;
        }

        // TopLeft-BottomRight
        if (
          j < this.totalCols - 3 &&
          i < this.totalRows - 3 &&
          hole.state === this.board[i + 1][j + 1].state &&
          hole.state === this.board[i + 2][j + 2].state &&
          hole.state === this.board[i + 3][j + 3].state
        ) {
          winState = hole.state;
          winHoles.push(
            hole,
            this.board[i + 1][j + 1],
            this.board[i + 2][j + 2],
            this.board[i + 3][j + 3],
          );
          break;
        }

        // TopRight-BottomLeft
        if (
          j >= 3 &&
          i < this.totalRows - 3 &&
          hole.state === this.board[i + 1][j - 1].state &&
          hole.state === this.board[i + 2][j - 2].state &&
          hole.state === this.board[i + 3][j - 3].state
        ) {
          winState = hole.state;
          winHoles.push(
            hole,
            this.board[i + 1][j - 1],
            this.board[i + 2][j - 2],
            this.board[i + 3][j - 3],
          );
          break;
        }
      }
    }

    // console.log(winState, " winState");
    if (winState !== 0) {
      console.log('is winning', winState);
      winHoles.forEach(winHole => winHole.coin.changeToWinCoin(winState));
      this.winState = winState;
      return true;
    }
  }

  enableClick() {
    // console.log('enabled');
    this.canClick = true;
    if (this.crntTurn === 1) {
      this.marker.setTexture('blue-marker');
      this.turnCoin.setTexture('blue-coin');
    }
    else {
      this.marker.setTexture('red-marker');
      this.turnCoin.setTexture('red-coin');
    }

    this.marker.visible = true;
  }

  changeTurn() {
    this.crntTurn = (this.crntTurn === 1 ? 2 : 1);
  }

  update() {
    // console.log('asda');
    if (!this.canClick) return;

    const pointer = this.input.activePointer;
    const coordinate = this.getRowColFromPointerPos(pointer);
    // console.log('asda');

    if (coordinate.col < 0 || coordinate.col >= this.totalCols) return;

    const coordinateXYPos = this.getXYOfCoin(coordinate.row, coordinate.col);

    // console.log('asda');
    this.marker.x = coordinateXYPos.x;
  }

  getRowColFromPointerPos(pointer) {
    let row = Math.floor((pointer.y - this.offsetY + this.coinWidth / 2) / this.distanceY);
    let col = Math.floor((pointer.x - this.offsetX + this.coinWidth / 2) / this.distanceX);

    // console.log(row, col);
    return {
      row: row,
      col: col,
    }
  }

  getXYOfCoin(row, col) {
    return {
      x: this.offsetX + this.distanceX * col,
      y: this.offsetY + this.distanceY * row
    }
  }

  printStatesTable() {
    const stateData = [];
    for (let i = 0; i < this.totalRows; i++) {
      stateData.push([]);
      for (let j = 0; j < this.totalCols; j++) {
        stateData[i].push(this.board[i][j].state);
      }
    }
    console.table(stateData);
  }
}
