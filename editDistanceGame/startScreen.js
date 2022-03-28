class startScreen extends Phaser.Scene {
    constructor() {
      super({ key: 'startScreen'});
    }
  
    preload() {

    }
  
    create() {
      // Creates the text on the start screen:
      this.add.text(10, 50, " Edit Distance \n   Challenge" , { fill: '#4D39E0', fontSize: '45px' });
      this.add.text(50, 520, '       Click to start!\nBy: Stephen Martin & Yong Shao', { fill: '#4D39E0', fontSize: '20px' });
              
      this.input.on('pointerup', () => {
        // Add logic to transition from StartScene to GameScene:
        this.scene.stop('startScreen');
        this.scene.start('gameScreen');
              
      });
  
  
    }
  }