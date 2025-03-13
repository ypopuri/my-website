import React, { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Popup from './Popup'; // Existing popup
import SecondNpcPopup from './SecondNpcPopup'; // New popup for the second NPC
import SkillPopup from './SkillPopup'; // Popup for the skills PDF
import PdfPopup from './PdfPopup'; // Import the PDF popup component
import WelcomeMessage from './WelcomeMessage';
import BlurWelcomeMessage from './BlurWelcomeMessage';
import InstructionsOverlay from './InstructionsOverlay'; // Import the new InstructionsOverlay component
import MobileControls from './MobileControls'; // Import the MobileControls component

const GameScene = () => 
  {
    const mountRef = useRef(null);
    const [showPopup, setShowPopup] = useState(false); // For the first NPC
    const [showSecondNpcPopup, setShowSecondNpcPopup] = useState(false); // For the second NPC
    const [showSkillPopup, setShowSkillPopup] = useState(false); // For the skills PDF
    const [showProjectPopup, setShowProjectPopup] = useState(false); // For the project PDF popup
    const [showPdfPopup, setShowPdfPopup] = useState(false); // For the PDF popup
    const hasOpenedProjectsPdf = useRef(false); // Track if projects PDF has been opened
    const hasOpenedSkillsPdf = useRef(false); // Track if skills PDF has been opened
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
    const audioRef2 = useRef(null); // Ref to store the second audio object
    const audioRef3 = useRef(null); // Ref to store the third audio object
    const [hasPlayedGuidRobotAudio, setHasPlayedGuidRobotAudio] = useState(false); // Track if the audio has played
    const guidRobotTargetPosition = new THREE.Vector3(-7, 2, -6); // Adjust this position to match the download1.glb position
    const hasPlayedGuidRobotAudio3 = useRef(false); // Track if the third audio has played
    const [showInstructions, setShowInstructions] = useState(true); // State to control the visibility of instructions
    const [isMobile, setIsMobile] = useState(false); // State to check if the device is mobile
    // Check if the device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    setIsMobile(checkIsMobile());
  }, []);

  // Handle joystick movement
  const handleJoystickMove = (x, y) => {
    const playerModel = playerModelRef.current;
    if (playerModel) {
      const moveSpeed = 0.1;
      const direction = new THREE.Vector3(x, 0, -y).multiplyScalar(moveSpeed); // Invert y for correct movement
      const newPosition = playerModel.position.clone().add(direction);

      // Check for collisions before moving the player
      if (!checkCollision(newPosition)) {
        playerModel.position.copy(newPosition);
      }
    }
  };
    
    
    const audioRef = useRef(null); // Ref to store the audio object
    const guidRobotRef = useRef(null); // Ref to store the guid_robot model
    const [isGuidRobotVisible, setIsGuidRobotVisible] = useState(false); // State to track visibility

    const [audio, setAudio] = useState(null); // State to hold the audio object
    // Add the audio initialization useEffect here
    useEffect(() => 
      {
        const sound = new Audio('/models/voice/Intro_guide_robot.mp4');
        sound.preload = 'auto';
        sound.volume = 1.0;
    
        sound.addEventListener('canplaythrough', () => 
          {
            console.log('Audio is ready to play!');
            audioRef.current = sound; // Store the audio object in a ref
          });
    
        sound.addEventListener('error', (error) => 
          {
            console.error('Error loading audio:', error);
          });
    
        return () => 
          {
            if (sound)
              {
                sound.pause();
                sound.removeAttribute('src');
                sound.load();
              }
          };
      }, []);

    useEffect(() => 
      {
        const sound = new Audio('/models/voice/Intro02_guide_robot.mp4');
        sound.preload = 'auto';
        sound.volume = 1.0;
    
        sound.addEventListener('canplaythrough', () => 
          {
            console.log('Second audio is ready to play!');
            audioRef2.current = sound; // Store the audio object in a ref
          });
  
        sound.addEventListener('error', (error) => 
          {
            console.error('Error loading second audio:', error);
          });
    
        return () => 
          {
            if (sound) 
              {
                sound.pause();
                sound.removeAttribute('src');
                sound.load();
              }
          };
      }, []);

    useEffect(() => 
      {
        const sound = new Audio('/models/voice/Intro03_guide_robot.mp4');
        sound.preload = 'auto';
        sound.volume = 1.0;
        sound.addEventListener('canplaythrough', () => 
          {
            console.log('Third audio is ready to play!');
            audioRef3.current = sound; // Store the audio object in a ref
          });
        sound.addEventListener('error', (error) => 
          {
            console.error('Error loading third audio:', error);
          });
        return () => 
          {
            if (sound) 
              {
                sound.pause();
                sound.removeAttribute('src');
                sound.load();
              }
          };
      }, []);

    // Ref to track if the second NPC popup has been triggered
    const hasSecondNpcPopupTriggered = useRef(false);
    const hasLinkedInRedirected = useRef(false);

    // Refs for mouse and camera controls
    const isMouseActiveRef = useRef(false);
    const cameraYawRef = useRef(0);
    const cameraPitchRef = useRef(0);

    // Refs for player and NPC models
    const playerModelRef = useRef(null);
    const npcModelRef = useRef(null);
    const newNpcModelRef = useRef(null); // Ref for the second NPC model
    const arrowModelRef = useRef(null); // Ref for the arrow model
    const downloadButtonModelRef = useRef(null); // Ref for the download button model
    const displayRobotModelRef = useRef(null); // Ref for the new display_robot model
    const linkedInModelRef = useRef(null); // Ref for the LinkedIn model

    // Refs for animations
    const playerMixerRef = useRef(null);
    const npcMixerRef = useRef(null);
    const newNpcMixerRef = useRef(null); // Ref for the second NPC's mixer
    const arrowMixerRef = useRef(null); // Ref for the arrow's mixer
    const displayRobotMixerRef = useRef(null); // Ref for the display_robot's mixer
    const npcIdleActionRef = useRef(null);
    const npcActionActionRef = useRef(null);
    const npcWalkActionRef = useRef(null);
    const npcThirdActionRef = useRef(null);
    const newNpcBackwalkActionRef = useRef(null); // Ref for the backwalk animation
    const arrowAnimationRef = useRef(null); // Ref for the arrow animation
    const guidRobotModelRef = useRef(null); // Ref for the guid_robot model
    const guidRobotMixerRef = useRef(null); // Ref for the guid_robot's mixer

    // Refs for screen models
    const screenModelRef = useRef(null); // Ref for the first screen model
    const screen02ModelRef = useRef(null); // Ref for the second screen model

    // Ref for collision boundaries
    const collisionBoundariesRef = useRef([]);

    // Ref for animation frame ID
    const animationFrameId = useRef(null);

    // Track if the NPC has played the action animation
    const hasPlayedActionAnimation = useRef(false);
    const hasPlayedGuidRobotAudioRef = useRef(false);

    // Track if the NPC has moved to the target position
    const hasMovedToTarget = useRef(false);

    // Track if the NPC has played the third animation
    const hasPlayedThirdAnimation = useRef(false);

    // Track if the screen has risen
    const hasScreenRisen = useRef(false);

    // Track if the second screen has risen
    const hasScreen02Risen = useRef(false);

    // Define the target position for the first NPC
    const targetPosition = new THREE.Vector3(3, 0, 11); // Example target position

    // Define the target position for the second NPC
    const secondNpcTargetPosition = new THREE.Vector3(3.5, 0, -24.5); // Example target position

    const flyingRobotsModelRef = useRef(null); // Ref for the flying_robots model
    const flyingRobotsMixerRef = useRef(null); // Ref for the flying_robots's mixer
    const flyingRobotsPath = 
    [
      new THREE.Vector3(-30, 6, 31), // Initial position
      new THREE.Vector3(-30, 6, -31), // Second position
      new THREE.Vector3(30, 6, -31), // Third position
      new THREE.Vector3(31, 6, 30), // Fourth position
    ];

    // Clock for animations
    const clock = new THREE.Clock();

    // Function to check for collisions
    const checkCollision = (newPosition) => 
      {
        const playerBbox = new THREE.Box3().setFromObject(playerModelRef.current);
        playerBbox.translate(newPosition.clone().sub(playerModelRef.current.position));
        for (const boundary of collisionBoundariesRef.current) 
          {
            if (playerBbox.intersectsBox(boundary)) 
              {
                console.log("Collision detected with boundary:", boundary);
                return true; // Collision detected
              }
          }
        return false; // No collision
      };


    // Function to move the flying robots along the square path
    const moveFlyingRobots = () => 
      {
        const flyingRobotsModel = flyingRobotsModelRef.current;
        if (!flyingRobotsModel) return;
        let currentTargetIndex = 0; // Start at the first position
        const moveDuration = 10; // Duration of movement between points in seconds
        const moveToNextTarget = () => 
          {
            const startTime = clock.getElapsedTime();
            const startPosition = flyingRobotsModel.position.clone();
            const targetPosition = flyingRobotsPath[currentTargetIndex];
            const move = () => 
              {
                const elapsedTime = clock.getElapsedTime() - startTime;
                const progress = Math.min(elapsedTime / moveDuration, 1);

                // Interpolate the position
                flyingRobotsModel.position.lerpVectors(startPosition, targetPosition, progress);

                if (progress < 1) 
                  {
                    requestAnimationFrame(move); // Continue moving until the target is reached
                  } else {
                    console.log(`Reached target position ${currentTargetIndex + 1}`);

                    // Rotate the model 90 degrees at each corner
                    flyingRobotsModel.rotation.y += Math.PI / 2; // 90 degrees in radians

                    // Move to the next target
                    currentTargetIndex = (currentTargetIndex + 1) % flyingRobotsPath.length; // Loop back to the start
                    moveToNextTarget(); // Move to the next position
                  }
                };
              move(); // Start moving to the next target
          };
        moveToNextTarget(); // Start the movement
      };

    // Function to make the first screen rise from the ground
    const riseScreen = () => 
      {
        const screenModel = screenModelRef.current;
        if (!screenModel) 
          {
            console.error('Screen model is not loaded!');
            return;
          }
        console.log('Rising screen...');
        const targetY = 13; // Target Y position (ground level)
        const startY = -5; // Start Y position (below ground)
        const riseDuration = 1; // Duration of the rise animation in seconds
        const startTime = clock.getElapsedTime();

        screenModel.position.y = startY; // Start below the ground

        const animateRise = () => 
          {
            const elapsedTime = clock.getElapsedTime() - startTime;
            const progress = Math.min(elapsedTime / riseDuration, 1);
            // Interpolate the Y position
            screenModel.position.y = THREE.MathUtils.lerp(startY, targetY, progress);
            console.log('Screen model Y position:', screenModel.position.y);
            if (progress < 1) 
              {
                requestAnimationFrame(animateRise);
              }
              else 
              {
                console.log('Screen has fully risen!');
                hasScreenRisen.current = true;
                // Show the download button after the screen has risen
                const downloadButtonModel = downloadButtonModelRef.current;
                if (downloadButtonModel) 
                  {
                    downloadButtonModel.visible = true; // Make the button visible
                    console.log('Download button is now visible');
                  }
                // Check if both screens have risen
                if (hasScreenRisen.current && hasScreen02Risen.current) 
                  {
                    showDownloadButton();
                  }
                // Check if both screens have risen
                if (hasScreenRisen.current && hasScreen02Risen.current) 
                  {
                    moveGuidRobotToDownloadButton(); // Move the guid_robot to the download button
                  }
              }
          };
        animateRise();
      };

    // Function to make the second screen rise from the ground
    const riseScreen02 = () => 
      {
        const screen02Model = screen02ModelRef.current;
        if (!screen02Model) 
          {
            console.error('Second screen model is not loaded!');
            return;
          }

        console.log('Rising second screen...');
        const targetY = 10; // Target Y position (ground level)
        const startY = -5; // Start Y position (below ground)
        const riseDuration = 1; // Duration of the rise animation in seconds
        const startTime = clock.getElapsedTime();
        screen02Model.position.y = startY; // Start below the ground
        const animateRise = () => 
          {
            const elapsedTime = clock.getElapsedTime() - startTime;
            const progress = Math.min(elapsedTime / riseDuration, 1);
            // Interpolate the Y position
            screen02Model.position.y = THREE.MathUtils.lerp(startY, targetY, progress);
            console.log('Second screen model Y position:', screen02Model.position.y);
            if (progress < 1) 
              {
                requestAnimationFrame(animateRise);
              } else {
        console.log('Second screen has fully risen!');
        hasScreen02Risen.current = true;

        // Show the download button after the screen has risen
        const downloadButtonModel = downloadButtonModelRef.current;
        if (downloadButtonModel) {
          downloadButtonModel.visible = true; // Make the button visible
          console.log('Download button is now visible');
        }

        // Check if both screens have risen
        if (hasScreenRisen.current && hasScreen02Risen.current) {
          showDownloadButton();
        }
        // Check if both screens have risen
      if (hasScreenRisen.current && hasScreen02Risen.current) {
        moveGuidRobotToDownloadButton(); // Move the guid_robot to the download button
      }
      }
    };

    animateRise();
  };


  const moveGuidRobotToDownloadButton = () => {
    const guidRobotModel = guidRobotRef.current;
    if (!guidRobotModel) return;
  
    guidRobotModel.visible = true; // Ensure the guid_robot is visible
    console.log('Guid Robot is now visible!');
  
    const moveDuration = 5; // Duration of movement in seconds
    const startTime = clock.getElapsedTime();
  
    const move = () => {
      const elapsedTime = clock.getElapsedTime() - startTime;
      const progress = Math.min(elapsedTime / moveDuration, 1);
  
      // Interpolate the position
      guidRobotModel.position.lerp(guidRobotTargetPosition, progress);
  
      if (guidRobotModel.position.distanceTo(guidRobotTargetPosition) > 0.1) {
        requestAnimationFrame(move); // Continue moving until the target is reached
      } else {
        console.log('Guid Robot has reached the download button!');
  
        // Play the third audio if it hasn't played yet
        if (audioRef3.current && audioRef3.current.paused && !hasPlayedGuidRobotAudio3.current) {
          audioRef3.current.play()
            .then(() => {
              console.log('Third audio playback started successfully!');
              hasPlayedGuidRobotAudio3.current = false; // Mark the audio as played
            })
            .catch((error) => {
              console.error('Error playing third audio:', error);
            });
        }
      }
    };
  
    move(); // Start moving
  };

  // Function to show the download button
  const showDownloadButton = () => {
    const downloadButtonModel = downloadButtonModelRef.current;
    if (!downloadButtonModel) return;

    console.log('Showing download button...');

    // Move the download button to its target position near the first screen
    downloadButtonModel.position.set(-9, 2, -10); // Adjust position as needed
    downloadButtonModel.visible = true; // Ensure the button is visible
  };

  // Function to move the second NPC to the target position
  const moveSecondNpcToTarget = () => {
    const newNpcModel = newNpcModelRef.current;
    if (!newNpcModel) return;

    const moveDuration = 20; // Increased duration to make the NPC move slower
    const startTime = clock.getElapsedTime();

    // Play the backwalk animation
    if (newNpcBackwalkActionRef.current) {
      newNpcBackwalkActionRef.current.play();
    }

    const moveNPC = () => {
      const elapsedTime = clock.getElapsedTime() - startTime;
      const progress = Math.min(elapsedTime / moveDuration, 1);

      // Use a slower interpolation for smoother movement
      newNpcModel.position.lerp(secondNpcTargetPosition, progress * 0.05); // Reduced interpolation factor

      if (newNpcModel.position.distanceTo(secondNpcTargetPosition) > 0.1) {
        requestAnimationFrame(moveNPC);
      } else {
        // Stop the backwalk animation when the target is reached
        if (newNpcBackwalkActionRef.current) {
          newNpcBackwalkActionRef.current.stop();
        }

        // Play the third animation when the NPC reaches the target
        if (newNpcMixerRef.current.thirdAction && !hasPlayedThirdAnimation.current) {
          newNpcMixerRef.current.thirdAction.play(); // Play the third animation
          hasPlayedThirdAnimation.current = true; // Mark the third animation as played
        }

        // Trigger the first screen to rise
        if (!hasScreenRisen.current) {
          console.log('NPC reached target location. Triggering screen rise...');
          riseScreen();
          hasScreenRisen.current = true;
        }

        // Trigger the second screen to rise
        if (!hasScreen02Risen.current) {
          console.log('NPC reached target location. Triggering second screen rise...');
          riseScreen02();
          hasScreen02Risen.current = true;
        }
      }
    };

    moveNPC();
  };

  // Handle Yes button click for the second NPC popup
  const handleYesClick = () => {
    setShowSecondNpcPopup(false); // Close the popup
    moveSecondNpcToTarget(); // Move the second NPC to the target position
  };

  // Handle No button click for the second NPC popup
  const handleNoClick = () => {
    setShowSecondNpcPopup(false); // Close the popup
    moveSecondNpcToTarget(); // Move the second NPC to the target position
  };

  useEffect(() => {
    
    console.log('Component mounted'); // Debugging log

  const showTimer = setTimeout(() => {
    console.log('Showing welcome message'); // Debugging log
    setShowWelcomeMessage(true); // Show the welcome message
  }, 4000);

  const hideTimer = setTimeout(() => {
    console.log('Hiding welcome message'); // Debugging log
    setShowWelcomeMessage(false); // Hide the welcome message
  }, 6000);

  


    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.5,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x333333);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Add directional light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5).normalize();
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);

    const loader = new GLTFLoader();
    loader.load('/models/land1.glb', (gltf) => {
      console.log('Land1 model loaded successfully:', gltf);
  
      const land1Model = gltf.scene;
      land1Model.position.set(40, -4.1, 1); // Position at (0, 0, 30)
      land1Model.scale.set(0.1, 0.1, 0.1); // Make it very small
      land1Model.rotation.y = (3 * Math.PI) / 2; // (3 * Math.PI) / 2 radians = 270 degrees
      scene.add(land1Model);
  
      console.log('Land1 model added to the scene:', land1Model);
    }, undefined, (error) => {
      console.error('Error loading land1 model:', error);
    });

    loader.load('/models/bridge.glb', (gltf) => {
      console.log('Bridge model loaded successfully:', gltf);
  
      const bridgeModel = gltf.scene;
      bridgeModel.position.set(30, -0.5, 1); // Adjust position as needed
      bridgeModel.scale.set(1, 1, 1); // Adjust scale as needed
      scene.add(bridgeModel);
  
      console.log('Bridge model added to the scene:', bridgeModel);
    }, undefined, (error) => {
      console.error('Error loading bridge model:', error);
    });

    // Load the land2.glb model
