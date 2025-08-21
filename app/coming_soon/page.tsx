"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaInstagram, FaFacebook, FaTiktok, FaUserCircle } from "react-icons/fa";

export default function Home() {
    const [animate, setAnimate] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setAnimate(true);
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            {/* HEADER */}
            <header className="flex items-center justify-between px-6 py-0.1 bg-white shadow">
                <div className="flex justify-between items-center ">
                    <nav className="flex items-center gap-6">
                        <Link href="#about" className="hover:text-blue-500 text-black">About Us</Link>
                        <Link href="#contact" className="hover:text-blue-500 text-black">Contact Us</Link>
                        <Link href="#products" className="hover:text-blue-500 text-black">Our Products</Link>
                        <button onClick={() => router.push("/gallery")} className="text-gray-700 hover:text-blue-600 cursor-pointer">
                            Gallery
                        </button>
                    </nav>

                    {/* Logo */}
                    <div className=" gap-100000" >
                        <Image src="/logo.jpeg" alt="Logo" width={100} height={50} className="cursor-pointer"
                               onClick={() => router.push("/")}/>
                    </div>
                </div>




                {/* Login Button */}
                <Link
                    href="/login"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Login
                </Link>
            </header>

            {/* HERO VIDEO */}
            <section className="relative w-full h-[80vh] bg-black flex items-center justify-center overflow-hidden">
                <video
                    src="/homev.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-800 via-gray-400 to-white bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_25px_rgba(99,102,241,0.7)]">
                        Hitorq Automotive
                    </h1>
                </div>
            </section>

            {/* BOOK NOW SECTION */}
            <section className="py-16 bg-gray-500">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                    {/* LEFT: DESCRIPTION */}
                    <div className="text-center md:text-left space-y-6">
                        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#ffffff] via-[#000000] to-[#ffffff] bg-clip-text text-transparent animate-pulse drop-shadow-lg">Hitorq Automotive</h1>
                        <h2 className="text-3xl font-bold text-gray-900">
                            With the finest hands, we are giving the best care for your vehicle.
                        </h2>
                        <p className="text-lg text-gray-700">
                            Your car deserves the best treatment — whether it’s a checkup, service, or restoration.
                            Book your appointment today and let us handle the rest.
                        </p>
                        <Link
                            href="/create"
                            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
                        >
                            Book Now
                        </Link>
                    </div>

                    {/* RIGHT: IMAGE */}
                    <div className="flex justify-center">
                        <Image
                            src="/home-appo.webp"   // 👉 place an image named booknow.jpg in /public
                            alt="Car service"
                            width={500}
                            height={400}
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </section>


            {/* SERVICES */}
            <section className="py-12 bg-gray-50">
                <h2 className="text-2xl font-bold text-center text-black mb-8">Our Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 text-gray-600">
                    {["Roadworthy Solutions", "4WD Specification", "Engine Rebuilds", "Custom Modifications"].map(
                        (service, i) => (
                            <div
                                key={i}
                                className="backdrop-blur-md bg-white/30 border rounded-lg shadow p-6 text-center"
                            >
                                {service}
                            </div>
                        )
                    )}
                </div>
            </section>

            {/* WHAT WE DO */}
            <section id="about" className="py-12 max-w-4xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4">What We Do?</h2>
                <p className="text-gray-600">
                    Instant and reliable service for all your 4x4 needs. Our expert team ensures
                    your vehicle is ready for any adventure.
                </p>
            </section>

            {/* OUR PRODUCTS */}
            <section id="products" className="py-12 text-center bg-gray-50 ">
                <h2 className="text-2xl font-bold mb-4 text-black">Our Products</h2>
                <p className="text-gray-600">Stay tuned... will be released very soon!</p>
            </section>

            {/* FOOTER */}
            <section className="p-6 text-center">
                <h2 className="text-xl font-semibold mb-4">Follow Us On</h2>
                <div className="flex justify-center space-x-6 text-2xl">
                    <a href="https://www.facebook.com/share/1AyTwLfLEW/?mibextid=wwXIfr" target="_blank">
                        <FaFacebook className="text-blue-600 hover:scale-110 transition-transform"/>
                    </a>
                    <a href="https://www.tiktok.com/@hitorq_automative?_t=ZS-8yqOyxHuSZw&_r=1" target="_blank">
                        <FaTiktok className="text-white hover:scale-110 transition-transform"/>
                    </a>
                    <a href="https://www.instagram.com/hitorq_automotive?igsh=MW41NzhsZDIwZmE3bw%3D%3D&utm_source=qr"
                       target="_blank">
                        <FaInstagram className="text-pink-500 hover:scale-110 transition-transform"/>
                    </a>
                </div>
            </section>
            <a
                href="https://www.instagram.com/hitorq_automotive?igsh=MW41NzhsZDIwZmE3bw%3D%3D&utm_source=qr" //methnta href="https://wa.me/12345678900" dnna
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-4 left-4 bg-black p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 z-50"
            >
                <FaInstagram className="text-pink-500 text-2xl"/>
            </a>

        </div>
    );
}