
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Container from "@/components/ui/layout/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Users, Settings, BarChart2, Database, Layout } from "lucide-react";
import UserManagement from "@/components/admin/UserManagement";
import FeatureManagement from "@/components/admin/FeatureManagement";
import AnalyticsPanel from "@/components/admin/AnalyticsPanel";
import DefaultValues from "@/components/admin/DefaultValues";
import { useToast } from "@/components/ui/use-toast";

const AdminPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("users");

  return (
    <AppLayout>
      <Container>
        <div className="py-6">
          <h1 className="text-2xl font-semibold mb-6 text-buddy-gray-900">Admin Panel</h1>
          
          <Card className="bg-white/80 backdrop-blur-md border-buddy-gray-200 shadow-sm">
            <Tabs
              defaultValue="users"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b border-buddy-gray-100">
                <TabsList className="h-auto bg-transparent p-0">
                  <TabsTrigger 
                    value="users" 
                    className="flex items-center gap-2 rounded-t-lg data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-0 border border-transparent data-[state=active]:border-buddy-gray-100 data-[state=active]:border-b-white py-3 px-4"
                  >
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="features" 
                    className="flex items-center gap-2 rounded-t-lg data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-0 border border-transparent data-[state=active]:border-buddy-gray-100 data-[state=active]:border-b-white py-3 px-4"
                  >
                    <Layout className="h-4 w-4" />
                    <span>Features</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analytics" 
                    className="flex items-center gap-2 rounded-t-lg data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-0 border border-transparent data-[state=active]:border-buddy-gray-100 data-[state=active]:border-b-white py-3 px-4"
                  >
                    <BarChart2 className="h-4 w-4" />
                    <span>Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="defaults" 
                    className="flex items-center gap-2 rounded-t-lg data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-0 border border-transparent data-[state=active]:border-buddy-gray-100 data-[state=active]:border-b-white py-3 px-4"
                  >
                    <Database className="h-4 w-4" />
                    <span>Default Values</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="p-4">
                <TabsContent value="users" className="m-0">
                  <UserManagement />
                </TabsContent>
                <TabsContent value="features" className="m-0">
                  <FeatureManagement />
                </TabsContent>
                <TabsContent value="analytics" className="m-0">
                  <AnalyticsPanel />
                </TabsContent>
                <TabsContent value="defaults" className="m-0">
                  <DefaultValues />
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </div>
      </Container>
    </AppLayout>
  );
};

export default AdminPanel;
