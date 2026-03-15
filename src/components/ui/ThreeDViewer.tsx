"use client";

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Center, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

interface AnimatedShapeProps {
    scrollYProgress?: number;
}

function AnimatedShape({ scrollYProgress = 0 }: AnimatedShapeProps) {
    const groupRef = useRef<THREE.Group>(null);
    const mouseTrackingRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const wireframeRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Base rotation to show off the complex geometry
            groupRef.current.rotation.y += delta * 0.2;
            groupRef.current.rotation.x += delta * 0.1;

            // Scroll-driven parallax and scaling effects
            if (scrollYProgress > 0) {
                // As you scroll down, it moves down and becomes larger
                const targetY = -scrollYProgress * 2.5; // push down faster than scroll for parallax
                const targetScale = 1 + (scrollYProgress * 0.8);

                groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);
                groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1));
            }
        }

        // Cursor tracking
        if (mouseTrackingRef.current) {
            const targetRotationX = state.pointer.y * -0.5;
            const targetRotationY = state.pointer.x * 0.5;

            mouseTrackingRef.current.rotation.x = THREE.MathUtils.lerp(mouseTrackingRef.current.rotation.x, targetRotationX, 0.05);
            mouseTrackingRef.current.rotation.y = THREE.MathUtils.lerp(mouseTrackingRef.current.rotation.y, targetRotationY, 0.05);
        }

        // Animate the "printing" or "digital" wireframe
        if (wireframeRef.current) {
            wireframeRef.current.rotation.z -= delta * 0.1;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.8}>
            <group ref={groupRef}>
                <group ref={mouseTrackingRef}>
                    {/* Solid Printed Object - represents the physical printed product */}
                    <mesh ref={meshRef} castShadow receiveShadow>
                        <torusKnotGeometry args={[1.6, 0.5, 256, 64]} />
                        <meshPhysicalMaterial
                            color="#6C4CF1"
                            roughness={0.2}
                            metalness={0.1}
                            clearcoat={1}
                            clearcoatRoughness={0.15}
                            envMapIntensity={0.8}
                        />
                    </mesh>

                    {/* Wireframe Overlay - represents the CAD/Digital model */}
                    <mesh ref={wireframeRef}>
                        <torusKnotGeometry args={[1.605, 0.505, 48, 12]} />
                        <meshBasicMaterial
                            color="#E6E1FD"
                            wireframe
                            transparent
                            opacity={0.15}
                        />
                    </mesh>
                </group>
            </group>
        </Float>
    );
}

export default function ThreeDViewer({ scrollYProgress = 0 }: AnimatedShapeProps) {
    return (
        <div className="w-full h-[600px] md:h-[800px] relative">
            <Canvas
                camera={{ position: [0, 0, 9], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" castShadow />
                <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#E6E1FD" />
                <pointLight position={[0, -5, 5]} intensity={0.8} color="#6C4CF1" />

                <PresentationControls
                    global
                    config={{ mass: 2, tension: 500 }}
                    snap={{ mass: 4, tension: 1500 }}
                    rotation={[0, 0, 0]}
                    polar={[-Math.PI / 3, Math.PI / 3]}
                    azimuth={[-Math.PI / 1.4, Math.PI / 2]}
                >
                    <Center>
                        <AnimatedShape scrollYProgress={scrollYProgress} />
                    </Center>
                </PresentationControls>

                <Environment preset="city" />
            </Canvas>

            {/* Interaction Hint */}
            {scrollYProgress === 0 && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary/60 text-sm font-medium tracking-wide animate-pulse pointer-events-none whitespace-nowrap hidden lg:block">
                    Click and drag to rotate the digital model
                </div>
            )}
        </div>
    );
}
