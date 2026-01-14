import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Footer from "@/components/footer";
import { notFound } from "next/navigation";

const posts: Record<
  string,
  {
    title: string;
    content: string;
    date: string;
    readTime: string;
    category: string;
    image: string;
    author: string;
  }
> = {
  "hssc-cet-2026-complete-syllabus-exam-pattern": {
    title: "HSSC CET 2026: Complete Syllabus and Exam Pattern",
    date: "Dec 15, 2025",
    readTime: "8 min read",
    category: "Exam Guide",
    image: "/exam-syllabus-study-guide.jpg",
    author: "HSSC CET TEST Team",
    content: `
      <h2>HSSC CET Exam Pattern 2026</h2>
      <p>The Haryana Staff Selection Commission Common Eligibility Test (HSSC CET) is conducted for recruitment to various Group C posts in Haryana. Understanding the exam pattern is crucial for effective preparation.</p>
      
      <h3>Exam Structure</h3>
      <ul>
        <li><strong>Total Questions:</strong> 100</li>
        <li><strong>Total Marks:</strong> 100</li>
        <li><strong>Duration:</strong> 90 minutes</li>
        <li><strong>Negative Marking:</strong> 0.25 marks for each wrong answer</li>
        <li><strong>Mode:</strong> Computer Based Test (CBT)</li>
      </ul>
      
      <h3>Subject-wise Distribution</h3>
      <ul>
        <li><strong>General Awareness:</strong> 25 questions</li>
        <li><strong>Reasoning:</strong> 20 questions</li>
        <li><strong>Mathematics:</strong> 20 questions</li>
        <li><strong>English:</strong> 15 questions</li>
        <li><strong>Hindi:</strong> 10 questions</li>
        <li><strong>Haryana GK:</strong> 10 questions</li>
      </ul>
      
      <h2>Detailed Syllabus</h2>
      
      <h3>General Awareness</h3>
      <p>Current affairs, Indian History, Geography, Indian Polity, Economics, Science & Technology, Sports, Awards & Honours.</p>
      
      <h3>Haryana GK</h3>
      <p>History of Haryana, Geography, Culture, Festivals, Famous Personalities, Government Schemes, Districts, Rivers & Lakes.</p>
      
      <h3>Mathematics</h3>
      <p>Number System, Percentage, Ratio & Proportion, Average, Time & Work, Time & Distance, Profit & Loss, Simple & Compound Interest, Data Interpretation.</p>
      
      <h3>Reasoning</h3>
      <p>Analogy, Classification, Series, Coding-Decoding, Blood Relations, Direction Sense, Syllogism, Statement & Conclusions, Puzzles.</p>
      
      <h3>English</h3>
      <p>Grammar (Tenses, Voice, Narration), Vocabulary, Synonyms & Antonyms, One Word Substitution, Idioms & Phrases, Comprehension.</p>
      
      <h3>Hindi</h3>
      <p>व्याकरण, संधि, समास, पर्यायवाची, विलोम शब्द, मुहावरे, लोकोक्तियाँ, अनेक शब्दों के लिए एक शब्द।</p>
      
      <h2>Preparation Tips</h2>
      <ol>
        <li>Start with understanding the complete syllabus</li>
        <li>Create a study schedule covering all subjects</li>
        <li>Practice previous year question papers</li>
        <li>Take mock tests regularly</li>
        <li>Focus on Haryana GK as it's unique to this exam</li>
        <li>Stay updated with current affairs</li>
      </ol>
    `,
  },
  "top-10-tips-crack-hssc-cet-first-attempt": {
    title: "Top 10 Tips to Crack HSSC CET in First Attempt",
    date: "Dec 10, 2025",
    readTime: "6 min read",
    category: "Tips & Tricks",
    image: "/success-tips-study-motivation.jpg",
    author: "HSSC CET TEST Team",
    content: `
      <h2>Proven Strategies from HSSC CET Toppers</h2>
      <p>Clearing HSSC CET in the first attempt requires smart preparation and dedication. Here are the top 10 tips from successful candidates.</p>
      
      <h3>1. Understand the Exam Pattern</h3>
      <p>Before starting preparation, thoroughly understand the exam pattern, marking scheme, and syllabus. This helps in creating an effective study plan.</p>
      
      <h3>2. Create a Realistic Study Schedule</h3>
      <p>Divide your time wisely among all subjects. Allocate more time to weaker areas while maintaining regular revision of strong subjects.</p>
      
      <h3>3. Focus on Haryana GK</h3>
      <p>Haryana GK questions are relatively easy to score if prepared well. Cover all districts, history, culture, and current affairs of Haryana.</p>
      
      <h3>4. Practice Mathematics Daily</h3>
      <p>Mathematics requires consistent practice. Solve at least 50 questions daily and learn shortcut tricks for faster calculations.</p>
      
      <h3>5. Master Reasoning Concepts</h3>
      <p>Reasoning is more about understanding patterns than memorization. Practice different types of questions to build logical thinking.</p>
      
      <h3>6. Stay Updated with Current Affairs</h3>
      <p>Read newspapers daily and make notes of important events. Focus on last 6 months' current affairs before the exam.</p>
      
      <h3>7. Take Regular Mock Tests</h3>
      <p>Mock tests help in understanding the real exam environment and identifying weak areas. Take at least 2-3 full-length tests weekly.</p>
      
      <h3>8. Analyze Your Performance</h3>
      <p>After each mock test, analyze your performance. Identify patterns in mistakes and work on improving them.</p>
      
      <h3>9. Revise Regularly</h3>
      <p>Regular revision is key to retention. Create short notes for quick revision before the exam.</p>
      
      <h3>10. Stay Healthy and Positive</h3>
      <p>Take care of your physical and mental health. Adequate sleep, exercise, and a positive mindset are crucial for effective preparation.</p>
    `,
  },
  "important-current-affairs-hssc-cet-2026": {
    title: "Important Current Affairs for HSSC CET 2026",
    date: "Dec 5, 2025",
    readTime: "10 min read",
    category: "Current Affairs",
    image: "/current-affairs-news-newspaper.jpg",
    author: "HSSC CET TEST Team",
    content: `
      <h2>Must-Know Current Affairs for HSSC CET 2026</h2>
      <p>Current affairs form a significant portion of the General Awareness section. Here are the most important topics to cover.</p>
      
      <h3>National News</h3>
      <ul>
        <li>Important government schemes and policies</li>
        <li>Constitutional amendments</li>
        <li>Economic developments and budget highlights</li>
        <li>Defense and security updates</li>
      </ul>
      
      <h3>Haryana Specific News</h3>
      <ul>
        <li>New government schemes in Haryana</li>
        <li>Infrastructure projects</li>
        <li>Awards and achievements</li>
        <li>Important appointments</li>
      </ul>
      
      <h3>International Affairs</h3>
      <ul>
        <li>India's foreign relations</li>
        <li>International summits and conferences</li>
        <li>Global economic developments</li>
      </ul>
      
      <h3>Sports</h3>
      <ul>
        <li>Major tournaments and winners</li>
        <li>Olympic and Commonwealth Games updates</li>
        <li>Sports personalities from Haryana</li>
      </ul>
      
      <h3>Awards & Honours</h3>
      <ul>
        <li>Padma Awards</li>
        <li>National Film Awards</li>
        <li>Literary Awards</li>
        <li>Sports Awards</li>
      </ul>
      
      <h3>Science & Technology</h3>
      <ul>
        <li>ISRO missions</li>
        <li>Defense technology developments</li>
        <li>New inventions and discoveries</li>
      </ul>
    `,
  },
  "haryana-gk-districts-history-culture": {
    title: "Haryana GK: Districts, History & Culture",
    date: "Nov 28, 2025",
    readTime: "12 min read",
    category: "Haryana GK",
    image: "/haryana-culture-heritage.jpg",
    author: "HSSC CET TEST Team",
    content: `
      <h2>Complete Guide to Haryana General Knowledge</h2>
      <p>Haryana GK is a scoring section in HSSC CET. This comprehensive guide covers all important topics.</p>
      
      <h3>Basic Information</h3>
      <ul>
        <li><strong>Formation:</strong> 1st November 1966</li>
        <li><strong>Capital:</strong> Chandigarh (shared with Punjab)</li>
        <li><strong>Total Districts:</strong> 22</li>
        <li><strong>Official Language:</strong> Hindi</li>
        <li><strong>State Animal:</strong> Black Buck</li>
        <li><strong>State Bird:</strong> Black Francolin</li>
        <li><strong>State Flower:</strong> Lotus</li>
        <li><strong>State Tree:</strong> Peepal</li>
      </ul>
      
      <h3>Districts of Haryana</h3>
      <p>Haryana has 22 districts divided into 6 divisions: Ambala, Karnal, Rohtak, Hisar, Gurgaon, and Faridabad.</p>
      
      <h3>Historical Background</h3>
      <p>Haryana has a rich historical heritage dating back to the Vedic period. The famous Kurukshetra war of Mahabharata was fought here.</p>
      
      <h3>Culture & Festivals</h3>
      <ul>
        <li><strong>Folk Dances:</strong> Ghoomar, Khoria, Dhamal, Loor</li>
        <li><strong>Folk Music:</strong> Ragini, Saang</li>
        <li><strong>Festivals:</strong> Teej, Gugga Navami, Holi, Diwali</li>
        <li><strong>Handicrafts:</strong> Pottery, Embroidery, Weaving</li>
      </ul>
      
      <h3>Famous Personalities</h3>
      <p>Haryana has produced many notable personalities including sports legends, freedom fighters, and scholars.</p>
      
      <h3>Government Schemes</h3>
      <ul>
        <li>Beti Bachao Beti Padhao</li>
        <li>Mukhyamantri Parivar Samridhi Yojana</li>
        <li>Deen Dayal Jan Awas Yojana</li>
        <li>Haryana Kaushal Rozgar Nigam</li>
      </ul>
    `,
  },
  "math-shortcuts-hssc-cet-quick-calculation-tricks": {
    title: "Math Shortcuts for HSSC CET: Quick Calculation Tricks",
    date: "Nov 20, 2025",
    readTime: "7 min read",
    category: "Mathematics",
    image: "/mathematics-calculation-formulas.jpg",
    author: "HSSC CET TEST Team",
    content: `
      <h2>Speed Up Your Math Calculations</h2>
      <p>Time management is crucial in HSSC CET. These shortcuts will help you solve math questions faster.</p>
      
      <h3>Percentage Shortcuts</h3>
      <ul>
        <li>To find 10% of any number, just move the decimal one place left</li>
        <li>5% = Half of 10%</li>
        <li>15% = 10% + 5%</li>
        <li>20% = 10% × 2</li>
      </ul>
      
      <h3>Multiplication Tricks</h3>
      <ul>
        <li>Multiply by 11: Add adjacent digits (e.g., 23 × 11 = 253)</li>
        <li>Multiply by 5: Divide by 2 and multiply by 10</li>
        <li>Multiply by 25: Divide by 4 and multiply by 100</li>
      </ul>
      
      <h3>Division Tricks</h3>
      <ul>
        <li>Divide by 5: Multiply by 2 and divide by 10</li>
        <li>Divide by 25: Multiply by 4 and divide by 100</li>
      </ul>
      
      <h3>Square Shortcuts</h3>
      <p>For numbers ending in 5: (First digit × Next digit) and append 25</p>
      <p>Example: 25² = 2 × 3 = 6, append 25 = 625</p>
      
      <h3>Time and Work Formula</h3>
      <p>If A does work in x days and B in y days, together they finish in xy/(x+y) days</p>
      
      <h3>Ratio and Proportion</h3>
      <p>Use cross multiplication for quick solutions. If a:b = c:d, then ad = bc</p>
      
      <h3>Practice Tips</h3>
      <ol>
        <li>Memorize tables up to 20</li>
        <li>Learn squares up to 30</li>
        <li>Practice mental calculations daily</li>
        <li>Use approximation for complex calculations</li>
      </ol>
    `,
  },
  "english-grammar-rules-hssc-aspirant": {
    title: "English Grammar Rules Every HSSC Aspirant Must Know",
    date: "Nov 15, 2025",
    readTime: "9 min read",
    category: "English",
    image: "/english-grammar-book-learning.jpg",
    author: "HSSC CET TEST Team",
    content: `
      <h2>Essential English Grammar for HSSC CET</h2>
      <p>English section can be scoring if you master these fundamental grammar rules.</p>
      
      <h3>Tenses</h3>
      <p>Understanding the correct use of tenses is crucial:</p>
      <ul>
        <li><strong>Simple Present:</strong> Habitual actions, universal truths</li>
        <li><strong>Present Continuous:</strong> Actions happening now</li>
        <li><strong>Present Perfect:</strong> Past actions with present relevance</li>
        <li><strong>Simple Past:</strong> Completed actions in the past</li>
      </ul>
      
      <h3>Subject-Verb Agreement</h3>
      <ul>
        <li>Singular subjects take singular verbs</li>
        <li>Plural subjects take plural verbs</li>
        <li>Words like 'everyone', 'anybody' are singular</li>
        <li>Collective nouns can be singular or plural based on context</li>
      </ul>
      
      <h3>Active and Passive Voice</h3>
      <p>Active: Subject + Verb + Object</p>
      <p>Passive: Object + Be verb + Past participle + by + Subject</p>
      
      <h3>Direct and Indirect Speech</h3>
      <ul>
        <li>Change of pronouns based on speaker</li>
        <li>Change of tense (backshift rule)</li>
        <li>Change of time and place expressions</li>
      </ul>
      
      <h3>Common Errors to Avoid</h3>
      <ul>
        <li>Using 'the' before proper nouns unnecessarily</li>
        <li>Confusing 'since' and 'for' with time expressions</li>
        <li>Wrong preposition usage</li>
        <li>Double negatives</li>
      </ul>
      
      <h3>Important One Word Substitutions</h3>
      <ul>
        <li>Autobiography - Story of one's own life</li>
        <li>Omnipresent - Present everywhere</li>
        <li>Posthumous - After death</li>
        <li>Unanimous - In complete agreement</li>
      </ul>
    `,
  },
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                HSSC CET <span className="text-primary">TEST</span>
              </span>
            </Link>
            <Link href="/blog">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Blog Post Content */}
      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Category Badge */}
          <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
            {post.category}
          </span>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-4">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>

          {/* Featured Image */}
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
          />

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div className="mt-12 p-6 bg-primary/5 rounded-xl border border-primary/20">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Ready to Start Practicing?
            </h3>
            <p className="text-muted-foreground mb-4">
              Join thousands of students preparing for HSSC CET with our
              comprehensive test series.
            </p>
            <Link href="/register">
              <Button>Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
