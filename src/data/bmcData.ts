import { BMCBlockData, BMCBlockKey, LevelConfig, QuestionData } from '../types/game';

export const LEARNING_OBJECTIVES = {
  mataPelajaran: 'Produk Kreatif dan Kewirausahaan (PKK)',
  jenjang: 'SMK / MAK Kelas XI (Fase F - Kurikulum Merdeka)',
  elemen: 'Perencanaan Usaha & Model Bisnis',
  capaianPembelajaran: 'Pada akhir Fase F, peserta didik mampu menyusun rencana usaha rintisan (startup/teaching factory) dengan mengidentifikasi peluang usaha berbasis kreativitas dan inovasi, menyusun model bisnis kanvas (Business Model Canvas - 9 Elemen), menganalisis kelayakan usaha, serta merancang strategi pemasaran dan perhitungan biaya.',
  alurTujuanPembelajaran: [
    'TP 1 (Level 1): Menganalisis target pasar potensial (Customer Segments), merumuskan keunggulan produk bernilai tinggi (Value Propositions), dan menentukan saluran distribusi terintegrasi (Channels).',
    'TP 2 (Level 2): Merancang strategi loyalitas pelanggan (Customer Relationships), mengorganisasikan kegiatan operasional teaching factory (Key Activities), dan memetakan aset strategis sekolah (Key Resources).',
    'TP 3 (Level 3): Membangun kemitraan strategis dengan DUDI (Key Partnerships), menyusun struktur biaya produksi/HPP (Cost Structure), serta merancang diversifikasi aliran pendapatan usaha (Revenue Streams).'
  ],
  softSkills: [
    { name: 'Pemecahan Masalah (Problem Solving)', desc: 'Menganalisis studi kasus nyata tantangan wirausaha siswa SMK dan menemukan solusi terobosan inovatif.' },
    { name: 'Pengambilan Keputusan (Decision Making)', desc: 'Memilih strategi pasar dan alokasi sumber daya dengan mempertimbangkan risiko usaha riil.' },
    { name: 'Manajemen Waktu (Time Management)', desc: 'Menyelesaikan target tahapan bisnis sebelum batas waktu berakhir dan menjaga ketepatan waktu pengiriman.' },
    { name: 'Kemitraan & Negosiasi', desc: 'Membangun sinergi saling menguntungkan dengan Dunia Usaha & Dunia Industri (DUDI).' }
  ]
};

export const LEVEL_CONFIGS: Record<1 | 2 | 3, LevelConfig> = {
  1: {
    levelNumber: 1,
    title: 'Level 1: Fondasi & Validasi Ide',
    subtitle: 'Gerbang Sekolah SMK & Taman Eksplorasi Inovasi',
    missionGoal: 'Validasi Masalah Konsumen & Ciptakan Solusi Nilai Unggul',
    themeColor: '#3B82F6',
    timeLimit: 180,
    blocks: ['customer_segments', 'value_propositions', 'channels'],
    finishZ: -75,
    skyColor: 0x7DD3FC,
    groundColor: 0x34782A,
    monsterSpeed: 2.2
  },
  2: {
    levelNumber: 2,
    title: 'Level 2: Operasional & Relasi TeFa',
    subtitle: 'Kawasan Bengkel & Teaching Factory (TeFa) SMK',
    missionGoal: 'Organisasi Operasional Produksi & Bangun Loyalitas Pelanggan',
    themeColor: '#F59E0B',
    timeLimit: 160,
    blocks: ['customer_relationships', 'key_activities', 'key_resources'],
    finishZ: -75,
    skyColor: 0xFDE68A,
    groundColor: 0x64748B,
    monsterSpeed: 2.8
  },
  3: {
    levelNumber: 3,
    title: 'Level 3: Skalabilitas & Arus Finansial',
    subtitle: 'Sentra Inkubasi Startup Unicorn & Distrik Finansial',
    missionGoal: 'Kemitraan Industri DUDI, Kalkulasi HPP, & Skala Omzet',
    themeColor: '#8B5CF6',
    timeLimit: 150,
    blocks: ['key_partnerships', 'cost_structure', 'revenue_streams'],
    finishZ: -75,
    skyColor: 0xC084FC,
    groundColor: 0x1E293B,
    monsterSpeed: 3.4
  }
};

