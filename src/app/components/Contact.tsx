import KineticHeading from "./KineticHeading";
import BriefForm from "./BriefForm";

export default function Contact() {
  return (
    <section id="contact" className="section contact-section">
      <div className="shell contact-layout">
        <div className="contact-copy">
          <p className="section-label section-label-light">Start / 05</p>
          <KineticHeading>Tell us what needs to work better.</KineticHeading>
          <p>
            Tell us whether you need a website, outreach support, or a better
            workflow. Tell us what is getting in the way today. That is enough for a
            useful first conversation.
          </p>
          <BriefForm />
          <a className="contact-email" href="mailto:info@solutionforge.dev">info@solutionforge.dev</a>
        </div>

        <div className="brief-panel">
          <div className="brief-panel-header">
            <span className="mono-label">PROJECT BRIEF / START HERE</span>
            <span aria-hidden="true">↘</span>
          </div>
          <ol>
            <li>
              <span>01</span>
              <div><h3>The project</h3><p>What do you need to build, launch, or improve?</p></div>
            </li>
            <li>
              <span>02</span>
              <div><h3>The context</h3><p>Who is it for, what exists today, and which constraints matter?</p></div>
            </li>
            <li>
              <span>03</span>
              <div><h3>The useful outcome</h3><p>What observable change would make the project worth doing?</p></div>
            </li>
          </ol>
          <p className="brief-note">No polished requirements document needed.</p>
        </div>
      </div>
    </section>
  );
}
