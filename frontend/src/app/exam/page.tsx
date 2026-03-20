import ExamProctor from '@/components/ExamProctor';
import Navbar from '@/components/Navbar';

export default function ExamPage() {
    return (
        <main className="min-h-screen bg-[#050510] text-white">
            <Navbar />
            <div className="pt-24 px-6 pb-12 transition-all duration-500">
                <div className="max-w-[1400px] mx-auto">
                    <header className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                                Live Examination
                            </h1>
                            <p className="text-gray-400">Section A • General Intelligence • 60 Minutes</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-mono font-bold text-white">00:59:42</div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Time Remaining</p>
                        </div>
                    </header>

                    <ExamProctor />
                </div>
            </div>
        </main>
    );
}
