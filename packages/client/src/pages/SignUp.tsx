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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/components/common/icons";
import { signUpFormSchema, type SignUpFormData } from "@/lib/validation/auth";
import { useAuth } from "@/store/auth.store";
import { config } from "@/config";

const SignUp = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      // Sign up logic would go here
      console.log("Signing up with:", data);

      await register({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      // Check if there's a redirect URL stored
      const redirectUrl = localStorage.getItem("redirectAfterSignup");
      if (redirectUrl) {
        localStorage.removeItem("redirectAfterSignup");
        toast.success(
          "Account created successfully! Redirecting to activity..."
        );
        navigate(redirectUrl);
      } else {
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
      console.error(error);
    }
  };

  const handleGoogleSignin = () => {
    window.open(`${config.api.baseURL}/api/auth/google`, "_self");
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-buddy-purple/10 via-white to-buddy-blue/10 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-buddy-purple/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-buddy-blue/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-buddy-purple/10 to-buddy-blue/10 rounded-full blur-3xl"></div>
      </div>

      <Container size="small" className="max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">
                Where is My
              </span>{" "}
              Buddy?
            </h1>
          </Link>
          <p className="text-buddy-gray-600 mt-3 text-lg">
            Join thousands of people achieving their goals together! 🌟
          </p>
        </div>

        <Card className="shadow-2xl border-2 border-white/20 bg-white/95 backdrop-blur-sm rounded-3xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-1">
          <CardHeader className="pb-6">
            <CardTitle className="text-center text-2xl font-bold ">
              Start Your Journey! 🚀
            </CardTitle>
            <p className="text-center text-buddy-gray-600 mt-2">
              Create your account and find your perfect accountability buddy
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-buddy-gray-700 font-medium">
                        Name 👤
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-buddy-gray-400 h-5 w-5" />
                          <Input
                            {...field}
                            placeholder="John Doe"
                            className="pl-12 rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12 text-base"
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
                      <FormLabel className="text-buddy-gray-700 font-medium">
                        Email Address 📧
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-buddy-gray-400 h-5 w-5" />
                          <Input
                            {...field}
                            placeholder="you@example.com"
                            className="pl-12 rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12 text-base"
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
                      <FormLabel className="text-buddy-gray-700 font-medium">
                        Password 🔒
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-buddy-gray-400 h-5 w-5" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            className="pl-12 pr-12 rounded-full border-2 border-buddy-gray-200/70 focus:border-buddy-purple/50 focus:ring-buddy-purple/30 h-12 text-base"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={toggleShowPassword}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-buddy-gray-400 hover:text-buddy-gray-600 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
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
                          className="data-[state=checked]:bg-buddy-purple data-[state=checked]:border-buddy-purple rounded-md"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal cursor-pointer text-buddy-gray-600">
                          I agree to the{" "}
                          <Link
                            to="/terms"
                            className="text-buddy-purple hover:text-buddy-purple-dark font-medium hover:underline"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            to="/privacy"
                            className="text-buddy-purple hover:text-buddy-purple-dark font-medium hover:underline"
                          >
                            Privacy Policy
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white hover:shadow-lg transition-all duration-300 hover:scale-105 h-12 text-lg font-semibold"
                  size="lg"
                >
                  Create Account & Start!{" "}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </Form>

            <div className="relative my-8 flex items-center justify-center">
              <div className="absolute inset-x-0 flex w-full items-center">
                <Separator className="w-full bg-buddy-gray-200/50" />
              </div>
              <span className="relative bg-white/95 px-6 text-sm text-buddy-gray-500 font-medium">
                OR
              </span>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full rounded-full border-2 border-buddy-gray-200/70 hover:border-buddy-gray-300/70 hover:bg-buddy-gray-50 hover:text-buddy-gray-900 transition-all duration-300 hover:scale-105 h-12 text-base font-medium"
                size="lg"
                onClick={handleGoogleSignin}
              >
                <Icons.google className="h-5 w-5 mr-3" />
                Sign up with Google
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center pb-8">
            <p className="text-base text-buddy-gray-600">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-semibold text-buddy-purple hover:text-buddy-purple-dark transition-colors hover:underline"
              >
                Sign in here! 👋
              </Link>
            </p>
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
};

export default SignUp;
