import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BriefcaseIcon, 
  GraduationCapIcon, 
  CalendarIcon, 
  AwardIcon, 
  LinkIcon, 
  HeadphonesIcon 
} from 'lucide-react';

const categories = [
  {
    title: 'Job Opportunities',
    description: 'Find private jobs, government positions, and internships',
    icon: BriefcaseIcon,
    href: '/jobs',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Education',
    description: 'Regular admissions, distance learning, and certification courses',
    icon: GraduationCapIcon,
    href: '/education',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Current Events',
    description: 'Stay updated with national, international, and state events',
    icon: CalendarIcon,
    href: '/events',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    title: 'Scholarships',
    description: 'Private and government scholarship opportunities',
    icon: AwardIcon,
    href: '/scholarships',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    title: 'Useful Resources',
    description: 'Helpful websites and applications for your success',
    icon: LinkIcon,
    href: '/resources',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    title: 'Support',
    description: 'Contact us, rate our service, and share feedback',
    icon: HeadphonesIcon,
    href: '/support',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Gateway to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Opportunities
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover jobs, educational opportunities, events, scholarships, and valuable resources 
            all in one comprehensive platform. Your success journey starts here.
          </p>
          <Button size="lg" asChild className="text-lg px-8 py-3">
            <Link to="/jobs">Explore Opportunities</Link>
          </Button>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categories" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Our Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.title} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                      <IconComponent className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={category.href}>Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Job Opportunities</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Educational Programs</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">250+</div>
              <div className="text-blue-100">Scholarships</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Useful Resources</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who have found their perfect opportunities through InfoHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/education">Explore Education</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}