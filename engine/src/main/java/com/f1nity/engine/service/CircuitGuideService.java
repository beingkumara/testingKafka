package com.f1nity.engine.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f1nity.library.models.engine.CircuitGuide;
import com.f1nity.library.repository.engine.CircuitGuideRepository;

@Service
public class CircuitGuideService {

        @Autowired
        private CircuitGuideRepository repository;

        @PostConstruct
        public void seedGuides() {
                System.out.println("Updating Circuit Guides...");
                List<CircuitGuide> guides = new ArrayList<>();
                // Bahrain
                guides.add(createGuide(
                                "bahrain",
                                "Bahrain International Circuit",
                                "Bahrain",
                                "The season opener in the desert. A twilight race with excellent facilities and guaranteed warm weather.",
                                Arrays.asList("Main Grandstand (start/finish view)", "Turn 1 (best overtaking)",
                                                "University Stand (budget friendly)"),
                                Arrays.asList("Free shuttle buses from major hotels", "Uber/Taxi is reliable",
                                                "Car rental is recommended for flexibility"),
                                Arrays.asList("The Tree of Life", "Bahrain Fort (Qal'at al-Bahrain)",
                                                "Block 338 for dining"),
                                Arrays.asList("Local Shawarma at jasmi's", "Souq Bab Al Bahrain"),
                                "BHD (Bahrain Dinar)",
                                "AST (GMT+3)",
                                2004,
                                57));

                // Jeddah
                guides.add(createGuide(
                                "jeddah",
                                "Jeddah Corniche Circuit",
                                "Saudi Arabia",
                                "The fastest street circuit in the world. Stunning night race along the Red Sea.",
                                Arrays.asList("Main Grandstand A (Start/Finish & Pits)", "Central Grandstand B",
                                                "General Admission (promenade views)"),
                                Arrays.asList("Ride-hailing apps (Careem/Uber)",
                                                "Free circuit shuttles from designated parking areas"),
                                Arrays.asList("Al-Balad (Historic District)", "King Fahd's Fountain",
                                                "Red Sea Mall"),
                                Arrays.asList("Al Baik (legendary fried chicken)", "Floating Mosque nearby"),
                                "SAR (Saudi Riyal)",
                                "AST (GMT+3)",
                                2021,
                                50));

                // Albert Park (Australia)
                guides.add(createGuide(
                                "albert_park",
                                "Albert Park Grand Prix Circuit",
                                "Australia",
                                "A fan favorite. The park atmosphere combined with a street circuit layout makes for an incredible weekend.",
                                Arrays.asList("Waite Stand (Turn 11/12 action)", "Schumacher Stand",
                                                "Prost Stand (Turn 15/16)"),
                                Arrays.asList("Free trams for ticketholders (Yarra Trams)",
                                                "Walking distance from St Kilda"),
                                Arrays.asList("St Kilda Beach", "Melbourne CBD laneways",
                                                "Royal Botanic Gardens"),
                                Arrays.asList("Coffee at Market Lane", "Lune Croissanterie"),
                                "AUD (Australian Dollar)",
                                "AEDT (GMT+11)",
                                1996,
                                58));

                // Suzuka (Japan)
                guides.add(createGuide(
                                "suzuka",
                                "Suzuka Circuit",
                                "Japan",
                                "A driver's favorite figure-of-eight track. The atmosphere from the passionate Japanese fans is unmatched.",
                                Arrays.asList("Q2 Stand (chicane - best overtaking)", "V Stand (Main Straight)",
                                                "B2 Stand (First Curve)"),
                                Arrays.asList("Kintetsu Line to Shiroko Station + Shuttle Bus",
                                                "JR Line to Suzuka Ino Station (20 min walk)"),
                                Arrays.asList("Suzuka Circuit Motopia Park", "Nagoya Castle (nearby city)",
                                                "Ise Grand Shrine"),
                                Arrays.asList("Matsusaka Beef", "Local Ramen shops outside the station"),
                                "JPY (Japanese Yen)",
                                "JST (GMT+9)",
                                1987,
                                53));

                // Miami
                guides.add(createGuide(
                                "miami",
                                "Miami International Autodrome",
                                "USA",
                                "A spectacle of glamour and racing around the Hard Rock Stadium.",
                                Arrays.asList("Turn 18 Grandstand", "Start/Finish Grandstand",
                                                "Marina Grandstands"),
                                Arrays.asList("Official Park & Ride Shuttles", "Rideshare to designated lots"),
                                Arrays.asList("South Beach", "Wynwood Walls", "Little Havana"),
                                Arrays.asList("Cuban Sandwich at Versailles", "Stone Crabs"),
                                "USD (US Dollar)",
                                "EST (GMT-5)",
                                2022,
                                57));

                // Monaco
                guides.add(createGuide(
                                "monaco",
                                "Circuit de Monaco",
                                "Monaco",
                                "The Jewel in the Crown. History, glamour, and the ultimate test of precision.",
                                Arrays.asList("Casino Square (Section B)", "Swimming Pool (Section L)",
                                                "K Grandstand (Tabac)"),
                                Arrays.asList("Train to Monaco-Monte Carlo station",
                                                "Walking is essential once inside"),
                                Arrays.asList("Casino de Monte-Carlo", "Oceanographic Museum",
                                                "Prince's Palace"),
                                Arrays.asList("Expensive everywhere, try bakeries for lunch",
                                                "La Condamine Market"),
                                "EUR (Euro)",
                                "CEST (GMT+2)",
                                1950,
                                78));

                // Canada
                guides.add(createGuide(
                                "montreal",
                                "Circuit Gilles Villeneuve",
                                "Canada",
                                "A fan-favorite island circuit with a party atmosphere in downtown Montreal.",
                                Arrays.asList("Grandstand 11/12 (Senna S)", "Grandstand 1 (Start/Finish)",
                                                "General Admission (Park vibes)"),
                                Arrays.asList("Metro to Jean-Drapeau station is the best way",
                                                "Avoid driving to the island"),
                                Arrays.asList("Old Montreal", "Mount Royal Park",
                                                "Crescent Street (Nightlife)"),
                                Arrays.asList("Poutine at La Banquise", "Montreal Bagels"),
                                "CAD (Canadian Dollar)",
                                "EDT (GMT-4)",
                                1978,
                                70));

                // Spain (Barcelona)
                guides.add(createGuide(
                                "catalunya",
                                "Circuit de Barcelona-Catalunya",
                                "Spain",
                                "A classic test track known for passionate fans and great visibility.",
                                Arrays.asList("Grandstand L (Turn 1)", "Grandstand F (End of straight)",
                                                "Grandstand G (Stadium section)"),
                                Arrays.asList("Train (R2) to Montmeló station + 30m walk/shuttle",
                                                "Sagalés Bus from Barcelona Nord"),
                                Arrays.asList("Sagrada Família", "Park Güell", "Gothic Quarter"),
                                Arrays.asList("Tapas in El Born", "Boqueria Market (avoid peak times)"),
                                "EUR (Euro)",
                                "CEST (GMT+2)",
                                1991,
                                66));

                // Austria
                guides.add(createGuide(
                                "red_bull_ring",
                                "Red Bull Ring",
                                "Austria",
                                "Short, fast, and incredibly scenic. The 'Orange Army' creates an electric atmosphere.",
                                Arrays.asList("Red Bull Grandstand (Sector 1)", "Start-Ziel (Start/Finish)",
                                                "General Admission (Hill views)"),
                                Arrays.asList("Train to Knittelfeld + Free Shuttle",
                                                "Camping at the track is the true experience"),
                                Arrays.asList("Graz (nearest city)", "Military Aviation Museum nearby",
                                                "Hiking in Styria"),
                                Arrays.asList("Schnitzel everywhere", "Local Styrian wines"),
                                "EUR (Euro)",
                                "CEST (GMT+2)",
                                1970,
                                71));

                // Silverstone
                guides.add(createGuide(
                                "silverstone",
                                "Silverstone Circuit",
                                "UK",
                                "The home of British motorsport. Fast, flowing, and historic.",
                                Arrays.asList("Becketts (High speed direction change)",
                                                "International Pits Straight", "Stowe (Overtaking)"),
                                Arrays.asList("Park & Ride is essential",
                                                "Megabus/National Express from major cities"),
                                Arrays.asList("Silverstone Museum", "Oxford (nearby)",
                                                "Bicester Village (Shopping)"),
                                Arrays.asList("Pub lunch in nearby villages", "Pasty at the track"),
                                "GBP (Pound Sterling)",
                                "BST (GMT+1)",
                                1950,
                                52));

                // Hungary
                guides.add(createGuide(
                                "hungaroring",
                                "Hungaroring",
                                "Hungary",
                                "A tight, twisty 'Monaco without walls' just outside beautiful Budapest.",
                                Arrays.asList("Gold 4 (Start/Finish)", "Silver 3 (Final corner)",
                                                "General Admission (Hillside)"),
                                Arrays.asList("HEV Train to Kerepes + Shuttle/Walk",
                                                "Official Taxi is reliable"),
                                Arrays.asList("Budapest Parliament", "Széchenyi Thermal Bath",
                                                "Ruin Bars (Szimpla Kert)"),
                                Arrays.asList("Langos (Fried dough)", "Goulash soup"),
                                "HUF (Hungarian Forint)",
                                "CEST (GMT+2)",
                                1986,
                                70));

                // Belgium
                guides.add(createGuide(
                                "spa",
                                "Circuit de Spa-Francorchamps",
                                "Belgium",
                                "The longest and arguably greatest track. Unpredictable weather is part of the charm.",
                                Arrays.asList("Gold 1 (Pit start)", "Gold 3 (Eau Rouge/Raidillon)",
                                                "Silver 2 (Fan zone nearby)"),
                                Arrays.asList("Shuttle buses from major cities (Liège, Brussels)",
                                                "Driving (expect traffic)"),
                                Arrays.asList("The old circuit layout", "Spa town thermal baths",
                                                "Malmedy Cathedral"),
                                Arrays.asList("Belgian Frites with Mayo", "Waffles"),
                                "EUR (Euro)",
                                "CEST (GMT+2)",
                                1950,
                                44));

                // Netherlands
                guides.add(createGuide(
                                "zandvoort",
                                "Circuit Zandvoort",
                                "Netherlands",
                                "A seaside party. Banked corners and a sea of orange.",
                                Arrays.asList("Tarzanbocht (Turn 1)", "Arena (Sector 2 party zone)",
                                                "Main Straight"),
                                Arrays.asList("Train to Zandvoort aan Zee (Track is walking distance)",
                                                "Bicycles (The Dutch way)"),
                                Arrays.asList("Zandvoort Beach", "Amsterdam (25 mins by train)", "Haarlem"),
                                Arrays.asList("Haring (Raw herring)", "Stroopwafel"),
                                "EUR (Euro)",
                                "CEST (GMT+2)",
                                1952,
                                72));

                // Monza
                guides.add(createGuide(
                                "monza",
                                "Autodromo Nazionale Monza",
                                "Italy",
                                "The Temple of Speed. Pure passion from the Tifosi.",
                                Arrays.asList("Prima Variante (Turn 1 chaos)", "Ascari Chicane",
                                                "Parabolica (Speed)"),
                                Arrays.asList("Train to Monza Station + Black Line Shuttle",
                                                "Train to Biassono-Lesmo (Back entrance)"),
                                Arrays.asList("Monza Park & Royal Villa", "Milan Duomo (Short train ride)",
                                                "Lake Como (Day trip)"),
                                Arrays.asList("Panzerotti", "Authentic Espresso"),
                                "EUR (Euro)",
                                "CEST (GMT+2)",
                                1950,
                                53));

                // Baku
                guides.add(createGuide(
                                "baku",
                                "Baku City Circuit",
                                "Azerbaijan",
                                "The mix of old city walls and ultra-high speeds makes this unique.",
                                Arrays.asList("Absheron (Turn 1/Main Straight)",
                                                "Icheri Sheher (Old City Section)", "Azneft (Turn 16)"),
                                Arrays.asList("Walking (Track is in city center)", "Metro to Icherisheher"),
                                Arrays.asList("Old City (UNESCO site)", "Flame Towers", "Heydar Aliyev Center"),
                                Arrays.asList("Plov (Rice pilaf)", "Kebab"),
                                "AZN (Azerbaijani Manat)",
                                "AZT (GMT+4)",
                                2016,
                                51));

                // Singapore
                guides.add(createGuide(
                                "marina_bay",
                                "Marina Bay Street Circuit",
                                "Singapore",
                                "The original night race. Sweat, humidity, and a stunning skyline.",
                                Arrays.asList("Bay Grandstand (Scenic)", "Pit Grandstand", "Turn 1/2 (Action)"),
                                Arrays.asList("MRT (Subway) is efficient and AC-cooled",
                                                "Walk from city hotels"),
                                Arrays.asList("Gardens by the Bay", "Marina Bay Sands Skypark",
                                                "Sentosa Island"),
                                Arrays.asList("Chilli Crab", "Hawker Centre food (Maxwell)"),
                                "SGD (Singapore Dollar)",
                                "SGT (GMT+8)",
                                2008,
                                62));

                // Austin
                guides.add(createGuide(
                                "americas",
                                "Circuit of the Americas",
                                "USA",
                                "Modern classic with huge elevation changes and a festival vibe.",
                                Arrays.asList("Turn 1 (Big hill view)", "Turn 15 (Grandstand)",
                                                "Turn 12 (Hard braking)"),
                                Arrays.asList("Official Shuttles from Downtown/Expo Center",
                                                "Rideshare drop-off points"),
                                Arrays.asList("Downtown 6th Street (Music)", "South Congress",
                                                "Barton Springs Pool"),
                                Arrays.asList("Texas BBQ (Franklin's if you wait)", "Tacos"),
                                "USD (US Dollar)",
                                "CDT (GMT-5)",
                                2012,
                                56));

                // Mexico
                guides.add(createGuide(
                                "rodriguez",
                                "Autódromo Hermanos Rodríguez",
                                "Mexico",
                                "High altitude and a stadium section that feels like a concert.",
                                Arrays.asList("Foro Sol (Stadium Section - Incredible atmosphere)",
                                                "Turn 1 (Action)", "Main Straight"),
                                Arrays.asList("Metro (Ciudad Deportiva station) is best",
                                                "Uber (can be stuck in traffic)"),
                                Arrays.asList("Zocalo", "Teotihuacan Pyramids", "Chapultepec Park"),
                                Arrays.asList("Tacos al Pastor", "Churros"),
                                "MXN (Mexican Peso)",
                                "CST (GMT-6)",
                                1963,
                                71));

                // Brazil
                guides.add(createGuide(
                                "interlagos",
                                "Autódromo José Carlos Pace",
                                "Brazil",
                                "Old school, anti-clockwise, and always delivers drama weather-wise.",
                                Arrays.asList("Grandstand A (Banking)", "Senna S (B/M)",
                                                "Grandstand R (Start/Finish)"),
                                Arrays.asList("Train to Autódromo Station (Line 9) + Walk",
                                                "Special Express Bus"),
                                Arrays.asList("Ibirapuera Park", "Paulista Avenue",
                                                "Batman Alley (Street Art)"),
                                Arrays.asList("Feijoada", "Pão de Queijo"),
                                "BRL (Brazilian Real)",
                                "BRT (GMT-3)",
                                1973,
                                71));

                // Las Vegas
                guides.add(createGuide(
                                "las_vegas",
                                "Las Vegas Strip Circuit",
                                "USA",
                                "Racing down the famous Strip at night. Neon lights and pure entertainment.",
                                Arrays.asList("Sphere Zone (Turn 5-9)", "East Harmon Zone (Start/Finish)",
                                                "West Harmon Zone"),
                                Arrays.asList("Walk from Strip hotels", "Monorail to nearest stop",
                                                "Rideshare to designated zones"),
                                Arrays.asList("The Sphere", "Bellagio Fountains",
                                                "High Roller Observation Wheel"),
                                Arrays.asList("Buffets", "Fine Dining by celebrity chefs"),
                                "USD (US Dollar)",
                                "PST (GMT-8)",
                                2023,
                                50));

                // Qatar
                guides.add(createGuide(
                                "losail",
                                "Losail International Circuit",
                                "Qatar",
                                "Fast, flowing night race originally built for bikes.",
                                Arrays.asList("Main Grandstand", "North Grandstand", "Turn 1"),
                                Arrays.asList("Metro to Lusail QNB + Shuttle Bus", "Uber/Taxi"),
                                Arrays.asList("Souq Waqif", "The Pearl Qatar", "Museum of Islamic Art"),
                                Arrays.asList("Machboos", "Arabic Coffee"),
                                "QAR (Qatari Riyal)",
                                "AST (GMT+3)",
                                2021,
                                57));

                // Abu Dhabi
                guides.add(createGuide(
                                "yas_marina",
                                "Yas Marina Circuit",
                                "UAE",
                                "The season finale. Twilight racing, yachts, and fireworks.",
                                Arrays.asList("West Stand (Turn 6 hairpin)", "Marina Stand", "Main Grandstand"),
                                Arrays.asList("Shuttle bus from Abu Dhabi/Dubai", "Taxi/Careem"),
                                Arrays.asList("Ferrari World", "Yas Waterworld", "Sheikh Zayed Grand Mosque"),
                                Arrays.asList("Dates", "Lebanese Grill"),
                                "AED (UAE Dirham)",
                                "GST (GMT+4)",
                                2009,
                                58));

                // China
                guides.add(createGuide(
                                "shanghai",
                                "Shanghai International Circuit",
                                "China",
                                "Massive facility designed by Tilke with a never-ending Turn 1.",
                                Arrays.asList("Main Grandstand (Access to view most of track)",
                                                "Grandstand H (Back straight)", "Grass Banks"),
                                Arrays.asList("Metro Line 11 to Shanghai Circuit Station", "Taxi"),
                                Arrays.asList("The Bund", "Yu Garden", "Oriental Pearl Tower"),
                                Arrays.asList("Xiao Long Bao (Soup Dumplings)", "Peking Duck"),
                                "CNY (Chinese Yuan)",
                                "CST (GMT+8)",
                                2004,
                                56));

                // Imola
                guides.add(createGuide(
                                "imola",
                                "Autodromo Enzo e Dino Ferrari",
                                "Italy",
                                "Historic, old-school, and nestled in a beautiful park.",
                                Arrays.asList("Rivazza (Final corners)", "Tosa (Hairpin)", "Acque Minerali"),
                                Arrays.asList("Train to Imola Station + 20min Walk",
                                                "Car (Parking is difficult)"),
                                Arrays.asList("Senna Memorial in the park", "Rocca Sforzesca (Castle)",
                                                "Ferrari Museum in nearby Maranello"),
                                Arrays.asList("Piadina Romagnola", "Tagliatelle al Ragù"),
                                "EUR (Euro)",
                                "CEST (GMT+2)",
                                1980,
                                63));

                for (CircuitGuide guide : guides) {
                        Optional<CircuitGuide> existing = repository.findByCircuitId(guide.getCircuitId());
                        if (existing.isPresent()) {
                                CircuitGuide toUpdate = existing.get();
                                toUpdate.setCircuitName(guide.getCircuitName());
                                toUpdate.setCountry(guide.getCountry());
                                toUpdate.setSummary(guide.getSummary());
                                toUpdate.setBestGrandstands(guide.getBestGrandstands());
                                toUpdate.setTransportTips(guide.getTransportTips());
                                toUpdate.setLocalAttractions(guide.getLocalAttractions());
                                toUpdate.setHiddenGems(guide.getHiddenGems());
                                toUpdate.setCurrency(guide.getCurrency());
                                toUpdate.setTimezone(guide.getTimezone());
                                toUpdate.setFirstGrandPrix(guide.getFirstGrandPrix());
                                toUpdate.setNumberOfLaps(guide.getNumberOfLaps());
                                repository.save(toUpdate);
                        } else {
                                repository.save(guide);
                        }
                }
                System.out.println("Upserted " + guides.size() + " circuit guides.");
        }

