const Settings = require('../models/Settings');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Get settings page
exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        
        res.render('admin/settings', {
            title: 'Settings',
            active: 'settings',
            settings: settings
        });
    } catch (error) {
        req.flash('error', 'Error fetching settings');
        res.redirect('/admin');
    }
};

// Update general settings
exports.updateGeneralSettings = async (req, res) => {
    try {
        const { siteName, siteDescription, contactEmail, contactPhone } = req.body;
        let settings = await Settings.findOne();

        if (settings) {
            settings.siteName = siteName;
            settings.siteDescription = siteDescription;
            settings.contactEmail = contactEmail;
            settings.contactPhone = contactPhone;
            await settings.save();
        } else {
            settings = new Settings({
                siteName,
                siteDescription,
                contactEmail,
                contactPhone
            });
            await settings.save();
        }

        req.flash('success', 'General settings updated successfully');
        res.redirect('/admin/settings');
    } catch (error) {
        req.flash('error', 'Error updating general settings');
        res.redirect('/admin/settings');
    }
};

// Update social media settings
exports.updateSocialSettings = async (req, res) => {
    try {
        const { facebook, instagram, twitter, youtube } = req.body;
        let settings = await Settings.findOne();

        if (settings) {
            settings.socialMedia = {
                facebook,
                instagram,
                twitter,
                youtube
            };
            await settings.save();
        } else {
            settings = new Settings({
                socialMedia: {
                    facebook,
                    instagram,
                    twitter,
                    youtube
                }
            });
            await settings.save();
        }

        req.flash('success', 'Social media settings updated successfully');
        res.redirect('/admin/settings');
    } catch (error) {
        req.flash('error', 'Error updating social media settings');
        res.redirect('/admin/settings');
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            req.flash('error', 'New passwords do not match');
            return res.redirect('/admin/settings');
        }

        // Get current user
        const user = await User.findByPk(req.user.id);

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            req.flash('error', 'Current password is incorrect');
            return res.redirect('/admin/settings');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        user.password = hashedPassword;
        await user.save();

        req.flash('success', 'Password changed successfully');
        res.redirect('/admin/settings');
    } catch (error) {
        req.flash('error', 'Error changing password');
        res.redirect('/admin/settings');
    }
}; 