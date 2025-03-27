
import React from "react";
import { Badge } from "@/components/ui/badge";

export type FeatureStatusType = "stable" | "beta" | "development" | "experimental";

export const FeatureStatusBadge = ({ status }: { status: FeatureStatusType }) => {
  const statusMap = {
    stable: {
      text: "Stable",
      class: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    beta: {
      text: "Beta",
      class: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    },
    development: {
      text: "In Development",
      class: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },
    experimental: {
      text: "Experimental",
      class: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    },
  };

  const statusInfo = statusMap[status];

  return (
    <Badge
      variant="outline"
      className={`rounded-full px-2 py-1 text-xs ${statusInfo.class}`}
    >
      {statusInfo.text}
    </Badge>
  );
};
