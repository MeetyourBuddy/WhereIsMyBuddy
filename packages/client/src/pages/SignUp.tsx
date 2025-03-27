
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, ArrowRight, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";

import Container from "@/components/ui/layout/Container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type FormData = z.infer<typeof formSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Sign up logic would go here
      console.log("Signing up with:", data);
      
      // For demo purposes, just show a toast and redirect to onboarding
      toast.success("Account created! Let's set up your profile.");
      navigate("/onboarding");
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
      console.error(error);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-purple/30 via-white to-pastel-blue/30 p-4 relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzUxRTkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTIwIDM1YzguMjg0IDAgMTUtNi43MTYgMTUtMTUtOC04LjI4NC02LjcxNi0xNS0xNS0xNS04LjI4NCAwLTE1IDYuNzE2LTE1IDE1IDAgOC4yODQgNi43MTYgMTUgMTUgMTV6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-75 pointer-events-none"></div>
      
      <Container size="small" className="max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold">
              <span className="text-gradient-primary">Where is My</span> Buddy?
            </h1>
          </Link>
          <p className="text-buddy-gray-500 mt-2">Create an account to find your buddies</p>
        </div>

        <Card className="shadow-elevation border-buddy-gray-200/50 bg-white/90 backdrop-blur-sm rounded-2xl hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-center bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-buddy-gray-400 h-4 w-4" />
                          <Input
                            {...field}
                            placeholder="John Doe"
                            className="pl-10 rounded-xl border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30"
                          />
                        </div>
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
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-buddy-gray-400 h-4 w-4" />
                          <Input
                            {...field}
                            placeholder="you@example.com"
                            className="pl-10 rounded-xl border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-buddy-gray-400 h-4 w-4" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            className="pl-10 pr-10 rounded-xl border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={toggleShowPassword}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-buddy-gray-400 hover:text-buddy-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-buddy-purple data-[state=checked]:border-buddy-purple"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          I agree to the{" "}
                          <Link
                            to="/terms"
                            className="text-buddy-purple hover:text-buddy-purple-dark"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            to="/privacy"
                            className="text-buddy-purple hover:text-buddy-purple-dark"
                          >
                            Privacy Policy
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full rounded-xl bg-gradient-to-r from-buddy-purple to-buddy-blue text-white button-shine" size="lg">
                  Create Account <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>

            <div className="my-6 flex items-center">
              <Separator className="flex-grow bg-buddy-gray-200/50" />
              <span className="px-4 text-sm text-buddy-gray-400">OR</span>
              <Separator className="flex-grow bg-buddy-gray-200/50" />
            </div>

            <div className="space-y-3">
              <Button variant="outline" className="w-full rounded-xl border-buddy-gray-200/70 hover:border-buddy-gray-300/70 hover:bg-buddy-gray-50/50" size="lg">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Sign up with Google
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center pb-6">
            <p className="text-sm text-buddy-gray-500">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-medium text-buddy-purple hover:text-buddy-purple-dark transition-colors"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
};

export default SignUp;
