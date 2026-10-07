"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Package, Ruler, X } from "lucide-react";
import { toast } from "sonner";

/* eslint-disable @next/next/no-img-element -- local blob: preview URLs aren't supported by next/image */

import {
  createSlabListingSchema,
  PORT_OF_LOADING_OPTIONS,
} from "@/lib/validations/slab";
import {
  slabService,
  type CreateSlabListingRequest,
} from "@/services/slab.service";
import { authStorage } from "@/lib/auth/auth-storage";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type SlabFormData = {
  materialName: string;
  thickness: "2cm" | "3cm";
  slabsPerLot: string;
  lengthMin: string;
  lengthMax: string;
  widthMin: string;
  widthMax: string;
  unitPrice: string;
  colorCategory: "Dark" | "Light" | "White";
  veinPattern: "Long" | "Short";
  portOfLoading: (typeof PORT_OF_LOADING_OPTIONS)[number] | "";
};

const INITIAL_FORM_DATA: SlabFormData = {
  materialName: "",
  thickness: "3cm",
  slabsPerLot: "",
  lengthMin: "",
  lengthMax: "",
  widthMin: "",
  widthMax: "",
  unitPrice: "",
  colorCategory: "Dark",
  veinPattern: "Long",
  portOfLoading: "",
};

const THICKNESS_OPTIONS: {
  value: SlabFormData["thickness"];
  hint: string;
}[] = [
  { value: "2cm", hint: "10–12 slabs per lot" },
  { value: "3cm", hint: "5–8 slabs per lot" },
];

const COLOR_OPTIONS: SlabFormData["colorCategory"][] = [
  "Dark",
  "Light",
  "White",
];

const VEIN_OPTIONS: SlabFormData["veinPattern"][] = ["Long", "Short"];

const MAX_IMAGES = 8;
const MAX_IMAGE_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const SLABS_PER_LOT_RANGE: Record<SlabFormData["thickness"], [number, number]> = {
  "2cm": [10, 12],
  "3cm": [5, 8],
};

