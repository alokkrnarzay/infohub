import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PaymentSettings } from '@/types';
import { toast } from 'sonner';

const initialSettings: PaymentSettings = {
  url: '',
  isActive: true,
  updatedAt: new Date().toISOString(),
};

const isSafeHttpUrl = (url: string) => {
  if (!url) return true; // allow empty (treated as removed)
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

export default function PaymentManager() {
  const [settings, setSettings] = useLocalStorage<PaymentSettings>('payment_settings', initialSettings);
  const [url, setUrl] = useState(settings.url);

  useEffect(() => {
    setUrl(settings.url);
  }, [settings.url]);

  const save = () => {
    if (!isSafeHttpUrl(url)) {
      toast.error('Invalid URL. Please use a valid http(s) link.');
      return;
    }
    const next = { ...settings, url: url.trim(), updatedAt: new Date().toISOString() };
    setSettings(next);
    toast.success('Payment link saved');
  };

  const toggleActive = () => {
    const next = { ...settings, isActive: !settings.isActive, updatedAt: new Date().toISOString() };
    setSettings(next);
    toast.success(`Payment link ${next.isActive ? 'activated' : 'deactivated'}`);
  };

  const clear = () => {
    const next = { ...settings, url: '', updatedAt: new Date().toISOString() };
    setSettings(next);
    toast.success('Payment link removed');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payment Link</h2>
        <Badge variant={settings.isActive ? 'default' : 'secondary'}>
          {settings.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configure Payment Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="paymentUrl">Payment URL</Label>
            <Input
              id="paymentUrl"
              type="url"
              placeholder="https://your-payment-provider.com/checkout"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-2">
              Leave empty to disable the button on the Donate page.
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={save}>Save</Button>
            <Button variant="outline" onClick={toggleActive}>
              {settings.isActive ? 'Deactivate' : 'Activate'}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Remove</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Payment Link</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear the configured payment URL. You can add it again later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clear}>Remove</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {settings.url && (
            <div className="text-sm text-gray-600 mt-2">
              Current link: <a className="text-blue-600 underline" href={settings.url} target="_blank" rel="noopener noreferrer">{settings.url}</a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
