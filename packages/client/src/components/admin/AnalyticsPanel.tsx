
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Activity, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  ArrowUp, 
  ArrowDown, 
  ArrowRight,
  Users,
  Clock,
  Flag
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

// Mock data for analytics
const userActivityData = [
  { month: "Jan", users: 320, activities: 75, messages: 2100 },
  { month: "Feb", users: 380, activities: 90, messages: 2400 },
  { month: "Mar", users: 450, activities: 110, messages: 2800 },
  { month: "Apr", users: 520, activities: 140, messages: 3200 },
  { month: "May", users: 590, activities: 170, messages: 3800 },
  { month: "Jun", users: 680, activities: 210, messages: 4300 },
  { month: "Jul", users: 770, activities: 250, messages: 4800 },
  { month: "Aug", users: 830, activities: 280, messages: 5100 },
  { month: "Sep", users: 890, activities: 310, messages: 5500 },
  { month: "Oct", users: 950, activities: 330, messages: 5800 },
  { month: "Nov", users: 1020, activities: 360, messages: 6100 },
  { month: "Dec", users: 1100, activities: 400, messages: 6500 },
];

const activityTypeData = [
  { name: "Sports", value: 35 },
  { name: "Study Groups", value: 20 },
  { name: "Hobbies", value: 25 },
  { name: "Social Events", value: 15 },
  { name: "Other", value: 5 },
];

const userRetentionData = [
  { week: "Week 1", retained: 100 },
  { week: "Week 2", retained: 85 },
  { week: "Week 3", retained: 75 },
  { week: "Week 4", retained: 68 },
  { week: "Week 5", retained: 62 },
  { week: "Week 6", retained: 58 },
  { week: "Week 7", retained: 55 },
  { week: "Week 8", retained: 52 },
];

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

const AnalyticsPanel = () => {
  const [timeFrame, setTimeFrame] = useState("yearly");
  
  // Calculate summary statistics
  const totalUsers = 1100;
  const totalActivities = 2850;
  const totalMessages = 52000;
  const totalConnections = 5200;
  
  // Change from previous period
  const userGrowth = "+15%";
  const activityGrowth = "+22%";
  const messageGrowth = "+18%";
  const connectionGrowth = "+12%";
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-semibold">Platform Analytics</h2>
        
        <div className="flex gap-2">
          <Select
            value={timeFrame}
            onValueChange={setTimeFrame}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Last 7 days</SelectItem>
              <SelectItem value="monthly">Last 30 days</SelectItem>
              <SelectItem value="quarterly">Last 3 months</SelectItem>
              <SelectItem value="yearly">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalUsers}</div>
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <User size={18} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <span className={`flex items-center ${userGrowth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {userGrowth.startsWith('+') ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                {userGrowth} 
              </span>
              <ArrowRight size={12} className="mx-1 text-muted-foreground" />
              <span className="text-muted-foreground">vs previous period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Activities</CardTitle>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalActivities}</div>
              <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Activity size={18} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <span className={`flex items-center ${activityGrowth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {activityGrowth.startsWith('+') ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                {activityGrowth}
              </span>
              <ArrowRight size={12} className="mx-1 text-muted-foreground" />
              <span className="text-muted-foreground">vs previous period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Messages</CardTitle>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalMessages.toLocaleString()}</div>
              <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <MessageCircle size={18} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <span className={`flex items-center ${messageGrowth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {messageGrowth.startsWith('+') ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                {messageGrowth}
              </span>
              <ArrowRight size={12} className="mx-1 text-muted-foreground" />
              <span className="text-muted-foreground">vs previous period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Buddy Connections</CardTitle>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalConnections.toLocaleString()}</div>
              <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <Users size={18} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <span className={`flex items-center ${connectionGrowth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {connectionGrowth.startsWith('+') ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                {connectionGrowth}
              </span>
              <ArrowRight size={12} className="mx-1 text-muted-foreground" />
              <span className="text-muted-foreground">vs previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="growth">
        <TabsList>
          <TabsTrigger value="growth">Growth Metrics</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="growth" className="mt-4 space-y-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>User & Activity Growth</CardTitle>
              <CardDescription>Monthly growth over the past year</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={userActivityData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="activities" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>User retention over 8 weeks</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={userRetentionData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="retained" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Activity Distribution</CardTitle>
                <CardDescription>Activities by type</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activityTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {activityTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="engagement" className="mt-4 space-y-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
              <CardDescription>Messages and interactions over time</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={userActivityData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="messages" stackId="1" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">Avg. Session Duration</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12m 24s</div>
                <p className="text-xs text-muted-foreground mt-1">+2m 10s vs previous period</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Flag className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">Completion Rate</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground mt-1">+5% vs previous period</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">Return Frequency</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2 days</div>
                <p className="text-xs text-muted-foreground mt-1">-0.5 days vs previous period</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="activities" className="mt-4 space-y-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Activity Trends</CardTitle>
              <CardDescription>Monthly activities created</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={userActivityData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="activities" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPanel;
