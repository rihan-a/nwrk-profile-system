import { Feedback } from '../../shared/types/index.js';
import { UserRole } from '../../shared/types/index.js';

// Mock data for development with more realistic feedback scenarios
const mockFeedback: Feedback[] = [
  {
    id: '1',
    fromUserId: 'user2',
    fromUserName: 'Sarah Johnson',
    toUserId: 'user1', // Add recipient ID
    content: 'Great teamwork on the project! You always communicate clearly and meet deadlines.',
    enhancedContent: 'I appreciate your exceptional teamwork on the project. Your clear communication and consistent ability to meet deadlines have been invaluable to our success.',
    isEnhanced: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    fromUserId: 'user3',
    fromUserName: 'Mike Chen',
    toUserId: 'user1', // Add recipient ID
    content: 'You could improve your time management skills. Sometimes meetings run over.',
    enhancedContent: 'I have noticed opportunities to enhance your time management skills. Meetings occasionally run over schedule, and developing more structured time allocation could benefit both you and the team.',
    isEnhanced: true,
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T14:20:00Z'
  },
  {
    id: '3',
    fromUserId: 'user4',
    fromUserName: 'Emily Rodriguez',
    toUserId: 'user2', // Different recipient
    content: 'Your technical skills are amazing! Love working with you.',
    enhancedContent: 'Your technical expertise is truly impressive! I thoroughly enjoy collaborating with you and appreciate the valuable insights you bring to our projects.',
    isEnhanced: true,
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    fromUserId: 'user1',
    fromUserName: 'John Manager',
    toUserId: 'user3', // Different recipient
    content: 'You need to improve your communication with the team.',
    enhancedContent: 'I\'ve observed opportunities to enhance your team communication. Clear and consistent communication is essential for our collaborative success, and I believe we can work together to strengthen this aspect of your performance.',
    isEnhanced: true,
    createdAt: '2024-01-12T16:30:00Z',
    updatedAt: '2024-01-12T16:30:00Z'
  }
];

export class FeedbackService {
  private feedback: Feedback[] = [...mockFeedback];

  constructor() {
    console.log('🔑 Feedback service initialized with role-based access control');
  }

  // Get feedback based on user role and permissions
  async getFeedbackByProfileId(profileId: string, currentUser: { id: string; role: UserRole }): Promise<Feedback[]> {
    if (currentUser.role === UserRole.MANAGER) {
      // Managers can see all feedback for any profile
      console.log('👑 Manager accessing all feedback for profile:', profileId);
      return this.feedback.filter(f => f.toUserId === profileId);
    } else {
      // Employees and coworkers can only see feedback they received (for their own profile)
      // or feedback they wrote (for any profile)
      console.log(`👤 User ${currentUser.id} (${currentUser.role}) accessing feedback for profile ${profileId}`);

      if (currentUser.id === profileId) {
        // User is viewing their own profile - show feedback they received
        return this.feedback.filter(f => f.toUserId === profileId);
      } else {
        // User is viewing another profile - show only feedback they wrote
        return this.feedback.filter(f => f.fromUserId === currentUser.id && f.toUserId === profileId);
      }
    }
  }

  // Get feedback received by the current user (for main feedback page)
  async getFeedbackReceivedByUser(currentUser: { id: string; role: UserRole }): Promise<Feedback[]> {
    if (currentUser.role === UserRole.MANAGER) {
      // Managers can see all feedback across the organization
      console.log('👑 Manager accessing all feedback across organization');
      return this.feedback;
    } else {
      // Employees and coworkers can only see feedback they received
      console.log(`👤 User ${currentUser.id} (${currentUser.role}) accessing their received feedback`);
      return this.feedback.filter(f => f.toUserId === currentUser.id);
    }
  }

  // Create new feedback
  async createFeedback(profileId: string, feedbackData: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>): Promise<Feedback> {
    const newFeedback: Feedback = {
      ...feedbackData,
      toUserId: profileId, // Set the recipient
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.feedback.push(newFeedback);
    console.log(`📝 New feedback created from ${feedbackData.fromUserName} to profile ${profileId}`);
    return newFeedback;
  }

  // Enhance feedback text using Gemini AI via REST API
  async enhanceFeedback(text: string, employeeName?: string): Promise<string> {
    try {
      console.log('🤖 Starting AI enhancement for text:', text);
      console.log('🔑 API Key available:', !!process.env.GEMINI_API_KEY);

      // Create a balanced prompt - concise but with safety filters
      const nameContext = employeeName ? ` for ${employeeName}` : '';
      const prompt = `You are a professional HR feedback enhancement assistant. Your role is to transform any employee feedback into constructive, professional, and actionable workplace communication.
      Transform this workplace feedback${nameContext} into professional, constructive communication. Keep it concise (2-3 sentences max) and natural.

SAFETY FILTERING (CRITICAL):
- Remove or rephrase any profanity, harsh language, or toxic expressions
- Eliminate personal accusations or character attacks
- Convert complaints into constructive suggestions
- Transform negative statements into growth opportunities
- Replace vague criticisms with specific, actionable feedback

ENHANCEMENT REQUIREMENTS:
- Use the actual person's name if provided
- Make it constructive and solution-focused
- Keep the original meaning but improve tone
- Be specific and actionable
- Sound natural, not robotic
- Focus on behaviors and outcomes, not personality traits
- Use "I" statements and observation-based language

Original feedback: "${text}"

Enhanced version:`;

      console.log('📝 Sending enhanced prompt to Gemini via REST API');

      // Use REST API directly since the Node.js package isn't working
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
        method: 'POST',
        headers: {
          'x-goog-api-key': process.env.GEMINI_API_KEY || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Gemini REST API response received');

      const enhancedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!enhancedText) {
        console.log('⚠️ No enhanced text in response, returning original');
        return text;
      }

      console.log('📄 Enhanced text length:', enhancedText.length);
      console.log('🎯 Final enhanced text preview:', enhancedText.substring(0, 100) + '...');

      return enhancedText;
    } catch (error) {
      console.error('❌ AI enhancement failed:', error);
      if (error instanceof Error) {
        console.error('❌ Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
      // Return original text if AI enhancement fails
      return text;
    }
  }

  // Update feedback
  async updateFeedback(feedbackId: string, updates: Partial<Feedback>): Promise<Feedback | null> {
    const index = this.feedback.findIndex(f => f.id === feedbackId);
    if (index === -1) return null;

    this.feedback[index] = {
      ...this.feedback[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.feedback[index];
  }

  // Delete feedback
  async deleteFeedback(feedbackId: string): Promise<boolean> {
    const index = this.feedback.findIndex(f => f.id === feedbackId);
    if (index === -1) return false;

    this.feedback.splice(index, 1);
    return true;
  }

  // Get feedback by ID
  async getFeedbackById(feedbackId: string): Promise<Feedback | null> {
    return this.feedback.find(f => f.id === feedbackId) || null;
  }
}

export const feedbackService = new FeedbackService();
