import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const mapActivity = (activity) => ({
  id: activity._id ?? activity.id,
  category: activity.category,
  label: activity.label,
  title: activity.title,
  description: activity.description,
  image:
    typeof activity.image === "string"
      ? activity.image
      : activity.image?.secure_url || "",
  stats: activity.stats ?? [],
  highlights: activity.highlights ?? [],
  icon: activity.icon,
  createdAt: activity.createdAt,
});

export async function fetchActivities() {
  try {
    const { data } = await axios.get(`${API_BASE}/activity`);
    return (data?.data?.activities ?? []).map(mapActivity);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }

    throw new Error("Failed to fetch activities");
  }
}
