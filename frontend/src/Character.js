import React, { useRef, useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function Character() {
    const { scene } = useGLTF(process.env.PUBLIC_URL + "/models/character.glb");
    const characterRef = useRef(); // Ref to the character object

    // Get the default camera and renderer from the scene
    const { camera, gl } = useThree();

    // Movement speed
    const moveSpeed = 0.1;

    // Track which keys are pressed
    const keys = useRef({
        w: false,
        a: false,
        s: false,
        d: false,
    });

    // Mouse movement variables
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);

    // Add event listeners for keydown and keyup
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (keys.current[event.key] !== undefined) {
                keys.current[event.key] = true;
            }
        };

        const handleKeyUp = (event) => {
            if (keys.current[event.key] !== undefined) {
                keys.current[event.key] = false;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        // Cleanup event listeners
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    // Add event listeners for mouse movement
    useEffect(() => {
        const handleMouseMove = (event) => {
            // Calculate mouse movement relative to the center of the canvas
            const rect = gl.domElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            setMouseX(event.clientX - centerX);
            setMouseY(event.clientY - centerY);
        };

        gl.domElement.addEventListener("mousemove", handleMouseMove);

        // Cleanup event listeners
        return () => {
            gl.domElement.removeEventListener("mousemove", handleMouseMove);
        };
    }, [gl.domElement]);

    // Update character position and camera
    useFrame(() => {
        if (!characterRef.current) return;

        // Calculate movement direction based on key presses
        const moveDirection = new THREE.Vector3();

        if (keys.current.w) moveDirection.z -= moveSpeed; // Move forward (negative Z-axis)
        if (keys.current.s) moveDirection.z += moveSpeed; // Move backward (positive Z-axis)
        if (keys.current.a) moveDirection.x -= moveSpeed; // Move left (negative X-axis)
        if (keys.current.d) moveDirection.x += moveSpeed; // Move right (positive X-axis)

        // Apply movement to the character
        characterRef.current.position.add(moveDirection);

        // Update camera rotation based on mouse movement
        const sensitivity = 0.002; // Adjust sensitivity for mouse movement
        const deltaX = mouseX * sensitivity;
        const deltaY = -mouseY * sensitivity; // Invert Y for natural movement

        // Calculate camera position based on fixed distance
        const cameraDistance = 3; // Reduced distance to bring the camera closer
        const cameraHeight = 3; // Increased height to show more of the character
        const cameraOffset = new THREE.Vector3(
            Math.sin(deltaX) * cameraDistance,
            cameraHeight, // Fixed height to show the head
            Math.cos(deltaX) * cameraDistance
        );

        const characterPosition = characterRef.current.position.clone();
        const cameraPosition = characterPosition.add(cameraOffset);

        // Set the camera position
        camera.position.copy(cameraPosition);

        // Make the camera look at the character's head
        const lookAtPosition = characterRef.current.position.clone();
        lookAtPosition.y += 2; // Adjusted to focus higher on the character
        camera.lookAt(lookAtPosition);

        // Reset mouse movement values after updating the camera
        setMouseX(0);
        setMouseY(0);
    });

    return (
        <>
            {/* Character */}
            <primitive
                ref={characterRef}
                object={scene}
                scale={[1.5, 1.5, 1.5]}
                position={[0, 10, -50]} // Adjusted initial position (moved back along Z-axis)
                rotation={[0, Math.PI, 0]} // Ensure the character is facing the correct direction
            />

            {/* Fixed Cube */}
            <mesh position={[0, 0, -5]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="orange" />
            </mesh>
        </>
    );
}