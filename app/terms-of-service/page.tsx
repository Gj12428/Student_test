import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowLeft } from "lucide-react"
import Footer from "@/components/footer"

export default function TermsOfServicePage() {
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

      {/* Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 1, 2026</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using HSSC CET TEST, you accept and agree to be bound by the terms and provisions of
                this agreement. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                HSSC CET TEST provides online test series, practice questions, and study materials for HSSC CET
                examination preparation. Our services include mock tests, detailed analytics, and performance tracking
                features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To access certain features, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide accurate and complete information during registration</li>
                <li>Maintain the security of your password and account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Payment and Subscriptions</h2>
              <p className="text-muted-foreground leading-relaxed">
                Certain features require a paid subscription. All payments are processed securely. Subscription fees are
                charged in advance and are non-refundable except as provided in our Refund Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content on HSSC CET TEST, including questions, explanations, and study materials, is the
                intellectual property of HSSC CET TEST. You may not reproduce, distribute, or create derivative works
                without our written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Prohibited Conduct</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Share your account credentials with others</li>
                <li>Copy or distribute our content without permission</li>
                <li>Use automated systems to access our services</li>
                <li>Interfere with the proper functioning of the platform</li>
                <li>Engage in any fraudulent or illegal activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are provided "as is" without warranties of any kind. We do not guarantee that our test
                series will result in success in the actual HSSC CET examination. Success depends on individual effort
                and various other factors.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For any questions regarding these Terms of Service, please contact us at:
              </p>
              <ul className="list-none text-muted-foreground space-y-2 mt-4">
                <li>
                  Email:{" "}
                  <a href="mailto:anujjaglan9423@gmail.com" className="text-primary hover:underline">
                    anujjaglan9423@gmail.com
                  </a>
                </li>
                <li>
                  Phone:{" "}
                  <a href="tel:+919896979805" className="text-primary hover:underline">
                    +91 9896979805
                  </a>
                </li>
                <li>
                  Instagram:{" "}
                  <a
                    href="https://instagram.com/jaglan2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    @jaglan2
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
