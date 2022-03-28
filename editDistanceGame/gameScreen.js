//Extend Phaser.Scene giving us access to their game-engine library
//This scene is for the gameplay. There is another scene for the start screen
class gameScreen extends Phaser.Scene{
    constructor(){
        //Set key for accessing this Scene. A seperate scene is created for the beginning screen
        super({ key: 'gameScreen' }); 
    }

    
    //If we decide to add any assets we can load them here
    preload () {
        // load in any assets
      }
      
    //Called after preload. Gets the game setup process started
    create () {
        //Calls the initializePage method below
        this.initializePage(this);
        //Sets the first page as the first level. Each "page" will represent a new level
        const firstPage = this.fetchPage(1);
        //Calls the displayPage method below
        this.displayPage(this, firstPage);
      };
      
      
      //Builds the initial visuals for the game
      initializePage(scene) {
        if (!gameState.options) {
          //Creates an options list that will hold the box object created in the displayPage method
          gameState.options = [];
        }
        
        if (!gameState.narrative_background) {
          //Creates the two black boxes where the objective is displayed and where the player modifies their statement
          gameState.narrative_background = scene.add.rectangle(10, 160, 430, 170, 0x000);
          gameState.narrative_background.setOrigin(0, 0);
          gameState.narrative_background = scene.add.rectangle(10, 360, 430, 170, 0x000);
          gameState.narrative_background.setOrigin(0, 0);
        }

        
      }
      
      //Called when moving from one page to the next
      destroyPage() {
      
        if (gameState.narrative) {
          gameState.narrative.destroy();
        }
      
        for (let option of gameState.options) {
          option.origStatementBox.destroy();
          option.origStatementText.destroy();
        }
      }
      
