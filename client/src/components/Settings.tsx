import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { RestaurantConfig } from '@/lib/config';

interface SettingsProps {
  config: RestaurantConfig;
  language: string;
  onLanguageChange: (language: string) => void;
  onSettingsUpdate: (settings: Partial<RestaurantConfig>) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  config,
  language,
  onLanguageChange,
  onSettingsUpdate
}) => {
  const { toast } = useToast();
  const [autoCalculateTax, setAutoCalculateTax] = useState<boolean>(config.settings?.autoCalculateTax || true);
  const [soundNotifications, setSoundNotifications] = useState(config.settings?.soundNotifications || false);
  const [printBillAutomatically, setPrintBillAutomatically] = useState(config.settings?.printBillAutomatically || false);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState(config.settings?.defaultPaymentMethod || 'cash');

  // Helper function to get localized text
  const getLocalizedText = (textObj: any, lang: string = language): string => {
    if (typeof textObj === 'string') return textObj;
    if (typeof textObj === 'object' && textObj !== null) {
      return textObj[lang] || textObj['en'] || textObj[Object.keys(textObj)[0]] || '';
    }
    return '';
  };

  const handleLanguageChange = (newLanguage: string) => {
    onLanguageChange(newLanguage);
    toast({
      title: newLanguage === 'hi' ? 'भाषा बदली गई' : 'Language Changed',
      description: newLanguage === 'hi' ? `भाषा हिंदी में बदल दी गई` : `Language changed to English`,
    });
  };

  const handleSaveSettings = () => {
    const updatedSettings = {
      ...config,
      language,
      settings: {
        ...config.settings,
        autoCalculateTax,
        soundNotifications,
        printBillAutomatically,
        defaultPaymentMethod,
      }
    };
    
    onSettingsUpdate(updatedSettings);
    toast({
      title: language === 'hi' ? 'सेटिंग्स सेव हो गईं' : 'Settings Saved',
      description: language === 'hi' ? 'आपकी सेटिंग्स सफलतापूर्वक सेव हो गई हैं' : 'Your settings have been saved successfully',
    });
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2">
          {language === 'hi' ? 'सेटिंग्स' : 'Settings'}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          {language === 'hi' ? 'अपने रेस्तरां की सेटिंग्स को कस्टमाइज़ करें' : 'Customize your restaurant settings'}
        </p>
      </div>

      <div className="grid gap-3 sm:gap-6">
        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'hi' ? 'भाषा सेटिंग्स' : 'Language Settings'}</CardTitle>
            <CardDescription>
              {language === 'hi' ? 'एप्लिकेशन की भाषा चुनें' : 'Choose the application language'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{language === 'hi' ? 'भाषा' : 'Language'}</Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Restaurant Information */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'hi' ? 'रेस्तरां की जानकारी' : 'Restaurant Information'}</CardTitle>
            <CardDescription>
              {language === 'hi' ? 'बुनियादी रेस्तरां विवरण' : 'Basic restaurant details'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label className="text-sm">{language === 'hi' ? 'रेस्तरां का नाम' : 'Restaurant Name'}</Label>
                <Input value={getLocalizedText(config.restaurantName)} disabled className="text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">{language === 'hi' ? 'फोन नंबर' : 'Phone Number'}</Label>
                <Input value={config.phone} disabled className="text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">{language === 'hi' ? 'ईमेल' : 'Email'}</Label>
                <Input value={config.email} disabled className="text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">{language === 'hi' ? 'पता' : 'Address'}</Label>
                <Input value={config.address} disabled className="text-sm" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'hi' ? 'ऑर्डर सेटिंग्स' : 'Order Settings'}</CardTitle>
            <CardDescription>
              {language === 'hi' ? 'ऑर्डर प्रोसेसिंग के लिए सेटिंग्स' : 'Settings for order processing'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{language === 'hi' ? 'ऑटो टैक्स कैलकुलेशन' : 'Auto Calculate Tax'}</Label>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'ऑर्डर में टैक्स अपने आप जोड़ें' : 'Automatically add tax to orders'}
                </p>
              </div>
              <Switch
                checked={autoCalculateTax}
                onCheckedChange={setAutoCalculateTax}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>{language === 'hi' ? 'डिफ़ॉल्ट पेमेंट मेथड' : 'Default Payment Method'}</Label>
              <Select value={defaultPaymentMethod} onValueChange={setDefaultPaymentMethod}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">{language === 'hi' ? 'नकद' : 'Cash'}</SelectItem>
                  <SelectItem value="card">{language === 'hi' ? 'कार्ड' : 'Card'}</SelectItem>
                  <SelectItem value="upi">{language === 'hi' ? 'यूपीआई' : 'UPI'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'hi' ? 'सिस्टम सेटिंग्स' : 'System Settings'}</CardTitle>
            <CardDescription>
              {language === 'hi' ? 'एप्लिकेशन व्यवहार सेटिंग्स' : 'Application behavior settings'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{language === 'hi' ? 'साउंड नोटिफिकेशन' : 'Sound Notifications'}</Label>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'नए ऑर्डर के लिए साउंड चालू करें' : 'Enable sound for new orders'}
                </p>
              </div>
              <Switch
                checked={soundNotifications}
                onCheckedChange={setSoundNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{language === 'hi' ? 'ऑटो प्रिंट बिल' : 'Auto Print Bill'}</Label>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'ऑर्डर पूरा होने पर बिल अपने आप प्रिंट करें' : 'Automatically print bill when order is completed'}
                </p>
              </div>
              <Switch
                checked={printBillAutomatically}
                onCheckedChange={setPrintBillAutomatically}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tax Information */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'hi' ? 'टैक्स जानकारी' : 'Tax Information'}</CardTitle>
            <CardDescription>
              {language === 'hi' ? 'वर्तमान टैक्स दरें' : 'Current tax rates'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label className="text-sm">{language === 'hi' ? 'जीएसटी दर' : 'GST Rate'}</Label>
                <Input value={`${config.gstRate}%`} disabled className="text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">{language === 'hi' ? 'सीजीएसटी दर' : 'CGST Rate'}</Label>
                <Input value={`${(config as any).cgstRate || config.gstRate / 2}%`} disabled className="text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">{language === 'hi' ? 'एसजीएसटी दर' : 'SGST Rate'}</Label>
                <Input value={`${(config as any).sgstRate || config.gstRate / 2}%`} disabled className="text-sm" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="w-full sm:w-auto text-sm">
          {language === 'hi' ? 'सेटिंग्स सेव करें' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};