class endScreen extends Phaser.Scene {
    constructor() {
      super({ key: 'endScreen'});
    }
  
    preload() {
      this.load.image('endscreen', 'assets/gameover.png');
    }
  
    create() {
      this.add.image(450,400,'endscreen');

      if(gameState.winStatus){
        const homeBoxText = this.add.text(360, 200, "You Win!", { fontSize:60, fontFamily:'Britannic Bold', fontStyle:'bold', fill: '#ffe014',
       align: 'center', wordWrap: {width: 110}});
      }else{
        const homeBoxText = this.add.text(360, 200, "You Lose!", { fontSize:60, fontFamily:'Britannic Bold', fontStyle:'bold', fill: '#ffe014',
       align: 'center', wordWrap: {width: 110}});
      }

      const homeBox = this.add.rectangle(420, 450, 200, 100, 0x00FFFF);
      homeBox.setStrokeStyle(8, 0xD8BFD8);
      homeBox.setInteractive();
      const homeBoxText = this.add.text(345, 418, "Home", { fontSize:60, fontFamily:'Britannic Bold', fontStyle:'bold', fill: '#6666FF',
       align: 'center', wordWrap: {width: 110}});
      
       homeBox.on('pointerover', function() {
        homeBox.setStrokeStyle(2, 0xffe014, 1);
        homeBoxText.setColor('#ffe014');
      }, {});

      homeBox.on('pointerout', function() {
        homeBox.setStrokeStyle(8, 0xD8BFD8);
        homeBoxText.setColor('#6666FF');
      }, {});



      let self = this;

      homeBox.on('pointerup', function() {
        self.scene.stop('endScreen');
        self.scene.start('startScreen');
      });
      }
  }