import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, Loader2 } from 'lucide-react';
import { Coordinates, Qibla } from 'adhan';

const QiblaPage: React.FC = () => {
    const [heading, setHeading] = useState<number | null>(null);
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        // 1. Get User Location
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });

                // 2. Calculate Qibla Direction (Angle from North)
                const coords = new Coordinates(latitude, longitude);
                const qibla = Qibla(coords);
                setQiblaDirection(qibla);
            },
            (err) => {
                setError('Unable to retrieve your location. Please enable GPS.');
                console.error(err);
            }
        );

        // 3. Handle Device Orientation (Compass)
        const handleOrientation = (event: DeviceOrientationEvent) => {
            // alpha: rotation around z-axis (compass direction)
            // webkitCompassHeading: for iOS
            let compass = event.alpha;

            // iOS specific property
            if ((event as any).webkitCompassHeading) {
                compass = (event as any).webkitCompassHeading;
            }

            if (compass !== null) {
                // Invert because we rotate the compass image against the heading
                setHeading(compass);
            }
        };

        window.addEventListener('deviceorientation', handleOrientation, true);
        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, []);

    const isCompassSupported = heading !== null;

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 p-4">
            <header>
                <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2 mb-2">
                    <Compass className="w-8 h-8" />
                    Arah Kiblat
                </h1>
                <p className="text-gray-500">Temukan Arah Ka'bah dari Lokasimu</p>
            </header>

            {error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl max-w-sm">
                    <p className="font-bold">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            ) : !location ? (
                <div className="flex flex-col items-center gap-3 text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p>Mencari Lokasi...</p>
                </div>
            ) : (
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                    {/* Compass Ring Background */}
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200/50 shadow-inner bg-white/50 backdrop-blur-sm" />

                    {/* Tick Marks */}
                    {[0, 90, 180, 270].map((deg) => (
                        <div
                            key={deg}
                            className="absolute top-1/2 left-1/2 w-full h-px bg-gray-300 -translate-y-1/2 -translate-x-1/2"
                            style={{ transform: `translate(-50%, -50%) rotate(${deg}deg)` }}
                        >
                            <div className={`absolute ${deg === 0 ? '-top-6' : deg === 180 ? '-bottom-6' : deg === 90 ? '-right-6' : '-left-6'} left-1/2 -translate-x-1/2 font-bold text-gray-400 text-xs`}>
                                {deg === 0 ? 'N' : deg === 90 ? 'E' : deg === 180 ? 'S' : 'W'}
                            </div>
                        </div>
                    ))}

                    {/* Rotating Compass Disc (The Dial) */}
                    <motion.div
                        className="w-full h-full relative"
                        animate={{ rotate: isCompassSupported ? -heading! : 0 }}
                        transition={{ type: "spring", stiffness: 50, damping: 10 }}
                    >
                        {/* Qibla Indicator (The Kaaba Pointer) */}
                        {qiblaDirection && (
                            <div
                                className="absolute top-1/2 left-1/2 w-1 h-[45%] origin-bottom -translate-x-1/2 rounded-full z-10"
                                style={{
                                    backgroundColor: 'var(--primary)',
                                    transform: `translate(-50%, -100%) rotate(${qiblaDirection}deg)`,
                                    boxShadow: '0 0 10px var(--primary)'
                                }}
                            >
                                {/* Kaaba Icon at the tip */}
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black w-8 h-8 rounded-md border border-gold flex items-center justify-center shadow-lg transform -rotate-[${qiblaDirection}deg]">
                                    <div className="w-full h-1/3 border-t border-gold/50 mt-1"></div>
                                </div>
                            </div>
                        )}

                        {/* North Indicator (Red Tip) */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-red-400 rounded-b-full"></div>
                    </motion.div>

                    {/* Center Point */}
                    <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm z-20"></div>
                </div>
            )}

            {location && qiblaDirection && (
                <div className="glass-card p-4 max-w-xs w-full">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm">Arah Kiblat</span>
                        <span className="text-primary font-bold font-mono">{qiblaDirection.toFixed(2)}°</span>
                    </div>
                    {!isCompassSupported && (
                        <p className="text-xs text-orange-500 mt-2 bg-orange-50 p-2 rounded-lg">
                            ⚠️ Sensor kompas tidak terdeteksi. Silakan gunakan kompas eksternal dan arahkan ke <strong>{qiblaDirection.toFixed(2)}°</strong> dari Utara.
                        </p>
                    )}
                    <div className="text-[10px] text-gray-400 mt-2 text-center">
                        Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QiblaPage;
