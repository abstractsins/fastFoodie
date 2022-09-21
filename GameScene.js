// BACKUP of accomplishing steps 1-47
const gameState = {
    score: 0,
    starRating: 5,
    customersServedCount: 0,
    customerIsReady: false,
    readyForNextOrder: true,
    cam: {},
    gameSpeed: 1,
    currentWaveCount: 1,
    totalWaveCount: 4,
    currentMusic: {},
    countdownTimer: 5000
  };
  
  // Gameplay scene
  class GameScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameScene' })
    }
  
    preload() {
      // Preload images
      const baseURL = 'https://content.codecademy.com/courses/learn-phaser/fastfoodie/';
      this.load.image('Chef', `${baseURL}art/Chef.png`);
      this.load.image('Customer-1', `${baseURL}art/Customer-1.png`);
      this.load.image('Customer-2', `${baseURL}art/Customer-2.png`);
      this.load.image('Customer-3', `${baseURL}art/Customer-3.png`);
      this.load.image('Customer-4', `${baseURL}art/Customer-4.png`);
      this.load.image('Customer-5', `${baseURL}art/Customer-5.png`);
      this.load.image('Floor-Server', `${baseURL}art/Floor-Server.png`);
      this.load.image('Floor-Customer', `${baseURL}art/Floor-Customer.png`);
      this.load.image('Tray', `${baseURL}art/Tray.png`);
      this.load.image('Barrier', `${baseURL}art/Barrier.png`);
      this.load.image('Star-full', `${baseURL}art/Star-full.png`);
      this.load.image('Star-half', `${baseURL}art/Star-half.png`);
      this.load.image('Star-empty', `${baseURL}art/Star-empty.png`);
  
      // Preload song
      this.load.audio('gameplayTheme', [
        `${baseURL}audio/music/2-gameplayTheme.ogg`,
        `${baseURL}audio/music/2-gameplayTheme.mp3`
      ]); // Credit: "Pixel Song #18" by hmmm101: https://freesound.org/people/hmmm101
  
      // Preload SFX
      this.load.audio('placeFoodSFX', [
        `${baseURL}audio/sfx/placeFood.ogg`,
        `${baseURL}audio/sfx/placeFood.mp3`
      ]); // Credit: "action_02.wav" by dermotte: https://freesound.org/people/dermotte
  
      this.load.audio('servingCorrectSFX', [
        `${baseURL}audio/sfx/servingCorrect.ogg`,
        `${baseURL}audio/sfx/servingCorrect.mp3`
      ]); // Credit: "Video Game SFX Positive Action Long Tail" by rhodesmas: https://freesound.org/people/djlprojects
  
      this.load.audio('servingIncorrectSFX', [
        `${baseURL}audio/sfx/servingIncorrect.ogg`,
        `${baseURL}audio/sfx/servingIncorrect.mp3`
      ]); // Credit: "Incorrect 01" by rhodesmas: https://freesound.org/people/rhodesmas
  
      this.load.audio('servingEmptySFX', [
        `${baseURL}audio/sfx/servingEmpty.ogg`,
        `${baseURL}audio/sfx/servingEmpty.mp3`
      ]); // Credit: "Computer Error Noise [variants of KevinVG207's Freesound#331912].wav" by Timbre: https://freesound.org/people/Timbre
  
      this.load.audio('fiveStarsSFX', [
        `${baseURL}audio/sfx/fiveStars.ogg`,
        `${baseURL}audio/sfx/fiveStars.mp3`
      ]); // Credit: "Success 01" by rhodesmas: https://freesound.org/people/rhodesmas
  
      this.load.audio('nextWaveSFX', [
        `${baseURL}audio/sfx/nextWave.ogg`,
        `${baseURL}audio/sfx/nextWave.mp3`
      ]); // Credit: "old fashion radio jingle 2.wav" by rhodesmas: https://freesound.org/people/chimerical
    }
  
    create() {
      // Reset everything after loss
      this.restart();
       
      // Stop, reassign, and play the new music
      gameState.currentMusic.stop();
      gameState.currentMusic = this.sound.add('gameplayTheme');
      gameState.currentMusic.play({ loop: true });
  
      // Assign SFX
      gameState.sfx = {};
      gameState.sfx.placeFood = this.sound.add('placeFoodSFX');
      gameState.sfx.servingCorrect = this.sound.add('servingCorrectSFX');
      gameState.sfx.servingIncorrect = this.sound.add('servingIncorrectSFX');
      gameState.sfx.servingEmpty = this.sound.add('servingEmptySFX');
      gameState.sfx.fiveStars = this.sound.add('fiveStarsSFX');
      gameState.sfx.nextWave = this.sound.add('nextWaveSFX');
  
      // Create environment sprites
      gameState.floorServer = this.add.sprite(gameState.cam.midPoint.x, 0, 'Floor-Server').setScale(0.5).setOrigin(0.5, 0);
      gameState.floorCustomer = this.add.sprite(gameState.cam.midPoint.x, gameState.cam.worldView.bottom, 'Floor-Customer').setScale(0.5).setOrigin(0.5, 1);
      gameState.table = this.add.sprite(gameState.cam.midPoint.x, gameState.cam.midPoint.y, 'Barrier').setScale(0.5);
  
      // Create player and tray sprites
      gameState.tray = this.add.sprite(gameState.cam.midPoint.x, gameState.cam.midPoint.y, 'Tray').setScale(0.5);
      gameState.player = this.add.sprite(gameState.cam.midPoint.x, 200, 'Chef').setScale(0.5);
  
      // Display the score
      gameState.scoreTitleText = this.add.text(gameState.cam.worldView.left + 150, 90, 'Score', { fontSize: '40px', fill: '#666666' }).setOrigin(0.5);
      gameState.scoreText = this.add.text(gameState.cam.worldView.left + 150, gameState.scoreTitleText.y + gameState.scoreTitleText.height + 20, gameState.score, { fontSize: '60px', fill: '#000000' }).setOrigin(0.5);
  
      // Display the wave count
      gameState.waveTitleText = this.add.text(gameState.cam.worldView.right - 20, 30, 'Wave', { fontSize: '84px', fill: '#666666' }).setOrigin(1, 1).setScale(0.35);
      gameState.waveCountText = this.add.text(gameState.cam.worldView.right - 20, 30, gameState.currentWaveCount + '/' + gameState.totalWaveCount, { fontSize: '120px', fill: '#000000' }).setOrigin(1, 0).setScale(0.35);
  
      // Display number of customers left
      gameState.customerCountText = this.add.text(gameState.cam.worldView.right - 20, 100, `Customers left: ${gameState.customersLeftCount}`, { fontSize: '35px', fill: '#000000' }).setOrigin(1);
      
      // Generate wave group
      gameState.customers = this.add.group();
      this.generateWave();
  
      // keeping track of the currentMeal
      gameState.currentMeal = this.add.group();
      gameState.currentMeal.fullnessValue = 0;

      gameState.keys.Enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
      gameState.keys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      gameState.keys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      gameState.keys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  
      // Keeping track of ratings
      gameState.starGroup = this.add.group();

      // Creating a timer
      gameState.timer = this.time.addEvent({
        delay: gameState.countdownTimer,
        loop: false,
        paused: true,
      });
      // CONSOLE TESTING
      //console.log(gameState.countdownTimer);

      // Display opening stars
      this.drawStars();

    }; // create() {
  
    update() {

      if (gameState.readyForNextOrder) {
        gameState.readyForNextOrder = !true;
        gameState.customerIsReady = false;
        
        // Tween for removing previous customer
        for (let i = 0; i < gameState.customersServedCount; i++) {
          this.tweens.add({
            targets: gameState.currentCustomer,
            x: '-=300', 
            duration: 750,
            angle: 0,            
            onStart: () => {
              gameState.customers.children.entries[i].meterContainer.visible = false;
              for (let n = 1; n < gameState.customersServedCount; n++) {
                if (gameState.customersServedCount >= 1) {
                  this.tweens.add({
                    targets: gameState.customers.children.entries[n - 1],
                    x: '-=300', 
                    duration: 750,
                    angle: 0,            
                  }); // tween
                }
              }
            }, // onStart
          });// tween
        } // for loop

        // Assigns new/current customer after previous has left
        gameState.currentCustomer = gameState.customers.children.entries[gameState.customersServedCount];
        gameState.nextCustomer = gameState.customers.children.entries[gameState.customersServedCount + 1];

        // If there is a next customer, line them up...
        if (gameState.nextCustomer) {
          for (let j = gameState.customersServedCount + 1; j < gameState.customersServedCount + gameState.customersLeftCount; j++) {
            this.tweens.add({
              targets: gameState.customers.children.entries[j],
              x: '-=200',              
              delay: 200,
              duration: 1500,
            }); // tween
          }
        }// if

        // If these conditions are met, tween the customer up to serve
        if (gameState.customersLeftCount != 0) {
          this.tweens.add({
            targets: gameState.currentCustomer,
            duration: 1000, 
            delay: 100,
            angle: 90,
            x: gameState.player.x,
            ease: 'Power2',
            onComplete: () => {
              gameState.customerIsReady = true;
              gameState.currentCustomer.meterContainer.visible = true;
              gameState.timer = this.time.addEvent(gameState.timer);
            },
          }); // tween
        }
  
      } // if conditional to queue up customer

      // Feed customer based on key presses
      if (Phaser.Input.Keyboard.JustDown(gameState.keys.A)) {
        this.placeFood('Burger', 5);
      } else if (Phaser.Input.Keyboard.JustDown(gameState.keys.S)) {
        this.placeFood('Fries', 3);
      } else if (Phaser.Input.Keyboard.JustDown(gameState.keys.D)) {
        this.placeFood('Shake', 1);       
      } else if (Phaser.Input.Keyboard.JustDown(gameState.keys.Enter)) {
        if (!gameState.readyForNextOrder && gameState.customerIsReady) {
          this.moveCustomerLine();
          this.updateCustomerCount();
        }
      }

      // Timer intialization 
      if (gameState.customerIsReady) {
        // Start timer
        gameState.timer.paused = false;
        // Animate timer countdown
        gameState.currentCustomer.timerMeterBody.width = gameState.currentCustomer.meterBase.width - ((gameState.timer.getProgress() * gameState.currentCustomer.meterBase.width) * gameState.gameSpeed);
        // Change color based on progress
        if ((gameState.timer.getProgress() * gameState.gameSpeed) > 0.75) {
        gameState.currentCustomer.timerMeterBody.setFillStyle(0xDB533A);
        } else if ((gameState.timer.getProgress() * gameState.gameSpeed) > 0.25) {
          gameState.currentCustomer.timerMeterBody.setFillStyle(0xFF9D00);
        }
        // if time is up without being served
        if (gameState.currentCustomer.timerMeterBody.width <= 0) {
          this.moveCustomerLine();
          this.updateCustomerCount();
        }
      
      }; // Timer initialization conditional


    }; // update() {
  
    // Global methods and functions
  
    /* WAVES */
    // Generate wave
    generateWave() {
      // Resets customersServedCount to 0
      gameState.customersServedCount = 0;
      
      // Add the total number of customers per wave here:
      gameState.totalCustomerCount = Math.ceil(Math.random() * 10) * gameState.currentWaveCount;
      
      // calls the customerLeftCount method to update text
      this.updateCustomerCount();
      
      for (let i = 0; i < gameState.totalCustomerCount; i++) {
        // Create your container below and add your customers to it below:
        const customerContainer = this.add.container(gameState.cam.worldView.right + (200 * i), gameState.cam.worldView.bottom - 140);
        gameState.customers.add(customerContainer);
  
        // Customer sprite randomizer
        // Must be defined before customer or there will be an error
        let customerImageKey = Math.ceil(Math.random() * 5);
  
        // Draw customers here!
        const customer = this.add.sprite(0, 0, `Customer-${customerImageKey}`).setScale(0.5);
        customerContainer.add(customer);
        
        // Fullness meter container
        customerContainer.fullnessMeter = this.add.group();

        // Define capacity
        customerContainer.fullnessCapacity = Math.ceil(Math.random() * 5 * gameState.totalWaveCount);
  
        // If capacity is an impossible number, reshuffle it until it isn't
        while (customerContainer.fullnessCapacity === 12 || customerContainer.fullnessCapacity === 14 || customerContainer.fullnessCapacity > 15) {
          customerContainer.fullnessCapacity = Math.ceil(Math.random() * 5) * gameState.totalWaveCount;
        }
  
        // Edit the meterWidth
        let meterWidth = customerContainer.fullnessCapacity * 10;
        customerContainer.meterContainer = this.add.container(0, customer.y + (meterWidth / 2));
        
        // Add the customerContainer.meterContainer to customerContainer
        customerContainer.add(customerContainer.meterContainer);
  
        // Add meter base
        customerContainer.meterBase = this.add.rectangle(-130, customer.y, meterWidth, 33, 0x707070).setOrigin(0);
        customerContainer.meterBase.setStrokeStyle(6, 0x707070);
        customerContainer.meterBase.angle = -90;
        customerContainer.meterContainer.add(customerContainer.meterBase);
  
        // Add timer countdown meter body
        customerContainer.timerMeterBody = this.add.rectangle(customerContainer.meterBase.x + 22, customer.y + 1, meterWidth + 4, 12, 0x3ADB40).setOrigin(0);
        customerContainer.timerMeterBody.angle = -90;
        customerContainer.meterContainer.add(customerContainer.timerMeterBody);

        // 
  
        // Create container for individual fullness blocks
        customerContainer.fullnessMeterBlocks = [];
  
        // Create fullness meter blocks
        for (let j = 0; j < customerContainer.fullnessCapacity; j++) {
          customerContainer.fullnessMeterBlocks[j] = this.add.rectangle(customerContainer.meterBase.x, customer.y - (10 * j), 10, 20, 0xDBD53A).setOrigin(0);
          customerContainer.fullnessMeterBlocks[j].setStrokeStyle(2, 0xB9B42E);
          customerContainer.fullnessMeterBlocks[j].angle = -90;
          customerContainer.fullnessMeter.add(customerContainer.fullnessMeterBlocks[j]);
          customerContainer.meterContainer.add(customerContainer.fullnessMeterBlocks[j]);
        }
  
        // Hide meters
        customerContainer.meterContainer.visible = false;
  
      } // generateWave's for loop
    } // generateWave () {
  
    // Method for updating the customer count
    updateCustomerCount() {
      gameState.customersLeftCount = gameState.totalCustomerCount - gameState.customersServedCount;
      gameState.customerCountText.setText(`Customers Left: ${gameState.customersLeftCount}`);
    }; // updateCustomerCount() {
  
      // Method for updating the wave count
    updateWaveCount() {
      gameState.waveCountText.setText(gameState.currentWaveCount + '/' + gameState.totalWaveCount);
    }; // updateWaveCount() {

    // Method for placing food
    placeFood(food, fullnessValue) {
      if (gameState.currentMeal.children.entries.length < 3 && gameState.customerIsReady === true) {
        let foodX = gameState.tray.x;
        switch(gameState.currentMeal.children.entries.length) {
          case 0:
            foodX -= 90;
            break;
          case 1:
            foodX = foodX;
            break;
          case 2:
            foodX += 90;
            break;
          }; // switch

        gameState.currentMeal.create(foodX, gameState.tray.y, food).setScale(0.75);
        gameState.currentMeal.fullnessValue += fullnessValue;
        gameState.sfx.placeFood.play();    
      } // placeFood if conditional

      // Coloring the fullness meter (not full and exactly full)
      for (let i = 0; i < gameState.currentMeal.fullnessValue; i++) {
        if (gameState.currentMeal.fullnessValue < gameState.currentCustomer.fullnessCapacity) {
          gameState.currentCustomer.fullnessMeterBlocks[i].setFillStyle(0xFFFA81);
          // CONSOLE TESTING:
          console.log('not full');
        } else if (gameState.currentMeal.fullnessValue === gameState.currentCustomer.fullnessCapacity) {
          gameState.currentCustomer.fullnessMeterBlocks[i].setFillStyle(0x3ADB40);
          gameState.currentCustomer.fullnessMeterBlocks[i].setStrokeStyle(2, 0x2EB94E);
          // CONSOLE TESTING:
          console.log('exactly full');
        }

        // Coloring fullness meter only if too full 
        if (gameState.currentMeal.fullnessValue > gameState.currentCustomer.fullnessCapacity) {
          for (let j = 0; j < gameState.currentCustomer.fullnessMeterBlocks.length; j++) {
            gameState.currentCustomer.fullnessMeterBlocks[j].setFillStyle(0xDB533A);
            gameState.currentCustomer.fullnessMeterBlocks[j].setStrokeStyle(2, 0xB92E2E);    
            // CONSOLE TESTING:
            console.log('TOO full');
          }
        } // Fullness Meter 2 if
         
      } // Fullness Meter 1 for loop

    }; // placeFood(food, fullnessValue) {
  
    // Moving the customer line
    moveCustomerLine() {
      this.updateStars(gameState.currentMeal.fullnessValue, gameState.currentCustomer.fullnessCapacity);
      gameState.currentMeal.clear(true);
      gameState.currentMeal.fullnessValue = 0;
      gameState.customersServedCount++;
      gameState.readyForNextOrder = true;
      gameState.timer.remove(gameState.timer);
      gameState.timer.paused = true;
      gameState.timer = this.time.addEvent(gameState.timer);

      // Continue to next wave if zero customers remain and wave level is less than final
      if (gameState.customersServedCount === gameState.totalCustomerCount && gameState.currentWaveCount < gameState.totalWaveCount) {
        gameState.currentWaveCount++;
        this.updateWaveCount();
        // TESTING CONSOLE
        console.log('current wave: ' + gameState.currentWaveCount);
        gameState.gameSpeed++;
        // TESTING CONSOLE
        console.log('speed: ' + gameState.gameSpeed);
        this.destroyWave();
        // Win Game
      } else if (gameState.customersServedCount === gameState.totalCustomerCount && gameState.currentWaveCount >= gameState.totalWaveCount) {
        gameState.currentMusic.stop();
        this.scene.stop('GameScene');
        this.scene.start('WinScene');
      }

    }; // moveCustomerLine() {

    // Drawing stars for ratings
    drawStars() {
      gameState.starGroup.clear(true); // stars are cleared and redrawn every time

      for (let i = 0; i < gameState.starRating; i++) {
        let spacer = i * 50;
        gameState.starGroup.create(30 + spacer, gameState.cam.worldView.top + 20, 'Star-full').setScale(0.65);
        // CONSOLE TESTING 
        console.log(i + ' stars')
      }      
    }; // drawStars() {
    
    // Updates the rating
    updateStars(fullnessValue, fullnessCapacity) {

      // If they are full // Green outcome
      if (fullnessValue === fullnessCapacity) {
        // Tint customer green
        gameState.currentCustomer.list[0].setTint(0x3ADB40);
        // SFX
        gameState.sfx.servingCorrect.play();        
        // Update score
        gameState.score += 100;
        // CONSOLE TEST
        console.log(gameState.score + ' points')
        //update score text
        gameState.scoreText.setText(gameState.score);
        // Add a star if rating is below 5
        if (gameState.starRating < 5) {
            gameState.starRating ++;
        }
        // Play sound when getting 5 stars
        if (gameState.starRating === 5) {
          gameState.sfx.fiveStars.play();
        }
        // CONSOLE TEST
        console.log(gameState.starRating);
        // If they leave hungry // Red outcome
      } else if (fullnessValue < fullnessCapacity) {
        // Tint customer red
        gameState.currentCustomer.list[0].setTint(0xDB533A);
        // Play SFX
        gameState.sfx.servingIncorrect.play();
        // Remove 2 stars
        gameState.starRating -= 2;
        // CONSOLE TEST
        console.log(gameState.starRating);
        // If they are too full // Orange outcome
      } else if (fullnessValue > fullnessCapacity) {
        // Tint customer orange
        gameState.currentCustomer.list[0].setTint(0xDB9B3A);
        // Play SFX
        gameState.sfx.servingEmpty.play();
        // Remove 1 star
        gameState.starRating -= 1;
        // CONSOLE TEST
        console.log(gameState.starRating);
      } 
      
      // Show the rating with stars
      this.drawStars();

      // Lose the Game
      if (gameState.starRating < 1) {
        gameState.currentMusic.stop();
        this.scene.stop('GameScene');
        this.scene.start('LoseScene');
      }

    }; // updateStars() {

    // Destroy waves
    destroyWave() {
      // play next level SFX
      gameState.sfx.nextWave.play();
      for (let i = 0; i < gameState.customersServedCount; i++){
        this.tweens.add({
          targets: gameState.customers.children.entries[i],
          x: '-=300',
          duration: 750,
          delay: 0,
          angle: 0,
          ease: 'Power2',
          onComplete: () => {
            this.tweens.add({
              targets: gameState.customers.children.entries[i],
              x: '-=900',
              duration: 1000,
              delay: 200,
              ease: 'Power2',
              onComplete: () => {
                gameState.customers.clear(true);
                // TESTING CONSOLE
                console.log(`Customers cleared.`);
                this.generateWave();
                gameState.readyForNextOrder = true;
              }
            }); // Tweening everyone off screen

          } // onComplete callback
        }); // Tween
      }
    }; // destroyWave() {

    restart() {
      gameState.starRating = 5;
      gameState.currentWaveCount = 1;
      gameState.gameSpeed = 1;
      gameState.score = 0;
      gameState.countdownTimer = 5000,
      gameState.readyForNextOrder = true,
      gameState.customersServedCount = 0
    }// reastart() {

  }; // class GameScene
