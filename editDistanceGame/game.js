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
	//scene:[endScreen],
	scene:[startScreen,howToPlay,gameScreen,endScreen],
  };


const game = new Phaser.Game(config);

