import { User } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-24 bg-gray-50 dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Students Worldwide</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        See what our students are saying about their learning experience.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="bg-white dark:bg-gray-900 border-none shadow-sm">
                            <CardContent className="p-8">
                                <div className="flex items-center gap-1 mb-4 text-yellow-400">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star}>★</span>
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                                    "This platform completely changed my career path. The courses are well-structured and the projects helped me build a portfolio that got me hired."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <User className="w-6 h-6 text-gray-500" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">Student Name</div>
                                        <div className="text-sm text-gray-500">Software Engineer</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
