import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {useEffect, useState} from "react";
import api from '@/services/api';
import {useParams, useNavigate} from "react-router-dom";
import { useToast } from '@/components/ui/use-toast';


const UpdateInfoPage = () => {
    const [formData, setFormData] = useState({
        name : "",
        company: "",
        jobTitle: "",
        location: "",
        phone: "",
        githubId: "",
    });
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState({});
    const { toast } = useToast();
    const navigate = useNavigate();

    // @ts-ignore
    useEffect(async () => {
        const userData = await api.auth.getMe();
        setUser(userData);
        setFormData({
            name : userData.name,
            company: userData.company,
            jobTitle: userData.jobTitle,
            location: userData.location,
            phone: userData.phoneNumber,
            githubId: userData.githubId
        })
    }, [])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(formData.company === "" ||  formData.jobTitle === "" || formData.location === "" || formData.phone === "" || formData.githubId === "") {
            toast({
                title: 'Failed to Submit',
                description: `Some Fields are Missing!`,
            });
            return;
        }
        console.log("Updated Info:", formData);
        // You can call your backend API here to update the info
        console.log(formData)
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:8000/api/users/update/${userId}`, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json()
        console.log(data)
        toast({
            title: 'Updated Details successful',
            description: `Go To DashBoard`,
        });
        setTimeout(() => {
            window.location.href = "/app";
        }, 1000);
    };

    return (
        <div className="flex min-h-screen bg-white">
            <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 xl:px-24">
                <div className="w-full p-10 ">
                    <h2 className="text-2xl font-bold mb-4 text-center">Update Your Info</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company</label>
                            <Input
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Your Company"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Job Title</label>
                            <Input
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                placeholder="Your Job Title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <Input
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Your Location"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <Input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Your Phone Number"
                                type="tel"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">GitHub ID</label>
                            <Input
                                name="githubId"
                                value={formData.githubId}
                                onChange={handleChange}
                                placeholder="Your GitHub ID"
                            />
                        </div>

                        <Button type="submit" className="w-full mt-2">
                            Save Changes
                        </Button>
                    </form>
                </div>
            </div>

            <div className="hidden relative lg:block lg:w-1/2">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-700 to-brand-900 opacity-90"></div>
                <img
                    src="https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?auto=format&fit=crop&q=80&w=1200"
                    alt="Team collaboration"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-white">
                    <h2 className="mb-4 text-3xl font-bold">Built for modern dev teams</h2>
                    <p className="max-w-md text-center text-lg">
                        Join thousands of teams already using DevSync to ship better software, faster.
                    </p>
                    <div className="mt-10 grid grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold">3.5x</div>
                            <p className="text-sm opacity-80">Faster sprints</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">87%</div>
                            <p className="text-sm opacity-80">Fewer meetings</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">99.9%</div>
                            <p className="text-sm opacity-80">Uptime</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateInfoPage;
