import { useEffect, useId, useRef, useState } from "react";
import { Trash2, Upload, User } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

const buildInitialState = (user) => ({
  userName: user?.userName || "",
  country: user?.country || "",
  gender: user?.gender || "male",
  phoneNumber: user?.phoneNumber || "",
  DOB: user?.DOB ? new Date(user.DOB).toISOString().split("T")[0] : "",
});

export default function ProfileEditForm({
  user,
  axiosPrivate,
  onProfileUpdated,
  onSaved,
  onCancel,
  submitLabel = "Save Changes",
  className = "space-y-6",
}) {
  const fileInputId = useId();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState(() => buildInitialState(user));
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(buildInitialState(user));
    setSelectedImageFile(null);
    setRemoveImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [user]);

  useEffect(() => {
    if (!selectedImageFile) {
      setImagePreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedImageFile);
    setImagePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImageFile]);

  const displayedImage = removeImage ? "" : imagePreviewUrl || user?.image || "";
  const profileName = formData.userName || user?.userName || "Guest";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetImageSelection = () => {
    setSelectedImageFile(null);
    setRemoveImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (event) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) {
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(nextFile.type)) {
      toast.info("Please choose a JPG, PNG, or GIF image.");
      event.target.value = "";
      return;
    }

    setSelectedImageFile(nextFile);
    setRemoveImage(false);
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setRemoveImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const payload = new FormData();
      payload.append("userName", formData.userName);
      payload.append("country", formData.country);
      payload.append("gender", formData.gender);
      payload.append("phoneNumber", formData.phoneNumber);
      payload.append("DOB", formData.DOB);

      if (selectedImageFile) {
        payload.append("image", selectedImageFile);
      } else if (removeImage) {
        payload.append("removeImage", "true");
      }

      const { data } = await axiosPrivate.patch("/user/profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = data?.data?.user;
      if (updatedUser) {
        onProfileUpdated?.(updatedUser);
        onSaved?.(updatedUser);
      }

      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <div className="grid gap-6 lg:grid-cols-[240px,minmax(0,1fr)]">
        <div className="rounded-[1.75rem] border border-border/60 bg-card/55 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Profile Photo
          </p>
          <div className="mt-5 flex flex-col items-center text-center">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-primary/20 bg-primary/10 shadow-lg">
              {displayedImage ? (
                <img
                  src={displayedImage}
                  alt={profileName}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User size={44} className="text-primary" />
              )}
            </div>
            <p className="mt-4 text-sm font-semibold text-foreground">{profileName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>

          <input
            ref={fileInputRef}
            id={fileInputId}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            className="hidden"
            onChange={handleImageChange}
          />

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button variant="palmSecondary" size="sm" asChild>
              <label htmlFor={fileInputId}>
                <Upload size={14} />
                {selectedImageFile ? "Change Photo" : displayedImage ? "Replace Photo" : "Upload Photo"}
              </label>
            </Button>
            {displayedImage ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-full border border-border/60"
                onClick={handleRemoveImage}
              >
                <Trash2 size={14} />
                Remove
              </Button>
            ) : null}
            {selectedImageFile || removeImage ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-full border border-border/60"
                onClick={resetImageSelection}
              >
                Reset
              </Button>
            ) : null}
          </div>

          <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
            {selectedImageFile
              ? selectedImageFile.name
              : removeImage
                ? "Your current photo will be removed after saving."
                : "Use a square JPG, PNG, or GIF image for the cleanest result."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">User Name</span>
            <input
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-sm outline-none transition focus:border-primary/40"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Country</span>
            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-sm outline-none transition focus:border-primary/40"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Gender</span>
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
            >
              <SelectTrigger className="h-[52px] rounded-2xl border-border/60 bg-card/60 px-4 text-sm">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Phone Number</span>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-sm outline-none transition focus:border-primary/40"
            />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-medium text-foreground">Date of Birth</span>
            <input
              type="date"
              name="DOB"
              value={formData.DOB}
              onChange={handleChange}
              className="w-full rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-sm outline-none transition focus:border-primary/40"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-1">
        {onCancel ? (
          <Button type="button" variant="palmSecondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" variant="palmPrimary" disabled={isSaving}>
          {isSaving ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
