// src/app/components/ui/ThemeToggle.tsx
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl bg-[#E8F5E9] dark:bg-[#1A3A1A] text-[#2E7D32] dark:text-[#66BB6A] hover:bg-[#A5D6A7]/30 dark:hover:bg-[#2E4A2E] transition"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}