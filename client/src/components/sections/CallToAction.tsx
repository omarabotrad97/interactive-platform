import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export default function CallToAction() {
    return (
        <section className="py-24 bg-indigo-600 dark:bg-indigo-900 relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-30"></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 relative z-10 text-center text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to start your learning journey?</h2>
                <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                    Join thousands of students and start learning the skills you need for your future career today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/auth/signup">
                        <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 border-transparent h-14 px-8 text-lg w-full sm:w-auto">
                            Join for Free
                        </Button>
                    </Link>
                    <Link to="/auth/login">
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 h-14 px-8 text-lg w-full sm:w-auto">
                            Login to Account
                        </Button>
                    </Link>
                </div>
                <p className="mt-6 text-sm text-indigo-200">No credit card required for free courses.</p>
            </div>
        </section>
    );
}
