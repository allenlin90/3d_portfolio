# React + Vite + ThreeJs

# Main theme and static objects
## Island model
1. We can group the 3D model react component generated from `gltf` with `a.group` from `@react-spring/three`.
2. In this case, we don't require both `castShadow` and `receiveShadow` prop on `mesh` component. 
3. Besides, we don't need to call `useGLTF.preload`.
4. The `Canvas` from `@react-three/fiber` has several light sources for 3D models which can be used directly without explicitly import. 
   1. `directionalLight` is a light source from a distance, which may be considered as the sunlight shine from the far. 
      1. In this case, we give `position=[1,1,1]` and `intensity=2`.
      2. `position` is the location of the source of the light.
      3. `intensity` modifies the brightness (the higher the brighter) of the object, which is the `island` in this case.
   2. `ambientLight` casts shadow to objects. 
      1. In this case, we give only `intensity=0.5`
   3. `pointLight` adjust the position of all the lights emit.
      1. In this case, we have had `directionalLight` and `ambientLight`, so we can actually remove this source of light. 
   4. `spotLight` is similar to `pointLight` but in a shape of a cone with an angle (if given).
      1. In this case, we don't need this source of light.  
   5. `hemisphereLight` illuminates the scene in gradient. In this case, we give
      1. `skyColor=#b1e1ff`
      2. `groundColor=#000000`
      3. `intensity=1`


    ```tsx
    // Home.tsx
    const Home = () => {
      return (
        <Canvas className='w-full h-screen bg-transparent' camera={{ near: 0.1, far: 1000 }}>
          <Suspense fallback={<Loader />}>
            <directionalLight position={[1, 1, 1]} intensity={2} />
            <ambientLight intensity={0.5} />
            <pointLight /> // not required
            <spotLight /> // not required
            <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />

            <Sky />
            <Island />
          </Suspense>
        </Canvas>
      );
    }
    ```
5. Note that to use HTML elements directly in `canvas` tag, we need to wrap them in `Html` component from `@react-three/drei`.
    ```tsx
    // Loader.tsx
    import { Html } from '@react-three/drei';

    const Loader = () => {
      return (
        <Html>
          <div className='flex justify-center items-center'>
            <div className='w-20 h-20 border-2 border-opacity-20 border-blue-500 border-t-blue-500 rounded-full animate-spin' />
          </div>
        </Html>
      );
    };
    ```
6. To load assets to the `src` files to compile, we need to configure the list in `vite.config.js` (or `vite.config.ts`). 
7. To allow the `island` model rendering on the screen, we need to provide several parameters to `a.group`.
   1. `position`
   2. `scale`
   3. `rotation`
8. In this case, we detect the `window.innerWidth` for the screen width and give different settings for different device size.

    ```ts
    // Home.tsx
    const adjustIslandForScreenSize = () => {
      let screenScale = [1, 1, 1];
      const screenPosition = [0, -6.5, -43];
      const rotation = [0.1, 4.7, 0];

      if (window?.innerWidth < 768) {
        screenScale = [0.9, 0.9, 0.9];
      }

      return [screenScale, screenPosition, rotation];
    };
    ```


## Sky model
1.  To make the `island` floating in the sky, we create the other `sky` model as a `primitive` element.
2. Note that `island` is not a primitive element as it is composed by several `mesh`es.
3. Therefore, we can simply import the model and use as an `object` in the `primitive` tag. 
  ```tsx
  const Sky = () => {
    return (
      <mesh>
        <primitive object={model.scene} />
      </mesh>
    );
  }
  ```

## Bird and Plane model
1. After having `sky` as background and `island` as the main object, we can have a bird flying around the `island`. Besides giving object in `primitive`, we give 
    1.  `position=[-5, 2, 1]` and 
    2.  `scale=[0.003, 0.003, 0.003]`
2. The bird model will be on the left corner of the viewport.
3. Note that if the screen width is not enough, the bird object will not be in the view. 

# Interaction
## Rotation
### Home.tsx
1. To rotate the scene and objects, we can have a `React.state` on `Home` and pass the state and setter to models with props. 
2. On `Canvas` component, we give `isRotating ? 'cursor-grabbing' : 'cursor-grab'` to check whether the user is rotating the models.
3. For now, the plane is facing towards the user. We can create the other function which checks on `window.innerWidth` as `adjustIslandForScreenSize`.
    ```tsx
    // Home.tsx
    const adjustPlaneForScreenSize = () => {
      let screenScale = [3, 3, 3];
      let screenPosition = [0, -4, -4];

      if (window?.innerWidth < 768) {
        screenScale = [1.5, 1.5, 1.5];
        screenPosition = [0, -1.5, 0];
      }

      return [screenScale, screenPosition];
    };
    ```
4. We then can pass the `scale` and `position` to `Plane` model. 
    ```tsx
    // plane.tsx
    import { useGLTF } from '@react-three/drei';
    import planeScene from '../assets/3d/plane.glb';

    export const Plane = ({ isRotating, ...props }) => {
      const { scene, animations } = useGLTF(planeScene);

      return (
        <mesh {...props}>
          <primitive object={scene} />
        </mesh>
      );
    };

    export default Plane;   
    ```

### Island.tsx
1. We pass `isRotating` and `setIsRotating` from `Home` to `Island` model. 
2. We need 3 reference for user interaction.
   1. `lastX` the last position on x-axle of the mouse cursor.
   2. `rotationSpeed` the speed of rotating.
   3. `dampingFactor` which is a constant to allow controlling how fast the rotating and how rotation continues afterwards. 
3. The models have micro-interaction when a user clicks/grabs the object. The actions are separated into 3.
   1. `grabbing`
   2. `holding` (dragging)
   3. `releasing`


# Resources
1. Project tutorial [https://youtu.be/FkowOdMjvYo?si=9MpGRP2kykZbDxD3](https://youtu.be/FkowOdMjvYo?si=9MpGRP2kykZbDxD3)Search and find for 3D models at [https://sketchfab.com/](https://sketchfab.com/)
2. Render `.glb` 3D models as React component at [https://gltf.pmnd.rs/](https://gltf.pmnd.rs/)
3. [pmndrs](https://docs.pmnd.rs/) is a collection of React Three.js related libraries for 3D rendering. 