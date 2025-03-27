
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { 
  User, 
  MoreHorizontal, 
  Search, 
  Plus, 
  Lock, 
  Shield,
  UserX,
  UserCheck
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock user data
const mockUsers = [
  { 
    id: 1, 
    name: "Jordan Lee", 
    email: "jordan@example.com", 
    role: "User", 
    status: "Active",
    joinDate: "Jan 15, 2023",
    lastActive: "1 hour ago",
    activitiesJoined: 12
  },
  { 
    id: 2, 
    name: "Sam Wilson", 
    email: "sam@example.com", 
    role: "Admin", 
    status: "Active",
    joinDate: "Feb 20, 2023",
    lastActive: "5 minutes ago",
    activitiesJoined: 8
  },
  { 
    id: 3, 
    name: "Taylor Swift", 
    email: "taylor@example.com", 
    role: "User", 
    status: "Inactive",
    joinDate: "Mar 10, 2023",
    lastActive: "3 days ago",
    activitiesJoined: 5
  },
  { 
    id: 4, 
    name: "Alex Johnson", 
    email: "alex@example.com", 
    role: "Moderator", 
    status: "Active",
    joinDate: "Apr 5, 2023",
    lastActive: "2 hours ago",
    activitiesJoined: 15
  },
  { 
    id: 5, 
    name: "Jamie Parker", 
    email: "jamie@example.com", 
    role: "User", 
    status: "Suspended",
    joinDate: "May 12, 2023",
    lastActive: "2 weeks ago",
    activitiesJoined: 3
  },
];

const UserStatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    Active: "bg-green-100 text-green-800 hover:bg-green-100",
    Inactive: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    Suspended: "bg-red-100 text-red-800 hover:bg-red-100",
    Pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  };
  
  return (
    <Badge 
      variant="outline"
      className={`rounded-full px-2 py-1 text-xs ${statusStyles[status as keyof typeof statusStyles]}`}
    >
      {status}
    </Badge>
  );
};

const UserManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  
  // Filter users based on search query and filters
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = searchQuery === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesRole = selectedRole === null || user.role === selectedRole;
    const matchesStatus = selectedStatus === null || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  const handleAction = (action: string, userId: number) => {
    const user = mockUsers.find(u => u.id === userId);
    
    switch(action) {
      case "promote":
        toast({
          title: "User promoted",
          description: `${user?.name} has been promoted to admin.`,
        });
        break;
      case "suspend":
        toast({
          title: "User suspended",
          description: `${user?.name} has been suspended.`,
        });
        break;
      case "activate":
        toast({
          title: "User activated",
          description: `${user?.name} has been activated.`,
        });
        break;
      case "delete":
        toast({
          title: "User deleted",
          description: `${user?.name} has been deleted.`,
          variant: "destructive"
        });
        break;
      case "resetPassword":
        toast({
          title: "Password reset email sent",
          description: `Password reset email has been sent to ${user?.email}.`,
        });
        break;
    }
  };
  
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "User",
      status: "Active",
    },
  });
  
  const onSubmit = (data: any) => {
    toast({
      title: "User created",
      description: `New user ${data.name} has been created.`,
    });
    setIsAddUserOpen(false);
    form.reset();
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-buddy-gray-400" size={18} />
          <Input 
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select onValueChange={(value) => setSelectedRole(value === "all" ? null : value)}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="User">User</SelectItem>
              <SelectItem value="Moderator">Moderator</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          
          <Select onValueChange={(value) => setSelectedStatus(value === "all" ? null : value)}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="sm:ml-2">
                <Plus size={18} className="mr-1" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account. They'll receive an email to set up their password.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Role</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="User">User</SelectItem>
                              <SelectItem value="Moderator">Moderator</SelectItem>
                              <SelectItem value="Admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create User</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-buddy-gray-50">
              <TableHead className="font-medium">User</TableHead>
              <TableHead className="font-medium">Role</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Joined</TableHead>
              <TableHead className="font-medium">Activities</TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-buddy-purple/10 flex items-center justify-center text-buddy-purple">
                        <User size={18} />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "Admin" ? "default" : "outline"} className="rounded-full px-2 py-1">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <UserStatusBadge status={user.status} />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.joinDate}</div>
                      <div className="text-sm text-muted-foreground">Active {user.lastActive}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.activitiesJoined}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction("view", user.id)}>
                          <User className="mr-2 h-4 w-4" />
                          <span>View Profile</span>
                        </DropdownMenuItem>
                        
                        {user.role !== "Admin" && (
                          <DropdownMenuItem onClick={() => handleAction("promote", user.id)}>
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Promote to Admin</span>
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem onClick={() => handleAction("resetPassword", user.id)}>
                          <Lock className="mr-2 h-4 w-4" />
                          <span>Reset Password</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        {user.status === "Active" ? (
                          <DropdownMenuItem onClick={() => handleAction("suspend", user.id)}>
                            <UserX className="mr-2 h-4 w-4" />
                            <span>Suspend User</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleAction("activate", user.id)}>
                            <UserCheck className="mr-2 h-4 w-4" />
                            <span>Activate User</span>
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600" 
                          onClick={() => handleAction("delete", user.id)}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          <span>Delete User</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div>Showing <strong>{filteredUsers.length}</strong> of <strong>{mockUsers.length}</strong> users</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
