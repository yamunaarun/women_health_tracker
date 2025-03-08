import { Link, useLocation } from "wouter";
import { Calendar, User, BarChart2 } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 md:top-0 md:bottom-auto">
      <div className="max-w-screen-xl mx-auto flex justify-around items-center">
        <Link href="/">
          <a className={`flex flex-col items-center p-2 ${location === "/" ? "text-primary" : "text-gray-500"}`}>
            <Calendar className="h-6 w-6" />
            <span className="text-xs mt-1">Calendar</span>
          </a>
        </Link>
        
        <Link href="/insights">
          <a className={`flex flex-col items-center p-2 ${location === "/insights" ? "text-primary" : "text-gray-500"}`}>
            <BarChart2 className="h-6 w-6" />
            <span className="text-xs mt-1">Insights</span>
          </a>
        </Link>
        
        <Link href="/profile">
          <a className={`flex flex-col items-center p-2 ${location === "/profile" ? "text-primary" : "text-gray-500"}`}>
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
