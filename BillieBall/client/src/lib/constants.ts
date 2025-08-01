export const TOUR_SHOWS = {
  japan: [
    {
      id: "japan-aug16",
      venue: "Saitama Super Arena",
      city: "Saitama",
      country: "Japan",
      date: "August 16, 2025"
    },
    {
      id: "japan-aug17", 
      venue: "Saitama Super Arena",
      city: "Saitama",
      country: "Japan", 
      date: "August 17, 2025"
    }
  ],
  northAmerica: [
    { city: "Miami", date: "October 15, 2025" },
    { city: "Orlando", date: "October 18, 2025" },
    { city: "Raleigh", date: "October 22, 2025" },
    { city: "Charlotte", date: "October 25, 2025" },
    { city: "Philadelphia", date: "October 28, 2025" },
    { city: "Elmont", date: "November 1, 2025" },
    { city: "New Orleans", date: "November 5, 2025" },
    { city: "Tulsa", date: "November 8, 2025" },
    { city: "Austin", date: "November 12, 2025" },
    { city: "Phoenix", date: "November 15, 2025" },
    { city: "San Francisco", date: "November 18, 2025" },
    { city: "Los Angeles", date: "November 22, 2025" },
  ]
};

export const PREDICTION_QUESTIONS = [
  {
    id: "cap",
    text: "Will Billie wear a cap?",
    points: 2,
    type: "yesNo",
    options: ["Yes", "No"]
  },
  {
    id: "shirtName",
    text: "Will the shirt have her name?", 
    points: 3,
    type: "yesNo",
    options: ["Yes", "No"]
  },
  {
    id: "shirtColor",
    text: "Shirt color?",
    points: 7,
    type: "color",
    options: ["Pink", "Red", "Green", "Black", "Blue", "Gray", "White", "Stripes"]
  },
  {
    id: "songAfterSkinny",
    text: "What song after SKINNY?",
    points: 5,
    type: "multiple",
    options: ["Male Fantasy", "TV", "Halley's Comet", "Cover Song"]
  },
  {
    id: "lamourFirstPart",
    text: "Will she sing first part of L'AMOUR DE MA VIE?",
    points: 3,
    type: "yesNo",
    options: ["Yes", "No"]
  },
  {
    id: "surpriseGuest",
    text: "Surprise guest?",
    points: 2,
    type: "yesNo", 
    options: ["Yes", "No"]
  },
  {
    id: "changeSetlist",
    text: "Will she change the setlist?",
    points: 2,
    type: "yesNo",
    options: ["Yes", "No"]
  }
];

export const QUESTION_POINTS = {
  cap: 2,
  shirtName: 3,
  shirtColor: 7,
  songAfterSkinny: 5,
  lamourFirstPart: 3,
  surpriseGuest: 2,
  changeSetlist: 2,
};
