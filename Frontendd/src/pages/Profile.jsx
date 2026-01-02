import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button'; // Assuming you have a Button component
import { User, Mail, Shield, AlertCircle } from 'lucide-react';

const Profile = () => {
    const { user, login } = useAuth(); // Assuming login updates user context, or we might need a separate update function
    // Ideally useAuth should provide an 'updateProfile' method
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        // Initialize other fields as needed
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        // Perform update logic here (e.g., API call)
        // For now, just simulating success
        try {
            // const res = await fetch('/api/user/profile', { method: 'PUT', body: JSON.stringify(formData) ... });
            // if (res.ok) { updateContext(data); setIsEditing(false); setMessage('Profile updated!'); }
            setMessage('Profile update logic not yet implemented in backend connection.');
            setIsEditing(false);
        } catch (error) {
            setMessage('Failed to update profile.');
        }
    };

    if (!user) {
        return <div className="p-8 text-center">Please log in to view your profile.</div>;
    }

    return (
        <div className="min-h-screen pt-24 px-4 bg-background text-foreground">
            <div className="max-w-2xl mx-auto bg-card rounded-2xl border border-border p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User className="h-10 w-10" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{user.name}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <span className="capitalize px-2 py-0.5 bg-secondary rounded-full text-xs font-medium">
                                {user.role}
                            </span>
                            <span>{user.email}</span>
                        </div>
                    </div>
                </div>

                {message && (
                    <div className="mb-6 p-4 rounded-lg bg-blue-500/10 text-blue-500 flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {message}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    name="name"
                                    value={isEditing ? formData.name : user.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    name="email"
                                    value={user.email}
                                    disabled={true} // Usually email change requires more validation
                                />
                            </div>
                            <p className="text-[0.8rem] text-muted-foreground">
                                Email cannot be changed directly.
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none">Role</label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                    value={user.role}
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-border">
                        {isEditing ? (
                            <>
                                <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button onClick={handleSubmit}>Save Changes</Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
