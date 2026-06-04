import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flame, CupSoda } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';

export default function PomodoroTimer() {
    const { lang, addXP } = useStore();
    
    // States: 25 minutes for study, 5 minutes for break
    const [mode, setMode] = useState<'focus' | 'break'>('focus');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const initialTime = mode === 'focus' ? 25 * 60 : 5 * 60;
    const progress = ((initialTime - timeLeft) / initialTime) * 100;

    // Web Audio Synthesizer Beep
    const playBeep = (type: 'level' | 'badge' | 'beep') => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            if (type === 'beep') {
                // Focus complete sound - two pleasant high synth notes
                const osc1 = ctx.createOscillator();
                const gain1 = ctx.createGain();
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
                osc1.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
                gain1.gain.setValueAtTime(0.2, ctx.currentTime);
                gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                osc1.connect(gain1);
                gain1.connect(ctx.destination);
                osc1.start();
                osc1.stop(ctx.currentTime + 0.4);
            }
        } catch (e) {
            console.warn("Audio context not supported or allowed yet.", e);
        }
    };

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current!);
                        setIsRunning(false);
                        handleTimerComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, mode]);

    const handleTimerComplete = () => {
        playBeep('beep');
        if (mode === 'focus') {
            // Reward student with 50 XP for focusing!
            addXP(50);
            alert(getTranslation(lang, 'pomodoroSuccess'));
            setMode('break');
            setTimeLeft(5 * 60);
        } else {
            alert(getTranslation(lang, 'breakSuccess'));
            setMode('focus');
            setTimeLeft(25 * 60);
        }
    };

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const switchMode = (newMode: 'focus' | 'break') => {
        setIsRunning(false);
        setMode(newMode);
        setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // SVG parameters for progress circle
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div id="guide-pomodoro" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col items-center justify-center text-center shadow-lg transition-all duration-300">
            {/* Mode Switches */}
            <div className="flex gap-2 p-1.5 bg-gray-50 dark:bg-gray-800 rounded-xl mb-6 w-full max-w-[240px]">
                <button
                    onClick={() => switchMode('focus')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
                        mode === 'focus'
                            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                            : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                >
                    <Flame className="w-3.5 h-3.5" />
                    {getTranslation(lang, 'focusMode')}
                </button>
                <button
                    onClick={() => switchMode('break')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
                        mode === 'break'
                            ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm'
                            : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                >
                    <CupSoda className="w-3.5 h-3.5" />
                    {getTranslation(lang, 'shortBreak')}
                </button>
            </div>

            {/* Circular Progress Timer */}
            <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        className="stroke-gray-100 dark:stroke-gray-800 fill-none"
                        strokeWidth="8"
                    />
                    {/* Foreground Animated Circle */}
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        className={`fill-none transition-all duration-500 ${
                            mode === 'focus' 
                                ? 'stroke-indigo-600 dark:stroke-indigo-500' 
                                : 'stroke-green-500 dark:stroke-green-400'
                        }`}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Centered Timer Text */}
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold tracking-tight tabular-nums text-gray-900 dark:text-white">
                        {formatTime(timeLeft)}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-gray-400 mt-0.5 tracking-wider flex items-center gap-1">
                        {mode === 'focus' ? (
                            <>
                                <Flame className="w-3 h-3 text-indigo-500" />
                                {lang === 'ar' ? 'ركز واكسب XP' : 'Study & Earn XP'}
                            </>
                        ) : (
                            <>
                                <CupSoda className="w-3 h-3 text-green-500" />
                                {lang === 'ar' ? 'استراحة' : 'Resting'}
                            </>
                        )}
                    </span>
                </div>
            </div>

            {/* Timer Actions */}
            <div className="flex gap-4">
                <button
                    onClick={resetTimer}
                    className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-all duration-150"
                    title={getTranslation(lang, 'resetTimer')}
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
                
                <button
                    onClick={toggleTimer}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-md active:scale-95 duration-150 ${
                        mode === 'focus'
                            ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                            : 'bg-green-600 hover:bg-green-700 shadow-green-600/20'
                    }`}
                >
                    {isRunning ? (
                        <>
                            <Pause className="w-4 h-4 fill-white" />
                            {getTranslation(lang, 'pauseTimer')}
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4 fill-white" />
                            {getTranslation(lang, 'startTimer')}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