export const BMC_BLOCKS: Record<BMCBlockKey, BMCBlockData> = {
  customer_segments: {
    id: 'customer_segments',
    order: 1,
    level: 1,
    title: 'Customer Segments',
    subtitle: 'Segmentasi Konsumen',
    iconName: 'Users',
    color: '#3B82F6',
    description: 'Menentukan kelompok orang atau organisasi yang menjadi sasaran utama produk/jasa yang ingin kita selesaikan masalahnya.',
    smkExample: 'SMK RPL: Pemilik warung kelontong & UMKM kuliner di sekitar sekolah yang belum memiliki pembukuan kasir digital.',
    keyQuestion: 'Untuk siapa kita menciptakan nilai? Siapa pelanggan terpenting kita?'
  },
  value_propositions: {
    id: 'value_propositions',
    order: 2,
    level: 1,
    title: 'Value Propositions',
    subtitle: 'Proposisi Nilai & Solusi',
    iconName: 'Sparkles',
    color: '#8B5CF6',
    description: 'Paket produk atau layanan yang menciptakan nilai, keunikan inovasi, dan menyelesaikan masalah nyata bagi segmen pelanggan.',
    smkExample: 'SMK Boga: Keripik pisang vacuum frying higienis rendah minyak, bumbu rempah alami tanpa MSG, berlabel halal & kemasan kedap udara.',
    keyQuestion: 'Nilai apa yang kita berikan ke konsumen? Masalah pelanggan mana yang kita bantu selesaikan?'
  },
  channels: {
    id: 'channels',
    order: 3,
    level: 1,
    title: 'Channels',
    subtitle: 'Saluran Distribusi & Komunikasi',
    iconName: 'Truck',
    color: '#06B6D4',
    description: 'Bagaimana cara produk atau proposisi nilai kita bisa sampai, diketahui, dibeli, dan dikirimkan kepada konsumen.',
    smkExample: 'SMK DKV: Tokopedia, etalase mini di lobi sekolah (Teaching Factory), dan promosi konten video pendek TikTok & Instagram.',
    keyQuestion: 'Melalui saluran mana pelanggan ingin dijangkau? Bagaimana saluran terintegrasi secara efisien?'
  },
  customer_relationships: {
    id: 'customer_relationships',
    order: 4,
    level: 2,
    title: 'Customer Relationships',
    subtitle: 'Hubungan dengan Pelanggan',
    iconName: 'HeartHandshake',
    color: '#EC4899',
    description: 'Jenis hubungan yang dibangun dan dijaga dengan masing-masing segmen pelanggan untuk mendapatkan, mempertahankan, dan menumbuhkan pelanggan.',
    smkExample: 'SMK Otomotif: Layanan garansi servis berkala, pengingat jadwal ganti oli via WhatsApp, dan poin loyalty diskon servis berikutnya.',
    keyQuestion: 'Hubungan seperti apa yang diharapkan pelanggan? Bagaimana cara kita mempertahankan loyalitas mereka?'
  },
  key_activities: {
    id: 'key_activities',
    order: 5,
    level: 2,
    title: 'Key Activities',
    subtitle: 'Aktivitas Kunci Operasional',
    iconName: 'Activity',
    color: '#F59E0B',
    description: 'Tindakan atau kegiatan operasional terpenting yang wajib dilakukan agar model bisnis dapat bekerja dan menghasilkan nilai.',
    smkExample: 'SMK Busana: Riset tren mode, pembuatan pola baju presisi, penjahitan standar butik, kontrol kualitas (QC), dan foto katalog studio.',
    keyQuestion: 'Aktivitas penting apa yang dibutuhkan untuk memproduksi dan mengantarkan proposisi nilai kita?'
  },
  key_resources: {
    id: 'key_resources',
    order: 6,
    level: 2,
    title: 'Key Resources',
    subtitle: 'Sumber Daya Kunci',
    iconName: 'Layers',
    color: '#E11D48',
    description: 'Aset-aset vital yang dibutuhkan agar bisnis berjalan, mencakup aset fisik (mesin bengkel), intelektual (paten/resep), SDM terampil, dan finansial.',
    smkExample: 'SMK Mesin: Mesin bubut CNC di bengkel sekolah, software CAD/CAM berlisensi, dan tim teknisi siswa bersertifikat BNSP.',
    keyQuestion: 'Aset dan sumber daya fisik, intelektual, maupun manusia apa yang paling vital bagi usaha kita?'
  },
  key_partnerships: {
    id: 'key_partnerships',
    order: 7,
    level: 3,
    title: 'Key Partnerships',
    subtitle: 'Kemitraan Kunci (DUDI)',
    iconName: 'Handshake',
    color: '#6366F1',
    description: 'Jaringan mitra dan pemasok eksternal yang membantu bisnis beroperasi secara optimal, hemat biaya, dan meminimalkan risiko usaha.',
    smkExample: 'SMK Agribisnis: Kerjasama dengan asosiasi petani lokal untuk pasokan bibit unggul, ekspedisi logistik berpendingin, dan supermarket modern.',
    keyQuestion: 'Siapa mitra dan pemasok kunci kita? Sumber daya atau aktivitas apa yang didukung oleh mitra?'
  },
  cost_structure: {
    id: 'cost_structure',
    order: 8,
    level: 3,
    title: 'Cost Structure',
    subtitle: 'Struktur Biaya Operasional',
    iconName: 'Receipt',
    color: '#64748B',
    description: 'Semua biaya yang dikeluarkan untuk mengoperasikan model bisnis, mencakup biaya tetap (sewa/alat) dan biaya variabel (bahan baku/listrik per unit).',
    smkExample: 'SMK Sablon: Biaya Tetap (Mesin hot press, screen cetak) & Biaya Variabel (Kaos polos combed, tinta plastisol, kemasan plastik per pcs).',
    keyQuestion: 'Biaya mana yang paling signifikan dalam model bisnis kita? Berapa HPP dan titik impas (BEP) produk?'
  },
  revenue_streams: {
    id: 'revenue_streams',
    order: 9,
    level: 3,
    title: 'Revenue Streams',
    subtitle: 'Arus Pendapatan Usaha',
    iconName: 'Coins',
    color: '#10B981',
    description: 'Aliran dana masuk atau pendapatan yang dihasilkan dari proposisi nilai yang berhasil dijual kepada konsumen.',
    smkExample: 'SMK TKJ: Biaya langganan WiFi RT/RW Net bulanan, margin penjualan router/kabel, dan jasa instalasi jaringan smart home.',
    keyQuestion: 'Untuk nilai apa pelanggan bersedia membayar? Bagaimana model aliran pemasukannya (sekali beli vs langganan)?'
  }
};

