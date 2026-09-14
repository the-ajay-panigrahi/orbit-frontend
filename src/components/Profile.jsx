import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { motion } from "motion/react";
import {
  User,
  Check,
  AlertCircle,
  RotateCcw,
  Save,
  Sparkles,
  Layers,
  FileText,
  Plus,
  Maximize2,
} from "lucide-react";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";
import Card3DZoomModal from "./Card3DZoomModal";

const springTap = { type: "spring", stiffness: 400, damping: 22 };

const POPULAR_SKILL_PRESETS = [
  "React",
  "Node.js",
  "TypeScript",
  "Next.js",
  "Python",
  "Tailwind CSS",
  "AI / LLMs",
  "PostgreSQL",
  "UI/UX Design",
  "Figma",
  "GraphQL",
  "Docker",
];

const SUGGESTED_ROLES = [
  "Technical Co-founder",
  "Founding Engineer",
  "Product Designer",
  "Growth Marketer",
  "Full-stack Builder",
];

export default function Profile() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("identity"); // 'identity' | 'vision' | 'skills'

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    user?.profilePictureUrl || "",
  );
  const [lookingFor, setLookingFor] = useState(user?.lookingFor || "");
  const [about, setAbout] = useState(user?.about || "");
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(() => {
    if (location.state?.welcome) {
      return {
        type: "success",
        message: "Welcome to Orbit! Customize your profile to get started.",
      };
    }
    return null;
  });

  useEffect(() => {
    if (location.state?.welcome) {
      const timer = setTimeout(() => {
        setToast((curr) =>
          curr?.message?.includes("Welcome to Orbit") ? null : curr,
        );
      }, 4000);
      window.history.replaceState({}, document.title);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleAddSkill = (rawSkill) => {
    const trimmed = rawSkill.trim().replace(/,/g, "");
    if (!trimmed) return;

    if (skills.length >= 30) {
      setToast({ type: "error", message: "Maximum limit of 30 skills reached." });
      setTimeout(() => {
        setToast((curr) => (curr?.message?.includes("30 skills") ? null : curr));
      }, 3000);
      return;
    }

    const isDuplicate = skills.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase(),
    );
    if (isDuplicate) {
      setToast({
        type: "error",
        message: `"${trimmed}" is already added.`,
      });
      setTimeout(() => {
        setToast((curr) => (curr?.message?.includes(trimmed) ? null : curr));
      }, 2500);
      setSkillInput("");
      return;
    }

    setSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddSkill(skillInput);
    } else if (e.key === "Backspace" && !skillInput && skills.length > 0) {
      setSkills((prev) => prev.slice(0, -1));
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleReset = () => {
    if (!user) return;
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setAge(user.age || "");
    setGender(user.gender || "");
    setProfilePictureUrl(user.profilePictureUrl || "");
    setLookingFor(user.lookingFor || "");
    setAbout(user.about || "");
    setSkills(user.skills || []);
    setSkillInput("");
    setToast(null);
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setToast(null);

    const payload = {};
    if (firstName.trim()) payload.firstName = firstName.trim();
    if (lastName.trim()) payload.lastName = lastName.trim();
    if (age !== "" && !isNaN(Number(age))) payload.age = Number(age);
    if (gender) payload.gender = gender;
    if (profilePictureUrl.trim())
      payload.profilePictureUrl = profilePictureUrl.trim();
    if (lookingFor.trim()) payload.lookingFor = lookingFor.trim();
    if (about.trim()) payload.about = about.trim();
    payload.skills = skills;

    try {
      const res = await axios.patch(`${BASE_URL}/profile/edit`, payload, {
        withCredentials: true,
      });
      dispatch(addUser(res?.data?.data));
      setToast({
        type: "success",
        message: "Profile updated successfully!",
      });
      setTimeout(() => {
        setToast((curr) =>
          curr?.message?.includes("updated successfully") ? null : curr,
        );
      }, 3500);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error ||
        err?.response?.data ||
        "Failed to save profile. Please check your inputs.";
      setToast({
        type: "error",
        message: typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg),
      });
      setTimeout(() => setToast(null), 4500);
    } finally {
      setIsSaving(false);
    }
  };

  const previewUser = {
    firstName: firstName || "Your",
    lastName: lastName || "Name",
    age: age ? Number(age) : undefined,
    gender: gender || undefined,
    profilePictureUrl: profilePictureUrl || "/default-avatar.svg",
    lookingFor: lookingFor || "Collaborators & Builders",
    about: about || "Passionate about building scalable technology and discovering new co-founders on Orbit.",
    skills: skills.length > 0 ? skills : ["Builder", "Founder"],
    membershipType: user?.membershipType || "free",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-base-content/8 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Profile Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content">
            Design your builder presence.
          </h1>
          <p className="text-sm text-base-content/65 max-w-lg mt-1">
            Keep your profile fresh. Changes update the live discovery card in real time.
          </p>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Segmented Form Tabs */}
        <div className="lg:col-span-7 bg-base-100 shadow-xl border border-base-content/10 p-6 sm:p-7 rounded-3xl">
          {/* Segmented Controller */}
          <div className="grid grid-cols-3 p-1 rounded-2xl bg-base-200/80 border border-base-content/8 mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("identity")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "identity"
                  ? "bg-base-100 text-primary shadow-xs font-bold"
                  : "text-base-content/70 hover:text-base-content"
              }`}
            >
              <User className="w-3.5 h-3.5 stroke-[2.3]" />
              <span>Identity</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("vision")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "vision"
                  ? "bg-base-100 text-primary shadow-xs font-bold"
                  : "text-base-content/70 hover:text-base-content"
              }`}
            >
              <FileText className="w-3.5 h-3.5 stroke-[2.3]" />
              <span>Role &amp; Bio</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("skills")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "skills"
                  ? "bg-base-100 text-primary shadow-xs font-bold"
                  : "text-base-content/70 hover:text-base-content"
              }`}
            >
              <Layers className="w-3.5 h-3.5 stroke-[2.3]" />
              <span>Tech Stack</span>
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Tab 1: Identity */}
            {activeTab === "identity" && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 min-h-[360px]"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-base-content/80 mb-1.5 block">
                      First Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Alex"
                      className="input input-sm input-bordered w-full rounded-xl focus:input-primary text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-base-content/80 mb-1.5 block">
                      Last Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Vance"
                      className="input input-sm input-bordered w-full rounded-xl focus:input-primary text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-base-content/80 mb-1.5 block">
                      Age
                    </label>
                    <input
                      type="number"
                      min="12"
                      max="100"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 27"
                      className="input input-sm input-bordered w-full rounded-xl focus:input-primary text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-base-content/80 mb-1.5 block">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="select select-sm select-bordered w-full rounded-xl focus:select-primary text-sm capitalize"
                    >
                      <option value="">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="others">Other / Non-binary</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-base-content/80 mb-1.5 block">
                    Profile Picture URL
                  </label>
                  <input
                    type="url"
                    value={profilePictureUrl}
                    onChange={(e) => setProfilePictureUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="input input-sm input-bordered w-full rounded-xl focus:input-primary text-sm font-medium font-mono"
                  />
                  <p className="text-[11px] text-base-content/50 mt-1">
                    Direct image link (Unsplash, GitHub, or CDN image).
                  </p>
                </div>
              </motion.div>
            )}

            {/* Tab 2: Role & Vision */}
            {activeTab === "vision" && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 min-h-[360px]"
              >
                <div>
                  <label className="text-xs font-bold text-base-content/80 mb-1.5 block">
                    What are you looking to build?
                  </label>
                  <input
                    type="text"
                    value={lookingFor}
                    onChange={(e) => setLookingFor(e.target.value)}
                    placeholder="e.g. Co-founders for AI DevTools, Early Engineers"
                    maxLength={100}
                    className="input input-sm input-bordered w-full rounded-xl focus:input-primary text-sm font-medium"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {SUGGESTED_ROLES.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setLookingFor(role)}
                        className="badge badge-sm bg-base-200/80 hover:bg-primary/15 hover:text-primary transition-colors text-[11px] cursor-pointer"
                      >
                        + {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-base-content/80">
                      About You (Bio)
                    </label>
                    <span className="text-xs text-base-content/45 font-mono">
                      {about.length}/500
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Describe your background, what projects you are actively hacking on, and what type of builder you want to connect with..."
                    maxLength={500}
                    className="textarea textarea-bordered textarea-sm w-full rounded-xl focus:textarea-primary text-sm leading-relaxed"
                  />
                </div>
              </motion.div>
            )}

            {/* Tab 3: Tech Stack & Skills */}
            {activeTab === "skills" && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 min-h-[360px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-base-content/80">
                      Your Skills &amp; Stack
                    </label>
                    <span className="text-xs font-mono text-base-content/45">
                      {skills.length}/30
                    </span>
                  </div>
                  <div className="min-h-[3rem] p-2.5 rounded-xl border border-base-content/15 bg-base-200/40 flex flex-wrap items-center gap-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="badge badge-sm gap-1 bg-base-100 text-base-content border border-base-content/15 font-mono py-2.5 px-2.5 shadow-2xs"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-error transition-colors focus:outline-none cursor-pointer text-xs"
                          title={`Remove ${skill}`}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        skills.length === 0
                          ? "Type skill and hit Enter..."
                          : "+ add skill..."
                      }
                      className="input input-xs bg-transparent border-0 focus:outline-none text-sm flex-1 min-w-[130px] text-base-content"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-base-content/60 mb-2">
                    Quick Add Popular Tags:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SKILL_PRESETS.map((preset) => {
                      const isAdded = skills.includes(preset);
                      return (
                        <button
                          key={preset}
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddSkill(preset)}
                          className={`badge badge-sm gap-1 transition-all cursor-pointer ${
                            isAdded
                              ? "opacity-40 cursor-not-allowed bg-base-200"
                              : "bg-base-100 border border-base-content/12 hover:border-primary/40 hover:text-primary"
                          }`}
                        >
                          <Plus className="w-3 h-3" />
                          <span>{preset}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-5 border-t border-base-content/8">
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="btn btn-sm btn-ghost gap-1.5 text-xs text-base-content/60 hover:text-base-content cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 stroke-[2.3]" />
                <span>Reset to Saved</span>
              </button>

              <div className="flex items-center gap-2">
                {activeTab === "identity" && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("vision")}
                    className="btn btn-sm btn-outline text-xs cursor-pointer"
                  >
                    Next: Role &amp; Bio →
                  </button>
                )}
                {activeTab === "vision" && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("skills")}
                    className="btn btn-sm btn-outline text-xs cursor-pointer"
                  >
                    Next: Skills &rarr;
                  </button>
                )}
                <motion.button
                  type="submit"
                  disabled={isSaving}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  transition={springTap}
                  className="btn btn-sm btn-primary gap-2 text-xs shadow-md shadow-primary/20 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <span className="loading loading-spinner loading-xs" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Save Profile</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Live Card Preview & Strength Checklist */}
        <div className="lg:col-span-5 flex flex-col items-center justify-start gap-4 select-none lg:sticky lg:top-24">
          <div className="w-full max-w-sm flex items-center justify-between px-1 text-xs font-mono text-base-content/60">
            <span className="font-bold">Live Discovery Card</span>
            <span className="badge badge-xs badge-primary font-mono font-bold">
              Real-time Sync
            </span>
          </div>

          <div
            onClick={() => setIsZoomOpen(true)}
            className="cursor-pointer group relative transition-transform duration-200 hover:scale-[1.015] active:scale-[0.99] w-full max-w-sm flex justify-center"
            title="Click card to inspect in 3D"
          >
            <UserCard user={previewUser} showActions={false} />
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-base-100/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-primary shadow-xl border border-base-content/10 pointer-events-none flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 stroke-[2.3]" />
              <span>Tap to Zoom 3D</span>
            </div>
          </div>
        </div>
      </div>

      <Card3DZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        user={previewUser}
        showActions={false}
      />

      {toast && (
        <div className="toast toast-top toast-center z-50 pt-16 sm:pt-18 px-4">
          <div
            className={`alert ${
              toast.type === "success"
                ? "alert-success text-success-content"
                : "alert-error text-error-content"
            } shadow-2xl border border-base-content/10 text-xs flex items-center gap-2`}
          >
            {toast.type === "success" ? (
              <Check className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <AlertCircle className="w-4 h-4 stroke-[2.5]" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
