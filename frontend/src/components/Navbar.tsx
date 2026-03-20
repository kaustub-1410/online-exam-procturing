'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ShieldCheck, LayoutDashboard, User } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Features', href: '/#features' },
        { name: 'How It Works', href: '/#how-it-works' },
        { name: 'Pricing', href: '/#pricing' },
    ];

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
        >
            <div className="w-full max-w-5xl glass-panel rounded-full px-8 py-4 flex items-center justify-between shadow-2xl shadow-black/50 border border-white/10 backdrop-blur-xl bg-black/40">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-heading text-xl font-bold tracking-tight text-white group-hover:text-cyan-200 transition-colors">
                        Proctor<span className="text-cyan-400">AI</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-medium text-gray-400 hover:text-white transition-colors hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="ghost" size="sm" className="hidden md:flex gap-2 text-gray-300 hover:text-white">
                            <LayoutDashboard className="w-4 h-4" /> Admin
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="primary" className="rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] bg-white text-black hover:bg-cyan-50 text-sm font-bold px-6">
                            Student Login
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}
