
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Search,
  File,
  MessageSquare,
  PhoneCall,
  Mail,
  BookOpen,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  X
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Container from "@/components/ui/layout/Container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from '@/hooks/use-toast';

const Support: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const popularTopics = [
    {
      icon: <File className="h-5 w-5 text-buddy-purple" />,
      title: "Getting Started Guide",
      description: "Learn the basics of Buddy and how to find your first accountability partner."
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-buddy-blue" />,
      title: "Connecting with Buddies",
      description: "How to find, connect with, and message potential accountability partners."
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-buddy-green" />,
      title: "Creating Activities",
      description: "Learn how to create, join, and track activities with your buddies."
    },
  ];

  const faqs = [
    {
      question: "What is Buddy?",
      answer: "Buddy is a platform that helps you achieve your goals by connecting you with accountability partners who share your interests. Whether you're looking to build a new habit, learn a new skill, or complete a project, having a buddy can significantly increase your chances of success."
    },
    {
      question: "How do I find an accountability partner?",
      answer: "You can find accountability partners by browsing through our community of users who share similar interests and goals. Use the search filters to narrow down potential matches, and then send them a buddy request. You can also create an activity and invite others to join you."
    },
    {
      question: "Is Buddy free to use?",
      answer: "Buddy offers both free and premium plans. The free plan allows you to connect with up to 5 buddies and create up to 3 active activities. The premium plan offers unlimited buddies, activities, and advanced features like detailed analytics and priority support."
    },
    {
      question: "How do I track my progress?",
      answer: "Buddy provides various tools to track your progress. You can set goals, create milestones, log daily activities, and view analytics that show your progress over time. Your buddies can also see your progress, which helps keep you accountable."
    },
    {
      question: "Can I use Buddy on my mobile device?",
      answer: "Yes, Buddy is fully responsive and works on desktop, tablet, and mobile devices. We also have native mobile apps for iOS and Android, which you can download from the App Store or Google Play Store."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription at any time by going to Settings > Subscription > Cancel Subscription. If you cancel, you'll still have access to premium features until the end of your current billing cycle."
    },
  ];

  const handleSubmitContactForm = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log("Contact form submitted:", contactForm);
    
    toast({
      title: "Message sent",
      description: "We've received your message and will respond soon!",
    });
    
    // Reset form
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    setShowContactForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen pb-12 bg-gradient-to-br from-white via-blue-50/20 to-green-50/20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-buddy-gray-900 mb-4">
              Help & Support
            </h1>
            <p className="text-buddy-gray-600 max-w-2xl mx-auto">
              Find answers to common questions, browse helpful resources, or contact our support team.
            </p>
            <div className="max-w-md mx-auto mt-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-buddy-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search for answers..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Popular Topics */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-buddy-gray-900 mb-6">Popular Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularTopics.map((topic, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                    <Card.Content className="p-6">
                      <div className="mb-4">
                        <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full inline-block">
                          {topic.icon}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-buddy-purple transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-buddy-gray-600 mb-4">
                        {topic.description}
                      </p>
                      <div className="flex items-center text-buddy-purple font-medium group-hover:translate-x-1 transition-transform">
                        Read More <ChevronRight className="ml-1 h-4 w-4" />
                      </div>
                    </Card.Content>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-buddy-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="bg-white rounded-xl shadow-sm border border-buddy-gray-200 p-6">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-buddy-gray-200">
                    <AccordionTrigger className="text-left font-medium hover:text-buddy-purple">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-buddy-gray-600 pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-buddy-gray-900 mb-6">Contact Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                <Card.Content className="p-6 text-center">
                  <div className="bg-pastel-purple rounded-full p-4 inline-flex mb-4">
                    <MessageSquare className="h-6 w-6 text-buddy-purple" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Chat Support</h3>
                  <p className="text-buddy-gray-600 mb-4">
                    Chat with our support team for quick assistance.
                  </p>
                  <Button className="bg-buddy-purple text-white w-full">
                    Start Chat
                  </Button>
                </Card.Content>
              </Card>

              <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                <Card.Content className="p-6 text-center">
                  <div className="bg-pastel-blue rounded-full p-4 inline-flex mb-4">
                    <Mail className="h-6 w-6 text-buddy-blue" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                  <p className="text-buddy-gray-600 mb-4">
                    Send us an email and we'll get back to you.
                  </p>
                  <Button 
                    className="bg-buddy-blue text-white w-full"
                    onClick={() => setShowContactForm(!showContactForm)}
                  >
                    Send Email
                  </Button>
                </Card.Content>
              </Card>

              <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                <Card.Content className="p-6 text-center">
                  <div className="bg-pastel-green rounded-full p-4 inline-flex mb-4">
                    <BookOpen className="h-6 w-6 text-buddy-green" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Knowledge Base</h3>
                  <p className="text-buddy-gray-600 mb-4">
                    Browse our detailed documentation and tutorials.
                  </p>
                  <Button className="bg-buddy-green text-white w-full">
                    View Resources
                  </Button>
                </Card.Content>
              </Card>
            </div>
          </div>

          {/* Contact Form (conditionally rendered) */}
          {showContactForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <Card>
                <Card.Header className="flex flex-row items-center justify-between">
                  <div>
                    <Card.Title>Contact Support Team</Card.Title>
                    <Card.Description>Fill out the form below and we'll respond as soon as possible</Card.Description>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full h-8 w-8 p-0" 
                    onClick={() => setShowContactForm(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Card.Header>
                <Card.Content>
                  <form onSubmit={handleSubmitContactForm} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={contactForm.name} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={contactForm.email} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                      <Input 
                        id="subject" 
                        name="subject" 
                        value={contactForm.subject} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">Message</label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        rows={5} 
                        value={contactForm.message} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowContactForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-buddy-purple text-white">
                        Send Message
                      </Button>
                    </div>
                  </form>
                </Card.Content>
              </Card>
            </motion.div>
          )}

          {/* Community Support */}
          <div>
            <h2 className="text-2xl font-bold text-buddy-gray-900 mb-6">Community Support</h2>
            <div className="bg-gradient-to-br from-buddy-purple-50 to-buddy-blue-50 rounded-xl p-6 md:p-8 border border-buddy-purple-100">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
                  <h3 className="text-xl font-bold mb-3 text-buddy-gray-900">Join our Community</h3>
                  <p className="text-buddy-gray-700 mb-4">
                    Connect with other Buddy users, share tips, ask questions, and help others on their journey. Our community is a great place to find information and get support.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="bg-white rounded-full p-1 mr-3">
                        <CheckCircle className="h-4 w-4 text-buddy-green" />
                      </div>
                      <span className="text-buddy-gray-700">24/7 community support</span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-white rounded-full p-1 mr-3">
                        <CheckCircle className="h-4 w-4 text-buddy-green" />
                      </div>
                      <span className="text-buddy-gray-700">Share your achievements and challenges</span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-white rounded-full p-1 mr-3">
                        <CheckCircle className="h-4 w-4 text-buddy-green" />
                      </div>
                      <span className="text-buddy-gray-700">Learn from experienced users</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button className="bg-white text-buddy-purple hover:bg-buddy-purple hover:text-white transition-colors border border-buddy-purple">
                      Join Community <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <div className="bg-white p-4 rounded-full shadow-lg">
                    <div className="bg-gradient-to-br from-buddy-purple to-buddy-blue rounded-full p-6">
                      <MessageSquare className="h-12 w-12 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default Support;
