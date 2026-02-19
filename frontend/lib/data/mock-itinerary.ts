// Mock data for Jamaah Itinerary

export interface ItineraryActivity {
  time: string
  title: string
  description: string
  location?: string
  note?: string
}

export interface ItineraryDay {
  day: number
  date: string
  title: string
  activities: ItineraryActivity[]
}

export interface PackageItinerary {
  packageName: string
  duration: string
  departureDate: string
  returnDate: string
  hotelMakkah: {
    name: string
    distance: string
    facilities: string[]
    contact: string
  }
  hotelMadinah: {
    name: string
    distance: string
    facilities: string[]
    contact: string
  }
  airline: {
    name: string
    outboundFlight: string
    returnFlight: string
  }
  days: ItineraryDay[]
  importantDates: {
    medicalCheck: string
    manasik: string
    departure: string
  }
}

export const mockItinerary: PackageItinerary = {
  packageName: 'Umroh Reguler 9 Hari',
  duration: '9 Hari 7 Malam',
  departureDate: '2025-03-15',
  returnDate: '2025-03-23',
  hotelMakkah: {
    name: 'Grand Zam Zam Hotel',
    distance: '500 meter dari Masjidil Haram',
    facilities: ['WiFi Gratis', 'AC', 'TV', 'Buffet Breakfast', 'Laundry'],
    contact: '+966 12 234 5678',
  },
  hotelMadinah: {
    name: 'Anwar Al Madinah Movenpick',
    distance: '300 meter dari Masjid Nabawi',
    facilities: ['WiFi Gratis', 'AC', 'TV', 'Buffet Breakfast', 'Laundry', 'Gym'],
    contact: '+966 14 567 8901',
  },
  airline: {
    name: 'Saudi Arabian Airlines',
    outboundFlight: 'SV 823',
    returnFlight: 'SV 824',
  },
  days: [
    {
      day: 1,
      date: '2025-03-15',
      title: 'Jakarta - Jeddah - Makkah',
      activities: [
        {
          time: '08:00',
          title: 'Kumpul di Bandara Soekarno-Hatta',
          description: 'Kumpul di Terminal 3 Gate D',
          location: 'Bandara Soekarno-Hatta Terminal 3',
          note: 'Pastikan paspor, boarding pass, dan dokumen perjalanan sudah siap',
        },
        {
          time: '11:00',
          title: 'Penerbangan Jakarta - Jeddah',
          description: 'Saudi Arabian Airlines SV 823',
          location: 'Pesawat',
        },
        {
          time: '17:00',
          title: 'Tiba di Jeddah',
          description: 'Proses imigrasi dan pengambilan bagasi',
          location: 'King Abdulaziz International Airport',
          note: 'Waktu setempat (WIB +4 jam)',
        },
        {
          time: '19:00',
          title: 'Perjalanan Jeddah - Makkah',
          description: 'Perjalanan darat menuju Makkah (±2 jam)',
          location: 'Bus',
        },
        {
          time: '22:00',
          title: 'Check-in Hotel',
          description: 'Check-in di Grand Zam Zam Hotel',
          location: 'Grand Zam Zam Hotel, Makkah',
          note: 'Istirahat dan persiapan ibadah',
        },
      ],
    },
    {
      day: 2,
      date: '2025-03-16',
      title: 'Umroh & Tawaf',
      activities: [
        {
          time: '04:00',
          title: 'Persiapan Umroh',
          description: 'Mandi, wudhu, dan niat umroh dari hotel',
          location: 'Hotel',
          note: 'Pastikan sudah mengenakan pakaian ihram',
        },
        {
          time: '05:00',
          title: 'Tawaf Umroh',
          description: 'Tawaf 7 putaran mengelilingi Kabah',
          location: 'Masjidil Haram',
        },
        {
          time: '07:00',
          title: "Sa'i",
          description: "Sa'i 7 kali antara Safa dan Marwah",
          location: 'Masjidil Haram',
        },
        {
          time: '09:00',
          title: 'Tahallul',
          description: 'Gunting rambut dan selesai umroh',
          location: 'Masjidil Haram',
        },
        {
          time: '10:00',
          title: 'Istirahat & Sarapan',
          description: 'Kembali ke hotel untuk istirahat',
          location: 'Hotel',
        },
        {
          time: '14:00',
          title: 'Tawaf Sunnah',
          description: 'Tawaf sunnah di waktu luang',
          location: 'Masjidil Haram',
        },
        {
          time: '20:00',
          title: 'Istirahat',
          description: 'Waktu bebas dan istirahat',
          location: 'Hotel',
        },
      ],
    },
    {
      day: 3,
      date: '2025-03-17',
      title: 'Ziarah Makkah',
      activities: [
        {
          time: '08:00',
          title: 'Gua Hira',
          description: 'Ziarah ke Gua Hira (tempat turunnya wahyu pertama)',
          location: 'Jabal Nur',
          note: 'Perjalanan cukup menanjak, siapkan stamina',
        },
        {
          time: '11:00',
          title: 'Gua Tsur',
          description: 'Ziarah ke Gua Tsur (tempat Nabi bersembunyi saat hijrah)',
          location: 'Jabal Tsur',
        },
        {
          time: '14:00',
          title: 'Masjid Jin',
          description: 'Ziarah dan sholat di Masjid Jin',
          location: 'Masjid Jin',
        },
        {
          time: '16:00',
          title: 'Museum Makkah',
          description: 'Kunjungan ke Museum Sejarah Makkah',
          location: 'Makkah Museum',
        },
        {
          time: '19:00',
          title: 'Sholat Maghrib & Isya',
          description: 'Sholat berjamaah di Masjidil Haram',
          location: 'Masjidil Haram',
        },
        {
          time: '21:00',
          title: 'Kembali ke Hotel',
          description: 'Istirahat di hotel',
          location: 'Hotel',
        },
      ],
    },
    {
      day: 4,
      date: '2025-03-18',
      title: 'Makkah - Madinah',
      activities: [
        {
          time: '07:00',
          title: 'Sarapan & Check-out',
          description: 'Persiapan perjalanan ke Madinah',
          location: 'Hotel',
        },
        {
          time: '09:00',
          title: 'Perjalanan Makkah - Madinah',
          description: 'Perjalanan darat menuju Madinah (±5-6 jam)',
          location: 'Bus',
          note: 'Akan ada istirahat di rest area',
        },
        {
          time: '15:00',
          title: 'Tiba di Madinah',
          description: 'Check-in hotel di Madinah',
          location: 'Anwar Al Madinah Movenpick',
        },
        {
          time: '17:00',
          title: 'Sholat Ashar di Masjid Nabawi',
          description: 'Sholat berjamaah pertama di Masjid Nabawi',
          location: 'Masjid Nabawi',
          note: 'Moment yang sangat berkesan',
        },
        {
          time: '19:00',
          title: 'Sholat Maghrib & Isya',
          description: 'Sholat berjamaah di Masjid Nabawi',
          location: 'Masjid Nabawi',
        },
        {
          time: '21:00',
          title: 'Istirahat',
          description: 'Kembali ke hotel untuk istirahat',
          location: 'Hotel',
        },
      ],
    },
    {
      day: 5,
      date: '2025-03-19',
      title: 'Ibadah di Masjid Nabawi',
      activities: [
        {
          time: '04:00',
          title: 'Sholat Subuh',
          description: 'Sholat Subuh berjamaah di Masjid Nabawi',
          location: 'Masjid Nabawi',
        },
        {
          time: '06:00',
          title: 'Ziarah Raudhah',
          description: 'Sholat sunnah di Raudhah (taman surga)',
          location: 'Masjid Nabawi',
          note: 'Kesempatan terbatas, ikuti instruksi pembimbing',
        },
        {
          time: '08:00',
          title: 'Ziarah Makam Nabi',
          description: 'Mengucap salam kepada Rasulullah SAW',
          location: 'Masjid Nabawi',
        },
        {
          time: '10:00',
          title: 'Istirahat & Sarapan',
          description: 'Kembali ke hotel',
          location: 'Hotel',
        },
        {
          time: '14:00',
          title: 'Waktu Bebas',
          description: 'Ibadah mandiri atau istirahat',
          location: 'Masjid Nabawi / Hotel',
        },
        {
          time: '19:00',
          title: 'Sholat Maghrib & Isya',
          description: 'Sholat berjamaah di Masjid Nabawi',
          location: 'Masjid Nabawi',
        },
      ],
    },
    {
      day: 6,
      date: '2025-03-20',
      title: 'Ziarah Madinah',
      activities: [
        {
          time: '08:00',
          title: 'Masjid Quba',
          description: 'Ziarah dan sholat di Masjid Quba (masjid pertama dalam Islam)',
          location: 'Masjid Quba',
        },
        {
          time: '10:00',
          title: 'Kebun Kurma',
          description: 'Kunjungan ke kebun kurma Madinah',
          location: 'Kebun Kurma',
        },
        {
          time: '12:00',
          title: 'Jabal Uhud',
          description: 'Ziarah ke Jabal Uhud (tempat perang Uhud)',
          location: 'Jabal Uhud',
        },
        {
          time: '14:00',
          title: 'Makam Syuhada Uhud',
          description: 'Ziarah ke makam para syuhada',
          location: 'Uhud',
        },
        {
          time: '16:00',
          title: 'Masjid Qiblatain',
          description: 'Ziarah ke Masjid Qiblatain (tempat perubahan arah kiblat)',
          location: 'Masjid Qiblatain',
        },
        {
          time: '19:00',
          title: 'Sholat Maghrib & Isya',
          description: 'Sholat berjamaah di Masjid Nabawi',
          location: 'Masjid Nabawi',
        },
      ],
    },
    {
      day: 7,
      date: '2025-03-21',
      title: 'Madinah - Makkah',
      activities: [
        {
          time: '07:00',
          title: 'Sarapan & Check-out',
          description: 'Persiapan kembali ke Makkah',
          location: 'Hotel',
        },
        {
          time: '09:00',
          title: 'Perjalanan Madinah - Makkah',
          description: 'Perjalanan darat kembali ke Makkah',
          location: 'Bus',
        },
        {
          time: '15:00',
          title: 'Tiba di Makkah',
          description: 'Check-in hotel di Makkah',
          location: 'Grand Zam Zam Hotel',
        },
        {
          time: '17:00',
          title: 'Tawaf Qudum',
          description: 'Tawaf kedatangan kembali ke Makkah',
          location: 'Masjidil Haram',
        },
        {
          time: '19:00',
          title: 'Sholat Maghrib & Isya',
          description: 'Sholat berjamaah di Masjidil Haram',
          location: 'Masjidil Haram',
        },
        {
          time: '21:00',
          title: 'Istirahat',
          description: 'Kembali ke hotel',
          location: 'Hotel',
        },
      ],
    },
    {
      day: 8,
      date: '2025-03-22',
      title: 'Ibadah Bebas di Makkah',
      activities: [
        {
          time: '04:00',
          title: 'Sholat Subuh',
          description: 'Sholat Subuh berjamaah di Masjidil Haram',
          location: 'Masjidil Haram',
        },
        {
          time: '06:00',
          title: 'Tawaf Sunnah',
          description: 'Tawaf dan ibadah mandiri',
          location: 'Masjidil Haram',
        },
        {
          time: '09:00',
          title: 'Istirahat & Sarapan',
          description: 'Kembali ke hotel',
          location: 'Hotel',
        },
        {
          time: '14:00',
          title: 'Waktu Bebas',
          description: 'Ibadah mandiri, shopping oleh-oleh, atau istirahat',
          location: 'Masjidil Haram / Hotel / Pasar',
          note: 'Waktu terakhir untuk shopping',
        },
        {
          time: '19:00',
          title: 'Sholat Maghrib & Isya',
          description: 'Sholat berjamaah di Masjidil Haram',
          location: 'Masjidil Haram',
        },
        {
          time: '21:00',
          title: 'Persiapan Kepulangan',
          description: 'Packing dan persiapan check-out',
          location: 'Hotel',
        },
      ],
    },
    {
      day: 9,
      date: '2025-03-23',
      title: 'Makkah - Jeddah - Jakarta',
      activities: [
        {
          time: '03:00',
          title: 'Tawaf Wada',
          description: 'Tawaf perpisahan sebelum meninggalkan Makkah',
          location: 'Masjidil Haram',
          note: 'Tawaf terakhir sebelum pulang',
        },
        {
          time: '05:00',
          title: 'Check-out Hotel',
          description: 'Persiapan perjalanan ke Bandara Jeddah',
          location: 'Hotel',
        },
        {
          time: '06:00',
          title: 'Perjalanan Makkah - Jeddah',
          description: 'Perjalanan darat ke Bandara Jeddah',
          location: 'Bus',
        },
        {
          time: '09:00',
          title: 'Tiba di Bandara Jeddah',
          description: 'Check-in dan proses keberangkatan',
          location: 'King Abdulaziz International Airport',
          note: 'Datang 3 jam sebelum penerbangan',
        },
        {
          time: '12:00',
          title: 'Penerbangan Jeddah - Jakarta',
          description: 'Saudi Arabian Airlines SV 824',
          location: 'Pesawat',
        },
        {
          time: '01:00',
          title: 'Tiba di Jakarta',
          description: 'Tiba di Bandara Soekarno-Hatta',
          location: 'Bandara Soekarno-Hatta',
          note: 'Keesokan harinya (24 Maret 2025)',
        },
      ],
    },
  ],
  importantDates: {
    medicalCheck: '2025-03-01',
    manasik: '2025-03-08',
    departure: '2025-03-15',
  },
}
