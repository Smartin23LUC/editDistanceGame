class startScreen extends Phaser.Scene {
    constructor() {
      super({ key: 'startScreen'});
    }
  
    preload() {
      this.load.image('bg', 'assets/startScreenBG.png');
    }
  
    create() {
      this.add.image(450,400,'bg');

      const startBox = this.add.rectangle(325, 450, 150, 100, 0x00FFFF);
      startBox.setStrokeStyle(8, 0xD8BFD8);
      startBox.setInteractive();
      const startBoxText = this.add.text(260, 418, "Start", { fontSize:60, fontFamily:'Britannic Bold', fontStyle:'bold', fill: '#6666FF',
       align: 'center', wordWrap: {width: 110}});
      
      startBox.on('pointerover', function() {
        startBox.setStrokeStyle(2, 0xffe014, 1);
        startBoxText.setColor('#ffe014');
      }, {});

      startBox.on('pointerout', function() {
        startBox.setStrokeStyle(8, 0xD8BFD8);
        startBoxText.setColor('#6666FF');
      }, {});

      const howToPlayBox = this.add.rectangle(525, 450, 150, 100, 0x00FFFF);
      howToPlayBox.setStrokeStyle(8, 0xD8BFD8);
      howToPlayBox.setInteractive();
      const howToPlayBoxText = this.add.text(480, 418, "How to Play", { fontSize:34, fontFamily:'Britannic Bold', fill: '#6666FF',
       align: 'center', fontStyle:'bold', wordWrap: {width: 110}});
      
      howToPlayBox.on('pointerover', function() {
        howToPlayBox.setStrokeStyle(2, 0xffe014, 1);
        howToPlayBoxText.setColor('#ffe014');
      }, {});

      howToPlayBox.on('pointerout', function() {
        howToPlayBox.setStrokeStyle(8, 0xD8BFD8);
        howToPlayBoxText.setColor('#6666FF');
      }, {});

      let self = this;

      startBox.on('pointerup', function() {
        self.scene.stop('startScreen');
        self.scene.start('gameScreen');
      });

      howToPlayBox.on('pointerup', function() {
        self.scene.stop('startScreen');
        self.scene.start('gameScreen');
      });
              

  
  
    }
  }