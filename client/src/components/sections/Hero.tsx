import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-100/50 to-transparent dark:from-indigo-900/20 blur-3xl opacity-60" />
                <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-purple-100/50 to-transparent dark:from-purple-900/20 blur-3xl opacity-60" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8 animate-fade-in-up">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    New courses added weekly
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 animate-fade-in-up delay-100">
                    Master Your Future <br className="hidden md:block" /> with Online Learning
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
                    Unlock your potential with expert-led courses. Learn at your own pace, build real projects, and accelerate your career growth.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                    <Link to="/auth/signup">
                        <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto">
                            Get Started for Free
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                    <Link to="/auth/login">
                        <Button variant="outline" size="lg" className="h-14 px-8 text-lg w-full sm:w-auto">
                            Explore Courses
                        </Button>
                    </Link>
                </div>

                <div className="mt-16 flex items-center justify-center gap-8 text-gray-400 dark:text-gray-500 animate-fade-in-up delay-500 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Placeholder logos */}
                    <span className="font-bold text-xl flex items-center gap-2"><div className="w-6 h-6 bg-current rounded-full" /> TechCorp</span>
                    <span className="font-bold text-xl flex items-center gap-2"><div className="w-6 h-6 bg-current rounded-full" /> EduSystems</span>
                    <span className="font-bold text-xl flex items-center gap-2 hidden md:flex"><div className="w-6 h-6 bg-current rounded-full" /> FutureLearn</span>
                    <span className="font-bold text-xl flex items-center gap-2 hidden md:flex"><div className="w-6 h-6 bg-current rounded-full" /> InnovateX</span>
                </div>
            </div>
        </section>
    );
}
