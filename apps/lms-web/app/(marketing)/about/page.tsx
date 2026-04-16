import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About FLCN LMS",
  description: "Learn about our learning management system and mission",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              About FLCN LMS
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Empowering learners and educators with a comprehensive learning
              management system
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold">Our Mission</h2>
            <p className="mb-4 text-lg text-muted-foreground">
              We believe that quality education should be accessible to
              everyone, everywhere. FLCN LMS is built to provide educators and
              learners with powerful tools to create, share, and engage with
              educational content.
            </p>
            <p className="text-lg text-muted-foreground">
              Our platform combines ease of use with powerful features, enabling
              institutions and individual educators to deliver exceptional
              learning experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-12 text-3xl font-bold">Our Values</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Accessibility</h3>
                <p className="text-muted-foreground">
                  Making quality education accessible to learners regardless of
                  their background or location
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Innovation</h3>
                <p className="text-muted-foreground">
                  Continuously improving our platform with cutting-edge
                  technology and user feedback
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Community</h3>
                <p className="text-muted-foreground">
                  Building a vibrant community of learners and educators who
                  support each other
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-12 text-3xl font-bold">Why Choose FLCN LMS?</h2>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="text-xl font-bold text-primary">✓</span>
                <span className="text-muted-foreground">
                  <strong>Easy to Use:</strong> Intuitive interface designed for
                  both educators and learners
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-xl font-bold text-primary">✓</span>
                <span className="text-muted-foreground">
                  <strong>Comprehensive Tools:</strong> Everything you need to
                  create and manage courses
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-xl font-bold text-primary">✓</span>
                <span className="text-muted-foreground">
                  <strong>Reliable Platform:</strong> Built with modern
                  technology for reliability and scale
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-xl font-bold text-primary">✓</span>
                <span className="text-muted-foreground">
                  <strong>Dedicated Support:</strong> Our team is here to help
                  you succeed
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
