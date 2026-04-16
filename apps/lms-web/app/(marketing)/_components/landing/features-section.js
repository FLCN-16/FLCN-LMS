import { Certificate01Icon, CheckListIcon, NoteEditIcon, PlayCircleIcon, SmartPhone01Icon, VideoReplayIcon, } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card } from "@flcn-lms/ui/components/card";
const FEATURES = [
    {
        icon: PlayCircleIcon,
        title: "Video Lessons",
        description: "Stream high-quality video lectures from expert instructors at your own pace, anytime.",
    },
    {
        icon: CheckListIcon,
        title: "Practice Tests",
        description: "Reinforce your knowledge with topic-based quizzes and full-length mock exams.",
    },
    {
        icon: Certificate01Icon,
        title: "Certificates",
        description: "Earn verifiable certificates upon course completion to share with employers.",
    },
    {
        icon: NoteEditIcon,
        title: "Smart Notes",
        description: "Take and organise timestamped notes right inside the player while you learn.",
    },
    {
        icon: VideoReplayIcon,
        title: "Live Sessions",
        description: "Join scheduled live classes and interact with instructors in real time.",
    },
    {
        icon: SmartPhone01Icon,
        title: "Mobile Friendly",
        description: "Learn on the go — our platform is fully optimised for phones and tablets.",
    },
];
function FeatureCard({ icon, title, description }) {
    return (<Card className="rounded-md p-6 transition-shadow duration-200 hover:shadow-md">
      <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-primary/10">
        <HugeiconsIcon icon={icon} className="size-6 text-primary"/>
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>);
}
function FeaturesSection() {
    return (<section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 space-y-2 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              Why Choose FLCN LMS?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Everything you need to learn, practise, and prove your skills —
              all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (<FeatureCard key={feature.title} {...feature}/>))}
          </div>
        </div>
      </div>
    </section>);
}
export default FeaturesSection;
