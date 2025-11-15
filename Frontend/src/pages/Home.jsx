import AppSection from "../components/AppSection";
import FeaturedRestaurants from "../components/FeaturedRestaurants";
import Hero from "../components/Hero";
import Offers from "../components/Offers";
import PopularDishes from "../components/PopularDishes";
import Reviews from "../components/Reviews";
import SearchSection from "../components/SearchSection";

// Home Page
export default function Home() {
  return (
    <>
      <Hero />
      <SearchSection />
      <Offers />
      <PopularDishes />
      <FeaturedRestaurants />
      <Reviews />
      <AppSection />
    </>
  );
}