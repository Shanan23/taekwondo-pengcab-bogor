'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Calculate dates based on current date
    const now = new Date();
    const twoWeeksFromNow = new Date(now);
    twoWeeksFromNow.setDate(now.getDate() + 14);
    const twoWeeksAndOneDayFromNow = new Date(twoWeeksFromNow);
    twoWeeksAndOneDayFromNow.setDate(twoWeeksFromNow.getDate() + 1);
    
    const oneMonthFromNow = new Date(now);
    oneMonthFromNow.setMonth(now.getMonth() + 1);
    const oneMonthAndTwoDaysFromNow = new Date(oneMonthFromNow);
    oneMonthAndTwoDaysFromNow.setDate(oneMonthFromNow.getDate() + 2);
    
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    const fiveDaysAgo = new Date(now);
    fiveDaysAgo.setDate(now.getDate() - 5);

    return queryInterface.bulkInsert('Events', [
      {
        title: 'Kejuaraan Taekwondo Bogor Open 2024',
        slug: 'kejuaraan-taekwondo-bogor-open-2024',
        description: '<p>Kejuaraan Taekwondo Bogor Open 2024 adalah kejuaraan tahunan yang diselenggarakan oleh Pengcab Taekwondo Bogor. Kejuaraan ini terbuka untuk seluruh praktisi Taekwondo di wilayah Jawa Barat dan sekitarnya, dengan berbagai kategori mulai dari anak-anak hingga dewasa.</p><p>Kejuaraan ini akan mempertandingkan kategori kyorugi (pertarungan) dan poomsae (jurus) dengan berbagai tingkatan sabuk. Dapatkan kesempatan untuk menunjukkan kemampuan dan bersaing dengan para Taekwondoin terbaik!</p>',
        shortDescription: 'Kejuaraan tahunan Taekwondo terbuka untuk seluruh wilayah Jawa Barat dan sekitarnya.',
        location: 'GOR Pajajaran, Kota Bogor',
        startDate: twoWeeksFromNow,
        endDate: twoWeeksAndOneDayFromNow,
        registrationDeadline: new Date(twoWeeksFromNow.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week before event
        status: 'upcoming',
        isHighlighted: true,
        organizer: 'Pengcab Taekwondo Bogor',
        contact: '+6282112345678',
        eventType: 'championship',
        participants: 300,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Seminar Teknik Poomsae Tingkat Lanjut',
        slug: 'seminar-teknik-poomsae-tingkat-lanjut',
        description: '<p>Seminar Teknik Poomsae Tingkat Lanjut adalah kesempatan berharga bagi para praktisi Taekwondo sabuk hitam untuk memperdalam pemahaman dan keterampilan dalam jurus (poomsae) tingkat lanjut.</p><p>Seminar ini akan dipimpin oleh Grandmaster Kim Young-ho, pelatih internasional dari Korea Selatan yang telah berpengalaman puluhan tahun dalam pengajaran Taekwondo di seluruh dunia. Beliau akan berbagi pengetahuan mendalam tentang teknik, filosofi, dan aplikasi praktis dari poomsae tingkat lanjut.</p><p>Materi yang akan dibahas meliputi:</p><ul><li>Koryo</li><li>Keumgang</li><li>Taebaek</li><li>Pyongwon</li><li>Sipjin</li></ul><p>Seminar ini terbuka untuk pemegang sabuk hitam dan pelatih Taekwondo. Jumlah peserta terbatas, jadi segera daftarkan diri Anda!</p>',
        shortDescription: 'Seminar khusus poomsae tingkat lanjut dengan Grandmaster Kim Young-ho dari Korea Selatan.',
        location: 'Dojang Utama Pengcab Taekwondo Bogor',
        startDate: oneMonthFromNow,
        endDate: oneMonthFromNow,
        registrationDeadline: new Date(oneMonthFromNow.getTime() - 14 * 24 * 60 * 60 * 1000), // 2 weeks before event
        status: 'upcoming',
        isHighlighted: true,
        organizer: 'Pengcab Taekwondo Bogor bekerjasama dengan PBTI',
        contact: '+6282112345679',
        eventType: 'seminar',
        participants: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Ujian Kenaikan Tingkat Sabuk Berwarna',
        slug: 'ujian-kenaikan-tingkat-sabuk-berwarna-2024',
        description: '<p>Pengcab Taekwondo Bogor menyelenggarakan Ujian Kenaikan Tingkat (UKT) untuk sabuk berwarna. UKT ini terbuka untuk semua praktisi Taekwondo di bawah Pengcab Bogor, dari sabuk putih hingga sabuk merah strip hitam.</p><p>Peserta akan diuji kemampuan teknik dasar, poomsae, kyorugi (untuk tingkat tertentu), dan pemahaman teori Taekwondo sesuai dengan tingkatan masing-masing.</p><p>Seluruh peserta diwajibkan mendaftar melalui unit masing-masing dan memenuhi persyaratan minimum waktu latihan sesuai ketentuan.</p>',
        shortDescription: 'Ujian Kenaikan Tingkat untuk sabuk berwarna dari putih hingga merah strip hitam.',
        location: 'Dojang Utama Pengcab Taekwondo Bogor',
        startDate: oneWeekAgo,
        endDate: oneWeekAgo,
        status: 'completed',
        isHighlighted: false,
        organizer: 'Pengcab Taekwondo Bogor',
        contact: '+6282112345680',
        eventType: 'training',
        participants: 150,
        createdAt: new Date(oneWeekAgo.getTime() - 30 * 24 * 60 * 60 * 1000), // Created 1 month before event
        updatedAt: new Date(fiveDaysAgo)
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Events', {
      slug: [
        'kejuaraan-taekwondo-bogor-open-2024',
        'seminar-teknik-poomsae-tingkat-lanjut',
        'ujian-kenaikan-tingkat-sabuk-berwarna-2024'
      ]
    }, {});
  }
}; 