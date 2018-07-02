export class ControlPanel {
  h = 720;
  w = 340;
  d = 15;
  buttonw: number;
  buttonh: number;
  horizontal = true;
  activated = true;
  buttons = [
    {
      text: 'HOME',
      active: true,
      x: 0, y:0
    },
    {
      text: 'SHOW',
      active: true,
      x: 0, y:0
    },
    {
      text: 'UNDO',
      active: false,
      x: 0, y:0
    },
    {
      text: 'REDO',
      active: false,
      x: 0, y:0
    }
  ];
  eraseButton = {
    text: 'ERASE COLOR',
    active: true,
    x: 0, y:0
  };
  colorlist = ['gray', 'blue', 'green', 'darkorange', 'deeppink'];
  colorButtons = [];
  numberButtons = [];
  numberlist = [];
constructor() {
  }
  init() {
    this.buttonw = (this.w - this.d) / 2;
    this.buttonh = this.buttonw * 0.33;
    for(let x = 0; x < 2; x++) {
      for(let y = 0; y < 2; y++) {
        this.buttons[x + 2 * y].x = x * (this.buttonw + this.d);
        this.buttons[x + 2 * y].y = y * (this.buttonh + this.d);
      }
    }
    this.colorlist.forEach((clr, i) => {
      this.colorButtons.push({
        color: clr,
        cxh: (i + 1) * this.w / 8,
        cxv: (i + 0.5) * this.w / 4,

        // cxv: (this.w - this.d) / 8 * (i - (i % 2) + 1) + this.d / 2,
        // cxv: (this.w - this.d) / 8 * 2 * i + this.d / 2,
        cyh: (this.w - this.d) / 8 * (2 * (i % 2) + 1) + this.d / 2,
        cyv: (this.w - this.d) / 8,
      });
    });
    this.numberlist.forEach((num, i) => {
      this.numberButtons.push({
        number: num,
        xh: (i % 3) * (this.w + this.d) / 3,
        xv: (i % 2) * (this.w + this.d) / 3,
        // cxv: (this.w - this.d) / 8 * 2 * i + this.d / 2,
        yh: (i - (i % 3)) / 3 * (this.buttonh + this.d),
        yv: (i - (i % 2)) / 2 * (this.buttonh + this.d),
      });
    });
  }
}
