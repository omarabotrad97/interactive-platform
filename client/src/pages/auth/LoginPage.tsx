import { useNavigate, Link } from 'react-router-dom';
import { Github, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useStore } from '../../store/useStore';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login
        login();
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex text-gray-900 dark:text-gray-100 font-sans">
            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white dark:bg-gray-950">
                <div className="mx-auto w-full max-w-sm lg:max-w-md">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                Sign up for free
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                                <Github className="w-5 h-5" />
                                <span>GitHub</span>
                            </Button>
                            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                                <Mail className="w-5 h-5" />
                                <span>Google</span>
                            </Button>
                        </div>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white dark:bg-gray-950 px-2 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                id="email"
                                type="email"
                                label="Email address"
                                placeholder="name@example.com"
                                required
                            />

                            <div>
                                <Input
                                    id="password"
                                    type="password"
                                    label="Password"
                                    placeholder="••••••••"
                                    required
                                />
                                <div className="flex items-center justify-end mt-1">
                                    <Link to="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-11 text-base group" size="lg">
                                Sign In
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block relative w-0 flex-1 overflow-hidden">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1546514714-df0b6ca0cd04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
                    alt="Students studying nicely"
                />
                <div className="absolute inset-0 bg-indigo-900/40 mix-blend-multiply" />
                <div className="absolute bottom-0 left-0 right-0 p-12 text-white bg-gradient-to-t from-black/80 to-transparent">
                    <blockquote className="text-2xl font-medium mb-4">
                        "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."
                    </blockquote>
                    <cite className="font-medium text-indigo-200 not-italic block">- Brian Herbert</cite>
                </div>
            </div>
        </div>
    );
}
