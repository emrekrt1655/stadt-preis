"use client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface MapCountInfoProps {
  isLoadingCounts: boolean;
}
export default function MapCountInfo({ isLoadingCounts }: MapCountInfoProps) {
  const t = useTranslations("MapCountInfo");
  return (
    <div className="flex gap-4 mb-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-slate-100 border border-gray-500"></div>
        <span>{t('noData')}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-200 border border-gray-500"></div>
        <span>{t('hasData')}</span>
      </div>
      {isLoadingCounts && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>{t('loading')}</span>
        </div>
      )}
    </div>
  );
}
