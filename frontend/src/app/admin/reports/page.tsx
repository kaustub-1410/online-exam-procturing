'use client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

export default function ReportsPage() {
    const reports = [
        { id: 101, student: "Alice Johnson", date: "2024-03-10", score: 12, status: "Clean" },
        { id: 102, student: "Bob Smith", date: "2024-03-10", score: 85, status: "Flagged" },
        { id: 103, student: "Charlie Dave", date: "2024-03-09", score: 45, status: "Reviewed" },
    ];

    return (
        <main className="min-h-screen bg-[#050510] text-white">
            <Navbar />
            <div className="pt-24 max-w-7xl mx-auto px-6">
                <h1 className="text-3xl font-bold mb-6">Exam Integrity Reports</h1>

                <div className="glass-panel rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/5">
                            <tr>
                                <th className="p-4">Report ID</th>
                                <th className="p-4">Student Name</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Risk Score</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((r) => (
                                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="p-4 font-mono text-gray-400">#{r.id}</td>
                                    <td className="p-4 font-medium">{r.student}</td>
                                    <td className="p-4 text-gray-400">{r.date}</td>
                                    <td className="p-4">
                                        <span className={`font-bold ${r.score > 50 ? 'text-red-500' : 'text-green-500'}`}>
                                            {r.score}%
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs ${r.status === 'Flagged' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                                            }`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <Button size="sm" variant="ghost"><FileText className="w-4 h-4 mr-2" /> View</Button>
                                        <Button size="sm" variant="outline"><Download className="w-4 h-4 mr-2" /> PDF</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
