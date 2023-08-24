
const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const nameRegexp = /^[a-zA-Z' -]+$/;
const phoneRegexp = /^[\d\s\-\(\) \+]*$/;

const contactSchema = new Schema({
    name: {
        type: String,
        match: nameRegexp,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        match: phoneRegexp,
        required: true,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
}, { versionKey: false, timestamps: true });

contactSchema.post("save", handleMongooseError);

const addSchema = Joi.object({
    name: Joi.string()
        .pattern(nameRegexp)
        .required()
        .error(new Error('Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer')),
    email: Joi.string().required(),
    phone: Joi.string()
        .pattern(phoneRegexp)
        .required()
        .error(new Error('Phone number must be digits and can contain spaces, dashes, parentheses and can start with +')),
    favorite: Joi.boolean(),
})


const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
})

const schemas = {
    addSchema,
    updateFavoriteSchema,
}

const Contact = model("contact", contactSchema);

module.exports = {
    Contact,
    schemas
}
