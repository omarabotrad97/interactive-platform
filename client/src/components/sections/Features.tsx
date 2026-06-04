import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export default function Features() {
    return (
        <section id="features" className="py-24 bg-gray-50 dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to succeed</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Our platform provides the tools and resources to help you learn effectively and achieve your goals.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: 'Self-Paced Learning', desc: 'Learn at your own speed with lifetime access to all course materials.', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
                        { title: 'Interactive Projects', desc: 'Build real-world projects to reinforce what you learn and build a portfolio.', color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' },
                        { title: 'Community Support', desc: 'Join a global community of learners and get help when you need it.', color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
                        { title: 'Expert Instructors', desc: 'Learn from industry professionals with years of real-world experience.', color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' },
                        { title: 'Certificate of Completion', desc: 'Earn recognized certificates to showcase your skills to employers.', color: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' },
                        { title: 'Mobile Friendly', desc: 'Access your courses anywhere, anytime, on any device.', color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400' },
                    ].map((feature, i) => (
                        <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400">{feature.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
