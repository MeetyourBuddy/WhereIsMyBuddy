
import React from "react";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Tag, AlertTriangle, Shield, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

interface Rule {
  id: string;
  rule: string;
  description?: string;
  isDefault: boolean;
}

interface ActivityInfoProps {
  title: string;
  description: string;
  category: string;
  location: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  frequency: string;
  tags: string[];
  rules: Rule[];
}

const ActivityInfo: React.FC<ActivityInfoProps> = ({
  title,
  description,
  category,
  location,
  startDate,
  endDate,
  duration,
  frequency,
  tags,
  rules
}) => {
  return (
    <Card className="p-5 bg-white rounded-xl">
      <h3 className="text-lg font-semibold text-buddy-gray-800 mb-4 flex items-center">
        <Info className="h-5 w-5 mr-2 text-buddy-purple" />
        About This Activity
      </h3>
      
      <div className="space-y-5">
        {/* Description */}
        <div>
          <p className="text-sm text-buddy-gray-600 leading-relaxed">{description}</p>
        </div>
        
        {/* Key Details */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Calendar className="h-4 w-4 text-buddy-purple mt-0.5" />
            <div>
              <h4 className="text-xs font-medium text-buddy-gray-500 mb-1">Date Range</h4>
              <p className="text-sm text-buddy-gray-800 font-medium">
                {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
              </p>
              <p className="text-xs text-buddy-gray-500">{duration} ({frequency})</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <MapPin className="h-4 w-4 text-buddy-green mt-0.5" />
            <div>
              <h4 className="text-xs font-medium text-buddy-gray-500 mb-1">Location</h4>
              <p className="text-sm text-buddy-gray-800">{location}</p>
            </div>
          </div>
        </div>
        
        {/* Tags */}
        <div>
          <h4 className="text-xs font-medium text-buddy-gray-500 mb-2 flex items-center">
            <Tag className="h-4 w-4 text-buddy-blue mr-1" />
            Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="bg-buddy-purple/10 text-buddy-purple border-buddy-purple/20 text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Rules */}
        <div>
          <h4 className="text-xs font-medium text-buddy-gray-500 mb-2 flex items-center">
            <Shield className="h-4 w-4 text-buddy-orange mr-1" />
            Rules & Guidelines
          </h4>
          <Accordion type="multiple" className="w-full">
            {rules.map((rule) => (
              <AccordionItem key={rule.id} value={rule.id} className="border-b border-buddy-gray-100">
                <AccordionTrigger className="py-2 text-sm hover:no-underline">
                  <div className="flex items-start text-left">
                    <AlertTriangle className={`h-3 w-3 mt-1 mr-2 ${rule.isDefault ? "text-buddy-orange" : "text-buddy-purple"}`} />
                    <span className="text-sm text-buddy-gray-700 font-medium">
                      {rule.rule}
                      {rule.isDefault && (
                        <Badge variant="outline" className="ml-2 text-xs bg-buddy-orange/10 text-buddy-orange border-buddy-orange/20">
                          Default
                        </Badge>
                      )}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="ml-5 text-sm text-buddy-gray-600">
                  {rule.description || "No additional details provided for this rule."}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Card>
  );
};

export default ActivityInfo;
