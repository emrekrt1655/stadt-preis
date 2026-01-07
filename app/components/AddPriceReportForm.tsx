"use client";

import { useState } from "react";
import { useCreatePriceReport } from "@/hooks/usePriceReports";
import { PriceCategory } from "@/types/PriceReports";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
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

interface AddPriceReportFormProps {
  cityId: string;
  defaultCategory?: PriceCategory;
}

export default function AddPriceReportForm({
  cityId,
  defaultCategory = "rent",
}: AddPriceReportFormProps) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<PriceCategory>(defaultCategory);
  const createReport = useCreatePriceReport();

  const [formData, setFormData] = useState({
    price: "",
    notes: "",
    // Rent
    rentType: "warm" as "warm" | "kalt",
    roomCount: "",
    squareMeters: "",
    neighborhood: "",
    // Beverage
    venueName: "",
    beverageSize: "",
    // Salary
    salaryGross: "",
    salaryPeriod: "yearly" as "yearly" | "monthly",
    jobTitle: "",
    industry: "",
    experienceYears: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const baseData = {
      price: parseFloat(formData.price),
      currency: "EUR",
      notes: formData.notes || undefined,
    };

    let categoryData = {};

    if (category === "rent") {
      categoryData = {
        rentDetails: {
          rentType: formData.rentType,
          roomCount: formData.roomCount ? parseInt(formData.roomCount) : undefined,
          squareMeters: formData.squareMeters
            ? parseFloat(formData.squareMeters)
            : undefined,
          neighborhood: formData.neighborhood || undefined,
        },
      };
    } else if (category === "beer" || category === "cappuccino") {
      categoryData = {
        beverageDetails: {
          venueName: formData.venueName || undefined,
          beverageSize: formData.beverageSize || undefined,
        },
      };
    } else if (category === "salary") {
      categoryData = {
        salaryDetails: {
          salaryGross: formData.salaryGross
            ? parseFloat(formData.salaryGross)
            : undefined,
          salaryPeriod: formData.salaryPeriod,
          jobTitle: formData.jobTitle || undefined,
          industry: formData.industry || undefined,
          experienceYears: formData.experienceYears
            ? parseInt(formData.experienceYears)
            : undefined,
        },
      };
    }

    createReport.mutate(
      {
        cityId,
        category,
        data: { ...baseData, ...categoryData },
      },
      {
        onSuccess: () => {
          setOpen(false);
          // Reset form
          setFormData({
            price: "",
            notes: "",
            rentType: "warm",
            roomCount: "",
            squareMeters: "",
            neighborhood: "",
            venueName: "",
            beverageSize: "",
            salaryGross: "",
            salaryPeriod: "yearly",
            jobTitle: "",
            industry: "",
            experienceYears: "",
          });
        },
      }
    );
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Price Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Price Report</DialogTitle>
          <DialogDescription>
            Share price information anonymously to help others.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as PriceCategory)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rent">🏠 Rent</SelectItem>
                <SelectItem value="beer">🍺 Beer</SelectItem>
                <SelectItem value="cappuccino">☕ Cappuccino</SelectItem>
                <SelectItem value="salary">💼 Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price / Salary */}
          <div className="space-y-2">
            <Label htmlFor="price">
              {category === "salary" ? "Salary (€)" : "Price (€)"}{" "}
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

          {/* Category-specific fields */}
          {category === "rent" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rentType">Rent Type</Label>
                  <Select
                    value={formData.rentType}
                    onValueChange={(value) => handleChange("rentType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warm">Warm (incl. utilities)</SelectItem>
                      <SelectItem value="kalt">Kalt (excl. utilities)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roomCount">Number of Rooms</Label>
                  <Input
                    id="roomCount"
                    type="number"
                    value={formData.roomCount}
                    onChange={(e) => handleChange("roomCount", e.target.value)}
                    placeholder="e.g., 3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="squareMeters">Square Meters</Label>
                  <Input
                    id="squareMeters"
                    type="number"
                    step="0.1"
                    value={formData.squareMeters}
                    onChange={(e) => handleChange("squareMeters", e.target.value)}
                    placeholder="e.g., 85.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Neighborhood</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => handleChange("neighborhood", e.target.value)}
                    placeholder="e.g., City Center"
                  />
                </div>
              </div>
            </div>
          )}

          {(category === "beer" || category === "cappuccino") && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="venueName">Venue Name</Label>
                <Input
                  id="venueName"
                  value={formData.venueName}
                  onChange={(e) => handleChange("venueName", e.target.value)}
                  placeholder="e.g., Café Central"
                />
              </div>

              {category === "beer" && (
                <div className="space-y-2">
                  <Label htmlFor="beverageSize">Size</Label>
                  <Select
                    value={formData.beverageSize}
                    onValueChange={(value) => handleChange("beverageSize", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.3L">0.3L</SelectItem>
                      <SelectItem value="0.4L">0.4L</SelectItem>
                      <SelectItem value="0.5L">0.5L</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {category === "salary" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="salaryPeriod">Period</Label>
                <Select
                  value={formData.salaryPeriod}
                  onValueChange={(value) => handleChange("salaryPeriod", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => handleChange("jobTitle", e.target.value)}
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => handleChange("industry", e.target.value)}
                    placeholder="e.g., Technology"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceYears">Years of Experience</Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) =>
                      handleChange("experienceYears", e.target.value)
                    }
                    placeholder="e.g., 5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Any additional information..."
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createReport.isPending}>
              {createReport.isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}