loader.load('/models/land2.glb', (gltf) => {
  console.log('Land2 model loaded successfully:', gltf);

  const land2Model = gltf.scene;
  land2Model.position.set(-38, 6, 0.5); // Position at (-40, -4.1, 1)
  land2Model.scale.set(10, 10, 10); // Adjust scale as needed
  
  scene.add(land2Model);

  console.log('Land2 model added to the scene:', land2Model);
}, undefined, (error) => {
  console.error('Error loading land2 model:', error);
});


// Load the bridge2.glb model
loader.load('/models/bridge2.glb', (gltf) => {
  console.log('Bridge2 model loaded successfully:', gltf);

  const bridge2Model = gltf.scene;
  bridge2Model.position.set(-27, -1.5, 0); // Position at (10, 0, 20)
  bridge2Model.scale.set(2, 2, 1); // Scale down to half size
  bridge2Model.rotation.y = Math.PI / 2; // Rotate 90 degrees
  
  scene.add(bridge2Model);

  console.log('Bridge2 model added to the scene:', bridge2Model);
}, undefined, (error) => {
  console.error('Error loading bridge2 model:', error);
});

// Load the land3.glb model
loader.load('/models/land3.glb', (gltf) => {
  console.log('Land3 model loaded successfully:', gltf);

  const land3Model = gltf.scene;
  land3Model.position.set(0, 10, -70); // Adjust position as needed
  land3Model.scale.set(5, 5, 5); // Adjust scale as needed
  scene.add(land3Model);

  console.log('Land3 model added to the scene:', land3Model);
}, undefined, (error) => {
  console.error('Error loading land3 model:', error);
});

