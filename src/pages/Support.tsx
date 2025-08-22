import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, MapPin, Star, MessageCircle, Send } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Comment, PaymentSettings } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const initialComments: Comment[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Great platform! Found my dream job through the job section.',
    rating: 5,
    createdAt: '2024-01-15',
    isApproved: true
  },
  {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    message: 'The scholarship section helped me fund my education. Highly recommended!',
    rating: 4,
    createdAt: '2024-01-20',
    isApproved: true
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    message: 'Very useful resource for staying updated with current events.',
    rating: 5,
    createdAt: '2024-01-25',
    isApproved: true
  }
];

export default function Support() {
  const [comments, setComments] = useLocalStorage<Comment[]>('comments', initialComments);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { isAdmin } = useAuth();
  const [payment] = useLocalStorage<PaymentSettings>('payment_settings', {
    url: '',
    isActive: true,
    updatedAt: new Date().toISOString(),
  });
  const DEFAULT_PAYMENT_URL = 'https://payments.cashfree.com/forms/akny';
  const [siteContact] = useLocalStorage('site_contact', { email: 'freeinformationetc@gmail.com', address: 'Kokrajhar, 783370' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isAdmin) {
      toast.error('Only users can submit feedback.');
      return;
    }
    
    if (!name || !email || !message || rating === 0) {
      toast.error('Please fill in all fields and provide a rating.');
      return;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      name,
      email,
      message,
      rating,
      createdAt: new Date().toISOString(),
      isApproved: false
    };

    setComments([newComment, ...comments]);
    setName('');
    setEmail('');
    setMessage('');
    setRating(0);
  // remember this browser as the owner of the last-submitted email so user can edit their comment
  try { localStorage.setItem('last_comment_email', newComment.email); } catch (e) { console.warn('Could not persist last_comment_email', e); }
  setOwnerEmail(newComment.email);
    
    toast.success('Thank you for your feedback! Your comment is under review.');
  };

  const renderStars = (currentRating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 cursor-pointer transition-colors ${
          index < currentRating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
        onClick={() => setRating(index + 1)}
        onMouseEnter={() => setHoveredRating(index + 1)}
        onMouseLeave={() => setHoveredRating(0)}
      />
    ));
  };

  const displayRating = hoveredRating || rating;

  // allow same-browser user to edit their comments (tracked by last submitted email)
  const [ownerEmail, setOwnerEmail] = useState(() => {
    try { return localStorage.getItem('last_comment_email') || ''; } catch { return ''; }
  });

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [editRating, setEditRating] = useState(0);

  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditName(comment.name);
    setEditEmail(comment.email);
    setEditMessage(comment.message);
    setEditRating(comment.rating);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
  };

  const submitEdit = (id: string) => {
    if (!editName || !editEmail || !editMessage || editRating === 0) {
      toast.error('Please fill all fields and provide a rating.');
      return;
    }
    const updated = comments.map(c =>
      c.id === id ? { ...c, name: editName, email: editEmail, message: editMessage, rating: editRating, updatedAt: new Date().toISOString(), isApproved: false } : c
    );
    setComments(updated);
    // update owner email to edited email
  try { localStorage.setItem('last_comment_email', editEmail); } catch (e) { console.warn('Could not persist last_comment_email', e); }
    setOwnerEmail(editEmail);
    setEditingCommentId(null);
    toast.success('Your comment was updated and is pending review.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Support & Feedback</h1>
          <p className="text-gray-600 mb-6">
            Get in touch with us or share your experience with our platform
          </p>

          <Tabs defaultValue="contact" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contact">Contact Us</TabsTrigger>
              <TabsTrigger value="feedback">Leave Feedback</TabsTrigger>
              <TabsTrigger value="reviews">User Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="contact" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-blue-600" />
                      Contact Information
                    </CardTitle>
                    <CardDescription>
                      Reach out to us through any of the following channels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-gray-600">{siteContact.email}</p>
                      </div>
                    </div>
                                        <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-gray-600">{siteContact.address}</p>
                      </div>
                    </div>

                    {/* Payment Link CTA */}
                    <div className="pt-2">
                      {payment.isActive ? (
                        <Button asChild>
                          <a href={payment.url || DEFAULT_PAYMENT_URL} target="_blank" rel="noopener noreferrer">
                            Pay Now
                          </a>
                        </Button>
                      ) : (
                        <p className="text-sm text-gray-500">Payments are currently unavailable.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Business Hours</CardTitle>
                    <CardDescription>
                      We're here to help during these hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span>9:00 AM - 6:00 PM EST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span>
                        <span>10:00 AM - 4:00 PM EST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span>Closed</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        For urgent matters outside business hours, please email us and we'll respond within 24 hours.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="feedback" className="mt-6">
              {!isAdmin ? (
                <Card className="max-w-2xl mx-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                      Share Your Feedback
                    </CardTitle>
                    <CardDescription>
                      We value your opinion and would love to hear about your experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Name *
                          </label>
                          <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email *
                          </label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Rating *
                        </label>
                        <div className="flex items-center space-x-1">
                          {renderStars(displayRating)}
                          <span className="ml-2 text-sm text-gray-600">
                            {displayRating > 0 && `${displayRating} star${displayRating > 1 ? 's' : ''}`}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Message *
                        </label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Share your thoughts, suggestions, or experience with our platform..."
                          rows={4}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        Submit Feedback
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card className="max-w-2xl mx-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                      Feedback Disabled
                    </CardTitle>
                    <CardDescription>
                      Administrators cannot submit feedback. Please use the Admin Dashboard → Comments to review and moderate feedback.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Please use the reviews tab to read approved feedback. If you need to contact us, use the contact details in the Contact Us tab.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">What Our Users Say</h3>
                  <p className="text-gray-600">
                    Read feedback from our community members
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {comments
                    .filter(comment => comment.isApproved)
                    .map((comment) => (
                      <Card key={comment.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{comment.name}</CardTitle>
                              <CardDescription>
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, index) => (
                                <Star
                                  key={index}
                                  className={`h-4 w-4 ${
                                    index < comment.rating
                                      ? 'text-yellow-500 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {editingCommentId === comment.id ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">Name</label>
                                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2">Email</label>
                                  <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">Rating</label>
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, idx) => (
                                    <Star key={idx} className={`h-5 w-5 cursor-pointer ${idx < editRating ? 'text-yellow-500' : 'text-gray-300'}`} onClick={() => setEditRating(idx + 1)} />
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">Message</label>
                                <Textarea value={editMessage} onChange={(e) => setEditMessage(e.target.value)} rows={3} />
                              </div>
                              <div className="flex space-x-2">
                                <Button onClick={() => submitEdit(comment.id)}>Save</Button>
                                <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-gray-600">{comment.message}</p>
                              {ownerEmail === comment.email && (
                                <div className="mt-3">
                                  <Button size="sm" variant="outline" onClick={() => startEditing(comment)}>Edit your review</Button>
                                </div>
                              )}
                            </>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>

                {comments.filter(comment => comment.isApproved).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No reviews yet. Be the first to share your feedback!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}