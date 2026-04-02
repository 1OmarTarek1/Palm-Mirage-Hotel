import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

const roomTypes = [
  { value: "deluxe", label: "Deluxe Room" },
  { value: "double", label: "Double Room" },
  { value: "family", label: "Family Room" },
  { value: "single", label: "Single Room" },
  { value: "twin", label: "Twin Room" },
];

const ratingValues = [1, 2, 3, 4, 5];

const defaultState = {
  price: [0, 1000],
  roomTypes: [],
  ratings: [],
  unrated: false,
};

export default function RoomFilter({ rooms = [], onFilter }) {
  const [price, setPrice] = useState(defaultState.price);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [unrated, setUnrated] = useState(false);

  const roomTypeCounts = useMemo(() => {
    const tally = (rooms || []).reduce((acc, room) => {
      const t = (room.roomType || "").toLowerCase();
      if (!t) return acc;
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});

    return roomTypes.map((type) => ({
      ...type,
      count: tally[type.value] || 0,
    }));
  }, [rooms]);

  const ratingCounts = useMemo(() => {
    const tally = (rooms || []).reduce((acc, room) => {
      const r = Number(room.rating) || 0;
      if (r >= 1 && r <= 5) {
        acc[r] = (acc[r] || 0) + 1;
      }
      return acc;
    }, {});

    return ratingValues.map((value) => ({
      value,
      count: tally[value] || 0,
    }));
  }, [rooms]);

  const unratedCount = useMemo(() => {
    return (rooms || []).filter((room) => !room.rating || Number(room.rating) === 0).length;
  }, [rooms]);

  const toggleItem = (setter, value) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );

  const handleReset = () => {
    setPrice(defaultState.price);
    setSelectedTypes([]);
    setSelectedRatings([]);
    setUnrated(false);
    onFilter?.(defaultState);
  };

  const handleFilter = () => {
    onFilter?.({
      price,
      roomTypes: selectedTypes,
      ratings: selectedRatings,
      unrated,
    });
  };

  return (
    <div className="space-y-7">
      {/* Price Range */}
      <div className="space-y-2">
        <h4 className="text-xl text-left font-header font-bold text-accent-foreground">
          Price
        </h4>
        <Slider
          min={5}
          max={1000}
          step={5}
          value={price}
          onValueChange={setPrice}
          className="w-full"
        />
        <div className="flex gap-2 text-accent-foreground font-bold">
          <span>${price[0]} - </span>
          <span>${price[1].toLocaleString()}</span>
        </div>
      </div>

      <hr className="border-stone-100" />

      {/* Room Types */}
      <div className="space-y-2">
        <h4 className="text-xl text-left font-header font-bold text-accent-foreground">
          Room Types
        </h4>
        <ul className="space-y-2.5">
          {roomTypeCounts.map((type) => (
            <li key={type.value} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  className="border rounded-xs"
                  id={`type-${type.value}`}
                  checked={selectedTypes.includes(type.value)}
                  onCheckedChange={() => toggleItem(setSelectedTypes, type.value)}
                />
                <Label
                  htmlFor={`type-${type.value}`}
                  className="text-sm text-stone-600 cursor-pointer"
                >
                  {type.label}
                </Label>
              </div>
              <span className="text-xs text-stone-400">{type.count}</span>
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-stone-100" />

      {/* Rating */}
      <div className="space-y-2">
        <h4 className="text-xl text-left font-header font-bold text-accent-foreground">
          Rating
        </h4>
        <ul className="space-y-2.5">
          {ratingCounts.map(({ value, count }) => (
            <li key={value} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  className="border rounded-xs"
                  id={`rating-${value}`}
                  checked={selectedRatings.includes(value)}
                  onCheckedChange={() => toggleItem(setSelectedRatings, value)}
                />
                <Label
                  htmlFor={`rating-${value}`}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  {Array.from({ length: value }).map((_, i) => (
                    <Star
                      key={`filled-${value}-${i}`}
                      size={13}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                  {Array.from({ length: 5 - value }).map((_, i) => (
                    <Star
                      key={`empty-${value}-${i}`}
                      size={13}
                      className="text-stone-200 fill-stone-200"
                    />
                  ))}
                </Label>
              </div>
              <span className="text-xs text-stone-400">{count}</span>
            </li>
          ))}

          {/* Unrated */}
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                className="border rounded-xs"
                id="rating-unrated"
                checked={unrated}
                onCheckedChange={setUnrated}
              />
              <Label
                htmlFor="rating-unrated"
                className="text-sm text-stone-600 cursor-pointer"
              >
                Unrated
              </Label>
            </div>
            <span className="text-xs text-stone-400">{unratedCount}</span>
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          variant="palmPrimary"
          onClick={handleFilter}
        >
          Filter
        </Button>
        <Button
          variant="palmSecondary"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
