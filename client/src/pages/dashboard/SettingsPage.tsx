import { Bell, Moon, Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { useStore } from '../../store/useStore';

export default function SettingsPage() {
    const { isDarkMode, toggleDarkMode } = useStore();

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* ... header ... */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your application preferences.</p>
            </div>

            {/* ... other cards ... */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-indigo-600" />
                        Notifications
                    </CardTitle>
                    <CardDescription>Choose how you want to be notified.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="font-medium text-gray-700">Email Notifications</label>
                        <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="font-medium text-gray-700">Push Notifications</label>
                        <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Moon className="w-5 h-5 text-indigo-600" />
                        Appearance
                    </CardTitle>
                    <CardDescription>Customize the look and feel.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="font-medium text-gray-700">Dark Mode</label>
                        <input
                            type="checkbox"
                            className="toggle"
                            checked={isDarkMode}
                            onChange={toggleDarkMode}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* ... danger zone ... */}
            <Card className="border-red-100">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <Shield className="w-5 h-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>Irreversible actions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="danger">Delete Account</Button>
                </CardContent>
            </Card>
        </div>
    );
}
