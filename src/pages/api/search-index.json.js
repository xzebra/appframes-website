// This endpoint generates a search index of all documentation pages
export async function GET() {
  const docs = [
    {
      title: "AppFrames Documentation",
      description: "Get started building beautiful app screenshots and mockups with AppFrames. Learn about features, templates, and more.",
      route: "/docs",
      content: "AppFrames documentation welcome page getting started features templates mockups screenshots"
    },
    {
      title: "Getting Started",
      description: "Learn how to get started with AppFrames and create your first mockup.",
      route: "/docs/getting-started",
      content: "getting started installation mac app store testflight launch project import screenshots customize layout export mockup"
    },
    {
      title: "Creating Professional Mockups",
      description: "Learn advanced techniques for creating professional app mockups with AppFrames.",
      route: "/docs/creating-mockups",
      content: "professional mockups templates app store marketing materials presentation slides branding hierarchy layers export optimization"
    },
    {
      title: "Templates Reference",
      description: "Complete reference of all available templates in AppFrames.",
      route: "/docs/templates",
      content: "templates reference mac app store single screenshot multi-screenshot marketing social media web print presentation conference device frames customization"
    },
    {
      title: "Features",
      description: "Explore all the powerful features that make AppFrames special.",
      route: "/docs/features",
      content: "features device frames templates layer management export options dark mode themes variants screenshots mockups"
    },
    {
      title: "API Reference",
      description: "Technical reference for AppFrames APIs and integrations.",
      route: "/docs/api",
      content: "api reference technical documentation integration automation scripting export formats"
    }
  ];

  return new Response(JSON.stringify(docs), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}