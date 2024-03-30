import Blog from "../models/Blog.js";
import mongoose from "mongoose";
import User from "../models/User.js";

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        
        if (!blogs || blogs.length === 0) {
            return res.status(404).json({ message: "No blogs found" });
        }

        return res.status(200).json({ blogs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const createBlog = async (req, res) => {
    const { title, description, image, user } = req.body;

    let existingUser;
    try {
        existingUser = await User.findById(user);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const blog = new Blog({ title, description, image, user });
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({ session });
        existingUser.blogs.push(blog);
        await existingUser.save({ session });
        await session.commitTransaction();

        return res.status(201).json({ message: "Blog created", data: blog });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const updateBlog = async (req, res) => {
    const { title, description } = req.body;
    const blogId = req.params.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({ message: "Invalid blog ID" });
        }

        let blog = await Blog.findByIdAndUpdate(blogId, { title, description });
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        return res.status(200).json({ message: "Blog updated", data: blog });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getBlogById = async (req, res) => {
    const blogId = req.params.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({ message: "Invalid blog ID" });
        }

        let blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        return res.status(200).json({ message: "Blog found", data: blog });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteBlog = async (req, res) => {
    const blogId = req.params.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({ message: "Invalid blog ID" });
        }

        let blog = await Blog.findByIdAndDelete(blogId).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        return res.status(200).json({ message: "Blog deleted", data: blog });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getByUserId =  async (req, res, next) => {
    const userId = req.params.id;
    let userBlogs;
    try {
        userBlogs = await User.findById(userId).populate('blogs');
    } catch (error) {
        console.error(error);
    }
    if(!userBlogs) {
        return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json({ message: "User found", data: userBlogs });
    
}