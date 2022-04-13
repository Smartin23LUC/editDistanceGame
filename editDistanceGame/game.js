const gameState = {
	
};

const config = {
	type: Phaser.AUTO,
	parent: 'phaser-game',
	width: 900,
	height: 800,
	dom: {
		createContainer: true
	},
	// scene:[gameScreen],
	scene:[startScreen,gameScreen,endScreen],
  };


const game = new Phaser.Game(config);

