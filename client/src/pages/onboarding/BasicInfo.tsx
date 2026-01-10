import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Calendar, MapPin, User, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  countries,
  citiesByCountry,
} from "@/lib/constants/country-city.constants";

const formSchema = z.object({
  country: z.string().min(1, { message: "Please select your country" }),
  city: z.string().min(1, { message: "Please select your city" }),
  dateOfBirth: z.date({
    required_error: "Please select your birth date",
  }),
});

type FormData = z.infer<typeof formSchema>;

const BasicInfo = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
      city: "",
    },
  });

  // Update available cities when country changes
  useEffect(() => {
    if (selectedCountry) {
      setAvailableCities(
        citiesByCountry[selectedCountry as keyof typeof citiesByCountry] || []
      );
    } else {
      setAvailableCities([]);
    }
  }, [selectedCountry]);

  const onSubmit = (data: FormData) => {
    console.log("Basic info submitted:", data);

    // Extract timezone information (this is just a placeholder - in a real app you'd use a proper
    // timezone calculation based on location)
    const timezoneInfo = {
      country: data.country,
      city: data.city,
      estimatedTimezone: "UTC", // This would be calculated based on location
    };

    // Save timezone info but don't display it to user
    localStorage.setItem("userTimezone", JSON.stringify(timezoneInfo));

    localStorage.setItem("userBasicInfo", JSON.stringify(data));

    toast.success("Basic information saved!");
    navigate("/onboarding/interests");
  };

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={3}
      title="Let's get to know you! 👋"
      description="Share a few details so we can create the perfect experience for you"
    >
      <div className="space-y-6">
        {/* Progress indicator */}
        <div className="bg-gradient-to-r from-buddy-purple/10 to-buddy-orange/10 p-4 rounded-2xl border border-buddy-purple/20">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-buddy-purple to-buddy-purple/80 rounded-full p-2">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-buddy-gray-900">
                Step 1: Basic Information
              </p>
              <p className="text-sm text-buddy-gray-600">
                Help us personalize your buddy-finding experience
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-buddy-gray-900 font-semibold flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-buddy-purple" />
                    <span>Where are you from?</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedCountry(value);
                      // Reset city when country changes
                      form.setValue("city", "");
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full rounded-full border-2 border-buddy-purple/20 focus:border-buddy-purple transition-colors py-6">
                        <SelectValue placeholder="🌍 Select your country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-2 border-buddy-purple/20">
                      {countries.map((country) => (
                        <SelectItem
                          key={country.id}
                          value={country.id}
                          className="rounded-xl"
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-buddy-gray-900 font-semibold flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-buddy-green" />
                    <span>Your City</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!selectedCountry}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full rounded-full border-2 border-buddy-green/20 focus:border-buddy-green transition-colors py-6">
                        <SelectValue placeholder="🏙️ Select your city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-2 border-buddy-green/20">
                      {availableCities.map((city) => (
                        <SelectItem
                          key={city}
                          value={city}
                          className="rounded-xl"
                        >
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-buddy-gray-600">
                    💡 Select your city or the one closest to you for better
                    local matches
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-buddy-gray-900 font-semibold flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-buddy-orange" />
                    <span>When's your special day?</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-4 pr-4 text-left font-normal flex justify-between items-center rounded-full border-2 border-buddy-orange/20 focus:border-buddy-orange transition-colors py-6",
                            !field.value && "text-buddy-gray-500"
                          )}
                        >
                          {field.value ? (
                            <span className="text-buddy-gray-900">
                              🎂 {format(field.value, "PPP")}
                            </span>
                          ) : (
                            <span>🎂 Select your birth date</span>
                          )}
                          <Calendar className="h-5 w-5 text-buddy-orange" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 rounded-2xl border-2 border-buddy-orange/20"
                      align="start"
                    >
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        defaultMonth={field.value || new Date(2000, 0, 1)} // Show year 2000 as default for birth dates
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        className="p-3 pointer-events-auto rounded-2xl"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription className="text-buddy-gray-600">
                    🎈 This helps us find buddies in your age group
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-6 space-y-4">
              <div className="bg-gradient-to-r from-buddy-green/10 to-buddy-blue/10 p-4 rounded-2xl border border-buddy-green/20">
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-5 w-5 text-buddy-green" />
                  <p className="text-sm text-buddy-gray-700">
                    <span className="font-semibold">Great start!</span> This
                    information helps us find the perfect local buddies for you.
                  </p>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-buddy-green to-buddy-blue hover:from-buddy-green/90 hover:to-buddy-blue/90 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                size="lg"
              >
                Continue to Interests <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </OnboardingLayout>
  );
};

export default BasicInfo;
