import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import OrbitLogo from "../OrbitLogo";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-base-200/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-base-100 border border-base-content/10 rounded-3xl p-6 sm:p-10 shadow-xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-base-content/70 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
          <span>Back to Orbit</span>
        </Link>

        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-base-content/10">
          <OrbitLogo className="w-8 h-8" />
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-base-content tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-base-content/60">
              Last updated: September 2026 • Orbit Network
            </p>
          </div>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-base-content/80 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-base-content">
              1. Information We Collect
            </h2>
            <p>
              We collect information you provide directly to us when creating a
              profile: your name, email address, bio, skills, profile picture,
              and what professional collaboration you are looking for. We also
              record mutual match interactions and swipe preferences to curate
              your feed.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-base-content">
              2. How We Use Information
            </h2>
            <p>
              Your profile information is used exclusively to facilitate
              relevant discovery with other startup founders, developers, and
              operators on Orbit. We do not sell your personal data or contact
              information to third-party data brokers or advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-base-content">
              3. Payment Security (Razorpay)
            </h2>
            <p>
              Payment transactions for Pro and Premium memberships are processed
              securely via our payment partner, Razorpay. Orbit does not store
              sensitive credit card, debit card, or UPI banking credentials on
              our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-base-content">
              4. Data Control & Deletion
            </h2>
            <p>
              You maintain full control over your profile data. You may update,
              edit, or delete your profile information at any time directly
              within your Profile Settings.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
