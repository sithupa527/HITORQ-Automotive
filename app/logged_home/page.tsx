"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { FaInstagram, FaFacebook, FaTiktok, FaUserCircle } from "react-icons/fa";

interface Appointment {
    id: string;
    serviceType: string;
    startAt: string;
    status: string;
}

const carouselImages = [
    "/workplace1.jpg",
    "/workplace2.jpg",
    "/workplace3.jpg",
    "/workplace4.jpg",
    "/workplace5.jpg",
];

export default function LoggedHome() {
    const router = useRouter();
    const {data: session} = useSession();

    const [ongoingAppointments, setOngoingAppointments] = useState<Appointment[]>([]);
    const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    // Fetch data
    useEffect(() => {
        fetch("/api/appointments/ongoing")
            .then((r) => r.json())
            .then(setOngoingAppointments)
            .catch(() => {
            });
        fetch("/api/appointments/recent")
            .then((r) => r.json())
            .then(setRecentAppointments)
            .catch(() => {
            });
    }, []);

    // Carousel logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative min-h-screen bg-cover bg-center"
             style={{backgroundImage: "url('/logged_home-bg.jpg')"}}>
            {/* Background overlay (optional blur/darkening) */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0"/>

            {/* Main content */}
            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-white/60 backdrop-blur-md shadow-md sticky top-0 z-50">
                    <div className="flex justify-between items-center px-6 py-4">
                        <div className="flex items-center space-x-6">
                            <button onClick={() => router.push("/about")} className="text-gray-700 hover:text-blue-600">
                                About Us
                            </button>
                            <button onClick={() => router.push("/contact")}
                                    className="text-gray-700 hover:text-blue-600">
                                Contact Us
                            </button>
                        </div>
                        <Image src="/logo.jpeg" alt="Logo" width={100} height={50} className="cursor-pointer"
                               onClick={() => router.push("/")}/>
                        <div className="relative">
                            <button onClick={() => setProfileMenuOpen((prev) => !prev)}
                                    className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                {session?.user?.name ? session.user.name[0].toUpperCase() : <FaUserCircle size={24}/>}
                            </button>
                            {profileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                                    <button className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                                            onClick={() => router.push("/user_profile")}>
                                        Edit Profile
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                    >
                                        Logout
                                    </button>

                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-grow">
                    {/* Carousel */}
                    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-black via-gray-600 to-white bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_25px_rgba(99,102,241,0.7)]"> Hitorq Automotive</h1>
                    <div className="relative w-full h-72 overflow-hidden">
                        <Image
                            src={carouselImages[currentImageIndex]}
                            alt="Workplace"
                            fill
                            className="object-cover transition-all duration-1000 ease-in-out"
                        />
                    </div>

                    {/* Welcome */}
                    <div className="text-center py-8">
                        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(100,100,255,0.4)]">
                            Welcome {session?.user?.name || "Guest"}!
                        </h1>
                    </div>

                    {/* Add Appointment */}
                    <div className="flex justify-center mb-10">
                        <button
                            onClick={() => router.push("/add_appointment")}
                            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform"
                        >
                            Add New Appointment
                        </button>
                    </div>

                    {/* Ongoing Section */}
                    <section className="px-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Ongoing Appointments</h2>
                        {ongoingAppointments.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2 text-black">
                                {ongoingAppointments.map((app) => (
                                    <div key={app.id} className="p-4 bg-white/70 backdrop-blur-lg rounded-lg shadow-lg">
                                        <h3 className="font-bold">{app.serviceType}</h3>
                                        <p>{new Date(app.startAt).toLocaleString()}</p>
                                        <span className="text-sm text-blue-600">{app.status}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No ongoing appointments.</p>
                        )}
                    </section>

                    {/* Recent Section */}
                    <section className="px-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Recent Appointments</h2>
                        {recentAppointments.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {recentAppointments.map((app) => (
                                    <div key={app.id} className="p-4 bg-white/70 backdrop-blur-lg rounded-lg shadow-lg">
                                        <h3 className="font-bold">{app.serviceType}</h3>
                                        <p>{new Date(app.startAt).toLocaleString()}</p>
                                        <span className="text-sm text-gray-600">{app.status}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No recent appointments.</p>
                        )}
                    </section>

                    {/* Products Section */}
                    <section id="products" className="py-12 text-center bg-white/50 backdrop-blur-md">
                        <h2 className="text-2xl font-bold mb-4">Our Products</h2>
                        <p className="text-gray-600">Stay tuned... will be released very soon!</p>
                    </section>

                    {/* Social Section */}
                    <section className="p-6 text-center">
                        <h2 className="text-xl font-semibold mb-4">Follow Us On</h2>
                        <div className="flex justify-center space-x-6 text-2xl">
                            <a href="https://www.facebook.com/share/1AyTwLfLEW/?mibextid=wwXIfr" target="_blank">
                                <FaFacebook className="text-blue-600 hover:scale-110 transition-transform"/>
                            </a>
                            <a href="https://www.tiktok.com/@hitorq_automative?_t=ZS-8yqOyxHuSZw&_r=1" target="_blank">
                                <FaTiktok className="text-black hover:scale-110 transition-transform"/>
                            </a>
                            <a href="https://www.instagram.com/hitorq_automotive?igsh=MW41NzhsZDIwZmE3bw%3D%3D&utm_source=qr"
                               target="_blank">
                                <FaInstagram className="text-pink-500 hover:scale-110 transition-transform"/>
                            </a>
                        </div>
                    </section>
                </main>

                {/* Floating Instagram Button */}
                <a
                    href="https://www.instagram.com/hitorq_automotive?igsh=MW41NzhsZDIwZmE3bw%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-4 left-4 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 z-50"
                >
                    <FaInstagram className="text-pink-500 text-2xl"/>
                </a>
            </div>
        </div>
    );
}