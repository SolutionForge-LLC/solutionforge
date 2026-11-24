"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const RECIPIENT = "info@solutionforge.dev";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = "660cdd76-da5b-431e-a8b6-1d0abf177c7b";

const projectTypes = [
  { value: "website", label: "Website" },
  { value: "outreach", label: "Outreach" },
  { value: "automation", label: "Automation / AI workflow" },
  { value: "other", label: "Other" },
] as const;

const projectStatuses = [
  { value: "new", label: "New project" },
  { value: "existing", label: "Existing project" },
] as const;

type Status = "idle" | "sending" | "success" | "error";

export default function BriefForm() {
  const [status, setStatus] = useState<Status>("idle");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusName = () => nameRef.current?.focus({ preventScroll: true });
    const onNavigated = (event: Event) => {
      if ((event as CustomEvent<string>).detail === "#contact") focusName();
    };

    window.addEventListener("sf:navigated-to", onNavigated);
    if (window.location.hash === "#contact") focusName();
    return () => window.removeEventListener("sf:navigated-to", onNavigated);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const projectType =
      projectTypes.find((type) => type.value === data.get("projectType"))
        ?.label ?? "Other";
    const projectStatus =
      projectStatuses.find((item) => item.value === data.get("projectStatus"))
        ?.label ?? "";
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const situation = String(data.get("situation") ?? "").trim();
    const outcome = String(data.get("outcome") ?? "").trim();

    setStatus("sending");

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `SolutionForge project brief — ${projectType}`,
          from_name: name,
          email,
          project_type: projectType,
          project_status: projectStatus,
          company: company || "—",
          situation,
          outcome,
          botcheck: data.get("botcheck") ?? "",
        }),
      });
      const result = (await response.json()) as { success?: boolean };

      if (response.ok && result.success) {
        form.reset();
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className="brief-form" onSubmit={handleSubmit}>
      <div className="brief-form-grid">
        <div className="brief-field">
          <label htmlFor="brief-name">Name</label>
          <input id="brief-name" name="name" type="text" required autoComplete="name" ref={nameRef} />
        </div>
        <div className="brief-field">
          <label htmlFor="brief-email">Email</label>
          <input id="brief-email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="brief-field">
          <label htmlFor="brief-company">Company <span className="brief-optional">optional</span></label>
          <input id="brief-company" name="company" type="text" autoComplete="organization" />
        </div>
        <div className="brief-field">
          <label htmlFor="brief-project-type">Project type</label>
          <select id="brief-project-type" name="projectType" required defaultValue="">
            <option value="" disabled>
              Choose one
            </option>
            {projectTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="brief-field brief-radios">
        <legend>New or existing project?</legend>
        {projectStatuses.map((item) => (
          <label key={item.value} className="brief-radio">
            <input type="radio" name="projectStatus" value={item.value} required />
            {item.label}
          </label>
        ))}
      </fieldset>

      <div className="brief-field">
        <label htmlFor="brief-situation">Current situation</label>
        <textarea
          id="brief-situation"
          name="situation"
          rows={3}
          required
          placeholder="What exists today, and what's getting in the way?"
        />
      </div>

      <div className="brief-field">
        <label htmlFor="brief-outcome">What better looks like</label>
        <textarea
          id="brief-outcome"
          name="outcome"
          rows={3}
          required
          placeholder="What observable change would make this project worth doing?"
        />
      </div>

      <input
        type="text"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="brief-honeypot"
      />

      <button className="button button-light brief-submit" type="submit" disabled={status === "sending"}>
        <span className="button-label">
          {status === "sending" ? "Sending…" : "Send the brief"}
        </span>
        <span className="button-icon" aria-hidden="true">↗</span>
      </button>

      {status === "success" && (
        <p className="brief-form-status is-success" role="status">
          Brief sent — we&apos;ll reply to the email you provided. Talk soon.
        </p>
      )}
      {status === "error" && (
        <p className="brief-form-status is-error" role="alert">
          Something went wrong sending the brief. Please try again, or email us
          directly at{" "}
          <a href={`mailto:${RECIPIENT}`}>{RECIPIENT}</a>.
        </p>
      )}
    </form>
  );
}
