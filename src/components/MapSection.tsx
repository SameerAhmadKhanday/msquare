import { MapPin, Phone, Clock, Navigation } from "lucide-react";

const MapSection = () => {
  return (
    <section className="bg-secondary py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-secondary-foreground text-center mb-2">
          Find Our Office
        </h2>
        <p className="text-muted-foreground text-center mb-10 max-w-md mx-auto text-sm">
          Visit us at our office for a personal consultation
        </p>

        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          {/* Info Side */}
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-display font-semibold text-secondary-foreground">Office Address</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Main Market Srigufwara,<br />
                  Near Jammu & Kashmir Bank Branch Srigufwara,<br />
                  Pin Code — 192401
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-display font-semibold text-secondary-foreground">Working Hours</h3>
                <p className="text-muted-foreground text-sm">
                  Mon – Sat: 9:00 AM – 6:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            <a
              href="https://maps.app.goo.gl/7o4dr1MumeNg8dyd8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 text-sm font-semibold text-primary hover:underline w-fit"
            >
              <Navigation className="w-4 h-4" />
              Get Directions on Google Maps
            </a>
          </div>

          {/* Map Side */}
          <div className="flex-1 min-h-[300px] rounded-lg overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3308.8!2d75.0647!3d33.7481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e1a4d0a9c7e8b7%3A0x0!2sSrigufwara%2C%20Jammu%20and%20Kashmir%20192401!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="M-Square Architects Office Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
