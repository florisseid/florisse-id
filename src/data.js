export const colors = {
  peach: '#f8b1d2',     // Rose (Primary)
  softPink: '#fbbaec',
  softBlue: '#b7d7f7',
  lavender: '#dadafb',
  cream: '#fff2d2',
  white: '#ffffff',
  dark: '#1e293b',
  slate: '#64748b',
  lightGray: '#f8fafc'
};

export const WA_NUMBER = "6289692820887";
export const getWaLink = (message) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

export const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/florisse.id?igsh=MWhyOGNpd2NvcDBwdA==' },
  { name: 'WhatsApp', href: `https://wa.me/${WA_NUMBER}` },
  { name: 'Email', href: 'mailto:florisse.id@gmail.com' }
];

export const products = [
  {
    id: 1,
    name: 'Flower Bag Soft Pink',
    category: 'Flower Box',
    price: 'Rp 150.000',
    image: '2.jpeg',
    variants: [

    ],
    bestSeller: true,
    desc: 'Dirancang untuk menyampaikan perasaan dengan cara yang paling lembut. Warna pink pastel melambangkan kasih sayang dan ketulusan, sementara susunan bunganya menghadirkan kesan hangat dan romantis. Cocok untuk kamu yang ingin memberikan hadiah penuh makna.',
    specs: ['Rangkaian bunga premium', 'Pita Hologram', 'Kartu ucapan (bisa custom tulis nama)'],
    bonus: ['FREE Packaging', 'Kartu ucapan', 'Pita lucu'],
    material: ['Artificial Flower Premium', 'Tahan lama & Tidak layu']
  },
  {
    id: 2,
    name: 'Bucket Bunga Soft Pink Estetik',
    category: 'Buket',
    price: 'Rp 70.000',
    image: 'Bucket Bunga Soft Pink Estetik 1.jpg',
    variants: [
      'Bucket Bunga Soft Pink Estetik 1.jpg',
      'Bucket Bunga Soft Pink Estetik 2.jpg'
    ],
    bestSeller: false,
    desc: 'Rangkaian bunga bernuansa soft pink yang lembut dan manis, dikemas dalam bucket estetik dengan sentuhan elegan. Cocok untuk hadiah ulang tahun, anniversary, wisuda, atau sekadar memberi kejutan spesial untuk orang tersayang.  ✨ Manis, feminin, dan penuh kesan hangat. ',
    specs: ['Rangkaian bunga elegan', 'Pita Hologram', 'Kartu Ucapan'],
    bonus: ['FREE Packaging', 'Kartu ucapan', 'Pita lucu'],
    material: ['Artificial Flower Premium', 'Tahan lama & Tidak layu']
  },
  {
    id: 3,
    name: 'Flower Bag Purple',
    category: 'Flower Box',
    price: 'Rp 50.000',
    image: 'Flower Bag Purple.jpg',
    variants: [

    ],
    bestSeller: false,
    desc: 'Rangkaian bunga dominan putih dengan sentuhan anggrek yang anggun dalam premium flower bag bernuansa soft lilac. Tampil bersih, elegan, dan timeless sempurna untuk hadiah di momen spesial yang berkesan.  ✨ Pure, classy, and graceful. ',
    specs: ['Rangkaian bunga elegan', 'Pita Hologram', 'Kartu ucapan'],
    bonus: ['FREE Packaging', 'Kartu ucapan', 'Pita lucu'],
    material: ['Artificial Flower Premium', 'Tahan lama & Tidak layu']
  },
  {
    id: 4,
    name: 'Single Bouqet',
    category: 'Buket',
    price: 'Rp 35.000',
    image: '13.jpeg',
    variants: [
      '13.jpeg',
      '1.jpeg',
    ],
    bestSeller: true,
    desc: 'Satu tangkai tulip dan mawar lembut yang dikemas dalam wrapping transparan dengan cone dan pita cantik. Tampil simpel, manis, dan elegan dalam satu genggaman.  Cocok untuk hadiah kecil yang berkesan wisuda, birthday, anniversary, atau sekadar tanda perhatian spesial.  ✨ Simple. Sweet. Meaningful.',
    specs: ['1 Tangkai Artificial Premium', 'Wrapping Transparan', 'Pita Elegan'],
    bonus: ['FREE Packaging', 'Kartu ucapan', 'Pita lucu'],
    material: ['Artificial Flower Premium', 'Tahan lama & Tidak layu']
  },
  {
    id: 5,
    name: 'Elegant Round Bouquet',
    category: 'Buket',
    price: 'Rp 25.000',
    image: 'Putih.jpg',
    variants: [
      'Putih.jpg',
      'pink.jpg',
      'ungu.jpg',
      'merah.jpg'
    ],
    bestSeller: false,
    desc: 'Rangkaian satu bunga utama yang tampil sederhana namun penuh makna. Dibungkus dengan wrapping transparan dan sentuhan pita lembut, koleksi ini menghadirkan kesan minimalis, manis, dan elegan dalam satu genggaman.  Cocok untuk hadiah kecil yang tetap berkesan wisuda, anniversary, birthday, atau sekadar tanda perhatian spesial.',
    specs: ['1 Bunga utama premium', 'Wrapping transparan', 'Pita satin elegan'],
    bonus: ['FREE Packaging', 'Kartu ucapan', 'Pita lucu'],
    material: ['Artificial Flower Premium', 'Tahan lama & Tidak layu']
  },
  {
    id: 6,
    name: 'Single Flower Gerbera',
    category: 'Buket',
    price: 'Rp 20.000',
    image: 'bunga4.jpg',
    variants: [
      'bunga4.jpg',
      '9.jpeg',
    ],
    bestSeller: true,
    desc: 'Satu tangkai bunga gerbera yang cerah dan penuh makna, dikemas dalam wrapping simpel nan elegan. Warna merah dan kuning hangatnya melambangkan kebahagiaan, semangat, dan harapan baik.  Cocok untuk hadiah wisuda, ulang tahun, atau sekadar menyampaikan rasa bangga dan dukungan untuk orang tersayang.  ✨ Bright. Warm. Full of joy.',
    specs: ['1 Gerbera Artificial Flower Premium', 'Wrapping Elegan', 'Pita Cantik'],
    bonus: ['FREE Packaging', 'Kartu ucapan', 'Pita lucu'],
    material: ['Artificial Flower Premium', 'Tahan lama & Tidak layu']
  },
  {
    id: 7,
    name: 'Sweet Ribbon Hampers x Emina Jelly Stain',
    category: ['Collab Product', 'Hampers'],
    price: 'Rp 45.000',
    image: 'collab 1 1.jpeg',
    variants: [

    ],
    bestSeller: true,
    desc: 'Ceriakan momen spesial dengan Sweet Ribbon Hampers x Emina Jelly Stain, perpaduan manis antara toples artisan cookies berlabel Eid Mubarak dan produk lip tint ikonik Emina Jelly Stain 🎀✨. Dikemas dalam pilihan kotak tenteng berbentuk pita warna krem atau pink pastel yang menggemaskan, hampers ini adalah hadiah yang sempurna untuk mencerahkan hari orang tersayang 🍪💖.',
    specs: ['🧺 1 Signature Jar (500 ml): Default isi Chocochips Strawberry 🖼️ Wavy Pastel Frame Packaging ', '💄 Emina Glosszilla / Jelly Stain', '💿 Holographic Ribbon + Ribbon Tag', '🏷️ Hangtag'],
    bonus: ['FREE Packaging', 'Kartu ucapan', 'Pita lucu'],
    material: ['Artificial Flower Premium', 'Tahan lama & Tidak layu'],
    kukerOptions: ['Nastar / Nastar Keju', 'Putri Salju', 'Semprit', 'Palm Cheese', 'Sagu Keju']
  },
  {
    id: 8,
    name: 'Garden Party Hampers x Emina Jelly Stains',
    category: ['Collab Product', 'Hampers'],
    price: 'Rp 99.000',
    image: 'collab 3.jpeg',
    variants: [

    ],
    bestSeller: false,
    desc: 'Rayakan momen spesial dengan Garden Party Hampers x Emina Jelly Stains, hampers elegan yang memadukan pesona floral dengan sentuhan kecantikan yang segar 🌸✨. Dalam satu kotak mewah beraksen emas ini, kamu akan mendapatkan Emina Jelly Stain untuk tampilan bibir merona, artisan cookies premium, serta rangkaian bunga cantik yang melambangkan kebahagiaan 🌻💄. Pilihan kado praktis dan berkelas untuk menunjukkan perhatianmu kepada orang tersayang di hari raya maupun momen berharga lainnya 🍪💖.',
    specs: ['🧺 1 Signature Jar (500 ml): Default isi Chocochips Strawberry', '👜 Exclusive Golden Chain Bag', '🌻 Bunga matahari, lili, poppy, dan anggrek', '💄 Emina Glosszilla / Jelly Stain', '🏷️ Free Hangtag'],
    bonus: ['FREE Packaging', 'Kartu ucapan', 'Pita lucu'],
    material: ['Artificial Flower Premium', 'Tahan lama & Tidak layu'],
    kukerOptions: ['Nastar / Nastar Keju', 'Putri Salju', 'Semprit', 'Palm Cheese', 'Sagu Keju']
  },
  {
    id: 9,
    name: 'Petals Of Joy Hampers x Emina Jelly Stain',
    category: ['Collab Product', 'Hampers'],
    price: 'Rp 89.000',
    image: 'collab 2.jpeg',
    variants: [

    ],
    bestSeller: false,
    desc: 'Berikan sentuhan kelembutan bagi orang tersayang dengan Petals Of Joy Hampers x Emina Jelly Stain, sebuah perpaduan manis antara kecantikan dan kasih sayang dalam nuansa ungu pastel yang memikat 🌸✨. Hampers eksklusif "MADE FOR LOVE" ini menghadirkan kelezatan premium snacks yang renyah 🍪 berdampingan dengan Emina Jelly Stain 💄 yang siap memberikan rona bibir segar dan sehat sepanjang hari. Dipercantik dengan rangkaian bunga poppy dan anggrek yang elegan, bingkisan ini menjadi pilihan sempurna yang simpel namun berkesan untuk hampers hari raya maupun kado spesial yang penuh keceriaan 💖 murni dari hati.',
    specs: ['🧺 1 Signature Jar (500 ml): Default isi Chocochips Strawberry', '👜 Signature “Made For Love” Basket', '🌻Bunga anggrek dan poppy', '💄 Emina Glosszilla / Jelly Stain', '🏷️ Free Hangtag'],
    bonus: ['FREE Packaging', 'Kartu ucapan', 'Pita lucu'],
    material: ['Artificial Flower Premium', 'Tahan lama & Tidak layu'],
    kukerOptions: ['Nastar / Nastar Keju', 'Putri Salju', 'Semprit', 'Palm Cheese', 'Sagu Keju']
  },
  {
    id: 10,
    name: 'Hampers Lebaran',
    category: 'Hampers',
    price: 'Rp 65.000',
    image: 'Hampers Lebaran.jpg',
    variants: [

    ],
    bestSeller: false,
    desc: 'Hampers bernuansa soft pink yang manis dan feminin, kini hadir dalam edisi spesial Lebaran. Dikemas elegan dengan sentuhan dekorasi estetik dan detail yang rapi, menjadikannya pilihan sempurna untuk berbagi kebahagiaan di hari yang fitri.  Cocok sebagai bingkisan silaturahmi untuk keluarga, sahabat, maupun rekan kerja menghadirkan kesan hangat, anggun, dan penuh makna.',
    specs: ['1 Jar Putri Salju 600ml', '1 Keranjang Premium', '1 Greeting Card', 'Hang Tag dan Pita', '1 Box Gift isi 20+ pcs Yupi Strawberry Kiss', 'Flowers'],
    bonus: ['FREE Packaging', 'Kartu ucapan', 'Pita lucu'],
    material: ['Premium bag']
  },
  {
    id: 11,
    name: 'The Flora Board Edition',
    category: 'Flower Box',
    price: 'Rp 35.000',
    image: 'board.jpg',
    variants: [

    ],
    bestSeller: false,
    desc: 'Rangkaian bunga eksklusif yang dipadukan dengan board elegan sebagai sentuhan personal. Tampil modern, estetik, dan penuh karakter cocok untuk wisuda, ulang tahun, anniversary, hingga momen spesial yang ingin dibuat lebih berkesan.  Dirancang dengan detail rapi dan komposisi warna yang harmonis, koleksi ini memberikan kesan premium sekaligus heartfelt dalam satu tampilan.  ✨ Bold. Elegant. Memorable.',
    specs: ['Mix Artificial Flower Premium', 'Board Custom dengan Finishing Elegan'],
    bonus: ['FREE Packaging', 'Kartu ucapan', 'Pita lucu'],
    material: ['Artificial Flower Premium', 'Tahan lama & Tidak layu']
  },
  {
    id: 12,
    name: 'Hampers Lebaran Large',
    category: ['Hampers'],
    price: 'Rp 150.000',
    image: 'Hampers Lebaran Large.jpg',
    variants: [

    ],
    bestSeller: false,
    desc: 'Hampers bernuansa soft pink yang manis dan feminin, kini hadir dalam edisi spesial Lebaran. Dikemas elegan dengan sentuhan dekorasi estetik dan detail yang rapi, menjadikannya pilihan sempurna untuk berbagi kebahagiaan di hari yang fitri.  Cocok sebagai bingkisan silaturahmi untuk keluarga, sahabat, maupun rekan kerja menghadirkan kesan hangat, anggun, dan penuh makna.',
    specs: ['🧺 1 Signature Jar (500 ml): Default isi Chocochips Strawberry', '👜 Exclusive Golden Chain Bag', '🌻 Bunga matahari, lili, poppy, dan anggrek', '💄 Emina Glosszilla / Jelly Stain', '🏷️ Free Hangtag'],
    bonus: ['FREE Packaging', 'Kartu ucapan', 'Pita lucu'],
    material: ['Artificial Flower Premium', 'Tahan lama & Tidak layu'],
    kukerOptions: ['Nastar / Nastar Keju', 'Putri Salju', 'Semprit', 'Palm Cheese', 'Sagu Keju']
  }
];

