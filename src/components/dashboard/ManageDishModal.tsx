import { useState } from "react";
import type { MenuItem } from "./types";
import { supabase } from "../../lib/client";
import { XCircle, Upload, Image as ImageIcon } from "lucide-react";
import { createPortal } from "react-dom";

export default function ManageDishModal({
  dish,
  days,
  onSave,
  onDelete,
  onClose,
}: {
  dish: MenuItem;
  days: string[];
  onSave: (updated: MenuItem) => void;
  onDelete?: (deleted: MenuItem) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(dish.name || "");
  const [description, setDescription] = useState(dish.description || "");
  const [price, setPrice] = useState(dish.price || 0);
  const [hasStock, setHasStock] = useState(dish.hasStock ?? true);
  const [selectedDays, setSelectedDays] = useState<string[]>(dish.availableDays || []);
  const [startDate, setStartDate] = useState(dish.availabilityRange?.start || "");
  const [endDate, setEndDate] = useState(dish.availabilityRange?.end || "");
  const [image, setImage] = useState(dish.imageUrl || "https://thvnext.bing.com/th/id/OIP.ZKYGG7ccI7cReRSZOjG2ZgHaE8?w=286&h=191&c=7&r=0&o=7&cb=12&pid=1.7&rm=3");
  const [alwaysAvailable, setAlwaysAvailable] = useState(dish.alwaysAvailable ?? true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isSaveDisabled = !name || price <= 0;
  const today = new Date().toISOString().split("T")[0];



  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    // Validate image if a new file is selected
    if (selectedFile) {
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validImageTypes.includes(selectedFile.type)) {
        alert('Invalid image format!\n\nPlease upload a valid image file (JPEG, PNG, WebP, or GIF).');
        return;
      }

      const maxSizeInMB = 5;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (selectedFile.size > maxSizeInBytes) {
        alert(`Image file is too large!\n\nMaximum file size is ${maxSizeInMB}MB.\nYour file is ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB.`);
        return;
      }
    }

    setIsUploading(true);

    try {
      let uploadedImageUrl = image;

      if (selectedFile) {
        // Delete old image if exists
        if (dish.imageUrl && !dish.imageUrl.includes("data:") && !dish.imageUrl.includes("placeholder")) {
          const oldFilePath = dish.imageUrl.split("/").pop();
          if (oldFilePath) {
            const { error: deleteError } = await supabase.storage.from("images").remove([oldFilePath]);
            if (deleteError) console.warn("Failed to delete old image:", deleteError);
          }
        }

        // Upload new image
        const filePath = `${Date.now()}_${selectedFile.name}`;
        const { error: uploadError } = await supabase.storage.from("images").upload(filePath, selectedFile, { upsert: true });

        if (uploadError) {
          alert(`Image upload failed!\n\nError: ${uploadError.message}\n\nPlease try again or contact support if the issue persists.`);
          throw uploadError;
        }

        const { data } = supabase.storage.from("images").getPublicUrl(filePath);
        if (!data.publicUrl) {
          alert('Failed to get image URL!\n\nThe image was uploaded but we couldn\'t retrieve its URL. Please try again.');
          throw new Error("Failed to get public URL");
        }
        uploadedImageUrl = data.publicUrl;
      }

      const updatedDish: MenuItem = {
        ...dish,
        name,
        description,
        price,
        hasStock,
        imageUrl: uploadedImageUrl,
        availableDays: selectedDays,
        alwaysAvailable,
        availabilityRange: alwaysAvailable
          ? null
          : startDate && endDate
            ? { start: startDate, end: endDate }
            : null,
      };

      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        alert('Authentication error!\n\nYour session has expired. Please log in again.');
        throw new Error("No user session found");
      }

      // Prepare payload: remove ID if it's temporary (0 or timestamp) so server generates a new one
      const payload = { ...updatedDish };
      if (payload.id === 0 || (typeof payload.id === 'number' && payload.id > 2000000000)) {
        delete (payload as any).id;
      }

      const res = await fetch(
        "https://bnvlaiftxamrudncnygx.supabase.co/functions/v1/dynamic-service",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();
      if (!res.ok) {
        const errorMsg = json.error || json.message || 'Unknown error occurred';
        alert(`Failed to save dish!\n\nError: ${errorMsg}\n\nPlease check your input and try again.`);
        console.error("Failed to save dish:", json);
        return;
      }

      // Success! Use the server response which contains the actual dish ID
      const savedDish = json.dish || { ...updatedDish, id: json.id || updatedDish.id };
      alert(`Success!\n\n"${name}" has been ${dish.id ? 'updated' : 'added'} successfully!`);
      onSave(savedDish);
      onClose();
    } catch (err: any) {
      console.error("Error saving dish:", err);
      const errorMessage = err.message || 'An unexpected error occurred';
      alert(`Error saving dish!\n\n${errorMessage}\n\nPlease try again or contact support if the issue persists.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this dish?")) return;

    // Debug alert
    // alert(`Debug: dish.id is ${dish.id} (type: ${typeof dish.id})`);

    if (dish.id === undefined || dish.id === null) {
      alert(`❌ Cannot delete dish: Invalid ID (${dish.id}).`);
      return;
    }

    setIsDeleting(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("No user session found");

      const res = await fetch(
        "https://bnvlaiftxamrudncnygx.supabase.co/functions/v1/delete-dish",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: dish.id }),
        }
      );
      const json = await res.json();
      if (!res.ok) {
        const errorMsg = json.error || json.message || 'Unknown error occurred';
        console.error("Failed to delete dish:", json);
        alert(`❌ Failed to delete dish!\n\nError: ${errorMsg}\n\nPlease try again.`);
        return;
      }

      console.log("Dish deleted successfully:", json);
      alert(`✅ Dish deleted successfully!`);
      onDelete?.(dish);
      onClose();
    } catch (err: any) {
      console.error("Error deleting dish:", err);
      const errorMessage = err.message || 'An unexpected error occurred';
      alert(`❌ Error deleting dish!\n\n${errorMessage}\n\nPlease check your connection and try again.`);
    } finally {
      setIsDeleting(false);
    }
  };

  const isEditing = Boolean(dish && dish.name);

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl animate-[slideUp_0.3s_ease-out] max-h-[90vh] overflow-y-auto">
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-3xl z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
              <div className="text-gray-700 text-lg font-semibold">
                Uploading...
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-start gap-4 pb-6 border-b border-gray-200 mb-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isEditing ? `Edit Dish` : "Add New Dish"}
            </h2>
            <p className="text-gray-600 text-base">
              {isEditing
                ? "Update the dish details, price, and availability."
                : "Fill in details to add a new dish to your menu."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
            title="Close"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Dish Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all"
              placeholder="e.g., Chicken Adobo"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all resize-none"
              placeholder="A delicious dish made with..."
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Price <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₱</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full rounded-xl border-2 border-gray-300 pl-10 pr-4 py-3 text-sm text-gray-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all"
                step="1"
                placeholder="10"
              />
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Dish Image
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="image-upload"
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center gap-3 w-full rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-sm text-gray-600 hover:border-rose-400 hover:bg-rose-50/30 transition-all cursor-pointer"
              >
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="font-medium">
                  {selectedFile ? selectedFile.name : "Click to upload an image"}
                </span>
              </label>
            </div>
            {image && (
              <div className="mt-4 relative group">
                <img
                  src={image}
                  alt="Dish Preview"
                  className="w-full h-48 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                />
                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
            <label className="flex items-center gap-3 text-sm font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={hasStock}
                onChange={(e) => setHasStock(e.target.checked)}
                className="h-5 w-5 text-rose-600 rounded focus:ring-2 focus:ring-rose-500 cursor-pointer"
              />
              In Stock
            </label>
            <label className="flex items-center gap-3 text-sm font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={alwaysAvailable}
                onChange={(e) => setAlwaysAvailable(e.target.checked)}
                className="h-5 w-5 text-rose-600 rounded focus:ring-2 focus:ring-rose-500 cursor-pointer"
              />
              Always Available
            </label>
          </div>

          {/* Days */}
          <div>
            <p className="block text-sm font-bold text-gray-900 mb-3">Available Days</p>
            <div className="flex flex-wrap gap-2">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${selectedDays.includes(day)
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md hover:shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          {!alwaysAvailable && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-rose-50 rounded-xl border-2 border-rose-200">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Start Date
                </label>
                <input
                  title="startData"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={today}
                  className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  End Date
                </label>
                <input
                  title="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all"
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Cancel
          </button>
          <button
            disabled={isSaveDisabled || isUploading}
            onClick={handleSave}
            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Dish
          </button>
          {isEditing && (
            <button
              disabled={isDeleting}
              onClick={handleDelete}
              className="px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
