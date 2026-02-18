import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Navigation, Loader2, RefreshCw, MapPin, Lock, AlertTriangle, CheckCircle2, Smartphone } from 'lucide-react';
import { Coordinates, Qibla } from 'adhan';

const QiblaPage: React.FC = () => {
    const [heading, setHeading] = useState<number>(0);
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
    const [displayHeading, setDisplayHeading] = useState(0);
    const [calibrationQuality, setCalibrationQuality] = useState<'unknown' | 'low' | 'medium' | 'high'>('unknown');
    const [showCalibrationGuide, setShowCalibrationGuide] = useState(false);
    const [sensorActive, setSensorActive] = useState(false);
    const [noSensor, setNoSensor] = useState(false);
    const [manualRotation, setManualRotation] = useState(0);
    const isDragging = useRef(false);
    const lastDragX = useRef(0);

    const headingHistory = useRef<number[]>([]);
    const lastUpdateTime = useRef(0);

    const KAABA_LAT = 21.422487;
    const KAABA_LNG = 39.826206;

    const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }, []);

    const getCardinalDirection = (angle: number) => {
        const directions = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'];
        const index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
        return directions[index];
    };

    // Assess calibration quality from heading variance
    const assessCalibration = useCallback((newHeading: number) => {
        headingHistory.current.push(newHeading);
        if (headingHistory.current.length > 30) {
            headingHistory.current.shift();
        }
        if (headingHistory.current.length < 10) {
            setCalibrationQuality('unknown');
            return;
        }

        // Calculate variance of recent readings
        const arr = headingHistory.current;
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
        const variance = arr.reduce((sum, val) => {
            let diff = val - mean;
            // Wrap-around correction
            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;
            return sum + diff * diff;
        }, 0) / arr.length;

        if (variance < 25) setCalibrationQuality('high');
        else if (variance < 100) setCalibrationQuality('medium');
        else setCalibrationQuality('low');
    }, []);

    // Check iOS permission requirement
    useEffect(() => {
        const isIOSDevice = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod']
            .includes(navigator.platform)
            || (navigator.userAgent.includes("Mac") && "ontouchend" in document);

        if (!isIOSDevice && typeof (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission !== 'function') {
            setPermissionGranted(true);
        }
    }, []);

    const requestAccess = async () => {
        if (typeof (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission === 'function') {
            try {
                const permissionState = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
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
            setPermissionGranted(true);
        }
    };

    // Get location and calculate Qibla
    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolokasi tidak didukung oleh browser Anda.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });

                const coords = new Coordinates(latitude, longitude);
                const qibla = Qibla(coords);
                setQiblaDirection(qibla);

                const dist = calculateDistance(latitude, longitude, KAABA_LAT, KAABA_LNG);
                setDistance(dist);
            },
            (err) => {
                setError('Gagal mengambil lokasi. Pastikan GPS aktif.');
                console.error(err);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, [calculateDistance]);

    // Device orientation listener
    useEffect(() => {
        if (!permissionGranted) return;

        let prevAbsolute = 0;
        let accumHeading = 0;
        let initialized = false;
        let gotData = false;

        const handleMotion = (event: DeviceOrientationEvent) => {
            const now = Date.now();
            if (now - lastUpdateTime.current < 33) return;
            lastUpdateTime.current = now;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const absolute: number | null = (event as any).webkitCompassHeading ?? event.alpha;

            if (absolute === null || absolute === undefined) return;

            gotData = true;
            if (!sensorActive) setSensorActive(true);

            if (!initialized) {
                prevAbsolute = absolute;
                accumHeading = absolute;
                initialized = true;
            }

            let delta = absolute - prevAbsolute;
            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;

            accumHeading += delta;
            prevAbsolute = absolute;

            setHeading(absolute);
            setDisplayHeading(accumHeading);
            assessCalibration(absolute);
        };

        window.addEventListener('deviceorientation', handleMotion, true);

        // Desktop fallback: if no sensor data after 3 seconds, switch to static mode
        const timeout = setTimeout(() => {
            if (!gotData) {
                setNoSensor(true);
                setCalibrationQuality('high'); // static is always "accurate"
            }
        }, 3000);

        return () => {
            window.removeEventListener('deviceorientation', handleMotion);
            clearTimeout(timeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [permissionGranted, assessCalibration]);

    // Manual drag rotation for desktop/no-sensor mode
    const handlePointerDown = (e: React.PointerEvent) => {
        if (!noSensor) return;
        isDragging.current = true;
        lastDragX.current = e.clientX;
    };
    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current) return;
        const delta = e.clientX - lastDragX.current;
        lastDragX.current = e.clientX;
        setManualRotation(prev => prev + delta * 0.5);
    };
    const handlePointerUp = () => {
        isDragging.current = false;
    };

    // Calculate how far the phone is from pointing at Qibla
    const getQiblaOffset = () => {
        if (qiblaDirection === null) return null;
        let offset = qiblaDirection - heading;
        if (offset > 180) offset -= 360;
        if (offset < -180) offset += 360;
        return offset;
    };

    const qiblaOffset = getQiblaOffset();
    const isPointingAtQibla = qiblaOffset !== null && Math.abs(qiblaOffset) < 5;

    const calibrationColors = {
        unknown: 'text-gray-400',
        low: 'text-red-500',
        medium: 'text-yellow-500',
        high: 'text-green-500',
    };

    const calibrationLabels = {
        unknown: 'Mengukur...',
        low: 'Kalibrasi Rendah',
        medium: 'Cukup Baik',
        high: 'Akurat',
    };

    // Major ticks at 0, 30, 60, ... 330
    const majorTicks = Array.from({ length: 12 }, (_, i) => i * 30);
    const minorTicks = Array.from({ length: 36 }, (_, i) => i * 10).filter(d => d % 30 !== 0);
    const cardinals: Record<number, string> = { 0: 'U', 90: 'T', 180: 'S', 270: 'B' };

    return (
        <div className="flex flex-col space-y-5 max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="glass-card p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-full p-2.5 text-primary">
                        <Compass className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800 dark:text-white">Arah Kiblat</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Kompas Interaktif</p>
                    </div>
                </div>

                {/* Calibration Status Badge */}
                {(sensorActive || noSensor) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${noSensor ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' :
                            calibrationQuality === 'high' ? 'bg-green-50 dark:bg-green-900/20' :
                                calibrationQuality === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                                    calibrationQuality === 'low' ? 'bg-red-50 dark:bg-red-900/20' :
                                        'bg-gray-50 dark:bg-gray-800'
                            } ${noSensor ? '' : calibrationColors[calibrationQuality]}`}
                    >
                        {noSensor ? <Navigation className="w-3.5 h-3.5" /> :
                            calibrationQuality === 'high' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                                calibrationQuality === 'low' ? <AlertTriangle className="w-3.5 h-3.5" /> :
                                    <Compass className="w-3.5 h-3.5" />}
                        {noSensor ? 'Mode Statis' : calibrationLabels[calibrationQuality]}
                    </motion.div>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-900/30 text-center">
                    {error}
                </div>
            )}

            {/* Permission Required */}
            {!permissionGranted && !error && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center p-10 glass-card space-y-4"
                >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Izin Sensor Diperlukan</h3>
                    <p className="text-center text-gray-500 dark:text-gray-400 max-w-xs text-sm">
                        Untuk menampilkan kompas kiblat interaktif, izinkan akses ke sensor orientasi perangkat Anda.
                    </p>
                    <button
                        onClick={requestAccess}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition shadow-lg shadow-primary/20"
                    >
                        Izinkan Akses Sensor
                    </button>
                </motion.div>
            )}

            {/* Loading */}
            {!location && !error && permissionGranted && (
                <div className="flex flex-col items-center justify-center p-12 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Mengambil lokasi GPS...</p>
                </div>
            )}

            {/* Main Compass */}
            {location && permissionGranted && (
                <>
                    {/* No-sensor info banner */}
                    {noSensor && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-xl text-sm border border-blue-100 dark:border-blue-900/30 text-center">
                            📱 Sensor kompas tidak tersedia di perangkat ini. Arah Kiblat ditampilkan secara statis. <strong>Seret kompas</strong> untuk memutar manual.
                        </div>
                    )}

                    <div className="relative flex justify-center items-center py-4 md:py-8 min-h-[340px] md:min-h-[420px]">
                        <div
                            className={`relative w-72 h-72 md:w-[22rem] md:h-[22rem] ${noSensor ? 'cursor-grab active:cursor-grabbing select-none' : ''}`}
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerLeave={handlePointerUp}
                        >

                            {/* Qibla alignment glow */}
                            <AnimatePresence>
                                {isPointingAtQibla && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="absolute inset-0 rounded-full bg-green-400/10 ring-4 ring-green-400/30 z-0"
                                    />
                                )}
                            </AnimatePresence>

                            {/* Rotating Compass Dial */}
                            <motion.div
                                className="w-full h-full rounded-full border-[3px] border-gray-200/60 dark:border-white/10 bg-white dark:bg-slate-800 shadow-2xl relative z-10"
                                animate={{ rotate: noSensor ? manualRotation : -displayHeading }}
                                transition={{ type: "spring", stiffness: noSensor ? 100 : 50, damping: noSensor ? 20 : 12, mass: 0.6 }}
                            >
                                {/* Minor tick marks */}
                                {minorTicks.map((deg) => (
                                    <div
                                        key={`minor-${deg}`}
                                        className="absolute left-1/2 top-0 -translate-x-1/2 origin-bottom"
                                        style={{ height: '50%', transform: `translateX(-50%) rotate(${deg}deg)` }}
                                    >
                                        <div className="w-px h-2 bg-gray-200 dark:bg-gray-600 mx-auto" />
                                    </div>
                                ))}

                                {/* Major tick marks + labels */}
                                {majorTicks.map((deg) => (
                                    <div
                                        key={`major-${deg}`}
                                        className="absolute left-1/2 top-0 -translate-x-1/2 origin-bottom"
                                        style={{ height: '50%', transform: `translateX(-50%) rotate(${deg}deg)` }}
                                    >
                                        <div className={`mx-auto ${cardinals[deg] ? 'w-0.5 h-4' : 'w-px h-3'} ${deg === 0 ? 'bg-red-500' : 'bg-gray-400 dark:bg-gray-500'}`} />
                                        <div
                                            className="absolute -top-7 left-1/2 -translate-x-1/2"
                                            style={{ transform: `translateX(-50%) rotate(-${deg}deg)` }}
                                        >
                                            {cardinals[deg] ? (
                                                <span className={`text-xs font-bold ${deg === 0 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                                    {cardinals[deg]}
                                                </span>
                                            ) : (
                                                <span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">
                                                    {deg}°
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Center dot */}
                                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 z-20 shadow-lg border-2 border-white dark:border-slate-800" />

                                {/* Qibla Indicator on dial */}
                                {qiblaDirection !== null && (
                                    <>
                                        {/* Line from center to Qibla */}
                                        <div
                                            className="absolute left-1/2 top-0 -translate-x-1/2 origin-bottom"
                                            style={{ height: '50%', transform: `translateX(-50%) rotate(${qiblaDirection}deg)` }}
                                        >
                                            <div className="w-0.5 bg-gradient-to-b from-primary to-transparent h-[85%] mx-auto" />
                                        </div>

                                        {/* Kaaba icon at edge */}
                                        <div
                                            className="absolute left-1/2 top-0 -translate-x-1/2 origin-bottom pointer-events-none"
                                            style={{ height: '50%', transform: `translateX(-50%) rotate(${qiblaDirection}deg)` }}
                                        >
                                            <div
                                                className="absolute -top-1 left-1/2 -translate-x-1/2 flex flex-col items-center"
                                                style={{ transform: `translateX(-50%) rotate(-${qiblaDirection}deg)` }}
                                            >
                                                <div className="bg-primary rounded-lg p-1.5 shadow-lg border-2 border-white dark:border-slate-800 ring-2 ring-primary/20">
                                                    <div className="w-4 h-4 bg-black rounded-[2px] relative">
                                                        <div className="absolute top-[4px] w-full h-[1.5px] bg-yellow-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.div>

                            {/* Fixed heading indicator (red triangle) */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-30">
                                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-red-500 drop-shadow-md" />
                            </div>

                            {/* Heading display */}
                            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                {noSensor ? (
                                    <>
                                        <span className="font-bold text-2xl text-primary tracking-tighter tabular-nums">
                                            Kiblat: {qiblaDirection !== null ? `${Math.round(qiblaDirection)}°` : '—'}
                                        </span>
                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                                            dari Utara
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="font-bold text-3xl text-gray-800 dark:text-white tracking-tighter tabular-nums">
                                            {Math.round(heading)}°
                                        </span>
                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                                            {getCardinalDirection(heading)}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Qibla alignment feedback */}
                    <AnimatePresence mode="wait">
                        {qiblaOffset !== null && (
                            <motion.div
                                key={isPointingAtQibla ? 'aligned' : 'not-aligned'}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`text-center p-4 rounded-2xl border ${isPointingAtQibla
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30'
                                    : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-white/10'
                                    }`}
                            >
                                {isPointingAtQibla ? (
                                    <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-bold">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span>Anda menghadap Ka'bah! ✓</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <Navigation
                                            className={`w-5 h-5 text-primary transition-transform`}
                                            style={{ transform: `rotate(${(qiblaOffset ?? 0) - 45}deg)` }}
                                        />
                                        <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">
                                            Putar {qiblaOffset !== null && qiblaOffset > 0 ? 'kanan' : 'kiri'}{' '}
                                            <span className="font-bold text-primary">{Math.abs(Math.round(qiblaOffset ?? 0))}°</span>
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}

            {/* Info Cards */}
            {location && qiblaDirection !== null && distance !== null && (
                <div className="grid grid-cols-2 gap-3">
                    <div className="glass-card p-5 flex flex-col items-center text-center space-y-2">
                        <Navigation className="w-7 h-7 text-primary -rotate-45" />
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white tabular-nums">
                            {qiblaDirection.toFixed(1)}°
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {getCardinalDirection(qiblaDirection)} dari Utara
                        </p>
                    </div>
                    <div className="glass-card p-5 flex flex-col items-center text-center space-y-2">
                        <div className="w-7 h-7 bg-black rounded-md relative flex items-center justify-center">
                            <div className="w-full h-[1.5px] bg-yellow-400 absolute top-2" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white tabular-nums">
                            {distance.toLocaleString(undefined, { maximumFractionDigits: 0 })} km
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Jarak ke Ka'bah
                        </p>
                    </div>
                </div>
            )}

            {/* Location */}
            {location && (
                <div className="flex items-center gap-2 justify-center text-gray-400 dark:text-gray-500 text-xs">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => {
                        headingHistory.current = [];
                        setCalibrationQuality('unknown');
                        setSensorActive(false);
                        window.location.reload();
                    }}
                    className="glass-card flex justify-center items-center gap-2 p-4 hover:bg-primary/5 dark:hover:bg-white/5 transition font-semibold text-gray-600 dark:text-gray-300 text-sm"
                >
                    <RefreshCw className="w-4 h-4" />
                    Kalibrasi Ulang
                </button>
                <button
                    onClick={() => setShowCalibrationGuide(true)}
                    className="glass-card flex justify-center items-center gap-2 p-4 hover:bg-primary/5 dark:hover:bg-white/5 transition font-semibold text-gray-600 dark:text-gray-300 text-sm"
                >
                    <Smartphone className="w-4 h-4" />
                    Panduan Kalibrasi
                </button>
            </div>

            {/* Calibration Guide Modal */}
            <AnimatePresence>
                {showCalibrationGuide && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCalibrationGuide(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-t-3xl p-6 max-w-lg mx-auto bg-white/95 dark:bg-slate-900/95 border-t border-gray-200 dark:border-white/10"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-primary/10 rounded-full p-2 text-primary">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Panduan Kalibrasi</h3>
                            </div>

                            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                                    <p>Gerakkan ponsel membentuk <strong>angka 8</strong> di udara beberapa kali untuk mengkalibrasi sensor magnetik.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                                    <p>Jauhkan ponsel dari benda <strong>logam</strong> atau <strong>magnet</strong> yang dapat mengganggu sensor.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                                    <p>Pegang ponsel secara <strong>mendatar</strong> (horizontal) untuk akurasi terbaik.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                                    <p>Indikator status akan berubah menjadi <span className="text-green-500 font-bold">hijau</span> saat kalibrasi optimal.</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowCalibrationGuide(false)}
                                className="w-full mt-6 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition"
                            >
                                Mengerti
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className="text-center text-[10px] text-gray-400 dark:text-gray-500">
                <p>Akurasi bergantung pada kualitas sensor magnetik perangkat Anda.</p>
            </div>
        </div>
    );
};

export default QiblaPage;