// Load the bridge3.glb model
loader.load('/models/bridge3.glb', (gltf) => {
  console.log('Bridge3 model loaded successfully:', gltf);

  const bridge3Model = gltf.scene;
  bridge3Model.position.set(0, -6, -49.5); // Position at (20, 0, 30)
  bridge3Model.scale.set(20, 20, 20); // Scale down to half size
  scene.add(bridge3Model);

  console.log('Bridge3 model added to the scene:', bridge3Model);
}, undefined, (error) => {
  console.error('Error loading bridge3 model:', error);
});

    // Load the new 3D map (GLB)
    loader.load('/models/ancient-palace/sketchfab_new_sample_level.glb', (gltf) => {
      const map = gltf.scene;
      map.scale.set(1, 1, 1);
      map.position.set(0, 0, 0);
      scene.add(map);

      // Traverse the map to find walls and stairs and add collision boundaries
      map.traverse((child) => {
        if (child.isMesh) {
          // Check if the mesh is a wall or stair (adjust naming convention as needed)
          if (child.name.toLowerCase().includes("wall") || child.name.toLowerCase().includes("stair")) {
            const bbox = new THREE.Box3().setFromObject(child);
            collisionBoundariesRef.current.push(bbox); // Add wall/stair to collision boundaries
            console.log("Added collision boundary for:", child.name, bbox);
          }
        }
      });

      console.log('Map loaded successfully:', map);
    }, undefined, (error) => {
      console.error('Error loading map:', error);
    });

    // Load Player Model
    loader.load('/models/character.glb', (gltf) => {
      const playerModel = gltf.scene;
      const bbox = new THREE.Box3().setFromObject(playerModel);
      playerModel.position.y = -bbox.min.y + 0.02;
      playerModel.position.z = 36; // Move the player back along the Z-axis
      playerModel.position.x = -1;
      playerModel.scale.set(0.8, 0.8, 0.8); // Adjusted scale to make the player shorter
      scene.add(playerModel);

      // Set up player animations
      playerMixerRef.current = new THREE.AnimationMixer(playerModel);

      if (gltf.animations && gltf.animations.length > 0) {
        const walkClip = gltf.animations[0];
        const walkAction = playerMixerRef.current.clipAction(walkClip);
        walkAction.play();
        walkAction.paused = true;
      } else {
        console.warn("No animations found in the player model.");
      }

      

      // Adjust camera position to match the player's new initial position
      camera.position.copy(playerModel.position).add(new THREE.Vector3(0, 4, -5));
      camera.lookAt(playerModel.position);

      playerModelRef.current = playerModel;

      // Load NPC Idle Animation (character2.glb)
      loader.load('/models/character2.glb', (gltf) => {
        const npcModel = gltf.scene;
        npcModel.position.set(-4, 0, 5); // Adjusted position: closer to the player and to the right
        npcModel.scale.set(2, 2, 2); // Adjusted scale to make the NPC shorter
        const bbox = new THREE.Box3().setFromObject(npcModel);
        npcModel.position.y = -bbox.min.y + 0.02;
        npcModel.rotation.y = Math.PI;
        scene.add(npcModel);

        npcMixerRef.current = new THREE.AnimationMixer(npcModel);

        if (gltf.animations && gltf.animations.length > 0) {
          const idleClip = gltf.animations[0];
          npcIdleActionRef.current = npcMixerRef.current.clipAction(idleClip);
          npcIdleActionRef.current.play(); // Play the idle animation

          // Load NPC Walking Animation (character2_walking_animation.glb)
          loader.load('/models/character2_walking_animation.glb', (gltf) => {
            if (gltf.animations && gltf.animations.length > 0) {
              const walkClip = gltf.animations[0];
              npcWalkActionRef.current = npcMixerRef.current.clipAction(walkClip);
              npcWalkActionRef.current.setLoop(THREE.LoopRepeat); // Loop the walking animation
              npcWalkActionRef.current.clampWhenFinished = true; // Stay in the last frame after the animation ends
            } else {
              console.warn("No walking animation found in the NPC walking model.");
            }
          });
        } else {
          console.warn("No animations found in the NPC idle model.");
        }

        npcModelRef.current = npcModel;

        // Load NPC Action Animation (character2_animation2.glb)
        loader.load('/models/character2_animation2.glb', (gltf) => {
          if (gltf.animations && gltf.animations.length > 0) {
            const actionClip = gltf.animations[0];
            npcActionActionRef.current = npcMixerRef.current.clipAction(actionClip);
            npcActionActionRef.current.setLoop(THREE.LoopOnce); // Play the action animation once
            npcActionActionRef.current.clampWhenFinished = true; // Stay in the last frame after the animation ends

            // Add an event listener for when the action animation finishes
            npcMixerRef.current.addEventListener('finished', (e) => {
              if (e.action === npcActionActionRef.current) {
                console.log("2nd animation finished");

                // Check if the player is near the NPC
                const playerModel = playerModelRef.current;
                const npcModel = npcModelRef.current;
                if (playerModel && npcModel) {
                  const distance = playerModel.position.distanceTo(npcModel.position);
                  if (distance < 3) { // Adjust the distance threshold as needed
                    // Show the popup 1.5 seconds before the animation ends
                    const animationDuration = npcActionActionRef.current.getClip().duration;
                    setTimeout(() => {
                      setShowPopup(true); // Show the popup 1.5 seconds before the animation ends
                    }, (animationDuration - 15) * 1000); // Convert to milliseconds
                  }
                }
              }
            });
          } else {
            console.warn("No animations found in the NPC action model.");
          }
        });

        // Load NPC Third Animation (character2_animation3.glb)
        loader.load('/models/character2_animation3.glb', (gltf) => {
          if (gltf.animations && gltf.animations.length > 0) {
            const thirdClip = gltf.animations[0];
            npcThirdActionRef.current = npcMixerRef.current.clipAction(thirdClip);
            npcThirdActionRef.current.setLoop(THREE.LoopOnce); // Play the third animation once
            npcThirdActionRef.current.clampWhenFinished = true; // Stay in the last frame after the animation ends
          } else {
            console.warn("No animations found in the NPC third animation model.");
          }
        });
      });

      // Load Second NPC (robot_stand_waving.glb)
      loader.load('/models/robot_stand_waving.glb', (gltf) => {
        console.log('Second NPC model loaded successfully:', gltf);

        const newNpcModel = gltf.scene;
        newNpcModel.position.set(5, 0, -4); // Adjust position as needed
        newNpcModel.scale.set(2, 2, 2); // Adjust scale as needed
        scene.add(newNpcModel);

        // Set up animations for the second NPC
        const newNpcMixer = new THREE.AnimationMixer(newNpcModel);
        if (gltf.animations && gltf.animations.length > 0) {
          const waveClip = gltf.animations[0]; // Assuming the waving animation is the first one
          const waveAction = newNpcMixer.clipAction(waveClip);
          waveAction.play(); // Play the waving animation
        } else {
          console.warn("No animations found in the second NPC model.");
        }

        // Load the backwalk animation for the second NPC
        loader.load('/models/backwalk.glb', (gltf) => {
          if (gltf.animations && gltf.animations.length > 0) {
            const backwalkClip = gltf.animations[0];
            newNpcBackwalkActionRef.current = newNpcMixer.clipAction(backwalkClip);
            newNpcBackwalkActionRef.current.setLoop(THREE.LoopRepeat); // Loop the backwalk animation
            newNpcBackwalkActionRef.current.clampWhenFinished = true; // Stay in the last frame after the animation ends
          } else {
            console.warn("No backwalk animation found in the backwalk model.");
          }
        });

        // Store the second NPC's mixer for updates
        newNpcMixerRef.current = newNpcMixer;
        newNpcModelRef.current = newNpcModel;

        console.log('Second NPC added to the scene:', newNpcModel);
      }, undefined, (error) => {
        console.error('Error loading second NPC model:', error);
      });




      loader.load('/models/flying_robots.glb', (gltf) => {
        console.log('Flying Robots model loaded successfully:', gltf);
      
        const flyingRobotsModel = gltf.scene;
        flyingRobotsModel.position.set(-30, 6, 31); // Initial position
        flyingRobotsModel.scale.set(1, 1, 1); // Adjust scale as needed
        scene.add(flyingRobotsModel);
      
        const flyingRobotsMixer = new THREE.AnimationMixer(flyingRobotsModel);
        if (gltf.animations && gltf.animations.length > 0) {
          const animationClip = gltf.animations[0];
          const animationAction = flyingRobotsMixer.clipAction(animationClip);
          animationAction.play(); // Play the animation
        } else {
          console.warn("No animations found in the flying robots model.");
        }
      
        flyingRobotsMixerRef.current = flyingRobotsMixer;
        flyingRobotsModelRef.current = flyingRobotsModel;
      
        // Debug: Log the flying robots model reference
        console.log('Flying Robots Model Ref:', flyingRobotsModelRef.current);
      
        console.log('Flying Robots added to the scene:', flyingRobotsModel);
      
        // Start moving the flying robots immediately
        moveFlyingRobots();
      }, undefined, (error) => {
        console.error('Error loading flying robots model:', error);
      });


      setTimeout(() => {
        loader.load('/models/guid_robot.glb', (gltf) => {
          console.log('Guid Robot model loaded successfully:', gltf);
      
          const guidRobotModel = gltf.scene;
          guidRobotModel.position.set(0, 3, 20); // Position it 2 units to the right of the player's initial position
          guidRobotModel.scale.set(1.5, 1.5, 1.5); // Adjust scale as needed
          guidRobotModel.visible = false; // Hide it initially
          scene.add(guidRobotModel); // Add it to the scene
      
          // Store the guid_robot model reference
          guidRobotRef.current = guidRobotModel;
      
          // Set up animations for the guid robot
          const guidRobotMixer = new THREE.AnimationMixer(guidRobotModel);
          if (gltf.animations && gltf.animations.length > 0) {
            const animationClip = gltf.animations[0]; // Assuming the animation is the first one
            const animationAction = guidRobotMixer.clipAction(animationClip);
            animationAction.play(); // Play the animation
            animationAction.setLoop(THREE.LoopRepeat); // Ensure the animation loops
          } else {
            console.warn("No animations found in the guid robot model.");
          }
      
          // Make the guid robot visible after 1 second
          setTimeout(() => {
            guidRobotModel.visible = true;
            console.log('Guid Robot is now visible!');
      
            // Play the audio when the guid_robot becomes visible
            if (audioRef.current) {
              console.log('Attempting to play audio...');
              audioRef.current.play()
                .then(() => {
                  console.log('Audio playback started successfully!');
                })
                .catch((error) => {
                  console.error('Error playing audio:', error);
                });
            } else {
              console.error('Audio is not initialized!');
            }
          }, 1000); // 1 second delay
        }, undefined, (error) => {
          console.error('Error loading guid robot model:', error);
        });
      }, 5000); // Delay before loading the guid_robot


      // Load the first screen model (screen.glb)
      loader.load('/models/screen.glb', (gltf) => {
        console.log('Screen model loaded successfully:', gltf);

        const screenModel = gltf.scene;
        screenModel.position.set(-10, -10, -20); // Start below the ground
        screenModel.scale.set(1.5, 1.5, 1.5); // Adjust scale as needed
        screenModel.rotation.y = (11 * Math.PI) / 6; // 330° in radians
        scene.add(screenModel);

        screenModelRef.current = screenModel; // Store the screen model reference

        // Debug: Log the screen model's position
        console.log('Screen model initial position:', screenModel.position);
      }, undefined, (error) => {
        console.error('Error loading screen model:', error);
      });

      // Load the second screen model (screen02.glb)
      loader.load('/models/screen02.glb', (gltf) => {
        console.log('Second screen model loaded successfully:', gltf);

        const screen02Model = gltf.scene;
        screen02Model.position.set(16, -10, -15); // Start below the ground
        screen02Model.scale.set(1.5, 1.5, 1.5); // Adjust scale as needed
        screen02Model.rotation.y = (29 * Math.PI) / 18;
        scene.add(screen02Model);

        screen02ModelRef.current = screen02Model; // Store the second screen model reference

        // Debug: Log the second screen model's position
        console.log('Second screen model initial position:', screen02Model.position);
      }, undefined, (error) => {
        console.error('Error loading second screen model:', error);
      });

      // Load the download button model (download1.glb)
      loader.load('/models/download1.glb', (gltf) => {
        console.log('Download button model loaded successfully:', gltf);

        const downloadButtonModel = gltf.scene;
        downloadButtonModel.position.set(-10, -10, -20); // Start below the ground (hidden)
        downloadButtonModel.scale.set(0.5, 0.5, 0.5); // Adjust scale as needed
        downloadButtonModel.rotation.y = (11 * Math.PI) / 6; // Match the rotation of the first screen
        downloadButtonModel.visible = false; // Hide the button initially
        scene.add(downloadButtonModel);

        downloadButtonModelRef.current = downloadButtonModel; // Store the download button model reference

        console.log('Download button model added to the scene:', downloadButtonModel);
      }, undefined, (error) => {
        console.error('Error loading download button model:', error);
      });

      // Load the knight model (knight1.glb)
      loader.load('/models/knight1.glb', (gltf) => {
        console.log('Knight model loaded successfully:', gltf);

        const knightModel = gltf.scene;
        knightModel.position.set(23, 0, 0); // Adjust position as needed
        knightModel.scale.set(1.5, 1.5, 1.5); // Adjust scale as needed
        knightModel.rotation.y = Math.PI / -2;
        scene.add(knightModel);

        console.log('Knight added to the scene:', knightModel);
      }, undefined, (error) => {
        console.error('Error loading knight model:', error);
      });

      // Load the knight model (knight2.glb)
      loader.load('/models/knight2.glb', (gltf) => {
        console.log('Knight model loaded successfully:', gltf);
        const knightMode2 = gltf.scene;
        knightMode2.position.set(-23, 0, 0); // Adjust position as needed
        knightMode2.scale.set(2, 2, 2); // Adjust scale as needed
        knightMode2.rotation.y = Math.PI / 2;
        scene.add(knightMode2);

        console.log('Knight added to the scene:', knightMode2);
      }, undefined, (error) => {
        console.error('Error loading knight model:', error);
      });

      // Load the knight model (knight3.glb)
      loader.load('/models/knight3.glb', (gltf) => {
        console.log('Knight model loaded successfully:', gltf);
        const knightMode3 = gltf.scene;
        knightMode3.position.set(0, 0, -29); // Adjust position as needed
        knightMode3.scale.set(1.5, 1.5, 1.5); // Adjust scale as needed
        scene.add(knightMode3);

        console.log('Knight added to the scene:', knightMode3);
      }, undefined, (error) => {
        console.error('Error loading knight model:', error);
      });

      // Load the target model (target.glb)
      loader.load('/models/target.glb', (gltf) => {
        console.log('target model loaded successfully:', gltf);
        const target = gltf.scene;
        target.position.set(19, 2.5, 26); // Adjust position as needed
        target.scale.set(0.01, 0.01, 0.01); // Adjust scale as needed
        target.rotation.y = Math.PI / -2;
        scene.add(target);

        console.log('target added to the scene:', target);
      }, undefined, (error) => {
        console.error('Error loading target model:', error);
      });

      // Load the arrow model (arrow.glb)
      loader.load('/models/arrow.glb', (gltf) => {
        console.log('Arrow model loaded successfully:', gltf);

        const arrowModel = gltf.scene;
        arrowModel.position.set(6.5, 0, 26.5); // Adjust position as needed
        arrowModel.scale.set(2.3, 2.3, 2.3); // Adjust scale as needed
        arrowModel.rotation.y = Math.PI / 2;
        scene.add(arrowModel);

        // Set up animations for the arrow
        const arrowMixer = new THREE.AnimationMixer(arrowModel);
        if (gltf.animations && gltf.animations.length > 0) {
          const arrowClip = gltf.animations[0]; // Assuming the animation is the first one
          arrowAnimationRef.current = arrowMixer.clipAction(arrowClip);
          arrowAnimationRef.current.play(); // Play the arrow animation
        } else {
          console.warn("No animations found in the arrow model.");
        }

        // Store the arrow's mixer for updates
        arrowMixerRef.current = arrowMixer;
        arrowModelRef.current = arrowModel;

        console.log('Arrow added to the scene:', arrowModel);
      }, undefined, (error) => {
        console.error('Error loading arrow model:', error);
      });

      // Load the display_robot model (display_robot.glb)
      loader.load('/models/display_robot.glb', (gltf) => {
        console.log('Display Robot model loaded successfully:', gltf);

        const displayRobotModel = gltf.scene;
        displayRobotModel.position.set(-15, 2, -3.5); // Adjust position as needed
        displayRobotModel.scale.set(2, 2, 2); // Adjust scale as needed
        
        scene.add(displayRobotModel);

        // Set up animations for the display robot
        const displayRobotMixer = new THREE.AnimationMixer(displayRobotModel);
        if (gltf.animations && gltf.animations.length > 0) {
          const animationClip = gltf.animations[0]; // Assuming the animation is the first one
          const animationAction = displayRobotMixer.clipAction(animationClip);
          animationAction.play(); // Play the animation
        } else {
          console.warn("No animations found in the display robot model.");
        }

        // Store the display robot's mixer for updates
        displayRobotMixerRef.current = displayRobotMixer;
        displayRobotModelRef.current = displayRobotModel;

        console.log('Display Robot added to the scene:', displayRobotModel);
      }, undefined, (error) => {
        console.error('Error loading display robot model:', error);
      });

      // Load the chatbubble03 model
      loader.load('/models/chatbubble03.glb', (gltf) => {
        console.log('Chat bubble 03 model loaded successfully:', gltf);

        const chatBubble03Model = gltf.scene;
        chatBubble03Model.position.set(-15, 5, -3.5); // Position it above the display_robot
        chatBubble03Model.scale.set(1.5, 1.5, 1.5); // Adjust scale as needed
        chatBubble03Model.rotation.y = Math.PI / -2; // Adjust rotation as needed
        chatBubble03Model.visible = true; // Make the chat bubble visible
        chatBubble03Model.name = 'chatbubble03'; // Ensure the chat bubble has a unique name
        scene.add(chatBubble03Model); // Add the chat bubble to the scene

        console.log('Chat bubble 03 added to the scene:', chatBubble03Model);
      }, undefined, (error) => {
        console.error('Error loading chat bubble 03 model:', error);
      });

      // Load the chat bubble model (chatbubble01.glb)
      loader.load('/models/chatbubble01.glb', (gltf) => {
        console.log('Chat bubble model loaded successfully:', gltf);

        const chatBubbleModel = gltf.scene;
        chatBubbleModel.position.set(-4.5, 4, 5); // Adjust position as needed (above the NPC)
        chatBubbleModel.scale.set(1.5, 1.5, 1.5); // Adjust scale as needed
        chatBubbleModel.rotation.y = Math.PI / -2;
        chatBubbleModel.visible = true; // Make the chat bubble visible
        chatBubbleModel.name = 'chatbubble01'; // Ensure the chat bubble has a unique name
        scene.add(chatBubbleModel); // Add the chat bubble to the scene
        

        console.log('Chat bubble added to the scene:', chatBubbleModel);
      }, undefined, (error) => {
        console.error('Error loading chat bubble model:', error);
      });

      // Load the second chat bubble model (chatbubble02.glb)
      loader.load('/models/chatbubble02.glb', (gltf) => {
        console.log('Second chat bubble model loaded successfully:', gltf);

        const chatBubble02Model = gltf.scene;
        chatBubble02Model.position.set(5, 5, -4); // Adjust position as needed (above the second NPC)
        chatBubble02Model.scale.set(1.5, 1.5, 1.5); // Adjust scale as needed
        chatBubble02Model.rotation.y = Math.PI / -2;
        chatBubble02Model.visible = true; // Make the chat bubble visible
        chatBubble02Model.name = 'chatbubble02'; // Ensure the chat bubble has a unique name
        scene.add(chatBubble02Model); // Add the chat bubble to the scene

        console.log('Second chat bubble added to the scene:', chatBubble02Model);
      }, undefined, (error) => {
        console.error('Error loading second chat bubble model:', error);
      });

      // Load the LinkedIn model (linkedIn.glb)
      loader.load('/models/linkedIn.glb', (gltf) => {
        console.log('LinkedIn model loaded successfully:', gltf);

        const linkedInModel = gltf.scene;
        linkedInModel.position.set(17, 0, 0); // Adjust position as needed
        linkedInModel.scale.set(1, 1, 1); // Adjust scale as needed
        scene.add(linkedInModel);
        linkedInModelRef.current = linkedInModel; // Store the LinkedIn model reference

        console.log('LinkedIn model added to the scene:', linkedInModel);
      }, undefined, (error) => {
        console.error('Error loading LinkedIn model:', error);
      });
    });

    const keys = {};
    const moveSpeed = 0.1;

    const handleKeyDown = (event) => {
      keys[event.key.toLowerCase()] = true;
      if ((event.key === 'w' || event.key === 's' || event.key === 'a' || event.key === 'd') && playerMixerRef.current) {
        const walkAction = playerMixerRef.current._actions[0];
        if (walkAction) {
          walkAction.paused = false;
        }
      }
    };

    const handleKeyUp = (event) => {
      keys[event.key.toLowerCase()] = false;
      if ((event.key === 'w' || event.key === 's' || event.key === 'a' || event.key === 'd') && playerMixerRef.current) {
        const walkAction = playerMixerRef.current._actions[0];
        if (walkAction) {
          walkAction.paused = true;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Mouse Look (Inverted Y-Axis)
    const handleMouseMove = (event) => {
      if (!isMouseActiveRef.current) return;
      const sensitivity = 0.002;
      cameraYawRef.current -= event.movementX * sensitivity;
      cameraPitchRef.current += event.movementY * sensitivity;
      cameraPitchRef.current = Math.max(-Math.PI / 4, Math.min(Math.PI / 6, cameraPitchRef.current));
    };

    const handleClick = (event) => {
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        if (document.pointerLockElement !== renderer.domElement) {
          renderer.domElement.requestPointerLock().catch((err) => {
            console.error("Error requesting pointer lock:", err);
          });
        } else {
          // Raycasting to detect clicks on the download button
          const raycaster = new THREE.Raycaster();
          const mouse = new THREE.Vector2();

          // Calculate mouse position in normalized device coordinates (-1 to +1)
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

          // Set the raycaster to shoot from the camera through the mouse position
          raycaster.setFromCamera(mouse, camera);

          // Check for intersections with the download button
          const intersects = raycaster.intersectObject(downloadButtonModelRef.current, true);

          if (intersects.length > 0) {
            console.log('Download button clicked!');
            // Trigger download logic here
          }
        }
      }
    };

    const handlePointerLockChange = () => {
      isMouseActiveRef.current = document.pointerLockElement === renderer.domElement;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate); // Use animationFrameId.current
      const delta = clock.getDelta();

       // Debug: Log the clock's elapsed time
      console.log('Clock elapsed time:', clock.getElapsedTime());

      // Update all animation mixers
      if (playerMixerRef.current) playerMixerRef.current.update(delta);
      if (npcMixerRef.current) npcMixerRef.current.update(delta);
      if (newNpcMixerRef.current) newNpcMixerRef.current.update(delta);
      if (arrowMixerRef.current) arrowMixerRef.current.update(delta); // Update arrow animations
      if (displayRobotMixerRef.current) displayRobotMixerRef.current.update(delta); // Update display robot animations
      if (guidRobotMixerRef.current) guidRobotMixerRef.current.update(delta); // Add this line

      // Add this block to animate the download button
      const downloadButtonModel = downloadButtonModelRef.current;
      if (downloadButtonModel) {
        console.log('Animating download button:', downloadButtonModel.position.y);

        // Move up and down slightly
        downloadButtonModel.position.y = 2 + Math.sin(clock.getElapsedTime() * 2) * 0.1;

        // Rotate slowly
        downloadButtonModel.rotation.y += delta * 0.1;
      } else {
        console.error('Download button model is not loaded!');
      }

      // Add this block to animate the chat bubble
      const chatBubble = scene.getObjectByName('chatbubble01');
      if (chatBubble) {
        console.log('Animating chat bubble:', chatBubble.position.y);

        // Move up and down slightly
        chatBubble.position.y = 4 + Math.sin(clock.getElapsedTime() * 2) * 0.1;

        // Rotate slowly
        chatBubble.rotation.y += delta * 0.1;
      } else {
        console.error('Chat bubble not found!');
      }

      // Add this block to animate the second chat bubble
      const chatBubble02 = scene.getObjectByName('chatbubble02');
      if (chatBubble02) {
        console.log('Animating second chat bubble:', chatBubble02.position.y);

        // Move up and down slightly
        chatBubble02.position.y = 4 + Math.sin(clock.getElapsedTime() * 2) * 0.1;

        // Rotate slowly
        chatBubble02.rotation.y += delta * 0.1;
      } else {
        console.error('Second chat bubble not found!');
      }

      // Animate the chatbubble03
      const chatBubble03 = scene.getObjectByName('chatbubble03');
      if (chatBubble03) {
        console.log('Animating chat bubble 03:', chatBubble03.position.y);

        // Move up and down slightly
        chatBubble03.position.y = 5 + Math.sin(clock.getElapsedTime() * 2) * 0.1;

        // Rotate slowly
        chatBubble03.rotation.y += delta * 0.1;
      } else {
        console.error('Chat bubble 03 not found!');
      }

      // Animate the LinkedIn model
      const linkedInModel = linkedInModelRef.current;
      if (linkedInModel) {
        console.log('Animating LinkedIn model:', linkedInModel.position.y);

        // Move up and down slightly
        linkedInModel.position.y = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.1;

        // Rotate slowly
        linkedInModel.rotation.y += delta * 0.1;
      } else {
        console.error('LinkedIn model not found!');
      }

      const playerModel = playerModelRef.current;
      const npcModel = npcModelRef.current;
      const newNpcModel = newNpcModelRef.current;

      if (playerModel) {
        // Calculate movement direction based on camera yaw
        const direction = new THREE.Vector3(0, 0, 0);

        if (keys['w']) {
          direction.z -= Math.cos(cameraYawRef.current) * moveSpeed;
          direction.x -= Math.sin(cameraYawRef.current) * moveSpeed;
        }
        if (keys['s']) {
          direction.z += Math.cos(cameraYawRef.current) * moveSpeed;
          direction.x += Math.sin(cameraYawRef.current) * moveSpeed;
        }
        if (keys['a']) {
          direction.x -= Math.cos(cameraYawRef.current) * moveSpeed;
          direction.z += Math.sin(cameraYawRef.current) * moveSpeed;
        }
        if (keys['d']) {
          direction.x += Math.cos(cameraYawRef.current) * moveSpeed;
          direction.z -= Math.sin(cameraYawRef.current) * moveSpeed;
        }

        // Check for collisions before moving the player
        const newPosition = playerModel.position.clone().add(direction);
        if (!checkCollision(newPosition)) {
          playerModel.position.copy(newPosition);
        } else {
          console.log("Player movement blocked due to collision");
        }

        // Rotate the player to face the movement direction
        if (direction.length() > 0) {
          const angle = Math.atan2(direction.x, direction.z);
          playerModel.rotation.y = angle;
        }
      }

      // Check if player is near the display_robot model
  if (playerModel && displayRobotModelRef.current) {
    const distanceToDisplayRobot = playerModel.position.distanceTo(displayRobotModelRef.current.position);
    console.log("Distance to Display Robot:", distanceToDisplayRobot); // Debugging log

    // Show the PDF popup if the player is within 3 units of the display_robot and the PDF hasn't been opened yet
    if (distanceToDisplayRobot < 3 && !showPdfPopup && !hasOpenedProjectsPdf.current) {
      setShowPdfPopup(true); // Show the PDF popup
      hasOpenedProjectsPdf.current = true; // Mark the PDF as opened
    } else if (distanceToDisplayRobot >= 3 && showPdfPopup) {
      setShowPdfPopup(false); // Hide the PDF popup
    }
  }

      // Check if player is near the guid_robot
if (playerModel && guidRobotRef.current) {
  const distanceToGuidRobot = playerModel.position.distanceTo(guidRobotRef.current.position);
  console.log("Distance to Guid Robot:", distanceToGuidRobot); // Debugging log

  // Play the second audio if the player is within 3 units of the guid_robot and the audio hasn't played yet
  if (distanceToGuidRobot < 5 && audioRef2.current && audioRef2.current.paused && !hasPlayedGuidRobotAudioRef.current) {
    audioRef2.current.play()
      .then(() => {
        console.log('Second audio playback started successfully!');
        hasPlayedGuidRobotAudioRef.current = true; // Mark the audio as played
        console.log('hasPlayedGuidRobotAudioRef set to:', true); // Debugging log
      })
      .catch((error) => {
        console.error('Error playing second audio:', error);
      });
  }
}

      // Check if player is near the first NPC
      if (playerModel && npcModel) {
        const distance = playerModel.position.distanceTo(npcModel.position);
        console.log("Distance to NPC:", distance); // Debugging log
        if (distance < 3 && !hasPlayedActionAnimation.current) {
          // Switch to the action animation when the player is close
          if (npcIdleActionRef.current && npcIdleActionRef.current.isRunning()) {
            npcIdleActionRef.current.stop(); // Stop the idle animation
          }
          if (npcActionActionRef.current && !npcActionActionRef.current.isRunning()) {
            npcActionActionRef.current.play(); // Play the action animation
            hasPlayedActionAnimation.current = true; // Mark the action animation as played

            // Hide the chat bubble immediately when the NPC starts moving
            const chatBubble = scene.getObjectByName('chatbubble01');
            if (chatBubble) {
              console.log('Chat bubble found:', chatBubble); // Debugging log
              chatBubble.visible = false; // Hide the chat bubble
              console.log('Chat bubble hidden');
            } else {
              console.error('Chat bubble not found!'); // Debugging log
            }
          }
        } else if (distance > 5 && hasPlayedActionAnimation.current && !hasMovedToTarget.current) {
          // Move the NPC to the target position when the player leaves and distance > 5 units
          hasMovedToTarget.current = true;
          // Move the NPC to the target position
          const moveDuration = 50; // Increased duration to make the NPC move slower
          const startTime = clock.getElapsedTime();
          const moveNPC = () => {
            const elapsedTime = clock.getElapsedTime() - startTime;
            const progress = Math.min(elapsedTime / moveDuration, 1);
            npcModel.position.lerp(targetPosition, progress);

            if (npcModel.position.distanceTo(targetPosition) > 0.1) {
              // Play the walking animation while moving
              if (npcWalkActionRef.current && !npcWalkActionRef.current.isRunning()) {
                npcWalkActionRef.current.play();
              }
              requestAnimationFrame(moveNPC);
            } else {
              // Stop the walking animation when the target is reached
              if (npcWalkActionRef.current) {
                npcWalkActionRef.current.stop();
              }

              // Play the third animation after reaching the target position
              if (npcThirdActionRef.current && !hasPlayedThirdAnimation.current) {
                npcThirdActionRef.current.play(); // Play the third animation
                hasPlayedThirdAnimation.current = true; // Mark the third animation as played
              }
            }
          };

          moveNPC();
        }
      }

      // Check if player is near the second NPC
      if (playerModel && newNpcModel) {
        const distanceToNewNpc = playerModel.position.distanceTo(newNpcModel.position);
        console.log("Distance to Second NPC:", distanceToNewNpc); // Debugging log

        const chatBubble02 = scene.getObjectByName('chatbubble02');
        if (chatBubble02 && distanceToNewNpc < 3) {
          chatBubble02.visible = false; // Hide the chat bubble
          console.log('Second chat bubble hidden (player is close)');
        }

        // Show the popup if the player is close to the second NPC and the popup hasn't been triggered before
        if (distanceToNewNpc < 3 && !hasSecondNpcPopupTriggered.current) {
          setShowSecondNpcPopup(true); // Show the popup
          hasSecondNpcPopupTriggered.current = true; // Mark the popup as triggered
        }
      }

      // Check if player is near the LinkedIn model
if (playerModel && linkedInModelRef.current) {
  const distanceToLinkedIn = playerModel.position.distanceTo(linkedInModelRef.current.position);
  console.log("Distance to LinkedIn model:", distanceToLinkedIn); // Debugging log

  // Redirect to LinkedIn profile if the player is within 2 units of the LinkedIn model
  if (distanceToLinkedIn < 2 && !hasLinkedInRedirected.current) {
    hasLinkedInRedirected.current = true; // Mark the redirection as done

    // Reset all movement keys
    keys['w'] = false;
    keys['a'] = false;
    keys['s'] = false;
    keys['d'] = false;

    // Pause the player's walk animation
    if (playerMixerRef.current) {
      const walkAction = playerMixerRef.current._actions[0];
      if (walkAction) {
        walkAction.paused = true; // Pause the walk animation
      }
    }

    // Open LinkedIn in a new tab
    window.open('https://www.linkedin.com/in/yaswanth-popuri-975aa6160', '_blank');
  }
}

      // Check if player is near the download button
  if (playerModel && downloadButtonModelRef.current) {
    const distanceToDownloadButton = playerModel.position.distanceTo(downloadButtonModelRef.current.position);
    console.log("Distance to Download Button:", distanceToDownloadButton); // Debugging log

    // Show the skill popup if the player is within 2 units of the download button and the PDF hasn't been opened yet
    if (distanceToDownloadButton < 4 && !showSkillPopup && !hasOpenedSkillsPdf.current) {
      setShowSkillPopup(true); // Show the skill popup
      hasOpenedSkillsPdf.current = true; // Mark the PDF as opened
    } else if (distanceToDownloadButton >= 2 && showSkillPopup) {
      setShowSkillPopup(false); // Hide the skill popup
    }
  }

      // Make the NPCs face the player
      if (npcModel) {
        npcModel.lookAt(playerModel.position);
      }
      if (newNpcModel) {
        newNpcModel.lookAt(playerModel.position);
      }

      // Update camera position
      if (playerModel) {
        const cameraOffset = new THREE.Vector3(
          Math.sin(cameraYawRef.current) * 5,
          4 + Math.sin(cameraPitchRef.current) * 2,
          Math.cos(cameraYawRef.current) * 5
        );

        const cameraTarget = playerModel.position.clone().add(cameraOffset);
        camera.position.lerp(cameraTarget, 0.1);
        camera.lookAt(playerModel.position.x, playerModel.position.y + 1.5, playerModel.position.z);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {


    console.log('Component unmounted'); // Debugging log
    clearTimeout(showTimer);
    clearTimeout(hideTimer);

      
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current); // Use animationFrameId.current
      }

      if (document.pointerLockElement === renderer.domElement) {
        document.exitPointerLock();
      }
    };
  }, []);

  return (
    <>
      {/* Three.js Canvas */}
      <div ref={mountRef} /> {/* This is where the Three.js canvas will be rendered */}

      {/* Blur Effect and Welcome Message */}
      <BlurWelcomeMessage showWelcomeMessage={showWelcomeMessage} /> {/* Use the new component */}

       {/* Instructions Overlay */}
    {showInstructions && <InstructionsOverlay />} {/* Ensure this is included */}
    
    {/* Mobile Controls */}
    {isMobile && <MobileControls onMove={handleJoystickMove} />}
      {/* Popup Components */}
      {showPopup && <Popup onClose={() => setShowPopup(false)} />} {/* Popup for the first NPC */}
      {showSecondNpcPopup && (
        <SecondNpcPopup onYes={handleYesClick} onNo={handleNoClick} /> 
      )}{/* Popup for the second NPC */}
      {showSkillPopup && (
        <SkillPopup onClose={() => setShowSkillPopup(false)} /> 
      )}{/* Popup for the skills PDF */}
      {showPdfPopup && (
        <PdfPopup onClose={() => setShowPdfPopup(false)} /> 
      )}{/* Popup for the project PDF */}
    </>
  );
};
export default GameScene;