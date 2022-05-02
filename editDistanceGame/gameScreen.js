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
        //Add background image
        this.add.image(450,400,'sunset');
        //Sets the first page as the first level. Each "page" will represent a new level
        const firstPage = this.fetchPage(1);
        //Calls the initializePage method below
        this.initializePage(this, firstPage);
        //Calls the displayPage method below
        this.displayPage(this, firstPage);
        gameState.fetchCounter = 0;
        gameState.gameScene = this.scene;
        //If set to true, player wins, else, player loses
        gameState.winStatus = true;
      };

      //Function created to get the timer to countdown from 30
      onEvent(){
        //Destroy the time that was displayed previously
        gameState.timerDisplay.destroy();
        //Reduce the previous time by 1
        gameState.initialTime -= 1;
        //Add the time back, but at the reduced number
        gameState.timerDisplay = this.add.text(365, 60, gameState.initialTime, {fontSize: 80, fontFamily:'Britannic Bold', fill:'#000000'});
        //If the timer equals 0, end the game
        if(gameState.initialTime === 0){
          //Player loses
          gameState.winStatus = false;
          gameState.gameScene.stop('gameScreen');
          gameState.gameScene.start('endScreen');
        }
      }

      //Call our most efficient Levenshtein algorithm 
      editDistanceAlgorithm(originalWord, wordChangingTo){
        //Set score to edit distance calculated using Levenshtein distance. 
        //This score is displayed in the game as the score to match
        gameState.algorithScore = levenshtein3(originalWord, wordChangingTo);
      }

      
      
      //Builds the initial visuals for the game
      initializePage(scene, page) {
        if (!gameState.options) {
          //Creates an options list that will hold the box object created in the displayPage method
          gameState.options = [];
          gameState.changeToOptions = [];
        }
        
        //Creates the two boxes where the objective is displayed and where the player modifies their statement
        gameState.narrative_background = scene.add.rectangle(195, 170, 430, 200, 0xEAEDED);
        gameState.narrative_background.setStrokeStyle(8, 0xFADAB7);
        gameState.narrative_background.setOrigin(0, 0);
        gameState.narrative_background = scene.add.rectangle(195, 400, 430, 100, 0xEAEDED);
        gameState.narrative_background.setStrokeStyle(8, 0xFADAB7);
        gameState.narrative_background.setOrigin(0, 0);
        
        //Set player score to 0
        gameState.userScore = 0;
        //Call our Levenshtein algorithm on the two related statements
        this.editDistanceAlgorithm(page.origStatement, page.changeTo);
        //Set starting time for timer to 30 seconds
        gameState.initialTime = 30;
        
        //Below is setting the styling and text for what is displayed on the gameScreen
        gameState.narrativeStyle = { fill: '#0x000', fontStyle: 'italic', align: 'left', fontSize:22, fontFamily:'Britannic Bold', wordWrap: { width: 100 }, lineSpacing: 8};
        const narrativeStyle2 = { fill: '#0x000', fontStyle: 'italic', align: 'center', fontSize:22, fontFamily:'Britannic Bold', wordWrap: { width: 300 }, lineSpacing: 8};
        const userScoreBox = scene.add.rectangle(700, 170, 120, 80, 0xEAEDED);
        userScoreBox.setStrokeStyle(8, 0xFCBFDF );
        userScoreBox.setOrigin(0, 0);
        gameState.userScoreX = 725;
        gameState.userScoreY = 180;
        gameState.userScoreText = scene.add.text(gameState.userScoreX, gameState.userScoreY, "User Score: " + gameState.userScore,
        { fill: '#0x000', fontStyle: 'italic', align: 'left', fontSize:22, fontFamily:'Britannic Bold', wordWrap: { width: 100 }, lineSpacing: 8});
        const algorithScoreBox = scene.add.rectangle(700, 285, 120, 80, 0xEAEDED);
        algorithScoreBox.setStrokeStyle(8, 0xFBFCBF );
        algorithScoreBox.setOrigin(0, 0);
        gameState.algorithScoreText = scene.add.text(725, 295, "Score to Beat: " + gameState.algorithScore, 
        { fill: '#0x000', fontStyle: 'italic', align: 'left', fontSize:22, fontFamily:'Britannic Bold', wordWrap: { width: 100 }, lineSpacing: 8});
        scene.add.text(210, 220, "Statement to Edit: ", narrativeStyle2);
        scene.add.text(210, 290, "Objective Statement: ", narrativeStyle2);
        scene.add.text(325, 175, "Current State",{ fill: '#0x000', align: 'center',
         fontSize:32, fontFamily:'Britannic Bold', wordWrap: { width: 300 }, lineSpacing: 8} )
        scene.add.text(325, 405, "Workspace",{ fill: '#0x000', align: 'center',
         fontSize:32, fontFamily:'Britannic Bold', wordWrap: { width: 300 }, lineSpacing: 8} )
        gameState.changeTo = scene.add.text(220, 320, page.changeTo, { fill: '#1ADE9C', fontStyle: 'bold', align: 'center', fontSize:30, fontFamily:'Britannic Bold',
         wordWrap: { width: 300 }, lineSpacing: 8});
        gameState.changeToText = [];
        gameState.changeToTextBounds = [];


        //Preserve reference for use in callback function below
        var self = this;

        //Insert button created here
        const insertBox = scene.add.rectangle(190, 550, 125, 100, 0xEAEDED);
        insertBox.setStrokeStyle(8, 0xBFCCFC );
        insertBox.setOrigin(0, 0);
        insertBox.setInteractive();
        const insertBoxText = scene.add.text(223, 590, "Insert", 
        { fill: '#0x000', fontStyle: 'bold', align: 'left', fontSize:22, fontFamily:'Britannic Bold', wordWrap: { width: 100 }, lineSpacing: 8});
        const insertBoxTextBounds = insertBoxText.getBounds()

        //What to do when the box is hovered over
        insertBox.on('pointerover', function() {
          this.insertBox.setStrokeStyle(2, 0xffe014, 1);
          this.insertBoxText.setColor('#ffe014');
        }, { insertBox, insertBoxText });
        //What to do after box is hovered over
        insertBox.on('pointerout', function() {
          this.insertBox.setStrokeStyle(8, 0xBFCCFC );
          this.insertBoxText.setColor('#0x000');
        }, { insertBox, insertBoxText });
        //What to do when box is clicked on
        insertBox.on('pointerup', function() {
            self.origStatementActions(scene, page, "insert");
        });
        

        //Delete button created here
        const deleteBox = scene.add.rectangle(345, 550, 125, 100, 0xEAEDED);
        deleteBox.setStrokeStyle(8, 0xBFCCFC );
        deleteBox.setOrigin(0, 0);
        deleteBox.setInteractive();
        const deleteBoxText = scene.add.text(378, 590, "Delete", 
        { fill: '#0x000', fontStyle: 'bold', align: 'left', fontSize:22, fontFamily:'Britannic Bold', wordWrap: { width: 100 }, lineSpacing: 8});
        const deleteBoxTextBounds = deleteBoxText.getBounds()

        //What to do when the box is hovered over
        deleteBox.on('pointerover', function() {
          this.deleteBox.setStrokeStyle(2, 0xffe014, 1);
          this.deleteBoxText.setColor('#ffe014');
        }, { deleteBox, deleteBoxText });
        //What to do after box is hovered over
        deleteBox.on('pointerout', function() {
          this.deleteBox.setStrokeStyle(8, 0xBFCCFC );
          this.deleteBoxText.setColor('#0x000');
        }, { deleteBox, deleteBoxText });
        //What to do when box is clicked on
        deleteBox.on('pointerup', function() {
          self.origStatementActions(scene, page, "delete");
        });

        //Substitute button created here
        const substituteBox = scene.add.rectangle(500, 550, 125, 100, 0xEAEDED);
        substituteBox.setStrokeStyle(8, 0xBFCCFC );
        substituteBox.setOrigin(0, 0);
        substituteBox.setInteractive();
        const substituteBoxText = scene.add.text(515, 590, "Substitute", 
        { fill: '#0x000', fontStyle: 'bold', align: 'left', fontSize:22, fontFamily:'Britannic Bold', wordWrap: { width: 100 }, lineSpacing: 8});
        const substituteBoxTextBounds = substituteBoxText.getBounds();

        //What to do when the box is hovered over
        substituteBox.on('pointerover', function() {
          this.substituteBox.setStrokeStyle(2, 0xffe014, 1);
          this.substituteBoxText.setColor('#ffe014');
        }, { substituteBox, substituteBoxText });
        //What to do after box is hovered over
        substituteBox.on('pointerout', function() {
          this.substituteBox.setStrokeStyle(8, 0xBFCCFC );
          this.substituteBoxText.setColor('#0x000');
        }, { substituteBox, substituteBoxText });
        //What to do when box is clicked on
        substituteBox.on('pointerup', function() {
          self.origStatementActions(scene, page, "substitute");
        });
        
        //Substitute button created here
        const timerBox = scene.add.rectangle(410, 80, 300, 130, 0xEAEDED);
        timerBox.setStrokeStyle(5,0xD8BFD8);
        const timerBoxText = scene.add.text(300, 20, "Time Remaining!", { fontSize:32, fontFamily:'Britannic Bold', fill: '#D37DFA', align: 'center', wordWrap: {width: 300}});
        const timerBoxTextBounds = timerBoxText.getBounds();
        gameState.timerDisplay = this.add.text(365, 60, gameState.initialTime, {fontSize: 80, fontFamily:'Britannic Bold', fill:'#000000'});
        this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });

        
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

      //The different interactions that a player has with their workspace are created here
      origStatementActions(scene, page, action) {
        //Create an array to hold the boxes that will be added around each letter in the workspace
        let origStateboxArr = [];
        let y = 0
        if(action=="insert"){
          //If the user selects to insert we want to add one extra box than what the string's length is
          //That way they can add a letter to the end
          y = 1
        }
        //For each letter in original (top) statement
        for (let i=0; i<page.origStatement.length + y; i++) {
  
          //Creates a box for each individual letter
          const origStatementBox = scene.add.rectangle(205 + i * 20, 450, 20, 30, 0xb39c0e, 0)
          origStatementBox.strokeColor = 0x45D1CB;
          origStatementBox.strokeWeight = 4;
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

          //Preserve state
          var self = this;
        
          //What to do when box is clicked on
          origStatementBox.on('pointerup', function() {
            if(action === "insert"){
              //Call the HTML input form
              let element = scene.add.dom(400, 700).createFromCache('input');
              //Add listener
              element.addListener('click');
              //On click
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
                  gameState.userScore += letter.length;
                  gameState.userScoreText = scene.add.text(gameState.userScoreX, gameState.userScoreY, "User Score: " + gameState.userScore, gameState.narrativeStyle);
                  if(gameState.userScore > gameState.algorithScore){
                    gameState.winStatus = false;
                    gameState.gameScene.stop('gameScreen');
                    gameState.gameScene.start('endScreen');
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
                gameState.winStatus = false;
                gameState.gameScene.stop('gameScreen');
                gameState.gameScene.start('endScreen');
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
              let element = scene.add.dom(400, 700).createFromCache('input');
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
                  gameState.userScore += letter.length;
                  gameState.userScoreText = scene.add.text(gameState.userScoreX, gameState.userScoreY, "User Score: " + gameState.userScore, gameState.narrativeStyle);
                  if(gameState.userScore > gameState.algorithScore){
                    gameState.winStatus = false;
                    gameState.gameScene.stop('gameScreen');
                    gameState.gameScene.start('endScreen');
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
          origStatementBox.setStrokeStyle(4, 0x45D1CB, 1);
          origStatementText.setColor('#E8318F');
          }, {origStatementBox, origStatementText});
                      
          //What to do after box is hovered over
          origStatementBox.on('pointerout', function() {
          origStatementBox.setStrokeStyle(1, 0x45D1CB, 1);
          origStatementText.setColor('#45D1CB');
          }, {origStatementBox, origStatementText});
                
          gameState.options.push({
          origStatementBox,
          origStatementText
          });
                  
        
        }

      }
    

      //Most of the work is being done here
      displayPage(scene, page) {

        //Text in the top black box is added here
        
        gameState.origStatement = scene.add.text(220, 247, page.origStatement,
          { fill: '#EF1C1C', fontStyle: 'bold', align: 'center', fontSize:30, fontFamily:'Britannic Bold',
          wordWrap: { width: 300 }, lineSpacing: 8});
        
        gameState.origStatementText = [];
        gameState.origStatementTextBounds = [];

        

        for (let i=0; i<page.origStatement.length + 1; i++) {
          //Adds a character to each box
          const baseX = 205 + i * 20;
          if (i === page.origStatement.length){
            let letter = "";
            gameState.origStatementText.push(scene.add.text(baseX, 455, letter, { fontSize:18, fill: '#45D1CB', align: 'center', wordWrap: {width: 110}}));
            gameState.origStatementTextBounds.push(gameState.origStatementText[i].getBounds());
          } else {
          let letter = page.origStatement[i];
          gameState.origStatementText.push(scene.add.text(baseX, 455, letter, { fontSize:18, fill: '#45D1CB', fontStyle:'bold', align: 'center', wordWrap: {width: 110}}));
          gameState.origStatementTextBounds.push(gameState.origStatementText[i].getBounds());
          }
        }

      }
    
      //This fetches the page aka level
      fetchPage(page) {

        //If all levels are complete, end game
        if(page === 4){
          gameState.gameScene.stop('gameScreen');
          gameState.gameScene.start('endScreen');
        }
    
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
        },
        {
          origStatement: 'game',
          changeTo: 'over',
          page: 4,
          nextPage: 1
        }
        ]

        //Special case with browser prompt
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
            nextPage: 4,
          })
        }


     
       return pages.find(function(e) { if(e.page == page) return e });
     }


}


