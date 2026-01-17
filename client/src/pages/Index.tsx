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
  Menu,
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
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const features = [
    {
      icon: <Users className="w-8 h-8 text-buddy-purple" />,
      title: "Find Your Perfect Match",
      description:
        "Connect with amazing people who share your passions and will cheer you on every step of the way! 🎯",
    },
    {
      icon: <Calendar className="w-8 h-8 text-buddy-blue" />,
      title: "Stay Consistent Together",
      description:
        "Never miss a workout, study session, or goal again! Your buddy will keep you accountable and motivated. 💪",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-buddy-green" />,
      title: "Join Epic Challenges",
      description:
        "Take on exciting group challenges and watch your progress soar with the power of community! 🚀",
    },
    {
      icon: <Heart className="w-8 h-8 text-rose-500" />,
      title: "Celebrate Every Win",
      description:
        "Track your achievements and celebrate milestones together. Every small victory counts! 🎉",
    },
  ];

  const suggestedBuddies = [
    {
      name: "Emma Wilson",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      interests: ["Fitness", "Reading", "Hiking"],
      activities: 12,
    },
    {
      name: "James Lee",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      interests: ["Coding", "Gaming", "Photography"],
      activities: 8,
    },
    {
      name: "Sarah Parker",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      interests: ["Music", "Art", "Cooking"],
      activities: 15,
    },
    {
      name: "Michael Chen",
      image:
        "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      interests: ["Meditation", "Yoga", "Writing"],
      activities: 10,
    },
  ];

  const activities = [
    {
      title: "30-Day Coding Challenge",
      category: "Coding",
      participants: 24,
      description:
        "Build a project every day for 30 days to improve your coding skills",
      image:
        "https://images.unsplash.com/photo-1486312338219-ce68d2c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&h=896&q=80",
    },
    {
      title: "Morning Yoga Club",
      category: "Fitness",
      participants: 18,
      description:
        "Start your day with 30 minutes of yoga to improve flexibility and mindfulness",
      image:
        "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&h=896&q=80",
    },
    {
      title: "Book Reading Challenge",
      category: "Reading",
      participants: 32,
      description:
        "Read one book per week and discuss with your accountability buddies",
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&h=896&q=80",
    },
  ];

  const heroImages = [
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&h=896&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&h=896&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&h=896&q=80",
    "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&h=896&q=80",
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-transparent"
        }`}
      >
        <Container>
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-buddy-purple to-buddy-blue flex items-center justify-center">
                <HeartHandshake className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-buddy-gray-900">
                Buddy
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <button
                className={`text-buddy-gray-700 hover:text-buddy-purple transition-colors ${scrolled ? "py-2" : "py-1"}`}
                onClick={() => scrollToSection(featuresRef)}
              >
                Features
              </button>
              <button
                className={`text-buddy-gray-700 hover:text-buddy-purple transition-colors ${scrolled ? "py-2" : "py-1"}`}
                onClick={() => scrollToSection(howItWorksRef)}
              >
                How It Works
              </button>
              <button
                className={`text-buddy-gray-700 hover:text-buddy-purple transition-colors ${scrolled ? "py-2" : "py-1"}`}
                onClick={() => scrollToSection(communityRef)}
              >
                Community
              </button>
              <button
                className={`text-buddy-gray-700 hover:text-buddy-purple transition-colors ${scrolled ? "py-2" : "py-1"}`}
                onClick={() => scrollToSection(activitiesRef)}
              >
                Activities
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                to="/signin"
                className="rounded-full text-buddy-gray-700 hover:text-buddy-purple hidden sm:inline px-4 py-2 hover:bg-buddy-purple/10 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-buddy-purple text-white px-6 py-2 hover:bg-buddy-purple-dark transition-colors font-medium"
              >
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
              <pattern
                id="dotPattern"
                patternUnits="userSpaceOnUse"
                width="20"
                height="20"
              >
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
                className="text-4xl md:text-6xl font-bold text-buddy-gray-900 mb-6 leading-tight"
              >
                Achieve Your
                <span className="relative inline-block px-2 mx-1">
                  <span className="relative z-10 text-buddy-gray-900">
                    Goals
                  </span>
                  <span className="absolute inset-0 bg-purple-100 rounded-lg -skew-y-1 transform opacity-80"></span>
                </span>
                with Accountability
                <span className="relative inline-block px-2 mx-1">
                  <span className="relative z-10 text-buddy-gray-900">
                    Buddies
                  </span>
                  <span className="absolute inset-0 bg-blue-100 rounded-lg skew-y-1 transform opacity-80"></span>
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.5 }}
                className="text-buddy-gray-600 text-lg md:text-xl mb-8 max-w-2xl leading-relaxed"
              >
                Stop going it alone! Join thousands of people who are crushing
                their goals with the power of accountability. Find your perfect
                match and turn your dreams into reality together! ✨
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.75 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white hover:shadow-lg transition-all duration-300 hover:scale-105 px-8 py-4 text-lg font-semibold"
                  >
                    Start Your Journey! 🚀
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <button
                  className="rounded-full text-buddy-gray-600 flex items-center space-x-2 group hover:text-buddy-purple transition-colors px-6 py-3 border border-buddy-gray-300 hover:border-buddy-purple"
                  onClick={() => scrollToSection(howItWorksRef)}
                >
                  <span>See How It Works</span>
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

      <section
        ref={featuresRef}
        className="py-16 md:py-24 bg-gradient-to-br from-buddy-purple/5 via-white to-buddy-blue/5 relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-buddy-purple/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-buddy-blue/10 rounded-full blur-3xl"></div>
        </div>

        <Container>
          <div className="text-center mb-16 relative z-10">
            <span className="inline-block bg-gradient-to-r from-buddy-purple to-buddy-blue text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
              Why Choose Buddy?
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-buddy-gray-900">
              Your Success Journey Starts Here! 🌟
            </h2>
            <p className="text-buddy-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              We're not just another app - we're your personal cheerleading
              squad! Our platform is designed to make achieving your goals fun,
              social, and absolutely unstoppable. Here's what makes us special:
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Card
                    className={`p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-transparent hover:border-buddy-purple/20 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden ${
                      index % 2 === 0 ? "ml-0 mr-auto" : "ml-auto mr-0"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-8 ${
                        index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <div className="p-6 bg-gradient-to-br from-buddy-purple/10 to-buddy-blue/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-buddy-gray-900 group-hover:text-buddy-purple transition-colors">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-buddy-gray-600 text-lg leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section
        ref={howItWorksRef}
        className="py-16 md:py-24 bg-gradient-to-br from-white via-buddy-blue/5 to-buddy-green/5 relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-20 w-64 h-64 bg-buddy-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-buddy-green/10 rounded-full blur-3xl"></div>
        </div>

        <Container>
          <div className="text-center mb-16 relative z-10">
            <span className="inline-block bg-gradient-to-r from-buddy-blue to-buddy-green text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-buddy-gray-900">
              Get Started in 3 Super Easy Steps! 🎯
            </h2>
            <p className="text-buddy-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Ready to transform your life? It's easier than you think! Just
              follow these three simple steps and you'll be crushing your goals
              with your new accountability buddy in no time. Let's do this! 💪
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="p-8 h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-transparent hover:border-buddy-blue/20 bg-white/90 backdrop-blur-sm rounded-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-buddy-blue/10 to-transparent rounded-bl-full opacity-70"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-buddy-blue to-buddy-blue-dark mx-auto flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <UserPlus className="w-10 h-10 text-white" />
                  </div>
                  <div className="inline-block bg-buddy-blue text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
                    Step 1
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-buddy-gray-900 group-hover:text-buddy-blue transition-colors">
                    Create Your Profile
                  </h3>
                  <p className="text-buddy-gray-600 text-base leading-relaxed">
                    Tell us about your goals, interests, and the type of
                    accountability partner you're looking for. The more we know,
                    the better we can match you! 🎯
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="p-8 h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-transparent hover:border-buddy-green/20 bg-white/90 backdrop-blur-sm rounded-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 h-32 w-32 bg-gradient-to-br from-buddy-green/10 to-transparent rounded-br-full opacity-70"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-buddy-green to-buddy-green-dark mx-auto flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Compass className="w-10 h-10 text-white" />
                  </div>
                  <div className="inline-block bg-buddy-green text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
                    Step 2
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-buddy-gray-900 group-hover:text-buddy-green transition-colors">
                    Find Your Buddies
                  </h3>
                  <p className="text-buddy-gray-600 text-base leading-relaxed">
                    Browse our amazing community of like-minded individuals and
                    connect with those who share your goals and interests. It's
                    like speed dating, but for accountability! 💫
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="p-8 h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-transparent hover:border-amber-400/20 bg-white/90 backdrop-blur-sm rounded-2xl text-center relative overflow-hidden">
                <div className="absolute bottom-0 right-0 h-32 w-32 bg-gradient-to-tl from-amber-400/10 to-transparent rounded-tl-full opacity-70"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 mx-auto flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <div className="inline-block bg-amber-400 text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
                    Step 3
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-buddy-gray-900 group-hover:text-amber-500 transition-colors">
                    Achieve Your Goals
                  </h3>
                  <p className="text-buddy-gray-600 text-base leading-relaxed">
                    Set goals, create activities, and track your progress
                    together. Stay motivated and celebrate your successes!
                    You've got this! 🚀
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </Container>
      </section>

      <section
        ref={communityRef}
        className="py-16 md:py-24 bg-gradient-to-br from-buddy-purple/5 via-white to-buddy-blue/5 relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-buddy-purple/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-buddy-blue/10 rounded-full blur-3xl"></div>
        </div>

        <Container>
          <div className="text-center mb-16 relative z-10">
            <span className="inline-block bg-gradient-to-r from-buddy-purple to-buddy-blue text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
              Community
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-buddy-gray-900">
              Meet Your Future Accountability Partners! 👥
            </h2>
            <p className="text-buddy-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Our community is full of amazing people who are just as excited
              about their goals as you are! Find your perfect match and start
              building meaningful connections that will change your life. 🌟
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 relative z-10">
            {suggestedBuddies.map((buddy, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="p-6 h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-2 border-transparent hover:border-buddy-purple/20 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="w-28 h-28 mb-6 border-4 border-buddy-purple/20 rounded-full group-hover:border-buddy-purple transition-colors">
                      <AvatarImage
                        src={buddy.image}
                        alt={buddy.name}
                        className="rounded-full"
                      />
                      <AvatarFallback className="rounded-full text-lg font-bold">
                        {buddy.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <h3 className="text-xl font-bold mb-3 text-buddy-gray-900 group-hover:text-buddy-purple transition-colors">
                      {buddy.name}
                    </h3>

                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {buddy.interests.map((interest, i) => (
                        <span
                          key={i}
                          className="bg-gradient-to-r from-buddy-purple/10 to-buddy-blue/10 text-buddy-purple text-xs px-3 py-1 rounded-full font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center text-buddy-gray-600 text-sm mb-6">
                      <Flame className="w-4 h-4 mr-2 text-amber-500" />
                      <span className="font-medium">
                        {buddy.activities} Active Challenges
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full rounded-full mt-auto group-hover:bg-buddy-purple group-hover:text-white group-hover:border-buddy-purple transition-all duration-300 hover:scale-105"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Connect Now!
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center relative z-10">
            <Link to="/buddies">
              <Button className="rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white hover:shadow-lg transition-all duration-300 hover:scale-105 px-8 py-3 text-lg font-semibold">
                View All Buddies
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      <section
        ref={activitiesRef}
        className="py-16 md:py-24 bg-gradient-to-br from-buddy-green/5 via-white to-buddy-blue/5 relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-buddy-green/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-buddy-blue/10 rounded-full blur-3xl"></div>
        </div>

        <Container>
          <div className="text-center mb-16 relative z-10">
            <span className="inline-block bg-gradient-to-r from-buddy-green to-buddy-blue text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
              Activities
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-buddy-gray-900">
              Join Epic Challenges & Activities! 🎯
            </h2>
            <p className="text-buddy-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Ready to level up your life? Join thousands of people in exciting
              challenges that will push you to be your best self. From fitness
              goals to learning new skills - we've got something amazing for
              everyone! 🚀
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative z-10">
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-transparent hover:border-buddy-green/20 bg-white/90 backdrop-blur-sm rounded-2xl">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                      <span className="inline-block bg-gradient-to-r from-buddy-green to-buddy-green-dark px-3 py-1 rounded-full text-xs font-bold mb-3">
                        {activity.category}
                      </span>
                      <h3 className="text-xl font-bold mb-2">
                        {activity.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-buddy-gray-600 mb-4 text-sm leading-relaxed">
                      {activity.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-buddy-gray-500 flex items-center font-medium">
                        <Users className="w-4 h-4 mr-2 text-buddy-blue" />
                        {activity.participants} participants
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full group-hover:bg-buddy-green group-hover:text-white group-hover:border-buddy-green transition-all duration-300 hover:scale-105"
                      >
                        Join Now!
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center relative z-10">
                <Link to="/activities">
              <Button className="rounded-full bg-gradient-to-r from-buddy-green to-buddy-blue text-white hover:shadow-lg transition-all duration-300 hover:scale-105 px-8 py-3 text-lg font-semibold">
                View All Activities
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-buddy-purple/10 via-white to-buddy-blue/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-gradient-to-bl from-buddy-purple/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-gradient-to-tr from-buddy-blue/20 to-transparent rounded-full blur-3xl"></div>

        <Container>
          <div className="text-center max-w-4xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-buddy-gray-900">
              Ready to Transform Your Life? 🚀
            </h2>
            <p className="text-buddy-gray-600 text-lg md:text-xl mb-10 leading-relaxed">
              Don't wait another day! Join thousands of people who are already
              crushing their goals with the power of accountability. Your future
              self will thank you for taking this step today! 💪
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="rounded-full w-full sm:w-auto bg-gradient-to-r from-buddy-purple to-buddy-blue hover:from-buddy-purple-dark hover:to-buddy-blue-dark text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Start Your Journey Now! ✨
                </Button>
              </Link>
              <Link to="/signin">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full w-full sm:w-auto border-2 border-buddy-purple text-buddy-purple hover:bg-buddy-purple hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
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
              <span className="text-xl font-bold text-buddy-gray-900">
                Buddy
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-4 md:mb-0">
              <a
                href="#"
                className="text-buddy-gray-600 hover:text-buddy-purple transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="text-buddy-gray-600 hover:text-buddy-purple transition-colors"
              >
                Features
              </a>
              <a
                href="#"
                className="text-buddy-gray-600 hover:text-buddy-purple transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-buddy-gray-600 hover:text-buddy-purple transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-buddy-gray-600 hover:text-buddy-purple transition-colors"
              >
                Contact
              </a>
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
