import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const resolveImage = (image) =>
  typeof image === "string" ? image : image?.secure_url || "";

const mapActivity = (activity) => ({
  id: activity._id ?? activity.id,
  category: activity.category,
  label: activity.label,
  title: activity.title,
  description: activity.description,
  location: activity.location ?? "",
  basePrice: Number(activity.basePrice ?? 0),
  pricingType: activity.pricingType ?? "per_person",
  durationMinutes: Number(activity.durationMinutes ?? 60),
  defaultCapacity: Number(activity.defaultCapacity ?? 1),
  isActive: Boolean(activity.isActive ?? true),
  image: resolveImage(activity.image),
  stats: activity.stats ?? [],
  highlights: activity.highlights ?? [],
  icon: activity.icon,
  createdAt: activity.createdAt,
});

const mapSchedule = (schedule) => ({
  id: schedule._id ?? schedule.id,
  activityId: schedule.activity?._id ?? schedule.activity?.id,
  activityTitle: schedule.activity?.title ?? "",
  activityLabel: schedule.activity?.label ?? "",
  date: schedule.date?.slice(0, 10) ?? "",
  startTime: schedule.startTime,
  endTime: schedule.endTime,
  capacity: Number(schedule.capacity ?? 0),
  availableSeats: Number(schedule.availableSeats ?? 0),
  priceOverride:
    schedule.priceOverride === null || schedule.priceOverride === undefined
      ? null
      : Number(schedule.priceOverride),
  resolvedPrice: Number(
    schedule.resolvedPrice ?? schedule.priceOverride ?? schedule.activity?.basePrice ?? 0
  ),
  pricingType: schedule.activity?.pricingType ?? "per_person",
  status: schedule.status,
  notes: schedule.notes ?? "",
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

export async function fetchActivityById(activityId) {
  try {
    const { data } = await axios.get(`${API_BASE}/activity/${activityId}`);
    return mapActivity(data?.data?.activity);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }

    throw new Error("Failed to fetch activity");
  }
}

export async function fetchActivitySchedules(activityId) {
  try {
    const endpoint = activityId
      ? `${API_BASE}/activity/${activityId}/schedules`
      : `${API_BASE}/activity-schedules`;

    const { data } = await axios.get(endpoint);
    return (data?.data?.schedules ?? []).map(mapSchedule);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }

    throw new Error("Failed to fetch activity schedules");
  }
}
