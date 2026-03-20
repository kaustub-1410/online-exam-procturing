'use client';
import { motion } from 'framer-motion';
import { Camera, Brain, AlertTriangle, FileCheck } from 'lucide-react';

const steps = [
    {
        icon: Camera,
        title: 'Biometric Verification',
        desc: 'System verifies student identity using facial recognition and ensures a secure environment.'
    },
    {
        icon: Brain,
        title: 'AI Monitoring',
        desc: 'Video and audio streams are analyzed in real-time for suspicious behavior patterns.'
    },
    {
        icon: AlertTriangle,
        title: 'Instant Alerts',
        desc: 'Proctors receive immediate notifications if potential misconduct is detected.'
    },
    {
        icon: FileCheck,
        title: 'Integrity Report',
        desc: 'A comprehensive report is generated with timestamps and evidence snapshots.'
    }
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 relative bg-black overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-6">
                        How It Works
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Advanced surveillance pipeline executed entirely in the browser.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-cyan-500/50 transition-colors h-full">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                                    <step.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                            {/* Connector Line (Desktop) */}
                            {i < steps.length - 1 && (
                                <div className="hidden md:block absolute top-12 left-full w-full h-[2px] bg-gradient-to-r from-white/10 to-transparent -translate-x-8 z-0" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
