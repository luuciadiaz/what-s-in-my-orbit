/**
 * ORBIT ROUTE — /orbit/[slug]
 *
 * Server-rendered destination for every world. Handles the five project planets
 * and the special "origin" home world. Statically generated for SEO, with
 * per-world metadata. This route is the crawlable, no-JS-safe backbone that the
 * WebGL "enter a planet" experience will later transition into.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, projectBySlug } from "@/content/projects";
import { about } from "@/content/about";
import { ProjectArticle } from "@/ui/project/ProjectArticle";
import { OriginArticle } from "@/ui/project/OriginArticle";

type Params = { slug: string };

/** Pre-render every world at build time. */
export function generateStaticParams(): Params[] {
  return [...projects.map((p) => ({ slug: p.slug })), { slug: "origin" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (slug === "origin") {
    return { title: about.title, description: about.manifesto[0] };
  }

  const project = projectBySlug[slug];
  if (!project) return {};

  return {
    title: `${project.title} — ${project.discipline}`,
    description: project.tagline,
  };
}

export default async function OrbitPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  if (slug === "origin") {
    return (
      <main id="atlas">
        <OriginArticle />
      </main>
    );
  }

  const project = projectBySlug[slug];
  if (!project) notFound();

  return (
    <main id="atlas">
      <ProjectArticle project={project} />
    </main>
  );
}
