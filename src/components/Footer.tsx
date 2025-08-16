import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">InfoHub</h3>
            <p className="text-gray-300 mb-4">
              Your comprehensive gateway to opportunities in jobs, education, events, and scholarships.
              Stay informed and never miss an opportunity.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2" />
                freeinformationetc@gmail.com
              </div>
                          </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="text-gray-300 hover:text-white transition-colors">Jobs</Link></li>
              <li><Link to="/education" className="text-gray-300 hover:text-white transition-colors">Education</Link></li>
              <li><Link to="/events" className="text-gray-300 hover:text-white transition-colors">Events</Link></li>
              <li><Link to="/scholarships" className="text-gray-300 hover:text-white transition-colors">Scholarships</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/support" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/resources" className="text-gray-300 hover:text-white transition-colors">Resources</Link></li>
              <li><Link to="/donate" className="text-gray-300 hover:text-white transition-colors">Donate</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} InfoHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}