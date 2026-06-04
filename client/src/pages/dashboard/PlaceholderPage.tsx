import { Construction } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';

interface PlaceholderPageProps {
    title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <Card className="w-full max-w-lg text-center p-8" variant="elevated">
                <CardContent className="space-y-4 pt-6">
                    <div className="flex justify-center">
                        <div className="p-4 bg-yellow-50 rounded-full">
                            <Construction className="w-12 h-12 text-yellow-500" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    <p className="text-gray-500">
                        This page is currently under development. Check back soon!
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
