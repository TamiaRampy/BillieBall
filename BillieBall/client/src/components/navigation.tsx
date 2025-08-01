import { Link, useLocation } from "wouter";
import { Home, Settings, Trophy, History } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Play", icon: Home },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/history", label: "History", icon: History },
    { href: "/admin", label: "Admin", icon: Settings },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-billie-black/90 backdrop-blur-md border-b border-billie-gray/20">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/">
            <h1 className="text-xl font-bold billie-gradient">Billieball</h1>
          </Link>
          
          <div className="flex space-x-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <Button
                  variant={location === href ? "default" : "ghost"}
                  size="sm"
                  className={`
                    text-sm font-medium transition-colors
                    ${location === href 
                      ? "bg-billie-pink hover:bg-billie-pink/80 text-white" 
                      : "text-gray-300 hover:text-white hover:bg-billie-gray/50"
                    }
                  `}
                >
                  <Icon size={16} className="mr-1" />
                  {label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}