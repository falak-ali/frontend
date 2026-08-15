import { useEffect, useState } from "react";
import { Upload, FileImage, IdCard, CheckCircle2, XCircle, Clock, Loader2, AlertCircle, RotateCcw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import verificationService from "../services/verificationService";
import { formatDate } from "../utils/format";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const STATUS_LABELS = {
  not_submitted: { label: "Not Submitted", color: "text-ink-500", icon: AlertCircle },
  pending: { label: "Under Review", color: "text-warning-600", icon: Clock },
  approved: { label: "Approved", color: "text-success-600", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "text-error-600", icon: XCircle },
};

function getOverallStatus(status) {
  if (!status || (!status.cnic && !status.license)) return "not_submitted";
  if (status.cnic === "approved" && status.license === "approved") return "approved";
  if (status.cnic === "rejected" || status.license === "rejected") return "rejected";
  if (status.cnic === "pending" || status.license === "pending") return "pending";
  return "not_submitted";
}

export default function UserVerification() {
  const { user, updateUser } = useAuth();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState({ cnicFront: null, cnicBack: null, licenseFront: null, licenseBack: null });
  const [previews, setPreviews] = useState({});
  const [fileErrors, setFileErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    verificationService
      .getStatus(user.id)
      .then((s) => {
        if (active) {
          setStatus(s);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [user]);

  const handleFile = (key, file) => {
    setSubmitError("");
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileErrors((e) => ({ ...e, [key]: "Please upload a JPG, PNG, or WebP image." }));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileErrors((e) => ({ ...e, [key]: "File is too large. Maximum size is 4 MB." }));
      return;
    }

    setFileErrors((e) => ({ ...e, [key]: null }));
    setFiles((f) => ({ ...f, [key]: file }));
    const reader = new FileReader();
    reader.onload = (ev) => setPreviews((p) => ({ ...p, [key]: ev.target.result }));
    reader.onerror = () => setFileErrors((e) => ({ ...e, [key]: "Could not read this file. Please try another." }));
    reader.readAsDataURL(file);
  };

  const allUploaded =
    files.cnicFront && files.cnicBack && files.licenseFront && files.licenseBack;
  const hasFileErrors = Object.values(fileErrors).some(Boolean);

  const handleSubmit = async () => {
    if (!allUploaded || hasFileErrors) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const result = await verificationService.submit({
        userId: user.id,
        cnicFront: previews.cnicFront,
        cnicBack: previews.cnicBack,
        licenseFront: previews.licenseFront,
        licenseBack: previews.licenseBack,
      });
      setStatus(result);
      updateUser({ verification: result });
      setSaved(true);
      setFiles({ cnicFront: null, cnicBack: null, licenseFront: null, licenseBack: null });
      setPreviews({});
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      setSubmitError(err?.message || "Something went wrong while submitting your documents. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFiles({ cnicFront: null, cnicBack: null, licenseFront: null, licenseBack: null });
    setPreviews({});
    setFileErrors({});
    setSubmitError("");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 text-primary-800 animate-spin" />
      </div>
    );
  }

  const overall = getOverallStatus(status);
  const overallMeta = STATUS_LABELS[overall];
  const isApproved = overall === "approved";
  const isPending = overall === "pending";

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">CNIC & License Verification</h1>
      <p className="text-ink-500 text-sm mt-1">
        Upload your CNIC and driving license for verification. This is required before you can pick up your vehicle.
      </p>

      {/* Status banner */}
      <div className={`card p-4 mt-6 flex items-center gap-3 ${
        isApproved ? "border-success-200 bg-success-50/50" :
        overall === "rejected" ? "border-error-200 bg-error/5" :
        isPending ? "border-warning-200 bg-warning/5" :
        "border-ink-200"
      }`}>
        <overallMeta.icon className={`h-6 w-6 ${overallMeta.color}`} />
        <div className="flex-1">
          <p className="font-semibold text-ink-900 text-sm">{overallMeta.label}</p>
          <p className="text-xs text-ink-500">
            {isApproved ? "Your documents have been approved. You're good to go!" :
             overall === "rejected" ? "Some documents were rejected. Please re-upload clear photos for review." :
             isPending ? "Your documents are under review. This usually takes 24-48 hours." :
             "Upload your CNIC and driving license below to start the verification process."}
          </p>
        </div>
        {status?.submittedAt && (
          <span className="text-xs text-ink-400 shrink-0 hidden sm:block">
            Submitted {formatDate(status.submittedAt)}
          </span>
        )}
      </div>

      {/* Per-document status breakdown when submitted */}
      {(isPending || isApproved || overall === "rejected") && status && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <DocStatusCard title="CNIC" status={status.cnic} />
          <DocStatusCard title="Driving License" status={status.license} />
        </div>
      )}

      {isApproved ? (
        <div className="card p-6 mt-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-success-600 mx-auto" />
          <p className="font-bold text-ink-900 mt-3">All Verified</p>
          <p className="text-sm text-ink-500 mt-1">Your CNIC and driving license are both approved.</p>
        </div>
      ) : isPending ? (
        <div className="card p-6 mt-6 text-center">
          <Clock className="h-10 w-10 text-warning-500 mx-auto" />
          <p className="font-bold text-ink-900 mt-3">Review In Progress</p>
          <p className="text-sm text-ink-500 mt-1 max-w-md mx-auto">
            Your documents have been submitted and are being reviewed by our team. You'll be able to
            pick up your vehicle once verification is complete.
          </p>
        </div>
      ) : (
        <div className="space-y-6 mt-6">
          {/* CNIC section */}
          <section className="card p-5 sm:p-6">
            <h2 className="font-bold text-ink-900 mb-1 flex items-center gap-2">
              <IdCard className="h-5 w-5 text-primary-800" /> CNIC (National ID)
            </h2>
            <p className="text-sm text-ink-500 mb-4">Upload clear photos of the front and back of your CNIC.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UploadBox
                label="CNIC Front"
                previewKey="cnicFront"
                previews={previews}
                onChange={(file) => handleFile("cnicFront", file)}
                error={fileErrors.cnicFront}
              />
              <UploadBox
                label="CNIC Back"
                previewKey="cnicBack"
                previews={previews}
                onChange={(file) => handleFile("cnicBack", file)}
                error={fileErrors.cnicBack}
              />
            </div>
          </section>

          {/* License section */}
          <section className="card p-5 sm:p-6">
            <h2 className="font-bold text-ink-900 mb-1 flex items-center gap-2">
              <FileImage className="h-5 w-5 text-primary-800" /> Driving License
            </h2>
            <p className="text-sm text-ink-500 mb-4">Upload clear photos of the front and back of your driving license.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UploadBox
                label="License Front"
                previewKey="licenseFront"
                previews={previews}
                onChange={(file) => handleFile("licenseFront", file)}
                error={fileErrors.licenseFront}
              />
              <UploadBox
                label="License Back"
                previewKey="licenseBack"
                previews={previews}
                onChange={(file) => handleFile("licenseBack", file)}
                error={fileErrors.licenseBack}
              />
            </div>
          </section>

          {/* File requirements hint */}
          <div className="flex items-start gap-2 text-xs text-ink-500 bg-ink-50 rounded-xl px-4 py-3">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              Accepted formats: JPG, PNG, WebP. Maximum file size: 4 MB per image.
              Make sure all text is clearly readable and the entire document is visible.
            </span>
          </div>

          {saved && (
            <div className="bg-success-50 border border-success-200 text-success-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Documents submitted successfully. Your verification is now pending review.
            </div>
          )}

          {submitError && (
            <div className="bg-error/5 border border-error-200 text-error-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {submitError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              disabled={submitting || !allUploaded || hasFileErrors}
              className="btn btn-primary btn-lg flex-1 sm:flex-none"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Upload className="h-5 w-5" /> Submit for Verification</>}
            </button>
            {(allUploaded || Object.keys(previews).length > 0) && (
              <button onClick={handleReset} className="btn btn-secondary btn-lg">
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DocStatusCard({ title, status }) {
  const meta = STATUS_LABELS[status] || STATUS_LABELS.not_submitted;
  const Icon = meta.icon;
  return (
    <div className="card p-4 flex items-center justify-between">
      <div>
        <p className="font-semibold text-ink-900 text-sm">{title}</p>
        <p className={`text-xs font-medium mt-0.5 ${meta.color}`}>{meta.label}</p>
      </div>
      <Icon className={`h-5 w-5 ${meta.color}`} />
    </div>
  );
}

function UploadBox({ label, previewKey, previews, onChange, error }) {
  const preview = previews[previewKey];
  return (
    <div>
      <label className="label">{label}</label>
      <label className={`relative block aspect-[3/2] rounded-xl border-2 border-dashed cursor-pointer overflow-hidden transition ${
        error ? "border-error-300" : preview ? "border-primary-300" : "border-ink-200 hover:border-primary-300"
      }`}>
        {preview ? (
          <>
            <img src={preview} alt={label} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-ink-900/0 hover:bg-ink-900/20 transition flex items-center justify-center">
              <span className="text-white text-xs font-medium opacity-0 hover:opacity-100 transition bg-ink-900/70 px-3 py-1.5 rounded-lg">
                Change photo
              </span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-400">
            <Upload className="h-7 w-7" />
            <span className="text-xs">Click to upload</span>
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0])}
        />
      </label>
      {error ? (
        <p className="text-xs mt-1.5 font-medium text-error-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      ) : preview ? (
        <p className="text-xs mt-1.5 font-medium text-success-600 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" /> Ready to submit
        </p>
      ) : null}
    </div>
  );
}
