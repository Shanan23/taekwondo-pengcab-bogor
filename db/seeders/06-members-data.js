'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get the IDs of the units we created
    const units = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Units";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    // Map unit names to their IDs
    const unitMap = {};
    units.forEach(unit => {
      unitMap[unit.name] = unit.id;
    });

    // Create members with the unit IDs
    return queryInterface.bulkInsert('Members', [
      {
        memberId: 'TKD-001',
        name: 'Ahmad Rizki',
        gender: 'male',
        dateOfBirth: '1999-05-12',
        address: 'Jl. Pajajaran No. 45, Kota Bogor',
        phone: '+6282345678901',
        email: 'ahmad.rizki@example.com',
        beltRank: 'black',
        danLevel: 1,
        joinDate: '2018-05-12',
        lastPromotion: '2022-12-10',
        certifications: JSON.stringify([
          {
            title: 'Dan Certificate',
            number: 'DN-12345',
            issueDate: '2022-12-10',
            issuedBy: 'PBTI'
          }
        ]),
        achievements: JSON.stringify([
          {
            title: 'Juara 1 Kyorugi',
            event: 'Kejuaraan Provinsi Jawa Barat',
            date: '2021-09-15',
            category: 'Senior Male -68kg'
          },
          {
            title: 'Juara 2 Poomsae',
            event: 'Kejuaraan Nasional',
            date: '2022-06-20',
            category: 'Individual Male'
          }
        ]),
        unitId: unitMap['Unit Taekwondo Kota Bogor'],
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        memberId: 'TKD-002',
        name: 'Siti Nurhaliza',
        gender: 'female',
        dateOfBirth: '2005-01-15',
        address: 'Jl. Babakan Raya No. 12, Dramaga',
        phone: '+6282345678902',
        email: 'siti.nurhaliza@example.com',
        beltRank: 'red',
        joinDate: '2020-01-15',
        lastPromotion: '2023-07-22',
        achievements: JSON.stringify([
          {
            title: 'Juara 3 Kyorugi',
            event: 'Kejuaraan Kabupaten Bogor',
            date: '2022-08-05',
            category: 'Junior Female -49kg'
          }
        ]),
        unitId: unitMap['Unit Taekwondo Dramaga'],
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        memberId: 'TKD-003',
        name: 'Budi Santoso',
        gender: 'male',
        dateOfBirth: '2002-08-23',
        address: 'Jl. Raya Cibinong No. 56, Cibinong',
        phone: '+6282345678903',
        email: 'budi.santoso@example.com',
        beltRank: 'blue',
        joinDate: '2019-08-23',
        lastPromotion: '2023-02-11',
        unitId: unitMap['Unit Taekwondo Cibinong'],
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Members', {
      memberId: ['TKD-001', 'TKD-002', 'TKD-003']
    }, {});
  }
};