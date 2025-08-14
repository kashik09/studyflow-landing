import Section from "../components/section.jsx";
import FeatureCard from "../components/feature-card.jsx";

export default function Features() {
  return (
    <>
      <Section title="Features" subtitle="What you get on day one">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard title="GPT‑style workspace">
            A chat layout that feels familiar and fast for study sessions.
          </FeatureCard>
          <FeatureCard title="Note compiler">
            Clean bullets from messy notes with one click. Local and instant.
          </FeatureCard>
          <FeatureCard title="Calm UI vibes">
            Pastel palette and soft cards that lower the mental load.
          </FeatureCard>
          <FeatureCard title="Mobile friendly">
            Smooth on phones, tablets, and laptops.
          </FeatureCard>
          <FeatureCard title="Privacy by default">
            The demo runs fully in your browser. No data leaves your device.
          </FeatureCard>
          <FeatureCard title="Ready to scale">
            Connect to a backend later for long context and model calls.
          </FeatureCard>
        </div>
      </Section>
    </>
  );
}
