"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Search, Menu } from "lucide-react";
import { Card } from "@/app/components/ui/card";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <Card className="w-full rounded-none border-x-0 border-t-0 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {!isHomePage ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            ) : (
              <h1 className="text-xl font-bold">Stadt Preis</h1>
            )}
          </div>

          {!isHomePage && (
            <h1 className="text-lg font-semibold hidden md:block">
              Stadt Preis
            </h1>
          )}

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
