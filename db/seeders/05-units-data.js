'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Units', [
      {
        name: 'Unit Taekwondo Kota Bogor',
        slug: 'unit-taekwondo-kota-bogor',
        description: 'Unit Taekwondo yang berlatih di pusat kota Bogor. Fokus pada pembinaan atlet muda dan pengembangan prestasi.',
        address: 'Jl. Pajajaran No. 123, Kota Bogor',
        region: 'Kota Bogor',
        location: JSON.stringify({
          lat: -6.5971,
          lng: 106.8060
        }),
        contactPerson: 'Sabeum Budi',
        phone: '+62812345678',
        email: 'unitkotabogor@taekwondobogor.org',
        schedule: JSON.stringify({
          'Senin': ['16:00-18:00', '19:00-21:00'],
          'Rabu': ['16:00-18:00', '19:00-21:00'],
          'Jumat': ['16:00-18:00', '19:00-21:00'],
          'Sabtu': ['09:00-11:00']
        }),
        establishedDate: '2010-05-15',
        active: true,
        memberCount: 120,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Unit Taekwondo Dramaga',
        slug: 'unit-taekwondo-dramaga',
        description: 'Unit Taekwondo yang berbasis di area Dramaga. Banyak anggota dari kalangan mahasiswa dan masyarakat sekitar kampus IPB.',
        address: 'Jl. Dramaga Raya No. 45, Kabupaten Bogor',
        region: 'Kabupaten Bogor',
        location: JSON.stringify({
          lat: -6.5501,
          lng: 106.7158
        }),
        contactPerson: 'Sabeum Andi',
        phone: '+62823456789',
        email: 'unitdramaga@taekwondobogor.org',
        schedule: JSON.stringify({
          'Selasa': ['16:00-18:00', '19:00-21:00'],
          'Kamis': ['16:00-18:00', '19:00-21:00'],
          'Sabtu': ['15:00-17:00']
        }),
        establishedDate: '2012-08-20',
        active: true,
        memberCount: 85,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Unit Taekwondo Cibinong',
        slug: 'unit-taekwondo-cibinong',
        description: 'Unit Taekwondo yang berlokasi di pusat kota Cibinong. Memiliki fasilitas latihan yang lengkap dan program khusus untuk atlet prestasi.',
        address: 'Jl. Raya Cibinong No. 78, Cibinong',
        region: 'Kabupaten Bogor',
        location: JSON.stringify({
          lat: -6.4816,
          lng: 106.8317
        }),
        contactPerson: 'Sabeum Citra',
        phone: '+62834567890',
        email: 'unitcibinong@taekwondobogor.org',
        schedule: JSON.stringify({
          'Senin': ['16:00-18:00'],
          'Rabu': ['16:00-18:00'],
          'Jumat': ['16:00-18:00'],
          'Minggu': ['09:00-11:00']
        }),
        establishedDate: '2011-03-10',
        active: true,
        memberCount: 95,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Units', {
      slug: [
        'unit-taekwondo-kota-bogor',
        'unit-taekwondo-dramaga',
        'unit-taekwondo-cibinong'
      ]
    }, {});
  }
}; 