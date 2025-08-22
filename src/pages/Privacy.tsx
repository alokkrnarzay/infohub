import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function PrivacyPolicy() {
  const [siteContact] = useLocalStorage('site_contact', { email: 'alokkrnarzary@gmail.com', address: 'Kokrajhar, 783370' });
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
            <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm sm:prose lg:prose-lg max-w-none">
            <p>
              This Privacy Policy describes how InfoHub ("we", "us", or "our") collects, uses, and protects your information when you use our website and services (the "Service").
            </p>

            <h3>1. Information We Collect</h3>
            <p>
              We aim to collect only the information necessary to provide and improve our Service. Depending on how you use the site, this may include:
            </p>
            <ul>
              <li>
                Contact information you provide (e.g., name and email) when submitting feedback or contacting support.
              </li>
              <li>
                Feedback content, ratings, and timestamps when you post comments or reviews.
              </li>
              <li>
                Usage information such as pages visited and basic interactions, typically stored locally in your browser.
              </li>
            </ul>

            <h3>2. Local Storage and Cookies</h3>
            <p>
              Our site primarily uses your browser's local storage to persist data such as your submitted comments and certain preferences on the device you use. This means your data may be accessible only from the same browser and device where it was created. We do not use third-party tracking cookies.
            </p>

            <h3>3. How We Use Information</h3>
            <ul>
              <li>To operate, maintain, and improve the Service.</li>
              <li>To display user feedback and reviews (subject to moderation).</li>
              <li>To communicate with you if you contact us for support.</li>
              <li>To ensure the security and integrity of the Service.</li>
            </ul>

            <h3>4. Sharing of Information</h3>
            <p>
              We do not sell your personal information. We may share information only as required by law, to protect our rights, or to comply with legal processes. Because data is generally stored in your browser, it is not routinely sent to our servers or third parties.
            </p>

            <h3>5. Data Retention</h3>
            <p>
              Data stored in your browser (e.g., local storage) remains until you clear it or your browser removes it. If you would like to remove your feedback or other data, you can clear your browser data or contact us for guidance.
            </p>

            <h3>6. Security</h3>
            <p>
              We take reasonable measures to protect your information. However, no method of electronic storage or transmission over the Internet is 100% secure. You are responsible for maintaining the security of your own device and browser.
            </p>

            <h3>7. Children's Privacy</h3>
            <p>
              Our Service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us so we can take appropriate action.
            </p>

            <h3>8. Your Rights</h3>
            <p>
              Depending on your location, you may have rights to access, correct, or delete your personal information. Because most data resides in your local browser storage, you may directly clear it from your device. For any questions or requests, contact us at the email below.
            </p>

            <h3>9. Third-Party Links</h3>
            <p>
              Our site may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review their policies.
            </p>

            <h3>10. Changes to This Policy</h3>
            <p>
              We may update this Privacy Policy from time to time. We will update the "Last updated" date at the top of this page. Your continued use of the Service after changes become effective constitutes your acceptance of the revised policy.
            </p>

            <h3>11. Contact Us</h3>
            <p>
              If you have questions about this Privacy Policy or our practices, contact us at:
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
