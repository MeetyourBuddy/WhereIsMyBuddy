import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Container from "@/components/ui/layout/Container";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/common/Card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Users,
  Calendar,
  TrendingUp,
  ArrowRight,
  Check,
  Heart,
  Activity,
  Shield,
  Star,
  Zap,
  Compass,
  Smile,
  HeartHandshake,
  Sparkles,
  Link as LinkIcon,
  UserPlus,
  Flame,
  ChevronDown,
  Menu
} from "lucide-react";

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const activitiesRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const features = [
    {
      icon: <Users className="w-8 h-8 text-buddy-purple" />,
      title: "Find Accountability Partners",
      description: "Connect with like-minded individuals who share your goals and interests."
    },
    {
      icon: <Calendar className="w-8 h-8 text-buddy-blue" />,
      title: "Track Your Progress",
      description: "Set goals, create activities, and monitor your progress over time."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-buddy-green" />,
      title: "Achieve Your Goals",
      description: "Stay motivated and consistent with support from your buddies."
    },
    {
      icon: <Heart className="w-8 h-8 text-rose-500" />,
      title: "Build Lasting Habits",
      description: "Transform temporary actions into permanent, positive life changes."
    }
  ];

  const suggestedBuddies = [
    {
      name: "Emma Wilson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      interests: ["Fitness", "Reading", "Hiking"],
      activities: 12
    },
    {
      name: "James Lee",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      interests: ["Coding", "Gaming", "Photography"],
      activities: 8
    },
    {
      name: "Sarah Parker",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      interests: ["Music", "Art", "Cooking"],
      activities: 15
    },
    {
      name: "Michael Chen",
      image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      interests: ["Meditation", "Yoga", "Writing"],
      activities: 10
    }
  ];

  const activities = [
    {
      title: "30-Day Coding Challenge",
      category: "Coding",
      participants: 24,
      description: "Build a project every day for 30 days to improve your coding skills",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&h=896&q=80"
    },
    {
      title: "Morning Yoga Club",
      category: "Fitness",
      participants: 18,
      description: "Start your day with 30 minutes of yoga to improve flexibility and mindfulness",
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&h=896&q=80"
    },
    {
      title: "Book Reading Challenge",
      category: "Reading",
      participants: 32,
      description: "Read one book per week and discuss with your accountability buddies",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&h=896&q=80"
    }
  ];

  const heroImages = [
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&h=896&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&h=896&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&h=896&q=80",
    "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&h=896&q=80"
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <header 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/90 backdrop-blur-md shadow-md" 
            : "bg-transparent"
        }`}
      >
        <Container>
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-buddy-purple to-buddy-blue flex items-center justify-center">
                <HeartHandshake className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-buddy-gray-900">Buddy</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                className={`text-buddy-gray-700 hover:text-buddy-purple transition-colors ${scrolled ? 'py-2' : 'py-1'}`}
                onClick={() => scrollToSection(featuresRef)}
              >
                Features
              </button>
              <button 
                className={`text-buddy-gray-700 hover:text-buddy-purple transition-colors ${scrolled ? 'py-2' : 'py-1'}`}
                onClick={() => scrollToSection(howItWorksRef)}
              >
                How It Works
              </button>
              <button 
                className={`text-buddy-gray-700 hover:text-buddy-purple transition-colors ${scrolled ? 'py-2' : 'py-1'}`}
                onClick={() => scrollToSection(communityRef)}
              >
                Community
              </button>
              <button 
                className={`text-buddy-gray-700 hover:text-buddy-purple transition-colors ${scrolled ? 'py-2' : 'py-1'}`}
                onClick={() => scrollToSection(activitiesRef)}
              >
                Activities
              </button>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link to="/signin" className="text-buddy-gray-700 hover:text-buddy-purple hidden sm:inline">
                Sign In
              </Link>
              <Link to="/signup" className="bg-buddy-purple text-white px-4 py-2 rounded-full hover:bg-buddy-purple-dark transition-colors">
                Get Started
              </Link>
              
              <button 
                className="md:hidden text-buddy-gray-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 bg-white border-t border-buddy-gray-100 animate-fade-in">
              <div className="flex flex-col space-y-3">
                <button 
                  className="py-2 px-4 text-left hover:bg-buddy-purple-50 rounded-md transition-colors"
                  onClick={() => scrollToSection(featuresRef)}
                >
                  Features
                </button>
                <button 
                  className="py-2 px-4 text-left hover:bg-buddy-purple-50 rounded-md transition-colors"
                  onClick={() => scrollToSection(howItWorksRef)}
                >
                  How It Works
                </button>
                <button 
                  className="py-2 px-4 text-left hover:bg-buddy-purple-50 rounded-md transition-colors"
                  onClick={() => scrollToSection(communityRef)}
                >
                  Community
                </button>
                <button 
                  className="py-2 px-4 text-left hover:bg-buddy-purple-50 rounded-md transition-colors"
                  onClick={() => scrollToSection(activitiesRef)}
                >
                  Activities
                </button>
              </div>
            </div>
          )}
        </Container>
      </header>

      <section className="pt-28 pb-16 md:py-28 bg-gradient-to-br from-pink-50 via-indigo-50 to-blue-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 800 800">
            <defs>
              <pattern id="dotPattern" patternUnits="userSpaceOnUse" width="20" height="20">
                <circle cx="10" cy="10" r="1" fill="#8B5CF6" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotPattern)" />
          </svg>
        </div>
        
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 relative z-10">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.25 }}
                className="text-4xl md:text-5xl font-bold text-buddy-gray-900 mb-6 leading-tight"
              >
                Achieve Your 
                <span className="relative inline-block px-1 mx-1">
                  <span className="relative z-10 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Goals</span>
                  <span className="absolute inset-0 bg-purple-100 rounded-lg -skew-y-2 transform"></span>
                </span> 
                with Accountability 
                <span className="relative inline-block px-1 mx-1">
                  <span className="relative z-10 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Buddies</span>
                  <span className="absolute inset-0 bg-blue-100 rounded-lg skew-y-1 transform"></span>
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.5 }}
                className="text-buddy-gray-600 text-lg mb-8 max-w-xl"
              >
                Connect with like-minded individuals, track your progress, and stay motivated on your journey to success.
                Whether it's fitness, coding, reading, or any other goal, we've got you covered.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.75 }}
                className="flex items-center space-x-4"
              >
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white hover:shadow-lg transition-all">
                    Get Started for Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <button 
                  className="text-buddy-gray-600 flex items-center space-x-2 group"
                  onClick={() => scrollToSection(howItWorksRef)}
                >
                  <span>Learn More</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
                </button>
              </motion.div>
            </div>

            <div className="order-1 md:order-2 relative">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.75, delay: 0.25 }}
                className="relative z-10"
              >
                <Carousel className="w-full max-w-md mx-auto">
                  <CarouselContent>
                    {heroImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="overflow-hidden rounded-2xl shadow-lg p-1 bg-white">
                          <img 
                            src={image} 
                            alt={`Team Collaboration ${index + 1}`} 
                            className="w-full h-64 object-cover rounded-xl"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0" />
                  <CarouselNext className="right-0" />
                </Carousel>
                
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-2xl"></div>
                <div className="absolute -top-8 -left-8 w-40 h-40 bg-gradient-to-br from-blue-300/20 to-green-300/20 rounded-full blur-xl"></div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      <section ref={featuresRef} className="py-16 md:py-24 bg-gradient-to-br from-white via-blue-50/30 to-white">
        <Container>
          <div className="text-center mb-12 relative z-10">
            <span className="inline-block bg-buddy-purple-100 text-buddy-purple px-4 py-1 rounded-full text-sm font-medium mb-4">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-buddy-gray-900">
              Why Choose Buddy?
            </h2>
            <p className="text-buddy-gray-600 max-w-2xl mx-auto">
              Buddy is designed to help you achieve your goals by providing the tools and support you need to succeed.
              Here are some of the key features that make Buddy the perfect accountability partner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full hover:shadow-md transition-shadow duration-200 border border-buddy-gray-200 bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden group">
                  <div className="mb-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 to-blue-100/40 rounded-full scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-buddy-gray-900">{feature.title}</h3>
                  <p className="text-buddy-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section ref={howItWorksRef} className="py-16 md:py-24 bg-gradient-to-tr from-amber-50 via-white to-green-50 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzUxRTkiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0aDN2M2gtM3Ztf00zMCAzaDN2M2gtM3pNMTcgMTdoM3YzaC0zek0zNiAxN2gzdjNoLTN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
        
        <Container>
          <div className="text-center mb-12 relative z-10">
            <span className="inline-block bg-buddy-blue-100 text-buddy-blue px-4 py-1 rounded-full text-sm font-medium mb-4">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-buddy-gray-900">
              Get Started in 3 Easy Steps
            </h2>
            <p className="text-buddy-gray-600 max-w-2xl mx-auto">
              It's easy to get started with Buddy. Just follow these three simple steps to find your accountability partner and start achieving your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full hover:shadow-md transition-shadow duration-200 border border-buddy-gray-200 bg-white/90 backdrop-blur-sm rounded-xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full opacity-70"></div>
                <div className="w-16 h-16 rounded-full bg-buddy-blue-100 mx-auto flex items-center justify-center mb-4 relative z-10">
                  <UserPlus className="w-8 h-8 text-buddy-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-buddy-gray-900">Create Your Profile</h3>
                <p className="text-buddy-gray-600">
                  Tell us about your goals, interests, and the type of accountability partner you're looking for.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full hover:shadow-md transition-shadow duration-200 border border-buddy-gray-200 bg-white/90 backdrop-blur-sm rounded-xl text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 h-24 w-24 bg-gradient-to-br from-green-100 to-transparent rounded-br-full opacity-70"></div>
                <div className="w-16 h-16 rounded-full bg-buddy-green-100 mx-auto flex items-center justify-center mb-4 relative z-10">
                  <Compass className="w-8 h-8 text-buddy-green" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-buddy-gray-900">Find Your Buddies</h3>
                <p className="text-buddy-gray-600">
                  Browse our community of like-minded individuals and connect with those who share your goals and interests.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full hover:shadow-md transition-shadow duration-200 border border-buddy-gray-200 bg-white/90 backdrop-blur-sm rounded-xl text-center relative overflow-hidden">
                <div className="absolute bottom-0 right-0 h-24 w-24 bg-gradient-to-tl from-amber-100 to-transparent rounded-tl-full opacity-70"></div>
                <div className="w-16 h-16 rounded-full bg-amber-100 mx-auto flex items-center justify-center mb-4 relative z-10">
                  <Sparkles className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-buddy-gray-900">Achieve Your Goals</h3>
                <p className="text-buddy-gray-600">
                  Set goals, create activities, and track your progress together. Stay motivated and celebrate your successes!
                </p>
              </Card>
            </motion.div>
          </div>
        </Container>
      </section>

      <section ref={communityRef} className="py-16 md:py-24 bg-gradient-to-br from-white via-purple-50/30 to-white relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzUxRTkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTIwIDM1YzguMjg0IDAgMTUtNi43MTYgMTUtMTUtOC04LjI4NC02LjcxNi0xNS0xNS0xNS04LjI4NCAwLTE1IDYuNzE2LTE1IDE1IDAgOC4yODQgNi43MTYgMTUgMTUgMTV6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-75"></div>

        <Container>
          <div className="text-center mb-12 relative z-10">
            <span className="inline-block bg-buddy-purple-100 text-buddy-purple px-4 py-1 rounded-full text-sm font-medium mb-4">Community</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-buddy-gray-900">
              Connect with Like-minded People
            </h2>
            <p className="text-buddy-gray-600 max-w-2xl mx-auto">
              Find and connect with accountability partners who share your interests and goals.
              Support each other on your journeys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10">
            {suggestedBuddies.map((buddy, index) => (
              <motion.div 
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="p-6 h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-buddy-gray-200 bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="w-24 h-24 mb-4 border-4 border-buddy-purple-100 rounded-full">
                      <AvatarImage src={buddy.image} alt={buddy.name} className="rounded-full" />
                      <AvatarFallback className="rounded-full">{buddy.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <h3 className="text-lg font-semibold mb-2 text-buddy-gray-900">{buddy.name}</h3>
                    
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {buddy.interests.map((interest, i) => (
                        <span key={i} className="bg-buddy-purple-50 text-buddy-purple text-xs px-2 py-1 rounded-full">
                          {interest}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center text-buddy-gray-600 text-sm mb-4">
                      <Flame className="w-4 h-4 mr-1 text-amber-500" />
                      <span>{buddy.activities} Active Challenges</span>
                    </div>
                    
                    <Button size="sm" variant="outline" className="w-full mt-auto group-hover:bg-buddy-purple group-hover:text-white transition-all duration-200">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center relative z-10">
            <Link to="/buddies" className="inline-flex items-center text-buddy-purple hover:text-buddy-purple-dark font-medium">
              View All Buddies
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </Container>
      </section>

      <section ref={activitiesRef} className="py-16 md:py-24 bg-gradient-to-tl from-green-50 via-teal-50/30 to-blue-50/50 relative">
        <div className="absolute inset-0 opacity-30 overflow-hidden">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(41, 143, 120, 0.1)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallGrid)" />
          </svg>
        </div>
      
        <Container>
          <div className="text-center mb-12 relative z-10">
            <span className="inline-block bg-buddy-green-100 text-buddy-green px-4 py-1 rounded-full text-sm font-medium mb-4">Activities</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-buddy-gray-900">
              Discover Popular Activities
            </h2>
            <p className="text-buddy-gray-600 max-w-2xl mx-auto">
              Join existing activities or create your own. Find the perfect accountability 
              challenge to help you reach your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative z-10">
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-200 border-0">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={activity.image} 
                      alt={activity.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <span className="inline-block bg-buddy-green/90 px-2 py-1 rounded text-xs mb-2">
                        {activity.category}
                      </span>
                      <h3 className="text-lg font-bold mb-1">{activity.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-buddy-gray-600 mb-3">{activity.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-buddy-gray-500 flex items-center">
                        <Users className="w-4 h-4 mr-1 text-buddy-blue" />
                        {activity.participants} participants
                      </span>
                      <Button size="sm" variant="outline" className="group-hover:bg-buddy-green group-hover:text-white transition-all duration-200">
                        Join Activity
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/activities" className="inline-flex items-center text-buddy-green hover:text-buddy-green-dark font-medium">
              Explore All Activities
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-buddy-purple-50 to-buddy-blue-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-gradient-to-bl from-buddy-purple/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-gradient-to-tr from-buddy-blue/10 to-transparent rounded-full blur-3xl"></div>
        
        <Container>
          <div className="text-center max-w-3xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-buddy-gray-900">
              Ready to Achieve Your Goals?
            </h2>
            <p className="text-buddy-gray-600 text-lg mb-8">
              Join Buddy today and connect with accountability partners who will help you stay on track and achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-buddy-purple to-buddy-blue hover:from-buddy-purple-dark hover:to-buddy-blue-dark text-white">
                  Get Started For Free
                </Button>
              </Link>
              <Link to="/signin">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <footer className="py-12 bg-white border-t border-buddy-gray-100">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-buddy-purple to-buddy-blue flex items-center justify-center">
                <HeartHandshake className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-buddy-gray-900">Buddy</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-4 md:mb-0">
              <a href="#" className="text-buddy-gray-600 hover:text-buddy-purple transition-colors">About</a>
              <a href="#" className="text-buddy-gray-600 hover:text-buddy-purple transition-colors">Features</a>
              <a href="#" className="text-buddy-gray-600 hover:text-buddy-purple transition-colors">Privacy</a>
              <a href="#" className="text-buddy-gray-600 hover:text-buddy-purple transition-colors">Terms</a>
              <a href="#" className="text-buddy-gray-600 hover:text-buddy-purple transition-colors">Contact</a>
            </div>
            
            <div className="text-buddy-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Buddy. All rights reserved.
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Index;
