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
        this.load.html('input', 'assets/inputform.html');
      }
      
    //Called after preload. Gets the game setup process started
    create () {
        //Sets the first page as the first level. Each "page" will represent a new level
        const firstPage = this.fetchPage(1);
        //Calls the initializePage method below
        this.initializePage(this, firstPage);
        //Calls the displayPage method below
        this.displayPage(this, firstPage);

        gameState.fetchCounter = 0;

        


      };

      onEvent(){
        gameState.timerDisplay.destroy();
        gameState.initialTime -= 1;
        gameState.timerDisplay = this.add.text(175, 90, gameState.initialTime);
        if(gameState.initialTime === 0){
          gameState.timerDisplay = this.add.text(175, 90, "Game Over!");
          this.time.removeAllEvents();
          this.initializePage(this, this.fetchPage(1));
        }
      }

      editDistanceAlgorithm(){

        return 5;
      }

      
      
      //Builds the initial visuals for the game
      initializePage(scene, page) {
        if (!gameState.options) {
          //Creates an options list that will hold the box object created in the displayPage method
          gameState.options = [];
          gameState.changeToOptions = [];
        }
        
        if (!gameState.narrative_background) {
          //Creates the two black boxes where the objective is displayed and where the player modifies their statement
          gameState.narrative_background = scene.add.rectangle(10, 160, 430, 170, 0x000);
          gameState.narrative_background.setOrigin(0, 0);
          gameState.narrative_background = scene.add.rectangle(10, 360, 430, 170, 0x000);
          gameState.narrative_background.setOrigin(0, 0);
        }

        

        gameState.userScore = 0;
        gameState.algorithScore = this.editDistanceAlgorithm();
        gameState.initialTime = 31;
        gameState.timerDisplay = this.add.text(175, 90, gameState.initialTime);
        this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });
        

        const narrativeStyle = { fill: '#ffffff', fontStyle: 'italic', align: 'center', wordWrap: { width: 340 }, lineSpacing: 8};
        scene.add.text(50, 180, "Statement to Edit: ", narrativeStyle);
        scene.add.text(50, 250, "Objective Statement: ", narrativeStyle);
        gameState.changeTo = scene.add.text(50, 270, page.changeTo, narrativeStyle);
        gameState.changeToText = [];
        gameState.changeToTextBounds = [];

        for (let i=0; i<page.changeTo.length; i++) {
          let letter = page.changeTo[i];
          //Adds a character to each box
          const baseX = 40 + i * 20;
          gameState.changeToText.push(scene.add.text(baseX, 460, letter, { fontSize:14, fill: '#b39c0e', align: 'center', wordWrap: {width: 110}}));
          gameState.changeToTextBounds.push(gameState.changeToText[i].getBounds());
          const changeToTex = gameState.changeToText[i];
          gameState.changeToOptions.push(changeToTex);
        }

                //Preserve reference for use in callback function below
        var self = this;

        //Insert button created here
        const insertBox = scene.add.rectangle(80, 600, 75, 50, 0x000);
        insertBox.strokeColor = 0xb39c0e;
        insertBox.strokeWeight = 2;
        insertBox.strokeAlpha = 1;
        insertBox.isStroked = true;
        insertBox.setInteractive();
        const insertBoxText = scene.add.text(55, 595, "Insert", { fontSize:14, fill: '#b39c0e', align: 'center', wordWrap: {width: 110}});
        const insertBoxTextBounds = insertBoxText.getBounds()

                //What to do when the box is hovered over
        insertBox.on('pointerover', function() {
          this.insertBox.setStrokeStyle(2, 0xffe014, 1);
          this.insertBoxText.setColor('#ffe014');
        }, { insertBox, insertBoxText });
        //What to do after box is hovered over
        insertBox.on('pointerout', function() {
          this.insertBox.setStrokeStyle(1, 0xb38c03, 1);
          this.insertBoxText.setColor('#b39c0e');
        }, { insertBox, insertBoxText });
        //What to do when box is clicked on
        insertBox.on('pointerup', function() {
            self.origStatementActions(scene, page, "insert");
        });
        

        //Delete button created here
        const deleteBox = scene.add.rectangle(205, 600, 75, 50, 0x000);
        deleteBox.strokeColor = 0xb39c0e;
        deleteBox.strokeWeight = 2;
        deleteBox.strokeAlpha = 1;
        deleteBox.isStroked = true;
        deleteBox.setInteractive();
        const deleteBoxText = scene.add.text(180, 595, "Delete", { fontSize:14, fill: '#b39c0e', align: 'center', wordWrap: {width: 110}});
        const deleteBoxTextBounds = deleteBoxText.getBounds()

        //What to do when the box is hovered over
        deleteBox.on('pointerover', function() {
          this.deleteBox.setStrokeStyle(2, 0xffe014, 1);
          this.deleteBoxText.setColor('#ffe014');
        }, { deleteBox, deleteBoxText });
        //What to do after box is hovered over
        deleteBox.on('pointerout', function() {
          this.deleteBox.setStrokeStyle(1, 0xb38c03, 1);
          this.deleteBoxText.setColor('#b39c0e');
        }, { deleteBox, deleteBoxText });
        //What to do when box is clicked on
        deleteBox.on('pointerup', function() {
          self.origStatementActions(scene, page, "delete");
        });

        //Substitute button created here
        const substituteBox = scene.add.rectangle(330, 600, 75, 50, 0x000);
        substituteBox.strokeColor = 0xb39c0e;
        substituteBox.strokeWeight = 2;
        substituteBox.strokeAlpha = 1;
        substituteBox.isStroked = true;
        substituteBox.setInteractive();
        const substituteBoxText = scene.add.text(305, 595, "Substi.", { fontSize:14, fill: '#b39c0e', align: 'center', wordWrap: {width: 110}});
        const substituteBoxTextBounds = substituteBoxText.getBounds();

        //What to do when the box is hovered over
        substituteBox.on('pointerover', function() {
          this.substituteBox.setStrokeStyle(2, 0xffe014, 1);
          this.substituteBoxText.setColor('#ffe014');
        }, { substituteBox, substituteBoxText });
        //What to do after box is hovered over
        substituteBox.on('pointerout', function() {
          this.substituteBox.setStrokeStyle(1, 0xb38c03, 1);
          this.substituteBoxText.setColor('#b39c0e');
        }, { substituteBox, substituteBoxText });
        //What to do when box is clicked on
        substituteBox.on('pointerup', function() {
          self.origStatementActions(scene, page, "substitute");
        });
        
        //Substitute button created here
        const timerBox = scene.add.rectangle(225, 100, 150, 50, 0x000);
        timerBox.strokeColor = 0xb39c0e;
        timerBox.strokeWeight = 2;
        timerBox.strokeAlpha = 1;
        timerBox.isStroked = true;
        const timerBoxText = scene.add.text(165, 77, "Time Remaining!", { fontSize:14, fill: '#b39c0e', align: 'center', wordWrap: {width: 150}});
        const timerBoxTextBounds = timerBoxText.getBounds();

        
      }
      
      //Called when moving from one page to the next
      destroyPage() {
      
        if (gameState.narrative) {
          gameState.narrative.destroy();
        }
        
        if(gameState.origStatement){
          gameState.origStatement.destroy();
        }
      
        for (let option of gameState.options) {
          option.origStatementBox.destroy();
          option.origStatementText.destroy();
        }
      }

      origStatementActions(scene, page, action) {
        let origStateboxArr = [];
        //For each letter in original (top) statement
        for (let i=0; i<page.origStatement.length + 1; i++) {
  
          //Creates a box for each individual letter
          const origStatementBox = scene.add.rectangle(40 + i * 20, 400, 20, 20, 0xb39c0e, 0)
          origStatementBox.strokeColor = 0xb39c0e;
          origStatementBox.strokeWeight = 2;
          origStatementBox.strokeAlpha = 1;
          origStatementBox.isStroked = true;
          origStatementBox.setOrigin(0, 0)

          origStateboxArr.push(origStatementBox);

          const origStatementText = gameState.origStatementText[i];
          const origStatementTextBounds = gameState.origStatementTextBounds[i];
              
          //Centers character within box
          origStatementText.setX(origStatementTextBounds.x + 5 - (origStatementTextBounds.width / page.origStatement.length));
          origStatementText.setY(origStatementTextBounds.y + 3 - (origStatementTextBounds.height / page.origStatement.length));

          //Makes boxes interactive
          origStatementBox.setInteractive();

          var self = this;
        
          //What to do when box is clicked on
          //WORK IN PROGRESS
          origStatementBox.on('pointerup', function() {
            if(action === "insert"){
              let element = scene.add.dom(400, 50).createFromCache('input');
              element.addListener('click');
              element.on('click', function (event) {
                if(event.target.name === 'playButton'){ 
                  let inputChar = this.getChildByName('inputForm');
                  let letter = inputChar.value;
                  this.removeListener('click');
                  this.destroy();
                  let selectedLetterIndex = origStateboxArr.indexOf(origStatementBox);
                  let origStatementHolder = page.origStatement;
                  let newStatement = "";
                  for (let i=0; i<origStatementHolder.length + 1; i++) {
                    if(i < selectedLetterIndex) {
                      newStatement += origStatementHolder[i];
                    }else if (i == selectedLetterIndex) {
                      newStatement += letter;
                    } else {
                      newStatement += origStatementHolder[i - 1];
                    }
                  };
                  page.origStatement = newStatement;
                  self.destroyPage();
                  if(page.origStatement === page.changeTo){
                    gameState.changeTo.destroy();
                    for (let option of gameState.changeToOptions) {
                      option.destroy();
                    }
                    self.time.removeAllEvents();
                    self.initializePage(scene, self.fetchPage(page.nextPage));
                    self.displayPage(scene, self.fetchPage(page.nextPage));
                  } else{
                    self.displayPage(scene, page);
                  }
                    }
              })
            } else if(action === "delete"){
              let selectedLetterIndex = origStateboxArr.indexOf(origStatementBox);
              let origStatementHolder = page.origStatement;
              let newStatement = "";
              for (let i=0; i<origStatementHolder.length - 1; i++) {
                if(i < selectedLetterIndex) {
                  newStatement += origStatementHolder[i];
                } else {
                  newStatement += origStatementHolder[i + 1];
                }
              };

              page.origStatement = newStatement;
              self.destroyPage();
              if(page.origStatement === page.changeTo){
                gameState.changeTo.destroy();
                for (let option of gameState.changeToOptions) {
                  option.destroy();
                }
                self.time.removeAllEvents();
                self.initializePage(scene, self.fetchPage(page.nextPage));
                self.displayPage(scene, self.fetchPage(page.nextPage));
              } else{
                self.displayPage(scene, page);
              }

            } else if(action === "substitute"){
              let letter = window.prompt("enter letter to substitute: ");
              let selectedLetterIndex = origStateboxArr.indexOf(origStatementBox);
              let origStatementHolder = page.origStatement;
              let newStatement = "";
              for (let i=0; i<origStatementHolder.length; i++) {
                if(i < selectedLetterIndex) {
                  newStatement += origStatementHolder[i];
                }else if (i == selectedLetterIndex) {
                  newStatement += letter;
                } else {
                  newStatement += origStatementHolder[i];
                }
              };

              page.origStatement = newStatement;
              self.destroyPage();
              if(page.origStatement === page.changeTo){
                gameState.changeTo.destroy();
                for (let option of gameState.changeToOptions) {
                  option.destroy();
                }
                self.time.removeAllEvents();
                self.initializePage(scene, self.fetchPage(page.nextPage));
                self.displayPage(scene, self.fetchPage(page.nextPage));
              } else{
                self.displayPage(scene, page);
              }

            }

          }, {});

          
          
          //What to do when the box is hovered over
          origStatementBox.on('pointerover', function() {
          origStatementBox.setStrokeStyle(2, 0xffe014, 1);
          origStatementText.setColor('#ffe014');
          }, {origStatementBox, origStatementText});
                      
          //What to do after box is hovered over
          origStatementBox.on('pointerout', function() {
          origStatementBox.setStrokeStyle(1, 0xb38c03, 1);
          origStatementText.setColor('#b39c0e');
          }, {origStatementBox, origStatementText});
                
          gameState.options.push({
          origStatementBox,
          origStatementText
          });
                  
        
        }

      }
    

      //Most of the work is being done here
      displayPage(scene, page) {
        //Text styling used
        const narrativeStyle = { fill: '#ffffff', fontStyle: 'italic', align: 'center', wordWrap: { width: 340 }, lineSpacing: 8};
        //Text in the top black box is added here
        
        gameState.origStatement = scene.add.text(50, 200, page.origStatement, narrativeStyle);
        
        gameState.origStatementText = [];
        gameState.origStatementTextBounds = [];

        

        for (let i=0; i<page.origStatement.length + 1; i++) {
          if (i === page.origStatement.length){
            let letter = "";
            //Adds a character to each box
            const baseX = 40 + i * 20;
            gameState.origStatementText.push(scene.add.text(baseX, 400, letter, { fontSize:14, fill: '#b39c0e', align: 'center', wordWrap: {width: 110}}));
            gameState.origStatementTextBounds.push(gameState.origStatementText[i].getBounds());
          } else {
          let letter = page.origStatement[i];
          //Adds a character to each box
          const baseX = 40 + i * 20;
          gameState.origStatementText.push(scene.add.text(baseX, 400, letter, { fontSize:14, fill: '#b39c0e', align: 'center', wordWrap: {width: 110}}));
          gameState.origStatementTextBounds.push(gameState.origStatementText[i].getBounds());
          }
        }

      }
    
      //This fetches the page aka level
      fetchPage(page) {
    
        //Object containing the details for each level
        const pages = [
          {
           origStatement: 'hey',
           changeTo: 'hay',
           page: 1,
           nextPage: 2
         },
         {
          origStatement: 'the',
          changeTo: 'tha',
          page: 2,
          nextPage: 3
        }
        ]

        if(page === 3){
          if(gameState.fetchCounter === 0){
            gameState.tempOrigStatement = window.prompt("enter origStatement: ");
            gameState.tempChangeTo = window.prompt("enter changeTo: ");
            gameState.fetchCounter =+ 1;
          }
          pages.push({
            origStatement: gameState.tempOrigStatement,
            changeTo: gameState.tempChangeTo,
            page: 3,
            nextPage: 1,
          })
        }


     
       return pages.find(function(e) { if(e.page == page) return e });
     }


}


