import { Link } from "react-router-dom";
import { Car, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-200 mt-20">
      <div className="container-page py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-800 text-white">
                <Car className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold text-white">
                Drive<span className="text-primary-400">Easy</span>
              </span>
            </Link>
            <p className="text-sm text-ink-400 leading-relaxed">
              Premium mobility for your every journey. Find and reserve quality vehicles across Pakistan with confidence and ease.
            </p>
            <div className="flex gap-3 mt-5">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 rounded-lg bg-ink-800 hover:bg-primary-800 flex items-center justify-center transition-colors"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/cars" className="hover:text-white transition-colors">Our Fleet</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">My Bookings</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-primary-400 shrink-0" />
                <span>Shahrah-e-Faisal, Karachi, Pakistan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary-400 shrink-0" />
                <span>+92 21 111 333 444</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary-400 shrink-0" />
                <span>support@driveeasy.pk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ink-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-ink-400">© {new Date().getFullYear()} DriveEasy. All rights reserved.</p>
          <p className="text-sm text-ink-500">Designed in Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