        @org.springframework.cache.annotation.Cacheable("circuitGuides")
        public CircuitGuide getGuideByCircuitId(String circuitId) {
                // Fallback for missing guides to prevent frontend errors
                return repository.findByCircuitId(circuitId).orElseGet(() -> {
                        CircuitGuide empty = new CircuitGuide();
                        empty.setCircuitId(circuitId);
                        empty.setCircuitName("Unknown Circuit");
                        empty.setSummary("Travel guide coming soon for this circuit.");
                        empty.setBestGrandstands(new ArrayList<>());
                        empty.setTransportTips(new ArrayList<>());
                        empty.setLocalAttractions(new ArrayList<>());
                        empty.setHiddenGems(new ArrayList<>());
                        empty.setCurrency("-");
                        empty.setTimezone("-");
                        empty.setFirstGrandPrix(0);
                        empty.setNumberOfLaps(0);
                        return empty;
                });
        }

        // Helper to create objects cleaner
        private CircuitGuide createGuide(String id, String name, String country, String summary,
                        List<String> stands, List<String> transport,
                        List<String> attractions, List<String> gems,
                        String currency, String timezone,
                        Integer firstGrandPrix, Integer numberOfLaps) {
                CircuitGuide g = new CircuitGuide();
                g.setCircuitId(id);
                g.setCircuitName(name);
                g.setCountry(country);
                g.setSummary(summary);
                g.setBestGrandstands(stands);
                g.setTransportTips(transport);
                g.setLocalAttractions(attractions);
                g.setHiddenGems(gems);
                g.setCurrency(currency);
                g.setTimezone(timezone);
                g.setFirstGrandPrix(firstGrandPrix);
                g.setNumberOfLaps(numberOfLaps);
                return g;
        }
}
