/**
 * SkillsBelt — the asteroid belt, in accessible form.
 *
 * The WebGL layer renders these skills as hoverable asteroids; here they are a
 * grouped, readable list so the information exists for everyone. Grouping by
 * category keeps the semantic version scannable.
 */
import { skills } from "@/content/skills";

export function SkillsBelt() {
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section
      aria-labelledby="skills-heading"
      className="mx-auto max-w-content px-[var(--gutter-inline)] py-3xl"
    >
      <h2
        id="skills-heading"
        className="font-caption text-small uppercase tracking-[0.28em] text-ink-muted"
      >
        The Belt · Skills
      </h2>

      <div className="mt-xl grid gap-xl tablet:grid-cols-3">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="font-caption text-caption uppercase tracking-[0.2em] text-brass">
              {category}
            </h3>
            <ul className="mt-md flex flex-col gap-2">
              {skills
                .filter((s) => s.category === category)
                .map((skill) => (
                  <li
                    key={skill.name}
                    className="font-body text-lead text-ink-soft"
                  >
                    {skill.name}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
