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

export default function RoomFilter({ rooms = [], onFilter, onReset }) {
  const prices = useMemo(
    () => (rooms || []).map((room) => Number(room.price ?? 0)).filter((price) => Number.isFinite(price) && price > 0),
    [rooms]
  );

  const minPrice = useMemo(() => {
    if (!prices.length) return 0;
    return Math.floor(Math.min(...prices) / 100) * 100;
  }, [prices]);

  const maxPrice = useMemo(() => {
    if (!prices.length) return 1000;
    return Math.ceil(Math.max(...prices) / 100) * 100;
  }, [prices]);

  const [price, setPrice] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [unrated, setUnrated] = useState(false);
  const activePrice = price ?? [minPrice, maxPrice];

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
    setPrice(null);
    setSelectedTypes([]);
    setSelectedRatings([]);
    setUnrated(false);
    onReset?.();
    onFilter?.({
      price: [minPrice, maxPrice],
      roomTypes: [],
      ratings: [],
      unrated: false,
    });
  };

  const handleFilter = () => {
    onFilter?.({
      price: activePrice,
      roomTypes: selectedTypes,
      ratings: selectedRatings,
      unrated,
    });
  };

  return (
    <div className="space-y-7 font-main text-foreground">
      {/* Price Range */}
      <div className="space-y-2">
        <h4 className="text-left font-header text-xl font-bold text-foreground">
          Price
        </h4>
        <Slider
          min={minPrice}
          max={maxPrice}
          step={100}
          value={activePrice}
          onValueChange={setPrice}
          className="w-full"
        />
        <div className="flex gap-2 font-semibold text-foreground">
          <span>${activePrice[0]} - </span>
          <span>${activePrice[1].toLocaleString()}</span>
        </div>
      </div>

      <hr className="border-0 border-t border-border/25" />

      {/* Room Types */}
      <div className="space-y-2">
        <h4 className="text-left font-header text-xl font-bold text-foreground">
          Room Types
        </h4>
        <ul className="space-y-2.5">
          {roomTypeCounts.map((type) => (
            <li key={type.value} className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 cursor-pointer items-center gap-2.5">
                <Checkbox
                  id={`type-${type.value}`}
                  checked={selectedTypes.includes(type.value)}
                  onCheckedChange={() => toggleItem(setSelectedTypes, type.value)}
                />
                <Label
                  htmlFor={`type-${type.value}`}
                  className="cursor-pointer text-sm font-normal text-foreground"
                >
                  {type.label}
                </Label>
              </div>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{type.count}</span>
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-0 border-t border-border/25" />

      {/* Rating */}
      <div className="space-y-2">
        <h4 className="text-left font-header text-xl font-bold text-foreground">
          Rating
        </h4>
        <ul className="space-y-2.5">
          {ratingCounts.map(({ value, count }) => (
            <li key={value} className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 cursor-pointer items-center gap-2.5">
                <Checkbox
                  id={`rating-${value}`}
                  checked={selectedRatings.includes(value)}
                  onCheckedChange={() => toggleItem(setSelectedRatings, value)}
                />
                <Label
                  htmlFor={`rating-${value}`}
                  className="flex cursor-pointer items-center gap-0.5"
                >
                  {Array.from({ length: value }).map((_, i) => (
                    <Star key={`filled-${value}-${i}`} size={13} className="fill-primary text-primary" />
                  ))}
                  {Array.from({ length: 5 - value }).map((_, i) => (
                    <Star
                      key={`empty-${value}-${i}`}
                      size={13}
                      className="fill-transparent text-muted-foreground/40"
                      strokeWidth={1.35}
                    />
                  ))}
                </Label>
              </div>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{count}</span>
            </li>
          ))}

          {/* Unrated */}
          <li className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 cursor-pointer items-center gap-2.5">
              <Checkbox id="rating-unrated" checked={unrated} onCheckedChange={setUnrated} />
              <Label
                htmlFor="rating-unrated"
                className="cursor-pointer text-sm font-normal text-foreground"
              >
                Unrated
              </Label>
            </div>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{unratedCount}</span>
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-row gap-2">
        <Button
          variant="palmPrimary"
          size="sm"
          onClick={handleFilter}
          className="min-w-0 flex-[1.7] px-4"
        >
          Filter
        </Button>
        <Button
          variant="palmSecondary"
          size="sm"
          onClick={handleReset}
          className="min-w-0 flex-1 px-3"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
