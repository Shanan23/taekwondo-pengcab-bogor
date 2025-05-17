const express = require('express');
const router = express.Router();
const { Content, Organization, Event, Unit, Member } = require('../models');
const { Op } = require('sequelize');

// Home page
router.get('/', async (req, res) => {
  try {
    // Get latest events
    const latestEvents = await Event.findAll({
      where: { 
        status: { [Op.ne]: 'cancelled' } 
      },
      order: [['startDate', 'DESC']],
      limit: 3
    });

    // Get highlighted events
    const highlightedEvents = await Event.findAll({
      where: { 
        status: 'upcoming',
        isHighlighted: true,
        startDate: { [Op.gte]: new Date() }
      },
      order: [['startDate', 'ASC']],
      limit: 1
    });

    res.render('pages/index', {
      title: 'Pengcab Taekwondo Bogor - Beranda',
      active: 'home',
      latestEvents,
      highlightedEvent: highlightedEvents[0] || null
    });
  } catch (error) {
    console.error('Home page error:', error);
    res.status(500).render('partials/error', {
      title: 'Error',
      message: 'Failed to load home page',
      statusCode: 500
    });
  }
});

// About page
router.get('/about', async (req, res) => {
  try {
    const aboutContent = await Content.findOne({
      where: { type: 'about', status: 'published' }
    });

    res.render('pages/about', {
      title: 'Pengcab Taekwondo Bogor - Tentang Kami',
      active: 'about',
      content: aboutContent
    });
  } catch (error) {
    console.error('About page error:', error);
    res.status(500).render('partials/error', {
      title: 'Error',
      message: 'Failed to load about page',
      statusCode: 500
    });
  }
});

// Vision & Mission page
router.get('/vision-mission', async (req, res) => {
  try {
    const visionContent = await Content.findOne({
      where: { type: 'vision-mission', status: 'published' }
    });

    res.render('pages/vision-mission', {
      title: 'Pengcab Taekwondo Bogor - Visi & Misi',
      active: 'vision-mission',
      content: visionContent
    });
  } catch (error) {
    console.error('Vision & Mission page error:', error);
    res.status(500).render('partials/error', {
      title: 'Error',
      message: 'Failed to load vision & mission page',
      statusCode: 500
    });
  }
});

// Organization Structure page
router.get('/organization', async (req, res) => {
  try {
    const organizationMembers = await Organization.findAll({
      where: { active: true },
      order: [['order', 'ASC']]
    });

    res.render('pages/organization', {
      title: 'Pengcab Taekwondo Bogor - Struktur Pengurus',
      active: 'organization',
      members: organizationMembers
    });
  } catch (error) {
    console.error('Organization page error:', error);
    res.status(500).render('partials/error', {
      title: 'Error',
      message: 'Failed to load organization structure page',
      statusCode: 500
    });
  }
});

// Events page
router.get('/events', async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { 
        status: { [Op.ne]: 'cancelled' } 
      },
      order: [['startDate', 'DESC']]
    });

    res.render('pages/events', {
      title: 'Pengcab Taekwondo Bogor - Event & Kegiatan',
      active: 'events',
      events
    });
  } catch (error) {
    console.error('Events page error:', error);
    res.status(500).render('partials/error', {
      title: 'Error',
      message: 'Failed to load events page',
      statusCode: 500
    });
  }
});

// Event detail page
router.get('/events/:slug', async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { 
        slug: req.params.slug,
        status: { [Op.ne]: 'cancelled' }
      }
    });

    if (!event) {
      return res.status(404).render('partials/error', {
        title: 'Event Tidak Ditemukan',
        message: 'Event yang Anda cari tidak ditemukan',
        statusCode: 404
      });
    }

    // Get related events
    const relatedEvents = await Event.findAll({
      where: { 
        status: { [Op.ne]: 'cancelled' },
        id: { [Op.ne]: event.id },
        eventType: event.eventType
      },
      order: [['startDate', 'DESC']],
      limit: 3
    });

    res.render('pages/event-detail', {
      title: `Pengcab Taekwondo Bogor - ${event.title}`,
      active: 'events',
      event,
      relatedEvents
    });
  } catch (error) {
    console.error('Event detail page error:', error);
    res.status(500).render('partials/error', {
      title: 'Error',
      message: 'Failed to load event detail page',
      statusCode: 500
    });
  }
});

// Units & Members page
router.get('/units-members', async (req, res) => {
  try {
    const units = await Unit.findAll({
      where: { active: true },
      order: [['name', 'ASC']]
    });

    // Get featured members
    const featuredMembers = await Member.findAll({
      where: { 
        isFeatured: true,
        active: true 
      },
      limit: 6,
      order: [['createdAt', 'DESC']]
    });

    res.render('pages/units-members', {
      title: 'Pengcab Taekwondo Bogor - Unit & Taekwondoin',
      active: 'units-members',
      units,
      featuredMembers
    });
  } catch (error) {
    console.error('Units & Members page error:', error);
    res.status(500).render('partials/error', {
      title: 'Error',
      message: 'Failed to load units & members page',
      statusCode: 500
    });
  }
});

// Contact page
router.get('/contact', async (req, res) => {
  try {
    const contactContent = await Content.findOne({
      where: { type: 'contact', status: 'published' }
    });

    res.render('pages/contact', {
      title: 'Pengcab Taekwondo Bogor - Hubungi Kami',
      active: 'contact',
      content: contactContent
    });
  } catch (error) {
    console.error('Contact page error:', error);
    res.status(500).render('partials/error', {
      title: 'Error',
      message: 'Failed to load contact page',
      statusCode: 500
    });
  }
});

module.exports = router; 