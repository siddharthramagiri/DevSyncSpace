import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom'
import { toast } from "@/components/ui/use-toast";
import api from "@/services/api";


const ProfilePage = () => {
    const [user, setUser] = useState({
        _id: "",
        name: "",
        email: "",
        avatar: "",
        company: "",
        jobTitle: "",
        location: "",
        phoneNumber: "",
        website: "",
        githubId: "",
    });
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { id } = useParams<{ id: string }>();

    // @ts-ignore
    useEffect(async () => {
        console.log(id)
        try {
            const res = await fetch(`http://localhost:8000/api/users/${id}`, {
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

    },[id]);

    if (!user) {
        return <div className="p-4">Loading profile...</div>;
    }

    const addTeamMember = async (userId: string) => {
        console.log(`Adding User to team ${userId}`)
        try {
            const response = await api.user.addToTeam(userId);
            toast({
                title: "Success",
                description: response.message,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

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
                <Button onClick={() => addTeamMember(user._id)}>Add Team Member</Button>
            </div>
        </div>
    );
};

export default ProfilePage;
