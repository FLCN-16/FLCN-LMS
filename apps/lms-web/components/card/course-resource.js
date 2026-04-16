import Image from "next/image";
import { Heading } from "@flcn-lms/ui/components/typography";
function CourseResource() {
    return (<div className="flex max-w-80 gap-x-3 rounded-sm border p-3">
      <Image src="https://placehold.co/150x100" alt="Placeholder" width={150} height={100}/>
      <div className="flex flex-col">
        <Heading variant="h5">Lesson 1</Heading>
      </div>
    </div>);
}
export default CourseResource;
