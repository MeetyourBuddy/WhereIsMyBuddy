import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";

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

  const onSubmit = (data: SignInFormData) => {
    login({
      email: data.email,
      password: data.password,
    });
  };

  const handleGoogleSignin = () => {
    window.open(`${config.api.baseURL}/auth/google`, "_self");
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

      <Container size="small" className="max-w-lg relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">
                Where is My
              </span>{" "}
              Buddy?
            </h1>
          </Link>
          <p className="mt-3 text-lg text-buddy-gray-600">
            Welcome back! Ready to continue your journey?
          </p>
        </div>

        <Card className="shadow-2xl border-2 border-white/20 bg-white/95 backdrop-blur-sm rounded-3xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-1">
          <CardHeader className="pb-6">
            <CardTitle className="text-center text-2xl font-bold ">
              Welcome Back
            </CardTitle>
            <p className="text-center text-buddy-gray-600 mt-2">
              Let's get you back to achieving your goals
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-buddy-gray-700 font-medium">
                        Email Address
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
                        Password
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

                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-buddy-purple hover:text-buddy-purple-dark transition-colors hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white hover:shadow-lg transition-all duration-300 hover:scale-105 h-12 text-lg font-semibold"
                  size="lg"
                >
                  Sign In
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
                Continue with Google
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center pb-8">
            <p className="text-base text-buddy-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-buddy-purple hover:text-buddy-purple-dark transition-colors hover:underline"
              >
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
};

export default SignIn;
