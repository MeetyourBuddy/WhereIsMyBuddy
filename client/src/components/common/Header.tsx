import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/layout/Container";
import Button from "@/components/common/Button";
import Avatar from "@/components/common/Avatar";
import {
  Search,
  Menu,
  X,
  Bell,
  User,
  Settings,
  LogOut,
  Calendar,
  MessageCircle,
  Heart,
  Home,
  HelpCircle,
  Zap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/store/auth.store";

interface HeaderProps {
  isLoggedIn?: boolean;
  className?: string;
}

const Header = ({ isLoggedIn = false, className }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const { isAuthenticated, user, logout } = useAuth();

  console.log("header logssssss", isAuthenticated, user);

  isLoggedIn = isAuthenticated;

  const handleLogout = () => {
    logout();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-buddy-gray-100 py-2.5",
        className
      )}
    >
      <Container size="full" className="flex justify-between items-center">
        <div className="flex items-center">
          {isHomePage ? (
            <Link
              to="/"
              className="text-2xl font-bold text-buddy-gray-900 flex flex-col items-center mr-8"
            >
              <div className="flex items-center">
                <Heart className="h-6 w-6 text-buddy-purple mr-2 fill-buddy-purple" />
                <div className="flex flex-col">
                  <span className="text-sm font-normal text-buddy-gray-700">
                    Where is
                  </span>
                  <span className="text-lg font-bold text-gradient-primary -mt-1">
                    my Buddy?
                  </span>
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
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          )}

          {isHomePage && isLoggedIn && (
            <nav className="hidden md:flex space-x-6">
              <NavLink
                to="/activities"
                label="Activities"
                icon={<Calendar className="w-4 h-4" />}
              />
              <NavLink
                to="/buddies"
                label="Buddies"
                icon={<User className="w-4 h-4" />}
              />
              <NavLink
                to="/messages"
                label="Messages"
                icon={<MessageCircle className="w-4 h-4" />}
              />
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
                      <Avatar size="sm" status="online" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 p-2 rounded-xl border-buddy-gray-200 shadow-lg"
                  >
                    <div className="px-3 py-2 border-b border-buddy-gray-100 mb-2">
                      <p className="font-medium text-buddy-gray-900">
                        {user?.name || "Jordan Lee"}
                      </p>
                      <p className="text-xs text-buddy-gray-500">
                        {user?.email || "jordan@example.com"}
                      </p>
                    </div>
                    <DropdownMenuItem className="flex items-center rounded-lg hover:bg-buddy-purple/10 cursor-pointer">
                      <User className="mr-2 h-4 w-4 text-buddy-gray-500" />
                      <Link
                        to={`/profile/${user?._id || user?.id}`}
                        className="flex-1"
                      >
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center rounded-lg hover:bg-buddy-purple/10 cursor-pointer">
                      <Settings className="mr-2 h-4 w-4 text-buddy-gray-500" />
                      <Link to="/settings" className="flex-1">
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 bg-buddy-gray-100" />
                    <DropdownMenuItem
                      className="flex items-center rounded-lg hover:bg-red-50 text-red-600 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/signin">
                <Button variant="outline" className="rounded-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="rounded-full">Sign Up</Button>
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
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          )}
        </div>
      </Container>

      {/* New Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-buddy-purple">Menu</h2>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-buddy-purple" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="p-4 space-y-2 bg-white border-bl-2xl rounded-br-2xl shadow-lg border-buddy-gray-200">
            {isLoggedIn ? (
              <>
                {/* Navigation items matching AppSidebar */}
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-3 p-3 rounded-lg text-buddy-purple hover:bg-buddy-purple/10 transition-colors"
                  onClick={toggleMenu}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </Link>

                <Link
                  to="/activities"
                  className="flex items-center space-x-3 p-3 rounded-lg text-buddy-purple hover:bg-buddy-purple/10 transition-colors"
                  onClick={toggleMenu}
                >
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Activities</span>
                </Link>

                <Link
                  to="/buddies"
                  className="flex items-center space-x-3 p-3 rounded-lg text-buddy-purple hover:bg-buddy-purple/10 transition-colors"
                  onClick={toggleMenu}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Buddies</span>
                </Link>

                <Link
                  to="/boost-wall"
                  className="flex items-center space-x-3 p-3 rounded-lg text-buddy-purple hover:bg-buddy-purple/10 transition-colors"
                  onClick={toggleMenu}
                >
                  <Zap className="w-5 h-5" />
                  <span className="font-medium">Boost Wall</span>
                </Link>

                <Link
                  to="/notifications"
                  className="flex items-center space-x-3 p-3 rounded-lg text-buddy-purple hover:bg-buddy-purple/10 transition-colors"
                  onClick={toggleMenu}
                >
                  <Bell className="w-5 h-5" />
                  <span className="font-medium">Notifications</span>
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center space-x-3 p-3 rounded-lg text-buddy-purple hover:bg-buddy-purple/10 transition-colors"
                  onClick={toggleMenu}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </Link>

                <Link
                  to="/support"
                  className="flex items-center space-x-3 p-3 rounded-lg text-buddy-purple hover:bg-buddy-purple/10 transition-colors"
                  onClick={toggleMenu}
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="font-medium">Help & Support</span>
                </Link>

                {/* User Profile Section */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <Link
                    to={`/profile/${user?._id || user?.id}`}
                    className="flex items-center space-x-3 p-3 rounded-lg text-buddy-purple hover:bg-buddy-purple/10 transition-colors"
                    onClick={toggleMenu}
                  >
                    <Avatar size="sm" />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user?.name || "Profile"}
                      </span>
                      <span className="text-sm text-gray-500">
                        View Profile
                      </span>
                    </div>
                  </Link>
                </div>

                {/* Logout */}
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <Link
                  to="/signin"
                  className="block w-full"
                  onClick={toggleMenu}
                >
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-buddy-purple text-buddy-purple hover:bg-buddy-purple hover:text-white"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link
                  to="/signup"
                  className="block w-full"
                  onClick={toggleMenu}
                >
                  <Button className="w-full rounded-full bg-buddy-purple text-white hover:bg-buddy-purple-dark">
                    Sign Up
                  </Button>
                </Link>
              </div>
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
