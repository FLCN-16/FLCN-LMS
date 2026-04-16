const STATS = [
    { value: "10K+", label: "Learners" },
    { value: "200+", label: "Courses" },
    { value: "50+", label: "Instructors" },
    { value: "95%", label: "Completion Rate" },
];
function StatItem({ value, label }) {
    return (<div className="flex flex-col items-center gap-1 text-center">
      <span className="font-heading text-3xl font-bold md:text-4xl">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>);
}
function StatsSection() {
    return (<section className="bg-muted/30 py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat) => (<StatItem key={stat.label} value={stat.value} label={stat.label}/>))}
        </div>
      </div>
    </section>);
}
export default StatsSection;
