"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import { Alert, AlertTitle } from "@/app/components/ui/alert";
import { Lightbulb, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

export default function StateInfoPanel() {
  const t = useTranslations("hero");

  return (
    <Card className="w-full max-w-4xl mx-auto mt-6 p-4 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          {t("title")}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <AlertTitle>{t("subtitle")}</AlertTitle>
        </Alert>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p>🗺️ {t("points.0")}</p>
          <p>🏙️ {t("points.1")}</p>
          <p>📈 {t("points.2")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
