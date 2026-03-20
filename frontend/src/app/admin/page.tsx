import AdminDashboard from '@/components/AdminDashboard';
import Navbar from '@/components/Navbar';

export default function AdminPage() {
    return (
        <main className="min-h-screen bg-[#050510] text-white">
            <Navbar />
            <div className="pt-24 max-w-[1600px] mx-auto">
                <header className="px-6 mb-8">
                    <h1 className="text-3xl font-bold">Proctor Dashboard</h1>
                    <p className="text-gray-400">Real-time surveillance overview</p>
                </header>
                <AdminDashboard />
            </div>
        </main>
    );
}
