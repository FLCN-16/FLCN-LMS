async function CourseTestPage({ params }) {
    const { courseSlug } = await params;
    return <div>Test {courseSlug}</div>;
}
export default CourseTestPage;
