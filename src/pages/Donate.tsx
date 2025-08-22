import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PaymentSettings } from '@/types';

const FALLBACK_URL = '/#categories';
const DEFAULT_PAYMENT_URL = 'https://payments.cashfree.com/forms/akny';

export default function Donate() {
  const [settings] = useLocalStorage<PaymentSettings>('payment_settings', {
    url: '',
    isActive: true,
    updatedAt: new Date().toISOString(),
  });
  const targetUrl = settings.isActive ? (settings.url || DEFAULT_PAYMENT_URL) : FALLBACK_URL;
  const isExternal = /^https?:\/\//i.test(targetUrl);
  const [siteContact] = useLocalStorage('site_contact', { email: 'alokkrnarzary@gmail.com', address: 'Kokrajhar, 783370' });
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Support Our Work</CardTitle>
            <p className="text-sm text-gray-500 mt-2">Every contribution helps us keep the platform updated and free.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-gray-700">
                If you find this website useful, consider supporting us. Click the button below to proceed to our secure payment page.
              </p>

              <div>
                <Button asChild size="lg" className="w-full sm:w-auto">
                  {isExternal ? (
                    <a href={targetUrl} target="_blank" rel="noopener noreferrer">
                      {settings.isActive ? 'Pay Now' : 'Explore Our Categories'}
                    </a>
                  ) : (
                    <a href={targetUrl}>
                      Explore Our Categories
                    </a>
                  )}
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Having issues with the link? Email us at <a href={`mailto:${siteContact.email}`} className="underline">{siteContact.email}</a>.
                </p>
              </div>

              <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-900">
                <p>
                  {settings.isActive
                    ? 'You will be redirected to our secure payment provider.'
                    : 'Explore categories to find opportunities across jobs, education, events, and scholarships.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