export const QUESTION_BANK: QuestionData[] = [
  // --- LEVEL 1: BLOCK 1 (Customer Segments) ---
  {
    id: 'q_cs_mc',
    type: 'multiple_choice',
    level: 1,
    blockKey: 'customer_segments',
    stationTitle: 'Pos 1: Gerbang Segmentasi Konsumen',
    scenario: 'Kelompok siswa SMK Jurusan Rekayasa Perangkat Lunak (RPL) mengembangkan aplikasi kasir mini berbasis Android. Dalam tahap awal peluncuran, modal dan tenaga mereka sangat terbatas.',
    question: 'Strategi penentuan Customer Segments yang paling efektif dan rasional untuk rintisan siswa SMK adalah...',
    options: [
      {
        id: 'opt1',
        text: 'Menargetkan Niche Market: UMKM kuliner di kantin sekolah dan ruko sekitar yang teridentifikasi kesulitan mencatat stok harian.',
        isCorrect: true,
        explanation: 'Benar! Niche Market (pasar ceruk spesifik) memudahkan siswa SMK melakukan validasi langsung, iterasi cepat, dan menyesuaikan fitur dengan masalah riil konsumen.'
      },
      {
        id: 'opt2',
        text: 'Menargetkan Mass Market: Seluruh pelaku usaha ritel, supermarket, dan restoran di seluruh Indonesia secara serentak.',
        isCorrect: false,
        explanation: 'Pengecoh! Mass market membutuhkan biaya promosi raksasa dan tim dukungan 24 jam yang belum dimiliki rintisan siswa SMK.'
      },
      {
        id: 'opt3',
        text: 'Menargetkan Diversified Market: Melayani toko bangunan sekaligus klinik dokter tanpa menyesuaikan sistem kasir.',
        isCorrect: false,
        explanation: 'Pengecoh! Kebutuhan toko bangunan dan klinik sangat berbeda jauh. Mencoba melayani semuanya tanpa kustomisasi akan gagal.'
      },
      {
        id: 'opt4',
        text: 'Menjual aplikasi hanya kepada guru pembimbing tanpa perlu mencari pengguna eksternal di pasar.',
        isCorrect: false,
        explanation: 'Kurang tepat. Guru pembimbing adalah evaluator, bukan segmen konsumen bisnis yang memberikan validasi pasar riil.'
      }
    ],
    rewardCash: 150000,
    timeBonus: 20,
    innovationTip: 'Riset pasar dimulai dari "Customer Discovery" mendengarkan keluhan langsung calon pembeli, bukan berasumsi sendiri.',
    softSkillFocus: 'Decision Making'
  },
  {
    id: 'q_cs_tf',
    type: 'true_false',
    level: 1,
    blockKey: 'customer_segments',
    stationTitle: 'Pos 1: Uji Validitas Segmentasi Pasar',
    scenario: 'Seorang wirausahawan siswa berpendapat: "Produk makanan ringan saya rasanya sangat enak, jadi target pasarnya adalah semua orang dari usia 5 tahun sampai 80 tahun."',
    question: 'Pernyataan di atas adalah prinsip penentuan Customer Segments yang benar dan terarah dalam Business Model Canvas.',
    trueFalseAnswer: false,
    trueFalseExplanation: 'Pernyataan tersebut SALAH. Menargetkan "semua orang" adalah kesalahan fatal pemula. Setiap kelompok usia memiliki daya beli, selera rasa, dan media informasi yang sangat berbeda.',
    rewardCash: 120000,
    timeBonus: 15,
    innovationTip: 'Fokus pada segmen yang memiliki "Pain" paling akut dan bersedia membayar untuk solusimu (Early Adopters).',
    softSkillFocus: 'Problem Solving'
  },

  // --- LEVEL 1: BLOCK 2 (Value Propositions) ---
  {
    id: 'q_vp_mc',
    type: 'multiple_choice',
    level: 1,
    blockKey: 'value_propositions',
    stationTitle: 'Pos 2: Menara Inovasi Proposisi Nilai',
    scenario: 'Siswa SMK Tata Boga ingin menjual keripik singkong olahan. Di pasar sudah ada puluhan penjual keripik singkong konvensional yang menjual seharga Rp 5.000.',
    question: 'Manakah rumusan Value Proposition yang benar-benar membedakan produk siswa (Competitive Advantage) dan bukan sekadar fitur biasa?',
    options: [
      {
        id: 'opt1',
        text: 'Keripik singkong dipanggang oven (non-minyak) berbalut bumbu rempah Nusantara asli, rendah kalori bersertifikasi, dengan kemasan foil beritsleting (ziplock) menjaga kerenyahan 6 bulan.',
        isCorrect: true,
        explanation: 'Sangat Tepat! Ini adalah Proposisi Nilai yang menyelesaikan masalah kesehatan (bebas minyak) dan kenyamanan konsumen (kemasan ziplock awet).'
      },
      {
        id: 'opt2',
        text: 'Menjual keripik singkong biasa tetapi menurunkan harga menjadi Rp 3.000 meskipun merugi agar pembeli datang.',
        isCorrect: false,
        explanation: 'Pengecoh! Perang harga yang merugikan (predatory pricing) bukanlah proposisi nilai berkelanjutan, melainkan bunuh diri finansial.'
      },
      {
        id: 'opt3',
        text: 'Mengganti nama keripik menjadi istilah bahasa Inggris mewah tanpa mengubah rasa, mutu, maupun kemasan plastik tipisnya.',
        isCorrect: false,
        explanation: 'Pengecoh! Nama keren tanpa peningkatan kualitas nilai riil hanyalah kosmetik dan cepat ditinggalkan konsumen.'
      },
      {
        id: 'opt4',
        text: 'Mengharuskan konsumen membeli 10 bungkus sekaligus baru dilayani pengirimannya.',
        isCorrect: false,
        explanation: 'Salah. Ini justru menambah friksi (hambatan) bagi calon pembeli baru.'
      }
    ],
    rewardCash: 180000,
    timeBonus: 20,
    innovationTip: 'Value Proposition harus menjawab pertanyaan: "Kenapa saya harus membeli dari Anda, bukan dari kompetitor?"',
    softSkillFocus: 'Problem Solving'
  },

  // --- LEVEL 1: BLOCK 3 (Channels - Ordering Mechanism) ---
  {
    id: 'q_ch_ordering',
    type: 'ordering',
    level: 1,
    blockKey: 'channels',
    stationTitle: 'Pos 3: Gerbang Saluran Distribusi (Mengurutkan Alur)',
    scenario: 'Untuk mengantarkan nilai kepada konsumen, saluran distribusi memiliki 5 fase siklus (Customer Channel Journey). Susun tahapan ini dari awal hingga akhir!',
    question: 'Urutkan 5 fase saluran distribusi (Channels) berikut dengan urutan yang logis dan benar:',
    orderingSteps: [
      { id: 'step_aware', label: '1. Kesadaran (Awareness) - Konsumen mengetahui produk via media sosial', correctIndex: 0 },
      { id: 'step_eval', label: '2. Evaluasi (Evaluation) - Konsumen membandingkan mutu & membaca review', correctIndex: 1 },
      { id: 'step_buy', label: '3. Pembelian (Purchase) - Konsumen melakukan transaksi pembayaran QRIS/kasir', correctIndex: 2 },
      { id: 'step_deliv', label: '4. Pengiriman (Delivery) - Produk dikirimkan atau diserahkan langsung', correctIndex: 3 },
      { id: 'step_after', label: '5. Purna Jual (After-Sales) - Layanan garansi & tindak lanjut kepuasan', correctIndex: 4 }
    ],
    rewardCash: 230000,
    timeBonus: 25,
    innovationTip: 'Saluran distribusi bukan hanya soal pengiriman barang, tetapi mencakup perjalanan pelanggan dari kenal hingga puas dan repeat order.',
    softSkillFocus: 'Decision Making'
  },

  // --- LEVEL 2: BLOCK 4 (Customer Relationships) ---
  {
    id: 'q_cr_mc',
    type: 'multiple_choice',
    level: 2,
    blockKey: 'customer_relationships',
    stationTitle: 'Pos 4: Paviliun Loyalitas Pelanggan',
    scenario: 'Siswa SMK Jurusan Otomotif mendirikan jasa servis panggilan "Bengkel Kilat Keliling". Pelanggan sudah memakai jasanya satu kali.',
    question: 'Tindakan yang paling mencerminkan strategi Customer Relationship jangka panjang (Customer Retention) adalah...',
    options: [
      {
        id: 'opt1',
        text: 'Menyimpan riwayat servis motor pelanggan di database, mengirimkan pengingat ganti oli otomatis via WhatsApp saat memasuki bulan ke-3, serta memberikan garansi pengerjaan 14 hari.',
        isCorrect: true,
        explanation: 'Benar! Pelayanan personal, garansi kepuasan, dan pengingat yang bermanfaat membangun ikatan loyalitas kuat sehingga pelanggan tidak berpindah ke bengkel lain.'
      },
      {
        id: 'opt2',
        text: 'Mengirimkan pesan iklan promosi setiap hari 5 kali sehari ke nomor WhatsApp pelanggan tanpa izin.',
        isCorrect: false,
        explanation: 'Pengecoh! Ini adalah spam yang mengganggu kenyamanan dan memicu pemblokiran kontak.'
      },
      {
        id: 'opt3',
        text: 'Menolak komplain jika motor pelanggan mengalami mogok kembali sehari setelah diservis.',
        isCorrect: false,
        explanation: 'Fatal! Sikap lepas tangan menghancurkan reputasi bisnis seketika.'
      },
      {
        id: 'opt4',
        text: 'Membagikan nomor telepon pelanggan ke perusahaan pinjaman online tanpa persetujuan.',
        isCorrect: false,
        explanation: 'Pelanggaran etika dan hukum perlindungan data pribadi konsumen!'
      }
    ],
    rewardCash: 190000,
    timeBonus: 20,
    innovationTip: 'Menjaga pelanggan lama yang sudah percaya jauh lebih murah daripada mengeluarkan biaya iklan untuk mencari pelanggan baru.',
    softSkillFocus: 'Problem Solving'
  },

  // --- LEVEL 2: BLOCK 5 (Key Activities) ---
  {
    id: 'q_ka_tf',
    type: 'true_false',
    level: 2,
    blockKey: 'key_activities',
    stationTitle: 'Pos 5: Aktivitas Kunci Operasional TeFa',
    scenario: 'Pada unit bisnis sablon kreatif SMK DKV, proses Quality Control (pemeriksaan kerapian cetak sablon sebelum dikirim ke pemesan) adalah aktivitas pendukung opsional yang boleh ditiadakan untuk mempercepat waktu.',
    question: 'Pernyataan bahwa Quality Control dapat ditiadakan dalam Key Activities adalah benar.',
    trueFalseAnswer: false,
    trueFalseExplanation: 'Pernyataan tersebut SALAH. Quality Control adalah Key Activity vital! Mengabaikan QC berakibat barang cacat terkirim, komplain massal, dan rusaknya kredibilitas Teaching Factory.',
    rewardCash: 140000,
    timeBonus: 15,
    innovationTip: 'Key Activities adalah jantung operasional yang menentukan apakah Value Proposition dapat terwujud secara konsisten.',
    softSkillFocus: 'Analisis Risiko'
  },

  // --- LEVEL 2: BLOCK 6 (Key Resources - Matching) ---
  {
    id: 'q_kr_matching',
    type: 'matching',
    level: 2,
    blockKey: 'key_resources',
    stationTitle: 'Pos 6: Gudang Sumber Daya Kunci (Menjodohkan)',
    scenario: 'Kelompokkan jenis-jenis Key Resources yang dimiliki oleh unit usaha SMK dengan contoh aset nyatanya!',
    question: 'Jodohkan jenis sumber daya dengan contoh konkretnya:',
    matchingPairs: [
      { id: 'kr1', left: '1. Sumber Daya Fisik', right: 'Mesin bubut CNC & bengkel lab praktik SMK' },
      { id: 'kr2', left: '2. Sumber Daya Intelektual', right: 'Formula resep rahasia bumbu & hak paten merek' },
      { id: 'kr3', left: '3. Sumber Daya Manusia', right: 'Siswa terampil bersertifikasi profesi BNSP' },
      { id: 'kr4', left: '4. Sumber Daya Finansial', right: 'Uang kas modal kerja & hibah bantuan TeFa' }
    ],
    rewardCash: 240000,
    timeBonus: 25,
    innovationTip: 'Manfaatkan fasilitas alat bengkel sekolah sebagai modal awal keunggulan komparatif siswa SMK.',
    softSkillFocus: 'Decision Making'
  },

  // --- LEVEL 3: BLOCK 7 (Key Partnerships) ---
  {
    id: 'q_kp_mc',
    type: 'multiple_choice',
    level: 3,
    blockKey: 'key_partnerships',
    stationTitle: 'Pos 7: Aliansi Kemitraan Industri (DUDI)',
    scenario: 'Kelompok siswa SMK Agribisnis mengelola kebun melon hidroponik premium. Panen menghasilkan 1 ton melon manis per bulan.',
    question: 'Strategi Key Partnerships (Kemitraan Kunci) terbaik untuk menjamin kepastian penjualan dan kelancaran rantai pasok adalah...',
    options: [
      {
        id: 'opt1',
        text: 'Membuat nota kesepahaman (MoU) kemitraan dengan jaringan supermarket buah lokal untuk kuota serap mingguan, supplier pupuk AB mix resmi untuk diskon grosir, dan ekspedisi lokal berpendingin.',
        isCorrect: true,
        explanation: 'Tepat Sekali! Kemitraan strategis (Strategic Alliances) ini mengamankan kepastian pasar (off-taker), menstabilkan harga bibit/pupuk, dan menjamin mutu buah tetap segar.'
      },
      {
        id: 'opt2',
        text: 'Menolak bekerjasama dengan toko buah karena khawatir resep pemupukan tanaman dicontek orang lain.',
        isCorrect: false,
        explanation: 'Pengecoh! Rasa curiga berlebihan membuat usaha terisolasi dan kesulitan menjual hasil panen dalam jumlah besar.'
      },
      {
        id: 'opt3',
        text: 'Membeli pupuk secara eceran di warung kelontong setiap kali tanaman kekurangan nutrisi.',
        isCorrect: false,
        explanation: 'Kurang tepat. Pembelian eceran tanpa kemitraan membuat biaya melonjak tinggi.'
      },
      {
        id: 'opt4',
        text: 'Menjual seluruh hasil panen secara kredit kepada calo tanpa surat perjanjian pembayaran yang jelas.',
        isCorrect: false,
        explanation: 'Sangat berbahaya! Risiko piutang macet yang mengancam kebangkrutan usaha.'
      }
    ],
    rewardCash: 210000,
    timeBonus: 20,
    innovationTip: 'Kemitraan yang kokoh berlandaskan prinsip saling menguntungkan (Win-Win Collaboration).',
    softSkillFocus: 'Negosiasi'
  },

  // --- LEVEL 3: BLOCK 8 (Cost Structure - Matching) ---
  {
    id: 'q_cost_matching',
    type: 'matching',
    level: 3,
    blockKey: 'cost_structure',
    stationTitle: 'Pos 8: Pos Kalkulasi Struktur Biaya (Menjodohkan)',
    scenario: 'Jodohkan klasifikasi biaya dalam perhitungan Harga Pokok Produksi (HPP) usaha kriya furnitur kayu limbah siswa SMK!',
    question: 'Jodohkan jenis biaya dengan contoh pos anggarannya:',
    matchingPairs: [
      { id: 'c1', left: '1. Biaya Tetap (Fixed Cost)', right: 'Penyusutan mesin gergaji listrik & sewa lapak' },
      { id: 'c2', left: '2. Biaya Variabel (Variable Cost)', right: 'Kayu palet limbah, pernis, dan paku per unit produk' },
      { id: 'c3', left: '3. Titik Impas (BEP)', right: 'Kondisi di mana total pendapatan = total biaya' },
      { id: 'c4', left: '4. Biaya Overhead Pabrik (BOP)', right: 'Listrik operasional bengkel & amplas habis pakai' }
    ],
    rewardCash: 250000,
    timeBonus: 25,
    innovationTip: 'Jangan menetapkan harga jual sebelum menghitung HPP (Harga Pokok Produksi) secara teliti!',
    softSkillFocus: 'Problem Solving'
  },

  // --- LEVEL 3: BLOCK 9 (Revenue Streams) ---
  {
    id: 'q_rev_tf',
    type: 'true_false',
    level: 3,
    blockKey: 'revenue_streams',
    stationTitle: 'Pos 9: Pundi Kas & Model Pendapatan',
    scenario: 'Sebuah usaha perangkat lunak smart home buatan siswa SMK Teknik Komputer Jaringan hanya mengandalkan penjualan alat sensor satu kali (one-time transaction) tanpa menawarkan biaya langganan dashboard cloud atau jasa perawatan tahunan.',
    question: 'Model bisnis tersebut sudah memaksimalkan potensi Revenue Streams yang berkelanjutan (Recurring Revenue).',
    trueFalseAnswer: false,
    trueFalseExplanation: 'Pernyataan tersebut SALAH. Hanya mengandalkan transaksi satu kali membuat arus kas fluktuatif. Menambahkan jasa perawatan berkala atau langganan aplikasi (Recurring Revenue) menciptakan pendapatan rutin yang stabil.',
    rewardCash: 230000,
    timeBonus: 20,
    innovationTip: 'Kombinasikan One-time Transaction (jual putus) dengan Subscription / Service Retention untuk arus kas jangka panjang.',
    softSkillFocus: 'Decision Making'
  }
];

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getQuestionForBlock(blockKey: BMCBlockKey): QuestionData {
  const matchingQuestions = QUESTION_BANK.filter(q => q.blockKey === blockKey);
  const selected = matchingQuestions[Math.floor(Math.random() * matchingQuestions.length)] || QUESTION_BANK[0];

  const cloned: QuestionData = JSON.parse(JSON.stringify(selected));

  if (cloned.type === 'multiple_choice' && cloned.options) {
    cloned.options = shuffleArray(cloned.options);
  } else if (cloned.type === 'ordering' && cloned.orderingSteps) {
    // Shuffle the steps so student has to put them in order!
    cloned.orderingSteps = shuffleArray(cloned.orderingSteps);
  }

  return cloned;
}

