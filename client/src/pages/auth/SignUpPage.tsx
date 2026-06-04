import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Github, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useStore } from '../../store/useStore';

export default function SignUpPage() {
    const navigate = useNavigate();
    const { updateUser, login } = useStore();
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!termsAccepted) {
            setError('You must accept the terms and conditions');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            updateUser({
                firstName,
                lastName,
                email,
            });
            login();
            setIsLoading(false);
            navigate('/dashboard');
        }, 1000);
    };

    return (
        <div className="min-h-screen flex text-gray-900 dark:text-gray-100 font-sans">
            {/* Left Side - Image */}
            <div className="hidden lg:block relative w-0 flex-1 overflow-hidden order-2">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
                    alt="Teams working together"
                />
                <div className="absolute inset-0 bg-purple-900/40 mix-blend-multiply" />
                <div className="absolute bottom-0 left-0 right-0 p-12 text-white bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-3xl font-bold mb-4">Join our community</h3>
                    <ul className="space-y-3">
                        {['Access to all premium courses', 'Hands-on projects and reviews', 'Certificate of completion', 'Mentorship from industry experts'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-lg text-purple-100">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white dark:bg-gray-950 order-1">
                <div className="mx-auto w-full max-w-sm lg:max-w-md">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link to="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                Sign in
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
                                <span className="bg-white dark:bg-gray-950 px-2 text-gray-500">Or sign up with email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    id="firstName"
                                    label="First Name"
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                                <Input
                                    id="lastName"
                                    label="Last Name"
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>

                            <Input
                                id="email"
                                type="email"
                                label="Email address"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <Input
                                id="password"
                                type="password"
                                label="Password"
                                placeholder="At least 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        aria-describedby="terms-description"
                                        name="terms"
                                        type="checkbox"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        className="w-4 h-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300">
                                        I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Privacy Policy</a>
                                    </label>
                                </div>
                            </div>

                            {error && (
                                <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full h-11 text-base" size="lg" disabled={isLoading}>
                                {isLoading ? 'Creating account...' : 'Create Account'}
                                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
