import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ArrowLeft, MapPin, Clock, Briefcase } from "lucide-react"
import Footer from "@/components/footer"

const openings = [
  {
    title: "Content Writer - HSSC Subjects",
    location: "Remote",
    type: "Full-time",
    department: "Content",
    description: "Create high-quality questions and explanations for HSSC CET subjects.",
  },
  {
    title: "Frontend Developer",
    location: "Remote / Hybrid",
    type: "Full-time",
    department: "Engineering",
    description: "Build and improve our student-facing platform using React and Next.js.",
  },
  {
    title: "Student Success Manager",
    location: "Remote",
    type: "Full-time",
    department: "Support",
    description: "Help students succeed by providing guidance and resolving their queries.",
  },
  {
    title: "Marketing Intern",
    location: "Remote",
    type: "Internship",
    department: "Marketing",
    description: "Assist in social media management and student outreach campaigns.",
  },
]

export default function CareersPage() {
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
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Join Our <span className="text-primary">Mission</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Help us empower lakhs of HSSC CET aspirants across Haryana. We're looking for passionate individuals who
            want to make a difference in education.
          </p>
        </div>
      </section>

      {/* Openings */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Current Openings</h2>
          <div className="space-y-6">
            {openings.map((job, index) => (
              <Card key={index} className="border-border bg-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl text-foreground">{job.title}</CardTitle>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </span>
                      </div>
                    </div>
                    <a href="mailto:anujjaglan9423@gmail.com?subject=Application for ${job.title}">
                      <Button>Apply Now</Button>
                    </a>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{job.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Don't see a perfect fit?</h2>
          <p className="text-muted-foreground mb-6">
            We're always looking for talented people. Send us your resume and we'll reach out when there's a match.
          </p>
          <a href="mailto:anujjaglan9423@gmail.com?subject=General Application">
            <Button size="lg">Send Your Resume</Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
