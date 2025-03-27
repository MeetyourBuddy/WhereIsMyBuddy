
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, User, Target, Calendar, ArrowUpRight, ChevronRight, Clock } from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/layout/Container";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Analytics: React.FC = () => {
  // Activity completion data
  const activityData = [
    { name: "Mon", progress: 65 },
    { name: "Tue", progress: 80 },
    { name: "Wed", progress: 75 },
    { name: "Thu", progress: 90 },
    { name: "Fri", progress: 78 },
    { name: "Sat", progress: 82 },
    { name: "Sun", progress: 91 },
  ];

  // Goal progress data
  const goalData = [
    { name: "Coding", completed: 42, total: 50 },
    { name: "Reading", completed: 28, total: 50 },
    { name: "Exercise", completed: 18, total: 30 },
    { name: "Meditation", completed: 12, total: 20 },
  ];

  // Buddy engagement data
  const buddyData = [
    { name: "Week 1", active: 3, inactive: 1 },
    { name: "Week 2", active: 4, inactive: 1 },
    { name: "Week 3", active: 6, inactive: 2 },
    { name: "Week 4", active: 8, inactive: 1 },
  ];

  // Category distribution
  const categoryData = [
    { name: "Fitness", value: 35 },
    { name: "Coding", value: 25 },
    { name: "Reading", value: 20 },
    { name: "Art", value: 15 },
    { name: "Other", value: 5 },
  ];

  const colors = ["#6E56CF", "#4F94FC", "#4CC38A", "#FF8A65", "#9AA1B2"];

  // Stats data
  const statsData = [
    { 
      title: "Total Activities", 
      value: "24", 
      change: "+12%", 
      icon: <Calendar className="w-5 h-5 text-buddy-purple" />,
      color: "from-purple-100 to-violet-200" 
    },
    { 
      title: "Completion Rate", 
      value: "86%", 
      change: "+4%", 
      icon: <Target className="w-5 h-5 text-buddy-blue" />,
      color: "from-blue-100 to-sky-200" 
    },
    { 
      title: "Active Buddies", 
      value: "8", 
      change: "+2", 
      icon: <User className="w-5 h-5 text-buddy-green" />,
      color: "from-green-100 to-emerald-200" 
    },
    { 
      title: "Streak Days", 
      value: "14", 
      change: "+2", 
      icon: <TrendingUp className="w-5 h-5 text-buddy-orange" />,
      color: "from-orange-100 to-amber-200" 
    },
  ];

  // Recent activities
  const recentActivities = [
    { 
      name: "Morning Yoga Challenge", 
      progress: 75, 
      time: "Today, 8:30 AM",
      category: "Fitness" 
    },
    { 
      name: "Book Reading Club", 
      progress: 60, 
      time: "Yesterday, 7:15 PM",
      category: "Reading" 
    },
    { 
      name: "Coding Project", 
      progress: 90, 
      time: "Yesterday, 3:45 PM",
      category: "Coding" 
    },
  ];

  return (
    <div className="min-h-screen pb-12 bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-buddy-gray-900">Analytics Dashboard</h1>
              <p className="text-buddy-gray-500 mt-1">
                Track your progress and see how you're doing
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Tabs defaultValue="week" className="w-full">
                <TabsList className="bg-white/80 backdrop-blur-sm">
                  <TabsTrigger value="week">This Week</TabsTrigger>
                  <TabsTrigger value="month">This Month</TabsTrigger>
                  <TabsTrigger value="year">This Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <Card.Content className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-buddy-gray-500 text-sm mb-1">{stat.title}</p>
                        <h3 className="text-2xl font-bold text-buddy-gray-900">{stat.value}</h3>
                        <span className="inline-flex items-center text-xs font-medium text-green-600 mt-1">
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                          {stat.change}
                        </span>
                      </div>
                      <div className={`rounded-full p-3 bg-gradient-to-br ${stat.color}`}>
                        {stat.icon}
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full">
                <Card.Header>
                  <Card.Title>Activity Completion</Card.Title>
                  <Card.Description>
                    Daily activity completion rate for the past week
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6E56CF" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#6E56CF" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
                        <XAxis dataKey="name" stroke="#718096" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#718096" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "white", 
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            border: "none"
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="progress"
                          stroke="#6E56CF"
                          fillOpacity={1}
                          fill="url(#progressGradient)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Content>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full">
                <Card.Header>
                  <Card.Title>Goal Progress</Card.Title>
                  <Card.Description>
                    Progress towards your main goals
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={goalData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
                        <XAxis dataKey="name" stroke="#718096" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#718096" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "white", 
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            border: "none"
                          }}
                        />
                        <Bar dataKey="completed" fill="#4F94FC" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Buddy Engagement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card className="h-full">
                <Card.Header>
                  <Card.Title>Buddy Engagement</Card.Title>
                  <Card.Description>
                    Active vs. inactive accountability partners
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={buddyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
                        <XAxis dataKey="name" stroke="#718096" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#718096" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "white", 
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            border: "none"
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="active"
                          stroke="#4CC38A"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#4CC38A" }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="inactive"
                          stroke="#9AA1B2"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#9AA1B2" }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Content>
              </Card>
            </motion.div>

            {/* Category Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="h-full">
                <Card.Header>
                  <Card.Title>Categories</Card.Title>
                  <Card.Description>
                    Distribution of your activities
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="h-60 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "white", 
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            border: "none"
                          }}
                          formatter={(value) => [`${value}%`, 'Percentage']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {categoryData.map((category, index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-1" 
                          style={{ backgroundColor: colors[index % colors.length] }}
                        ></div>
                        <span className="text-xs text-buddy-gray-600">
                          {category.name} ({category.value}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          </div>
          
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8"
          >
            <Card>
              <Card.Header>
                <div className="flex justify-between items-center">
                  <div>
                    <Card.Title>Recent Activities</Card.Title>
                    <Card.Description>Your latest tracked activities</Card.Description>
                  </div>
                  <Button variant="ghost" size="sm" className="text-buddy-purple">
                    View All <ChevronRight className="ml-1 w-4 h-4" />
                  </Button>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border border-buddy-gray-100 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            activity.category === "Fitness" ? "bg-buddy-purple" :
                            activity.category === "Reading" ? "bg-buddy-blue" :
                            "bg-buddy-green"
                          }`}></div>
                          <h4 className="font-medium text-buddy-gray-900">{activity.name}</h4>
                        </div>
                        <span className="flex items-center text-xs text-buddy-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.time}
                        </span>
                      </div>
                      <Progress value={activity.progress} className="h-2 mb-1" />
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-buddy-gray-500">{activity.category}</span>
                        <span className="text-xs font-medium text-buddy-gray-700">{activity.progress}% Complete</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
};

export default Analytics;
