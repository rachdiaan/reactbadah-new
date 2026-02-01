import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, Navigation, Loader2, Share2, RefreshCw, Calendar, MapPin } from 'lucide-react';
import { Coordinates, Qibla } from 'adhan';

const QiblaPage: React.FC = () => {
    const [heading, setHeading] = useState<number>(0);
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [distance, setDistance] = useState<number | null>(null);

    // Kaaba Coordinates
    const KAABA_LAT = 21.422487;
    const KAABA_LNG = 39.826206;

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    };

    const deg2rad = (deg: number) => {
        return deg * (Math.PI / 180);
    };

    // Helper to get cardinal direction text from degree
    const getCardinalDirection = (angle: number) => {
        const directions = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'];
        const index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
        return directions[index];
    };

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });

                // Calculate Qibla
                const coords = new Coordinates(latitude, longitude);
                const qibla = Qibla(coords);
                setQiblaDirection(qibla);

                // Calculate Distance
                const dist = calculateDistance(latitude, longitude, KAABA_LAT, KAABA_LNG);
                setDistance(dist);
            },
            (err) => {
                setError('Unable to retrieve your location. Please enable GPS.');
                console.error(err);
            }
        );

        const handleOrientation = (event: DeviceOrientationEvent) => {
            let compass = event.alpha;
            if ((event as any).webkitCompassHeading) {
                compass = (event as any).webkitCompassHeading;
            }
            if (compass !== null) {
                setHeading(compass);
            }
        };

        window.addEventListener('deviceorientation', handleOrientation, true);
        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, []);

    const ticks = Array.from({ length: 72 }, (_, i) => i * 5); // Example ticks every 5 degrees

    return (
        <div className="flex flex-col space-y-6 max-w-4xl mx-auto pb-10">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-full p-2 text-primary">
                        <Compass className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">Arah Kiblat</h1>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">PENUNJUK KA'BAH</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <Share2 className="w-5 h-5" />
                </button>
            </div>

            {/* Error / Loading */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">{error}</div>
            )}
            {!location && !error && (
                <div className="flex justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )}

            {/* Main Compass Area */}
            {location && (
                <div className="relative flex justify-center items-center py-10 overflow-hidden min-h-[400px]">
                    {/* Background Pattern (Optional) */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                    ></div>

                    {/* Compass Container - Rotates against heading to keep North pointing 'Up' conceptually,
                        OR rotates the NEEDLE relative to the phone. 
                        Common Mobile Implementation: The DIAL rotates so 'North' matches the real North relative to phone top.
                    */}
                    <div className="relative w-72 h-72 md:w-96 md:h-96">

                        {/* The Rotating Dial */}
                        <motion.div
                            className="w-full h-full rounded-full border-4 border-primary/10 bg-white shadow-2xl relative"
                            animate={{ rotate: -heading }}
                            transition={{ type: "spring", stiffness: 40, damping: 10 }}
                        >
                            {/* Tick Marks */}
                            {ticks.map((deg) => (
                                <div
                                    key={deg}
                                    className={`absolute top-0 left-1/2 w-0.5 -translate-x-1/2 origin-bottom
                                        ${deg % 90 === 0 ? 'h-4 bg-gray-400' : 'h-2 bg-gray-200'}
                                    `}
                                    style={{
                                        height: '50%',
                                        transform: `rotate(${deg}deg)`
                                    }}
                                >
                                    {/* Degree Numbers for majors */}
                                    {deg % 30 === 0 && (
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-gray-500 transform -rotate-[${deg}deg]">
                                            {deg}°
                                        </span>
                                    )}
                                </div>
                            ))}

                            {/* Cardinal Points (U, T, S, B) */}
                            {/* U - North */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center z-10">
                                <div className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center bg-white">
                                    <span className="text-red-500 font-bold text-sm">U</span>
                                </div>
                            </div>
                            {/* T - East */}
                            <div className="absolute top-1/2 right-4 -translate-y-1/2 text-center z-10">
                                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-white">
                                    <span className="text-gray-500 font-bold text-sm">T</span>
                                </div>
                            </div>
                            {/* S - South */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center z-10">
                                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-white">
                                    <span className="text-gray-500 font-bold text-sm">S</span>
                                </div>
                            </div>
                            {/* B - West */}
                            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-center z-10">
                                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-white">
                                    <span className="text-gray-500 font-bold text-sm">B</span>
                                </div>
                            </div>

                            {/* Center Dot */}
                            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 z-20 shadow-lg border-2 border-white"></div>

                            {/* Qibla Indicator (Kaaba) relative to North (0) on the dial */}
                            {qiblaDirection && (
                                <>
                                    {/* Line to Qibla */}
                                    <div
                                        className="absolute top-1/2 left-1/2 w-0.5 h-[42%] bg-primary/50 -translate-x-1/2 origin-top z-10"
                                        style={{ transform: `rotate(${qiblaDirection + 180}deg)` }} // +180 because it originates from center downwards? No, verify rotation origin.
                                    // Standard CSS rotation 0 is UP (North).
                                    // But origin-top means it hangs down.
                                    // Let's use simple absolute placement logic or full height radius wrapper.
                                    />

                                    {/* The Kaaba Icon Wrapper */}
                                    <div
                                        className="absolute w-full h-full top-0 left-0 pointer-events-none"
                                        style={{ transform: `rotate(${qiblaDirection}deg)` }}
                                    >
                                        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 flex flex-col items-center">
                                            <div className="bg-primary rounded-lg p-1.5 shadow-lg transform -rotate-45 border-2 border-white">
                                                {/* Simple Cube Representation of Kaaba */}
                                                <div className="w-4 h-4 bg-black rounded-[1px] relative">
                                                    <div className="absolute top-[3px] w-full h-[1px] bg-yellow-400"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>

                        {/* Current Heading Indicator (Fixed at Top of Phone/Container usually to Show 'Front') */}
                        {/* Or simply simpler: The Dial rotates so 'North' matches real north. The PHONE is the reference frame. 
                            The 'Triangle' usually points UP (Phone Top). If heading is 0, N is at top.
                        */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-30">
                            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-primary/80"></div>
                        </div>

                        {/* Degrees Text Center Bottom */}
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 font-bold text-3xl text-gray-800 tracking-tighter">
                            {Math.round(heading)}°
                        </div>
                    </div>
                </div>
            )}

            {/* Info Cards Grid */}
            {location && qiblaDirection && distance && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Direction Card */}
                    <div className="bg-primary/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden group">
                        <div className="absolute top-2 right-2 text-primary/10">
                            <Navigation className="w-12 h-12 opacity-20" />
                        </div>
                        <Navigation className="w-8 h-8 text-primary mb-2 transform -rotate-45" />
                        <h3 className="text-3xl font-bold text-gray-800 font-mono tracking-tight">
                            {qiblaDirection.toFixed(0)}°
                        </h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                            {getCardinalDirection(qiblaDirection).toUpperCase()} DARI UTARA
                        </p>
                    </div>

                    {/* Distance Card */}
                    <div className="bg-secondary/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden">
                        <div className="absolute top-2 right-2 text-primary/10">
                            <MapPin className="w-12 h-12 opacity-20" />
                        </div>
                        {/* Kaaba Icon (Simple) */}
                        <div className="w-8 h-8 bg-black rounded-md relative mb-2 flex items-center justify-center">
                            <div className="w-full h-[1px] bg-yellow-400 absolute top-2"></div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 font-mono tracking-tight">
                            {distance.toLocaleString(undefined, { maximumFractionDigits: 0 })} km
                        </h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                            JARAK KE KA'BAH
                        </p>
                    </div>
                </div>
            )}

            {/* Location Label */}
            {location && (
                <div className="flex items-center gap-2 justify-center text-gray-400 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</span>
                </div>
            )}

            {/* Footer Actions */}
            <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                    onClick={() => window.location.reload()}
                    className="flex justify-center items-center gap-2 bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition shadow-sm font-semibold text-gray-600 text-sm"
                >
                    <RefreshCw className="w-4 h-4" />
                    Kalibrasi
                </button>
                <button
                    className="flex justify-center items-center gap-2 bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition shadow-sm font-semibold text-gray-600 text-sm"
                >
                    <Calendar className="w-4 h-4" />
                    Jadwal Sholat
                </button>
            </div>

            <div className="text-center text-[10px] text-gray-400 mt-4 flex items-center justify-center gap-1">
                <span className="text-yellow-500">💡</span> Gerakkan ponsel dalam <strong>pola angka 8</strong> untuk kalibrasi terbaik.
            </div>
        </div>
    );
};

export default QiblaPage;
