import dynamic from "next/dynamic";
import Header from "./_components/header";
const Footer = dynamic(() => import("./_components/footer"));
async function MarketingLayout({ children }) {
    return (<>
      <Header />
      {children}
      <Footer />
    </>);
}
export default MarketingLayout;
