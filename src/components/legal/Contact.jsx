import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MessageSquare } from "lucide-react";
import OrbitLogo from "../OrbitLogo";

export default function Contact() {
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
              Contact & Support
            </h1>
            <p className="text-xs text-base-content/60">
              Get in touch with the Orbit team
            </p>
          </div>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-base-content/80 leading-relaxed">
          <p>
            Have questions about Orbit, membership tiers, collaboration, or
            payment issues? We're here to help founders and builders connect
            smoothly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-base-200/60 border border-base-content/10 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-base-content">
                Email Support
              </h3>
              <p className="text-xs text-base-content/70">
                Direct inquiry for technical issues and account billing:
              </p>
              <a
                href="mailto:support@orbitnetwork.app"
                className="text-primary font-mono text-xs hover:underline block pt-1"
              >
                support@orbitnetwork.app
              </a>
            </div>

            <div className="p-5 rounded-2xl bg-base-200/60 border border-base-content/10 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-base-content">
                Platform Inquiries
              </h3>
              <p className="text-xs text-base-content/70">
                Partnerships, integrations, and startup community feedback.
              </p>
              <span className="text-base-content/60 font-mono text-xs block pt-1">
                Mon–Fri • 9:00 AM – 6:00 PM IST
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
