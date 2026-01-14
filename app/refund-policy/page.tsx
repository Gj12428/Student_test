import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Footer from "@/components/footer";

export default function RefundPolicyPage() {
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
                CET <span className="text-primary">TEST</span>
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
          <h1 className="text-4xl font-bold text-foreground mb-8">
            Refund Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: January 1, 2026
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At CET TEST, we want you to be completely satisfied with your
                purchase. This refund policy outlines the terms and conditions
                for requesting a refund on our subscription plans.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Refund Eligibility
              </h2>

              <div className="space-y-4 mt-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      7-Day Money-Back Guarantee
                    </h3>
                    <p className="text-muted-foreground">
                      Request a full refund within 7 days of purchase if you
                      haven't attempted more than 3 tests.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Technical Issues
                    </h3>
                    <p className="text-muted-foreground">
                      If you experience persistent technical issues that prevent
                      you from using our services, you may be eligible for a
                      refund.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Duplicate Payments
                    </h3>
                    <p className="text-muted-foreground">
                      Accidental duplicate payments will be refunded in full
                      within 5-7 business days.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Non-Refundable Cases
              </h2>

              <div className="space-y-4 mt-4">
                <div className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      After 7 Days
                    </h3>
                    <p className="text-muted-foreground">
                      Refund requests made after the 7-day period are generally
                      not eligible.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Substantial Usage
                    </h3>
                    <p className="text-muted-foreground">
                      If you have attempted more than 3 tests or accessed
                      significant course content.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Promotional Offers
                    </h3>
                    <p className="text-muted-foreground">
                      Purchases made during special promotions with discounts
                      may have different refund terms.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                How to Request a Refund
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To request a refund, please follow these steps:
              </p>
              <ol className="list-decimal list-inside text-muted-foreground space-y-2">
                <li>
                  Email us at{" "}
                  <a
                    href="mailto:anujjaglan9423@gmail.com"
                    className="text-primary hover:underline"
                  >
                    anujjaglan9423@gmail.com
                  </a>
                </li>
                <li>Include your registered email address and order ID</li>
                <li>Provide a brief reason for the refund request</li>
                <li>
                  Our team will review and respond within 2-3 business days
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Refund Processing Time
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Once approved, refunds will be processed within 5-7 business
                days. The amount will be credited back to your original payment
                method. Please note that your bank may take additional time to
                reflect the refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about our refund policy, please reach
                out:
              </p>
              <ul className="list-none text-muted-foreground space-y-2 mt-4">
                <li>
                  Email:{" "}
                  <a
                    href="mailto:anujjaglan9423@gmail.com"
                    className="text-primary hover:underline"
                  >
                    anujjaglan9423@gmail.com
                  </a>
                </li>
                <li>
                  Phone:{" "}
                  <a
                    href="tel:+919896979805"
                    className="text-primary hover:underline"
                  >
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
  );
}
