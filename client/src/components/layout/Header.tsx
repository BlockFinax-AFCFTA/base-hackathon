import React, { useState, useEffect, useContext, createContext, useCallback, useMemo } from 'react';
import { Menu, X, LogOut, User, LogIn, UserPlus, Globe } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/hooks/useWeb3';
import { useAppContext } from '@/hooks/useAppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LoginDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const { loginUser, createAccount } = useWeb3();
  const { translate } = useLanguage();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginUser(username, password);
    onClose();
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAccount(username, password);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs defaultValue="login" value={tab} onValueChange={(value) => setTab(value as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{translate('actions.login')}</TabsTrigger>
            <TabsTrigger value="register">{translate('actions.register')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <DialogHeader>
                <DialogTitle>{translate('actions.login')}</DialogTitle>
                <DialogDescription>
                  Enter your credentials to access your account.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{translate('actions.login')}</Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <DialogHeader>
                <DialogTitle>{translate('actions.register')}</DialogTitle>
                <DialogDescription>
                  Register to create your account and wallet.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="reg-username">Username</Label>
                  <Input 
                    id="reg-username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input 
                    id="reg-password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{translate('actions.register')}</Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Simple local language types and options for official African Union languages
type Language = 'en' | 'fr' | 'ar' | 'pt' | 'es';

type LanguageOption = {
  code: Language;
  name: string;
  flag: string;
  region: string;
};

// Official languages of the African Union only
const languageOptions: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', region: 'African Union Official' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', region: 'African Union Official' },
  { code: 'ar', name: 'العربية', flag: '🇪🇬', region: 'African Union Official' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', region: 'African Union Official' },
  { code: 'es', name: 'Español', flag: '🇪🇸', region: 'African Union Official' },
];

// Translation data for UI elements
const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.title': 'BlockFinaX',
    'app.slogan': 'Secure Trade Finance for Global Commerce',
    'nav.dashboard': 'Dashboard',
    'nav.contracts': 'Contracts',
    'nav.wallet': 'Wallet',
    'nav.documents': 'Documents',
    'nav.logistics': 'Logistics',
    'nav.marketplace': 'Marketplace',
    'nav.regulatory': 'Regulatory AI',
    'actions.login': 'Login',
    'actions.register': 'Register',
    'language.select': 'Select Language',
    'profile.view': 'Profile',
    'wallet.view': 'Wallet',
    'actions.logout': 'Log out',
  },
  fr: {
    'app.title': 'BlockFinaX',
    'app.slogan': 'Financement Commercial Sécurisé pour le Commerce Mondial',
    'nav.dashboard': 'Tableau de Bord',
    'nav.contracts': 'Contrats',
    'nav.wallet': 'Portefeuille',
    'nav.documents': 'Documents',
    'nav.logistics': 'Logistique',
    'nav.marketplace': 'Marché',
    'nav.regulatory': 'IA Réglementaire',
    'actions.login': 'Connexion',
    'actions.register': 'S\'inscrire',
    'language.select': 'Choisir la Langue',
    'profile.view': 'Profil',
    'wallet.view': 'Portefeuille',
    'actions.logout': 'Déconnexion',
  },
  ar: {
    'app.title': 'بلوك فيناكس',
    'app.slogan': 'تمويل تجاري آمن للتجارة العالمية',
    'nav.dashboard': 'لوحة التحكم',
    'nav.contracts': 'العقود',
    'nav.wallet': 'المحفظة',
    'nav.documents': 'المستندات',
    'nav.logistics': 'الخدمات اللوجستية',
    'nav.marketplace': 'السوق',
    'nav.regulatory': 'الذكاء الاصطناعي التنظيمي',
    'actions.login': 'تسجيل الدخول',
    'actions.register': 'التسجيل',
    'language.select': 'اختر اللغة',
    'profile.view': 'الملف الشخصي',
    'wallet.view': 'المحفظة',
    'actions.logout': 'تسجيل الخروج',
  },
  es: {
    'app.title': 'BlockFinaX',
    'app.slogan': 'Financiación Comercial Segura para el Comercio Global',
    'nav.dashboard': 'Panel',
    'nav.contracts': 'Contratos',
    'nav.wallet': 'Billetera',
    'nav.documents': 'Documentos',
    'nav.logistics': 'Logística',
    'nav.marketplace': 'Mercado',
    'nav.regulatory': 'IA Regulatoria',
    'actions.login': 'Iniciar Sesión',
    'actions.register': 'Registrarse',
    'language.select': 'Seleccionar Idioma',
    'profile.view': 'Perfil',
    'wallet.view': 'Billetera',
    'actions.logout': 'Cerrar Sesión',
  },
  pt: {
    'app.title': 'BlockFinaX',
    'app.slogan': 'Financiamento Comercial Seguro para o Comércio Global',
    'nav.dashboard': 'Painel',
    'nav.contracts': 'Contratos',
    'nav.wallet': 'Carteira',
    'nav.documents': 'Documentos',
    'nav.logistics': 'Logística',
    'nav.marketplace': 'Mercado',
    'nav.regulatory': 'IA Regulatória',
    'actions.login': 'Entrar',
    'actions.register': 'Registrar',
    'language.select': 'Selecionar Idioma',
    'profile.view': 'Perfil',
    'wallet.view': 'Carteira',
    'actions.logout': 'Sair',
  },
};

// Language Provider Context for the application
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  translate: (key: string) => key,
});

// Application-wide language hook
const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language Provider component for the application
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get language from localStorage
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'en';
  });
  
  // Save language selection to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
    // Update the HTML lang attribute
    document.documentElement.lang = language;
    console.log(`Language changed to: ${language}`);
  }, [language]);
  
  // Translation function
  const translate = useCallback(
    (key: string): string => {
      return translations[language]?.[key] || translations['en'][key] || key;
    },
    [language]
  );
  
  const value = useMemo(
    () => ({ 
      language, 
      setLanguage,
      translate 
    }),
    [language, translate]
  );
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Language switcher dropdown
const LanguageSwitcher = () => {
  const { language, setLanguage, translate } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{translate('language.select')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {languageOptions.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? "bg-accent" : ""}
          >
            <span className="mr-2">{lang.flag}</span>
            <span>{lang.name}</span>
            {language === lang.code && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UserMenu = () => {
  const { user, logoutUser } = useWeb3();
  const { translate } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.profileImage} alt={user?.username} />
            <AvatarFallback className="bg-primary text-white">
              {user?.username?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.username}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.walletAddress}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <User className="mr-2 h-4 w-4" />
          <span>{translate('profile.view')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/wallet">
            <div className="flex items-center cursor-pointer w-full">
              <Menu className="mr-2 h-4 w-4" />
              <span>{translate('wallet.view')}</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logoutUser}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{translate('actions.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header = () => {
  const { toggleSidebar } = useAppContext();
  const { isLoggedIn } = useWeb3();
  const { translate } = useLanguage();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="mr-2 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-primary">{translate('app.title')}</h1>
          </div>
          <div className="flex items-center">
            {/* Language Switcher - visible regardless of login state */}
            <LanguageSwitcher />
            
            {isLoggedIn ? (
              <UserMenu />
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setLoginDialogOpen(true)}
                  className="flex items-center gap-1"
                >
                  <LogIn className="h-4 w-4" />
                  <span>{translate('actions.login')}</span>
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => {
                    setLoginDialogOpen(true);
                  }}
                  className="flex items-center gap-1"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{translate('actions.register')}</span>
                </Button>
                
                <LoginDialog 
                  isOpen={loginDialogOpen}
                  onClose={() => setLoginDialogOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
