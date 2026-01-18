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
  X,
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
import { toast } from "@/hooks/use-toast";
import { useScrollToTopImmediate } from "@/hooks/use-scroll-to-top";

const Support: React.FC = () => {
  useScrollToTopImmediate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const popularTopics = [
    {
      icon: <File className="h-5 w-5 text-buddy-purple" />,
      title: "Getting Started Guide",
      description:
        "New to Buddy? No worries! We'll walk you through everything step-by-step and help you find your first amazing accountability partner.",
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-buddy-blue" />,
      title: "Making New Friends",
      description:
        "Discover how to connect with awesome people who share your interests. It's easier than you think, and we'll show you how!",
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-buddy-green" />,
      title: "Creating Fun Activities",
      description:
        "Learn how to create exciting activities, invite friends to join, and track your progress together. Let's make achieving goals fun!",
    },
  ];

  const faqs = [
    {
      question: "What exactly is Buddy?",
      answer:
        "Think of Buddy as your personal cheerleader squad! We're a platform that connects you with amazing people who share your interests and goals. Whether you want to learn guitar, get fit, or finally finish that novel, having a buddy by your side makes everything more fun and achievable. It's like having a workout partner, but for all your life goals!",
    },
    {
      question: "How do I find my perfect buddy?",
      answer:
        "Great question! Start by browsing our friendly community - you'll find people who are just as excited about your interests as you are. Use our smart filters to find someone who matches your vibe, then send them a friendly buddy request. You can also create an activity and invite others to join the fun. It's like making friends, but with a purpose.",
    },
    {
      question: "Is Buddy really free?",
      answer:
        "Yes! Our free plan is pretty awesome - you can connect with up to 5 buddies and create 3 activities. But if you want to go all-in (unlimited buddies, activities, and cool analytics), our premium plan has got you covered. Think of it as upgrading from a great experience to an absolutely amazing one.",
    },
    {
      question: "How can I see my progress?",
      answer:
        "We've got you covered! You can set goals, create milestones, and log your daily wins. Our analytics show you just how awesome you're doing over time. Plus, your buddies can see your progress too - it's like having a whole team cheering you on! The best part? You'll be amazed at how much you've accomplished.",
    },
    {
      question: "Can I use Buddy on my phone?",
      answer:
        "Absolutely! Buddy works perfectly on your phone, tablet, or computer. We also have super smooth mobile apps for iOS and Android that you can download from the App Store or Google Play. Take your goals with you wherever you go.",
    },
    {
      question: "What if I need to cancel my subscription?",
      answer:
        "No worries at all! You can cancel anytime by going to Settings > Subscription > Cancel Subscription. We'll be sad to see you go, but you'll still have access to all premium features until the end of your billing cycle. And remember, you can always come back - we'll be here cheering you on.",
    },
    {
      question: "What if I'm shy about connecting with people?",
      answer:
        "We totally get it! Starting conversations can feel scary. That's why we've made it super easy and low-pressure. You can start with simple activities, send friendly messages, and take things at your own pace. Remember, everyone on Buddy is here to support each other - you're not alone in this.",
    },
    {
      question: "How do I know if someone is a good match?",
      answer:
        "Trust your gut! Look for people who share your interests, have similar goals, and seem genuinely excited about the same things you are. Check out their profiles, see what activities they're into, and don't be afraid to start with a simple 'Hey, I see we both love hiking!' The best connections often start with shared passions.",
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
      message: "",
    });
    setShowContactForm(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
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
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-buddy-purple to-buddy-blue rounded-full mb-4">
                <HelpCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-buddy-gray-900 mb-4">
              We're Here to Help! 🤝
            </h1>
            <p className="text-buddy-gray-600 max-w-2xl mx-auto text-lg">
              Don't worry, we've got your back! Find answers to your questions,
              discover helpful tips, or reach out to our friendly support team.
              We're all about making your Buddy journey amazing!
            </p>
            <div className="max-w-md mx-auto mt-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-buddy-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="What can we help you with today?"
                className="pl-10 rounded-full border-2 border-buddy-purple/20 focus:border-buddy-purple transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Popular Topics */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-buddy-gray-900 mb-3">
                Popular Topics
              </h2>
              <p className="text-buddy-gray-600">Start your journey here!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularTopics.map((topic, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-buddy-purple/20">
                    <Card.Content className="p-6">
                      <div className="mb-4">
                        <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full inline-block group-hover:scale-110 transition-transform duration-300">
                          {topic.icon}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-3 group-hover:text-buddy-purple transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-buddy-gray-600 mb-4 text-sm leading-relaxed">
                        {topic.description}
                      </p>
                      <div className="flex items-center text-buddy-purple font-medium group-hover:translate-x-1 transition-transform cursor-pointer">
                        Let's get started!{" "}
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </div>
                    </Card.Content>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-buddy-gray-900 mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-buddy-gray-600">
                Got questions? We've got answers!
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-buddy-gray-200 p-6">
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-buddy-gray-200 rounded-lg hover:bg-buddy-purple/5 transition-colors"
                  >
                    <AccordionTrigger className="text-left text-sm font-medium hover:text-buddy-purple hover:no-underline py-4 px-3 rounded-lg">
                      <span className="text-base">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-buddy-gray-600 pt-2 px-3 pb-4 text-sm leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-buddy-gray-900 mb-3">
                Need More Help?
              </h2>
              <p className="text-buddy-gray-600">
                We're here for you! Choose how you'd like to connect with us.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-buddy-purple/20">
                <Card.Content className="p-6 text-center">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-full p-4 inline-flex mb-4 group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="h-6 w-6 text-buddy-purple" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                  <p className="text-buddy-gray-600 mb-4 text-sm">
                    Get instant help from our friendly support team. We're
                    online and ready to chat!
                  </p>
                  <Button className="rounded-full bg-buddy-purple text-white w-full hover:bg-buddy-purple/90 transition-colors">
                    Start Chatting!
                  </Button>
                </Card.Content>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-buddy-blue/20">
                <Card.Content className="p-6 text-center">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full p-4 inline-flex mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-6 w-6 text-buddy-blue" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Send Us a Message
                  </h3>
                  <p className="text-buddy-gray-600 mb-4 text-sm">
                    Prefer email? No problem! We'll get back to you within 24
                    hours.
                  </p>
                  <Button
                    className="rounded-full bg-buddy-blue text-white w-full hover:bg-buddy-blue/90 transition-colors"
                    onClick={() => setShowContactForm(!showContactForm)}
                  >
                    Write to Us!
                  </Button>
                </Card.Content>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-buddy-green/20">
                <Card.Content className="p-6 text-center">
                  <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-full p-4 inline-flex mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-6 w-6 text-buddy-green" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Help Center</h3>
                  <p className="text-buddy-gray-600 mb-4 text-sm">
                    Browse our helpful guides, tutorials, and step-by-step
                    instructions.
                  </p>
                  <Button className="rounded-full bg-buddy-green text-white w-full hover:bg-buddy-green/90 transition-colors">
                    Explore Guides!
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
              <Card className="border-2 border-buddy-blue/20">
                <Card.Header className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
                  <div>
                    <Card.Title className="text-xl">Let's Chat</Card.Title>
                    <Card.Description className="text-buddy-gray-600">
                      We'd love to hear from you! Fill out the form below and
                      we'll get back to you super soon!
                    </Card.Description>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full h-8 w-8 p-0 hover:bg-buddy-blue/10"
                    onClick={() => setShowContactForm(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Card.Header>
                <Card.Content>
                  <form
                    onSubmit={handleSubmitContactForm}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium text-buddy-gray-700"
                        >
                          Your Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="What should we call you?"
                          value={contactForm.name}
                          onChange={handleInputChange}
                          required
                          className="border-buddy-purple/20 focus:border-buddy-purple"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-buddy-gray-700"
                        >
                          Your Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={contactForm.email}
                          onChange={handleInputChange}
                          required
                          className="border-buddy-purple/20 focus:border-buddy-purple"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="text-sm font-medium text-buddy-gray-700"
                      >
                        What's this about?
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Brief description of your question or issue"
                        value={contactForm.subject}
                        onChange={handleInputChange}
                        required
                        className="border-buddy-purple/20 focus:border-buddy-purple"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="text-sm font-medium text-buddy-gray-700"
                      >
                        Tell us more
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Share the details with us - we're here to help!"
                        value={contactForm.message}
                        onChange={handleInputChange}
                        required
                        className="border-buddy-purple/20 focus:border-buddy-purple"
                      />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowContactForm(false)}
                        className="border-buddy-gray-300 hover:bg-buddy-gray-50 rounded-full"
                      >
                        Maybe Later
                      </Button>
                      <Button
                        type="submit"
                        className="bg-buddy-purple text-white hover:bg-buddy-purple/90 transition-colors rounded-full"
                      >
                        Send Message!
                      </Button>
                    </div>
                  </form>
                </Card.Content>
              </Card>
            </motion.div>
          )}

          {/* Community Support */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-buddy-gray-900 mb-3">
                Join Our Amazing Community
              </h2>
              <p className="text-buddy-gray-600">
                Connect with awesome people who are just as excited about their
                goals as you are!
              </p>
            </div>
            <div className="bg-gradient-to-br from-buddy-purple-50 to-buddy-blue-50 rounded-xl p-6 md:p-8 border border-buddy-purple-100">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
                  <h3 className="text-xl font-bold mb-3 text-buddy-gray-900">
                    You're Not Alone
                  </h3>
                  <p className="text-buddy-gray-700 mb-4 text-sm leading-relaxed">
                    Our community is full of amazing people who are cheering
                    each other on! Share your wins, ask for help when you need
                    it, and celebrate others' successes. Together, we're
                    unstoppable!
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="bg-white rounded-full p-1 mr-3">
                        <CheckCircle className="h-4 w-4 text-buddy-green" />
                      </div>
                      <span className="text-buddy-gray-700 text-sm">
                        24/7 community support from awesome people
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-white rounded-full p-1 mr-3">
                        <CheckCircle className="h-4 w-4 text-buddy-green" />
                      </div>
                      <span className="text-buddy-gray-700 text-sm">
                        Share your wins and get cheered on!
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-white rounded-full p-1 mr-3">
                        <CheckCircle className="h-4 w-4 text-buddy-green" />
                      </div>
                      <span className="text-buddy-gray-700 text-sm">
                        Learn from people who've been where you are
                      </span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button className="rounded-full bg-white text-buddy-purple hover:bg-buddy-purple hover:text-white transition-all duration-300 border border-buddy-purple hover:scale-105">
                      Join the Fun! <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <div className="bg-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300">
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
