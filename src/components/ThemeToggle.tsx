import { Moon, Sun, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Theme } from '@/lib/types';

interface ThemeToggleProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  const themes = [
    { name: 'light', label: 'Light', icon: Sun },
    { name: 'dark', label: 'Dark', icon: Moon },
    { name: 'emerald', label: 'Emerald', icon: Palette },
    { name: 'indigo', label: 'Indigo', icon: Palette },
    { name: 'rose', label: 'Rose', icon: Palette },
  ] as const;

  const currentTheme = themes.find(t => t.name === theme) || themes[0];
  const Icon = currentTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Icon className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((themeOption) => {
          const ThemeIcon = themeOption.icon;
          return (
            <DropdownMenuItem
              key={themeOption.name}
              onClick={() => onThemeChange(themeOption.name)}
              className="flex items-center gap-2"
            >
              <ThemeIcon className="h-4 w-4" />
              {themeOption.label}
              {theme === themeOption.name && (
                <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}