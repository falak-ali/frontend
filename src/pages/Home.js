import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Star, Users, ArrowRight, Search, ShieldCheck, Zap, Headphones,
  Award, Car, TrendingUp, MapPin, Calendar, CheckCircle2,
} from "lucide-react";
import HeroSearch from "../components/HeroSearch";
import CarCard from "../components/CarCard";
import carService from "../services/carService";
import { cityStats } from "../data/cars";

const featuredStats = [
  { label: "Cars Available", value: cityStats.carsAvailable, icon: Car },
  { label: "Cars in Fleet", value: cityStats.carsInFleet, icon: TrendingUp },
  { label: "Cities Covered", value: cityStats.citiesCovered, icon: MapPin },
  { label: "User Rating", value: cityStats.userRating, icon: Star, suffix: "/5" },
  { label: "Happy Customers", value: `${(cityStats.happyCustomers / 1000).toFixed(1)}K+`, icon: Users },
];

const steps = [
  { icon: Search, title: "Search", description: "Pick your location, dates and preferred car type in seconds." },
  { icon: Calendar, title: "Book", description: "Choose your protection, add extras and confirm your reservation." },
  { icon: Car, title: "Drive", description: "Pick up your keys and hit the road with complete peace of mind." },
];

const reasons = [
  { icon: ShieldCheck, title: "Full Protection", description: "Every rental includes standard coverage with optional zero-deductible upgrades." },
  { icon: Zap, title: "Fast & Easy", description: "Book a car in under two minutes. No paperwork, no waiting." },
  { icon: Headphones, title: "24/7 Support", description: "Our team is available around the clock, wherever your journey takes you." },
  { icon: Award, title: "Instant Booking", description: "Get instant confirmation the moment you complete your payment." },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carService.getFeatured().then(setFeatured).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-gradient-to-b from-primary-50/60 to-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 -right-20 h-72 w-72 rounded-full bg-primary-100/40 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-primary-50 blur-3xl" />
        </div>

        <div className="container-page relative pt-12 pb-16 sm:pt-16 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="max-w-2xl">
              <span className="badge bg-primary-100 text-primary-800 mb-4">
                <Star className="h-3.5 w-3.5 fill-current" /> Rated {cityStats.userRating}/5 by {cityStats.happyCustomers.toLocaleString()}+ customers
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink-900 leading-tight">
                Premium Mobility for Your <span className="text-primary-800">Every Journey</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-ink-500 max-w-xl">
                Find and reserve quality vehicles across Pakistan. From economy to luxury, we have the perfect ride for every occasion.
              </p>
              <div className="mt-6">
                <HeroSearch />
              </div>
            </div>

n          <div className="hidden lg:block relative">
            <div className="absolute -top-8 -right-8 h-full w-full rounded-3xl bg-primary-200/30 blur-2xl" />
            <img
              src="https://images.pexels.com/photos/5063634/pexels-photo-5063634.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="Luxury car driving on a highway at sunset"
              className="relative rounded-3xl shadow-lift w-full object-cover h-[420px]"
            />
          </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container-page -mt-8 relative z-10">
        <div className="card p-5 sm:p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {featuredStats.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center gap-1.5">
              <span className="h-10 w-10 rounded-xl bg-primary-50 text-primary-800 flex items-center justify-center">
                <s.icon className="h-5 w-5" />
              </span>
              <p className="text-xl font-extrabold text-ink-900">{s.value}{s.suffix || ""}</p>
              <p className="text-xs text-ink-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED CARS */}
      <section className="container-page mt-20">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="section-title">Featured Vehicles</h2>
            <p className="section-sub">Hand-picked cars from our premium fleet</p>
          </div>
          <Link to="/cars" className="btn btn-secondary btn-sm shrink-0">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="aspect-[16/10] rounded-xl bg-ink-100" />
                <div className="h-5 bg-ink-100 rounded mt-4 w-3/4" />
                <div className="h-4 bg-ink-100 rounded mt-2 w-1/2" />
                <div className="h-9 bg-ink-100 rounded mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>

      {/* 3 STEPS */}
      <section className="bg-ink-50/60 mt-20 py-16">
        <div className="container-page">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="section-title">Drive in 3 Simple Steps</h2>
            <p className="section-sub">Booking your next ride has never been easier</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {steps.map((s, i) => (
              <div key={s.title} className="card p-6 text-center relative">
                <span className="absolute -top-3 left-6 h-7 w-7 rounded-full bg-primary-800 text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="h-14 w-14 mx-auto rounded-2xl bg-primary-50 text-primary-800 flex items-center justify-center">
                  <s.icon className="h-7 w-7" />
                </span>
                <h3 className="font-bold text-ink-900 mt-4">{s.title}</h3>
                <p className="text-sm text-ink-500 mt-2">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="container-page mt-20">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="section-title">Why Choose DriveEasy?</h2>
          <p className="section-sub">We make car rental simple, transparent and reliable</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r) => (
            <div key={r.title} className="card p-6 hover:shadow-lift transition-shadow">
              <span className="h-12 w-12 rounded-xl bg-primary-50 text-primary-800 flex items-center justify-center">
                <r.icon className="h-6 w-6" />
              </span>
              <h3 className="font-bold text-ink-900 mt-4">{r.title}</h3>
              <p className="text-sm text-ink-500 mt-2">{r.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="container-page mt-20">
        <div className="relative rounded-3xl bg-primary-800 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-primary-600/40 blur-3xl" />
            <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-primary-950/30 blur-3xl" />
          </div>
          <div className="relative p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="max-w-lg text-center sm:text-left">
              <span className="badge bg-white/15 text-white mb-3">
                <CheckCircle2 className="h-3.5 w-3.5" /> Limited Time Offer
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Get 15% off your first booking
              </h2>
              <p className="text-primary-100 mt-3">
                Use promo code <span className="font-bold text-white">DRIVE15</span> at checkout and save on your first premium rental.
              </p>
            </div>
            <Link to="/cars" className="btn bg-white text-primary-800 hover:bg-primary-50 btn-lg shrink-0">
              Browse Fleet <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
