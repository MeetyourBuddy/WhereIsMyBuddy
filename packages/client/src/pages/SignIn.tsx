import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";
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
import { Icons } from "@/components/common/icons";
import { signInFormSchema, type SignInFormData } from "@/lib/validation/auth";
import { useAuth } from "@/store/auth.store";
import { config } from "@/config";

const SignIn = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { login } = useAuth();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      console.log("Signing in with:", data);

      login({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      toast.error("Failed to sign in. Please check your credentials.");
      console.error(error);
    }
  };

  const handleGoogleSignin = () => {
    window.open(`${config.api.baseURL}/auth/google`, "_self");
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-purple/30 via-white to-pastel-blue/30 p-4 relative">
      <Container size="small" className="max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold">
              <span className="text-gradient-primary">Where is My</span> Buddy?
            </h1>
          </Link>
          <p className="text-buddy-gray-500 mt-2">
            Sign in to your account to continue
          </p>
        </div>

        <Card className="shadow-elevation border-buddy-gray-200/50 bg-white/90 backdrop-blur-sm rounded-2xl hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-center bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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

                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-buddy-purple hover:text-buddy-purple-dark transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-buddy-purple to-buddy-blue text-white button-shine"
                  size="lg"
                >
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>

            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-x-0 flex w-full items-center">
                <Separator className="w-full bg-buddy-gray-200/50" />
              </div>
              <span className="relative bg-white/90 px-4 text-sm text-buddy-gray-400">
                OR
              </span>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full rounded-xl border-buddy-gray-200/70 hover:border-buddy-gray-300/70 hover:bg-secondary hover:text-secondary-foreground"
                size="lg"
                onClick={handleGoogleSignin}
              >
                <Icons.google className="h-5 w-5 mr-2" />
                Continue with Google
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center pb-6">
            <p className="text-sm text-buddy-gray-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-buddy-purple hover:text-buddy-purple-dark transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
};

export default SignIn;
