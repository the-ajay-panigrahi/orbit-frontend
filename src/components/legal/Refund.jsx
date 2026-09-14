import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import OrbitLogo from "../OrbitLogo";

export default function Refund() {
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
              Cancellation & Refund Policy
            </h1>
            <p className="text-xs text-base-content/60">
              Last updated: September 2026 • Orbit Network
            </p>
          </div>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-base-content/80 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-base-content">
              1. Subscription Cancellation
            </h2>
            <p>
              You may cancel your Orbit Pro or Premium subscription at any time
              from your account settings. Upon cancellation, your upgraded
              features (such as 1-on-1 chat and expanded daily connection
              requests) will remain active through the end of your current
              paid billing cycle.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-base-content">
              2. Refund Eligibility
            </h2>
            <p>
              Because digital membership features (higher daily quotas, badges)
              activate immediately upon payment completion via Razorpay,
              monthly subscription payments are generally non-refundable.
              However, if you experienced technical payment errors, duplicate
              charges, or failed order activations, you are entitled to a full
              refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-base-content">
              3. Processing Time
            </h2>
            <p>
              Approved refunds will be processed via Razorpay back to your
              original payment method (UPI, card, or bank account) within 5–7
              business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
