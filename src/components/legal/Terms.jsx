import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import OrbitLogo from "../OrbitLogo";

export default function Terms() {
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
              Terms of Service
            </h1>
            <p className="text-xs text-base-content/60">
              Last updated: September 2026 • Orbit Network
            </p>
          </div>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-base-content/80 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-base-content">
              1. Acceptance of Terms
            </h2>
            <p>
              By creating an account or accessing Orbit ("Platform"), you agree
              to be bound by these Terms of Service and all applicable local,
              state, and national laws. Orbit provides an intentional discovery
              and connection service for founders, builders, designers, and
              operators.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-base-content">
              2. User Conduct & Professionalism
            </h2>
            <p>
              Orbit is strictly an opt-in professional matching ecosystem. You
              agree not to transmit unsolicited commercial messages, engage in
              harassment, misrepresent your professional credentials, or scrape
              user information.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-base-content">
              3. Subscriptions & Billing
            </h2>
            <p>
              Orbit offers tiered memberships (Basic, Pro, and Premium). Paid
              subscriptions are billed in advance on a recurring monthly basis
              through authorized payment gateways (including Razorpay). Prices
              are quoted in Indian Rupees (INR) and are inclusive of applicable
              taxes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-base-content">
              4. Limitation of Liability
            </h2>
            <p>
              Orbit facilitates professional networking and collaboration. We do
              not guarantee business outcomes, co-founder compatibility, or
              employment opportunities resulting from connections made on the
              platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
