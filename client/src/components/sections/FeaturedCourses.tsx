import { Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

export default function FeaturedCourses() {
    return (
        <section id="courses" className="py-24 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Featured Courses</h2>
                        <p className="text-gray-500 dark:text-gray-400">Explore our most popular learning paths</p>
                    </div>
                    <Button variant="outline" className="hidden sm:flex">View All</Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="group overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors">
                            <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                                <div className={`absolute inset-0 bg-gradient-to-br ${i === 1 ? 'from-purple-500 to-indigo-600' : i === 2 ? 'from-blue-500 to-cyan-600' : 'from-pink-500 to-rose-600'} opacity-90 group-hover:scale-105 transition-transform duration-500`}></div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                    <Button className="rounded-full">Preview Course</Button>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">Development</span>
                                    <span className="text-xs text-gray-500 flex items-center"><Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" /> 4.9</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">Complete Web Development Bootcamp</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                    Become a full-stack web developer with just one course. HTML, CSS, Javascript, Node...
                                </p>
                                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                        <span className="text-sm font-medium">Dr. Angela Yu</span>
                                    </div>
                                    <span className="font-bold text-lg">$19.99</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="mt-8 text-center sm:hidden">
                    <Button variant="outline" className="w-full">View All Courses</Button>
                </div>
            </div>
        </section>
    );
}
