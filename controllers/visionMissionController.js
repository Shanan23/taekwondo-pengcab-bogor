const VisionMission = require('../models/VisionMission');

const visionMissionController = {
    // Get vision and mission data
    getVisionMission: async (req, res) => {
        try {
            const vision = await VisionMission.findOne({ where: { type: 'vision' } });
            const mission = await VisionMission.findOne({ where: { type: 'mission' } });
            
            res.render('admin/vision-mission', {
                title: 'Manage Vision & Mission',
                active: 'vision-mission',
                vision: vision,
                mission: mission
            });
        } catch (error) {
            req.flash('error', 'Error fetching vision and mission data');
            res.redirect('/admin');
        }
    },

    // Update vision
    updateVision: async (req, res) => {
        try {
            const { content } = req.body;
            let vision = await VisionMission.findOne({ where: { type: 'vision' } });

            if (vision) {
                vision.content = content;
                if (req.file) {
                    vision.image = req.file.buffer;
                }
                await vision.save();
            } else {
                vision = new VisionMission({
                    type: 'vision',
                    content,
                    image: req.file ? req.file.buffer : null
                });
                await vision.save();
            }

            req.flash('success', 'Vision updated successfully');
            res.redirect('/admin/vision-mission');
        } catch (error) {
            req.flash('error', 'Error updating vision');
            res.redirect('/admin/vision-mission');
        }
    },

    // Update mission
    updateMission: async (req, res) => {
        try {
            const { content } = req.body;
            let mission = await VisionMission.findOne({ where: { type: 'mission' } });

            if (mission) {
                mission.content = content;
                if (req.file) {
                    mission.image = req.file.buffer;
                }
                await mission.save();
            } else {
                mission = new VisionMission({
                    type: 'mission',
                    content,
                    image: req.file ? req.file.buffer : null
                });
                await mission.save();
            }

            req.flash('success', 'Mission updated successfully');
            res.redirect('/admin/vision-mission');
        } catch (error) {
            req.flash('error', 'Error updating mission');
            res.redirect('/admin/vision-mission');
        }
    }
};

module.exports = visionMissionController; 