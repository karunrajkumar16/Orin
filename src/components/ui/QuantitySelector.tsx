"use client";

interface QuantitySelectorProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

export default function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
    const decrement = () => onChange(Math.max(min, value - 1));
    const increment = () => onChange(Math.min(max, value + 1));

    return (
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white w-fit">
            <button
                type="button"
                onClick={decrement}
                disabled={value <= min}
                className="w-10 h-10 flex items-center justify-center text-lg font-medium text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
                −
            </button>
            <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-gray-900 select-none">
                {value}
            </span>
            <button
                type="button"
                onClick={increment}
                disabled={value >= max}
                className="w-10 h-10 flex items-center justify-center text-lg font-medium text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
                +
            </button>
        </div>
    );
}
