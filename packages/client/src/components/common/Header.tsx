
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/layout/Container";
import Button from "@/components/common/Button";
import Avatar from "@/components/common/Avatar";
import { Search, Menu, X, Bell, User, Settings, LogOut, Calendar, MessageCircle, Heart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  isLoggedIn?: boolean;
  className?: string;
}

const Header = ({ isLoggedIn = false, className }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={cn("sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-buddy-gray-100 py-4", className)}>
      <Container className="flex justify-between items-center">
        <div className="flex items-center">
          {isHomePage ? (
            <Link to="/" className="text-2xl font-bold text-buddy-gray-900 flex flex-col items-center mr-8">
              <div className="flex items-center">
                <Heart className="h-6 w-6 text-buddy-purple mr-2 fill-buddy-purple" />
                <div className="flex flex-col">
                  <span className="text-sm font-normal text-buddy-gray-700">Where is</span>
                  <span className="text-lg font-bold text-gradient-primary -mt-1">my Buddy?</span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          )}
          
          {isHomePage && isLoggedIn && (
            <nav className="hidden md:flex space-x-6">
              <NavLink to="/activities" label="Activities" icon={<Calendar className="w-4 h-4" />} />
              <NavLink to="/buddies" label="Buddies" icon={<User className="w-4 h-4" />} />
              <NavLink to="/messages" label="Messages" icon={<MessageCircle className="w-4 h-4" />} />
            </nav>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-buddy-gray-600 hover:text-buddy-gray-900"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-buddy-gray-600 hover:text-buddy-gray-900 relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-buddy-purple"></span>
                </Button>
              </div>
              
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="cursor-pointer">
                      <Avatar 
                        size="sm" 
                        status="online"
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-buddy-gray-200 shadow-lg">
                    <div className="px-3 py-2 border-b border-buddy-gray-100 mb-2">
                      <p className="font-medium text-buddy-gray-900">Jordan Lee</p>
                      <p className="text-xs text-buddy-gray-500">jordan@example.com</p>
                    </div>
                    <DropdownMenuItem className="flex items-center rounded-lg hover:bg-buddy-purple/10 cursor-pointer">
                      <User className="mr-2 h-4 w-4 text-buddy-gray-500" />
                      <Link to="/profile/1" className="flex-1">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center rounded-lg hover:bg-buddy-purple/10 cursor-pointer">
                      <Settings className="mr-2 h-4 w-4 text-buddy-gray-500" />
                      <Link to="/settings" className="flex-1">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 bg-buddy-gray-100" />
                    <DropdownMenuItem className="flex items-center rounded-lg hover:bg-red-50 text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <Link to="/signin" className="flex-1">Logout</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
          
          {!isLoggedIn && (
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          )}
        </div>
      </Container>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-buddy-gray-900 pt-20 px-6 pb-6 md:hidden animate-fade-in">
          <div className="flex flex-col space-y-6 mt-8">
            {isLoggedIn ? (
              <>
                <Link to="/activities" className="flex items-center space-x-3 py-2 text-lg" onClick={toggleMenu}>
                  <Calendar className="w-5 h-5" />
                  <span>Activities</span>
                </Link>
                <Link to="/buddies" className="flex items-center space-x-3 py-2 text-lg" onClick={toggleMenu}>
                  <User className="w-5 h-5" />
                  <span>Buddies</span>
                </Link>
                <Link to="/messages" className="flex items-center space-x-3 py-2 text-lg" onClick={toggleMenu}>
                  <MessageCircle className="w-5 h-5" />
                  <span>Messages</span>
                </Link>
                <Link to="/notifications" className="flex items-center space-x-3 py-2 text-lg" onClick={toggleMenu}>
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </Link>
                <Link to="/search" className="flex items-center space-x-3 py-2 text-lg" onClick={toggleMenu}>
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </Link>
                <Link to="/profile" className="flex items-center space-x-3 py-2 text-lg" onClick={toggleMenu}>
                  <Avatar size="sm" />
                  <span>Profile</span>
                </Link>
                <Link to="/settings" className="flex items-center space-x-3 py-2 text-lg" onClick={toggleMenu}>
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
                <Link to="/signin" className="flex items-center space-x-3 py-2 text-lg text-red-600" onClick={toggleMenu}>
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="block w-full" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full">Log In</Button>
                </Link>
                <Link to="/signup" className="block w-full" onClick={toggleMenu}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

const NavLink = ({ to, label, icon }: NavLinkProps) => {
  const isActive = false;
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center space-x-1.5 text-buddy-gray-600 hover:text-buddy-gray-900 py-1 active-buddy",
        isActive && "text-buddy-gray-900 active"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default Header;
