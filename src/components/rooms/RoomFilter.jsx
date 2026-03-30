import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

const roomTypes = [
  { value: "deluxe", label: "Deluxe Room", count: 13 },
  { value: "double", label: "Double Room", count: 11 },
  { value: "family", label: "Family Room", count: 15 },
  { value: "single", label: "Single Room", count: 7 },
  { value: "twin", label: "Twin Room", count: 5 },
];

const ratings = [
  { value: 1, count: 1 },
  { value: 2, count: 0 },
  { value: 3, count: 0 },
  { value: 4, count: 3 },
  { value: 5, count: 2 },
];

const defaultState = {
  price: [0, 1000],
  roomTypes: [],
  ratings: [],
  unrated: false,
};

export default function RoomFilter({ onFilter }) {
  const [price, setPrice] = useState(defaultState.price);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [unrated, setUnrated] = useState(false);

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
          {roomTypes.map((type) => (
            <li key={type.id} className="flex items-center justify-between">
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
          {ratings.map(({ value, count }) => (
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
                      key={i}
                      size={13}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                  {Array.from({ length: 5 - value }).map((_, i) => (
                    <Star
                      key={i}
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
            <span className="text-xs text-stone-400">17</span>
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
