class howToPlay extends Phaser.Scene {
    constructor() {
      super({ key: 'howToPlay'});
    }
  
    preload() {
      this.load.image('tutorial', 'assets/tutorial.png');
    }
  
    create() {

        this.add.image(450,400,'tutorial');
      
        const startBox2 = this.add.rectangle(750, 700, 150, 100, 0x00FFFF);
        startBox2.setStrokeStyle(8, 0xD8BFD8);
        startBox2.setInteractive();
        const startBoxText2 = this.add.text(685, 670, "Start", { fontSize:60, fontFamily:'Britannic Bold', fontStyle:'bold', fill: '#6666FF',
         align: 'center', wordWrap: {width: 110}});

         startBox2.on('pointerover', function() {
            startBox2.setStrokeStyle(2, 0xffe014, 1);
            startBoxText2.setColor('#ffe014');
          }, {});
    
          startBox2.on('pointerout', function() {
            startBox2.setStrokeStyle(8, 0xD8BFD8);
            startBoxText2.setColor('#6666FF');
          }, {});

          var self = this;

          startBox2.on('pointerup', function() {
            self.scene.stop('howToPlay');
            self.scene.start('gameScreen');
          });
  
  
    }
  }