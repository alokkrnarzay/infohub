import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function TermsOfService() {
  const [siteContact] = useLocalStorage('site_contact', { email: 'alokkrnarzary@gmail.com', address: 'Kokrajhar, 783370' });
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
            <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm sm:prose lg:prose-lg max-w-none">
            <p>
              These Terms of Service ("Terms") govern your access to and use of InfoHub (the "Service"). By accessing or using the Service, you agree to be bound by these Terms.
            </p>

            <h3>1. Use of the Service</h3>
            <ul>
              <li>You must be at least 13 years old to use the Service.</li>
              <li>You agree to use the Service only for lawful purposes and in accordance with these Terms.</li>
              <li>You are responsible for maintaining the security of your account and device.</li>
            </ul>

            <h3>2. User Content</h3>
            <ul>
              <li>You may submit comments, reviews, or other content ("User Content").</li>
              <li>You retain ownership of your User Content, but grant us a non-exclusive, worldwide, royalty-free license to display, reproduce, and distribute your User Content on the Service.</li>
              <li>We reserve the right to moderate, approve, or remove User Content at our discretion.</li>
            </ul>

            <h3>3. Intellectual Property</h3>
            <p>
              The Service and its original content, features, and functionality are owned by InfoHub and are protected by intellectual property laws. You may not copy, modify, or distribute any part of the Service without our prior written consent.
            </p>

            <h3>4. Third-Party Links</h3>
            <p>
              The Service may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the content, privacy policies, or practices of any third-party sites or services.
            </p>

            <h3>5. Disclaimer of Warranties</h3>
            <p>
              The Service is provided on an "as is" and "as available" basis. We make no warranties, express or implied, regarding the Service, including but not limited to merchantability, fitness for a particular purpose, or non-infringement.
            </p>

            <h3>6. Limitation of Liability</h3>
            <p>
              To the fullest extent permitted by law, InfoHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, arising from your use of the Service.
            </p>

            <h3>7. Indemnification</h3>
            <p>
              You agree to indemnify and hold InfoHub harmless from any claims, damages, losses, liabilities, and expenses (including attorney's fees) arising out of your use of the Service or violation of these Terms.
            </p>

            <h3>8. Termination</h3>
            <p>
              We may suspend or terminate your access to the Service at any time, without prior notice or liability, for any reason, including if you breach these Terms.
            </p>

            <h3>9. Changes to the Terms</h3>
            <p>
              We may update these Terms from time to time. We will update the "Last updated" date at the top of this page. Your continued use of the Service after any modifications constitutes acceptance of the new Terms.
            </p>

            <h3>10. Governing Law</h3>
            <p>
              These Terms are governed by and construed in accordance with the laws of your local jurisdiction, without regard to its conflict of law provisions.
            </p>

            <h3>11. Contact Us</h3>
            <p>
              If you have questions about these Terms, please contact us at:
            </p>
            <ul>
              <li>Email: {siteContact.email}</li>
              <li>Address: {siteContact.address}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
