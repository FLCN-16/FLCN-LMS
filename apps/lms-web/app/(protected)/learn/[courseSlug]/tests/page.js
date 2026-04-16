async function CourseTestsPage({ params }) {
    const { courseSlug } = await params;
    return <div>Course Tests: {courseSlug}</div>;
}
export default CourseTestsPage;
