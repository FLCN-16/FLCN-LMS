import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle, } from "@flcn-lms/ui/components/card";
export function PanelPlaceholderPage({ title, description, tasks, }) {
    return (<>
      <Helmet>
        <title>{title} — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {tasks.map((task) => (<Card key={task}>
              <CardHeader>
                <CardTitle className="text-base">{task}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This admin workspace is prepared in the panel and can be wired
                  to backend modules and dashboard queries next.
                </p>
              </CardContent>
            </Card>))}
        </div>
      </div>
    </>);
}
