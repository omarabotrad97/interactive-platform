import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import Stats from '../components/sections/Stats';
import Features from '../components/sections/Features';
import FeaturedCourses from '../components/sections/FeaturedCourses';
import Testimonials from '../components/sections/Testimonials';
import CallToAction from '../components/sections/CallToAction';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            <Navbar />
            <Hero />
            <Stats />
            <Features />
            <FeaturedCourses />
            <Testimonials />
            <CallToAction />
            <Footer />
        </div>
    );
}
