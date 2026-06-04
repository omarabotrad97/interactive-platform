import { useEffect } from 'react';
import { CheckCircle, Clock, Trophy, Award, Lock, Sparkles, Flame, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';
import InteractiveGuide from '../../components/interactive/InteractiveGuide';

export default function DashboardPage() {
    const { 
        lang, 
        user, 
        completedLessons, 
        xp, 
        level, 
        badges,
        showXPNotification,
        showLevelUpNotification,
        showBadgeNotification,
        clearXPNotification,
        clearLevelUpNotification,
        clearBadgeNotification
    } = useStore();

    // Reset notifications after timeout
    useEffect(() => {
        if (showXPNotification) {
            const t = setTimeout(clearXPNotification, 3000);
            return () => clearTimeout(t);
        }
    }, [showXPNotification]);

    useEffect(() => {
        if (showLevelUpNotification) {
            const t = setTimeout(clearLevelUpNotification, 5000);
            return () => clearTimeout(t);
        }
    }, [showLevelUpNotification]);

    useEffect(() => {
        if (showBadgeNotification) {
            const t = setTimeout(clearBadgeNotification, 5000);
            return () => clearTimeout(t);
        }
    }, [showBadgeNotification]);

    const stats = [
        {
            title: getTranslation(lang, 'coursesInProgress'),
            value: '2',
            icon: Clock,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
        },
        {
            title: getTranslation(lang, 'completedLessonsCount'),
            value: completedLessons.length.toString(),
            icon: CheckCircle,
            color: 'text-green-600 dark:text-green-400',
            bg: 'bg-green-50 dark:bg-green-900/20',
        },
        {
            title: getTranslation(lang, 'achievements'),
            value: badges.length.toString(),
            icon: Trophy,
            color: 'text-yellow-600 dark:text-yellow-400',
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        },
    ];

    // Progression math: 500 XP per level
    const xpInCurrentLevel = xp % 500;
    const xpProgressPercent = Math.min(100, Math.floor((xpInCurrentLevel / 500) * 100));
    const xpNeededForNextLevel = 500 - xpInCurrentLevel;

    // Badges definitions
    const allAvailableBadges = [
        { key: 'first_step', icon: Award, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50' },
        { key: 'quiz_master', icon: Trophy, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50' },
        { key: 'deep_focus', icon: Flame, color: 'text-red-500 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50' },
        { key: 'leitner_pro', icon: Sparkles, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/50' }
    ];

    // Mock Leaderboard
    const leaderboard = [
        { name: lang === 'ar' ? 'يوسف العتيبي' : 'Yousef Al-Otaibi', level: 8, xp: 3950, rank: 1, avatar: 'Y' },
        { name: lang === 'ar' ? 'سارة سميث' : 'Sarah Smith', level: 6, xp: 2850, rank: 2, avatar: 'S' },
        { name: lang === 'ar' ? 'أحمد المنصوري (أنت)' : 'Ahmed Al-Mansouri (You)', level: level, xp: xp, rank: 3, avatar: 'A', isSelf: true },
        { name: lang === 'ar' ? 'رانية نصر' : 'Rania Nasr', level: 4, xp: 1950, rank: 4, avatar: 'R' }
    ].sort((a, b) => b.xp - a.xp); // Rank dynamically based on user XP

    return (
        <div className="space-y-6 relative">
            {/* Gamification Notification Toasts */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
                {showXPNotification && (
                    <div className="bg-indigo-600 text-white rounded-xl shadow-xl p-4 flex items-center gap-3 animate-fade-in-up border border-indigo-400 pointer-events-auto">
                        <div className="bg-indigo-700 p-2 rounded-lg">
                            <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-bounce" />
                        </div>
                        <div>
                            <p className="font-extrabold text-sm">
                                {getTranslation(lang, 'xpGained', { amount: showXPNotification.amount.toString() })}
                            </p>
                        </div>
                    </div>
                )}

                {showBadgeNotification && (
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl shadow-xl p-4 flex items-center gap-3 animate-fade-in-up border border-amber-400 pointer-events-auto">
                        <div className="bg-amber-600 p-2.5 rounded-lg">
                            <Trophy className="w-6 h-6 text-white animate-spin-slow" />
                        </div>
                        <div>
                            <h4 className="font-black text-sm">{getTranslation(lang, 'newBadgeUnlocked')}</h4>
                            <p className="text-xs opacity-90 font-bold">
                                {getTranslation(lang, `badge_${showBadgeNotification.badgeKey as 'first_step'}`)}
                            </p>
                        </div>
                    </div>
                )}

                {showLevelUpNotification && (
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-2xl p-5 border border-purple-400/50 animate-level-glow pointer-events-auto text-center flex flex-col items-center">
                        <div className="p-3 bg-white/20 rounded-full mb-3">
                            <Trophy className="w-10 h-10 text-yellow-300 fill-yellow-300" />
                        </div>
                        <h4 className="font-black text-xl mb-1">{getTranslation(lang, 'levelUpTitle')}</h4>
                        <p className="text-sm font-bold opacity-90">
                            {getTranslation(lang, 'levelUpText', { level: showLevelUpNotification.level.toString() })}
                        </p>
                    </div>
                )}
            </div>

            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-6 sm:p-8 shadow-xl">
                <div className="absolute right-0 bottom-0 w-80 h-80 bg-gradient-to-tl from-white/10 to-transparent rounded-full blur-3xl opacity-50" />
                <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl opacity-50" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            {getTranslation(lang, 'welcomeBack', { name: `${user.firstName} ${user.lastName}` })}
                        </h1>
                        <p className="text-indigo-100/90 text-sm max-w-xl font-medium leading-relaxed">
                            {getTranslation(lang, 'trackProgress')}
                        </p>
                    </div>

                    {/* Progress / Level Progression Wheel */}
                    <div id="guide-gamification" className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                        <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex flex-col items-center justify-center border-2 border-white/20 text-indigo-950 font-black shadow-lg">
                            <span className="text-[10px] uppercase font-bold leading-none">{getTranslation(lang, 'level')}</span>
                            <span className="text-xl leading-none">{level}</span>
                        </div>
                        <div className="flex-1 min-w-[150px] space-y-1">
                            <div className="flex justify-between text-xs font-bold text-white/90">
                                <span>{xp} {getTranslation(lang, 'xpPoints')}</span>
                                <span>{xpProgressPercent}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-yellow-300 to-amber-400 transition-all duration-500" 
                                    style={{ width: `${xpProgressPercent}%` }} 
                                />
                            </div>
                            <p className="text-[10px] text-white/70 font-semibold">
                                {xpNeededForNextLevel} {lang === 'ar' ? 'نقطة متبقية للمستوى القادم' : 'XP needed to Level Up'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Platform Interactive Walkthrough Portal */}
            <InteractiveGuide />

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} variant="elevated" className="border border-gray-100 dark:border-gray-800 hover:scale-[1.02] transition-transform duration-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-xl ${stat.bg}`}>
                                    <Icon className={`w-4 h-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-extrabold text-gray-900 dark:text-white tabular-nums">{stat.value}</div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">
                                    {getTranslation(lang, 'keepUpWork')}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Achievements & Leaderboard Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Unlocked Badges Panel */}
                <Card className="lg:col-span-2 border border-gray-100 dark:border-gray-800 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Award className="w-5 h-5 text-indigo-500" />
                            {getTranslation(lang, 'unlockedBadges')}
                        </CardTitle>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                            {getTranslation(lang, 'badgeDescription')}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {allAvailableBadges.map((badge) => {
                                const IconComponent = badge.icon;
                                const isUnlocked = badges.some(b => typeof b === 'string' ? b === badge.key : b.key === badge.key);
                                return (
                                    <div 
                                        key={badge.key}
                                        className={`relative group flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-300 ${
                                            isUnlocked
                                                ? `${badge.color} hover:scale-105 shadow-md shadow-indigo-500/5`
                                                : 'bg-gray-50 dark:bg-gray-900/30 text-gray-300 dark:text-gray-700 border-gray-100 dark:border-gray-800'
                                        }`}
                                    >
                                        <div className="relative mb-3">
                                            <IconComponent className={`w-10 h-10 ${isUnlocked ? 'animate-none' : 'grayscale opacity-50'}`} />
                                            {!isUnlocked && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 rounded-full">
                                                    <Lock className="w-4 h-4 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <h4 className="text-xs font-extrabold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">
                                            {getTranslation(lang, `badge_${badge.key as 'first_step'}`)}
                                        </h4>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-snug line-clamp-2 px-1">
                                            {getTranslation(lang, `badge_${badge.key as 'first_step'}_desc`)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Leaderboard Panel */}
                <Card className="border border-gray-100 dark:border-gray-800 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            {getTranslation(lang, 'leaderboard')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {leaderboard.map((learner, idx) => {
                                const rankColors = [
                                    'bg-yellow-400 text-yellow-950 font-bold',
                                    'bg-gray-300 text-gray-900 font-bold',
                                    'bg-amber-600 text-white font-bold',
                                    'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium'
                                ];
                                const isSelf = learner.isSelf;

                                return (
                                    <div 
                                        key={idx} 
                                        className={`flex items-center justify-between p-4 transition-colors duration-150 ${
                                            isSelf 
                                                ? 'bg-indigo-50/50 dark:bg-indigo-950/20' 
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-900/20'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Rank circle badge */}
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${rankColors[learner.rank - 1]}`}>
                                                {learner.rank}
                                            </span>
                                            {/* Avatar fallback */}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-inner ${
                                                isSelf
                                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                                            }`}>
                                                {learner.avatar}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className={`text-sm truncate ${isSelf ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'font-medium text-gray-900 dark:text-white'}`}>
                                                    {learner.name}
                                                </p>
                                                <p className="text-[10px] text-gray-400">
                                                    {getTranslation(lang, 'level')} {learner.level}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="text-xs font-extrabold text-gray-900 dark:text-white tabular-nums">
                                                {learner.xp}
                                            </span>
                                            <span className="text-[9px] font-bold text-gray-400 ml-1">XP</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
