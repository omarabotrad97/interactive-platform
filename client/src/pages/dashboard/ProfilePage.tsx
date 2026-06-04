import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useStore } from '../../store/useStore';

export default function ProfilePage() {
    const { user, updateUser } = useStore();
    const [formData, setFormData] = useState(user);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleSubmit = () => {
        updateUser(formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your account information.</p>
            </div>

            <Card variant="default">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-2xl">
                            {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                            <CardTitle>{user.firstName} {user.lastName}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                        <Input
                            label="Last Name"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                    </div>
                    <Input
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                        <textarea
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 min-h-[100px]"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>
                    <div className="pt-4 flex items-center justify-end gap-3">
                        {isSaved && <span className="text-green-600 dark:text-green-400 text-sm font-medium animate-fade-in">Saved Successfully!</span>}
                        <Button onClick={handleSubmit}>Save Changes</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
