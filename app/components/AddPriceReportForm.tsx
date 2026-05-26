"use client";

import { useState } from "react";
import { useCreatePriceRecord } from "@/hooks/usePriceRecords";
import { PriceCategory } from "@/types/PriceRecords";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface AddPriceReportFormProps {
  cityId: string;
  stateId: string;
  countryId: string;
  defaultCategory?: PriceCategory;
}

export default function AddPriceReportForm({
  cityId,
  stateId,
  countryId,
  defaultCategory = "rent",
}: AddPriceReportFormProps) {
  const t = useTranslations("AddPriceReportForm");
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<PriceCategory>(defaultCategory);
  const createRecord = useCreatePriceRecord();

  const [formData, setFormData] = useState({
    price: "",
    // Rent
    rentType: "warm" as "warm" | "kalt",
    roomCount: "",
    // Doener
    restaurantName: "",
    // Cappuccino
    cappuccinoRestaurantName: "",
    cappuccinoSize: "",
    // Salary
    salaryGross: "",
    jobTitle: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.price) {
      return;
    }

    const baseData = {
      price: parseFloat(formData.price),
      currency: "EUR",
    };

    let categoryData = {};

    if (category === "rent") {
      categoryData = {
        rentDetails: {
          rentType: formData.rentType,
          roomCount: formData.roomCount
            ? parseInt(formData.roomCount)
            : undefined,
        },
      };
    } else if (category === "doener") {
      categoryData = {
        doenerDetails: {
          restaurantName: formData.restaurantName || undefined,
        },
      };
    } else if (category === "cappuccino") {
      categoryData = {
        cappuccinoDetails: {
          restaurantName: formData.cappuccinoRestaurantName || undefined,
          size: formData.cappuccinoSize || undefined,
        },
      };
    } else if (category === "salary") {
      categoryData = {
        salaryDetails: {
          salaryGross: formData.salaryGross
            ? parseFloat(formData.salaryGross)
            : undefined,
          jobTitle: formData.jobTitle || undefined,
        },
      };
    }

    createRecord.mutate(
      {
        cityId,
        stateId,
        countryId,
        category,
        data: { ...baseData, ...categoryData },
      },
      {
        onSuccess: () => {
          setOpen(false);
          setFormData({
            price: "",
            rentType: "warm",
            roomCount: "",
            restaurantName: "",
            cappuccinoRestaurantName: "",
            cappuccinoSize: "",
            salaryGross: "",
            jobTitle: "",
          });
          setCategory(defaultCategory);
        },
      },
    );
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRentTypeChange = (value: "warm" | "kalt") => {
  setFormData((prev) => ({ ...prev, rentType: value }));
  console.log("Rent type changed to:", value);
};


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t("addReport")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">{t("category")}</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as PriceCategory)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rent">🏠 {t("categories.rent")}</SelectItem>
                <SelectItem value="doener">
                  🍖 {t("categories.doener")}
                </SelectItem>
                <SelectItem value="cappuccino">
                  ☕ {t("categories.cappuccino")}
                </SelectItem>
                <SelectItem value="salary">
                  💼 {t("categories.salary")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price / Salary */}
          <div className="space-y-2">
            <Label htmlFor="price">
              {category === "salary" ? t("salary") : t("price")}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder={
                category === "salary"
                  ? "e.g., 65000"
                  : category === "rent"
                    ? "e.g., 1200.00"
                    : "e.g., 4.50"
              }
            />
          </div>

          {/* Rent Fields */}
          {category === "rent" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rentType">{t("rentType")}</Label>
                  <Select
                    value={formData.rentType}
                    onValueChange={handleRentTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warm">{t("rentTypeWarm")}</SelectItem>
                      <SelectItem value="kalt">{t("rentTypeCold")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roomCount">{t("roomCount")}</Label>
                  <Input
                    id="roomCount"
                    type="number"
                    value={formData.roomCount}
                    onChange={(e) => handleChange("roomCount", e.target.value)}
                    placeholder="e.g., 3"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Doener Fields */}
          {category === "doener" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="restaurantName">{t("restaurantName")}</Label>
                <Input
                  id="restaurantName"
                  value={formData.restaurantName}
                  onChange={(e) =>
                    handleChange("restaurantName", e.target.value)
                  }
                  placeholder="e.g., Doner Palace"
                />
              </div>
            </div>
          )}

          {/* Cappuccino Fields */}
          {category === "cappuccino" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cappuccinoRestaurantName">
                  {t("restaurantName")}
                </Label>
                <Input
                  id="cappuccinoRestaurantName"
                  value={formData.cappuccinoRestaurantName}
                  onChange={(e) =>
                    handleChange("cappuccinoRestaurantName", e.target.value)
                  }
                  placeholder="e.g., Café Central"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cappuccinoSize">{t("size")}</Label>
                <Input
                  id="cappuccinoSize"
                  value={formData.cappuccinoSize}
                  onChange={(e) =>
                    handleChange("cappuccinoSize", e.target.value)
                  }
                  placeholder="e.g., Large, Medium"
                />
              </div>
            </div>
          )}

          {/* Salary Fields */}
          {category === "salary" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">{t("jobTitle")}</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => handleChange("jobTitle", e.target.value)}
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryGross">{t("salaryGross")}</Label>
                <Input
                  id="salaryGross"
                  type="number"
                  step="0.01"
                  value={formData.salaryGross}
                  onChange={(e) => handleChange("salaryGross", e.target.value)}
                  placeholder="e.g., 65000"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={createRecord.isPending}>
              {createRecord.isPending ? t("submitting") : t("submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
