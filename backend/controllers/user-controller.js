import User from "../models/User.js";
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword, blogs: [] });
        await newUser.save();

        return res.status(201).json({ newUser }); 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const loginUser = async(req, res, next) => {
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email });
        if(!existingUser) {
            res.status(404).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compareSync(password, existingUser.password);
        if(!validPassword) {
            res.status(401).json({ message: "Invalid password" });
        }
        res.status(200).json({ message: `Login Successful`, data: existingUser });

    } catch (error) {
        res.status(500).json({ message: error.message, status: error.status, error: error});
    }
    return res.status(200).json({ existingUser });
}

export const queryUser = async(req, res, next) => {
    const { email } = req.body;
    let user;
    try {
        user = await User.findOne({ email });
        if(!user) {
            res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: `User found`, data: user });

    } catch (error) {
        res.status(500).json({ message: error.message, status: error.status, error: error});
    }   
    return res.status(200).json({ user });
}



