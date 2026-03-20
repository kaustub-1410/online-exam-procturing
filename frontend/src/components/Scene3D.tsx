'use client';
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.cjs';

function DigitalGlobe(props: any) {
    const ref = useRef<any>();
    // 5001 is divisible by 3, but let's go denser for "Extraordinary"
    const [sphere] = useState(() => random.inSphere(new Float32Array(15000), { radius: 2.5 }));

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 15;
        ref.current.rotation.y -= delta / 20;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#bc13fe" // Purple
                    size={0.003}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#00f3ff" // Cyan mix
                    size={0.0015}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.5}
                />
            </Points>
        </group>
    );
}

export default function Scene3D() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <DigitalGlobe />
            </Canvas>
        </div>
    );
}
