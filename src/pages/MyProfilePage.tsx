import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import api from '@/services/api.ts'

interface User {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    company?: string;
    jobTitle?: string;
    location?: string;
    phoneNumber?: string;
    website?: string;
    githubId?: string;
}

const MyProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (res.ok) {
                    setUser(data.user);
                } else {
                    toast({ title: "Error", description: data.message });
                }
            } catch (err) {
                toast({ title: "Error", description: "Failed to fetch user info." });
            }
        };

        fetchUser();
    }, [token]);

    if (!user) {
        return <div className="p-4">Loading profile...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 mt-8 bg-white">
            <div className="flex items-center space-x-6">
                <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                    <h1 className="text-2xl font-semibold">{user.name}</h1>
                    <p className="text-gray-500">{user.email}</p>
                    {user.githubId && <p className="text-sm text-gray-500">GitHub ID: {user.githubId}</p>}
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h2 className="text-lg font-medium">Company</h2>
                    <p className="text-gray-700">{user.company || "Not provided"}</p>
                </div>
                <div>
                    <h2 className="text-lg font-medium">Job Title</h2>
                    <p className="text-gray-700">{user.jobTitle || "Not provided"}</p>
                </div>
                <div>
                    <h2 className="text-lg font-medium">Location</h2>
                    <p className="text-gray-700">{user.location || "Not provided"}</p>
                </div>
                <div>
                    <h2 className="text-lg font-medium">Phone Number</h2>
                    <p className="text-gray-700">{user.phoneNumber || "Not provided"}</p>
                </div>
                <div>
                    <h2 className="text-lg font-medium">Website</h2>
                    <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        {user.website || "Not provided"}
                    </a>
                </div>
                <div>
                    <h2 className="text-lg font-medium">Github Profile</h2>
                    {
                        user.githubId?
                            <a href={`https://github.com/${user.githubId}`} className="text-blue-700" target="_blank"> {user.githubId} </a>
                            : <p> Not Provide </p>
                    }
                </div>
                <div>
                    <h2 className="text-lg font-medium">Contact me at : </h2>
                    {
                        user.githubId?
                            <a href={`mailto:${user.email}`} className="text-blue-700" target="_blank"> {user.email} </a>
                            : <p> Not Provide </p>
                    }
                </div>
            </div>

            <div className="mt-6">
                <Button onClick={() => navigate(`/app/updateProfile/${user._id}`)}>Update Details</Button>
            </div>
        </div>
    );
};

export default MyProfilePage;
