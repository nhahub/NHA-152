import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({
  filters,
  handleFilter,
  priceRange = [0, 0],
  priceLimits = [0, 0],
  onPriceRangeChange,
}) {
  const [minLimit, maxLimit] = priceLimits;
  const [minPrice, maxPrice] = priceRange;

  const canAdjustPrice = onPriceRangeChange && maxLimit > minLimit;

  function handleMinChange(event) {
    if (!canAdjustPrice) return;
    const requestedValue = Number(event.target.value);
    const clampedValue = Math.min(requestedValue, maxPrice);
    onPriceRangeChange([clampedValue, maxPrice]);
  }

  function handleMaxChange(event) {
    if (!canAdjustPrice) return;
    const requestedValue = Number(event.target.value);
    const clampedValue = Math.max(requestedValue, minPrice);
    onPriceRangeChange([minPrice, clampedValue]);
  }

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-bold">{keyItem}</h3>
              <div className="grid gap-2 mt-2">
                {filterOptions[keyItem].map((option) => (
                  <Label key={option.id} className="flex font-medium items-center gap-2 ">
                    <Checkbox
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}

        {/* Price Slider */}
        <div className="pt-2">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Price Range</h3>
          {canAdjustPrice ? (
            <div className="mt-4 space-y-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600 dark:text-slate-400 mb-1">Min Price</span>
                  <span className="text-lg font-semibold text-[#3785D8] dark:text-[#BF8CE1]">
                    ${minPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-600 dark:text-slate-400 mb-1">Max Price</span>
                  <span className="text-lg font-semibold text-[#BF8CE1] dark:text-[#3785D8]">
                    ${maxPrice.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="space-y-4 pt-2">
                <div className="relative">
                  <input
                    type="range"
                    min={minLimit}
                    max={maxLimit}
                    value={minPrice}
                    onChange={handleMinChange}
                    className="w-full h-2 bg-gradient-to-r from-[#3785D8] to-slate-200 dark:to-slate-700 rounded-lg appearance-none cursor-pointer accent-[#3785D8]"
                    style={{
                      background: `linear-gradient(to right, #3785D8 0%, #3785D8 ${((minPrice - minLimit) / (maxLimit - minLimit)) * 100}%, #e2e8f0 ${((minPrice - minLimit) / (maxLimit - minLimit)) * 100}%, #e2e8f0 100%)`
                    }}
                    aria-label="Minimum price"
                  />
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={minLimit}
                    max={maxLimit}
                    value={maxPrice}
                    onChange={handleMaxChange}
                    className="w-full h-2 bg-gradient-to-r from-slate-200 dark:from-slate-700 to-[#BF8CE1] rounded-lg appearance-none cursor-pointer accent-[#BF8CE1]"
                    style={{
                      background: `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${((maxPrice - minLimit) / (maxLimit - minLimit)) * 100}%, #BF8CE1 ${((maxPrice - minLimit) / (maxLimit - minLimit)) * 100}%, #BF8CE1 100%)`
                    }}
                    aria-label="Maximum price"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>${minLimit.toFixed(2)}</span>
                <span>${maxLimit.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-gray-600 dark:text-slate-400 text-center">
                Price filtering becomes available once products are loaded.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductFilter;
