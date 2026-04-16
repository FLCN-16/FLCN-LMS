interface CoursePackageFeatureProps {
    title: string;
    isIncluded: boolean;
}
interface CoursePackageProps {
    title: string;
    price: string | number;
    validityMonths: number;
    features: CoursePackageFeatureProps[];
}
declare function CoursePackage({ title, price, validityMonths, features, }: CoursePackageProps): import("react").JSX.Element;
export default CoursePackage;
//# sourceMappingURL=package.d.ts.map