function toNumber(value: string): number | undefined {
  if (value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isNaN(parsed) ? undefined : parsed;
}

const SQ_INCHES_PER_SQ_FOOT = 144;

/** Area of one slab face in square feet, from inch dimensions. */
function squareFeet(lengthIn?: number, widthIn?: number): number | undefined {
  if (
    lengthIn === undefined ||
    widthIn === undefined ||
    lengthIn <= 0 ||
    widthIn <= 0
  ) {
    return undefined;
  }

  return (lengthIn * widthIn) / SQ_INCHES_PER_SQ_FOOT;
}

export default function UploadSlabsPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<SlabFormData>(INITIAL_FORM_DATA);

  const [errors, setErrors] = useState<
    Partial<Record<keyof SlabFormData, string>>
  >({});

  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleAddImages = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      return;
    }

    const incoming = Array.from(fileList);
    const accepted: File[] = [];

    for (const file of incoming) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Unsupported file type", {
          description: `${file.name} must be a JPEG, PNG, or WebP image.`,
        });
        continue;
      }

      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        toast.error("Image too large", {
          description: `${file.name} must be smaller than ${MAX_IMAGE_SIZE_MB}MB.`,
        });
        continue;
      }

      accepted.push(file);
    }

    setImages((previous) => {
      const combined = [...previous, ...accepted];

      if (combined.length > MAX_IMAGES) {
        toast.error("Too many images", {
          description: `You can upload up to ${MAX_IMAGES} images per lot.`,
        });
      }

      return combined.slice(0, MAX_IMAGES);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((previous) => previous.filter((_, i) => i !== index));
  };

  const handleChange = <Field extends keyof SlabFormData>(
    field: Field,
    value: SlabFormData[Field],
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  const validateForm = (): boolean => {
    const payload = {
      materialName: formData.materialName,
      thickness: formData.thickness,
      slabsPerLot: toNumber(formData.slabsPerLot),
      lengthMin: toNumber(formData.lengthMin),
      lengthMax: toNumber(formData.lengthMax),
      widthMin: toNumber(formData.widthMin),
      widthMax: toNumber(formData.widthMax),
      unitPrice: toNumber(formData.unitPrice),
      colorCategory: formData.colorCategory,
      veinPattern: formData.veinPattern,
      portOfLoading: formData.portOfLoading || undefined,
    };

    const result = createSlabListingSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SlabFormData, string>> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SlabFormData;

        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);

      toast.error("Please check the form", {
        description:
          result.error.issues[0]?.message ?? "Some fields need your attention.",
      });

      return false;
    }

    setErrors({});

    return true;
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setImages([]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    try {
      if (!validateForm()) {
        return;
      }

      const accessToken = authStorage.getAccessToken();

      if (!accessToken) {
        toast.error("Authentication required", {
          description: "Please sign in again.",
        });

        return;
      }

      const response = await slabService.createSlabListing(
        {
          materialName: formData.materialName,
          thickness: formData.thickness,
          slabsPerLot: Number(formData.slabsPerLot),
          lengthMin: Number(formData.lengthMin),
          lengthMax: Number(formData.lengthMax),
          widthMin: Number(formData.widthMin),
          widthMax: Number(formData.widthMax),
          unitPrice: Number(formData.unitPrice),
          colorCategory: formData.colorCategory,
          veinPattern: formData.veinPattern,
          portOfLoading:
            formData.portOfLoading as CreateSlabListingRequest["portOfLoading"],
          images,
        },
        accessToken,
      );

      toast.success("Slab lot uploaded", {
        description: `${response.data.materialName} has been added to your inventory.`,
        action: {
          label: "View my slabs",
          onClick: () => router.push("/vendor/my-slabs"),
        },
      });

      handleReset();
    } catch (error) {
      toast.error("Failed to upload slab lot", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while uploading.",
      });
    } finally {
      setLoading(false);
    }
  };

  const slabsPerLotRange = SLABS_PER_LOT_RANGE[formData.thickness];

  const areaMin = squareFeet(
    toNumber(formData.lengthMin),
    toNumber(formData.widthMin),
  );
  const areaMax = squareFeet(
    toNumber(formData.lengthMax),
    toNumber(formData.widthMax),
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Upload Slabs</h2>
        <p className="mt-1 text-slate-500">
          List a new lot of slab inventory for buyers to discover.
        </p>
      </div>

      <Card className="w-full gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-0">
        <form onSubmit={handleSubmit}>
          <section className="border-b border-slate-200 p-5 px-6 max-[700px]:p-4">
            <div className="mb-3.5">
              <h2 className="text-lg font-semibold text-slate-900">
                Material details
              </h2>
              <p className="mt-[5px] text-sm text-slate-500">
                What stone is this lot, and how does it look?
              </p>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4 max-[700px]:grid-cols-1">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="materialName" className="text-xs text-slate-700">
                  Material name <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="materialName"
                  type="text"
                  placeholder="Calacatta Gold"
                  value={formData.materialName}
                  onChange={(event) =>
                    handleChange("materialName", event.target.value)
                  }
                  disabled={loading}
                  className="h-8"
                />

                {errors.materialName && (
                  <small className="text-xs text-red-600">
                    {errors.materialName}
                  </small>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-slate-700">
                  Port of loading <span className="text-red-500">*</span>
                </Label>

                <Select
                  value={formData.portOfLoading}
                  onValueChange={(value) =>
                    handleChange(
                      "portOfLoading",
                      value as SlabFormData["portOfLoading"],
                    )
                  }
                  disabled={loading}
                >
                  <SelectTrigger className="h-8 w-full">
                    <SelectValue placeholder="Select a port" />
                  </SelectTrigger>
                  <SelectContent>
                    {PORT_OF_LOADING_OPTIONS.map((port) => (
                      <SelectItem key={port} value={port}>
                        {port}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.portOfLoading && (
                  <small className="text-xs text-red-600">
                    {errors.portOfLoading}
                  </small>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-[700px]:grid-cols-1">
              <div>
                <Label className="text-xs text-slate-700">
                  Color category <span className="text-red-500">*</span>
                </Label>

                <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={cn(
                        "rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-blue-300",
                        formData.colorCategory === color &&
                          "border-blue-600 bg-blue-50 text-blue-700 shadow-[0_0_0_1px_#2563eb] hover:border-blue-600",
                      )}
                      onClick={() => handleChange("colorCategory", color)}
                      disabled={loading}
                    >
                      {color}
                    </button>
                  ))}
                </div>

                {errors.colorCategory && (
                  <small className="mt-1.5 block text-xs text-red-600">
                    {errors.colorCategory}
                  </small>
                )}
              </div>

              <div>
                <Label className="text-xs text-slate-700">
                  Vein pattern <span className="text-red-500">*</span>
                </Label>

                <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                  {VEIN_OPTIONS.map((vein) => (
                    <button
                      key={vein}
                      type="button"
                      className={cn(
                        "rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-blue-300",
                        formData.veinPattern === vein &&
                          "border-blue-600 bg-blue-50 text-blue-700 shadow-[0_0_0_1px_#2563eb] hover:border-blue-600",
                      )}
                      onClick={() => handleChange("veinPattern", vein)}
                      disabled={loading}
                    >
                      {vein}
                    </button>
                  ))}
                </div>

                {errors.veinPattern && (
                  <small className="mt-1.5 block text-xs text-red-600">
                    {errors.veinPattern}
                  </small>
                )}
              </div>
            </div>
          </section>

          <section className="border-b border-slate-200 p-5 px-6 max-[700px]:p-4">
            <div className="mb-3.5">
              <h2 className="text-lg font-semibold text-slate-900">
                Thickness & lot size
              </h2>
              <p className="mt-[5px] text-sm text-slate-500">
                How the slabs are bundled for shipping.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-[700px]:grid-cols-1">
              <div>
                <Label className="text-xs text-slate-700">
                  Thickness <span className="text-red-500">*</span>
                </Label>

                <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                  {THICKNESS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={cn(
                        "rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-left transition-colors hover:border-blue-300",
                        formData.thickness === option.value &&
                          "border-blue-600 bg-blue-50 shadow-[0_0_0_1px_#2563eb] hover:border-blue-600",
                      )}
                      onClick={() => handleChange("thickness", option.value)}
                      disabled={loading}
                    >
                      <strong className="text-xs text-slate-900">
                        {option.value}
                      </strong>
                      <p className="text-[11px] text-slate-500">
                        {option.hint}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="slabsPerLot" className="text-xs text-slate-700">
                  Slabs per lot <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="slabsPerLot"
                  type="number"
                  placeholder={`${slabsPerLotRange[0]}–${slabsPerLotRange[1]}`}
                  value={formData.slabsPerLot}
                  onChange={(event) =>
                    handleChange("slabsPerLot", event.target.value)
                  }
                  disabled={loading}
                  className="h-8"
                />

                <p className="text-xs text-slate-500">
                  Enter {slabsPerLotRange[0]}–{slabsPerLotRange[1]} slabs for{" "}
                  {formData.thickness} thickness.
                </p>

                {errors.slabsPerLot && (
                  <small className="text-xs text-red-600">
                    {errors.slabsPerLot}
                  </small>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
              <Package className="size-3.5 shrink-0 text-slate-400" />
              Every container holds 7 lots.
            </div>
          </section>

          <section className="border-b border-slate-200 p-5 px-6 max-[700px]:p-4">
            <div className="mb-3.5">
              <h2 className="text-lg font-semibold text-slate-900">
                Slab dimensions (inches)
              </h2>
              <p className="mt-[5px] text-sm text-slate-500">
                Slabs in a lot naturally vary in size — enter the range in
                inches. Area is shown in square feet.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[420px]:grid-cols-1">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="lengthMin" className="text-xs text-slate-700">
                  Length min (inches) <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="lengthMin"
                  type="number"
                  placeholder="100"
                  value={formData.lengthMin}
                  onChange={(event) =>
                    handleChange("lengthMin", event.target.value)
                  }
                  disabled={loading}
                  className="h-8"
                />

                {errors.lengthMin && (
                  <small className="text-xs text-red-600">
                    {errors.lengthMin}
                  </small>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="lengthMax" className="text-xs text-slate-700">
                  Length max (inches) <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="lengthMax"
                  type="number"
                  placeholder="140"
                  value={formData.lengthMax}
                  onChange={(event) =>
                    handleChange("lengthMax", event.target.value)
                  }
                  disabled={loading}
                  className="h-8"
                />

                {errors.lengthMax && (
                  <small className="text-xs text-red-600">
                    {errors.lengthMax}
                  </small>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="widthMin" className="text-xs text-slate-700">
                  Width min (inches) <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="widthMin"
                  type="number"
                  placeholder="57"
                  value={formData.widthMin}
                  onChange={(event) =>
                    handleChange("widthMin", event.target.value)
                  }
                  disabled={loading}
                  className="h-8"
                />

                {errors.widthMin && (
                  <small className="text-xs text-red-600">
                    {errors.widthMin}
                  </small>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="widthMax" className="text-xs text-slate-700">
                  Width max (inches) <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="widthMax"
                  type="number"
                  placeholder="85"
                  value={formData.widthMax}
                  onChange={(event) =>
                    handleChange("widthMax", event.target.value)
                  }
                  disabled={loading}
                  className="h-8"
                />

                {errors.widthMax && (
                  <small className="text-xs text-red-600">
                    {errors.widthMax}
                  </small>
                )}
              </div>
            </div>

            <p className="mt-1.5 text-xs text-slate-500">
              Valid range: Length 100–140 inches · Width 57–85 inches.
            </p>

            {areaMin !== undefined && areaMax !== undefined && (
              <p className="mt-4 flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                <Ruler className="size-3.5 shrink-0 text-slate-400" />
                Approx.{" "}
                <span className="font-medium text-slate-800">
                  {areaMin.toFixed(1) === areaMax.toFixed(1)
                    ? `${areaMin.toFixed(1)} sq ft`
                    : `${areaMin.toFixed(1)}–${areaMax.toFixed(1)} sq ft`}
                </span>{" "}
                per slab
              </p>
            )}
          </section>

          <section className="border-b border-slate-200 p-5 px-6 max-[700px]:p-4">
            <div className="mb-3.5">
              <h2 className="text-lg font-semibold text-slate-900">Pricing</h2>
              <p className="mt-[5px] text-sm text-slate-500">
                Set your own unit price for this lot.
              </p>
            </div>

            <div className="flex flex-col gap-1.5 max-w-[240px]">
              <Label htmlFor="unitPrice" className="text-xs text-slate-700">
                Unit price <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-400">
                  $
                </span>

                <Input
                  id="unitPrice"
                  type="number"
                  placeholder="0.00"
                  value={formData.unitPrice}
                  onChange={(event) =>
                    handleChange("unitPrice", event.target.value)
                  }
                  disabled={loading}
                  className="h-8 pl-6"
                />
              </div>

              {errors.unitPrice && (
                <small className="text-xs text-red-600">
                  {errors.unitPrice}
                </small>
              )}
            </div>
          </section>

          <section className="border-b border-slate-200 p-5 px-6 max-[700px]:p-4">
            <div className="mb-3.5">
              <h2 className="text-lg font-semibold text-slate-900">Photos</h2>
              <p className="mt-[5px] text-sm text-slate-500">
                Add up to {MAX_IMAGES} photos of the actual slabs in this lot.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(event) => handleAddImages(event.target.files)}
              disabled={loading}
            />

            <div className="flex flex-wrap gap-2">
              {imagePreviews.map((src, index) => (
                <div
                  key={src}
                  className="group relative size-20 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                >
                  <img
                    src={src}
                    alt={`Slab photo ${index + 1}`}
                    className="size-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    disabled={loading}
                    aria-label="Remove image"
                    className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-slate-900/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}

              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="flex size-20 shrink-0 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-slate-300 text-slate-500 transition-colors hover:border-blue-400 hover:text-blue-600"
                >
                  <ImagePlus className="size-4" />
                  <span className="text-[11px] font-medium">Add photo</span>
                </button>
              )}
            </div>

            <p className="mt-3 text-xs text-slate-500">
              JPEG, PNG, or WebP · up to {MAX_IMAGE_SIZE_MB}MB each · optional
            </p>
          </section>

          <div className="flex justify-end gap-3 bg-slate-50 px-6 py-4 max-[700px]:px-4">
            <Button
              type="button"
              variant="outline"
              className="h-8"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </Button>
            <LoadingButton
              type="submit"
              className="h-8"
              loading={loading}
              loadingText="Uploading..."
            >
              Upload
            </LoadingButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
