import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const sizes = {
    sm: {
      button: 'w-10 h-10',
      icon: 18,
      text: 'text-xl w-12',
    },
    md: {
      button: 'w-12 h-12',
      icon: 22,
      text: 'text-2xl w-14',
    },
    lg: {
      button: 'w-14 h-14',
      icon: 26,
      text: 'text-3xl w-18',
    },
  };

  const sizeConfig = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={value <= min}
        className={`${sizeConfig.button} flex items-center justify-center bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white transition-colors active:scale-95`}
      >
        <Minus size={sizeConfig.icon} />
      </button>

      <span className={`${sizeConfig.text} font-bold text-white text-center`}>
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrease}
        disabled={value >= max}
        className={`${sizeConfig.button} flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white transition-colors active:scale-95`}
      >
        <Plus size={sizeConfig.icon} />
      </button>
    </div>
  );
}
