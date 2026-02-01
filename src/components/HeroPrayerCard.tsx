import React from 'react';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { MapPin, Calendar, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const HeroPrayerCard: React.FC = () => {
    const {
        nextPrayer,
        countdown,
        locationName,
        currentTime,
        isLoading,
        error
    } = usePrayerTimes();

    if (error) {
        return (
            <div className="w-full h-48 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 border border-red-100">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl prayer-card group mb-8">
            {/* Background Image/Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#4A85B0] to-secondary opacity-90 transition-opacity group-hover:opacity-100"></div>

            {/* Content Container */}
            <div className="relative z-10 p-6 md:p-8 text-white h-full flex flex-col justify-between min-h-[220px]">

                {/* Header: Location & Date */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
                        <MapPin className="w-4 h-4 text-white" />
                        <span className="text-xs font-medium tracking-wide">{locationName || 'Menunggu Lokasi...'}</span>
                    </div>
                </div>

                {/* Main Content: Next Prayer Time */}
                <div className="flex flex-col items-center justify-center text-center mt-2">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-2 animate-pulse">
                            <Loader2 className="w-8 h-8 animate-spin text-white/70" />
                            <span className="text-sm font-medium text-white/70">Memuat Jadwal...</span>
                        </div>
                    ) : (
                        <>
                            <div className="text-sm font-medium text-blue-100 uppercase tracking-widest mb-1">
                                {nextPrayer ? 'SHOLAT BERIKUTNYA' : 'AKHIR HARI'}
                            </div>
                            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter drop-shadow-lg font-serif">
                                {nextPrayer ? format(nextPrayer.time, 'HH:mm') : '--:--'}
                            </h2>
                            <div className="text-xl md:text-2xl font-semibold mt-1 text-blue-50">
                                {nextPrayer ? nextPrayer.name : 'Istirahat'}
                            </div>

                            {/* Countdown Timer */}
                            <div className="mt-4 flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                                <Clock className="w-4 h-4 text-blue-200" />
                                <span className="font-mono text-lg font-semibold tabular-nums text-white">
                                    {countdown.hours.toString().padStart(2, '0')}:
                                    {countdown.minutes.toString().padStart(2, '0')}:
                                    {countdown.seconds.toString().padStart(2, '0')}
                                </span>
                                <span className="text-xs text-blue-200 ml-1 font-medium">MENUJU ADZAN</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer: Date */}
                <div className="mt-4 flex justify-between items-end">
                    <div>
                        <p className="text-xs text-blue-100 font-medium">HARI INI</p>
                        <p className="text-lg text-white font-medium drop-shadow-sm">
                            {format(currentTime, 'EEEE, d MMMM yyyy', { locale: id })}
                        </p>
                    </div>
                    <Calendar className="w-6 h-6 text-white/30" />
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl"></div>
        </div>
    );
};

export default HeroPrayerCard;
