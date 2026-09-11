import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { User, Check, AlertCircle, RotateCcw, Save } from "lucide-react";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";
import Card3DZoomModal from "./Card3DZoomModal";

export default function Profile() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const location = useLocation();

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
      setToast({
        type: "error",
        message: "Maximum limit of 30 skills reached.",
      });
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
        message: `"${trimmed}" is already added to your skills.`,
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
    <div className="flex-1 flex flex-col justify-center w-full max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-5 pb-20 md:pb-5">
      <div className="mb-3 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-base-content flex items-center justify-center sm:justify-start gap-2">
          <User className="w-5 h-5 text-primary stroke-[2.2]" />
          <span>Profile Settings</span>
        </h1>
        <p className="text-xs text-base-content/60 mt-0.5">
          Update your profile details and watch your live card update in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 card bg-base-100 shadow-xl border border-base-content/10 p-4 sm:p-5">
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-base-content/75 mb-1 block">
                  First Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Elon"
                  className="input input-sm input-bordered w-full rounded-lg focus:input-primary text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-base-content/75 mb-1 block">
                  Last Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Musk"
                  className="input input-sm input-bordered w-full rounded-lg focus:input-primary text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-base-content/75 mb-1 block">
                  Age
                </label>
                <input
                  type="number"
                  min="12"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 28"
                  className="input input-sm input-bordered w-full rounded-lg focus:input-primary text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-base-content/75 mb-1 block">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="select select-sm select-bordered w-full rounded-lg focus:select-primary text-xs capitalize"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-base-content/75 mb-1 block">
                Profile Picture URL
              </label>
              <input
                type="url"
                value={profilePictureUrl}
                onChange={(e) => setProfilePictureUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="input input-sm input-bordered w-full rounded-lg focus:input-primary text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-base-content/75 mb-1 block">
                Looking For
              </label>
              <input
                type="text"
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
                placeholder="e.g. Technical Co-founder, Founding Engineer"
                maxLength={100}
                className="input input-sm input-bordered w-full rounded-lg focus:input-primary text-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-base-content/75">
                  About (Bio)
                </label>
                <span className="text-[10px] text-base-content/50">
                  {about.length}/500
                </span>
              </div>
              <textarea
                rows={2}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Tell other founders and builders what you're passionate about..."
                maxLength={500}
                className="textarea textarea-bordered textarea-sm w-full rounded-lg focus:textarea-primary text-xs leading-relaxed"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-base-content/75">
                  Tech Stack & Skills
                </label>
                <span className="text-[10px] font-mono text-base-content/50">
                  {skills.length}/30 skills
                </span>
              </div>

              <div className="min-h-[2.5rem] p-2 rounded-lg border border-base-content/20 bg-base-200/40 flex flex-wrap items-center gap-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="badge badge-sm gap-1 bg-base-100 text-base-content border border-base-content/15 font-mono py-2 px-2"
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
                  className="input input-xs bg-transparent border-0 focus:outline-none text-xs flex-1 min-w-[130px] text-base-content"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-base-content/10 mt-1">
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

        <div className="lg:col-span-5 flex flex-col items-center justify-start gap-2 select-none">
          <div
            onClick={() => setIsZoomOpen(true)}
            className="cursor-pointer group relative transition-transform duration-200 hover:scale-[1.015] active:scale-[0.99] w-full max-w-sm flex justify-center"
            title="Click card to zoom and inspect in 3D"
          >
            <UserCard user={previewUser} showActions={false} />
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-base-100/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-primary shadow-lg border border-base-content/10 pointer-events-none">
              Click to Zoom 3D
            </div>
          </div>
          <p className="text-[11px] font-mono text-base-content/50 text-center">
            Tap card to inspect in 3D
          </p>
        </div>
      </div>

      {/* 3D Elevated Zoom Inspection Modal for Profile Preview */}
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
