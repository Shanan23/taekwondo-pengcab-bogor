'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Organizations', [
      {
        name: 'Budi Santoso',
        position: 'Ketua',
        department: 'Pengurus Harian',
        bio: 'Sabeum Budi Santoso adalah pelatih senior Taekwondo dengan pengalaman lebih dari 20 tahun dalam mengembangkan atlet-atlet berprestasi.',
        email: 'budi@taekwondobogor.org',
        phone: '+62812345678',
        socialMedia: JSON.stringify({
          instagram: '@budisantoso',
          facebook: 'BudiSantosoTKD'
        }),
        order: 1,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Siti Rahayu',
        position: 'Sekretaris',
        department: 'Pengurus Harian',
        bio: 'Sabeum Siti Rahayu telah berkecimpung dalam dunia Taekwondo sejak usia dini dan kini fokus pada pengembangan organisasi Taekwondo di Bogor.',
        email: 'siti@taekwondobogor.org',
        phone: '+62823456789',
        socialMedia: JSON.stringify({
          instagram: '@sitirahayu',
          facebook: 'SitiRahayuTKD'
        }),
        order: 2,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Ahmad Rizki',
        position: 'Bendahara',
        department: 'Pengurus Harian',
        bio: 'Ahmad Rizki adalah praktisi Taekwondo dengan background manajemen keuangan yang kuat. Ia bertanggung jawab atas seluruh pengelolaan keuangan organisasi.',
        email: 'ahmad@taekwondobogor.org',
        phone: '+62834567890',
        socialMedia: JSON.stringify({
          instagram: '@ahmadrizki',
          facebook: 'AhmadRizkiTKD'
        }),
        order: 3,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Citra Dewi',
        position: 'Ketua Bidang',
        department: 'Bidang Prestasi',
        bio: 'Citra Dewi adalah mantan atlet nasional yang kini fokus pada pembinaan atlet-atlet muda berbakat di Bogor.',
        email: 'citra@taekwondobogor.org',
        phone: '+62845678901',
        socialMedia: JSON.stringify({
          instagram: '@citradewi',
          facebook: 'CitraDewiTKD'
        }),
        order: 4,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Deni Kurniawan',
        position: 'Ketua Bidang',
        department: 'Bidang Perwasitan',
        bio: 'Deni Kurniawan adalah wasit internasional yang telah memimpin pertandingan di berbagai kejuaraan Asia dan Dunia.',
        email: 'deni@taekwondobogor.org',
        phone: '+62856789012',
        socialMedia: JSON.stringify({
          instagram: '@denikurniawan',
          facebook: 'DeniKurniawanTKD'
        }),
        order: 5,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Organizations', {}, {});
  }
}; 