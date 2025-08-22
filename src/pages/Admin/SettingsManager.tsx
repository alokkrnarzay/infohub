import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { deleteKV, isSupabaseConfigured } from '@/lib/supabase';

type SiteContact = {
  email: string;
  address: string;
};

const defaultContact: SiteContact = {
  email: 'alokkrnarzary@gmail.com',
  address: 'Kokrajhar, 783370',
};

type SiteNotice = {
  text: string;
  enabled: boolean;
};

const defaultNotice: SiteNotice = { text: '', enabled: false };

export default function SettingsManager() {
  const { isAdmin } = useAuth();
  const [siteContact, setSiteContact] = useLocalStorage<SiteContact>('site_contact', defaultContact);
  const [email, setEmail] = useState(siteContact.email || '');
  const [address, setAddress] = useState(siteContact.address || '');
  const [siteNotice, setSiteNotice] = useLocalStorage<SiteNotice>('site_notice', defaultNotice);
  const [noticeText, setNoticeText] = useState(siteNotice.text || '');
  const [noticeEnabled, setNoticeEnabled] = useState<boolean>(!!siteNotice.enabled);

  if (!isAdmin) {
    return (
      <div className="max-w-3xl">
        <p className="text-sm text-gray-600">Only administrators can access site settings.</p>
      </div>
    );
  }

  const handleSave = () => {
    if (!email.trim()) {
      toast.error('Email cannot be empty');
      return;
    }
    const payloadContact = { email: email.trim(), address: address.trim() };
    const payloadNotice = { text: noticeText || '', enabled: !!noticeEnabled };

    // If there's a configured admin API key, call server endpoint which uses service role key.
    const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY as string | undefined;
    if (adminApiKey) {
      (async () => {
        try {
          const devApi = import.meta.env.DEV ? 'http://localhost:8787/admin/settings' : '/api/admin/settings';
          await fetch(devApi, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-key': adminApiKey,
            },
            body: JSON.stringify({ key: 'site_contact', value: payloadContact }),
          });

          await fetch(devApi, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-key': adminApiKey,
            },
            body: JSON.stringify({ key: 'site_notice', value: payloadNotice }),
          });

          // update local copies
          setSiteContact(payloadContact);
          setSiteNotice(payloadNotice);
          toast.success('Contact settings updated');
        } catch (err) {
          console.warn('admin API write failed', err);
          // fallback to local + direct supabase/upstash
          setSiteContact(payloadContact);
          setSiteNotice(payloadNotice);
          toast.success('Updated locally (remote failed)');
        }
      })();
    } else {
      // fallback: direct client-side sync (existing behavior)
      setSiteContact(payloadContact);
      setSiteNotice(payloadNotice);
      toast.success('Contact settings updated');
    }
  };

  const handleReset = () => {
    setEmail(defaultContact.email);
    setAddress(defaultContact.address);
    setSiteContact(defaultContact);
    toast.success('Reset to defaults');
  };

  const handleClearRemote = async () => {
    // Clear local values first
    setEmail('');
    setAddress('');
    setSiteContact({ email: '', address: '' });
    setNoticeText('');
    setNoticeEnabled(false);

    let ok = true;
    if (isSupabaseConfigured) {
      try {
        const a = await deleteKV('site_contact');
        const b = await deleteKV('site_notice');
        ok = a && b;
      } catch (err) {
        ok = false;
        console.warn('Error deleting remote keys', err);
      }
    } else {
      // eslint-disable-next-line no-console
      console.debug('[SettingsManager] supabase not configured; only local values cleared');
    }

    if (ok) {
      toast.success('Cleared settings locally and remotely');
    } else {
      toast.success('Cleared local settings (remote not configured or failed)');
    }
  };

  return (
    <div className="max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Site Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="site-email">Contact Email</Label>
              <Input id="site-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@example.com" />
            </div>

            <div>
              <Label htmlFor="site-address">Address</Label>
              <Input id="site-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="City, ZIP" />
            </div>

            <div>
              <Label htmlFor="site-notice">Site Notice (sliding)</Label>
              <Textarea id="site-notice" value={noticeText} onChange={(e) => setNoticeText(e.target.value)} placeholder="Enter notice text to slide across the top" rows={3} />
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox" checked={noticeEnabled} onChange={(e) => setNoticeEnabled(e.target.checked)} />
                  <span className="ml-2 text-sm">Enable notice</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={handleReset}>Reset</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
