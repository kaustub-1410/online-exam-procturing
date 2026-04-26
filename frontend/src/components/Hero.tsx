'use client';
import { Button } from '@/components/ui/button';
import SpotlightCard from '@/components/ui/SpotlightCard';
import GlitchText from '@/components/ui/GlitchText';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Shield, Eye, Activity, Lock, Globe, Cpu, User } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Scene3D = dynamic(() => import('@/components/Scene3D'), { ssr: false });

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden bg-[#000000]">
            <Scene3D />

            {/* Cinematic Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#000000_120%)] pointer-events-none z-0" />

            {/* Animated Grid Floor (CSS only) */}
            <div className="absolute bottom-0 w-full h-[50vh] bg-[linear-gradient(to_bottom,transparent,rgba(0,243,255,0.05)_50%,#000)] z-[1]"
                style={{ maskImage: 'linear-gradient(black, transparent)' }} />

            <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col items-center text-center">

                {/* Dynamic Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-md mb-8 shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]"
                >
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#06b6d4]" />
                    <span className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">System Online • v3.0.0</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-7xl md:text-9xl font-heading font-bold tracking-tighter mb-8 leading-none"
                >
                    <div>THE EYES OF</div>
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 pb-4">
                        <GlitchText text="INTELLIGENCE" />
                    </div>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-12 leading-relaxed font-light font-sans"
                >
                    Multimodal AI Proctoring that defies strict boundaries.
                    <span className="text-white font-medium border-b border-cyan-500/50 pb-0.5 mx-1">Zero latency.</span>
                    <span className="text-white font-medium border-b border-purple-500/50 pb-0.5 mx-1">100% Integrity.</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-gray-500 font-mono text-sm mb-12 flex gap-4 items-center"
                >
                    <span className="flex items-center gap-1"><User className="w-4 h-4" /> Kaustubh Pandey (CS-23411064)</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                    <span className="flex items-center gap-1"><User className="w-4 h-4" /> Vaibhav Raj (CS-23411072)</span>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-6 relative z-20"
                >
                    <Link href="/exam">
                        <Button size="lg" className="rounded-full px-12 py-8 text-lg bg-white text-black hover:bg-cyan-50 shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-all hover:scale-105 duration-300 font-bold tracking-wide">
                            Launch Demo <ArrowRight className="ml-2 w-6 h-6" />
                        </Button>
                    </Link>
                    <Link href="/#how-it-works">
                        <Button variant="outline" size="lg" className="rounded-full px-12 py-8 text-lg border-white/20 hover:bg-white/10 backdrop-blur-md transition-all hover:scale-105 duration-300">
                            <PlayCircle className="mr-2 w-6 h-6" /> Architecture
                        </Button>
                    </Link>
                </motion.div>

                {/* Spotlight Features Grid */}
                <motion.div
                    id="features"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="mt-32 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {[
                        { icon: Shield, title: "Behavioral Analysis", desc: "Detects suspicious movements using MediaPipe Face Mesh." },
                        { icon: Eye, title: "Gaze Tracking", desc: "Monitors iris movement to ensure screen focus." },
                        { icon: Cpu, title: "Edge Processing", desc: "Runs locally on your device for maximum privacy." },
                        { icon: Globe, title: "Browser Lockdown", desc: "Prevents tab switching and unauthorized tools." },
                        { icon: Activity, title: "Live Risk Scoring", desc: "Dynamic integrity score updated in real-time." },
                        { icon: Lock, title: "Secure Sessions", desc: "End-to-end encrypted WebSocket implementation." },
                    ].map((feature, i) => (
                        <SpotlightCard key={i} className="h-full">
                            <div className="p-8 flex flex-col items-start h-full">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-6 text-cyan-400">
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3 font-heading">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed max-w-xs">{feature.desc}</p>
                            </div>
                        </SpotlightCard>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
