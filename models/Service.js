const mongoose = require('mongoose')

const Service = new mongoose.Schema({
    assetId: Number,

    name: String,
    parentOrganisation: String,
    description: String,
    price: String,

    category: String,

    keywords: Array,
    ageGroups: Array,
    accessibility: Array,
    suitability: Array,

    venue: String,
    area: String,
    postcode: String,
    latitude: Number,
    longitude: Number,

    daytime: Boolean,
    frequency: String,
    days: Array,

    contactName: String,
    email: String,
    phone: String,
    url: String,

    lastUpdated: Date,
    reviewDate: Date,

    reviewStatus: String,
    reviewNotes: String,
    cloNotes: String,
    reviewNumber: Number,
    assignedTo: String,

    lafArea: String,
    ccgLocality: String,

    volDbsCheck: String,
    safeguarding: String,
    healthSafety: String,
    insurance: String,

    legacyCategories: Array

})

module.exports = mongoose.model('Service', Service)