export const collaborations = [
  {
    id: 101, name: 'Baking Class: Scoopable Cookies 🍪', type: 'Cooking Baking Class', isComingSoon: true,
    partner: ['Your Cap', 'By Rentz', 'Benings Clinic', 'Fugo Hotel Banjarmasin'], date: '24 Mei 2026', location: 'FUGO Hotel Banjarmasin',
    fullDesc: 'Saatnya upgrade skill baking kamu lewat Scoopable Cookies Baking Class bersama YOUR CAP di FUGO Hotel Banjarmasin 💖',
    image: 'cookies collab 2.png',
    videoCover: 'cookies collab 2.png',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Example video
    gallery: [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 102, name: 'Letters to the Heart: Journaling Class (Valentine Day)💖', type: 'Journaling Class',
    partner: ['Your Cap', 'Menty', 'Emina Cosmetics', 'FamLaundryBjm', 'Fave Hotel Banjarmasin'], date: '15 Februari 2026', location: 'Fave Hotel Banjarmasin',
    fullDesc: 'Sebuah ruang aman untuk berhenti sejenak, jujur pada perasaan, dan menuangkannya lewat journaling yang dibimbing langsung oleh psikolog. Cocok untuk kamu yang ingin lebih terhubung dengan diri sendiri—tanpa drama, tanpa harus “sempurna”.',
    image: 'journaling class 1.png',
    videoCover: 'kegiatan/journaling class work.jpg',
    video: 'https://player.cloudinary.com/embed/?cloud_name=dkp2vqsm4&public_id=journaling_timee_special_Valentine_journaling_eminabanjarmasin_valentines_cyfurp',
    gallery: [
      'kegiatan/journaling class work.jpg',
      'kegiatan/journaling class work 2.jpg'
    ]
  },
  {
    id: 103, name: 'Mochi Cheesecake Class 🍰🍡🧀', type: 'Cooking Baking Class',
    partner: ['Your Cap', 'Glosa Skin', 'Seol-a Dessert House', 'Ketemu Studio', 'FUGO Hotel Banjarmasin'], date: '1 Februari 2026', location: 'Fave Hotel Banjarmasin',
    fullDesc: 'Yuk isi akhir pekanmu dengan pengalaman seru membuat Mochi Cheesecake Class! Belajar bikin mochi cheesecake sendiri, pulang bawa cake, plus gifts lainnya ✨',
    image: 'mochi.png',
    video: 'https://player.cloudinary.com/embed/?cloud_name=dkp2vqsm4&public_id=Mochi_Cheesecake_Class_wrapped_Terima_kasih_untuk_semua_yang_sudah_hadir_dan_ikut_meramaikan_cycpdi',
    gallery: ['']
  },
  {
    id: 104, name: 'Chunky Bag Class is back🙋🏻♀️', type: 'Decoration Class',
    partner: ['Your Cap', 'The Last Love', 'Ashaya', 'Make Over', 'Bamega Laundry'], date: '30 November 2025', location: 'Last Love Cosmetics, Banjarbaru',
    fullDesc: 'Waktunya bikin tas rajut super gemas dengan tanganmu sendiri 💕 Belajar langsung teknik membuat chunky bag dengan suasana santai dan menyenangkan',
    image: 'chuncky bag 1.png',
    video: 'https://player.cloudinary.com/embed/?cloud_name=dkp2vqsm4&public_id=Terima_kasih_kepada_semua_peserta_yang_telah_bergabung_di_Chunky_Bag_Class.Senang_bisa_melihat_a_qxre4w',
    gallery: ['']
  },
  {
    id: 105, name: 'Crochet Fairy Bow Class is here! 🎀', type: 'Decoration Class',
    partner: ['Your Cap', 'Brownie Handcrafted', 'Wardah', 'FUGO Hotel Banjarmasin'], date: '5 Oktober 2025', location: 'FUGO Hotel Banjarmasin',
    fullDesc: 'Pernah kepikiran bikin aksesoris rajut yang cantik & bisa dipakai sendiri? ✨ Yuk gabung di kelas ini, kita belajar bareng bikin fairy bow yang super gemes! 🧚🏻‍♀️💖',
    image: 'bow.png',
    video: 'https://player.cloudinary.com/embed/?cloud_name=dkp2vqsm4&public_id=Vibes_Fairy___%EF%B8%8F_Mood_Crochet_Thank_u_guys_for_making_our_Crochet_Fairy_Bow_Class_sooo_magical_bvvz2a',
    gallery: ['']
  },
  {
    id: 106, name: '🍰 DESSERT BOX CLASS is here! “Layer by layer, make it yours.” 💖', type: 'Cooking Baking Class',
    partner: ['Your Cap', 'Seol-a Dessert House', 'Wardah', 'Trend6forlife', 'Aeris Hotel Banjarbaru'], date: '14 September 2025', location: 'Calypso Meeting Room, Aeris Hotel BJB',
    fullDesc: 'Belajar bikin Tiramisu dan Vanilla Strawberry Dessert Box yang super yummy & estetik, bareng Your Cap dan Seol-a di Aeris Hotel Banjarbaru! ✨',
    image: 'box.png',
    video: 'https://player.cloudinary.com/embed/?cloud_name=dkp2vqsm4&public_id=We_are_delighted_to_share_the_success_of_our_Dessert_Box_Class_This_event_was_not_only_about_cr_rsdkpv',
    gallery: ['']
  },
  {
    id: 107, name: 'Chunky Bag Class - Your Cap & Ketemu Studio', type: 'Decoration Class',
    partner: ['Your Cap', 'Ketemu Studio', 'Seol-a Dessert House'], date: '3 Agustus 2025', location: 'Ketemu Studio Banjarmasin',
    fullDesc: 'Yuk ikutan Chunky Bag Class bareng Your Cap dan Ketemu Studio! Buat tas gemes dari benang jumbo dengan teknik yang super fun dan mudah dipelajari 🧶💗',
    image: 'chuncky bag 2.png',
    video: 'https://player.cloudinary.com/embed/?cloud_name=dkp2vqsm4&public_id=Thank_you_to_everyone_who_joined_our_Chunky_Bag_Class_by_Your_Cap._We_had_so_much_fun_crafting_e3rblu',
    gallery: ['']
  },
  {
    id: 108, name: 'Cake Picnic BY Your Cap', type: 'Event',
    partner: ['Your Cap', 'Haka Koffie', 'Picnic Buddy', 'Kalsel Next', 'Joy Galleria'], date: '29 Juni 2025', location: 'Haka Koffie Banjarmasin',
    fullDesc: 'Instalasi bunga interaktif dengan pencahayaan spektakuler untuk menyambut tahun baru.',
    image: 'picnic.png',
    video: 'https://player.cloudinary.com/embed/?cloud_name=dkp2vqsm4&public_id=That_s_a_wrap_for_Cake_Picnic_by_Your_Cap_Terima_kasih_untuk_semua_yang_sudah_datang_bawa_a5r7kl',
    gallery: ['']
  }
];
