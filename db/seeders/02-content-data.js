'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Contents', [
      {
        title: 'Tentang Pengcab Taekwondo Bogor',
        slug: 'tentang-kami',
        content: '<p>Pengcab Taekwondo Bogor adalah organisasi yang membawahi seluruh kegiatan Taekwondo di wilayah Bogor, baik Kota maupun Kabupaten. Pengcab Taekwondo Bogor berada di bawah naungan Pengprov Taekwondo Jawa Barat dan PBTI (Pengurus Besar Taekwondo Indonesia).</p><p>Pengcab Taekwondo Bogor bertanggung jawab untuk mengembangkan dan memajukan olahraga Taekwondo di wilayah Bogor melalui berbagai program pembinaan, pelatihan, dan kejuaraan.</p>',
        type: 'about',
        status: 'published',
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Visi & Misi Pengcab Taekwondo Bogor',
        slug: 'visi-misi',
        content: '<h3>Visi</h3><p>Menjadi organisasi Taekwondo yang unggul, profesional, dan berprestasi di tingkat nasional maupun internasional dengan mengedepankan nilai-nilai sportivitas, kedisiplinan, dan karakter yang kuat.</p><h3>Misi</h3><ul><li>Menyelenggarakan pembinaan dan pelatihan Taekwondo yang berkualitas.</li><li>Mengembangkan sistem pembinaan atlet yang berkelanjutan.</li><li>Memfasilitasi kegiatan Taekwondo di seluruh wilayah Bogor.</li><li>Meningkatkan kualitas pelatih dan wasit Taekwondo.</li><li>Membangun karakter dan mental juara bagi seluruh praktisi Taekwondo.</li></ul>',
        type: 'vision-mission',
        status: 'published',
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Hubungi Kami',
        slug: 'hubungi-kami',
        content: '<p>Anda dapat menghubungi kami melalui:</p><p><strong>Alamat:</strong> Jl. Pajajaran No. 123, Kota Bogor, Jawa Barat 16143</p><p><strong>Telepon:</strong> +62 251 8374XXX</p><p><strong>Email:</strong> info@taekwondobogor.org</p><p><strong>Jam Operasional:</strong></p><ul><li>Senin - Jumat: 08.00 - 16.00</li><li>Sabtu: 09.00 - 13.00</li><li>Minggu: Tutup</li></ul>',
        type: 'contact',
        status: 'published',
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Contents', {
      slug: ['tentang-kami', 'visi-misi', 'hubungi-kami']
    }, {});
  }
}; 