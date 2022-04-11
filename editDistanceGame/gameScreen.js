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
        this.load.image('sunset', 'assets/sunsetbackground.png');
      }
      
    //Called after preload. Gets the game setup process started
    create () {
        this.add.image(450,400,'sunset');
        //Sets the first page as the first level. Each "page" will represent a new level
        const firstPage = this.fetchPage(1);
        //Calls the initializePage method below
        this.initializePage(this, firstPage);
        //Calls the displayPage method below
        this.displayPage(this, firstPage);

        gameState.fetchCounter = 0;

        gameState.gameScene = this.scene;

        


      };

      onEvent(){
        gameState.timerDisplay.destroy();
        gameState.initialTime -= 1;
        gameState.timerDisplay = this.add.text(175, 90, gameState.initialTime);
        if(gameState.initialTime === 0){
          gameState.gameScene.stop('gameScreen');
          gameState.gameScene.start('startScreen');
        }
      }

      editDistanceAlgorithm(originalWord, wordChangingTo){
        gameState.algorithScore = levenshtein3(originalWord, wordChangingTo);
      }

      
      
      //Builds the initial visuals for the game
      initializePage(scene, page) {
        if (!gameState.options) {
          //Creates an options list that will hold the box object created in the displayPage method
          gameState.options = [];
          gameState.changeToOptions = [];
        }
        
        //Creates the two black boxes where the objective is displayed and where the player modifies their statement
        gameState.narrative_background = scene.add.rectangle(200, 160, 430, 170, 0x000);
        gameState.narrative_background.setOrigin(0, 0);
        gameState.narrative_background = scene.add.rectangle(200, 360, 430, 170, 0x000);
        gameState.narrative_background.setOrigin(0, 0);


        

        gameState.userScore = 0;
        this.editDistanceAlgorithm(page.origStatement, page.changeTo);
        gameState.initialTime = 31;
        gameState.timerDisplay = this.add.text(175, 90, gameState.initialTime);
        this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });
        

        gameState.narrativeStyle = { fill: '#ffffff', fontStyle: 'italic', align: 'center', wordWrap: { width: 100 }, lineSpacing: 8};
        const narrativeStyle2 = { fill: '#ffffff', fontStyle: 'italic', align: 'center', wordWrap: { width: 300 }, lineSpacing: 8};
        const userScoreBox = scene.add.rectangle(770, 200, 120, 80, 0x000);
        userScoreBox.strokeColor = 0xb39c0e;
        userScoreBox.strokeWeight = 2;
        userScoreBox.strokeAlpha = 1;
        userScoreBox.isStroked = true;
        gameState.userScoreX = 725;
        gameState.userScoreY = 180;
        gameState.userScoreText = scene.add.text(gameState.userScoreX, gameState.userScoreY, "User Score: " + gameState.userScore, gameState.narrativeStyle);
        const algorithScoreBox = scene.add.rectangle(770, 285, 120, 80, 0x000);
        algorithScoreBox.strokeColor = 0xb39c0e;
        algorithScoreBox.strokeWeight = 2;
        algorithScoreBox.strokeAlpha = 1;
        algorithScoreBox.isStroked = true;
        gameState.algorithScoreText = scene.add.text(725, 265, "Score to Beat: " + gameState.algorithScore, gameState.narrativeStyle);
        scene.add.text(300, 180, "Statement to Edit: ", narrativeStyle2);
        scene.add.text(300, 250, "Objective Statement: ", narrativeStyle2);
        gameState.changeTo = scene.add.text(300, 270, page.changeTo, narrativeStyle2);
        gameState.changeToText = [];
        gameState.changeToTextBounds = [];


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
          const origStatementBox = scene.add.rectangle(210 + i * 20, 425, 20, 30, 0xb39c0e, 0)
          origStatementBox.strokeColor = 0xb39c0e;
          origStatementBox.strokeWeight = 2;
          origStatementBox.strokeAlpha = 1;
          origStatementBox.isStroked = true;
          origStatementBox.setOrigin(0, 0)

          origStateboxArr.push(origStatementBox);

          const origStatementText = gameState.origStatementText[i];
          const origStatementTextBounds = gameState.origStatementTextBounds[i];
              
          //Centers character within box
          origStatementText.setX(origStatementTextBounds.x + 3 - (origStatementTextBounds.width / page.origStatement.length));
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
                  gameState.userScoreText.destroy();
                  gameState.userScore += 1;
                  gameState.userScoreText = scene.add.text(gameState.userScoreX, gameState.userScoreY, "User Score: " + gameState.userScore, gameState.narrativeStyle);
                  if(gameState.userScore > gameState.algorithScore){
                    gameState.gameScene.stop('gameScreen');
                    gameState.gameScene.start('startScreen');
                  }
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
              gameState.userScoreText.destroy();
              gameState.userScore += 1;
              gameState.userScoreText = scene.add.text(gameState.userScoreX, gameState.userScoreY, "User Score: " + gameState.userScore, gameState.narrativeStyle);
              if(gameState.userScore > gameState.algorithScore){
                gameState.gameScene.stop('gameScreen');
                gameState.gameScene.start('startScreen');
              }
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
                  gameState.userScoreText.destroy();
                  gameState.userScore += 1;
                  gameState.userScoreText = scene.add.text(gameState.userScoreX, gameState.userScoreY, "User Score: " + gameState.userScore, gameState.narrativeStyle);
                  if(gameState.userScore > gameState.algorithScore){
                    gameState.gameScene.stop('gameScreen');
                    gameState.gameScene.start('startScreen');
                  }
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
        
        gameState.origStatement = scene.add.text(300, 200, page.origStatement, narrativeStyle);
        
        gameState.origStatementText = [];
        gameState.origStatementTextBounds = [];

        

        for (let i=0; i<page.origStatement.length + 1; i++) {
          //Adds a character to each box
          const baseX = 210 + i * 20;
          if (i === page.origStatement.length){
            let letter = "";
            gameState.origStatementText.push(scene.add.text(baseX, 425, letter, { fontSize:25, fill: '#b39c0e', align: 'center', wordWrap: {width: 110}}));
            gameState.origStatementTextBounds.push(gameState.origStatementText[i].getBounds());
          } else {
          let letter = page.origStatement[i];
          gameState.origStatementText.push(scene.add.text(baseX, 425, letter, { fontSize:25, fill: '#b39c0e', align: 'center', wordWrap: {width: 110}}));
          gameState.origStatementTextBounds.push(gameState.origStatementText[i].getBounds());
          }
        }

      }
    
      //This fetches the page aka level
      fetchPage(page) {
    
        //Object containing the details for each level
        const pages = [
          {
           origStatement: 'testing testing test',
           changeTo: 'resting resting rest',
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
            window.alert("For this last level you get to enter the original statement and the statement to edit it to. This will prove that our algorithm for calculating"
            + " edit distance actually works! (please note only first 20 characters are used)");
            gameState.tempOrigStatement = window.prompt("enter origStatement: ");
            if(gameState.tempOrigStatement.length > 20){
              gameState.tempOrigStatement = gameState.tempOrigStatement.slice(0, 20);
            }
            gameState.tempChangeTo = window.prompt("enter changeTo: ");
            if(gameState.tempChangeTo.length > 20){
              gameState.tempChangeTo = gameState.tempChangeTo.slice(0, 20);
            }
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


