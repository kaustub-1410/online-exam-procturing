'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const plans = [
    {
        name: 'Starter',
        price: 'Free',
        desc: 'Perfect for demos and testing.',
        features: ['10 Exam Sessions / mo', 'Basic Face Detection', 'Standard Reporting', 'Email Support'],
        cta: 'Start Free',
        popular: false
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        desc: 'For universities and large scale usage.',
        features: ['Unlimited Sessions', 'Advanced Gaze Tracking', 'Browser Lockdown', 'Multiple Face Detection', 'Risk Analytics Dashboard', '24/7 Priority Support'],
        cta: 'Contact Sales',
        popular: true
    }
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 relative bg-[#050510] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
                        Simple Pricing
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Choose the integrity level that fits your institution.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative p-8 rounded-3xl border ${plan.popular ? 'border-cyan-500/50 bg-cyan-950/10' : 'border-white/10 bg-white/5'} backdrop-blur-md flex flex-col`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                                    MOST POPULAR
                                </div>
                            )}

                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="text-4xl font-heading font-bold text-white mb-4">{plan.price}</div>
                            <p className="text-gray-400 mb-8">{plan.desc}</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feat, j) => (
                                    <li key={j} className="flex items-center gap-3 text-gray-300">
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-green-400" />
                                        </div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.popular ? 'primary' : 'outline'}
                                className={`w-full py-6 text-lg rounded-xl ${plan.popular ? 'bg-cyan-500 hover:bg-cyan-400 text-black border-0' : 'border-white/20 hover:bg-white/10'}`}
                            >
                                {plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
