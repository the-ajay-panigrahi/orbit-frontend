import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { User, Sparkles, Check, AlertCircle, RotateCcw, Save } from "lucide-react";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";

const POPULAR_SKILLS = [
  "React",
  "Node.js",
  "TypeScript",
  "Next.js",
  "TailwindCSS",
  "MongoDB",
  "Python",
  "System Design",
];

export default function Profile() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const outletContext = useOutletContext();
  const theme = outletContext?.theme || "coffee";

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

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const handleAddSkill = (rawSkill) => {
    const trimmed = rawSkill.trim().replace(/,/g, "");
    if (!trimmed) return;

    if (skills.length >= 30) {
      setToast({
        type: "error",
        message: "Maximum limit of 30 skills reached.",
      });
      return;
    }

    if (!skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkills((prev) => [...prev, trimmed]);
    }
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
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setToast(null);

    const payload = {};
    if (firstName.trim()) payload.firstName = firstName.trim();
    if (lastName.trim()) payload.lastName = lastName.trim();
    if (age !== "" && !isNaN(Number(age))) payload.age = Number(age);
    if (gender) payload.gender = gender.toLowerCase();
    if (profilePictureUrl.trim()) payload.profilePictureUrl = profilePictureUrl.trim();
    if (lookingFor.trim()) payload.lookingFor = lookingFor.trim();
    if (about.trim()) payload.about = about.trim();
    payload.skills = skills;

    try {
      const res = await axios.patch(`${BASE_URL}/profile/edit`, payload, {
        withCredentials: true,
      });

      if (res?.data?.data) {
        dispatch(addUser(res.data.data));
      }

      setToast({
        type: "success",
        message: "Profile updated successfully!",
      });

      setTimeout(() => {
        setToast((current) => (current?.type === "success" ? null : current));
      }, 3500);
    } catch (err) {
      setToast({
        type: "error",
        message:
          err?.response?.data?.error ||
          "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const previewUser = {
    firstName: firstName || "Anonymous",
    lastName: lastName || "",
    age: age || undefined,
    gender: gender || undefined,
    profilePictureUrl: profilePictureUrl || "/default-avatar.svg",
    lookingFor: lookingFor || "",
    about: about || "",
    skills: skills,
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 sm:py-8 lg:px-8">
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content flex items-center justify-center sm:justify-start gap-2">
          <User className="w-6 h-6 text-primary stroke-[2.2]" />
          <span>Profile Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-base-content/60 mt-1">
          Customize your founder details and see your card update live in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 card bg-base-100 shadow-xl border border-base-content/10 p-5 sm:p-7">
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold text-base-content/80">
                    First Name <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Elon"
                  className="input input-sm input-bordered rounded-lg focus:input-primary text-xs"
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold text-base-content/80">
                    Last Name <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Musk"
                  className="input input-sm input-bordered rounded-lg focus:input-primary text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold text-base-content/80">
                    Age
                  </span>
                </label>
                <input
                  type="number"
                  min="12"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 28"
                  className="input input-sm input-bordered rounded-lg focus:input-primary text-xs"
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold text-base-content/80">
                    Gender
                  </span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="select select-sm select-bordered rounded-lg focus:select-primary text-xs capitalize"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-semibold text-base-content/80">
                  Profile Picture URL
                </span>
              </label>
              <input
                type="url"
                value={profilePictureUrl}
                onChange={(e) => setProfilePictureUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="input input-sm input-bordered rounded-lg focus:input-primary text-xs"
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-semibold text-base-content/80">
                  Looking For
                </span>
              </label>
              <input
                type="text"
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
                placeholder="e.g. Technical Co-founder, Founding Engineer"
                maxLength={100}
                className="input input-sm input-bordered rounded-lg focus:input-primary text-xs"
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-semibold text-base-content/80">
                  About (Bio)
                </span>
              </label>
              <textarea
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Tell other founders and builders what you're passionate about..."
                maxLength={500}
                className="textarea textarea-bordered rounded-lg focus:textarea-primary text-xs leading-relaxed"
              />
              <label className="label py-0.5 justify-end">
                <span className="label-text-alt text-[10px] text-base-content/50">
                  {about.length}/500
                </span>
              </label>
            </div>

            <div className="form-control">
              <div className="flex items-center justify-between label py-1">
                <span className="label-text text-xs font-semibold text-base-content/80">
                  Tech Stack & Skills
                </span>
                <span className="label-text-alt text-[10px] font-mono text-base-content/50">
                  {skills.length}/30 skills
                </span>
              </div>

              <div className="min-h-[5rem] p-2.5 rounded-lg border border-base-content/20 bg-base-200/50 flex flex-wrap items-center gap-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="badge badge-sm gap-1.5 bg-base-100 text-base-content border border-base-content/15 font-mono py-2.5 px-2"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-error transition-colors focus:outline-none cursor-pointer"
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
                      ? "Type skill & press Enter or comma..."
                      : "+ add more..."
                  }
                  className="input input-xs bg-transparent border-0 focus:outline-none text-xs flex-1 min-w-[140px] text-base-content"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1 mt-2">
                <span className="text-[10px] text-base-content/50 font-medium mr-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" /> Suggestions:
                </span>
                {POPULAR_SKILLS.filter((s) => !skills.includes(s))
                  .slice(0, 5)
                  .map((suggested) => (
                    <button
                      key={suggested}
                      type="button"
                      onClick={() => handleAddSkill(suggested)}
                      className="badge badge-xs badge-ghost hover:badge-primary text-[10px] font-mono cursor-pointer transition-colors"
                    >
                      +{suggested}
                    </button>
                  ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-base-content/10 mt-2">
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="btn btn-sm btn-ghost gap-1.5 text-xs text-base-content/70 hover:text-base-content"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="btn btn-sm btn-primary gap-2 text-xs shadow-md shadow-primary/20 min-w-[120px]"
              >
                {isSaving ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 flex flex-col items-center justify-center lg:sticky lg:top-24">
          <div className="w-full flex items-center justify-between px-1 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Card Preview
            </span>
            <span className="text-[11px] text-base-content/50 font-mono">
              Updates Live
            </span>
          </div>

          <UserCard user={previewUser} showActions={false} theme={theme} />
        </div>
      </div>

      {toast && (
        <div className="toast toast-bottom toast-end z-50 p-4">
          <div
            className={`alert ${
              toast.type === "success"
                ? "alert-success text-success-content"
                : "alert-error text-error-content"
            } shadow-xl border border-base-content/10 text-xs flex items-center gap-2`}
          >
            {toast.type === "success" ? (
              <Check className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <AlertCircle className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
