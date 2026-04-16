async function CourseNotesPage({ params }) {
    const { courseSlug } = await params;
    return <div>Course Notes: {courseSlug}</div>;
}
export default CourseNotesPage;
