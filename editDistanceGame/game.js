const gameState = {
	
};

const config = {
	type: Phaser.AUTO,
	parent: 'phaser-game',
	width: 700,
	height: 800,
	backgroundColor: 'F8B392',
	dom: {
		createContainer: true
	},
	scene:[startScreen,gameScreen],
  };


const game = new Phaser.Game(config);

