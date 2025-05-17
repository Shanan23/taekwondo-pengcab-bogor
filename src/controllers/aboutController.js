const About = require('../models/About');

const aboutController = {
    // Get about page data
    getAbout: async (req, res) => {
        try {
            const about = await About.findOne();
            res.render('admin/about', {
                title: 'Manage About Us',
                active: 'about',
                about: about
            });
        } catch (error) {
            req.flash('error', 'Error fetching about page data');
            res.redirect('/admin');
        }
    },

    // Update about page
    updateAbout: async (req, res) => {
        try {
            const { title, content } = req.body;
            let about = await About.findOne();

            if (about) {
                about.title = title;
                about.content = content;
                if (req.file) {
                    about.image = req.file.buffer;
                }
                await about.save();
            } else {
                about = new About({
                    title,
                    content,
                    image: req.file ? req.file.buffer : null
                });
                await about.save();
            }

            req.flash('success', 'About page updated successfully');
            res.redirect('/admin/about');
        } catch (error) {
            req.flash('error', 'Error updating about page');
            res.redirect('/admin/about');
        }
    }
};

module.exports = aboutController; 