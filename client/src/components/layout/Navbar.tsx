import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Languages } from 'lucide-react';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { lang, toggleLanguage } = useStore();

    const navLinks = [
        { labelKey: 'featuresLink' as const, href: '#features' },
        { labelKey: 'coursesLink' as const, href: '#courses' },
        { labelKey: 'testimonialsLink' as const, href: '#testimonials' },
    ];

    return (
        <nav className="fixed top-4 left-4 right-4 z-50 transition-all duration-200">
            <div className="max-w-5xl mx-auto bg-white border-brutal rounded-full shadow-brutal px-6 py-2">
                <div className="flex items-center justify-between h-12">
                    {/* Playful Smiley Logo */}
                    <Link to="/" className="flex items-center gap-2 font-black text-lg text-slate-900 group">
                        <div className="w-8 h-8 rounded-full bg-[#ffde00] border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#0f172a] group-hover:translate-y-[-1px] group-hover:shadow-[3px_3px_0px_0px_#0f172a] transition-all">
                            <span className="text-sm">😊</span>
                        </div>
                        <span className="tracking-tight hover:text-emerald-600 transition-colors font-cairo">
                            {getTranslation(lang, 'home')}
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.labelKey}
                                href={link.href}
                                className="text-xs font-black text-slate-800 hover:text-[#ff3b69] transition-colors font-cairo"
                            >
                                {getTranslation(lang, link.labelKey)}
                            </a>
                        ))}
                    </div>

                    {/* Actions: Lang switcher, sign in, sign up */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Language Switcher Button */}
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-slate-900 rounded-full text-xs font-black text-slate-800 hover:bg-emerald-50 active:scale-95 transition-all shadow-[2px_2px_0px_0px_#0f172a] bg-white"
                        >
                            <Languages className="w-3.5 h-3.5" />
                            <span className="font-cairo">{lang === 'ar' ? 'English' : 'العربية'}</span>
                        </button>

                        {/* Login link */}
                        <Link to="/auth/login" className="text-xs font-black text-slate-700 hover:text-[#ff3b69] font-cairo">
                            {getTranslation(lang, 'login')}
                        </Link>
                        
                        {/* Try it free button */}
                        <Link to="/auth/signup">
                            <button className="h-10 px-5 text-xs font-black bg-[#ff3b69] hover:bg-[#ff5780] text-white border-2 border-slate-900 rounded-full shadow-[2px_2px_0px_0px_#0f172a] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#0f172a] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#0f172a] transition-all font-cairo">
                                {lang === 'ar' ? 'جربه مجاناً' : 'Try it free'}
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Actions */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={toggleLanguage}
                            className="p-1.5 border-2 border-slate-900 rounded-full text-slate-800 bg-white shadow-[2px_2px_0px_0px_#0f172a] active:translate-y-[1px]"
                        >
                            <Languages className="w-3.5 h-3.5" />
                        </button>

                        <button
                            className="p-1.5 border-2 border-slate-900 rounded-full text-slate-800 bg-white shadow-[2px_2px_0px_0px_#0f172a]"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown Menu */}
            {isMenuOpen && (
                <div className="md:hidden mt-2 mx-auto max-w-5xl bg-white border-brutal rounded-2xl shadow-brutal p-5 animate-fade-in-down">
                    <div className="space-y-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.labelKey}
                                href={link.href}
                                className="block text-sm font-black text-slate-800 hover:text-[#ff3b69] font-cairo"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {getTranslation(lang, link.labelKey)}
                            </a>
                        ))}
                        
                        <div className="pt-2 border-t-2 border-slate-100 flex flex-col gap-3">
                            <Button 
                                variant="outline" 
                                className="w-full justify-center text-xs font-black border-2 border-slate-900 rounded-full shadow-[2px_2px_0px_0px_#0f172a] hover:bg-slate-50" 
                                onClick={() => { setIsMenuOpen(false); navigate('/auth/login'); }}
                            >
                                {getTranslation(lang, 'login')}
                            </Button>
                            
                            <button 
                                className="w-full h-10 justify-center text-xs font-black bg-[#ff3b69] text-white border-2 border-slate-900 rounded-full shadow-[2px_2px_0px_0px_#0f172a] hover:bg-[#ff5780]" 
                                onClick={() => { setIsMenuOpen(false); navigate('/auth/signup'); }}
                            >
                                {lang === 'ar' ? 'جربه مجاناً' : 'Try it free'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
