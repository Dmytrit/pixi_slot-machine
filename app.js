const Application = PIXI.Application;

const app = new Application({
  backgroundColor: (0x1099bb)
});

document.body.appendChild(app.view);

app.loader
  .add('src/assets/M00_000.png', 'src/assets/M00_000.png')
  .add('src/assets/M01_000.png', 'src/assets/M01_000.png')
  .add('src/assets/M02_000.png', 'src/assets/M02_000.png')
  .add('src/assets/M03_000.png', 'src/assets/M03_000.png')
  .add('src/assets/M04_000.png', 'src/assets/M04_000.png')
  .add('src/assets/M05_000.png', 'src/assets/M05_000.png')
  .add('src/assets/M06_000.png', 'src/assets/M06_000.png')
  .add('src/assets/M07_000.png', 'src/assets/M07_000.png')
  .add('src/assets/M08_000.png', 'src/assets/M08_000.png')
  .add('src/assets/M09_000.png', 'src/assets/M09_000.png')
  .add('src/assets/M10_000.png', 'src/assets/M10_000.png')
  .add('src/assets/M11_000.png', 'src/assets/M11_000.png')
  .add('src/assets/M12_000.png', 'src/assets/M12_000.png')
  .load(onAssetsLoaded);

const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;

function onAssetsLoaded() {
  const slotTextures = [
    PIXI.Texture.from('src/assets/M00_000.png'),
    PIXI.Texture.from('src/assets/M01_000.png'),
    PIXI.Texture.from('src/assets/M02_000.png'),
    PIXI.Texture.from('src/assets/M03_000.png'),
    PIXI.Texture.from('src/assets/M04_000.png'),
    PIXI.Texture.from('src/assets/M05_000.png'),
    PIXI.Texture.from('src/assets/M06_000.png'),
    PIXI.Texture.from('src/assets/M07_000.png'),
    PIXI.Texture.from('src/assets/M08_000.png'),
    PIXI.Texture.from('src/assets/M09_000.png'),
    PIXI.Texture.from('src/assets/M10_000.png'),
    PIXI.Texture.from('src/assets/M11_000.png'),
    PIXI.Texture.from('src/assets/M12_000.png'),
  ];

  const reels = [];
  const reelContainer = new PIXI.Container();

  for (let i = 0; i < 5; i++) {
    const rc = new PIXI.Container();
    rc.x = i * REEL_WIDTH;
    reelContainer.addChild(rc);

    const reel = {
      container: rc,
      symbols: [],
      position: 0,
      previousPosition: 0,
      blur: new PIXI.filters.BlurFilter(),
    };

    reel.blur.blurX = 0;
    reel.blur.blurY = 0;
    rc.filters = [reel.blur];

    for (let j = 0; j < 12; j++) {
      const symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);

      symbol.y = j * SYMBOL_SIZE;
      symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
      symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
      reel.symbols.push(symbol);
      rc.addChild(symbol)
    }
    
    reels.push(reel);
  }

  app.stage.addChild(reelContainer);

  const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
  reelContainer.y = margin;
  reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5);

  const top = new PIXI.Graphics();
  top.beginFill(0, 1);
  top.drawRect(0, 0, app.screen.width, margin);

  const bottom = new PIXI.Graphics();
  bottom.beginFill(0, 1);
  bottom.drawRect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin);

  const button = new PIXI.Graphics();
  button.beginFill(0x030507)
  .lineStyle(4, 0x00ff99, 1)
  .drawRect(340, 532, 115, 55);

  const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'],
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 600,
  });

  const playText = new PIXI.Text('SPIN', style);
  playText.x = Math.round((bottom.width - playText.width) / 2);
  playText.y = app.screen.height - margin + Math.round((margin - playText.height) / 2);

  button.addChild(playText);

  const headerText = new PIXI.Text('To start spin push button below!', style);
  headerText.x = Math.round((top.width - headerText.width) / 2);
  headerText.y = Math.round((margin - headerText.height) / 2);

  top.addChild(headerText);

  app.stage.addChild(top);
  app.stage.addChild(bottom);
  app.stage.addChild(button);

  button.interactive = true;
  button.buttonMode = true;
  button.on('pointerdown', () => {
    startPlay();
  });

  let running = false;

  function startPlay() {
    if (running) {
      return;
    };
    running = true;

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      const extra = Math.floor(Math.random() * 3);
      const target = r.position + 10 + i * 5 + extra;
      const time = 2500 + i  * 600 + extra * 600;
      tweenTo(r, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
    }
  }

  function reelsComplete() {
    running = false;
  }

  app.ticker.add((delta) => {
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      r.blur.blurY = (r.position - r.previousPosition) * 8;
      r.previousPosition = r.position;

      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        const prevy = s.y;
        s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
        if (s.y < 0 && prevy > SYMBOL_SIZE) {
          s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
          s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
          s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
        }
      }
    }
  });
}

const tweening = [];

function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
  const tween = {
    object,
    property,
    propertyBeginValue: object[property],
    target,
    easing,
    time,
    change: onchange,
    complete: oncomplete,
    start: Date.now(),
  };

  tweening.push(tween);

  return tween;
}

app.ticker.add((delta) => {
  const now = Date.now();
  const remove = [];

  for (let i = 0; i < tweening.length; i++) {
    const t = tweening[i];
    const phase = Math.min(1, (now - t.start) / t.time);

    t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));

    if(t.change) {
      t.change(t);
    }

    if(phase === 1) {
      t.object[t.property] = t.target;

      if(t.complete) {
        t.complete(t);
      }

      remove.push(t);
    }
  }

  for (let i = 0; i < remove.length; i++) {
    tweening.splice(tweening.indexOf(remove[i]), 1);
  }
});

function lerp(a1, a2, t) {
  return a1 * (1 - t) + a2 * t;
}

// Backout function from tweenjs
// https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
function backout(amount) {
  return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
}
