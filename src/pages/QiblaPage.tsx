import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Compass, Navigation, Loader2, Share2, RefreshCw, Calendar, MapPin, Lock } from 'lucide-react';
import { Coordinates, Qibla } from 'adhan';

const QiblaPage: React.FC = () => {
    const [heading, setHeading] = useState<number>(0);
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
    const [isIOS, setIsIOS] = useState(false);

    // Smooth rotation state
    const [displayHeading, setDisplayHeading] = useState(0);
    const lastHeading = useRef(0);

    // Kaaba Coordinates
    const KAABA_LAT = 21.422487;
    const KAABA_LNG = 39.826206;

    useEffect(() => {
        // Detect iOS
        const isIOSDevice = [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].includes(navigator.platform)
            // iPad on iOS 13 detection
            || (navigator.userAgent.includes("Mac") && "ontouchend" in document);

        setIsIOS(isIOSDevice);

        // Android/Non-iOS usually don't need explicit permission for standard events, 
        // but let's assume granted unless we detect the need for requestPermission
        if (!isIOSDevice && typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
            setPermissionGranted(true);
        }
    }, []);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d;
    };

    const deg2rad = (deg: number) => {
        return deg * (Math.PI / 180);
    };

    const getCardinalDirection = (angle: number) => {
        const directions = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'];
        const index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
        return directions[index];
    };

    const requestAccess = async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const permissionState = await (DeviceOrientationEvent as any).requestPermission();
                if (permissionState === 'granted') {
                    setPermissionGranted(true);
                } else {
                    setError('Izin akses kompas ditolak.');
                }
            } catch (e) {
                console.error(e);
                setError('Gagal meminta izin sensor.');
            }
        } else {
            // Non-iOS 13+ devices
            setPermissionGranted(true);
        }
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
                setError('Gagal mengambil lokasi. Pastikan GPS aktif.');
                console.error(err);
            }
        );
    }, []);

    useEffect(() => {
        if (!permissionGranted) return;

        const handleOrientation = (event: DeviceOrientationEvent) => {
            let compass = event.alpha;

            // iOS webkitCompassHeading is usually more accurate for North
            if ((event as any).webkitCompassHeading) {
                compass = (event as any).webkitCompassHeading;
            }

            if (compass !== null && compass !== undefined) {
                // Smooth Rotation Logic
                // Calculate shortest path to next angle
                let diff = compass - lastHeading.current;

                // Adjust for wrap around (0 <-> 360)
                if (diff > 180) diff -= 360;
                if (diff < -180) diff += 360;

                // Smooth simply by applying new value directly? 
                // Actually to prevent 'spin back', we accumulate the display value.
                // But Framer Motion handles 'rotate' smoothly if we give it continuous values?
                // No, standard react updates might jump.
                // Let's rely on Framer Motion's spring, BUT we must feed it continuous values.
                // e.g. instead of 0 -> 359, we want 0 -> -1.

                // Better approach:
                // Keep `displayHeading` potentially > 360 or < 0
                // New Heading = Old Heading + Diff

                // Note: compass from event is absolute 0-360.
                // We need to compare with 'previous absolute' to find diff, then apply to 'accumulated'.

                // Since we don't store previous absolute, let's just store compass in a ref "prevCompass".
                // NO, we used lastHeading.current as display. Wait.

                // Let's redefine:
                // compass = absolute value from sensor (0-360)
                // we want to update `displayHeading` which drives the UI.

                // We need a ref for `prevAbsoluteCompass`
            }
        };

        // Reworked handleOrientation with safe logic
        // We need a separate function reference to remove it later

        let prevAbsolute = 0;
        let accumHeading = 0;
        let initialized = false;

        const handleMotion = (event: DeviceOrientationEvent) => {
            let absolute = event.alpha;
            if ((event as any).webkitCompassHeading) {
                absolute = (event as any).webkitCompassHeading;
            }

            if (absolute === null || absolute === undefined) return;

            if (!initialized) {
                prevAbsolute = absolute;
                accumHeading = absolute;
                initialized = true;
            }

            let delta = absolute - prevAbsolute;

            // Fix wrap around
            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;

            accumHeading += delta;
            prevAbsolute = absolute;

            // Update state
            setHeading(absolute); // For text display (0-360)
            setDisplayHeading(accumHeading); // For rotation animation (continuous)
        };

        window.addEventListener('deviceorientation', handleMotion, true);
        return () => window.removeEventListener('deviceorientation', handleMotion);
    }, [permissionGranted]);

    const ticks = Array.from({ length: 72 }, (_, i) => i * 5);

    return (
        <div className="flex flex-col space-y-6 max-w-4xl mx-auto pb-20">
            {/* Header Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 p-4 flex justify-between items-center transition-colors">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-full p-2 text-primary">
                        <Compass className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800 dark:text-white">Arah Kiblat</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">PENUNJUK KA'BAH</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <Share2 className="w-5 h-5" />
                </button>
            </div>

            {/* Error / Loading / Permission */}
            {error && (
                <div className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-900/30 flex items-center justify-center text-center">
                    {error}
                </div>
            )}

            {!permissionGranted && !error && (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-white/5 space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Izin Kompas Diperlukan</h3>
                    <p className="text-center text-gray-500 dark:text-gray-400 max-w-xs">
                        Untuk menggunakan kompas, mohon izinkan akses ke sensor perangkat Anda.
                    </p>
                    <button
                        onClick={requestAccess}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition shadow-lg shadow-primary/20"
                    >
                        Izinkan Akses Kompas
                    </button>
                </div>
            )}

            {!location && !error && permissionGranted && (
                <div className="flex justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )}

            {/* Main Compass Area */}
            {location && permissionGranted && (
                <div className="relative flex justify-center items-center py-6 md:py-10 overflow-hidden min-h-[350px] md:min-h-[400px]">
                    {/* Compass Container */}
                    <div className="relative w-72 h-72 md:w-96 md:h-96">

                        {/* The Rotating Dial */}
                        <motion.div
                            className="w-full h-full rounded-full border-4 border-primary/10 dark:border-white/10 bg-white dark:bg-slate-800 shadow-2xl relative transition-colors"
                            animate={{ rotate: -displayHeading }}
                            transition={{ type: "spring", stiffness: 40, damping: 10, mass: 0.8 }}
                        >
                            {/* Tick Marks */}
                            {ticks.map((deg) => (
                                <div
                                    key={deg}
                                    className={`absolute top-0 left-1/2 w-0.5 -translate-x-1/2 origin-bottom
                                        ${deg % 90 === 0 ? 'h-4 bg-gray-400 dark:bg-gray-500' : 'h-2 bg-gray-200 dark:bg-gray-600'}
                                    `}
                                    style={{
                                        height: '50%',
                                        transform: `rotate(${deg}deg)`
                                    }}
                                >
                                    {/* Degree Numbers for majors */}
                                    {deg % 30 === 0 && (
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-gray-500 dark:text-gray-400 transform -rotate-[${deg}deg]">
                                            {deg}°
                                        </span>
                                    )}
                                </div>
                            ))}

                            {/* Cardinal Points */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center z-10">
                                <div className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center bg-white dark:bg-slate-700 shadow-sm">
                                    <span className="text-red-500 font-bold text-sm">U</span>
                                </div>
                            </div>
                            <div className="absolute top-1/2 right-4 -translate-y-1/2 text-center z-10">
                                <span className="text-gray-500 dark:text-gray-300 font-bold text-sm">T</span>
                            </div>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center z-10">
                                <span className="text-gray-500 dark:text-gray-300 font-bold text-sm">S</span>
                            </div>
                            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-center z-10">
                                <span className="text-gray-500 dark:text-gray-300 font-bold text-sm">B</span>
                            </div>

                            {/* Center Dot */}
                            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 z-20 shadow-lg border-2 border-white dark:border-slate-800"></div>

                            {/* Qibla Indicator (Kaaba) */}
                            {qiblaDirection && (
                                <>
                                    {/* Line to Qibla */}
                                    <div
                                        className="absolute top-1/2 left-1/2 w-0.5 h-[42%] bg-gradient-to-t from-primary/80 to-transparent -translate-x-1/2 origin-top z-10"
                                        style={{ transform: `rotate(${qiblaDirection + 180}deg)` }}
                                    />

                                    {/* The Kaaba Icon Wrapper */}
                                    <div
                                        className="absolute w-full h-full top-0 left-0 pointer-events-none"
                                        style={{ transform: `rotate(${qiblaDirection}deg)` }}
                                    >
                                        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 flex flex-col items-center">
                                            <div className="bg-primary rounded-lg p-1.5 shadow-lg transform -rotate-45 border-2 border-white dark:border-slate-800 ring-2 ring-primary/20">
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

                        {/* Current Heading Indicator (Fixed) */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-30 drop-shadow-md">
                            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[14px] border-b-red-500"></div>
                        </div>

                        {/* Degrees Text Center Bottom */}
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                            <span className="font-bold text-3xl text-gray-800 dark:text-white tracking-tighter tabular-nums">
                                {Math.round(heading)}°
                            </span>
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Arah Ponsel</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Cards Grid */}
            {location && qiblaDirection && distance && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Direction Card */}
                    <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden group border border-transparent dark:border-primary/10">
                        <div className="absolute top-2 right-2 text-primary/10">
                            <Navigation className="w-12 h-12 opacity-20" />
                        </div>
                        <Navigation className="w-8 h-8 text-primary mb-2 transform -rotate-45" />
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white font-mono tracking-tight">
                            {qiblaDirection.toFixed(0)}°
                        </h3>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                            {getCardinalDirection(qiblaDirection).toUpperCase()} DARI UTARA
                        </p>
                    </div>

                    {/* Distance Card */}
                    <div className="bg-secondary/10 dark:bg-slate-700/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden border border-transparent dark:border-white/5">
                        <div className="absolute top-2 right-2 text-primary/10">
                            <MapPin className="w-12 h-12 opacity-20" />
                        </div>
                        {/* Kaaba Icon (Simple) */}
                        <div className="w-8 h-8 bg-black rounded-md relative mb-2 flex items-center justify-center">
                            <div className="w-full h-[1px] bg-yellow-400 absolute top-2"></div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white font-mono tracking-tight">
                            {distance.toLocaleString(undefined, { maximumFractionDigits: 0 })} km
                        </h3>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                            JARAK KE KA'BAH
                        </p>
                    </div>
                </div>
            )}

            {/* Location Label */}
            {location && (
                <div className="flex items-center gap-2 justify-center text-gray-400 dark:text-gray-500 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</span>
                </div>
            )}

            {/* Footer Actions */}
            <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                    onClick={() => window.location.reload()}
                    className="flex justify-center items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition shadow-sm font-semibold text-gray-600 dark:text-gray-300 text-sm"
                >
                    <RefreshCw className="w-4 h-4" />
                    Kalibrasi
                </button>
                <button
                    className="flex justify-center items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition shadow-sm font-semibold text-gray-600 dark:text-gray-300 text-sm"
                >
                    <Calendar className="w-4 h-4" />
                    Jadwal Sholat
                </button>
            </div>

            <div className="text-center text-[10px] text-gray-400 dark:text-gray-500 mt-4">
                <p>Sensor magnetik diperlukan untuk fitur kompas.</p>
            </div>
        </div>
    );
};

export default QiblaPage;
