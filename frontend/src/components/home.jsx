import React from "react";
import Header from "./header";
import Banner from "./banner";
import bannerImage from "../assets/images/banner.jpg";
import CenteredGrid from "./centerGrid";
import FeaturedListings from "./featureListing";

function Home() {
  const title = "Welcome to Our Website";
  const subtitle = "Discover amazing products and services";
  return (
    <div>
      <Header />
      <div>
        <Banner imageUrl={bannerImage} title={title} subtitle={subtitle} />
      </div>
      <CenteredGrid />
      <FeaturedListings/>
    </div>
  );
}
export default Home;
