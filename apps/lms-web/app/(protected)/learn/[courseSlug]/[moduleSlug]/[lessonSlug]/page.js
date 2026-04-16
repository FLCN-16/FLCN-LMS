import dynamic from "next/dynamic";
import { AspectRatio } from "@flcn-lms/ui/components/aspect-ratio";
const PlayerComponent = dynamic(() => import("@/components/player"));
const CourseModuleLessons = dynamic(() => import("./_components/module-lessons"));
async function UserCourseLessonPage() {
    return (<div className="flex flex-col gap-y-4">
      <div className="">
        <AspectRatio ratio={16 / 9}>
          <PlayerComponent src="https://stream.mux.com/BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM/highest.mp4"/>
        </AspectRatio>
      </div>

      <CourseModuleLessons />
    </div>);
}
export default UserCourseLessonPage;
