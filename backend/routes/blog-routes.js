import express from 'express';
import { createBlog, deleteBlog, getAllBlogs, getBlogById, getByUserId, updateBlog } from '../controllers/blog-controller.js';

const blogRouter = express.Router();

blogRouter.get('/', getAllBlogs);
blogRouter.post('/create', createBlog);
blogRouter.put('/update/:id', updateBlog);
blogRouter.get('/:id', getBlogById);
blogRouter.delete('/:id', deleteBlog);
blogRouter.get('/user/:id', getByUserId);

export default blogRouter;

