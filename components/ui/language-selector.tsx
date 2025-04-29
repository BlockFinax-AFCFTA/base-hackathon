import React from 'react';
import { Check, Globe } from 'lucide-react';
import { useLanguage, Language, languageOptions } from '../../context/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { Translate } from './translation';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  // Get language display name
  const getLanguageDisplayName = (code: Language) => {
    const option = languageOptions.find(opt => opt.code === code);
    return option ? option.name : code.toUpperCase();
  };

  // Get language flag emoji
  const getLanguageFlag = (code: Language) => {
    const option = languageOptions.find(opt => opt.code === code);
    return option ? option.flag : '';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          <span>{getLanguageFlag(language)} {getLanguageDisplayName(language)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <Translate text="language.select" />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languageOptions.map((option) => (
          <DropdownMenuItem
            key={option.code}
            onClick={() => setLanguage(option.code as Language)}
            className="flex items-center justify-between"
          >
            <span>{getLanguageFlag(option.code as Language)} {option.name}</span>
            {language === option.code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;