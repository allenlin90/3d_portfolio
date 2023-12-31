/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: nimzu (https://sketchfab.com/nimzuk)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/foxs-islands-163b68e09fcc47618450150be7785907
Title: Fox's islands
*/

import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { a } from '@react-spring/three';
import type { Group, Object3DEventMap } from 'three/src/Three.js';

import islandScene from '../assets/3d/island.glb';

export const Island = ({
  isRotating,
  setIsRotating,
  setCurrentStage,
  ...props
}) => {
  const islandRef = useRef<Group<Object3DEventMap>>(null);

  // Get access to the Three.js renderer and viewport
  const { gl, viewport } = useThree();
  const { nodes, materials } = useGLTF(islandScene);

  const lastX = useRef(0); // last position of the mouse cursor
  const rotationSpeed = useRef(0);
  const dampingFactor = 0.95; // controlling how fast the object rotates when rotating

  const handlePointerDown = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation;
    e.preventDefault;
    setIsRotating(true);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;

    lastX.current = clientX;
  };

  const handlePointerUp = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation;
    e.preventDefault;
    setIsRotating(false);
  };

  const handlePointerMove = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation;
    e.preventDefault;

    if (isRotating) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;

      // calculate the change in the horizontal position of the mouse cursor or touch input,
      // relative to the viewport's width
      // delta means the change
      const delta = (clientX - lastX.current) / viewport.width;

      // 0.01 is an arbitrary factor
      if (islandRef.current?.rotation?.y) {
        // the island object rotates horizontally on circle
        islandRef.current.rotation.y += delta * 0.01 * Math.PI;
      }

      lastX.current = clientX;

      rotationSpeed.current = delta * 0.01 * Math.PI;
    }
  };

  // start rotating when press a key
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      if (!isRotating) setIsRotating(true);

      if (islandRef.current?.rotation?.y) {
        islandRef.current.rotation.y += 0.01 * Math.PI;
      }
    } else if (e.key === 'ArrowRight') {
      if (!isRotating) setIsRotating(true);

      if (islandRef.current?.rotation?.y) {
        islandRef.current.rotation.y -= 0.01 * Math.PI;
      }
    }
  };

  // stop rotating when release a key
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      setIsRotating(false);
    }
  };

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    gl,
    handlePointerDown,
    handlePointerUp,
    handlePointerMove,
    handleKeyDown,
    handleKeyUp,
  ]);

  // checks and triggers on every frame
  useFrame(() => {
    if (!isRotating) {
      // makes the plane roll smoother
      rotationSpeed.current *= dampingFactor;

      if (Math.abs(rotationSpeed.current ?? 0) < 0.001) {
        // stops it entirely when it is very slow
        rotationSpeed.current = 0;
      }

      if (islandRef.current?.rotation?.y) {
        // smooth rotation and slow it down
        islandRef.current.rotation.y += rotationSpeed.current;
      }
    } else {
      const rotation = islandRef.current?.rotation?.y ?? 0;

      // normalize the rotation value to ensure it stays within the range [0, 2 * Math.PI]
      // the goal is to ensure that the rotation value remains within a specific range
      const normalizedRotation =
        ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

      // Set the current stage based on the island's orientation
      switch (true) {
        case normalizedRotation >= 5.45 && normalizedRotation <= 5.85:
          setCurrentStage && setCurrentStage(4);
          break;
        case normalizedRotation >= 0.85 && normalizedRotation <= 1.3:
          setCurrentStage && setCurrentStage(3);
          break;
        case normalizedRotation >= 2.4 && normalizedRotation <= 2.6:
          setCurrentStage && setCurrentStage(2);
          break;
        case normalizedRotation >= 4.25 && normalizedRotation <= 4.75:
          setCurrentStage && setCurrentStage(1);
          break;
        default:
          setCurrentStage && setCurrentStage(null);
      }
    }
  });

  return (
    // react-spring animated group
    <a.group ref={islandRef} {...props}>
      <mesh
        geometry={nodes.polySurface944_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface945_tree1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface946_tree2_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface947_tree1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface948_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface949_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.pCube11_rocks1_0.geometry}
        material={materials.PaletteMaterial001}
      />
    </a.group>
  );
};

export default Island;
