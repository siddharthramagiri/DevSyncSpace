
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Github, 
  MessagesSquare, 
  Video, 
  Briefcase, 
  Calendar, 
  CheckSquare,
  ArrowRight,
  Users,
  Code,
  Lock,
  Menu
} from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header/Navigation */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <div className="mr-2 h-8 w-8 rounded-full bg-brand-600"></div>
            <span className="text-xl font-bold">DevSyncSpace</span>
          </div>
          <nav className="hidden space-x-6 md:flex">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900">How it Works</a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">Pricing</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" className="hidden md:inline-flex">Log in</Button>
            </Link>
            <Link to="/register">
              <Button className="hidden md:inline-flex">Sign up</Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-50 to-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Empower Your <span className="text-brand-600">Remote Team</span> to Collaborate Seamlessly
              </h1>
              <p className="max-w-md text-lg text-gray-600">
                A complete collaboration platform designed specifically for software development teams to communicate effectively and deliver projects on time.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link to="/register">
                  <Button size="lg" className="w-full justify-center sm:w-auto">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full justify-center sm:w-auto">
                    Log in
                  </Button>
                </Link>
              </div>
            </div>
              <img 
                src="https://www.shakebugs.com/wp-content/uploads/2022/04/how-to-hire-remote-developers.png"
                alt="Team collaboration" 
                className="rounded-lg"
              />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Everything Your Dev Team Needs</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              A complete suite of tools designed to solve the common challenges faced by distributed software development teams.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature Card 1 */}
            <div className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <MessagesSquare className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Effective Team Chat</h3>
              <p className="text-gray-600">
                Real-time messaging with code block support, threading, and smart notifications to keep discussions organized.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Instant Video Meetings</h3>
              <p className="text-gray-600">
                One-click video conferencing with screen sharing and collaborative whiteboarding capabilities.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Code Collaboration</h3>
              <p className="text-gray-600">
                Share GitHub repositories, review code in real-time, and track project structure with detailed visualizations.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <CheckSquare className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Task Management</h3>
              <p className="text-gray-600">
                Assign and track tasks with custom workflows, priority levels, and integration with your code repositories.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Event Scheduling</h3>
              <p className="text-gray-600">
                Manage sprint planning, standups, and team meetings with smart scheduling that works across time zones.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Team Management</h3>
              <p className="text-gray-600">
                Create teams, invite developers, and manage permissions with role-based access controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-800 py-16 text-white md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to supercharge your team?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-brand-100">
            Join thousands of development teams already using DevSyncSpace to deliver projects faster.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-brand-800 hover:bg-gray-100">
              Start your free trial
            </Button>
          </Link>
        </div>
      </section>
      <div className=" border-t py-8 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} DevSyncSpace. All rights reserved.</p>
      </div>

      {/* Footer */}
      {/*<footer className="border-t bg-white py-12">*/}
      {/*  <div className="container mx-auto px-4">*/}
      {/*    <div className="grid gap-8 md:grid-cols-4">*/}
      {/*      <div>*/}
      {/*        <div className="flex items-center">*/}
      {/*          <div className="mr-2 h-8 w-8 rounded-full bg-brand-600"></div>*/}
      {/*          <span className="text-xl font-bold">DevSyncSpace</span>*/}
      {/*        </div>*/}
      {/*        <p className="mt-4 text-sm text-gray-600">*/}
      {/*          The complete collaboration suite for software development teams.*/}
      {/*        </p>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">*/}
      {/*      <p>&copy; {new Date().getFullYear()} DevSyncSpace. All rights reserved.</p>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</footer>*/}
    </div>
  );
};

export default Index;
