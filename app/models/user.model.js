module.exports = mongoose => {
    const User = mongoose.model(
        "user",
        mongoose.Schema({
            user_name: String,
            password: String,
            user_type: String,
            name: String,
            surname: String,
            photo: String
        }, { timestamps: true })
    );
    return User;
};