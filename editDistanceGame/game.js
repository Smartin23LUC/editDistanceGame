const gameState = {
	
};

const config = {
	type: Phaser.AUTO,
	width: 700,
	height: 800,
	backgroundColor: 'F8B392',
	scene: [startScreen,gameScreen]
  };

const game = new Phaser.Game(config);