export const BMC_GLOSSARY = [
  { term: 'Business Model Canvas (BMC)', desc: 'Kerangka kerja 9 elemen strategis visual yang diciptakan oleh Alexander Osterwalder untuk merancang, menguji, dan mengembangkan model bisnis.' },
  { term: 'Customer Segments', desc: 'Kelompok orang atau organisasi berbeda yang ingin dijangkau dan dilayani oleh perusahaan.' },
  { term: 'Value Proposition', desc: 'Gabungan produk dan layanan yang menciptakan nilai bagi segmen pelanggan tertentu.' },
  { term: 'Channels', desc: 'Saluran komunikasi, distribusi, dan penjualan yang menghubungkan perusahaan dengan pelanggan.' },
  { term: 'Customer Relationships', desc: 'Tipe hubungan yang dibangun perusahaan dengan segmen pelanggan tertentu.' },
  { term: 'Revenue Streams', desc: 'Uang yang dihasilkan perusahaan dari masing-masing segmen pelanggan (aliran pemasukan).' },
  { term: 'Key Resources', desc: 'Aset terpenting yang dibutuhkan agar model bisnis dapat bekerja efektif.' },
  { term: 'Key Activities', desc: 'Aksi terpenting yang harus diambil perusahaan agar operasinya sukses.' },
  { term: 'Key Partnerships', desc: 'Jaringan pemasok dan mitra yang membuat model bisnis bekerja optimal.' },
  { term: 'Cost Structure', desc: 'Semua biaya yang dikeluarkan untuk mengoperasikan model bisnis.' },
  { term: 'Teaching Factory (TeFa)', desc: 'Model pembelajaran SMK berbasis produksi/jasa yang mengacu pada standar dan prosedur yang berlaku di industri nyata.' },
  { term: 'BEP (Break Even Point)', desc: 'Titik impas di mana total pendapatan sama persis dengan total modal/biaya yang dikeluarkan (laba = 0).' },
  { term: 'HPP (Harga Pokok Produksi)', desc: 'Akumulasi seluruh biaya langsung dan tidak langsung yang dikeluarkan dalam proses pembuatan produk/jasa.' }
];
