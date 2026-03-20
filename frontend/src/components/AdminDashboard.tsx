'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock Data
const MOCK_STUDENTS = [
    { id: 1, name: 'Alice Johnson', status: 'Active', risk: 12, lastEvent: 'None' },
    { id: 2, name: 'Bob Smith', status: 'Active', risk: 85, lastEvent: 'Looking Away' },
    { id: 3, name: 'Charlie Dave', status: 'Active', risk: 45, lastEvent: 'Noise Detected' },
    { id: 4, name: 'Diana Prince', status: 'Completed', risk: 5, lastEvent: 'None' },
];

export default function AdminDashboard() {
    const [students, setStudents] = useState(MOCK_STUDENTS);

    // Simulate Live Updates
    useEffect(() => {
        const interval = setInterval(() => {
            setStudents(prev => prev.map(s => {
                if (s.status === 'Active') {
                    // Randomize risk slightly
                    const change = Math.floor(Math.random() * 10) - 5;
                    return { ...s, risk: Math.max(0, Math.min(100, s.risk + change)) };
                }
                return s;
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
            {/* Sidebar / Stats */}
            <div className="space-y-6">
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Total Active</h3>
                    <div className="text-4xl font-mono font-bold text-white flex items-center gap-3">
                        <Users className="text-cyan-400" />
                        {students.filter(s => s.status === 'Active').length}
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-gray-400 text-sm font-medium mb-1">High Risk</h3>
                    <div className="text-4xl font-mono font-bold text-white flex items-center gap-3">
                        <AlertTriangle className="text-red-500" />
                        {students.filter(s => s.risk > 70).length}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="col-span-1 md:col-span-3 space-y-6">
                <div className="glass-panel rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-xl font-bold">Live Monitoring</h2>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline">Refresh</Button>
                            <Button size="sm" variant="secondary">Export Report</Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left bg-black/20">
                            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Student</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Risk Score</th>
                                    <th className="p-4">Last Event</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium">{student.name}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${student.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${student.risk}%` }}
                                                        className={`h-full ${student.risk > 70 ? 'bg-red-500' : student.risk > 40 ? 'bg-yellow-500' : 'bg-green-500'
                                                            }`}
                                                    />
                                                </div>
                                                <span className="text-xs font-mono">{student.risk}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-400">{student.lastEvent}</td>
                                        <td className="p-4">
                                            <Button size="sm" variant="ghost" className="text-cyan-400 hover:text-cyan-300">View Feed</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