      //Most of the work is being done here
      displayPage(scene, page) {
        //Text styling used
        const narrativeStyle = { fill: '#ffffff', fontStyle: 'italic', align: 'center', wordWrap: { width: 340 }, lineSpacing: 8};
        //Text in the top black box is added here
        scene.add.text(50, 180, "Statement to Edit: ", narrativeStyle);
        gameState.origStatement = scene.add.text(50, 200, page.origStatement, narrativeStyle);
        scene.add.text(50, 250, "Objective Statement: ", narrativeStyle);
        gameState.changeTo = scene.add.text(50, 270, page.changeTo, narrativeStyle);

        //Insert button created here
        const insertBox = scene.add.rectangle(80, 600, 75, 50, 0x000);
        insertBox.strokeColor = 0xb39c0e;
        insertBox.strokeWeight = 2;
        insertBox.strokeAlpha = 1;
        insertBox.isStroked = true;
        insertBox.setInteractive();
        const insertBoxText = scene.add.text(55, 595, "Insert", { fontSize:14, fill: '#b39c0e', align: 'center', wordWrap: {width: 110}});
        const insertBoxTextBounds = insertBoxText.getBounds()
        

        //Delete button created here
        const deleteBox = scene.add.rectangle(205, 600, 75, 50, 0x000);
        deleteBox.strokeColor = 0xb39c0e;
        deleteBox.strokeWeight = 2;
        deleteBox.strokeAlpha = 1;
        deleteBox.isStroked = true;
        deleteBox.setInteractive();
        const deleteBoxText = scene.add.text(180, 595, "Delete", { fontSize:14, fill: '#b39c0e', align: 'center', wordWrap: {width: 110}});
        const deleteBoxTextBounds = deleteBoxText.getBounds()

        //Substitute button created here
        const substituteBox = scene.add.rectangle(330, 600, 75, 50, 0x000);
        substituteBox.strokeColor = 0xb39c0e;
        substituteBox.strokeWeight = 2;
        substituteBox.strokeAlpha = 1;
        substituteBox.isStroked = true;
        substituteBox.setInteractive();
        const substituteBoxText = scene.add.text(305, 595, "Substi.", { fontSize:14, fill: '#b39c0e', align: 'center', wordWrap: {width: 110}});
        const substituteBoxTextBounds = deleteBoxText.getBounds()



        //For each letter in original (top) statement
        for (let i=0; i<page.origStatement.length; i++) {
          let letter = page.origStatement[i];
      
          //Creates a box for each individual letter
          const origStatementBox = scene.add.rectangle(40 + i * 20, 400, 20, 20, 0xb39c0e, 0)
          origStatementBox.strokeColor = 0xb39c0e;
          origStatementBox.strokeWeight = 2;
          origStatementBox.strokeAlpha = 1;
          origStatementBox.isStroked = true;
          origStatementBox.setOrigin(0, 0)
      
          //Adds a character to each box
          const baseX = 40 + i * 20;
          const origStatementText = scene.add.text(baseX, 400, letter, { fontSize:14, fill: '#b39c0e', align: 'center', wordWrap: {width: 110}});
          const origStatementTextBounds = origStatementText.getBounds()
      
          //Centers character within box
          origStatementText.setX(origStatementTextBounds.x + 5 - (origStatementTextBounds.width / page.origStatement.length));
          origStatementText.setY(origStatementTextBounds.y + 3 - (origStatementTextBounds.height / page.origStatement.length));
      
          //Makes boxes interactive
          origStatementBox.setInteractive();

          //Preserve reference for use in callback function below
          var self = this;

          //What to do when box is clicked on
          //WORK IN PROGRESS
          origStatementBox.on('pointerup', function() {
            //WORK IN PROGRESS
            const newPage = this.option.nextPage;
            if (newPage !== undefined) {
            self.destroyPage();
            self.displayPage(scene, self.fetchPage(newPage));
            }
          }, { letter });
          gameState.options.push({
          origStatementBox,
          origStatementText
          });
          
          //What to do when the box is hovered over
          origStatementBox.on('pointerover', function() {
            this.origStatementBox.setStrokeStyle(2, 0xffe014, 1);
            this.origStatementText.setColor('#ffe014');
          }, { origStatementBox, origStatementText });

          //What to do after box is clicked on
          origStatementBox.on('pointerout', function() {
            this.origStatementBox.setStrokeStyle(1, 0xb38c03, 1);
            this.origStatementText.setColor('#b39c0e');
          }, { origStatementBox, origStatementText });
        }

        //This is setup exactly the same as the original statement loop directly above
        //Only going to add additional commentary for any incremental changes to this loop
        //This loop is for the changeTo word
        for (let i=0; i<page.changeTo.length; i++) {
          let letter = page.changeTo[i];
      
          const changeToBox = scene.add.rectangle(40 + i * 20, 460, 20, 20, 0xb39c0e, 0)
          changeToBox.strokeColor = 0xb39c0e;
          changeToBox.strokeWeight = 2;
          changeToBox.strokeAlpha = 1;
          changeToBox.isStroked = true;
          changeToBox.setOrigin(0, 0)
      
          const baseX = 40 + i * 20;
          const changeToText = scene.add.text(baseX, 460, letter, { fontSize:14, fill: '#b39c0e', align: 'center', wordWrap: {width: 110}});
          const changeToTextBounds = changeToText.getBounds()
      
          changeToText.setX(changeToTextBounds.x + 5 - (changeToTextBounds.width / page.changeTo.length));
          changeToText.setY(changeToTextBounds.y + 3 - (changeToTextBounds.height / page.changeTo.length));
      
          changeToBox.setInteractive();

          var self = this;

          changeToBox.on('pointerup', function() {
            const newPage = this.option.nextPage;
            if (newPage !== undefined) {
            self.destroyPage();
            self.displayPage(scene, self.fetchPage(newPage));
            }
          }, { letter });
          gameState.options.push({
            changeToBox,
            changeToText
          });

          changeToBox.on('pointerover', function() {
            this.changeToBox.setStrokeStyle(2, 0xffe014, 1);
            this.changeToText.setColor('#ffe014');
          }, { changeToBox, changeToText });

          changeToBox.on('pointerout', function() {
            this.changeToBox.setStrokeStyle(1, 0xb38c03, 1);
            this.changeToText.setColor('#b39c0e');
          }, { changeToBox, changeToText });
        }
      }
    
      //This fetches the page aka level
      fetchPage(page) {
    
        //Object containing the details for each level
        const pages = [
          {
           origStatement: 'a cat!',
           changeTo: 'the cats!',
           page: 1,
           nextPage: 2
         },
         {
          origStatement: 'a cat and a hat',
          changeTo: 'the cat and the hat!',
          page: 2,
          nextPage: 3
        }
        ]
     
       return pages.find(function(e) { if(e.page == page) return e });
     }


}


